import React, { useState, useEffect } from 'react';
import { Banner } from '../types';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface HomepageBannersProps {
  banners: Banner[];
  setCurrentTab: (tab: string) => void;
}

export default function HomepageBanners({ banners, setCurrentTab }: HomepageBannersProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBanners = banners || [];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000); // cycle every 6 seconds
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
  };

  const currentBanner = activeBanners[activeIndex];

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'catalogue': return 'Explore Dry-Mill Catalog';
      case 'community': return 'Join Culinary Cook-Off';
      case 'rewards': return 'Claim Client Rewards';
      default: return 'Discover More';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4" id="homepage-banners-carousel">
      <div className="relative h-[280px] sm:h-[340px] rounded-3xl overflow-hidden shadow-md border border-stone-200 bg-stone-900 group">
        {/* Background Image with elegant fade transition */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform"
          style={{ 
            backgroundImage: `url(${currentBanner.imageUrl || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200'})`,
          }}
        />
        
        {/* Gradient Overlay for superior text contrast (Usability / Accessibility) */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/60 to-transparent" />

        {/* Banner Content Container */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 md:px-16 text-left max-w-2xl z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-md max-w-fit mb-3.5 font-bold border border-amber-500/20">
            Corporate Spotlight
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#FAF9F5] tracking-tight leading-tight line-clamp-2">
            {currentBanner.title}
          </h2>
          <p className="mt-2.5 text-stone-200 text-xs sm:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed font-sans font-medium text-stone-300">
            {currentBanner.subtitle}
          </p>
          
          {currentBanner.linkTab && (
            <div className="mt-4 sm:mt-5">
              <button
                onClick={() => setCurrentTab(currentBanner.linkTab || 'home')}
                className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl text-xs font-black font-mono transition-all duration-200 cursor-pointer shadow flex items-center gap-1.5 transform hover:translate-x-1"
              >
                <span>{getTabLabel(currentBanner.linkTab)}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Left / Right Chevron Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-amber-500 hover:text-stone-950 text-[#FAF9F5] flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none border border-stone-700 z-20"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-900/60 hover:bg-amber-500 hover:text-stone-950 text-[#FAF9F5] flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none border border-stone-700 z-20"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Carousel Bullet Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-stone-950/40 px-2.5 py-1.5 rounded-full backdrop-blur-xs">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? 'bg-amber-500 w-3' : 'bg-stone-500/80 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
