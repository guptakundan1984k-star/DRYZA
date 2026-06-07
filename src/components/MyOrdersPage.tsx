import React, { useState } from 'react';
import { Inquiry, Product, Customer } from '../types';
import { 
  ClipboardCheck, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Package, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Building, 
  ShoppingBag, 
  Gift, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MyOrdersPageProps {
  inquiries: Inquiry[];
  allProducts: Product[];
  loggedInCustomer: Customer | null;
  onOpenLogin: () => void;
  setCurrentTab: (tab: string) => void;
  wheelSettings?: any;
  onCancelOrder?: (orderId: string) => void;
}

export default function MyOrdersPage({
  inquiries,
  allProducts,
  loggedInCustomer,
  onOpenLogin,
  setCurrentTab,
  wheelSettings,
  onCancelOrder
}: MyOrdersPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Filter inquiries belonging to the authenticated customer
  const myInquiries = inquiries.filter(
    (inq) => 
      loggedInCustomer && 
      inq.email.toLowerCase() === loggedInCustomer.email.toLowerCase()
  );

  // Search filter
  const filteredOrders = myInquiries.filter((inq) => {
    if (!searchTerm) return true;
    const matchId = inq.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProducts = inq.productNames.some(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchId || matchProducts;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  // Auth gate check
  if (!loggedInCustomer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6" id="orders-gate-prompt">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-3 max-w-md mx-auto">
          <h2 className="text-2xl font-extrabold text-stone-900 font-sans tracking-tight">B2B Portal Login Required</h2>
          <p className="text-sm text-stone-605 leading-relaxed font-sans">
            Please sign in representing your enterprise to view active delivery milestones, quality-assurance reports, FSSAI clearance state, and trade invoices.
          </p>
        </div>
        <div>
          <button
            onClick={onOpenLogin}
            className="px-6 py-3 bg-emerald-900 border border-emerald-950/20 hover:bg-emerald-950 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            id="orders-authenticate-btn"
          >
            Authenticate Enterprise Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="my-orders-view">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-805 bg-emerald-50 px-3 py-1 rounded-full">
            Realtime B2B Delivery Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight leading-none font-display">
            My Corporate Orders & RFQs
          </h2>
          <p className="text-sm text-stone-605 max-w-2xl">
            Track live dispatch status of your trade consignments, view laboratory microbiological certifications, and preview invoice totals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <input
            type="text"
            placeholder="Search by Order ID or Product..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-250 rounded-xl focus:border-emerald-700 outline-none font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {myInquiries.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FCFBF7] border border-stone-200 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-5 shadow-sm" id="empty-orders-view">
          <div className="w-14 h-14 bg-stone-100 border border-stone-150 rounded-2xl flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-7 h-7 text-stone-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-stone-900">No B2B Inquiries Found</h3>
            <p className="text-xs text-stone-500 font-sans max-w-xs mx-auto leading-relaxed">
              Your company hasn't placed any raw product dispatch or customized specimen trials inquiries yet.
            </p>
          </div>
          <div>
            <button
              onClick={() => setCurrentTab('catalogue')}
              className="bg-emerald-850 hover:bg-emerald-900 text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Configure RFQ Consignment
            </button>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* No Search Match */
        <div className="text-center py-12 text-stone-550 space-y-2">
          <p className="text-sm font-mono font-bold">No matching trade orders found.</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        /* Active Orders list */
        <div className="space-y-5">
          {filteredOrders.map((inq) => {
            const isExpanded = expandedOrderId === inq.id;
            const orderRef = `DRYZA-${inq.id.substring(0, 8).toUpperCase()}`;
            
            // Status Styles Mapping
            let statusBadge = '';
            let statusText = '';
            let progressStep = 1;

            switch (inq.status) {
              case 'Ordered':
                statusBadge = 'bg-amber-100 text-amber-800 border-amber-250';
                statusText = 'Received & Queued';
                progressStep = 1;
                break;
              case 'Processed':
                statusBadge = 'bg-blue-50 text-blue-800 border-blue-200';
                statusText = 'Lab QA & Sealed Packaging';
                progressStep = 2;
                break;
              case 'Shipped':
                statusBadge = 'bg-purple-100 text-purple-800 border-purple-200';
                statusText = 'Silo Consignment Dispatched';
                progressStep = 3;
                break;
              case 'Out for Delivery':
                statusBadge = 'bg-teal-50 text-teal-800 border-teal-200';
                statusText = 'Transit Approaching Destination';
                progressStep = 4;
                break;
              case 'Delivered':
                statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                statusText = 'Delivered & QA Verified';
                progressStep = 5;
                break;
              default:
                statusBadge = 'bg-[#FAF9F5] text-stone-600 border-stone-200';
                statusText = 'Inquiry Active';
                progressStep = 1;
            }

            return (
              <div 
                key={inq.id}
                className="bg-[#FCFBF7] border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all"
                id={`order-block-${inq.id}`}
              >
                {/* Order Block Header Row */}
                <div 
                  onClick={() => toggleExpand(inq.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-stone-850 uppercase tracking-wide">
                        Order {orderRef}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 border rounded-full ${statusBadge}`}>
                        ● {statusText}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-sans">
                      Date Submitted: <strong className="text-stone-700">{new Date(inq.submittedAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right">
                      <span className="block text-[10px] text-stone-400 font-mono uppercase tracking-wider font-semibold">Consignment Quote</span>
                      <span className="text-sm font-extrabold text-emerald-850 font-mono">
                        {inq.totalPrice ? `Rs. ${inq.totalPrice.toLocaleString()}` : 'Reviewing base tariff'}
                      </span>
                    </div>

                    <div className="text-stone-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Pipeline visual micro-indicator */}
                <div className="h-1 bg-stone-100 relative">
                  <div 
                    className="absolute h-full bg-emerald-700 transition-all duration-500"
                    style={{ width: `${(progressStep / 5) * 100}%` }}
                  />
                </div>

                {/* Interactive Expandable Segment */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-stone-50/30 border-t border-stone-200 space-y-6 animate-fade-in text-xs">
                    
                    {/* Vertical Timeline Order Tracking */}
                    <div className="bg-white border border-stone-150 p-6 rounded-2xl relative shadow-inner-sm overflow-hidden text-sm">
                      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
                        {[
                          { key: 'Ordered', title: 'Order Confirmed', description: 'Your order has been placed.', icon: <ShoppingBag className="w-5 h-5 text-[#5D3D2E]" /> },
                          { key: 'Processed', title: 'Seller Processed', description: 'Seller has processed your order.', icon: <Package className="w-5 h-5 text-[#5D3D2E]" /> },
                          { key: 'Shipped', title: 'Shipped', description: 'Your item has been shipped.', icon: <Truck className="w-5 h-5 text-[#5D3D2E]" /> },
                          { key: 'Out for Delivery', title: 'Out For Delivery', description: 'Your item is out for delivery', icon: <MapPin className="w-5 h-5 text-[#5D3D2E]" /> },
                          { key: 'Delivered', title: 'Delivered', description: 'Your item has been delivered', icon: <CheckCircle className="w-5 h-5 text-[#5D3D2E]" /> }
                        ].map((step, idx) => {
                          const isCompleted = progressStep > idx;
                          const isCurrent = progressStep - 1 === idx;
                          
                          // Simplified simulated dates logic based on submission time + days
                          const simulatedDate = new Date(inq.submittedAt);
                          simulatedDate.setDate(simulatedDate.getDate() + idx);
                          
                          const dateString = simulatedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' }).replace(',', '');
                          const timeString = simulatedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

                          if (!isCompleted && !isCurrent) return null; // Only show up to current status as per generic designs

                          return (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#5D3D2E]/20 bg-[#FAF7F2] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 flex-col mx-0 md:mx-auto absolute left-0 md:static transform -translate-x-[50%] md:translate-x-0">
                                {step.icon}
                              </div>
                              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 md:px-5">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <h4 className="text-[15px] font-bold text-[#5D3D2E]">{step.title}</h4>
                                  <span className="text-[11px] text-[#A3998D]">{dateString}</span>
                                </div>
                                <p className="text-[12.5px] text-[#292524]">{step.description}</p>
                                <p className="text-[11px] text-[#A3998D] mt-1.5">{dateString} - {timeString}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Breakdown & details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left: Product spec & quantities */}
                      <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                        <span className="block font-mono font-bold uppercase text-[10px] text-stone-500 tracking-wider">Itemized Trade Consignment</span>
                        
                        <div className="space-y-2 divide-y divide-stone-100">
                          {inq.productNames.map((pName, idx) => {
                            // Find matching product image if possible
                            const matchedImg = allProducts.find(p => p.name === pName)?.image;
                            
                            return (
                              <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2">
                                  {matchedImg && <img src={matchedImg} className="w-8 h-8 rounded object-cover border border-stone-100" referrerPolicy="no-referrer" />}
                                  <div>
                                    <span className="font-bold text-stone-850">{pName}</span>
                                    <span className="block text-[10px] text-stone-400 font-mono">B2B Standard Purity Sealed</span>
                                  </div>
                                </div>
                                <span className="font-mono text-stone-550">1,000 Kg</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-2 border-t flex justify-between font-mono font-bold text-stone-750 text-[11px]">
                          <span>Aggregate Tonnage:</span>
                          <span>{inq.estimatedQuantityKg.toLocaleString()} Kilograms ({ (inq.estimatedQuantityKg / 1000).toFixed(1) } MT)</span>
                        </div>
                      </div>

                      {/* Right: Technical specifications and commercial specs */}
                      <div className="space-y-3">
                        {/* Status timeline text */}
                        <div className="bg-stone-100/50 p-4 rounded-2xl border space-y-2.5">
                          <span className="block font-mono font-bold uppercase text-[10px] text-stone-500 tracking-wider">QC Testing Status</span>
                          <p className="text-[11px] leading-relaxed text-stone-600">
                            Representative: <strong className="text-stone-800">{inq.fullName}</strong> representing <strong className="text-stone-800">{inq.companyName}</strong>. 
                            Shipping destination matches registered regional office segment. 
                            Estimated dispatch queue status is audited via computerized PLC drying silo system.
                          </p>

                          {inq.adminNotes && (
                            <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-950 p-2.5 rounded-lg border border-emerald-150 font-sans">
                              🌿 <strong>Admin & Laboratory Log:</strong> {inq.adminNotes}
                            </div>
                          )}

                          {inq.couponCode && (
                            <div className="text-[10px] text-amber-900 font-mono font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block">
                              🏷️ Applied Code: {inq.couponCode}
                            </div>
                          )}

                          {inq.status === 'Ordered' && onCancelOrder && (
                            <div className="mt-4 border-t pt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if(confirm('Are you sure you want to cancel this order?')) {
                                    onCancelOrder(inq.id);
                                  }
                                }}
                                className="text-xs px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg cursor-pointer"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Loyalty Spin Wheel Qualifier */}
                        {(() => {
                          const minCartVal = wheelSettings?.spinMinCartValue ?? 499;
                          const satisfiesMin = (inq.totalPrice || 0) >= minCartVal;
                          const alreadySpun = inq.hasSpunWheel || false;

                          if (satisfiesMin && !alreadySpun) {
                            return (
                              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3.5 flex justify-between items-center gap-3">
                                <div className="space-y-1">
                                  <span className="block font-bold text-amber-950 font-display flex items-center gap-1.5 leading-none">
                                    <Gift className="w-4 h-4 text-amber-700 animate-bounce" /> Unlocked Bonus Spin!
                                  </span>
                                  <p className="text-[10px] text-amber-800 font-sans">
                                    This trade inquiry exceeds Rs. {minCartVal}! Spin the dryza loyalty board wheel to win credits.
                                  </p>
                                </div>
                                <button
                                  onClick={() => setCurrentTab('rewards')}
                                  className="bg-amber-700 hover:bg-amber-800 text-white font-mono text-[9px] uppercase font-black tracking-wider px-3.5 py-2.5 rounded-lg transition-all cursor-pointer shadow-xs shrink-0"
                                >
                                  Spin Board
                                </button>
                              </div>
                            );
                          } else if (alreadySpun && inq.spinWheelResult) {
                            return (
                              <div className="bg-[#FAF9F5] border border-stone-200 rounded-xl p-3 flex justify-between items-center">
                                <span className="text-[10px] text-stone-500 font-mono">🏆 Loyalty Spin Reward claimed:</span>
                                <span className="text-[11.5px] font-mono font-bold text-emerald-850 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-0.5">
                                  {inq.spinWheelResult}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        })()}

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Technical Note */}
      <div className="bg-[#FAF9F5] rounded-2xl border border-stone-200/80 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs text-stone-600 shadow-inner-sm">
        <div className="flex items-center gap-3 bg-stone-100 p-2.5 rounded-xl border">
          <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0" />
          <div className="font-sans leading-none">
            <span className="block font-bold text-stone-900">100% Traceability Audited</span>
            <span className="text-[10px] text-stone-400">All dispatches strictly conform to ASTA / FSSAI standards.</span>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('contact')}
          className="text-emerald-850 hover:text-emerald-950 font-semibold flex items-center gap-1 hover:underline cursor-pointer transition-all"
        >
          <span>Request Bulk Laboratory Specimen CoA Report</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
