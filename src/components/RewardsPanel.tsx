import React, { useState, useEffect } from 'react';
import { Customer, WheelSettings, Inquiry } from '../types';
import { Award, RefreshCw, Sparkles, AlertCircle, CheckCircle, Download, Upload, HelpCircle, Gift, Truck, Package, Clock, ShieldCheck, ShoppingBag, MapPin, Lock } from 'lucide-react';

interface RewardsPanelProps {
  loggedInCustomer: Customer | null;
  onUpdateCustomerPoints: (pointsToAdd: number, reason: string) => void;
  onAddUnlockedOffer: (offer: { id: string; title: string; rewardCode: string; description: string; dateEarned: string }) => void;
  onOpenLogin: () => void;
  customers: Customer[];
  onImportBackup: (backupData: any) => void;
  wheelSettings?: WheelSettings;
  inquiries?: Inquiry[];
  onSpinWheelForOrder?: (orderId: string, prizeLabel: string) => void;
}

export default function RewardsPanel({
  loggedInCustomer,
  onUpdateCustomerPoints,
  onAddUnlockedOffer,
  onOpenLogin,
  customers,
  onImportBackup,
  wheelSettings,
  inquiries = [],
  onSpinWheelForOrder
}: RewardsPanelProps) {
  // Spin wheel states
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canSpin, setCanSpin] = useState(true);
  const [selectedOrderID, setSelectedOrderID] = useState<string>('');

  // Backup restore state
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<boolean>(false);

  // Wheel sectors - dynamically calculated from settings or default
  const sectors = (wheelSettings && wheelSettings.sectors && wheelSettings.sectors.length === 8) 
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

  // Daily Visit automatic check-in points checker
  useEffect(() => {
    if (loggedInCustomer) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (loggedInCustomer.lastVisitDate !== todayStr) {
        // Award 20 daily loyalty check-in points
        setTimeout(() => {
          onUpdateCustomerPoints(20, 'Daily Login Check-In');
          // Add visit date record
          const updated = {
            ...loggedInCustomer,
            lastVisitDate: todayStr,
            dailyVisitStreak: (loggedInCustomer.dailyVisitStreak || 0) + 1
          };
          localStorage.setItem('dryza_logged_in_customer', JSON.stringify(updated));
        }, 800);
      }
    }
  }, [loggedInCustomer]);

  // Filter qualifying orders for the logged-in customer
  const qualifyingOrders = loggedInCustomer
    ? inquiries.filter(
        (inq) =>
          inq.email.toLowerCase() === loggedInCustomer.email.toLowerCase() &&
          (inq.totalPrice || 0) >= (wheelSettings?.spinMinCartValue ?? 499)
      )
    : [];

  useEffect(() => {
    if (qualifyingOrders.length > 0 && !selectedOrderID) {
      // Find the first unspun qualifying order
      const firstUnspun = qualifyingOrders.find((o) => !o.hasSpunWheel);
      if (firstUnspun) {
        setSelectedOrderID(firstUnspun.id);
      } else {
        setSelectedOrderID(qualifyingOrders[0].id);
      }
    }
  }, [qualifyingOrders, selectedOrderID]);

  const currentOrder = qualifyingOrders.find((o) => o.id === selectedOrderID);
  const canSpinCurrentOrder = currentOrder && !currentOrder.hasSpunWheel;

  const handleSpinClick = () => {
    if (isSpinning || !canSpinCurrentOrder || !currentOrder) return;

    setIsSpinning(true);
    setSpinResult(null);

    // Pick a sector based on customized percentages / weights
    let sectorIndex = 0;
    const totalWeight = sectors.reduce((acc, curr) => acc + (curr.probability || 10), 0);
    let rand = Math.random() * (totalWeight || 100);
    for (let i = 0; i < sectors.length; i++) {
      const weight = sectors[i].probability || 10;
      if (rand < weight) {
        sectorIndex = i;
        break;
      }
      rand -= weight;
    }

    const sectorDegrees = 360 / sectors.length;
    const targetSector = sectors[sectorIndex];
    const targetDegrees = 3600 - (sectorIndex * sectorDegrees) - (sectorDegrees / 2);
    
    setRotation(targetDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(targetSector.label);

      // Save order spin outcome inside the inquiries array globally via callback
      if (onSpinWheelForOrder) {
        onSpinWheelForOrder(currentOrder.id, targetSector.label);
      }

      // Award prizes permanently in database
      const [type, value] = targetSector.value.split(':');
      const todayStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

      if (type === 'points') {
        const points = parseInt(value, 10);
        onUpdateCustomerPoints(points, `Spin Wheel reward for Order ${currentOrder.id}: ${targetSector.label}`);
      } else if (type === 'coupon' || type === 'offer') {
        onAddUnlockedOffer({
          id: `spin-${Date.now()}`,
          title: targetSector.label,
          rewardCode: value,
          description: type === 'coupon' ? `Apply custom invoice discount code [${value}] at quoting.` : `Valid for your next checkout inquiry.`,
          dateEarned: todayStr
        });
        // Give a token 20 points also for spinning
        onUpdateCustomerPoints(20, `Checked out order spin bonus XP`);
      }
    }, 4100);
  };

  // Level calculator definitions
  const getLevelSpecs = (points: number) => {
    if (points <= 500) {
      return { tier: 'Bronze Partner', nextTier: 'Silver Partner', target: 501, prevMin: 0, benefit: '100% Free DHL Express Sample Sourcing' };
    } else if (points <= 1500) {
      return { tier: 'Silver Partner', nextTier: 'Gold Partner', target: 1501, prevMin: 501, benefit: '5% Instant Invoice Rebate on Dehydrated Spices' };
    } else if (points <= 4000) {
      return { tier: 'Gold Partner', nextTier: 'Platinum Elite', target: 4001, prevMin: 1501, benefit: '10% Invoice Discount & Priority Silo Reservation' };
    } else {
      return { tier: 'Platinum Elite', nextTier: 'Maximum Level', target: 999999, prevMin: 4001, benefit: '15% Absolute Premium Discount & 24/7 Dedicated Account Rep' };
    }
  };

  const points = loggedInCustomer?.points || 0;
  const levelData = getLevelSpecs(points);
  const fraction = Math.min(100, Math.max(0, ((points - levelData.prevMin) / (levelData.target - levelData.prevMin)) * 100));

  // Export State Backup as single JSON download
  const handleExportBackup = () => {
    try {
      const keysToBackup = [
        'dryza_customers',
        'dryza_logged_in_customer',
        'dryza_inquiries',
        'dryza_products',
        'dryza_admin_password',
        'dryza_logo_url',
        'dryza_custom_contests',
        'dryza_contest_entries'
      ];
      const backupObj: Record<string, any> = {};
      keysToBackup.forEach(k => {
        const val = localStorage.getItem(k);
        if (val) backupObj[k] = JSON.parse(val);
      });

      const fileData = JSON.stringify({
        brand: 'DRYZA_SPICES',
        createdAt: new Date().toISOString(),
        version: '2.0.0',
        data: backupObj
      }, null, 2);

      const blob = new Blob([fileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dryza_corporate_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Failed to initialize download. LocalStorage contains broken values.');
    }
  };

  // Restore State Backup from user JSON file
  const handleImportBackupClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        if (typeof content !== 'string') throw new Error('Data is not a valid string stream');
        
        const backupObj = JSON.parse(content);
        if (backupObj.brand !== 'DRYZA_SPICES' || !backupObj.data) {
          throw new Error('This JSON is not a valid DRYZA Spices Corporate Backup File.');
        }

        // Call parent import to cleanly set states and reload
        onImportBackup(backupObj.data);
        setRestoreSuccess(true);
        setRestoreError(null);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err: any) {
        setRestoreError(err.message || 'Malformed JSON format detected.');
        setRestoreSuccess(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" id="rewards-layout">
      {/* Upper Title banner block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-100/60 px-3 py-1 rounded-full">
            Dryza B2B Club & Partner Lounge
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight leading-none">
            Loyalty Engine & Corporate Rewards
          </h2>
          <p className="text-sm text-stone-605 max-w-2xl">
            Earn high-value XP points inside the Dryza Ecosystem on every daily visit, review submission, and B2B quote request. Spin daily to unlock premium discounts!
          </p>
        </div>

        {/* Global DB Backup Tray */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-750 font-mono text-[11px] font-bold px-3 py-2 border rounded-xl shadow-sm transition-all cursor-pointer"
            title="Download complete database state to a secure local file"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Download Backup (.json)</span>
          </button>
          
          <label className="flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-750 font-mono text-[11px] font-bold px-3 py-2 border rounded-xl shadow-sm transition-all cursor-pointer select-none">
            <Upload className="w-3.5 h-3.5 text-stone-600" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportBackupClick}
            />
          </label>
        </div>
      </div>

      {/* Backup Sync Alert Flags */}
      {restoreSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 animate-pulse text-xs text-emerald-900 font-sans shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <strong>Corporate Database Restored Successfully!</strong> Synchronizing tables and refreshing app elements instantly...
          </div>
        </div>
      )}

      {restoreError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-red-900 font-sans shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
          <div>
            <strong>Backup Read Failure:</strong> {restoreError} Please load an authentic <code className="bg-red-100 px-1 rounded text-red-950 font-bold">.json</code> file generated by Dryza.
          </div>
        </div>
      )}

      {/* Live Order Shipment & Progress Tracker - For Logged In B2B Buyers */}
      {loggedInCustomer && (
        (() => {
          const userInquiries = inquiries.filter(
            (inq) => inq.email.toLowerCase() === loggedInCustomer.email.toLowerCase()
          );
          if (userInquiries.length === 0) return null;

          return (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-left space-y-6" id="customer-order-tracker-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base font-display">Live Shipment & Order Tracker</h3>
                    <p className="text-[11px] text-stone-505 font-mono">Track your custom dehydrated ingredient shipments in real-time</p>
                  </div>
                </div>
                <div className="text-stone-500 font-mono text-xs text-right bg-stone-50 px-2.5 py-1 rounded-lg border">
                  <span>Active Shipments: </span>
                  <strong className="text-emerald-800">{userInquiries.length}</strong>
                </div>
              </div>

              <div className="space-y-8 divide-y divide-stone-100">
                {userInquiries.map((order, orderIdx) => {
                  const steps = ['Ordered', 'Packaging', 'Shipped', 'Out for Delivery', 'Delivered'] as const;
                  const currentIdx = steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 0;

                  return (
                    <div key={order.id} className={`pt-6 ${orderIdx === 0 ? 'pt-0' : ''} space-y-5`}>
                      {/* Order info line */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-stone-900 bg-stone-100/85 px-2 py-0.5 rounded text-stone-800 border">
                              {order.id}
                            </span>
                            <span className="text-[10.5px] font-mono text-stone-400">
                              Submitted: {new Date(order.submittedAt).toLocaleDateString()} at {new Date(order.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 font-medium">
                            Products: <strong className="text-stone-900">{order.productNames.join(', ')}</strong>
                          </p>
                        </div>
                        <div className="text-left sm:text-right font-mono">
                          <span className="text-[10px] text-stone-400 block uppercase font-bold">Est. Quantity</span>
                          <span className="text-xs font-bold text-stone-900">{order.estimatedQuantityKg.toLocaleString()} Kg ({ (order.estimatedQuantityKg / 1000).toFixed(1) } MT)</span>
                        </div>
                      </div>

                      {/* Visual Stepper Track */}
                      <div className="relative pt-2 pb-6 max-w-4xl mx-auto">
                        {/* Desktop Horizontal Line */}
                        <div className="absolute top-[26px] left-[10%] right-[10%] h-0.5 bg-stone-200 -translate-y-1/2 hidden md:block" />
                        
                        {/* Colored progress bar under horizontal line */}
                        <div 
                          className="absolute top-[26px] left-[10%] h-0.5 bg-emerald-600 -translate-y-1/2 transition-all duration-1000 hidden md:block" 
                          style={{ width: `${(currentIdx / (steps.length - 1)) * 80}%` }}
                        />

                        {/* Mobile Vertical Track Lines */}
                        <div className="absolute left-[26px] top-4 bottom-8 w-0.5 bg-stone-200 md:hidden" />
                        <div 
                          className="absolute left-[26px] top-4 w-0.5 bg-emerald-600 md:hidden transition-all duration-1000" 
                          style={{ height: `${(currentIdx / (steps.length - 1)) * 88}%` }}
                        />

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0 relative">
                          {steps.map((st, i) => {
                            const isPassed = i <= currentIdx;
                            const isCurrent = i === currentIdx;

                            // Distinct icons/markers for pipeline status
                            let iconNode = <Clock className="w-4 h-4" />;
                            if (st === 'Ordered') iconNode = <ShoppingBag className="w-4 h-4" />;
                            if (st === 'Packaging') iconNode = <Package className="w-4 h-4" />;
                            if (st === 'Shipped') iconNode = <Truck className="w-4 h-4" />;
                            if (st === 'Out for Delivery') iconNode = <MapPin className="w-4 h-4" />;
                            if (st === 'Delivered') iconNode = <CheckCircle className="w-4 h-4" />;

                            return (
                              <div key={st} className="flex md:flex-col items-center gap-4 md:gap-2.5 text-center relative group">
                                {/* Dot / Circle container */}
                                <div 
                                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 shrink-0 ${
                                    isCurrent 
                                      ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-500/20 scale-110 animate-pulse'
                                      : isPassed
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'bg-white border-stone-300 text-stone-400'
                                  }`}
                                >
                                  {iconNode}
                                </div>

                                {/* Texts description */}
                                <div className="text-left md:text-center">
                                  <span 
                                    className={`text-[11px] font-mono uppercase tracking-wider font-extrabold block ${
                                      isCurrent 
                                        ? 'text-amber-800' 
                                        : isPassed 
                                        ? 'text-emerald-800' 
                                        : 'text-stone-400'
                                    }`}
                                  >
                                    {st}
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[9.5px] font-sans font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-150 block w-max md:mx-auto mt-0.5 animate-pulse">
                                      Current Stage
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Admin/Operations Remarks or Notes if present */}
                      {order.adminNotes && (
                        <div className="bg-stone-50 border border-stone-150 p-3.5 rounded-2xl text-xs text-stone-700 leading-relaxed font-sans shadow-inner-sm">
                          <span className="font-mono text-[9.5px] font-bold text-amber-800 uppercase block mb-1">
                            Dryza Logistics & Operations Update:
                          </span>
                          <p>{order.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      )}

      {/* Main Split Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Profile and Loyalty Progress (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Guest or LoggedIn Profile Box */}
          {!loggedInCustomer ? (
            <div className="bg-[#FAF9F5] border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-56 text-left relative overflow-hidden" id="rewards-guest-prompt">
              {/* background element */}
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-stone-200/50">
                <Gift className="w-32 h-32" />
              </div>

              <div className="space-y-2.5 z-10">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-amber-801 bg-amber-100 px-2.5 py-0.5 rounded-full text-amber-800">
                  Guest Session Activated
                </span>
                <h4 className="text-xl font-bold text-stone-900 font-display">B2B Account Unverified</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Log in representing your corporate or seasoning brand to unlock persistent points history, high-tier pricing multipliers, and dynamic daily rewards.
                </p>
              </div>

              <button
                onClick={onOpenLogin}
                className="bg-emerald-850 hover:bg-emerald-900 text-white font-mono font-bold text-xs py-3 px-5 rounded-xl text-center shadow transition-all cursor-pointer z-10"
              >
                Sign In or Register Instantly
              </button>
            </div>
          ) : (
            <div className="bg-[#FAF9F5] border border-stone-200 rounded-3xl p-6 shadow-sm text-left space-y-6 relative overflow-hidden" id="rewards-profile-display">
              {/* Top Row profile summary */}
              <div className="flex items-center gap-4 border-b pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-700 flex items-center justify-center text-white text-xl font-black font-display shadow-md">
                  {loggedInCustomer.companyName ? loggedInCustomer.companyName[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-stone-950 font-display text-lg">{loggedInCustomer.fullName}</h4>
                  <span className="text-[11px] text-[#0F766E] font-semibold bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-md font-mono mt-0.5 inline-block">
                    {loggedInCustomer.companyName}
                  </span>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block tracking-wider font-bold">Loyalty Rating</span>
                    <span className="text-lg font-black text-emerald-900 font-sans tracking-tight">{levelData.tier}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase block tracking-wider font-bold">Total Power balance</span>
                    <span className="text-sm font-bold text-stone-950 font-mono">{points} XP</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-full h-3 bg-stone-200 rounded-full overflow-hidden shadow-inner border border-stone-250/20">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-855 from-emerald-800 to-teal-605 to-teal-650 transition-all duration-1000 ease-out rounded-full"
                    style={{ width: `${fraction}%` }}
                  />
                </div>

                {/* Next milestone info */}
                {levelData.target < 999999 ? (
                  <p className="text-[10.5px] text-stone-500 font-mono flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Need <strong className="text-stone-900">{levelData.target - points} XP</strong> more to advance to <code className="bg-stone-100 text-emerald-800 px-1 rounded font-bold">{levelData.nextTier}</code>.</span>
                  </p>
                ) : (
                  <p className="text-[10.5px] text-stone-500 font-mono flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                    <span>Conquest complete! You are at maximum status. Enjoy extreme limits.</span>
                  </p>
                )}
              </div>

              {/* Verified unlocked advantages */}
              <div className="bg-emerald-50/50 border border-emerald-200/60 p-4 rounded-2xl space-y-2">
                <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-emerald-850">Active Tier Advantage:</span>
                <p className="text-xs text-stone-900 font-sans leading-relaxed font-semibold flex items-start gap-1.5 pt-0.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{levelData.benefit}</span>
                </p>
              </div>

              {/* Streak Tracker info */}
              <div className="border-t pt-4 flex justify-between items-center text-xs text-stone-500 font-mono">
                <span>Daily Visit Streak:</span>
                <span className="text-stone-900 font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                  🔥 {loggedInCustomer.dailyVisitStreak || 1} Days
                </span>
              </div>

            </div>
          )}

          {/* Gamification scoring pathways card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm text-left space-y-4">
            <h4 className="font-bold text-stone-900 font-display flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-amber-700" /> How to Earn XP Points & Discounts:
            </h4>
            
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-start border-b pb-2.5">
                <div>
                  <strong className="block text-stone-850 text-[12.5px] font-sans">Submit Cart Order Checkout</strong>
                  <span className="text-[10.5px] text-stone-500 font-normal">Submit a detailed corporate order request queue</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">+100 XP</span>
              </div>

              <div className="flex justify-between items-start border-b pb-2.5">
                <div>
                  <strong className="block text-stone-850 text-[12.5px] font-sans">Complete Spice Science Quiz</strong>
                  <span className="text-[10.5px] text-stone-500 font-normal">Test ingredients purity & rehydration limits under time limit</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+50 XP / ans</span>
              </div>

              <div className="flex justify-between items-start border-b pb-2.5">
                <div>
                  <strong className="block text-stone-850 text-[12.5px]">Accept Weekly Culinary Challenge</strong>
                  <span className="text-[10.5px] text-stone-500 font-normal">Apply spices in kitchen and upload verified outcomes</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+120 XP</span>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <strong className="block text-stone-850 text-[12.5px]">Daily Check-In Multipliers</strong>
                  <span className="text-[10.5px] text-stone-500 font-normal">Humming of dehydration silos. Free check once every 24h.</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+20 XP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Spin & Win Wheel Panel (col-span-7) */}
        <div className="lg:col-span-7 bg-[#FAF9F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center space-y-6 relative" id="rewards-spin-and-win">
          
          {!loggedInCustomer ? (
            <div className="text-center py-10 px-4 space-y-4 max-w-sm" id="spinwheel-not-logged">
              <div className="w-16 h-16 bg-stone-100 border rounded-2xl flex items-center justify-center mx-auto text-stone-400">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-stone-900 font-display">Authentication Required</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  Spin wheel entries are gated per active corporate order above ₹{wheelSettings?.spinMinCartValue ?? 499}. Please sign in to verify your credentials.
                </p>
              </div>
              <button
                onClick={onOpenLogin}
                className="bg-emerald-800 hover:bg-emerald-950 text-white font-mono text-[10px] uppercase font-bold py-2.5 px-4 rounded-xl shadow cursor-pointer"
              >
                Launch Account Login
              </button>
            </div>
          ) : qualifyingOrders.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-4 max-w-md mx-auto" id="spinwheel-no-orders">
              <div className="w-18 h-18 bg-stone-100 border border-stone-200 rounded-2xl flex items-center justify-center mx-auto text-stone-400 shadow-inner-sm">
                <Lock className="w-9 h-9 text-stone-400" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-black text-stone-900 font-display">Corporate Fortune Wheel Locked</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  Fortune wheel spins are only unlocked once per order above <strong className="text-stone-850">₹{wheelSettings?.spinMinCartValue ?? 499}</strong>. No qualifying order is active under your account list!
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left flex gap-2.5 text-[11px] text-amber-950 font-mono shadow-inner-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                <span>Submit a custom spices or blend inquiry matching high volume values ({">="} ₹{wheelSettings?.spinMinCartValue ?? 499}) at checkout to activate your corporate spin slot!</span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center space-y-1">
                <h4 className="text-2xl font-black text-stone-900 tracking-tight flex items-center justify-center gap-1.5 font-display">
                  <Gift className="w-6 h-6 text-amber-700" /> Corporate B2B Fortune Wheel
                </h4>
                <p className="text-xs text-stone-505 max-w-md mx-auto leading-relaxed">
                  Unlock dynamic XP power boosters and coupon codes matching chemical profile specs. Spins are locked to **exactly once per qualifying order**.
                </p>
              </div>

              {/* ORDER SELECTOR FOR SPIN */}
              <div className="w-full max-w-sm space-y-1 text-left bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm">
                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest leading-none mb-1">Select Qualifying Order:</label>
                <select
                  className="w-full text-xs font-mono p-2 bg-stone-50 border border-stone-150 rounded-lg focus:border-amber-700 outline-none"
                  value={selectedOrderID}
                  onChange={(e) => setSelectedOrderID(e.target.value)}
                >
                  {qualifyingOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.id} (Value: ₹{o.totalPrice}) — {o.hasSpunWheel ? `SPUN (Won: ${o.spinWheelResult})` : 'UNSPUN (Ready!)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* SPINNING GRAPHIC COMPONENT */}
              <div className="relative w-72 h-72 sm:w-85 sm:h-85 flex items-center justify-center py-4">
                
                {/* Top needle marker pointing down */}
                <div className="absolute top-0 z-20 -mt-2 transform">
                  <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-red-600 drop-shadow" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto -mt-[18px] z-30 relative" />
                </div>

                {/* Glowing outer shadow ring */}
                <div className="absolute inset-2 bg-stone-900 rounded-full shadow-2xl border-4 border-amber-900/40 relative flex items-center justify-center overflow-hidden">
                  
                  {/* Radial spin-wheel colored blocks */}
                  <div
                    className="w-full h-full rounded-full relative overflow-hidden transition-transform"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning ? 'transform 4.2s cubic-bezier(0.1, 0.8, 0.2, 1)' : 'none',
                      transformOrigin: '50% 50%'
                    }}
                  >
                    {/* SVG Pizza sector layouts */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <g transform="translate(50, 50)">
                        {sectors.map((sec, i) => {
                          const angleAngle = 360 / sectors.length;
                          const radStart = (i * angleAngle * Math.PI) / 180;
                          const radEnd = (((i + 1) * angleAngle) * Math.PI) / 180;
                          
                          const x1 = 50 * Math.cos(radStart);
                          const y1 = 50 * Math.sin(radStart);
                          const x2 = 50 * Math.cos(radEnd);
                          const y2 = 50 * Math.sin(radEnd);

                          // Path drawing segment wedge
                          const pathData = `M 0 0 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                          // Label coordinates at center radius
                          const midAngle = radStart + (radEnd - radStart) / 2;
                          const labelRadius = 32;
                          const lx = labelRadius * Math.cos(midAngle);
                          const ly = labelRadius * Math.sin(midAngle);
                          
                          // Convert angle back to degrees for text rotation aligning outwards
                          const textRotate = (midAngle * 180) / Math.PI;

                          return (
                            <g key={i}>
                              <path d={pathData} fill={sec.color} stroke="#FAF9F5" strokeWidth="0.8" />
                              <text
                                x={lx}
                                y={ly}
                                fill="#FFFFFF"
                                fontSize="3"
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

                  {/* Safe center solid button core overlay */}
                  <div className="absolute w-18 h-18 bg-[#FAF9F5] border-4 border-stone-900 rounded-full flex flex-col items-center justify-center shadow-lg group select-none">
                    <button
                      onClick={handleSpinClick}
                      disabled={isSpinning || !canSpinCurrentOrder}
                      className={`w-full h-full rounded-full font-display text-xs font-black uppercase text-stone-900 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        canSpinCurrentOrder && !isSpinning ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 font-black' : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                      id="sspin-the-wheel-btn"
                    >
                      <span className="text-[9.5px] leading-none select-none">SPIN</span>
                      <span className="text-[7.5px] select-none text-stone-500 font-mono tracking-tight mt-0.5 font-bold">DRYZA</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Spin Result & countdown statuses below wheel */}
              <div className="w-full max-w-sm text-center">
                {isSpinning && (
                  <div className="flex items-center justify-center gap-2 text-stone-700 font-mono text-xs animate-pulse font-bold bg-[#FAF9F5] py-2 border rounded-xl">
                    <RefreshCw className="w-4 h-4 text-amber-700 animate-spin" />
                    <span>Merging volatile compounds...</span>
                  </div>
                )}

                {!isSpinning && spinResult && (
                  <div className="bg-emerald-100 border border-emerald-300 p-3.5 rounded-2xl animate-bounce space-y-1 shadow">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-850">RESULT ANNOUNCEMENT</span>
                    <p className="text-sm font-black text-emerald-950">🏆 You Won: {spinResult}!</p>
                  </div>
                )}

                {!isSpinning && currentOrder && !canSpinCurrentOrder && (
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl space-y-1 font-mono text-xs">
                    <span className="text-[10px] text-amber-800 uppercase font-black block">Order Coupon Verified</span>
                    <p className="text-amber-900 leading-relaxed font-semibold">You already rolled for Order <strong className="text-stone-850">{currentOrder?.id}</strong>! Won Reward: <code className="bg-stone-900 text-amber-400 px-1.5 py-0.5 rounded font-bold">{currentOrder?.spinWheelResult || 'Standard Prize'}</code>.</p>
                  </div>
                )}

                {!isSpinning && canSpinCurrentOrder && !spinResult && (
                  <div className="p-3 bg-stone-100/60 border border-dashed rounded-2xl text-xs text-stone-500 leading-normal mb-1">
                    <span>Click the central **SPIN** button to release your corporate reward for Order <strong>{currentOrder?.id}</strong>.</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Active vouchers list tray */}
          {loggedInCustomer && loggedInCustomer.unlockedOffers && loggedInCustomer.unlockedOffers.length > 0 && (
            <div className="w-full border-t pt-5 text-left space-y-3 font-sans">
              <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-stone-400 block pb-1 border-b">
                Your Unlocked Corporate Coupons & Vouchers:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {loggedInCustomer.unlockedOffers.map((off) => (
                  <div key={off.id} className="bg-white border p-3 rounded-xl flex justify-between items-start gap-4 shadow-inner-sm text-xs border-amber-200">
                    <div>
                      <h5 className="font-bold text-stone-900">{off.title}</h5>
                      <span className="text-[10px] text-stone-400 leading-snug block mt-0.5">{off.description}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="bg-amber-100 text-amber-850 px-2 py-0.5 rounded text-[10px] font-mono font-bold block border">
                        {off.rewardCode}
                      </span>
                      <span className="text-[8px] text-stone-400 font-mono block mt-1">Earned: {off.dateEarned}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
