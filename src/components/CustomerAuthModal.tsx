import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Eye, EyeOff, Building, Mail, Phone, Globe, User } from 'lucide-react';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  password?: string;
  role?: 'corporate' | 'cs';
  csType?: string;
}

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onRegister: (customer: Customer) => void;
  onLogin: (customer: Customer) => void;
  initialMode?: 'login' | 'register';
}

export default function CustomerAuthModal({
  isOpen,
  onClose,
  customers,
  onRegister,
  onLogin,
  initialMode = 'login',
}: CustomerAuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Registration States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('India');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState<'corporate' | 'cs'>('corporate');
  const [csType, setCsType] = useState('');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Error state
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Password Strength helper
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty password', color: 'bg-stone-200', textClass: 'text-stone-400' };
    
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 15;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

    if (score < 40) return { score, label: 'Weak', color: 'bg-red-500', textClass: 'text-red-500' };
    if (score < 75) return { score, label: 'Medium', color: 'bg-amber-500', textClass: 'text-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500', textClass: 'text-emerald-500' };
  };

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please fill out all the mandatory fields.');
      return;
    }

    const matched = customers.find(
      (c) => c.email.toLowerCase().trim() === loginEmail.toLowerCase().trim()
    );

    if (!matched) {
      setError('No customer account found with this email. Please register.');
      return;
    }

    if (matched.password !== loginPassword) {
      setError('Incorrect password. Please try again.');
      return;
    }

    onLogin(matched);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phone || !companyName || !country || !registerPassword) {
      setError('Please fill out all mandatory registered particulars.');
      return;
    }

    if (registerPassword.length < 5) {
      setError('Password must be at least 5 characters for corporate safety.');
      return;
    }

    if (role === 'cs' && !csType.trim()) {
      setError('Please enter a CS Type for your representative account.');
      return;
    }

    const exists = customers.some(
      (c) => c.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (exists) {
      setError('An account with this email address is already registered. Please login.');
      return;
    }

    const newCustomer: Customer = {
      id: `cs-${Date.now()}`,
      fullName,
      email: email.toLowerCase().trim(),
      phone,
      companyName,
      country,
      password: registerPassword,
      role,
      csType: role === 'cs' ? csType : undefined,
    };

    onRegister(newCustomer);
    onLogin(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4" id="customer-auth-overlay">
      <div className="bg-[#FAF9F5] rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl relative space-y-6 animate-fade-in text-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-full hover:bg-stone-100 transition-colors"
          id="close-customer-auth"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center mx-auto">
            {mode === 'login' ? <LogIn className="w-6 h-6 text-emerald-800" /> : <UserPlus className="w-6 h-6 text-emerald-800" />}
          </div>
          <h3 className="text-xl font-extrabold text-stone-950 font-sans tracking-tight">
            Sign In or Register
          </h3>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">
            {mode === 'login' 
              ? 'Access the Dryza Spices commercial wholesale pipeline, add products to cart, and checkout.' 
              : 'Register to unlock automated promo coupons, track shopping cart orders, and spin the challenge wheel.'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 bg-stone-200/60 p-1.5 rounded-xl border border-stone-200/30">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg font-mono transition-all ${
              mode === 'login' 
                ? 'bg-white text-emerald-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-lg font-mono transition-all ${
              mode === 'register' 
                ? 'bg-white text-emerald-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs py-2 px-3 rounded-xl border border-red-200 text-center font-mono font-medium">
            ⚠️ {error}
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left" id="cs-login-form">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                Business Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="w-4 h-4 text-stone-400" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-sans"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                Secret Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Shield className="w-4 h-4 text-stone-400" />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Enter account password..."
                  className="w-full text-xs pl-10 pr-10 py-3 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-mono"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-900 hover:bg-emerald-950 text-white py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Sign In to B2B Network
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left max-h-[45vh] overflow-y-auto pr-1" id="cs-register-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                  Contact Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kenneth Cole"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Company Legal Name */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                  Company Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asia Foods Ltd."
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="buyer@mycompany.com"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                  Contact Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 982..."
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Destination Port Country */}
              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                  Destination Country
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Globe className="w-3.5 h-3.5 text-stone-400" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Germany"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

            </div>

            {/* Account Role Selection */}
            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                Account Role Group *
              </label>
              <select
                className="w-full text-xs px-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-sans"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="corporate">B2B Corporate Client</option>
                <option value="cs">CS Representative</option>
              </select>
            </div>

            {/* Conditional CS Type Input */}
            {role === 'cs' && (
              <div className="space-y-1">
                <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                  CS Type (Required) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-Tier-1, CS-Executive"
                  className="w-full text-xs px-3 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none"
                  value={csType}
                  onChange={(e) => setCsType(e.target.value)}
                />
              </div>
            )}

            {/* Secret Password */}
            <div className="space-y-1">
              <label className="block text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                Create Account Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="Minimum 5 characters..."
                  className="w-full text-xs pl-9 pr-10 py-2.5 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-mono"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Advanced Password Strength Meter */}
              {registerPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[9px] font-mono font-bold">
                    <span className="text-stone-400">STRENGTH:</span>
                    <span className={getPasswordStrength(registerPassword).textClass}>
                      {getPasswordStrength(registerPassword).label.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
                    <div
                      className={`${getPasswordStrength(registerPassword).color} h-1 rounded-full transition-all duration-300`}
                      style={{ width: `${getPasswordStrength(registerPassword).score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-990 hover:bg-stone-900 bg-emerald-800 hover:bg-emerald-900 text-[#FAF9F5] py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all mt-2 cursor-pointer shadow"
            >
              Register & Sign In
            </button>
          </form>
        )}

        {/* Informative Footer */}
        <div className="text-[10px] text-stone-400 font-mono text-center border-t border-stone-100 pt-3">
          Protected under bilaterals corporate secure B2B protocols.
        </div>
      </div>
    </div>
  );
}
