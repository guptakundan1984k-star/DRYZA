import React, { useState } from 'react';
import { MANUFACTURING_STEPS, CERTIFICATIONS, RECIPES, INDUSTRIES_SERVED } from '../data';
import { Recipe } from '../types';
import {
  ShieldCheck, Award, Leaf, Settings, HelpCircle, FileText, ChevronRight,
  TrendingUp, Users, MapPin, Check, Sparkles, ChefHat, Info, Scale, Plus, Minus
} from 'lucide-react';

interface PagesProps {
  currentTab: string;
  openInquiryForm: () => void;
}

export default function Pages({ currentTab, openInquiryForm }: PagesProps) {
  // Recipes tab states
  const [activeRecipeId, setActiveRecipeId] = useState<string>(RECIPES[0]?.id || '');
  const [recipeServings, setRecipeServings] = useState<number>(100);

  // Parse ingredient amounts to scale them based on standard base portions
  const scaleIngredient = (ingredient: string, baseServings: number, targetServings: number) => {
    const scaleFactor = targetServings / baseServings;
    
    // Regular expression to find numbers, e.g. "400g" or "1.5 kg" or "15g"
    const numberMatch = ingredient.match(/^([\d.]+)\s*(g|ml|kg|tsp|tbsp)?\s*(.*)$/i);
    if (numberMatch) {
      const amount = parseFloat(numberMatch[1]);
      const unit = numberMatch[2] || '';
      const rest = numberMatch[3] || '';
      const scaledAmount = (amount * scaleFactor).toFixed(scaledAmountPrecision(amount * scaleFactor));
      return `${scaledAmount}${unit ? ' ' + unit : ''} ${rest}`;
    }
    return ingredient;
  };

  const scaledAmountPrecision = (value: number) => {
    if (value % 1 === 0) return 0;
    if ((value * 10) % 1 === 0) return 1;
    return 2;
  };

  if (currentTab === 'process') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16" id="process-and-qa-view">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full">
            Engineering & Food Processing Technology
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            How We Dehydrate: Preserving Vital Aroma and Pungency
          </h2>
          <p className="text-stone-605 text-base md:text-lg">
            Through high-technology multi-stage thermal convection drying tunnels, we retain precious volatile oils and rich original flavor profiles. Complete microbiological safety in every metric ton.
          </p>
        </div>

        {/* Six Stages Steps Visual Cards */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-stone-900 font-sans text-center md:text-left border-b pb-2">
            The Dryza Six-stage Technological Flow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MANUFACTURING_STEPS.map((step) => (
              <div key={step.step} className="bg-[#FAF9F5] p-6 rounded-2xl border border-stone-200/80 space-y-4 flex flex-col justify-between hover:shadow-lg transition-transform hover:-translate-y-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-emerald-800 text-stone-105 font-mono font-bold flex items-center justify-center text-xs">
                      {step.step}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400">
                      Standard Operating Proc
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-stone-905">{step.title}</h4>
                  <p className="text-xs text-stone-600 font-medium">{step.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 mt-4 space-y-1.5 text-[11px] text-stone-700 font-mono">
                  {step.details.map((det, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-emerald-850">✔</span>
                      <span>{det}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Block */}
        <div className="bg-gradient-to-tr from-[#FAF9F5] to-emerald-50/20 rounded-3xl p-8 border border-stone-200 space-y-10" id="compliance-certificates">
          <div className="text-center md:text-left max-w-2xl space-y-2">
            <span className="font-mono text-[10px] text-amber-800 uppercase tracking-widest font-black block">
              Audited Facility Verification
            </span>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
              Global Compliance & Accredited Certifications
            </h3>
            <p className="text-xs text-stone-605 leading-relaxed">
              Our factories undergo annual multi-point validation to ensure frictionless customs entry for retail packaging and raw bulk shipments to North America, the European Union, East Asia, and GCC states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert, index) => (
              <div key={index} className="bg-white p-5 rounded-2xl border border-stone-150 space-y-3 shadow-inner-sm">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-900 text-stone-100 font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                    {cert.logoText}
                  </span>
                  <span className="text-[9.5px] font-mono text-stone-400">Valid Until: {cert.validUntil}</span>
                </div>
                <h4 className="text-sm font-bold text-stone-950 font-sans">{cert.name}</h4>
                <div className="space-y-1.5 text-xs">
                  <p className="text-[10px] font-mono text-amber-850 font-bold uppercase tracking-tighter">
                    Accreditation: {cert.certifiedFor}
                  </p>
                  <p className="text-stone-600 font-sans text-[11px] leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  if (currentTab === 'industries') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16" id="b2b-industries-served-view">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-100/60 px-3 py-1 rounded-full">
            Wholesale, Private Label & Custom Splicing
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Comprehensive Dehydrated Solutions for B2B Clients
          </h2>
          <p className="text-stone-605 text-base md:text-lg">
            Whether you operate a corporate instant-ramen factory requiring strict pesticide compliance, a seasoning retail brand requesting custom private labeling jars, or a hotel chain needing bulk garlic flakes — we’ve got you covered.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDUSTRIES_SERVED.map((ind, index) => (
            <div key={index} className="bg-[#FAF9F5] p-6 rounded-2xl border border-stone-200/85 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-stone-105 flex items-center justify-center font-bold font-sans">
                  {index+1}
                </div>
                <h4 className="text-base font-bold text-stone-950">{ind.title}</h4>
                <p className="text-xs text-stone-605 leading-relaxed">{ind.description}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs font-mono flex justify-between items-center text-stone-800">
                <span>Analytical Target Match:</span>
                <span className="font-bold text-emerald-850">{ind.matchRatio}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Private Label & Custom Milling Feature Block */}
        <div className="bg-stone-900 text-[#FAF9F5] rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="private-label-section">
          
          <div className="lg:col-span-7 space-y-4">
            <span className="bg-amber-600 text-white font-mono text-[9.5px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
              Private Labeling Services
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Turnkey Private Label Scent & Packaging Splicing
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed max-w-xl font-sans">
              Provide your packaging parameters and graphic logos, and our packaging lines will bottle, bag, or sachet Dryza Spices under your private brand mark. Complete shelf-ready solutions with barcodes, high-protection barrier sealing, and nutritional tables compiled.
            </p>

            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono text-stone-200">
              <li className="flex items-center gap-1.5">
                <span className="text-amber-500">✔</span>
                <span>Glass / PET Spice Jars</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-500">✔</span>
                <span>Zip pouches (Kraft / Metallized)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-500">✔</span>
                <span>Flexible noodle sachet tubes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-amber-500">✔</span>
                <span>Custom mesh milling ranges</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={openInquiryForm}
                className="bg-white hover:bg-amber-50 text-stone-900 font-bold px-5 py-3 rounded-lg text-xs cursor-pointer tracking-wider font-mono uppercase shadow-md hover:shadow-lg transition-all"
              >
                Inquire Private Label RFP
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-72 hidden lg:block border-4 border-stone-850 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600"
              alt="Dryza packaging facilities"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

        </div>

      </div>
    );
  }

  if (currentTab === 'recipes') {
    const activeRecipe = RECIPES.find((r) => r.id === activeRecipeId) || RECIPES[0];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 animate-fade-in" id="recipes-guide-view">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full">
            Commercial Kitchen Recipes Hub
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Formulating with Dryza Dehydrated Spices
          </h2>
          <p className="text-stone-605 text-sm md:text-base">
            Professional culinary guides and food-science ratios for ready-to-eat noodles, catering spreads, and dry snack rubs. Adjust servings below to automatically recalculate dehydration ratios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick recipe list choice */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block font-bold border-b pb-1">
              Select Recipe Guidelines
            </span>

            {RECIPES.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => {
                  setActiveRecipeId(recipe.id);
                  setRecipeServings(recipe.servings);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col space-y-1.5 cursor-pointer ${
                  activeRecipeId === recipe.id
                    ? 'border-emerald-600 bg-emerald-50/20 text-emerald-900 shadow-sm'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <span className="text-xs font-mono font-bold text-stone-400">Prep time: {recipe.prepTime}</span>
                <span className="text-sm font-sans font-bold leading-snug">{recipe.title}</span>
                <p className="text-[11px] text-stone-500 line-clamp-1">{recipe.description}</p>
              </button>
            ))}

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/60 text-[11px] leading-relaxed text-amber-900 space-y-1.5">
              <span className="font-bold underline block">Dehydration Pro-Tip:</span>
              <p className="font-mono">
                100 grams of raw fresh garlic equates to approximately 28 grams of Dryza premium-quality Dehydrated Garlic Granules due to our pristine low-temp convective extraction!
              </p>
            </div>
          </div>

          {/* Detailed Recipe with serving portions scale slider */}
          <div className="lg:col-span-8 bg-[#FAF9F5] rounded-3xl p-6 md:p-8 border border-stone-200 space-y-6">
            
            {activeRecipe ? (
              <div className="space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4">
                  <div className="space-y-1 max-w-lg">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-emerald-800 bg-emerald-100 py-0.5 px-2 rounded-md">
                      B2B Formulation Sheet
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900">{activeRecipe.title}</h3>
                    <p className="text-xs text-stone-605">{activeRecipe.description}</p>
                  </div>

                  <div className="rounded-xl overflow-hidden h-24 w-36 bg-stone-200 shadow-sm shrink-0">
                    <img src={activeRecipe.image} alt={activeRecipe.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Portions Calculator Adjustment Slider */}
                <div className="bg-white p-4.5 rounded-2xl border border-stone-150 space-y-3.5 shadow-inner-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-sans font-bold text-stone-705 flex items-center gap-1.5">
                      <ChefHat className="w-4.5 h-4.5 text-emerald-800" />
                      Adjust servings multipliers for corporate batches:
                    </span>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setRecipeServings(prev => Math.max(1, prev - 10))}
                        className="w-7 h-7 bg-stone-105 rounded-md flex items-center justify-center font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold bg-emerald-800 text-stone-100 px-3 py-1 rounded text-xs select-none">
                        {recipeServings} Portions
                      </span>
                      <button
                        onClick={() => setRecipeServings(prev => Math.min(1000, prev + 10))}
                        className="w-7 h-7 bg-stone-105 rounded-md flex items-center justify-center font-bold hover:bg-stone-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                    value={recipeServings}
                    onChange={(e) => setRecipeServings(Number(e.target.value))}
                  />
                  <div className="flex justify-between font-mono text-[9px] text-zinc-400 leading-none">
                    <span>10 Portions (Test Trial Batch)</span>
                    <span>250 Portions (Batering Line)</span>
                    <span>500 Portions (Heavy Industrial Splicing Scale)</span>
                  </div>
                </div>

                {/* Ingredients and scaled instructions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  
                  {/* Ingredients left */}
                  <div className="md:col-span-5 space-y-3 font-sans">
                    <span className="block text-xs uppercase font-mono tracking-wider font-bold text-stone-500">
                      Scaled Ingredient Weights
                    </span>
                    <ul className="space-y-2 text-xs">
                      {activeRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-1.5 p-1.5 bg-white border border-stone-200/60 rounded-lg">
                          <span className="text-emerald-800 font-bold">•</span>
                          <span className="text-stone-900 font-medium">
                            {scaleIngredient(ing, activeRecipe.servings, recipeServings)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Directions right */}
                  <div className="md:col-span-7 space-y-3 font-sans">
                    <span className="block text-xs uppercase font-mono tracking-wider font-bold text-stone-500">
                      Formulation Directives
                    </span>
                    <ol className="space-y-3.5 text-xs text-stone-700">
                      {activeRecipe.instructions.map((ins, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="bg-stone-200/80 text-stone-800 font-mono font-bold w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[10px]">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{ins}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                </div>

                {/* Ingredients tag compliance callout with CTA */}
                <div className="p-4 bg-emerald-800/5 border border-emerald-800/10 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-850 uppercase font-mono font-bold tracking-tight">
                      Dryza Sourcing alignment
                    </span>
                    <p className="text-xs text-zinc-650 leading-relaxed font-sans max-w-md">
                      Requires Dryza bulk raw ingredients: <span className="font-bold">{activeRecipe.dryzaIngredients.join(', ')}</span>
                    </p>
                  </div>
                  <button
                    onClick={openInquiryForm}
                    className="bg-emerald-900 text-white rounded-lg px-4 py-2 font-bold font-mono text-xs cursor-pointer shadow-sm hover:bg-emerald-950 transition-colors"
                  >
                    RFQ Bulk Sourcing
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-stone-400 py-12 text-center text-xs">
                Pick a dynamic recipe in the sidebar to investigate chemical parameters and kitchen scalability.
              </div>
            )}

          </div>

        </div>

      </div>
    );
  }

  if (currentTab === 'about') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 animate-fade-in" id="about-brand-view">
        
        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-105/60 px-3 py-1 rounded-full inline-block">
              Since 2011 - Global Processing Leaders
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Honoring Purity, Securing Clean Label Food Ingredients
            </h2>
            <p className="text-sm text-stone-650 leading-relaxed">
              At Dryza Spices, our core operations center on advanced agricultural processing and modern natural dehydration technology. We partner directly with thousands of acreage contract farms across prime onion, garlic, ginger, and herb growing fields in India. This vertically integrated supply chain ensures strict raw commodity traceability from sowing to nautical packing.
            </p>
            <p className="text-sm text-stone-650 leading-relaxed font-sans">
              Initially founded as a dedicated garlic-milling facility, Dryza has scaled to operate four high-capacity modern dehydrated food processing plants spanning over 80,000 square meters. Servicing corporate instant-food conglomerates, global restaurant franchises, dry spice brokers, and snack manufacturing giants, we enforce an untarnished reputation for zero microbiological non-compliance.
            </p>

            <div className="grid grid-cols-2 gap-4 border-t pt-5 font-sans">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 text-xs">Purity Guaranteed</span>
                  <p className="text-[11px] text-stone-500 leading-snug">Sulfite-free and completely trace residue clear</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 text-xs">SGS Accredited</span>
                  <p className="text-[11px] text-stone-500 leading-snug">BRCGS Grade AA and ISO 22000 processing channels</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative" id="about-image-panels">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden h-72 shadow-2xl relative border-4 border-white select-none">
                <img
                  src="https://images.unsplash.com/photo-1580191947416-62d35a55e71d?auto=format&fit=crop&q=80&w=600"
                  alt="Food processing lines"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400">Main Factory Floor</span>
                  <h4 className="text-lg font-bold">Hygiene Controlled Airzones</h4>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Global footprints statistics */}
        <div className="bg-stone-900 text-[#FAF9F5] p-6 sm:p-10 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center font-mono border border-stone-850">
          <div>
            <span className="text-3xl sm:text-4xl font-black text-amber-500">14,300+ MT</span>
            <span className="block text-[10px] text-stone-400 tracking-wider font-bold uppercase mt-1">Annual Dehydration Power</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-350">4 Modern Plants</span>
            <span className="block text-[10px] text-stone-400 tracking-wider font-bold uppercase mt-1">SGS Audited Infrastructure</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-amber-500">Zero Recalls</span>
            <span className="block text-[10px] text-stone-400 tracking-wider font-bold uppercase mt-1">Hygienic Traceability SLA</span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-emerald-350">35+ Ports</span>
            <span className="block text-[10px] text-stone-400 tracking-wider font-bold uppercase mt-1">Freight Corridors Cleared</span>
          </div>
        </div>

      </div>
    );
  }

  if (currentTab === 'contact') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12 animate-fade-in" id="contact-brand-view">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-105/60 px-3 py-1 rounded-full">
            Commercial & Wholesale Liaison Desk
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Connect Directly with Dryza Corporate Sourcing
          </h2>
          <p className="text-stone-605 text-sm md:text-base font-sans">
            Have custom inquiries regarding container layout configurations, contract farm pricing allocations, or specialized micro-mesh specifications? Connect with our trade liaison segment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sourcing contact parameters */}
          <div className="lg:col-span-5 bg-[#FAF9F5] rounded-3xl p-6 md:p-8 border border-stone-200 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest font-black block border-b pb-1">
                Dryza Spices Registry Office
              </span>

              <div className="space-y-4 font-sans text-xs">
                
                {/* Office 1 */}
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">Headquarters & Dry-Mill Plant 1:</h4>
                  <div className="flex items-start gap-1.5 text-stone-600 font-mono text-[11px] leading-relaxed">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>Survey No. 124, GIDC Industrial Processing Estate, Mahuva-364290, Gujarat, India</span>
                  </div>
                </div>

                {/* Office 2 */}
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900">Wholesale & Corporate Operations Division:</h4>
                  <div className="flex items-start gap-1.5 text-stone-600 font-mono text-[11px] leading-relaxed">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span>8th Floor, Signature Tower C, One Horizon Hub, Bandra Kurla Complex, Mumbai-400051, MH, India</span>
                  </div>
                </div>

                {/* Telecom */}
                <div className="space-y-1 border-t pt-4">
                  <h4 className="font-bold text-stone-900">Liaison Contact Hotline:</h4>
                  <p className="text-stone-701 font-mono text-[11px] leading-relaxed">
                    Corporate Fax/Phone: +91 22 4555 1040 | Direct cell: +91 91100 24040
                  </p>
                  <p className="text-stone-701 font-mono text-[11px]">
                    Sales inquiry inbox: <span className="font-bold text-emerald-800">corporate@dryza-spices.com</span>
                  </p>
                </div>

              </div>
            </div>

            <div className="bg-amber-100/40 p-4 rounded-2xl border border-amber-200/60 text-[11px] text-amber-900 font-sans leading-relaxed">
              <span className="font-bold block">B2B Lead SLA Notice:</span>
              <p className="mt-1 font-mono">
                Corporate pricing quotation estimates are guaranteed within 4 hours. Samples required for raw trial batches are freight-dispatched on the same working afternoon via DHL Express worldwide.
              </p>
            </div>
          </div>

          {/* Quick contact interface or FAQ details */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-stone-200 flex flex-col justify-between">
            <div className="space-y-5">
              <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase block font-bold border-b pb-1">
                Frequently Asked Trade Specific Questions (FAQ)
              </span>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5 p-3.5 bg-stone-50 rounded-xl border border-stone-150">
                  <h4 className="font-bold text-stone-900">What is the minimum bulk order value (MOQ) for wholesale orders?</h4>
                  <p className="text-stone-605 leading-relaxed font-mono text-[11px]">
                    Our standard trial cargo consignment minimum threshold begins at 1,000 Kilograms (1.0 Metric Ton). For regional distributors or local HORECA suppliers, deliveries can be combined.
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 bg-stone-50 rounded-xl border border-stone-150">
                  <h4 className="font-bold text-stone-900">Do you offer customized steam sterilization processes?</h4>
                  <p className="text-stone-605 leading-relaxed font-mono text-[11px]">
                    Yes. We house automated HTST steam sterilization machinery capable of reducing total plate count (TPC) to below 10,000 cfu/g to conform to strict pharma and high-end infant food guidelines.
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 bg-stone-50 rounded-xl border border-stone-150">
                  <h4 className="font-bold text-stone-900">Can we request specific sizing (e.g. Minced vs. Chopped, Powder mesh)?</h4>
                  <p className="text-stone-605 leading-relaxed font-mono text-[11px]">
                    We provide garlic and onion under multiple customized mesh sizes standard (Chop, Minced, Minced grit, Coarse granules, Fine 80-100 mesh flour powder). Specify this during your RFQ submission.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={openInquiryForm}
                className="bg-emerald-900 hover:bg-emerald-950 text-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider font-mono shadow-md cursor-pointer text-center w-full sm:w-auto"
              >
                Inquire and Request Pricing
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // Fallback views for Policy pages
  if (currentTab === 'privacy' || currentTab === 'shipping' || currentTab === 'terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-6 animate-fade-in font-sans" id="policies-and-legals-view">
        <div className="border-b pb-4 border-stone-200">
          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-800 font-bold">
            Corporation Policy & Regulatory Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-950 capitalize">
            {currentTab} Policy & Legal Framework Guidelines
          </h2>
          <p className="text-xs text-stone-501 mt-1 font-mono">Effective: June 2026 | Dryza Legal Desk</p>
        </div>

        {currentTab === 'privacy' && (
          <div className="space-y-4 text-xs text-stone-650 leading-relaxed font-sans">
            <h4 className="text-sm font-bold text-stone-900 font-sans border-l-4 border-emerald-800 pl-2">1. Data Collection and NDA Integrity</h4>
            <p>
              Under our corporate bilateral framework, any agricultural formulations, custom mesh specifications, proprietary spice mixtures, or corporate contact particulars uploaded to our RFQ system are kept fully isolated and protected. Dryza Spices does not share customer leads or proprietary food manufacturing formulas with any third-party brokers.
            </p>
            <h4 className="text-sm font-bold text-stone-900 font-sans border-l-4 border-emerald-800 pl-2">2. Digital Cookie Usage</h4>
            <p>
              We run lightweight, cookie-based sessions purely to sustain your active B2B inquiry cart so that selected products stay compiled as you browse our recipe directory and engineering data. These are stored locally and sanitized.
            </p>
          </div>
        )}

        {currentTab === 'shipping' && (
          <div className="space-y-4 text-xs text-stone-650 leading-relaxed font-sans">
            <h4 className="text-sm font-bold text-stone-900 font-sans border-l-4 border-emerald-800 pl-2">1. Global FOB & CIF Shipping IncoTerms</h4>
            <p>
              Except as contractually stated, standard shipping follows Free on Board (FOB Port of Mundra / Port of Nhava Sheva) guidelines or Cost, Insurance and Freight (CIF Target Ocean Ports) frameworks. Container loadings are configuring securely under optimal dual-barrier nitrogen-wrapped conditions.
            </p>
            <h4 className="text-sm font-bold text-stone-900 font-sans border-l-4 border-emerald-800 pl-2">2. Sourcing Lead Times</h4>
            <p>
              For standard garlic powder and onion flakes, dispatch from Mahuva silo storage occurs within 7 working days. Custom steam-sterilized packaging or private labeling specifications requires a lead window of 21 calendar days for proper quality grading trials and microbial validation.
            </p>
          </div>
        )}

        {currentTab === 'terms' && (
          <div className="space-y-4 text-xs text-stone-650 leading-relaxed text-sans">
            <h4 className="text-sm font-bold text-stone-900 font-sans border-l-4 border-emerald-800 pl-2">1. Cargo Specifications and Quality Splicing Limits</h4>
            <p>
              Dryza Spices warrants that all delivered goods strictly match the physical parameters and grade declared on the dynamic specifications datasheets. Product quality is inspected or controlled under strict limits at time of loading via certified local laboratorians. Claims regarding any cargo quality degradation must be filed within 14 calendar days of target port arrival.
            </p>
            <h4 className="text-sm font-bold text-stone-900 font-sans border-l-4 border-emerald-800 pl-2">2. Governing Legal Jurisdiction</h4>
            <p>
              These agreements are governed and interpreted under the commercial litigation rules and food processing guidelines regulated by the Agricultural and Processed Food Products Export Development Authority (APEDA) and the Indian Food Safety and Standards Authority (FSSAI).
            </p>
          </div>
        )}

        <div className="pt-6 border-t border-stone-200 flex justify-between items-center text-xs">
          <span className="text-stone-400">Questions? Contact trade liaison segments:</span>
          <a href="mailto:legal@dryza-spices.com" className="font-bold font-mono text-emerald-880 hover:underline">
            legal@dryza-spices.com
          </a>
        </div>
      </div>
    );
  }

  return null;
}
