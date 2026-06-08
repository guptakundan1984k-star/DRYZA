import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Lock, Database, Award, BookOpen, Clock } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  inquiryCount: number;
  openInquiryForm: () => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  logoUrl?: string;
  loggedInCustomer: any | null;
  onOpenClientAuth: () => void;
  onClientLogout: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  inquiryCount,
  openInquiryForm,
  isAdmin,
  setIsAdmin,
  logoUrl = '',
  loggedInCustomer,
  onOpenClientAuth,
  onClientLogout,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Nav Links setup
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalogue', label: 'Products' },
    { id: 'recipes', label: 'Recipes Blog' },
    { id: 'process', label: 'Technology & Quality' },
    { id: 'industries', label: 'B2B Solutions' },
    { id: 'community', label: 'Community Lab 🌶️' },
    { id: 'rewards', label: 'Dryza Rewards 🎁' },
    { id: 'orders', label: 'My Orders 📋' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAF9F5] border-b border-stone-200/80 backdrop-blur-md bg-opacity-95" id="main-nav-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3.5 cursor-pointer group"
              id="nav-logo-button"
            >
              <div className="w-12 h-12 transform group-hover:rotate-[6deg] group-hover:scale-105 transition-all duration-300 shrink-0 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="DRYZA Logo" className="w-full h-full object-contain rounded-xl shadow-sm" />
                ) : (
                  <Logo size="100%" />
                )}
              </div>
              <div className="text-left">
                <span className="block text-xl font-extrabold text-stone-950 tracking-tight leading-none font-display">
                  DRYZA <span className="text-amber-700 font-medium text-lg font-sans">SPICES</span>
                </span>
                <span className="block text-[9px] text-emerald-800 font-mono tracking-widest uppercase mt-0.5">
                  Dehydration Excellence
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  currentTab === item.id
                    ? 'text-emerald-800 bg-emerald-50/80 font-semibold shadow-inner-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Area */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Client Account Sessions */}
            {loggedInCustomer ? (
              <div className="flex items-center gap-2 bg-emerald-50/60 border border-emerald-150 py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-900" id="navbar-buyer-session">
                <span className="max-w-[120px] truncate" title={`${loggedInCustomer.fullName} - ${loggedInCustomer.companyName}`}>
                  👤 {loggedInCustomer.companyName}
                </span>
                <button
                  onClick={onClientLogout}
                  className="text-[10px] text-red-650 hover:text-red-800 font-bold ml-1 hover:underline cursor-pointer"
                  title="Sign Out of B2B Portal"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenClientAuth}
                className="text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer border border-stone-250/20"
                id="client-sigin-button"
              >
                Client Login
              </button>
            )}

            {/* Inquiries Bin Shortcut */}
            <button
              onClick={openInquiryForm}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
              title="Your Shopping Cart & Checkout"
              id="nav-inquiry-shortcut"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {inquiryCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {inquiryCount}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={openInquiryForm}
              className="bg-emerald-850 hover:bg-emerald-900 text-stone-950 px-5 py-2.5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer border border-emerald-950/20"
              id="nav-cta-quote"
            >
              My Cart
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Mobile Inquiries Badge icon */}
            <button
              onClick={openInquiryForm}
              className="relative p-2 text-stone-600 rounded-lg"
              id="mobile-inquiry-shortcut"
            >
              <ShoppingCart className="w-6 h-6" />
              {inquiryCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {inquiryCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              id="mobile-menu-trigger"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 px-2 pt-2 pb-4 space-y-1 shadow-lg animate-fade-in-down" id="mobile-nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                currentTab === item.id
                  ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-700'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
              id={`mobile-nav-link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 pb-2 border-t border-stone-200 px-4 flex flex-col gap-3">
            {loggedInCustomer ? (
              <div className="flex justify-between items-center bg-emerald-50/80 border border-emerald-150 p-3 rounded-xl text-xs" id="mobile-buyer-session">
                <span className="font-semibold text-emerald-955 text-emerald-900">👤 {loggedInCustomer.companyName}</span>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onClientLogout();
                  }}
                  className="bg-red-50 text-red-650 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-[10.5px] border border-red-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenClientAuth();
                }}
                className="w-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 py-3 rounded-xl text-center font-bold text-xs shadow-inner-sm"
              >
                Sign In as Corporate Client
              </button>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                openInquiryForm();
              }}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-lg text-center font-bold shadow-md"
              id="mobile-nav-cta"
            >
              My Shopping Cart
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
