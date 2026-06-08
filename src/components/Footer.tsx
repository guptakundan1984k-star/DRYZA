import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Shield, Award, Calendar } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openBulkForm: () => void;
  logoUrl?: string;
  fssaiLicNo?: string;
  onSecretAdminTripleClick?: () => void;
}

export default function Footer({ setCurrentTab, openBulkForm, logoUrl = '', fssaiLicNo = '12724999000234', onSecretAdminTripleClick }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [fssaiClicks, setFssaiClicks] = useState(0);

  const handlePageNavigate = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFssaiClick = () => {
    const now = Date.now();
    setFssaiClicks(prev => {
      const lastClick = (window as any).__lastFssaiClick || 0;
      (window as any).__lastFssaiClick = now;
      if (now - lastClick > 1200) {
        // More than 1.2s since last click, restart count
        return 1;
      }
      const newCount = prev + 1;
      if (newCount >= 3) {
        if (onSecretAdminTripleClick) onSecretAdminTripleClick();
        return 0; // Reset
      }
      return newCount;
    });
  };

  return (
    <footer className="bg-stone-950 text-stone-100 font-sans mt-20 border-t border-stone-800" id="master-page-footer">
      
      {/* Upper Certifications Trust Corridor */}
      <div className="bg-stone-900/60 border-b border-stone-805 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="block text-[10px] font-mono text-amber-500 font-black tracking-widest uppercase mb-1">
              Sanitation Clearance
            </span>
            <p className="text-xs text-stone-300">
              100% compliant food-grade facilities. Monitored continuously under peak BRCGS guidelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono uppercase bg-stone-950/40 p-2 px-4 rounded-xl border border-stone-800 text-stone-400">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> BRCGS Food Safety</span>
            <span className="text-stone-700">|</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> ISO 22000:2018</span>
            <span className="text-stone-700">|</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> US-FDA Registered</span>
            <span className="text-stone-700">|</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-500" /> FSSAI Certified</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand Info segment */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="DRYZA Logo" className="w-full h-full object-contain rounded-xl shadow-sm" />
                ) : (
                  <Logo size="100%" />
                )}
              </div>
              <h4 className="text-lg font-bold text-stone-100 tracking-tight font-sans">
                DRYZA <span className="text-amber-500 font-semibold text-base font-sans">SPICES</span>
              </h4>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Dryza Spices is India's leading industrial producer and supplier of premium-grade dehydrated products, customized seasoning mixtures, and bulk food-industry ingredients. Freshness preserved naturally from contracted acres.
            </p>

            <div className="space-y-1.5 text-xs font-mono text-stone-500">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-stone-600 mt-0.5 shrink-0" />
                <span>Survey No. 124, GIDC Industrial Processing Estate, Mahuva-364290, Gujarat, India</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Mail className="w-4 h-4 text-stone-600 mt-0.5 shrink-0" />
                <span>corporate@dryza-spices.com</span>
              </div>
            </div>

            {/* FSSAI Registration Badge */}
            <div 
              className="pt-2 flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 w-fit cursor-pointer select-none transition-colors hover:bg-white/10" 
              onClick={handleFssaiClick}
              title="FSSAI Registration"
            >
              <div className="bg-white p-1 rounded-md flex items-center justify-center shrink-0 w-11 h-7">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/FSSAILogo.svg/1200px-FSSAILogo.svg.png" 
                  alt="FSSAI Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-0.5 pointer-events-none">
                <span className="block text-[8px] font-mono font-bold tracking-widest text-[#22C55E] uppercase leading-none">fssai lic. no.</span>
                <span className="block text-[11px] font-mono font-black text-white/90 leading-none">{fssaiLicNo}</span>
              </div>
            </div>
          </div>

          {/* Links column 1: Products */}
          <div className="md:col-span-2.5 space-y-3">
            <span className="text-[10.5px] uppercase font-mono tracking-widest text-amber-500 font-bold block">
              Our Products
            </span>
            <ul className="space-y-1.5 text-xs text-stone-401">
              {['Dehydrated Garlic Flakes', 'Dehydrated Onion Flakes', 'Garlic Granules', 'Onion Powder Premium', 'Tomato Powder Premium', 'Custom Seasoning Blends'].map((linkText, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handlePageNavigate('catalogue')}
                    className="hover:text-amber-500 cursor-pointer transition-colors"
                  >
                    {linkText}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links column 2: Resources and pages */}
          <div className="md:col-span-2.5 space-y-3">
            <span className="text-[10.5px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
              B2B Solutions
            </span>
            <ul className="space-y-1.5 text-xs text-stone-401">
              <li>
                <button onClick={() => handlePageNavigate('process')} className="hover:text-emerald-400 cursor-pointer">
                  Dehydration Technology
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNavigate('industries')} className="hover:text-emerald-400 cursor-pointer">
                  Industries Served
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNavigate('recipes')} className="hover:text-emerald-400 cursor-pointer">
                  Culinary Formulations
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNavigate('about')} className="hover:text-emerald-400 cursor-pointer">
                  About Dryza Brand
                </button>
              </li>
              <li>
                <button onClick={openBulkForm} className="hover:text-emerald-400 cursor-pointer text-amber-500 font-semibold font-mono">
                  ★ Launch RFQ Inquirer
                </button>
              </li>
            </ul>
          </div>

          {/* Links column 3: Legals and policies */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[10.5px] uppercase tracking-widest font-mono text-stone-500 block">
              Policies (Legal)
            </span>
            <ul className="space-y-1.5 text-xs text-stone-401">
              <li>
                <button onClick={() => handlePageNavigate('privacy')} className="hover:text-stone-300 cursor-pointer">
                  Privacy Protection
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNavigate('shipping')} className="hover:text-stone-300 cursor-pointer">
                  FOB & CIF Shipping
                </button>
              </li>
              <li>
                <button onClick={() => handlePageNavigate('terms')} className="hover:text-stone-300 cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower row details */}
        <div className="mt-12 pt-8 border-t border-stone-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-stone-500">
          <div>
            <span>© {currentYear} Dryza Spices Private Limited. All Rights Reserved. APEDA registered.</span>
          </div>
          <div>
            <span>Designed to compete with global food processing standards.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
