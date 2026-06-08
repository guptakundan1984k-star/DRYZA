import React, { useState, useEffect, useRef } from 'react';
import { Search, ShieldCheck, Zap, Award, Globe } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string) => void;
  onExploreProducts: () => void;
  onSelectCategory: (categoryId: string) => void;
  trustedCount?: number;
}

export default function Hero({ onSearch, onExploreProducts, onSelectCategory, trustedCount = 53 }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(0);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setDisplayCount(trustedCount);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Target is 0
            if (trustedCount === 0) return;
            // Prevent multiple simultaneous animations
            if (badgeRef.current?.dataset.animating === 'true') return;
            if (badgeRef.current) badgeRef.current.dataset.animating = 'true';
            
            let current = 0;
            setDisplayCount(0);
            
            const timer = setInterval(() => {
              current += 1;
              if (current <= trustedCount) {
                setDisplayCount(current);
              } else {
                clearInterval(timer);
                if (badgeRef.current) badgeRef.current.dataset.animating = 'false';
              }
            }, 35); // Smoothly increment step-by-step like a flip clock
            
            badgeRef.current.dataset.timerId = String(timer);
          } else {
             // Reset when scrolled out of view to animate again next time it scrolls in
             setDisplayCount(0);
             if (badgeRef.current) {
               badgeRef.current.dataset.animating = 'false';
               const existingTimer = badgeRef.current.dataset.timerId;
               if (existingTimer) {
                 clearInterval(Number(existingTimer));
               }
             }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => {
      if (timer) clearInterval(timer);
      observer.disconnect();
    };
  }, [trustedCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onExploreProducts();
  };

  const trendingSearches = [
    { label: 'Garlic Powder', id: 'garlic' },
    { label: 'Onion Flakes', id: 'onion' },
    { label: 'Tomato Powder', id: 'spices' },
    { label: 'Mint Leaves', id: 'herbs' },
    { label: 'Industrial Blends', id: 'industrial' }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F5] via-stone-50 to-white pt-10 pb-16 md:py-24" id="home-hero-section">
      {/* Decorative Warm Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-50/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/60 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>WHOLESALE & PREMIUM FOOD GRADE QUALITY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-none" id="hero-title">
              Premium Dehydrated Ingredients <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-850 to-amber-700">
                for Every Kitchen.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto lg:mx-0 font-medium">
              Freshness Preserved Naturally. Premium dried onion, garlic, spices, and custom industrial blends. Locked aroma, long shelf life, and zero compromises on purity.
            </p>

            {/* Dynamic Animated Trusted Counter Badge */}
            <div ref={badgeRef} className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#1C1917]/5 border border-stone-200 text-stone-800 text-xs font-semibold shadow-sm" id="dynamic-trusted-badge">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] leading-none uppercase tracking-wider text-stone-600 font-bold">
                  🤝 Trusted by
                </span>
                
                {/* Physical Flip-Clock Digits representation */}
                <div className="flex gap-[2.5px] items-center">
                  {String(displayCount).padStart(2, '0').split('').map((digit, i) => (
                    <div key={i} className="relative w-6 h-8 bg-stone-900 border border-stone-950 text-[#F59E0B] font-mono font-extrabold text-[17px] flex items-center justify-center rounded-md shadow-md overflow-hidden">
                      {/* Split dividing line representing flip clock leaf */}
                      <div className="absolute inset-x-0 top-0 h-[48%] bg-white/5 border-b border-black/40"></div>
                      <span className="relative z-10 leading-none select-none tracking-normal">{digit}</span>
                    </div>
                  ))}
                </div>

                <span className="font-mono text-[11px] leading-none uppercase tracking-wider text-stone-600 font-bold">
                  Corporate Clients
                </span>
              </div>
            </div>

            {/* Smart Integrated Search */}
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2" id="hero-search-form">
              <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-lg border border-stone-200 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <Search className="w-5 h-5 text-stone-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search Dehydrated Garlic, Onion flakes, Tomato powder..."
                  className="w-full px-3 py-3 text-stone-800 placeholder-stone-400 bg-transparent border-none focus:outline-none focus:ring-0 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="hero-search-input"
                />
                <button
                  type="submit"
                  className="bg-emerald-850 hover:bg-emerald-900 text-stone-950 font-medium px-6 py-3 rounded-xl text-sm transition-all shadow-md shrink-0 cursor-pointer"
                  id="hero-search-submit"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Trending Tags */}
            <div className="pt-2 text-stone-500 text-sm flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="font-mono text-xs">Trending:</span>
              {trendingSearches.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchTerm(tag.label);
                    onSearch(tag.label);
                    onSelectCategory(tag.id);
                    onExploreProducts();
                  }}
                  className="bg-stone-100/80 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200/80 px-2.5 py-1 rounded-md text-xs font-medium text-stone-700 transition-all cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Micro-Features Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left border-t border-stone-200/60 font-mono">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-emerald-900 leading-none">100% Purity</span>
                <span className="text-[10px] text-stone-500 tracking-tight uppercase block mt-1">Dehydrated Grade</span>
              </div>
              <div className="border-x border-stone-200 px-2">
                <span className="block text-xl sm:text-2xl font-bold text-amber-800 leading-none">12+ Months</span>
                <span className="text-[10px] text-stone-500 tracking-tight uppercase block mt-1">Stable Shelf Life</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-stone-900 leading-none">35+ Countries</span>
                <span className="text-[10px] text-stone-500 tracking-tight uppercase block mt-1">Global Destinations</span>
              </div>
            </div>

          </div>

          {/* Premium Visual Collage Section */}
          <div className="lg:col-span-5 relative" id="hero-graphic-collage">
            <div className="space-y-4">
              {/* Product Card Graphic (Simulating high processing standard) */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group select-none">
                <img
                  src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
                  alt="Dryza Spices Dehydrated Products"
                  className="w-full h-80 object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white p-2">
                  <span className="bg-amber-600 text-white text-[10px] font-mono tracking-wider font-extrabold px-2 py-1 rounded mb-1.5 inline-block uppercase">
                    Premium Grade Preserved Garlic
                  </span>
                  <h4 className="text-xl font-bold font-sans">Controlled Low Heat Drying</h4>
                  <p className="text-xs text-stone-200 mt-1">98% volatile culinary oils captured naturally inside slices.</p>
                </div>
              </div>

              {/* Float Quality Badge */}
              <div className="absolute -top-4 -left-4 bg-[#FCFBF7] p-3.5 rounded-xl shadow-xl border border-stone-200/80 flex items-center space-x-3 max-w-xs animate-bounce" style={{ animationDuration: '6s' }}>
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-900">BRCGS Food Safety</h5>
                  <p className="text-[10px] text-stone-500 font-mono">Certified AA Grade Standards</p>
                </div>
              </div>

              {/* B2B Sourcing Callout Widget */}
              <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-lg flex items-center justify-between border border-emerald-950/40">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-350">
                    <Globe className="w-5 h-5 text-emerald-350" />
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-emerald-250 font-mono">Container Load (FCL/LCL)</span>
                    <span className="block text-sm font-bold">Inquire Container Capacity</span>
                  </div>
                </div>
                <button
                  onClick={onExploreProducts}
                  className="bg-white hover:bg-amber-50 text-emerald-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
