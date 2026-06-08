import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini on the server side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Semantic search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query, products } = req.body;
    if (!query || !products || !Array.isArray(products) || products.length === 0) {
      return res.json({ results: [] });
    }

    if (!ai) {
      // If there's no API key configured yet, do a friendly fallback regex search
      console.warn('GEMINI_API_KEY is not defined. Falling back to local semantic simulation search.');
      const term = query.toLowerCase();
      const results = products
        .map(p => {
          let score = 0;
          let explanation = '';
          if (p.name.toLowerCase().includes(term)) {
            score = 100;
            explanation = 'Direct match found in spice product catalog.';
          } else if (p.description.toLowerCase().includes(term) || (p.applications && p.applications.some((app: string) => app.toLowerCase().includes(term)))) {
            score = 80;
            explanation = `Matched details and application profile for "${query}".`;
          } else if (p.categoryLabel.toLowerCase().includes(term)) {
            score = 60;
            explanation = `Matched general category: ${p.categoryLabel}.`;
          }
          return { productId: p.id, relevanceScore: score, matchExplanation: explanation };
        })
        .filter(r => r.relevanceScore > 0)
        .sort((a,b) => b.relevanceScore - a.relevanceScore);
      return res.json({ results });
    }

    // Call Gemini API to perform semantic search
    const prompt = `You are a B2B spice & dehydration product specialist search assistant.
Analyze the user's culinary search query: "${query}"
Review this list of products (only names, categories, descriptions, applications):
${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, category: p.categoryLabel, description: p.description, applications: p.applications })))}

Find the products that match the query semantically (including synonyms, culinary uses, taste profiles, matching raw materials, spice pairing).
Assign a relevanceScore (0-100) and draft a 1-sentence matchExplanation explaining to a chef/buyer why this product matches their query.
Sort the results by score descending. Only return products that have a relevanceScore >= 40.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  relevanceScore: { type: Type.INTEGER },
                  matchExplanation: { type: Type.STRING }
                },
                required: ['productId', 'relevanceScore', 'matchExplanation']
              }
            }
          },
          required: ['results']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('AI Search Error:', error);
    res.status(500).json({ error: error.message || 'An error occurred during search matchmaking.' });
  }
});

// OTP Implementation
const OTP_API_KEY = process.env.OTP_API_KEY || '0219f339-6249-11f1-8f15-0200cd936042';

app.post('/api/otp/send', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });
  
  try {
     // Expected 2factor endpoints.
     const url = `https://2factor.in/API/V1/${OTP_API_KEY}/SMS/${phone}/AUTOGEN/OTP1`;
     const reqOtp = await fetch(url);
     const json = await reqOtp.json();
     res.json(json);
  } catch (error: any) {
     console.error('Send OTP Error:', error);
     res.status(500).json({ error: error.message || 'Failed to send OTP via SMS integration.' });
  }
});

app.post('/api/otp/verify', async (req, res) => {
  const { session_id, otp } = req.body;
  if (!session_id || !otp) return res.status(400).json({ error: 'Session ID and OTP required' });

  try {
     const url = `https://2factor.in/API/V1/${OTP_API_KEY}/SMS/VERIFY/${session_id}/${otp}`;
     const verifyReq = await fetch(url);
     const json = await verifyReq.json();
     res.json(json);
  } catch (error: any) {
     console.error('Verify OTP Error:', error);
     res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
