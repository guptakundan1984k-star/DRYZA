import React, { useState } from 'react';
import { Customer, ContestEntry, QuizQuestion, WeeklyChallenge } from '../types';
import { QUIZ_QUESTIONS, WEEKLY_CHALLENGES } from '../data';
import { ChefHat, Flame, Sparkles, Send, Award, Heart, Plus, Trophy, HelpCircle, CheckCircle2, RefreshCw, Star, Upload, FileText } from 'lucide-react';

interface CommunityPanelProps {
  loggedInCustomer: Customer | null;
  onUpdateCustomerPoints: (pointsToAdd: number, reason: string) => void;
  contestEntries: ContestEntry[];
  onAddContestEntry: (entry: ContestEntry) => void;
  onVoteContestEntry: (id: string, voterEmail: string) => void;
  customers: Customer[];
  quizQuestions?: QuizQuestion[];
  onUpdateCustomerRecord?: (updates: Partial<Customer>) => void;
  onOpenLogin: () => void;
}

export default function CommunityPanel({
  loggedInCustomer,
  onUpdateCustomerPoints,
  contestEntries,
  onAddContestEntry,
  onVoteContestEntry,
  customers,
  quizQuestions = QUIZ_QUESTIONS,
  onUpdateCustomerRecord,
  onOpenLogin
}: CommunityPanelProps) {
  // Navigation inside Playground
  const [subTab, setSubTab] = useState<'recipe' | 'contest' | 'quiz'>('recipe');

  // AI Recipe Generator States
  const [userIngredients, setUserIngredients] = useState<string>('');
  const [highlightSpice, setHighlightSpice] = useState<string>('');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState<boolean>(false);
  const [recipesLogs, setRecipesLogs] = useState<string[]>([]);
  const [generatedRecipe, setGeneratedRecipe] = useState<{
    title: string;
    description: string;
    prepTime: string;
    servings: string;
    dryzaSeasonings: string[];
    ingredientsList: string[];
    steps: string[];
  } | null>(null);

  // Cooking Contest States
  const [showEntryForm, setShowEntryForm] = useState<boolean>(false);
  const [newEntryDish, setNewEntryDish] = useState<string>('');
  const [newEntryImage, setNewEntryImage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Quiz States
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizOver, setQuizOver] = useState<boolean>(false);

  // Weekly Challenge Active checklist
  const [tempAcceptedChallenges, setTempAcceptedChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem('dryza_accepted_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  // Daily Questions based on IST
  const { questions: dailyQuestions, dateStr: currentDateStr } = React.useMemo(() => {
    if (!quizQuestions || quizQuestions.length === 0) return { questions: [], dateStr: '' };
    
    const now = new Date();
    // Convert to IST (UTC + 5:30)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utcTime + istOffset);
    // Get unique day index
    const dayIndex = Math.floor(istTime.getTime() / (24 * 60 * 60 * 1000));
    const istDateStr = istTime.toISOString().split('T')[0];

    // Pick 3 questions per day using dayIndex as seed
    const qCount = Math.min(3, quizQuestions.length);
    
    // seeded shuffle
    const pseudoRandom = (seed: number) => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const shuffled = [...quizQuestions].sort((a, b) => pseudoRandom(dayIndex + a.question.length) - 0.5);
    return { questions: shuffled.slice(0, qCount), dateStr: istDateStr };
  }, [quizQuestions]);

  const handleAcceptChallenge = (challId: string) => {
    if (tempAcceptedChallenges.includes(challId)) return;
    const updated = [...tempAcceptedChallenges, challId];
    setTempAcceptedChallenges(updated);
    localStorage.setItem('dryza_accepted_challenges', JSON.stringify(updated));
  };

  const handleCompleteChallenge = (challId: string) => {
    const challenge = WEEKLY_CHALLENGES.find(c => c.id === challId);
    if (!challenge) return;

    if (confirm(`Click 'OK' to upload your Cooking Photo proof of "${challenge.title}"!`)) {
      // Mark as completed
      if (loggedInCustomer) {
        const completed = loggedInCustomer.completedChallenges || [];
        if (!completed.includes(challId)) {
          loggedInCustomer.completedChallenges = [...completed, challId];
          localStorage.setItem('dryza_logged_in_customer', JSON.stringify(loggedInCustomer));
          
          // Sync to master listing
          const savedStr = localStorage.getItem('dryza_customers');
          if (savedStr) {
            const parsed = JSON.parse(savedStr);
            const updated = parsed.map((c: any) => c.email === loggedInCustomer.email ? { ...c, completedChallenges: loggedInCustomer.completedChallenges } : c);
            localStorage.setItem('dryza_customers', JSON.stringify(updated));
          }
        }
      }
      alert('Congratulations! Proof accepted.');
    }
  };

  // AI Recipe Gen Smart Synthesis Logic
  const handleSynthesizeRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIngredients.trim()) return;

    setIsGeneratingRecipe(true);
    setGeneratedRecipe(null);
    setRecipesLogs([
      '🔍 Initializing Dryza AI Culinary Model v4...',
      '🌾 Parsing raw available ingredients list...',
      '🌶️ Searching active dehydrated dry-milling catalogs...',
      '🧬 Crafting volatile seasoning matrices pairing profiles...'
    ]);

    // Stagger process log visuals
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index === 1) {
        setRecipesLogs(prev => [...prev, `🔥 Simulating thermal convection dehydration rehydration curves...`]);
      } else if (index === 2) {
        setRecipesLogs(prev => [...prev, `🍳 Infusing Dryza ${highlightSpice ? highlightSpice : 'Premium Spices'} into raw compounds...`]);
      } else if (index === 3) {
        setRecipesLogs(prev => [...prev, `📃 Assembling complete structured gourmet preparation guidelines...`]);
      } else if (index === 4) {
        clearInterval(interval);
        
        // Formulate deterministic gorgeous gourmet recipe based on choices
        const ingredientArray = userIngredients.split(',').map(s => s.trim().toLowerCase());
        const selectedSpice = highlightSpice || 'Garlic Powder (Premium)';

        // Crafting title
        const primaryIng = ingredientArray[0] || 'Farm Vegetables';
        const dishTitle = `Pan-Seared Gourmet ${primaryIng.charAt(0).toUpperCase() + primaryIng.slice(1)} with Dryza ${selectedSpice.replace('Dehydrated', '')}`;
        
        const customizedRecipe = {
          title: dishTitle,
          description: `A masterfully balanced gourmet cuisine engineered specifically to pair fresh ${ingredientArray.join(' and ')} with high-pungency dry-milled seasonings.`,
          prepTime: '20 Mins',
          servings: '2-3 Servings',
          dryzaSeasonings: [selectedSpice, 'Dehydrated Tomato Powder', 'Onion Powder (Premium)'],
          ingredientsList: [
            ...ingredientArray.map(ing => `300g Fresh ${ing.charAt(0).toUpperCase() + ing.slice(1)} (cleaned & sliced)`),
            `15g Dryza ${selectedSpice} (rehydrated in 2 tbsp warm water)`,
            `10g Dryza Dehydrated Tomato Powder (for absolute savory back-umami notes)`,
            `8g Dryza Onion Powder (Premium) fine mesh`,
            `2 tbsp Cold-Pressed Olive Oil or Butter`,
            `1.5 tsp Sea Salt & coarse black pepper`,
            `Fresh spring onions or greens for garnish`
          ],
          steps: [
            `Spread the Dryza ${selectedSpice} into a warm cup containing sweet water for 5 minutes. The dry molecules will swell, generating a magnificent fresh-garden pungency.`,
            `Warm the cold-pressed olive oil in a heavy heavy-bottom skillet or commercial wok until simmering.`,
            `Pitch the processed fresh ${ingredientArray.join(', ')} into the shimmering fat. Pan-sear on maximum heat for 6-8 minutes until golden borders manifest.`,
            `Lower the convection burner heat. Empty the hydrated Dryza seasoning paste, Tomato Powder, and Onion Powder uniformly into the skillet.`,
            `Stir rapidly for 2 minutes to encapsulate all ingredients with the micro-seasoning glaze, locking in natural vegetable waters.`,
            `Adjust salinity, plate immediately, and ornament with spring greens. Serve screaming hot.`
          ]
        };

        setGeneratedRecipe(customizedRecipe);
        setIsGeneratingRecipe(false);
      }
    }, 1000);
  };

  // Drag and Drop files uploader events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewEntryImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewEntryImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Cooking entry
  const handleContestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggedInCustomer) {
      alert('Please log in representing your corporate firm prior to uploading cooking entries.');
      onOpenLogin();
      return;
    }

    if (!newEntryDish.trim()) {
      alert('Please provide a descriptive dish name!');
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600';
    const contestEntry: ContestEntry = {
      id: `inq-entry-${Date.now()}`,
      customerName: loggedInCustomer.fullName,
      customerEmail: loggedInCustomer.email,
      companyName: loggedInCustomer.companyName,
      dishName: newEntryDish,
      image: newEntryImage || defaultImg,
      votesCount: 1, // Start with self vote!
      status: 'approved', // Instant approved on client side for seamless play
      submittedAt: new Date().toISOString(),
      votedUserEmails: [loggedInCustomer.email]
    };

    onAddContestEntry(contestEntry);

    // Clean inputs
    setNewEntryDish('');
    setNewEntryImage('');
    setShowEntryForm(false);
    alert('Hurrah! Your gourmet creation has been registered.');
  };

  const handleVoteClick = (entryId: string) => {
    if (!loggedInCustomer) {
      alert('Authentication is required to vote on cook-offs.');
      onOpenLogin();
      return;
    }

    onVoteContestEntry(entryId, loggedInCustomer.email);
  };

  // Quiz submission & state advancement
  const handleOptionSelect = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || quizSubmitted) return;

    setQuizSubmitted(true);
    const question = dailyQuestions[currentQuizIndex];
    if (selectedOption === question.correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);

    if (currentQuizIndex < dailyQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizOver(true);
      // Award points
      const pointsWon = score * 50;
      if (pointsWon > 0) {
        onUpdateCustomerPoints(pointsWon, `Passed Spice Science Quiz: Score ${score}/${dailyQuestions.length}`);
      }
      
      // Update the user's completed date
      if (loggedInCustomer && onUpdateCustomerRecord) {
        onUpdateCustomerRecord({ quizCompletedAt: currentDateStr });
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setScore(0);
    setQuizOver(false);
  };

  // Leaderboard sorting
  const sortedLeaderboard = [...customers].sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="community-layout">
      {/* Upper header segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0F766E] bg-emerald-50 border border-emerald-150 px-3 py-1 rounded-full">
            Dryza Flavor Lab & Culinary Arena
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight leading-none">
            Culinary Community & AI Playground
          </h2>
          <p className="text-sm text-stone-60b max-w-2xl text-stone-500">
            Experiment with continuous rehydration recipes, vote on weekly hot-cooking contests, take quick science quizzes, and claim premium B2B prizes.
          </p>
        </div>

        {/* Community Tabs bar segment */}
        <div className="flex bg-stone-100 rounded-2xl p-1.5 border" id="playground-subtabs-nav">
          <button
            onClick={() => setSubTab('recipe')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'recipe'
                ? 'bg-emerald-850 text-white shadow-sm'
                : 'text-stone-605 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>AI Cook Studio</span>
          </button>
          
          <button
            onClick={() => setSubTab('contest')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'contest'
                ? 'bg-emerald-850 text-white shadow-sm'
                : 'text-stone-605 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Weekly Cook-Off</span>
          </button>

          <button
            onClick={() => setSubTab('quiz')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'quiz'
                ? 'bg-emerald-850 text-white shadow-sm'
                : 'text-stone-605 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quiz & Arena</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE PLAYGROUND VIEW */}

      {/* 1. AI RECIPE GENERATOR TAB */}
      {subTab === 'recipe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in" id="ai-recipe-tab-panel">
          
          {/* Left panel inputs form (col-span-4) */}
          <form onSubmit={handleSynthesizeRecipe} className="lg:col-span-4 bg-[#FAF9F5] border border-stone-200 p-6 rounded-3xl space-y-4 self-start">
            <div className="space-y-1">
              <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-800 font-extrabold">Dryza AI Assistant</span>
              <h3 className="text-lg font-bold font-sans text-stone-900">Custom Culinary Synthesis</h3>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-stone-750">Raw Ingredients at Home *</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Potato, chicken breast, fresh garlic, carrots, heavy cream..."
                className="w-full text-xs p-2.5 bg-white border border-stone-250 rounded-xl outline-none focus:border-emerald-700 font-sans leading-relaxed"
                value={userIngredients}
                onChange={(e) => setUserIngredients(e.target.value)}
              />
              <span className="text-[10px] text-stone-400 block font-normal leading-normal">Comma separate any vegetables, meats, or grains you want to use.</span>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-stone-750">Select Dryza Highlight Spice</label>
              <select
                className="w-full text-xs p-2.5 bg-white border border-stone-250 rounded-xl outline-none focus:border-emerald-700 font-mono font-bold text-emerald-900"
                value={highlightSpice}
                onChange={(e) => setHighlightSpice(e.target.value)}
              >
                <option value="">-- Let AI Choose Best Pair --</option>
                <option value="Garlic Powder (Premium)">Garlic Powder (Premium)</option>
                <option value="Garlic Granules (Coarse)">Garlic Granules (Coarse)</option>
                <option value="Onion Powder (Premium)">Onion Powder (Premium)</option>
                <option value="Dehydrated Tomato Powder">Tomato Powder (Acidic tang)</option>
                <option value="Dehydrated Green Chilli">Dehydrated Green Chilli (Heat)</option>
                <option value="Dehydrated Coriander Leaves">Dehydrated Coriander Leaves (Herb)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGeneratingRecipe || !userIngredients.trim()}
              className="w-full bg-emerald-850 hover:bg-emerald-900 text-stone-950 font-mono font-black text-xs py-3 rounded-xl transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-stone-300 disabled:cursor-not-allowed"
              id="ai-generate-recipe-submit-btn"
            >
              {isGeneratingRecipe ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4" />
                  <span>COOK UP DRYZA AI RECIPE</span>
                </>
              )}
            </button>

            <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-2xl flex gap-2.5 text-[10px] text-emerald-900 leading-normal font-sans">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <span>Experimenting with recipes via the Dryza AI Synthesis Model helps discover ultimate spice blending ratios.</span>
            </div>
          </form>

          {/* Right panel output sheet (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Generating Logs Display */}
            {isGeneratingRecipe && (
              <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 text-yellow-500 font-mono text-[11px] space-y-1.5 shadow-xl animate-fade-in">
                {recipesLogs.map((log, lIdx) => (
                  <p key={lIdx} className="leading-snug text-stone-300 flex items-center gap-2">
                    <span className="text-emerald-500">•</span>
                    <span>{log}</span>
                  </p>
                ))}
                <div className="pt-2 flex items-center gap-1 text-emerald-400 animate-pulse font-extrabold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Blending ingredients database arrays...</span>
                </div>
              </div>
            )}

            {/* Generated Recipe Sheet Card */}
            {!isGeneratingRecipe && generatedRecipe && (
              <div className="bg-white border border-stone-250/70 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 animate-fade-in font-sans pb-10" id="generated-recipe-card">
                
                {/* Header ribbon */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-4 gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 border px-2 py-0.5 rounded-full inline-block">
                      Dryza AI Culinary v4 Output
                    </span>
                    <h3 className="text-2xl font-black text-stone-950 font-display leading-tight">{generatedRecipe.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-lg">{generatedRecipe.description}</p>
                  </div>
                  
                  <div className="flex gap-2 text-[10.5px] font-mono font-bold text-stone-700 shrink-0 bg-stone-50 p-2 rounded-xl border">
                    <span>⏱️ {generatedRecipe.prepTime}</span>
                    <span className="text-stone-300">|</span>
                    <span>🍽️ {generatedRecipe.servings}</span>
                  </div>
                </div>

                {/* Split lists */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-xs">
                  
                  {/* Left Column: Ingredients (col-span-2) */}
                  <div className="md:col-span-2 space-y-3 bg-stone-50/50 p-4 rounded-2xl border">
                    <h4 className="font-black text-stone-900 tracking-tight uppercase font-mono text-[9.5px]">Required Sourcing List:</h4>
                    <ul className="space-y-2.5 font-sans leading-relaxed">
                      {generatedRecipe.ingredientsList.map((ing, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-1.5 text-[11.5px] text-stone-700">
                          <span className="text-emerald-700 font-extrabold shrink-0 mt-0.5">✓</span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Instructions (col-span-3) */}
                  <div className="md:col-span-3 space-y-3.5">
                    <h4 className="font-black text-stone-900 tracking-tight uppercase font-mono text-[9.5px]">Step-by-Step Cooking Directives:</h4>
                    <ol className="space-y-3.5 leading-relaxed font-sans">
                      {generatedRecipe.steps.map((stp, sIdx) => (
                        <li key={sIdx} className="flex gap-3 text-[12px] text-stone-655 text-stone-750">
                          <span className="w-5.5 h-5.5 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-mono font-extrabold text-[11px] shrink-0 border border-emerald-150">
                            {sIdx + 1}
                          </span>
                          <span className="pt-0.5">{stp}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                </div>

                {/* Highlight Dryza Products in recipe */}
                <div className="border-t pt-5 space-y-2">
                  <span className="font-mono text-[9px] uppercase font-bold text-stone-400">Incorporated Dryza Ingredients:</span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {generatedRecipe.dryzaSeasonings.map((ds, dsIdx) => (
                      <span key={dsIdx} className="bg-amber-100 text-amber-900 border border-amber-200/50 rounded-lg text-[10px] font-mono font-bold px-3 py-1 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                        <span>{ds}</span>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {!isGeneratingRecipe && !generatedRecipe && (
              <div className="bg-stone-50 border border-dashed rounded-3xl py-24 text-center space-y-4 shadow-inner-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-150">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5 px-4">
                  <h4 className="font-bold text-stone-900 font-display">AI Kitchen Assistant Idle</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Input your pantry ingredients on the left (e.g. potatoes, onions) and activate Dryza AI Culinary Model to assemble high-quality, professional catering guidelines instantly.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 2. WEEKLY COOKING CONTEST TAB */}
      {subTab === 'contest' && (
        <div className="space-y-8 animate-fade-in" id="contest-tab-panel">
          
          {/* Welcome Banner and entry submission CTA trigger */}
          <div className="bg-[#FAF9F5] border border-stone-200 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 text-left">
            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#B45309] bg-amber-100/60 px-3 py-1 rounded-full font-bold">
                Weekly Active Battle
              </span>
              <h3 className="text-xl font-bold font-sans text-stone-900">Dryza Spiced Hot Cook-Off</h3>
              <p className="text-xs text-stone-550 leading-relaxed max-w-xl text-stone-500">
                Create gourmet plates using at least one Dryza Ingredient, snap a photo of the completed dish, and enter to claim a <strong>Weekly Gold Medal (500 XP bonus + B2B Free sample shipment voucher)</strong>!
              </p>
            </div>

            <button
              onClick={() => {
                if (!loggedInCustomer) {
                  alert('Please sign in to your corporate representative account first.');
                  onOpenLogin();
                } else {
                  setShowEntryForm(!showEntryForm);
                }
              }}
              className="bg-emerald-850 hover:bg-emerald-900 text-white font-mono font-bold text-xs py-3 px-5 rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showEntryForm ? 'Collapse Contest Form' : 'Submit Food Photo Entry'}</span>
            </button>
          </div>

          {/* Cooking Entry uploading form overlay/section */}
          {showEntryForm && (
            <form onSubmit={handleContestSubmit} className="bg-[#FAF9F5] border-2 border-dashed border-stone-300 rounded-3xl p-6 space-y-5 animate-fade-in text-left text-xs max-w-2xl mx-auto">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-stone-905 text-sm flex items-center gap-1.5 font-sans uppercase tracking-tight">
                  <Award className="w-5 h-5 text-amber-700" /> Register Cooking Masterpiece
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-750 font-sans text-xs">Recipe / Dish Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sizzling Tandoori Garlic-Crusted Ribs"
                    className="w-full p-2.5 bg-white border border-stone-250 rounded-xl"
                    value={newEntryDish}
                    onChange={(e) => setNewEntryDish(e.target.value)}
                  />
                  <span className="text-[10px] text-stone-400 block font-normal text-stone-400">Provide an attractive name highlighting your Dryza seasonings.</span>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-750 font-sans text-xs">Cooking Image URL (Or Upload below) *</label>
                  <input
                    type="text"
                    placeholder="Paste food image URL link..."
                    className="w-full p-2.5 bg-white border border-stone-250 rounded-xl font-mono"
                    value={newEntryImage}
                    onChange={(e) => setNewEntryImage(e.target.value)}
                  />
                  <span className="text-[10px] text-stone-400 block font-normal text-stone-400">URL takes priority but local file conversion is also supported below.</span>
                </div>
              </div>

              {/* Drag and Drop File interface block */}
              <div className="space-y-1">
                <label className="block font-semibold text-stone-750 font-sans text-xs">Dish Snapshot Local File</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                    dragActive ? 'border-emerald-700 bg-emerald-50' : 'border-stone-300 hover:border-emerald-600'
                  }`}
                >
                  <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-600 mb-1 leading-normal font-sans font-medium">
                    Drag & Drop cooking dish snapshot here, or <label className="text-emerald-850 hover:underline font-bold cursor-pointer inline-block"><span>browse standard directories</span><input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} /></label>
                  </p>
                  <p className="text-[10px] text-stone-400">Accepts PNG, JPG matching select dimensions. Converted cleanly before submission.</p>

                  {newEntryImage && (
                    <div className="mt-3 bg-white p-2 border rounded-xl flex items-center justify-between gap-4 max-w-sm mx-auto">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={newEntryImage} alt="Local review upload" className="w-10 h-10 object-cover rounded-md shrink-0 border" />
                        <span className="text-[9.5px] font-mono truncate text-stone-650 font-bold">uploaded_snapshot.png</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewEntryImage('')}
                        className="text-red-600 font-bold text-[10px] hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 text-[11px] pt-2 border-t">
                <button
                  type="submit"
                  className="bg-emerald-850 hover:bg-emerald-900 text-stone-950 font-mono font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer transition-colors"
                >
                  Publish Contest Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowEntryForm(false)}
                  className="bg-stone-300 hover:bg-stone-400 text-stone-850 font-mono font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* CONTESTANTS AND HISTORIC WINNERS COLUMN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
            
            {/* Left side: Grid Gallery (col-span-8) */}
            <div className="lg:col-span-8 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-400 border-b pb-1.5 block">
                Active B2B Cook-Off Contestants:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
                {contestEntries.length === 0 ? (
                  <div className="col-span-2 text-center py-16 bg-stone-50 border rounded-2xl italic font-mono text-stone-400">
                    No active contestants loaded. Submit your photo above to start!
                  </div>
                ) : (
                  contestEntries.filter(entry => entry.status !== 'rejected').map((entry) => {
                    const isWinner = entry.status === 'winner';
                    const hasVoted = loggedInCustomer && entry.votedUserEmails?.includes(loggedInCustomer.email);
                    return (
                      <div key={entry.id} className="bg-white border border-stone-250/70 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group flex flex-col relative hover:shadow transition-all">
                        {isWinner && (
                          <div className="absolute top-3 left-3 z-10 bg-amber-600 text-white text-[9.5px] font-mono font-black uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>{entry.weeklyWinnerRank || 'Winner'}</span>
                          </div>
                        )}

                        <div className="h-44 overflow-hidden relative bg-stone-100">
                          <img
                            src={entry.image}
                            alt={entry.dishName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-stone-900 leading-snug font-sans text-sm block" title={entry.dishName}>
                              {entry.dishName}
                            </h4>
                            <span className="text-[10.5px] text-stone-500 font-sans block leading-none">
                              👤 Cooked by: <strong>{entry.customerName}</strong> {entry.companyName && `(${entry.companyName})`}
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-t pt-3 mt-1 text-xs">
                            <div className="flex items-center gap-1 font-mono text-[10.5px] font-bold text-stone-605">
                              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                              <span>{entry.votesCount} Total Votes</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleVoteClick(entry.id)}
                              className={`flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-tight py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                                hasVoted
                                  ? 'bg-rose-50 text-rose-800 border-rose-300/60'
                                  : 'bg-white text-stone-750 hover:bg-stone-50 border-stone-250'
                              }`}
                            >
                              <span>{hasVoted ? '❤ Voted' : 'Vote Dish'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right side: Historic Winners Wall of Fame (col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#FAF9F5] border border-stone-250 p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-stone-900 font-display flex items-center gap-1.5 text-sm uppercase tracking-wider border-b pb-2">
                  <Trophy className="w-4.5 h-4.5 text-amber-700" /> Wall of Spiced Champions
                </h4>

                <div className="space-y-4 text-xs font-sans">
                  
                  <div className="flex items-start gap-3 border-b pb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                      🥇
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900 text-xs">Aarav Mehta</h5>
                      <span className="text-[10px] text-stone-400 block font-mono">Mehta Catering Services</span>
                      <p className="text-[11px] text-stone-600 mt-1 italic leading-relaxed">"Garlic-Crusted Bruschetta utilizing Dryza Coarse Granules." Score: 42 Votes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b pb-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-bold text-sm shrink-0">
                      🥈
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900 text-xs">Kenji Suzuki</h5>
                      <span className="text-[10px] text-stone-400 block font-mono">NoodleWorld Co.</span>
                      <p className="text-[11px] text-stone-600 mt-1 italic leading-relaxed">"Umami Ramen Tonkotsu broth infused with Dehydrated White Onion Flakes." Score: 29 Votes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0">
                      🥉
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900 text-xs">David Vance</h5>
                      <span className="text-[10px] text-stone-400 block font-mono">Apex Seasonings</span>
                      <p className="text-[11px] text-stone-600 mt-1 italic leading-relaxed">"Dry Onion Roast coated with Tomato powder seasoning blends." Score: 24 Votes</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. QUIZ & ARENA TAB */}
      {subTab === 'quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in" id="quiz-tab-panel">
          
          {/* Left panel: Spice Quiz card (col-span-7) */}
          <div className="lg:col-span-7 bg-[#FAF9F5] border border-stone-250 p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 border px-2 py-0.5 rounded-full inline-block">
                    Interactive Flavor Assessment
                  </span>
                  <h3 className="text-xl font-bold font-sans text-stone-900">Dryza Ingredient Science Quiz</h3>
                </div>
                <span className="font-mono text-xs font-bold text-stone-400">
                  {!quizOver && `Question ${currentQuizIndex + 1} of ${dailyQuestions.length}`}
                </span>
              </div>

              {/* Check if user already completed the quiz today */}
              {loggedInCustomer?.quizCompletedAt === currentDateStr ? (
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <Trophy className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-emerald-900 font-bold font-sans">You've completed today's quiz!</h4>
                  <p className="text-emerald-800/80 text-xs font-mono">Come back tomorrow at 12:00 AM IST for new questions and to earn more XP.</p>
                </div>
              ) : dailyQuestions.length === 0 ? (
                <div className="bg-stone-50 p-6 rounded-2xl border text-center text-stone-500 font-mono text-xs">
                  No questions available right now. Please check back later!
                </div>
              ) : (
              <>
              {/* QUIZ ACTIVE VIEW */}
              {!quizOver && (
                <div className="space-y-6">
                  {/* Question block */}
                  <div className="bg-white p-4.5 rounded-2xl border">
                    <p className="text-sm font-semibold text-stone-950 font-display leading-snug">
                      {dailyQuestions[currentQuizIndex].question}
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-3 font-sans text-xs">
                    {dailyQuestions[currentQuizIndex].options.map((opt, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrect = dailyQuestions[currentQuizIndex].correctAnswerIndex === oIdx;
                      
                      let optionBg = 'bg-white border-stone-250 hover:bg-stone-50';
                      if (isSelected) optionBg = 'bg-amber-50 border-amber-500 font-semibold';
                      if (quizSubmitted) {
                        if (isCorrect) optionBg = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                        else if (isSelected) optionBg = 'bg-red-50 border-red-400 text-red-950';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleOptionSelect(oIdx)}
                          className={`w-full p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${optionBg}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <span className="text-emerald-705 text-emerald-900 font-extrabold font-sans">CORRECT ✓</span>}
                          {quizSubmitted && isSelected && !isCorrect && <span className="text-red-700 font-bold">WRONG ✗</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Verification Explanatory notes */}
                  {quizSubmitted && (
                    <div className="p-4 bg-emerald-50/50 border border-emerald-150 rounded-2xl text-[11.5px] text-[#0F766E] leading-relaxed font-sans">
                      <strong>Explanatory Rationale:</strong> {dailyQuestions[currentQuizIndex].explanation}
                    </div>
                  )}

                </div>
              )}

              {/* QUIZ COMPLETION OVERVIEW */}
              {quizOver && (
                <div className="text-center py-8 space-y-5 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-150">
                    <Trophy className="w-8 h-8 text-amber-700 animate-bounce" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-lg font-display">Science Assessment Completed!</h4>
                    <p className="text-xs text-stone-500">Your industrial ingredients specification knowledge is verified.</p>
                  </div>

                  <div className="inline-block bg-stone-900 text-amber-500 font-mono font-bold text-lg px-5 py-2.5 rounded-xl border border-stone-800 tracking-wider">
                    Your Score: {score} / {dailyQuestions.length}
                  </div>

                  {score > 0 ? (
                    <div className="max-w-xs mx-auto p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-[11px] text-emerald-805 text-emerald-900 font-medium">
                      Congratulations! You scored and permanently earned a massive B2B incentive bonus of <strong>+{score * 50} XP points</strong>!
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400">Better luck next run! Study spice processing quality to score maximum. </p>
                  )}
                </div>
              )}
              </>
              )}
            </div>

            {/* Bottom Row action controls */}
            {!quizOver && loggedInCustomer?.quizCompletedAt !== currentDateStr && dailyQuestions.length > 0 && (
              <div className="border-t pt-4 mt-6 flex justify-end gap-2 text-xs">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedOption === null}
                    onClick={handleSubmitQuizAnswer}
                    className="bg-stone-900 hover:bg-stone-950 text-stone-950 font-mono font-bold py-3 px-5 rounded-xl cursor-pointer disabled:bg-stone-300 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="bg-emerald-850 hover:bg-emerald-900 text-stone-950 font-mono font-bold py-3 px-5 rounded-xl cursor-pointer shadow"
                  >
                    {currentQuizIndex === dailyQuestions.length - 1 ? 'Complete Assessment' : 'Next Question ➜'}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right panel: Challenges Board & LEADERBOARD (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. CHALLENGES CHECKLIST ZONE */}
            <div className="bg-white border border-stone-250 p-6 rounded-3xl space-y-4">
              <h4 className="font-bold text-stone-900 font-display flex items-center gap-1.5 text-xs uppercase tracking-wider border-b pb-2">
                <Flame className="w-4.5 h-4.5 text-amber-700 animate-pulse" /> Weekly Cooking Challenges
              </h4>

              <div className="space-y-3.5 text-xs font-sans">
                {WEEKLY_CHALLENGES.map((chall) => {
                  const isAccepted = tempAcceptedChallenges.includes(chall.id);
                  const isCompleted = loggedInCustomer?.completedChallenges?.includes(chall.id);

                  let statusText = 'Accept Challenge';
                  if (isAccepted) statusText = 'Complete Challenge';
                  if (isCompleted) statusText = 'Challenge Met 🏆';

                  return (
                    <div key={chall.id} className="bg-stone-50 border p-3.5 rounded-2xl flex justify-between gap-4 border-stone-200">
                      <div className="space-y-1 text-left">
                        <span className="font-mono text-[8.5px] uppercase font-bold text-[#B45309] bg-amber-50 rounded border px-1.5 py-0.5">
                          {chall.tag}
                        </span>
                        <h5 className="font-bold text-stone-900 pt-1">{chall.title}</h5>
                        <p className="text-[10px] text-stone-500 leading-normal font-normal text-stone-500 font-medium">{chall.description}</p>
                      </div>
                      
                      <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                        <span className="font-mono font-black text-emerald-805 text-emerald-900">{chall.pointsReward} XP</span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (!loggedInCustomer) {
                              alert('Please log in representing your seasoning house first!');
                              onOpenLogin();
                            } else if (!isAccepted && !isCompleted) {
                              handleAcceptChallenge(chall.id);
                            } else if (isAccepted && !isCompleted) {
                              handleCompleteChallenge(chall.id);
                            }
                          }}
                          disabled={isCompleted}
                          className={`font-mono text-[9px] font-black uppercase tracking-tight px-2.5 py-1.5 rounded-lg border cursor-pointer select-none ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 cursor-not-allowed'
                              : isAccepted
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-white text-stone-700 border-stone-250 hover:bg-stone-100'
                          }`}
                        >
                          {statusText}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. LIVE LEADERBOARD */}
            <div className="bg-white border border-stone-250 p-6 rounded-3xl space-y-4">
              <h4 className="font-bold text-stone-900 font-display flex items-center gap-1.5 text-xs uppercase tracking-wider border-b pb-2">
                <Star className="w-4.5 h-4.5 text-amber-700 animate-pulse" /> Corporate Leaderboard
              </h4>

              <div className="overflow-hidden border rounded-xl font-sans text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b">
                      <th className="p-2 py-2.5 font-bold text-stone-505 font-mono text-[9.5px]">Rank</th>
                      <th className="p-2 py-2.5 font-bold text-stone-505 font-mono text-[9.5px]">Company / Client</th>
                      <th className="p-2 py-2.5 text-right font-bold text-stone-505 font-mono text-[9.5px]">XP Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium">
                    {sortedLeaderboard.map((cust, idx) => {
                      const rankEm = idx === 0 ? '👑 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `${idx + 1}th`;
                      const isSelf = loggedInCustomer && cust.email === loggedInCustomer.email;
                      return (
                        <tr key={cust.id} className={isSelf ? 'bg-amber-50/50 hover:bg-amber-55' : 'hover:bg-stone-50'}>
                          <td className="p-2 font-mono text-[10.5px] font-black">{rankEm}</td>
                          <td className="p-2">
                            <span className="block font-bold text-stone-900 text-xs">{cust.companyName || 'Anonymous Brand'}</span>
                            <span className="text-[9.5px] text-stone-400 block">{cust.fullName}</span>
                          </td>
                          <td className="p-2 text-right font-mono font-black text-emerald-900">{cust.points || 0} XP</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
