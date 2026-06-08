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
  const [role, setRole] = useState<'corporate' | 'cs'>('corporate');
  const [csType, setCsType] = useState('');
  
  // OTP States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [pendingUserToLogin, setPendingUserToLogin] = useState<Customer | null>(null);

  if (!isOpen) return null;
  
  // Login States
  const [loginPhone, setLoginPhone] = useState('');
  
  // Error state
  const [error, setError] = useState('');

  const requestOtp = async (phoneToUse: string) => {
    setIsLoadingOtp(true);
    setError('');
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneToUse })
      });
      const data = await res.json();
      if (data.Status === 'Success') {
        setSessionId(data.Details);
        setIsOtpSent(true);
      } else {
        setError(data.Details || data.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP network error.');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isOtpSent) {
      if (!loginPhone) {
        setError('Please enter your registered phone number.');
        return;
      }
      const matched = customers.find(
        (c) => c.phone.trim() === loginPhone.trim() || c.email.trim() === loginPhone.trim()
      );
      if (!matched) {
        setError('No customer account found. Please register to continue.');
        return;
      }
      setPendingUserToLogin(matched);
      await requestOtp(matched.phone);
      return;
    }

    // OTP verification
    setIsLoadingOtp(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, otp: otpCode })
      });
      const data = await res.json();
      if (data.Status === 'Success' && pendingUserToLogin) {
        onLogin(pendingUserToLogin);
        onClose();
      } else {
        setError(data.Details || data.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isOtpSent) {
      if (!fullName || !email || !phone || !companyName || !country) {
        setError('Please fill out all mandatory registered particulars.');
        return;
      }
      if (role === 'cs' && !csType.trim()) {
        setError('Please enter a CS Type for your representative account.');
        return;
      }
      const exists = customers.some(
        (c) => c.phone.trim() === phone.trim() || c.email.toLowerCase().trim() === email.toLowerCase().trim()
      );
      if (exists) {
        setError('An account with this email/phone is already registered. Please login.');
        return;
      }
      await requestOtp(phone);
      return;
    }

    // OTP verification for Registration
    setIsLoadingOtp(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, otp: otpCode })
      });
      const data = await res.json();
      if (data.Status === 'Success') {
        const newCustomer: Customer = {
          id: `cs-${Date.now()}`,
          fullName,
          email: email.toLowerCase().trim(),
          phone,
          companyName,
          country,
          password: 'OTP_AUTH',
          role,
          csType: role === 'cs' ? csType : undefined,
        };
        onRegister(newCustomer);
        onLogin(newCustomer);
        onClose();
      } else {
        setError(data.Details || data.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setIsLoadingOtp(false);
    }
  };

  // Reset OTP states when switching tabs
  const resetAuthMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setIsOtpSent(false);
    setOtpCode('');
    setSessionId('');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4" id="customer-auth-overlay">
      <div className="bg-[#FAF9F5] rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl relative space-y-6 animate-fade-in text-center">
        
        {/* Modal Branding Header */}
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-full hover:bg-stone-100 transition-colors"
            id="close-customer-auth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
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
            onClick={() => resetAuthMode('login')}
            className={`py-2 text-xs font-bold rounded-lg font-mono transition-all cursor-pointer ${
              mode === 'login' 
                ? 'bg-emerald-800 text-white shadow-sm font-black' 
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => resetAuthMode('register')}
            className={`py-2 text-xs font-bold rounded-lg font-mono transition-all cursor-pointer ${
              mode === 'register' 
                ? 'bg-teal-700 text-white shadow-sm font-black' 
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

        {/* Google Authentication */}
        {!isOtpSent && (
        <div>
          <button
            type="button"
            onClick={async () => {
              try {
                const { signInWithPopup } = await import('../lib/firebase');
                const result = await signInWithPopup();
                const user = result.user;
                
                // See if customer exists
                let matched = customers.find(c => c.email.toLowerCase() === user.email?.toLowerCase());
                if (!matched) {
                  setError('No customer account found with this Google email. Please register first.');
                  return;
                }
                onLogin(matched);
                onClose();
              } catch (err: any) {
                setError(err.message || 'Google Auth Failed');
              }
            }}
            className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
        )}

        {!isOtpSent && (
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-[#FAF9F5] px-3 text-[10px] uppercase font-mono font-bold text-stone-400 absolute">Or use Phone OTP</span>
          </div>
        )}

        {mode === 'login' ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left" id="cs-login-form">
            {!isOtpSent ? (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  Registered Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Phone className="w-4 h-4 text-stone-400" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6205284423"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-sans"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 animate-fade-in">
                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  Enter OTP Sent to {pendingUserToLogin?.phone}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-emerald-300 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-mono tracking-widest"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingOtp}
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md ${
                isLoadingOtp ? 'bg-stone-300 text-stone-500' : 'bg-emerald-900 hover:bg-emerald-950 text-stone-50'
              }`}
            >
              {isLoadingOtp ? 'Processing...' : isOtpSent ? 'Verify OTP to Login' : 'Send OTP to Login'}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left max-h-[45vh] overflow-y-auto pr-1" id="cs-register-form">
            {!isOtpSent ? (
              <>
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
                      Contact Number (OTP)
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
              </>
            ) : (
              <div className="space-y-1.5 animate-fade-in py-6">
                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest text-center mb-4">
                  Enter OTP Sent to {phone}
                </label>
                <div className="relative max-w-[200px] mx-auto">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="6-digit OTP"
                    className="w-full text-sm pl-12 pr-4 py-3 bg-white border-2 border-emerald-400 rounded-xl focus:border-emerald-700 focus:bg-white outline-none font-mono tracking-widest text-center font-bold"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingOtp}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all mt-4 shadow ${
                isLoadingOtp ? 'bg-stone-300 text-stone-500' : 'bg-emerald-800 hover:bg-emerald-900 text-stone-50'
              }`}
            >
              {isLoadingOtp ? 'Processing...' : isOtpSent ? 'Verify OTP & Register' : 'Request OTP to Register'}
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
