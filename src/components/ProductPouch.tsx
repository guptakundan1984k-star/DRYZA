import React, { useState } from 'react';
import { Product } from '../types';
import { RefreshCw, Check, Calendar, Mail, Phone, Info } from 'lucide-react';

interface ProductPouchProps {
  product: Product;
  widthClass?: string;
  heightClass?: string;
  initialSide?: 'front' | 'back';
}

export default function ProductPouch({
  product,
  widthClass = "w-full max-w-[280px]",
  heightClass = "h-[400px]",
  initialSide = 'front'
}: ProductPouchProps) {
  const [side, setSide] = useState<'front' | 'back'>(initialSide);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // prevent bubbling to details click
    }
    setIsFlipping(true);
    setSide(prev => prev === 'front' ? 'back' : 'front');
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  // Extract nutrition facts based on product
  const facts = product.nutritionFacts || {};

  // Render SVG spice illustrations dynamically
  const renderSpiceIllustration = (id: string) => {
    switch (id) {
      case 'green-chilli-powder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 mt-2 select-none">
            {/* Heap of green powder */}
            <path d="M 12,50 Q 50,22 88,50 Z" fill="#608038" opacity="0.9" />
            <path d="M 22,48 Q 50,30 78,48 Z" fill="#4a6629" opacity="0.8" />
            {/* Chilies */}
            <path d="M 32,45 C 38,32 50,35 62,44 C 54,34 40,32 32,45" fill="#2d5e18" />
            <path d="M 40,43 C 48,22 68,26 80,45 C 68,27 48,25 40,43" fill="#3f821e" />
            <path d="M 20,47 C 32,24 55,22 70,41 C 55,24 35,26 20,47" fill="#4d9627" />
            {/* Stems */}
            <path d="M 20,47 Q 15,48 12,46" stroke="#254d12" strokeWidth="2" fill="none" />
            <path d="M 40,43 Q 36,44 33,42" stroke="#254d12" strokeWidth="2" fill="none" />
          </svg>
        );
      case 'onion-powder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 mt-2 select-none">
            {/* Heap of beige powder */}
            <path d="M 15,50 Q 50,25 85,50 Z" fill="#ebdfce" opacity="0.9" />
            <path d="M 25,48 Q 50,32 75,48 Z" fill="#dac9b3" opacity="0.8" />
            {/* Onion whole */}
            <ellipse cx="62" cy="40" rx="14" ry="12" fill="#782348" />
            <path d="M 62,28 Q 63,22 61,18 Q 65,22 62,28" stroke="#fec5bb" strokeWidth="1.5" fill="none" />
            {/* Onion sliced/half */}
            <ellipse cx="38" cy="44" rx="13" ry="11" fill="#8d305c" />
            <ellipse cx="38" cy="44" rx="10" ry="8.5" fill="#a44473" />
            <ellipse cx="38" cy="44" rx="7" ry="6" fill="#e8c2d5" />
            <ellipse cx="38" cy="44" rx="4" ry="3.5" fill="#ffffff" />
          </svg>
        );
      case 'lemon-powder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 mt-2 select-none">
            {/* Heap of pale yellow powder */}
            <path d="M 15,51 Q 50,24 85,51 Z" fill="#fcf3cf" opacity="0.9" />
            <path d="M 25,49 Q 50,30 75,49 Z" fill="#f9ebae" opacity="0.8" />
            {/* Lemon whole */}
            <ellipse cx="64" cy="40" rx="14" ry="11" fill="#fcd12a" transform="rotate(-15 64 40)" />
            {/* Lemon half */}
            <circle cx="38" cy="44" r="11" fill="#f4d03f" />
            <circle cx="38" cy="44" r="9" fill="#fef9e7" />
            {/* Segments */}
            <path d="M 38,44 L 38,35 M 38,44 L 46,40 M 38,44 L 44,49 M 38,44 L 33,48 M 38,44 L 30,41 M 38,44 L 34,36" stroke="#f4d03f" strokeWidth="1.5" />
          </svg>
        );
      case 'ginger-powder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 mt-2 select-none">
            {/* Heap of sandy yellow powder */}
            <path d="M 15,51 Q 50,25 85,51 Z" fill="#e5d3b3" opacity="0.9" />
            <path d="M 25,49 Q 50,31 75,49 Z" fill="#cca374" opacity="0.8" />
            {/* Ginger rhizome */}
            <path d="M 35,42 C 30,35 25,36 21,43 C 18,35 12,38 9,45 C 5,50 15,55 35,48 Z" fill="#caa472" stroke="#a07d50" strokeWidth="1" />
            <path d="M 32,45 C 38,36 46,38 52,43 C 58,40 68,43 71,48 C 75,53 55,56 32,45 Z" fill="#d8b98f" stroke="#a07d50" strokeWidth="1" />
            {/* Leaf */}
            <path d="M 68,43 C 74,32 85,34 90,42 C 80,34 72,40 68,43" fill="#528245" />
          </svg>
        );
      case 'garlic-powder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 mt-2 select-none">
            {/* Heap of white/cream powder */}
            <path d="M 15,51 Q 50,23 85,51 Z" fill="#faf9f5" opacity="0.9" stroke="#eedcc5" strokeWidth="0.5" />
            <path d="M 25,49 Q 50,29 75,49 Z" fill="#f3eade" opacity="0.8" />
            {/* Garlic bulb whole */}
            <path d="M 50,45 C 45,45 38,40 40,32 C 42,24 50,20 50,20 C 50,20 58,24 60,32 C 62,40 55,45 50,45 Z" fill="#f4f1eb" stroke="#d5cfc4" strokeWidth="1" />
            {/* Cloves */}
            <path d="M 28,47 C 24,45 23,38 27,33 C 31,28 35,32 35,32 C 35,32 36,40 32,46 C 30,47 29,47 28,47 Z" fill="#eae4d8" stroke="#cbd0c6" strokeWidth="1" />
            <path d="M 72,46 C 76,44 77,37 73,32 C 69,27 65,31 65,31 C 65,31 64,39 68,45 C 70,46 71,46 72,46 Z" fill="#eae4d8" stroke="#cbd0c6" strokeWidth="1" />
          </svg>
        );
      case 'tomato-powder':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-24 mt-2 select-none">
            {/* Heap of crimson powder */}
            <path d="M 15,51 Q 50,23 85,51 Z" fill="#c0392b" opacity="0.9" />
            <path d="M 25,49 Q 50,29 75,49 Z" fill="#a93226" opacity="0.8" />
            {/* Tomato whole */}
            <circle cx="62" cy="42" r="11.5" fill="#e74c3c" />
            <circle cx="60" cy="40" r="10.5" fill="#fc5b49" />
            {/* Tomato slice */}
            <circle cx="36" cy="46" r="10" fill="#c0392b" />
            <circle cx="36" cy="46" r="8.5" fill="#e74c3c" />
            <path d="M 36,46 L 36,36 Q 40,40 36,46" fill="#922b21" />
            <path d="M 36,46 L 46,46 Q 42,42 36,46" fill="#922b21" />
            <path d="M 36,46 L 36,56 Q 32,52 36,46" fill="#922b21" />
            <path d="M 36,46 L 26,46 Q 30,50 36,46" fill="#922b21" />
            {/* Green leaf crown */}
            <path d="M 60,30 L 62,27 L 64,30 L 61,31" fill="#27ae60" />
            <path d="M 57,32 L 60,30 L 61,33" fill="#2ecc71" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Determine if it's a custom user-added product with an uploaded image
  const isCustomProduct = product.image && !['green-chilli-powder', 'onion-powder', 'lemon-powder', 'ginger-powder', 'garlic-powder', 'tomato-powder'].includes(product.id);

  return (
    <div className={`relative ${widthClass} ${heightClass} group select-none [perspective:1000px]`} id={`pouch-${product.id}`}>
      
      {/* 3D Container with rotatable card structure */}
      <div 
        className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{
          transform: side === 'back' ? 'rotateY(180deg)' : 'none'
        }}
      >
        
        {/* ========================================================= */}
        {/* FRONT VIEW (Stand-up metallic pouch face)                 */}
        {/* ========================================================= */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#b8bcbe] via-[#e2e4e5] to-[#a2a6a8] rounded-2xl py-3 px-3.5 shadow-xl border-x-4 border-stone-300 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Metallic Heat Seals & Punch hole */}
          <div className="w-full flex flex-col items-center select-none pt-0.5">
            {/* Top Seal grooving pattern */}
            <div className="w-full h-3 border-b-2 border-stone-400 flex justify-between bg-stone-300/40 px-6 rounded-t-sm">
              <div className="w-3.5 h-1 border border-stone-500 rounded-sm bg-stone-400/80 mx-auto opacity-70"></div>
            </div>
            {/* Ziplock notch indicator */}
            <div className="w-full flex justify-between px-2 text-[6.5px] font-mono text-stone-700 mt-1 uppercase scale-90">
              <span>◄ TEAR HERE</span>
              <div className="h-0.5 w-[65%] border-b border-dashed border-stone-600 mt-1 opacity-50"></div>
              <span>TEAR HERE ►</span>
            </div>
          </div>

          {/* Core White Sticker Decal or Uploaded Image */}
          {isCustomProduct ? (
            <div className="flex-1 rounded-xl flex flex-col justify-between relative shadow-inner overflow-hidden mt-2.5">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex-1 bg-gradient-to-br from-[#FCFBF7] via-[#FFFDF9] to-[#F1EEE3] rounded-xl border-2 border-emerald-900/60 p-2.5 flex flex-col justify-between relative shadow-inner overflow-hidden mt-2.5">
              
              {/* Top Arched ribbon - Premium Dehydrated Spices */}
              <div className="w-full bg-emerald-900 text-amber-100 text-[8px] font-sans font-bold uppercase tracking-wider text-center py-1 rounded-sm border-b border-amber-500/30">
                ✦ PREMIUM DEHYDRATED SPICES ✦
              </div>

              {/* DRYZA SPICES Brand logo */}
              <div className="flex flex-col items-center mt-1.5">
                <h1 className="text-xl font-black text-emerald-950 tracking-tighter flex items-center gap-0.5">
                  <span className="text-emerald-700">D</span>RYZ<span className="text-emerald-800">A</span>
                  <span className="text-[7.5px] bg-[#d97706]/90 text-white rounded px-0.5 py-0.2 uppercase font-extrabold tracking-widest font-mono ml-1">
                    Brand
                  </span>
                </h1>
                <div className="h-px bg-amber-500 w-16 opacity-60"></div>
                <span className="text-[7px] uppercase font-mono tracking-widest text-[#922b21] font-bold mt-0.5">Spices</span>
              </div>

              {/* Translation Text in Sanskrit/Hindi style */}
              <div className="text-center mt-1">
                <span className="text-[8px] font-semibold text-stone-850 bg-stone-150 px-2 py-0.5 rounded-full font-sans tracking-wide">
                  शुद्ध । सूखा । स्वादिष्ट ।
                </span>
              </div>

              {/* Middle Main Product Product Name Banner */}
              <div className="text-center mt-1.5">
                <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase block mb-1">
                  {product.categoryLabel}
                </span>
                <h2 className="text-base font-extrabold text-stone-900 tracking-tight leading-4 uppercase pr-1 pl-1 scale-y-105 border-b border-stone-250 pb-1.5">
                  {product.name.replace('Dehydrated ', '')}
                </h2>
              </div>

              {/* Core Illustration Graph */}
              <div className="flex-1 flex flex-col justify-center items-center">
                {renderSpiceIllustration(product.id)}
              </div>

              {/* Footer Attributes: weight, 100% pure, no chemicals */}
              <div className="border-t border-emerald-900/20 pt-1.5 mt-auto flex justify-between items-center text-[7.5px] text-stone-800 font-mono px-1">
                <span>Net Wt. <strong className="text-emerald-950 text-[8.5px]">{product.netWt || "100g"}</strong></span>
                <div className="w-1.5 h-1.5 bg-green-700 rounded-full flex items-center justify-center border border-green-900 shadow-sm" title="100% Vegetarian"></div>
                <span>100% Dehydrated</span>
              </div>

              <div className="text-[6.5px] text-center text-stone-500 font-sans tracking-normal mt-0.5">
                No Added Preservatives • Made with Care
              </div>

            </div>
          )}

          {/* Interactive Flip Trigger Banner in bottom footer */}
          <div className="w-full flex justify-center py-2">
            <button 
              onClick={handleFlip}
              className="bg-stone-900/90 text-stone-950 hover:bg-black px-3.5 py-1.5 rounded-full text-[9.5px] font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>Flip to Back Label</span>
            </button>
          </div>

        </div>

        {/* ========================================================= */}
        {/* BACK VIEW (Nutrition Facts & Regulatory Panel)             */}
        {/* ========================================================= */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#b8bcbe] via-[#e2e4e5] to-[#a2a6a8] rounded-2xl py-3 px-3.5 shadow-xl border-x-4 border-stone-300 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Top Seal groove */}
          <div className="w-full h-3 border-b-2 border-stone-400 bg-stone-300/45 px-6 rounded-t-sm flex items-center" />

          {/* Sticker decaling back side */}
          {product.backImage ? (
            <div className="flex-1 rounded-xl flex flex-col justify-between overflow-hidden mt-2.5">
              <img src={product.backImage} alt={product.name + ' Back'} className="w-full h-full object-cover" />
            </div>
          ) : isCustomProduct ? (
            <div className="flex-1 rounded-xl flex flex-col justify-between overflow-hidden mt-2.5">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transform scale-x-[-1]" />
            </div>
          ) : (
            <div className="flex-1 bg-[#FCFBF7] rounded-xl border-2 border-emerald-900/60 p-2.5 flex flex-col justify-between overflow-y-auto text-stone-900 mt-2.5 select-text">
              
              {/* Header banner */}
              <div className="text-center pb-1 border-b border-stone-200">
                <h3 className="text-xs font-bold text-emerald-950 uppercase">DRYZA SPICES BACK LABELS</h3>
              <p className="text-[7.5px] text-[#922b21] tracking-wider uppercase font-mono font-bold">{product.name.replace('Dehydrated ', '')}</p>
            </div>

            {/* Standard Nutrition Facts Table template */}
            <div className="border border-stone-900 p-1.5 rounded mt-2 font-mono text-[7px] leading-tight flex flex-col">
              <h4 className="font-extrabold text-[9px] border-b-2 border-stone-900 pb-0.5 uppercase tracking-tighter">Nutrition Facts</h4>
              <div className="flex justify-between border-b border-stone-500 py-0.5">
                <span>Serving Size : 10g</span>
                <span className="text-right">Servings Per Pack : {product.netWt === '50g' ? '5' : '10'}</span>
              </div>
              <div className="font-bold border-b border-stone-900 py-0.5 font-sans uppercase tracking-tight text-[7.5px]">
                Amount Per 100g (Approx.)
              </div>
              
              {/* Table stats iterator */}
              <div className="space-y-0.5 mt-1 font-mono text-[7px]">
                <div className="flex justify-between border-b border-stone-200 py-0.5 font-bold">
                  <span>Energy</span>
                  <span>{facts.energy || "341 kcal"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.5">
                  <span>Protein</span>
                  <span>{facts.protein || "9.2 g"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.5">
                  <span>Carbohydrate</span>
                  <span>{facts.carbohydrate || "75.8 g"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.5 pl-2 text-stone-600">
                  <span>Total Sugars</span>
                  <span>{facts.totalSugars || "18.7 g"}</span>
                </div>
                {facts.addedSugars && (
                  <div className="flex justify-between border-b border-stone-200 py-0.5 pl-2 text-stone-600">
                    <span>Added Sugars</span>
                    <span>{facts.addedSugars}</span>
                  </div>
                )}
                {facts.dietaryFiber && (
                  <div className="flex justify-between border-b border-stone-200 py-0.5 pl-2 text-stone-600">
                    <span>Dietary Fiber</span>
                    <span>{facts.dietaryFiber}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-stone-200 py-0.5">
                  <span>Total Fat</span>
                  <span>{facts.totalFat || "1.3 g"}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 py-0.5 pl-2 text-stone-600">
                  <span>Saturated Fat</span>
                  <span>{facts.saturatedFat || "0.20 g"}</span>
                </div>
                {facts.sodium && (
                  <div className="flex justify-between border-b border-stone-500 py-0.5">
                    <span>Sodium</span>
                    <span>{facts.sodium}</span>
                  </div>
                )}
                {facts.calcium && (
                  <div className="flex justify-between border-b border-stone-200 py-0.5 text-stone-600">
                    <span>Calcium</span>
                    <span>{facts.calcium}</span>
                  </div>
                )}
                {facts.iron && (
                  <div className="flex justify-between border-b border-stone-200 py-0.5 text-stone-600">
                    <span>Iron</span>
                    <span>{facts.iron}</span>
                  </div>
                )}
                {facts.potassium && (
                  <div className="flex justify-between border-b border-stone-200 py-0.5 text-stone-600">
                    <span>Potassium</span>
                    <span>{facts.potassium}</span>
                  </div>
                )}
              </div>
              <p className="text-[5.5px] text-stone-500 leading-tight mt-1 font-sans font-medium">
                *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </p>
            </div>

            {/* Ingredients block */}
            <div className="mt-2 text-[7px] border-b border-stone-200 pb-1 flex justify-between gap-1 items-start">
              <div>
                <span className="font-extrabold block text-[7.5px] uppercase">Ingredients :</span>
                <span className="font-semibold text-stone-700">{product.ingredientsText || `100% Dehydrated ${name}`}</span>
              </div>
              <div className="border border-green-700 p-0.5 flex flex-col items-center justify-center shrink-0 w-5 h-5 rounded">
                <span className="w-1.5 h-1.5 bg-green-700 rounded-full"></span>
              </div>
            </div>

            {/* FSSAI compliance certification */}
            <div className="mt-1.5 border border-amber-600/40 bg-amber-50/20 p-1 rounded flex items-center gap-2">
              <span className="text-[#a44473] font-bold text-[10px] pl-1 font-sans italic">fssai</span>
              <div className="h-4 w-px bg-stone-300"></div>
              <div className="text-[6.5px] font-semibold text-stone-840 leading-none">
                <span className="block text-[6.2px] text-stone-500 uppercase">Lic. No.</span>
                <strong className="text-emerald-900 text-[7px]">21126180000120</strong>
              </div>
            </div>

            {/* Manufacturer Details block */}
            <div className="mt-2 text-[6px] text-stone-700 leading-tight space-y-1 bg-stone-50 p-1.5 rounded border border-stone-200">
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <strong className="text-[6.3px] text-stone-900 block uppercase">Manufactured & Packed By:</strong>
                  <strong>M/S KAIPANA ENTERPRISES</strong>
                  <span className="block">Bokaro Steel City, Jharkhand - 827001, India</span>
                </div>
                <div>
                  <strong className="text-[6.3px] text-stone-900 block uppercase">Marketed By:</strong>
                  <span>M/S Kaipana Enterprises, WB</span>
                  <span className="block text-[5.8px]">Production Unit At MP(Indore)</span>
                </div>
              </div>
              <div className="pt-1 border-t border-stone-200 flex justify-between gap-1 text-[5.5px] font-mono">
                <span className="flex items-center gap-0.5"><Calendar className="w-2 h-2" /> MFD: Apr 2026</span>
                <span>EXP: Mar 2027</span>
                <span className="font-bold text-stone-900">MRP {product.mrp || "₹100"}</span>
              </div>
            </div>

            {/* Customer Care Contact detail block */}
            <div className="mt-2 bg-emerald-500/10 p-1.5 rounded text-[5.8px] text-emerald-950 font-semibold space-y-0.5 flex flex-col">
              <div className="flex items-center justify-between text-[6.2px] font-bold uppercase text-emerald-900">
                <span>Customer Care Helpline</span>
                <span className="text-[5.5px] text-[#922b21]">(India Unit)</span>
              </div>
              <span className="flex items-center gap-1"><Phone className="w-2 h-2 shrink-0 text-emerald-800" /> Phone: 8521741653</span>
              <span className="flex items-center gap-1"><Mail className="w-2 h-2 shrink-0 text-emerald-800" /> Email: dryzaspices@gmail.com</span>
            </div>

          {/* Footer motto banner slogan */}
            <div className="text-[5.5px] text-center text-emerald-900 bg-emerald-900/5 py-1 rounded-sm mt-2 font-semibold">
              MADE WITH CARE, PACKED WITH PURITY
            </div>

          </div>
          )}

          {/* Flip to front trigger button */}
          <div className="w-full flex justify-center py-2">
            <button 
              onClick={handleFlip}
              className="bg-stone-900/90 text-stone-950 hover:bg-black px-3.5 py-1.5 rounded-full text-[9.5px] font-mono tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-amber-400" />
              <span>Flip to Front Label</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
