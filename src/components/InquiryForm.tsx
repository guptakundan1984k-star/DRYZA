import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Product, Inquiry, Coupon } from '../types';
import { X, ClipboardCheck, Trash2, Calendar, FileSpreadsheet, Plus, CheckCircle2, ChevronRight, Upload, Info, Lock, LogIn, UserPlus, Eye, EyeOff, Building, Mail, Phone, Globe, User, Gift, RefreshCw } from 'lucide-react';

interface InquiryFormProps {
  allProducts: Product[];
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct: (product: Product) => void;
  onSubmitInquiry: (inquiry: Omit<Inquiry, 'id' | 'submittedAt' | 'status'>) => Inquiry;
  onClose: () => void;
  loggedInCustomer: any | null;
  customers: any[];
  onRegister: (customer: any) => void;
  onLogin: (customer: any) => void;
  coupons?: Coupon[];
  wheelSettings?: any;
  onSpinWheelForOrder?: (orderId: string, prizeLabel: string) => void;
  onUpdateCustomerPoints?: (points: number, reason: string) => void;
  onAddUnlockedOffer?: (offer: any) => void;
  cartQuantities?: Record<string, number>;
  onIncrementQuantity?: (productId: string) => void;
  onDecrementQuantity?: (productId: string) => void;
  isFullPage?: boolean;
}

export default function InquiryForm({
  allProducts,
  selectedProducts,
  onRemoveProduct,
  onAddProduct,
  onSubmitInquiry,
  onClose,
  loggedInCustomer,
  customers,
  onRegister,
  onLogin,
  coupons = [],
  wheelSettings,
  onSpinWheelForOrder,
  onUpdateCustomerPoints,
  onAddUnlockedOffer,
  cartQuantities,
  onIncrementQuantity,
  onDecrementQuantity,
  isFullPage = false
}: InquiryFormProps) {
  // Inline Auth states if client is not logged in
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Registration Fields (if not logged in)
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regCountry, setRegCountry] = useState('India');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'corporate' | 'cs'>('corporate');
  const [regCsType, setRegCsType] = useState('');

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

  // Coupon promo code states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Login Fields
  const [logEmail, setLogEmail] = useState('');
  const [logPassword, setLogPassword] = useState('');

  // Form State
  const [companyName, setCompanyName] = useState(loggedInCustomer?.companyName || '');
  const [fullName, setFullName] = useState(loggedInCustomer?.fullName || '');
  const [email, setEmail] = useState(loggedInCustomer?.email || '');
  const [phone, setPhone] = useState(loggedInCustomer?.phone || '');
  const [country, setCountry] = useState(loggedInCustomer?.country || 'India');
  const [customerType, setCustomerType] = useState<'restaurant' | 'manufacturer' | 'seasoning_brand' | 'hotel' | 'trader' | 'retail_buyer' | 'distributor'>('manufacturer');
  const [message, setMessage] = useState('');

  // Reactively calculate total quantity logic
  const estimatedQuantityKg = useMemo(() => {
    return selectedProducts.reduce((sum, item) => {
      const qty = (cartQuantities && cartQuantities[item.id]) ?? 1;
      return sum + qty;
    }, 0);
  }, [selectedProducts, cartQuantities]);

  // Sychronize customer credentials when they log in
  useEffect(() => {
    if (loggedInCustomer) {
      setCompanyName(loggedInCustomer.companyName || '');
      setFullName(loggedInCustomer.fullName || '');
      setEmail(loggedInCustomer.email || '');
      setPhone(loggedInCustomer.phone || '');
      setCountry(loggedInCustomer.country || 'India');
    }
  }, [loggedInCustomer]);
  
  // Custom File attachments
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Created Inquiry state for tracking order qualification & outcomes
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);

  // Spin wheel states
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [hasWheelSpun, setHasWheelSpun] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter out products already selected
  const availableToSelect = allProducts.filter(
    (ap) => !selectedProducts.some((sp) => sp.id === ap.id)
  );

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setAttachedFile(file);
    // Simulate interactive micro upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const computedBasePrice = useMemo(() => {
    let pricePool = 0;
    selectedProducts.forEach(prod => {
      let prodPrice = 350; // fallback
      const priceStr = loggedInCustomer?.role === 'cs' ? (prod.csPricePerKgRange || prod.pricePerKgRange) : prod.pricePerKgRange;
      const matches = priceStr.match(/[\d.]+/g);
      if (matches && matches.length >= 1) {
        const parsed = matches.map(Number);
        prodPrice = parsed.length === 2 ? (parsed[0] + parsed[1]) / 2 : parsed[0];
      }
      pricePool += prodPrice;
    });
    return pricePool > 0 ? (pricePool / selectedProducts.length) : 350; // Avg
  }, [selectedProducts, loggedInCustomer]);

  const computedSubtotal = useMemo(() => estimatedQuantityKg * computedBasePrice, [estimatedQuantityKg, computedBasePrice]);

  const executeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      alert("Please select at least one dehydrated product for your cart.");
      return;
    }
    if (!companyName || !fullName || !email || !phone) {
      alert("Please fill out all mandatory business information fields.");
      return;
    }

    let computedDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        computedDiscount = Math.round((computedSubtotal * appliedCoupon.value) / 100);
      } else {
        computedDiscount = appliedCoupon.value;
      }
    }
    const finalCalculatedPrice = Math.max(0, computedSubtotal - computedDiscount);

    const savedInq = onSubmitInquiry({
      productIds: selectedProducts.map((p) => p.id),
      productNames: selectedProducts.map((p) => p.name),
      companyName,
      fullName,
      email,
      phone,
      country,
      customerType,
      estimatedQuantityKg,
      message: message || `Standard commercial bulk order for ${selectedProducts.map((p) => p.name).join(', ')}.`,
      attachmentName: attachedFile ? attachedFile.name : undefined,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      discountAmount: computedDiscount > 0 ? computedDiscount : undefined,
      totalPrice: finalCalculatedPrice,
      csType: loggedInCustomer?.role === 'cs' ? loggedInCustomer.csType : undefined,
    });

    setCreatedInquiry(savedInq);
    setIsSubmitted(true);
  };

  const formContent = (
    <div className={`relative bg-[#FCFBF7] rounded-3xl w-full text-stone-900 overflow-hidden ${isFullPage ? 'border border-stone-200' : 'max-w-4xl shadow-2xl border border-stone-200'}`}>
        
        {/* Banner with close */}
        <div className="bg-emerald-900 text-stone-100 p-6 flex justify-between items-center border-b border-stone-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-350">
              <ClipboardCheck className="w-6 h-6 text-emerald-350" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-300 font-bold block">
                Dryza Spices Corporate
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans">B2B Shopping Cart & Checkout</h2>
            </div>
          </div>
          {!isFullPage && (
            <button
              onClick={onClose}
              className="p-2 text-emerald-250 hover:text-stone-950 hover:bg-emerald-800 rounded-full transition-colors cursor-pointer"
              id="close-cart-box"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {isSubmitted ? (
          (() => {
            const minCartVal = wheelSettings?.spinMinCartValue ?? 499;
            const qualifies = createdInquiry && (createdInquiry.totalPrice || 0) >= minCartVal;
            const activeSectors = (wheelSettings && wheelSettings.sectors && wheelSettings.sectors.length === 8) 
              ? wheelSettings.sectors 
              : [
                  { label: '50 XP Points', value: 'points:50', color: '#115E59', probability: 15 },
                  { label: '10% B2B Coupon', value: 'coupon:DRYZA10', color: '#D97706', probability: 15 },
                  { label: '100 XP Points', value: 'points:100', color: '#0F766E', probability: 15 },
                  { label: 'Free B2B Sample', value: 'offer:Freesample', color: '#B45309', probability: 10 },
                  { label: '250 XP Points', value: 'points:250', color: '#0D9488', probability: 15 },
                  { label: '15% Volume Discount', value: 'coupon:PLATINUM15', color: '#92400E', probability: 10 },
                  { label: '500 XP Points', value: 'points:500', color: '#047857', probability: 10 },
                  { label: 'Surprise Gift Pack', value: 'offer:Surprisepack', color: '#78350F', probability: 10 }
                ];

            const handleInlineSpin = () => {
              if (isSpinning || hasWheelSpun || !createdInquiry) return;

              setIsSpinning(true);
              setSpinResult(null);

              // Weighted selection
              let sectorIndex = 0;
              const totalWeight = activeSectors.reduce((acc: number, curr: any) => acc + (curr.probability || 10), 0);
              let rand = Math.random() * (totalWeight || 100);
              for (let i = 0; i < activeSectors.length; i++) {
                const weight = activeSectors[i].probability || 10;
                if (rand < weight) {
                  sectorIndex = i;
                  break;
                }
                rand -= weight;
              }

              const sectorDegrees = 360 / activeSectors.length;
              const targetSector = activeSectors[sectorIndex];
              const targetDegrees = 3600 - (sectorIndex * sectorDegrees) - (sectorDegrees / 2);

              setRotation(targetDegrees);

              setTimeout(() => {
                setIsSpinning(false);
                setSpinResult(targetSector.label);
                setHasWheelSpun(true);

                if (onSpinWheelForOrder) {
                  onSpinWheelForOrder(createdInquiry.id, targetSector.label);
                }

                // Award points/coupons
                const [type, val] = targetSector.value.split(':');
                const todayStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                if (type === 'points') {
                  const pointsNum = parseInt(val, 10);
                  if (onUpdateCustomerPoints) {
                    onUpdateCustomerPoints(pointsNum, `Wheel Spin Reward for Order ${createdInquiry.id}: ${targetSector.label}`);
                  }
                } else if (type === 'coupon' || type === 'offer') {
                  if (onAddUnlockedOffer) {
                    onAddUnlockedOffer({
                      id: `spin-${Date.now()}`,
                      title: targetSector.label,
                      rewardCode: val,
                      description: type === 'coupon' ? `Apply custom invoice discount code [${val}] at quoting.` : `Valid for your next checkout inquiry.`,
                      dateEarned: todayStr
                    });
                  }
                  if (onUpdateCustomerPoints) {
                    onUpdateCustomerPoints(20, `Checked out order spin bonus XP`);
                  }
                }
              }, 4100);
            };

            return (
              <div className="p-6 md:p-10 text-center max-h-[80vh] overflow-y-auto space-y-6" id="cart-success-gate">
                {qualifies ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-left">
                    
                    {/* Left Column: Inquiry Ticket Details */}
                    <div className="md:col-span-5 space-y-5 text-center md:text-left bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto md:mx-0 shadow-xs">
                        <CheckCircle2 className="w-9 h-9 text-emerald-800" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-stone-900 tracking-tight">Order Placed!</h3>
                        <p className="text-xs text-stone-505 leading-snug">
                          Your custom spice order matches corporate high-speed dispatch! Ticket <span className="font-mono font-bold text-amber-800 bg-amber-50 px-1 rounded">{createdInquiry?.id}</span> is live.
                        </p>
                      </div>

                      <div className="bg-stone-50 p-4.5 rounded-xl border border-stone-150 text-left space-y-2 text-[11px] font-sans">
                        <span className="font-mono text-[8px] uppercase tracking-wider text-stone-400 font-bold block">
                          Response SLA Details
                        </span>
                        <div className="flex justify-between border-b pb-1 font-mono">
                          <span className="text-stone-500">Order Value:</span>
                          <span className="font-bold text-stone-800">₹{createdInquiry?.totalPrice}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 font-mono">
                          <span className="text-stone-500">Representative Desk:</span>
                          <span className="font-bold text-emerald-900">4 Hours Response SLA</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 font-mono">
                          <span className="text-stone-505">Destination:</span>
                          <span className="font-bold truncate max-w-[120px]">{country}</span>
                        </div>
                      </div>

                      <div className="pt-2 text-center md:text-left">
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            onClose();
                          }}
                          className="w-full bg-emerald-800 hover:bg-emerald-950 text-stone-100 py-2.5 rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
                          id="success-close-button"
                        >
                          Return to Catalog
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Mini Wheel Spin Zone */}
                    <div className="md:col-span-7 bg-[#FCFBF8] border p-6 rounded-2xl flex flex-col items-center justify-center space-y-5 text-center shadow-xs border-amber-250">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 animate-pulse inline-block">
                          🎉 Order Reward Achieved
                        </span>
                        <h4 className="text-lg font-black text-stone-900 flex items-center justify-center gap-1.5 font-display">
                          <Gift className="w-5 h-5 text-amber-700" /> B2B Fortune Spin Unlocked!
                        </h4>
                        <p className="text-[10px] text-stone-505 max-w-sm">
                          Your purchase total of <strong className="text-stone-805">₹{createdInquiry?.totalPrice}</strong> exceeded the ₹{minCartVal} threshold! Spin now to obtain exclusive rewards.
                        </p>
                      </div>

                      {/* Wheel graphic */}
                      <div className="relative w-56 h-56 flex items-center justify-center">
                        {/* Top Needle pointer */}
                        <div className="absolute top-0 z-20 -mt-1 transform">
                          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-red-600 drop-shadow" />
                        </div>

                        {/* Outer rotating wheel frame */}
                        <div className="absolute inset-1 bg-stone-950 rounded-full shadow border-2 border-amber-900/30 flex items-center justify-center overflow-hidden">
                          <div
                            className="w-full h-full rounded-full relative overflow-hidden transition-transform"
                            style={{
                              transform: `rotate(${rotation}deg)`,
                              transition: isSpinning ? 'transform 4.2s cubic-bezier(0.1, 0.8, 0.2, 1)' : 'none',
                              transformOrigin: '50% 50%'
                            }}
                          >
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                              <g transform="translate(50, 50)">
                                {activeSectors.map((sec: any, i: number) => {
                                  const angleAngle = 360 / activeSectors.length;
                                  const radStart = (i * angleAngle * Math.PI) / 180;
                                  const radEnd = (((i + 1) * angleAngle) * Math.PI) / 180;
                                  
                                  const x1 = 50 * Math.cos(radStart);
                                  const y1 = 50 * Math.sin(radStart);
                                  const x2 = 50 * Math.cos(radEnd);
                                  const y2 = 50 * Math.sin(radEnd);

                                  const pathData = `M 0 0 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                                  const midAngle = radStart + (radEnd - radStart) / 2;
                                  const labelRadius = 31;
                                  const lx = labelRadius * Math.cos(midAngle);
                                  const ly = labelRadius * Math.sin(midAngle);
                                  
                                  const textRotate = (midAngle * 180) / Math.PI;

                                  return (
                                    <g key={i}>
                                      <path d={pathData} fill={sec.color} stroke="#FCFBF8" strokeWidth="0.8" />
                                      <text
                                        x={lx}
                                        y={ly}
                                        fill="#FFFFFF"
                                        fontSize="2.8"
                                        fontWeight="bold"
                                        textAnchor="middle"
                                        fontFamily="monospace"
                                        transform={`rotate(${textRotate}, ${lx}, ${ly})`}
                                      >
                                        {sec.label}
                                      </text>
                                    </g>
                                  );
                                })}
                              </g>
                            </svg>
                          </div>

                          {/* Central spin button core overlay */}
                          <div className="absolute w-12 h-12 bg-white border-2 border-stone-900 rounded-full flex flex-col items-center justify-center shadow-md select-none">
                            <button
                              type="button"
                              onClick={handleInlineSpin}
                              disabled={isSpinning || hasWheelSpun}
                              className={`w-full h-full rounded-full font-display text-[9px] font-black uppercase text-stone-900 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                !isSpinning && !hasWheelSpun ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 font-black' : 'bg-stone-50 text-stone-300 cursor-not-allowed'
                              }`}
                            >
                              <span className="font-extrabold text-[8px]">SPIN</span>
                            </button>
                          </div>

                        </div>
                      </div>

                      {/* Informational statuses and winning claims */}
                      <div className="h-11 flex items-center justify-center">
                        {isSpinning && (
                          <div className="flex items-center justify-center gap-1.5 text-stone-500 font-mono text-[10px] animate-pulse font-bold">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                            <span>Blending fortune slots...</span>
                          </div>
                        )}
                        {!isSpinning && spinResult && (
                          <div className="bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl animate-bounce text-center">
                            <p className="text-[11px] font-black text-emerald-950">🏆 Won: {spinResult}!</p>
                          </div>
                        )}
                        {!isSpinning && !hasWheelSpun && (
                          <span className="text-[10px] text-amber-800 font-semibold font-mono animate-pulse">👉 Tap the SPIN core to unlock your reward!</span>
                        )}
                      </div>

                    </div>

                  </div>
                ) : (
                  /* Standard single column ticket layout if total < 499 */
                  <div className="max-w-lg mx-auto space-y-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-stone-900">Cart Order Placed Successfully</h3>
                      <p className="text-stone-605 max-w-md mx-auto text-sm">
                        Your cart order has been registered. Ticket <span className="font-mono font-bold text-amber-800">DRZ-{Math.floor(1000 + Math.random() * 9000)}</span> is active in our corporate queue.
                      </p>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/80 max-w-lg mx-auto text-left space-y-3 font-sans text-xs">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold block">
                        Guaranteed Response SLA Standard
                      </span>
                      <div className="flex justify-between border-b pb-1.5 font-mono">
                        <span className="text-stone-500">Corporate Account Desk:</span>
                        <span className="font-bold text-emerald-900">4 Hours Response SLA</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5 font-mono">
                        <span className="text-stone-550">Target Goods Requested:</span>
                        <span className="font-bold text-stone-850 truncate max-w-xs">{createdInquiry?.productNames.join(', ')}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1.5 font-mono">
                        <span className="text-stone-500">Destination:</span>
                        <span className="font-bold">{country}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          onClose();
                        }}
                        className="bg-emerald-850 hover:bg-emerald-900 text-stone-100 px-8 py-3 rounded-xl text-sm font-bold shadow-md cursor-pointer transition-colors"
                        id="success-close-button-single"
                      >
                        Return to Catalog
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        ) : !loggedInCustomer ? (
          /* Inline Authentication Gate - MANDATORY before placing RFQ */
          <div className="p-6 md:p-10 space-y-6 max-h-[75vh] overflow-y-auto" id="auth-gate-form">
            <div className="text-center max-w-md mx-auto space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-sans tracking-tight">B2B Partner Authentication Required</h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans mt-1">
                  You must be registered representing your company to submit formal price inquiries and custom shelf-life/microbiology parameters check.
                </p>
              </div>

              {/* Toggle controls */}
              <div className="grid grid-cols-2 bg-stone-150 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className={`py-1.5 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer ${
                    authMode === 'login' ? 'bg-emerald-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Client Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className={`py-1.5 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer ${
                    authMode === 'register' ? 'bg-teal-700 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Create Partner ID
                </button>
              </div>

              {authError && (
                <div className="bg-red-55 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-mono border border-red-250 font-bold select-none text-center">
                  ⚠️ {authError}
                </div>
              )}

              {/* Google Authentication */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { auth, googleProvider, signInWithPopup } = await import('../lib/firebase');
                      const result = await signInWithPopup(auth, googleProvider);
                      const user = result.user;
                      
                      let matched = customers.find(c => c.email.toLowerCase() === user.email?.toLowerCase());
                      if (!matched) {
                        matched = {
                          id: `cs-${user.uid}`,
                          fullName: user.displayName || 'Google User',
                          email: user.email || '',
                          phone: user.phoneNumber || '',
                          companyName: '',
                          country: '',
                          role: 'corporate'
                        };
                        onRegister(matched);
                      }
                      onLogin(matched);
                    } catch (err: any) {
                      setAuthError(err.message || 'Google Auth Failed');
                    }
                  }}
                  className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 py-2.5 rounded-xl font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.02 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-[#FAF9F5] px-3 text-[9px] uppercase font-mono font-bold text-stone-400 absolute">Or Email</span>
              </div>
            </div>

            <div className="max-w-sm mx-auto bg-white border border-stone-200 p-5 rounded-2xl shadow-inner">
              {authMode === 'login' ? (
                /* Login inline */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAuthError('');
                    if (!logEmail || !logPassword) {
                      setAuthError('All credentials must be provided.');
                      return;
                    }
                    const found = customers.find(c => c.email.toLowerCase().trim() === logEmail.toLowerCase().trim());
                    if (!found) {
                      setAuthError('Customer account not found with this email. Please register.');
                      return;
                    }
                    if (found.password !== logPassword) {
                      setAuthError('Incorrect secret password. Prohibited gateway.');
                      return;
                    }
                    onLogin(found);
                  }}
                  className="space-y-4"
                  id="inline-login"
                >
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="buyer@example.com"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-700 outline-none"
                      value={logEmail}
                      onChange={(e) => setLogEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter secret password"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-700 outline-none font-mono"
                      value={logPassword}
                      onChange={(e) => setLogPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-900 hover:bg-emerald-950 text-stone-950 font-mono py-3 font-bold rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Login & Verify Partner Profile
                  </button>
                </form>
              ) : (
                /* Registration inline */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAuthError('');
                    if (!regFullName || !regEmail || !regPhone || !regCompanyName || !regPassword) {
                      setAuthError('Please fill out all registration specifications.');
                      return;
                    }
                    if (regPassword.length < 5) {
                      setAuthError('Password must be at least 5 characters for protection.');
                      return;
                    }
                    if (regRole === 'cs' && !regCsType.trim()) {
                      setAuthError('Please specify CS Type for the representative.');
                      return;
                    }
                    const exists = customers.some(c => c.email.toLowerCase().trim() === regEmail.toLowerCase().trim());
                    if (exists) {
                      setAuthError('This email is already registered. Please Login.');
                      return;
                    }
                    const newCs = {
                      id: `cs-${Date.now()}`,
                      fullName: regFullName,
                      email: regEmail.toLowerCase().trim(),
                      phone: regPhone,
                      companyName: regCompanyName,
                      country: regCountry,
                      password: regPassword,
                      role: regRole,
                      csType: regRole === 'cs' ? regCsType : undefined,
                    };
                    onRegister(newCs);
                    onLogin(newCs);
                  }}
                  className="space-y-3"
                  id="inline-registration"
                >
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Trader's Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenneth Cole"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Company/Entity Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Allied Foods"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      value={regCompanyName}
                      onChange={(e) => setRegCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="buyer@alliedfoods.com"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Phone No</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91..."
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Port Country</label>
                      <input
                        type="text"
                        required
                        placeholder="India"
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Account Role Group</label>
                    <select
                      className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as any)}
                    >
                      <option value="corporate">B2B Corporate Client</option>
                      <option value="cs">CS Representative</option>
                    </select>
                  </div>

                  {/* Conditional CS Type Input */}
                  {regRole === 'cs' && (
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">CS Type (Required) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CS-Representative-Level"
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                        value={regCsType}
                        onChange={(e) => setRegCsType(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-wider block">Create Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />

                    {/* Interactive Password Strength Gauge */}
                    {regPassword && (
                      <div className="space-y-1 pt-1 font-mono">
                        <div className="flex justify-between items-center text-[8px] font-bold">
                          <span className="text-stone-400">STRENGTH:</span>
                          <span className={getPasswordStrength(regPassword).textClass}>
                            {getPasswordStrength(regPassword).label.toUpperCase()}
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
                          <div
                            className={`${getPasswordStrength(regPassword).color} h-1 rounded-full transition-all duration-300`}
                            style={{ width: `${getPasswordStrength(regPassword).score}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-700 hover:bg-amber-800 text-stone-950 font-mono py-2.5 font-bold rounded-xl text-xs uppercase cursor-pointer"
                  >
                    Register and Continue
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={executeSubmit} className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6" id="bulk-cart-form">
            
            {/* Products Selector Grid and Queue */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                1. Selected Dehydrated Products Queue ({selectedProducts.length})
              </label>
              
              {selectedProducts.length === 0 ? (
                <div className="bg-red-50/50 border border-red-200 text-red-800 p-4 rounded-xl text-xs flex flex-col space-y-2 items-center justify-center text-center">
                  <span>Your catalog queue is current empty. Choose items from the dropdown below to request prices.</span>
                  
                  {/* Immediate Selector */}
                  <div className="flex gap-2 max-w-sm w-full">
                    <select
                      onChange={(e) => {
                        const prod = allProducts.find((p) => p.id === e.target.value);
                        if (prod) onAddProduct(prod);
                      }}
                      className="text-xs bg-white text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 outline-none w-full"
                    >
                      <option value="">-- Choose Dehydrated Ingredient --</option>
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Shelf Life: {p.shelfLife})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 p-3 bg-stone-100 rounded-2xl border border-stone-150">
                  {selectedProducts.map((item) => {
                    const qty = (cartQuantities && cartQuantities[item.id]) ?? 1;
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-stone-200 rounded-xl py-1.5 px-3 flex items-center gap-3 text-xs font-medium shadow-sm animate-fade-in"
                      >
                        <span className="text-stone-900 font-sans font-semibold">{item.name}</span>
                        
                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200 select-none">
                          <button
                            type="button"
                            onClick={() => {
                              if (onDecrementQuantity) onDecrementQuantity(item.id);
                            }}
                            className="w-5 h-5 flex items-center justify-center bg-white text-stone-700 hover:bg-stone-200 rounded-md text-[11px] font-black cursor-pointer transition-colors"
                          >
                            -
                          </button>
                          <span className="font-mono text-[10.5px] w-4 text-center font-bold text-stone-800">{qty}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (onIncrementQuantity) onIncrementQuantity(item.id);
                            }}
                            className="w-5 h-5 flex items-center justify-center bg-white text-stone-700 hover:bg-stone-200 rounded-md text-[11px] font-black cursor-pointer transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveProduct(item.id)}
                          className="text-stone-400 hover:text-red-650 transition-colors cursor-pointer"
                          title="Remove product"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add more interactive dropdown trigger inline inside the pill box */}
                  {availableToSelect.length > 0 && (
                    <div className="relative inline-flex items-center">
                      <select
                        onChange={(e) => {
                          const prod = allProducts.find((p) => p.id === e.target.value);
                          if (prod) {
                            onAddProduct(prod);
                            e.target.value = '';
                          }
                        }}
                        className="bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg py-1.5 px-2.5 text-xs font-bold font-mono outline-none cursor-pointer"
                      >
                        <option value="">+ Add More Products</option>
                        {availableToSelect.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* General B2B Information Fields */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-1 border-stone-200">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                  2. Business Contact & Facility Particulars
                </label>
                <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Account Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Company Legal Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-705">Company Name</label>
                  <input
                    type="text"
                    required
                    disabled
                    placeholder="e.g. Apex Food Processing Ltd."
                    className="w-full px-3 py-2.5 text-sm bg-stone-100 font-medium text-stone-700 border border-stone-200 rounded-xl cursor-not-allowed"
                    value={companyName}
                  />
                </div>

                {/* Buyer Type Selection */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">Business Segment *</label>
                  <select
                    className="w-full px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:outline-none"
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                  >
                    <option value="manufacturer">Industrial Food Manufacturer</option>
                    <option value="seasoning_brand">Spice & Seasoning Brand</option>
                    <option value="restaurant">Restaurant Chain / Franchise</option>
                    <option value="hotel">Hotel / Catering / Institutional</option>
                    <option value="trader">Bulk Spice Trader / Broker</option>
                    <option value="distributor">Wholesale Food Distributor</option>
                    <option value="retail_buyer">Gourmet Retailer / Packager</option>
                  </select>
                </div>

                {/* Buyer Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-705">Primary Contact Person</label>
                  <input
                    type="text"
                    required
                    disabled
                    className="w-full px-3 py-2.5 text-sm bg-stone-100 font-medium text-stone-700 border border-stone-200 rounded-xl cursor-not-allowed"
                    value={fullName}
                  />
                </div>

                {/* Buyer Email */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-750">Work Email Address</label>
                  <input
                    type="email"
                    required
                    disabled
                    className="w-full px-3 py-2.5 text-sm bg-stone-100 font-medium text-stone-700 border border-stone-200 rounded-xl cursor-not-allowed"
                    value={email}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-705">Contact Number</label>
                  <input
                    type="tel"
                    required
                    disabled
                    className="w-full px-3 py-2.5 text-sm bg-stone-100 font-medium text-stone-700 border border-stone-200 rounded-xl cursor-not-allowed"
                    value={phone}
                  />
                </div>

                {/* Delivery Location / Destination */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-stone-755">Delivery Location / Address</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setCountry(`Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
                            },
                            (error) => {
                              alert('Could not get live location. Please grant permission or enter manually.');
                            }
                          );
                        } else {
                          alert('Geolocation is not supported by this browser.');
                        }
                      }}
                      className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold cursor-pointer transition-colors"
                    >
                      Locate Live
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter manual address or use Locate Live"
                    className="w-full px-3 py-2.5 text-sm bg-white font-medium text-stone-700 border border-stone-200 rounded-xl focus:border-emerald-700 focus:outline-none"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>

              </div>
            </div>

            {/* 3.5 B2B Commercial Price Summary & Promotional Coupon */}
            <div className="space-y-4 bg-amber-50/40 p-5 rounded-2xl border border-amber-250">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-amber-900">
                ⭐ Commercial Price Calculation & B2B Promotional Coupon
              </label>

              <div className="text-xs text-[#8C6D3E] font-medium leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                ⚖️ <strong>Cart Units:</strong> Each unit represents 1 pack or the selected custom quantity.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Coupon Input Element */}
                <div className="space-y-2">
                  <span className="block text-xs text-stone-600 font-medium">Have a promotional B2B Coupon code? Apply below:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. EXTRA5, WELCOME20"
                      className="text-xs px-3.5 py-2.5 bg-white border border-stone-250 rounded-xl focus:border-amber-700 outline-none w-full uppercase font-mono font-bold"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCouponError('');
                        setCouponSuccess('');
                        setAppliedCoupon(null);

                        const code = couponInput.trim().toUpperCase();
                        if (!code) {
                          setCouponError('Please enter a coupon code.');
                          return;
                        }

                        const matched = coupons.find(c => c.code.toUpperCase() === code);
                        if (!matched) {
                          setCouponError('This coupon code is not valid.');
                          return;
                        }

                        // Check expiration date
                        const expDate = new Date(matched.expirationDate);
                        const currentDate = new Date();
                        if (expDate < currentDate) {
                          setCouponError('This coupon code has expired.');
                          return;
                        }

                        setAppliedCoupon(matched);
                        setCouponSuccess(`Coupon code Applied! Got ${matched.type === 'percent' ? matched.value + '%' : 'Rs. ' + matched.value} discount.`);
                      }}
                      className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-mono font-bold px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] text-red-650 font-mono font-bold">❌ {couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[10px] text-emerald-805 font-mono font-bold">✔ {couponSuccess}</p>
                  )}
                  
                  {/* List of active coupon codes on the app */}
                  {coupons.length > 0 && (
                    <div className="pt-1.5 space-y-1">
                      <span className="text-[9.5px] text-[#8C6D3E] font-medium block">
                        Available Coupons (Editable in Admin Settings):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {coupons.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setCouponInput(c.code.toUpperCase());
                              setCouponError('');
                            }}
                            className="text-[9px] font-mono font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-200 transition-colors"
                          >
                            {c.code.toUpperCase()} ({c.type === 'percent' ? c.value + '%' : 'Rs. ' + c.value})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Computational Cost Breakdown */}
                <div className="bg-white/95 p-4 rounded-xl border border-stone-200 font-mono text-xs text-stone-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Avg. Base Rate per Unit:</span>
                    <span className="font-bold">Rs. {computedBasePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-stone-100">
                    <span>Est. Quantity:</span>
                    <span className="font-bold">{estimatedQuantityKg === 1 ? '1 Pack' : `${estimatedQuantityKg.toLocaleString()} Packs`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-stone-900">Rs. {computedSubtotal.toLocaleString()}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-800 font-semibold text-[11px]">
                      <span>Discount ({appliedCoupon.code}):</span>
                      <span>
                        -Rs. {
                          (() => {
                            if (appliedCoupon.type === 'percent') {
                              return Math.round((computedSubtotal * appliedCoupon.value) / 100).toLocaleString();
                            } else {
                              return appliedCoupon.value.toLocaleString();
                            }
                          })()
                        }
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-sm text-amber-900 border-t pt-2 border-stone-150">
                    <span>Estimated Net Total:</span>
                    <span>
                      Rs. {
                        (() => {
                          let discount = 0;
                          if (appliedCoupon) {
                            if (appliedCoupon.type === 'percent') {
                              discount = Math.round((computedSubtotal * appliedCoupon.value) / 100);
                            } else {
                              discount = appliedCoupon.value;
                            }
                          }
                          return Math.max(0, computedSubtotal - discount).toLocaleString();
                        })()
                      }
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Specifications Document and PDF Drag Drop Attachment */}
            <div className="space-y-3">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                4. Custom Technical Specifications Worksheet (Optional)
              </label>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                  isDragActive
                    ? 'border-emerald-600 bg-emerald-50/55'
                    : attachedFile
                    ? 'border-emerald-305 bg-[#FCFBF7]'
                    : 'border-stone-300 hover:border-emerald-600 bg-white'
                }`}
                id="doc-drag-drop-zone"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                />

                <Upload className="w-10 h-10 text-stone-400" />
                
                {attachedFile ? (
                  <div className="space-y-1 w-full max-w-sm">
                    <span className="text-xs font-bold text-stone-900 block truncate">
                      {attachedFile.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                      Type: {attachedFile.type || 'Datasheet Document'} | Size: {(attachedFile.size / 1024).toFixed(1)} KB
                    </span>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-700 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    {uploadProgress === 100 && (
                      <span className="text-[10px] text-emerald-800 font-mono tracking-tight block pt-1">
                        ✔ Security sanitized and bound securely to proposal
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Drag & Drop raw formula document, or <span className="text-emerald-800 underline">browse your local system</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono block mt-1">
                      Supports PDF, DOCX, XLSX micro spec requirements files up to 10MB
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Notes Message */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-stone-700">Special Splicing/Color/Microbiology Parameters</label>
              <textarea
                rows={3}
                placeholder="Mention any custom specifications like steam-sterilization (HTST), microbiological threshold requirements, shelf-life limit specs, or private-label custom jar dimensions..."
                className="w-full px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:border-emerald-700 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Footer declaration */}
            <div className="text-[11px] text-stone-500 font-sans leading-relaxed border-t pt-4 flex gap-2">
              <Info className="w-4 h-4 text-emerald-900 shrink-0 mt-0.5" />
              <span>We value your proprietary formulas. All specifications and bulk orders parameters submitted here are guarded under a bilateral corporate NDA in accordance with Dryza Food Safety Guidelines.</span>
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2 flex justify-end gap-3.5">
              <button
                type="button"
                onClick={onClose}
                className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold px-6 py-3 rounded-xl text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedProducts.length === 0}
                className={`px-8 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer ${
                  selectedProducts.length === 0
                    ? 'bg-stone-300 text-stone-9500 cursor-not-allowed'
                    : 'bg-emerald-900 text-stone-950 hover:bg-emerald-950 font-extrabold'
                }`}
                id="submit-order-button"
              >
                Place Cart Order
              </button>
            </div>

          </form>
        )}

      </div>
  );

  if (isFullPage) {
    return (
      <div className="max-w-5xl mx-auto py-2" id="cart-fullpage-wrapper">
        {formContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4 backdrop-blur-md bg-stone-900/60 animate-fade-in" id="b2b-cart-overlay">
      {formContent}
    </div>
  );
}
