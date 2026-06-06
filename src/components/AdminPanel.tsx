import React, { useState } from 'react';
import { Inquiry, Product, ContestEntry, Customer, Banner, Coupon, WheelSettings } from '../types';
import { CATEGORIES } from '../data';
import {
  TrendingUp, BarChart3, Database, ShieldAlert, CheckSquare, RefreshCw,
  Plus, Edit, Trash2, Mail, Phone, MapPin, Search, Calendar, ChevronRight, Calculator, Globe, X,
  Trophy, Heart, Award, Sparkles, Undo, Image as ImageIcon, Settings, Percent, Gift
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminPanelProps {
  inquiries: Inquiry[];
  products: Product[];
  onUpdateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  onUpdateInquiryNotes: (id: string, notes: string) => void;
  onDeleteInquiry: (id: string) => void;
  onUpdateProductStock: (id: string, tons: number) => void;
  onUpdateProductPrice: (id: string, priceStr: string) => void;
  onUpdateProductPhoto?: (id: string, image: string) => void;
  onUpdateProduct?: (id: string, updatedFields: Partial<Product>) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetToDemoData: () => void;
  onClearAllProducts: () => void;
  onClearAllInquiries: () => void;
  logoUrl?: string;
  onUpdateLogo?: (url: string) => void;
  customers?: any[];
  onUpdateCustomers?: (updated: any[]) => void;
  contestEntries?: any[];
  onUpdateContestEntries?: (updated: any[]) => void;
  banners?: Banner[];
  onUpdateBanners?: (updated: Banner[]) => void;
  adminPassword?: string;
  onUpdateAdminPassword?: (pass: string) => void;
  trustedCount: number;
  onUpdateTrustedCount: (count: number) => void;
  fssaiLicNo: string;
  onUpdateFssaiLicNo: (licNo: string) => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
  wheelSettings: WheelSettings;
  onUpdateWheelSettings: (settings: WheelSettings) => void;
}

export default function AdminPanel({
  inquiries,
  products,
  onUpdateInquiryStatus,
  onUpdateInquiryNotes,
  onDeleteInquiry,
  onUpdateProductStock,
  onUpdateProductPrice,
  onUpdateProductPhoto,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetToDemoData,
  onClearAllProducts,
  onClearAllInquiries,
  logoUrl = '',
  onUpdateLogo,
  customers = [],
  onUpdateCustomers,
  contestEntries = [],
  onUpdateContestEntries,
  banners = [],
  onUpdateBanners,
  adminPassword = '',
  onUpdateAdminPassword,
  trustedCount,
  onUpdateTrustedCount,
  fssaiLicNo,
  onUpdateFssaiLicNo,
  coupons = [],
  onUpdateCoupons,
  wheelSettings,
  onUpdateWheelSettings,
}: AdminPanelProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'leads' | 'inventory' | 'estimator' | 'clients' | 'authentication' | 'engagement' | 'banners' | 'settings'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Specific Inquiry selected for full inspection
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  // States for inventory editing
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [tempImage, setTempImage] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');
  const [tempDescription, setTempDescription] = useState<string>('');
  const [tempShelfLife, setTempShelfLife] = useState<string>('');
  const [tempCsPrice, setTempCsPrice] = useState<string>('');

  // States for estimated cargo calculator
  const [calcProduct, setCalcProduct] = useState<string>('');

  // Sync cargo calculator option with first loaded spice ingredient
  React.useEffect(() => {
    if (!calcProduct && products.length > 0) {
      setCalcProduct(products[0].id);
    }
  }, [products, calcProduct]);

  // States for new Product Item Form
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProdId, setNewProdId] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('garlic');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdStock, setNewProdStock] = useState<number>(10);
  const [newProdPriceRange, setNewProdPriceRange] = useState('₹4.00 - ₹6.50');
  const [newProdCsPriceRange, setNewProdCsPriceRange] = useState('₹4.50 - ₹7.00');
  const [newProdShelfLife, setNewProdShelfLife] = useState('12 Months');
  const [newProdImage, setNewProdImage] = useState('');

  // States for corporate logo crop & circle masking
  const [logoCropScale, setLogoCropScale] = useState<number>(1);
  const [logoCropX, setLogoCropX] = useState<number>(0);
  const [logoCropY, setLogoCropY] = useState<number>(0);
  const [showLogoCropper, setShowLogoCropper] = useState<boolean>(false);

  // States for advanced product custom details
  const [newProdLongDescription, setNewProdLongDescription] = useState('');
  const [newProdGrade, setNewProdGrade] = useState('Grade AA');
  const [newProdAppearance, setNewProdAppearance] = useState('Granular/Sieved');
  const [newProdPackaging, setNewProdPackaging] = useState('20 kg multi-barrier paper bags, 500 kg jumbo packages');
  const [newProdApplications, setNewProdApplications] = useState('Snack coatings, pre-baked products, spice mixes, instant soups');
  const [newProdStorage, setNewProdStorage] = useState('Keep in an airtight container in a cool, low-humidity food repository.');
  const [newProdOrigin, setNewProdOrigin] = useState('India');
  const [newProdQualityStandards, setNewProdQualityStandards] = useState('HACCP Compliant, ISO 22000 Approved, Non-GMO Verified, Halal Certified');

  const [calcQuantityKg, setCalcQuantityKg] = useState<number>(5000);
  const [calcDestination, setCalcDestination] = useState<string>('USA');
  const [calcFreightRateMT, setCalcFreightRateMT] = useState<number>(10000); // INR per MT

  // States for Coupon and Settings administration
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponExp, setNewCouponExp] = useState('2026-12-31');

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const term = searchTerm.toLowerCase();
    return (
      inq.companyName.toLowerCase().includes(term) ||
      inq.fullName.toLowerCase().includes(term) ||
      inq.country.toLowerCase().includes(term) ||
      inq.productNames.some(pn => pn.toLowerCase().includes(term))
    );
  });

  // Generate historical data array for Recharts over the last 30 days ending June 6, 2026
  const last30DaysTrendData = React.useMemo(() => {
    const data = [];
    const today = new Date('2026-06-06T00:00:00Z'); // anchor to current workspace date
    for (let i = 29; i >= 0; i--) {
      const tempDate = new Date(today);
      tempDate.setUTCDate(today.getUTCDate() - i);
      const isoYMD = tempDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const dayLabel = tempDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

      // Aggregate inquiries that fell on this UTC day
      const dayMatches = inquiries.filter((inq) => {
        if (!inq.submittedAt) return false;
        return inq.submittedAt.split('T')[0] === isoYMD;
      });

      data.push({
        name: dayLabel,
        count: dayMatches.length,
        volumeMT: dayMatches.reduce((acc, curr) => acc + (curr.estimatedQuantityKg / 1000), 0)
      });
    }
    return data;
  }, [inquiries]);

  const CustomTooltipTrend = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-950/95 backdrop-blur-md text-stone-100 p-3.5 rounded-2xl border border-stone-800 shadow-xl text-xs font-mono space-y-1">
          <p className="font-bold text-stone-300 border-b border-stone-800 pb-1 mb-1">{label}</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-stone-400">Total Leads:</span>
            <span className="text-amber-400 font-black">{payload[0].value} entry/entries</span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-stone-400">Total volume:</span>
              <span className="text-emerald-400 font-black">{Number(payload[1].value).toFixed(2)} MT</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Derived dashboard analytics values
  const totalLeads = inquiries.length;
  const pendingLeads = inquiries.filter((i) => i.status === 'Ordered').length;
  const underReviewLeads = inquiries.filter((i) => i.status === 'Packaging').length;
  const quotedLeads = inquiries.filter((i) => i.status === 'Shipped').length;
  const totalVolumeRequestedKg = inquiries.reduce((sum, current) => sum + current.estimatedQuantityKg, 0);
  
  // Create beautiful category request ratios for visual SVG charts
  const categoryRatios = products.reduce((acc, current) => {
    const matchedQuotesCount = inquiries.filter(inq => inq.productIds.includes(current.id)).length;
    if (matchedQuotesCount > 0) {
      acc[current.categoryLabel] = (acc[current.categoryLabel] || 0) + matchedQuotesCount;
    }
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryRatios).map(([name, value]) => ({ name, value }));

  // Dynamic canvas circle-cropping action for brand logo uploader
  const handleLogoCircleCropSubmit = () => {
    if (!logoUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous"; // bypass CORS for data-urls or CORS headers
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 512; // output high-res 512x512 square transparent PNG image
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear layout to be fully transparent
      ctx.clearRect(0, 0, size, size);

      // Create a circular clipping mask
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // Clear clip area again
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, size, size);

      // Draw original image centered inside circular boundaries with user transforms
      const imgAspect = img.width / img.height;
      let drawW = size;
      let drawH = size;
      if (imgAspect > 1) {
        drawH = size * logoCropScale;
        drawW = drawH * imgAspect;
      } else {
        drawW = size * logoCropScale;
        drawH = drawW / imgAspect;
      }

      // Center original image + apply sliders pixel ratios
      const drawX = (size - drawW) / 2 + (logoCropX * (size / 100));
      const drawY = (size - drawH) / 2 + (logoCropY * (size / 100));

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      try {
        const croppedPNG = canvas.toDataURL('image/png');
        if (onUpdateLogo) {
          onUpdateLogo(croppedPNG);
          setShowLogoCropper(false);
          // Reset slider modifiers
          setLogoCropScale(1);
          setLogoCropX(0);
          setLogoCropY(0);
          alert('Corporate Logo cropped instantly as a perfect transparent PNG Circle!');
        }
      } catch (err) {
        alert('CORS Policy restriction: If utilizing a remote image link, circle cropping is limited due to server-side policy. Please upload a local image file instead for instant circle cropping capabilities!');
      }
    };
    img.onerror = () => {
      alert('Error loading image. Please double-check file integrity or try an alternative image link.');
    };
    img.src = logoUrl;
  };

  // Quick edit trigger
  const triggerEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setTempStock(prod.stockTons);
    setTempPrice(prod.pricePerKgRange);
    setTempImage(prod.image || '');
    setTempName(prod.name);
    setTempDescription(prod.description || '');
    setTempShelfLife(prod.shelfLife || '12 Months');
    setTempCsPrice(prod.csPricePerKgRange || prod.pricePerKgRange);
  };

  const saveProductMods = (id: string) => {
    if (onUpdateProduct) {
      onUpdateProduct(id, {
        name: tempName,
        stockTons: tempStock,
        pricePerKgRange: tempPrice,
        csPricePerKgRange: tempCsPrice,
        shelfLife: tempShelfLife,
        description: tempDescription,
        image: tempImage
      });
    } else {
      onUpdateProductStock(id, tempStock);
      onUpdateProductPrice(id, tempPrice);
      if (onUpdateProductPhoto && tempImage) {
        onUpdateProductPhoto(id, tempImage);
      }
    }
    setEditingProductId(null);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) {
      alert("Please specify a Name for this dehydrated ingredient.");
      return;
    }

    const matchedCategory = CATEGORIES.find(c => c.id === newProdCategory);
    const categoryLabel = matchedCategory ? matchedCategory.label : 'Premium Ingredients';

    const cleanId = newProdId.trim().toLowerCase() || `dryza-${newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // Parse comma-separated inputs safely
    const packagingArray = newProdPackaging 
      ? newProdPackaging.split(',').map(s => s.trim()).filter(Boolean)
      : ['20 kg multi-barrier paper bags'];

    const applicationsArray = newProdApplications
      ? newProdApplications.split(',').map(s => s.trim()).filter(Boolean)
      : ['Snack coatings', 'Spice mixes', 'Instant soups'];

    const qualityStandardsArray = newProdQualityStandards
      ? newProdQualityStandards.split(',').map(s => s.trim()).filter(Boolean)
      : ['HACCP Compliant', 'ISO 22050 Approved'];

    const newProd: Product = {
      id: cleanId,
      name: newProdName,
      category: newProdCategory as Product['category'],
      categoryLabel,
      description: newProdDescription || 'High-purity dehydrated ingredient processed specifically for wholesale and commercial operations.',
      longDescription: newProdLongDescription || `${newProdName} meticulously processed by Dryza Spices under strict sanitary environments using advanced continuous dehydration zones. Perfect replacement for fresh seasoning with optimal oil conservation.`,
      appearance: newProdAppearance || 'Sieved quality matching selective specifications',
      shelfLife: newProdShelfLife || '12 Months',
      packaging: packagingArray,
      applications: applicationsArray,
      storage: newProdStorage || 'Keep in an airtight container in a cool, low-humidity food repository.',
      origin: newProdOrigin || 'India',
      qualityStandards: qualityStandardsArray,
      stockTons: Number(newProdStock) || 0,
      pricePerKgRange: newProdPriceRange || '₹4.00 - ' + String.fromCharCode(8377) + '6.50',
      csPricePerKgRange: newProdCsPriceRange || newProdPriceRange || '₹4.50 - ' + String.fromCharCode(8377) + '7.00',
      isPopular: true,
      image: newProdImage.trim() || 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600'
    };

    onAddProduct(newProd);

    // Reset fields
    setNewProdId('');
    setNewProdName('');
    setNewProdDescription('');
    setNewProdStock(10);
    setNewProdPriceRange('₹4.00 - ₹6.50');
    setNewProdCsPriceRange('₹4.50 - ₹7.00');
    setNewProdShelfLife('12 Months');
    setNewProdImage('');
    setNewProdLongDescription('');
    setNewProdGrade('Grade AA');
    setNewProdAppearance('Granular/Sieved');
    setNewProdPackaging('20 kg multi-barrier paper bags, 500 kg jumbo packages');
    setNewProdApplications('Snack coatings, pre-baked products, spice mixes, instant soups');
    setNewProdStorage('Keep in an airtight container in a cool, low-humidity food repository.');
    setNewProdOrigin('India');
    setNewProdQualityStandards('HACCP Compliant, ISO 22000 Approved, Non-GMO Verified, Halal Certified');
    setShowAddProductForm(false);
  };

  // Pricing formula estimate for B2B portal
  const calculateB2BQuoteEstimate = () => {
    const prodObj = products.find(p => p.id === calcProduct);
    if (!prodObj) return { baseCost: 0, freightCost: 0, customsApproximation: 0, grandCIF: 0 };
    
    // Parse approximate base price per kg from range (e.g. "₹3.50 - ₹4.40" -> average 3.95)
    let averagePrice = 4.0;
    const matches = prodObj.pricePerKgRange.match(/[\d.]+/g);
    if (matches && matches.length >= 1) {
      const parsed = matches.map(Number);
      averagePrice = parsed.length === 2 ? (parsed[0] + parsed[1]) / 2 : parsed[0];
    }

    const baseCost = calcQuantityKg * averagePrice;
    const weightMT = calcQuantityKg / 1000;
    const freightCost = weightMT * calcFreightRateMT;
    const customsApproximation = baseCost * 0.045; // 4.5% standard duties
    const grandCIF = baseCost + freightCost + customsApproximation;

    return { baseCost, freightCost, customsApproximation, grandCIF };
  };

  const quoteCalculated = calculateB2BQuoteEstimate();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-200 space-y-8" id="admin-control-suite">
      
      {/* Tab Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-stone-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>Dryza Executive Console</span>
              <span className="bg-red-101 border border-red-200 text-red-700 text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full">
                Secured Admin Access
              </span>
            </h2>
            <p className="text-xs text-stone-500 font-medium">Manage wholesale RFQs, adjust dry-mill inventory parameters, and model global freight costs.</p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-stone-100 rounded-xl w-full max-w-2xl">
          <button
            onClick={() => setActiveAdminSubTab('leads')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'leads' ? 'bg-amber-150 bg-amber-600 text-white' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Orders Portal ({totalLeads})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('inventory')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'inventory' ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('estimator')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'estimator' ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
            }`}
          >
            Freight CIF Estimator
          </button>
          <button
            onClick={() => setActiveAdminSubTab('clients')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'clients' ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
            }`}
          >
            Client Accounts Info ({customers?.length || 0})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('engagement')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'engagement' ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
            }`}
          >
            Engagement & Contests ({contestEntries?.length || 0})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('banners')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'banners' ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
            }`}
          >
            Banners ({banners?.length || 0})
          </button>
          <button
            onClick={() => setActiveAdminSubTab('settings')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'settings' ? 'bg-amber-100 text-amber-800 font-black' : 'text-stone-500'
            }`}
          >
            ⚙️ App Settings & Coupons
          </button>
          <button
            onClick={() => setActiveAdminSubTab('authentication')}
            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg cursor-pointer ${
              activeAdminSubTab === 'authentication' ? 'bg-amber-100 text-amber-800' : 'text-stone-500'
            }`}
          >
            Passcode Options
          </button>
        </div>
      </div>

      {/* Analytics Cards Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-50 p-4.5 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">Grand RFQ Volume</span>
          <span className="text-2xl font-extrabold text-stone-900 block mt-1">{(totalVolumeRequestedKg / 1000).toFixed(1)} MT</span>
          <p className="text-[9.5px] text-zinc-500 font-mono mt-1">Requested Dehydrated weight sum</p>
        </div>
        <div className="bg-stone-50 p-4.5 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-mono text-emerald-800 uppercase font-bold block">In Packaging</span>
          <span className="text-2xl font-extrabold text-[#115E59] block mt-1">{underReviewLeads} Orders</span>
          <p className="text-[9.5px] text-emerald-600 font-mono mt-1">Orders currently being packaged</p>
        </div>
        <div className="bg-stone-50 p-4.5 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-mono text-amber-800 uppercase font-bold block">Shipped Orders Rate</span>
          <span className="text-2xl font-extrabold text-amber-800 block mt-1">
            {totalLeads > 0 ? ((quotedLeads / totalLeads) * 100).toFixed(0) : 0}%
          </span>
          <p className="text-[9.5px] text-amber-600 font-mono mt-1">Status changed from Ordered</p>
        </div>
        <div className="bg-stone-50 p-4.5 rounded-2xl border border-stone-200">
          <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">Silo Types Tracked</span>
          <span className="text-2xl font-extrabold text-stone-900 block mt-1">{products.length} Products</span>
          <p className="text-[9.5px] text-zinc-500 font-mono mt-1">100% compliant premium varieties</p>
        </div>
      </div>

      {/* Control Tools Utility Center */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="console-utility-bar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-850 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-stone-900">Console Storage Controls</span>
            <span className="block text-[10px] text-stone-500">Seed authentic dry-mill spices and explore demo cart orders.</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset current database and populate with authentic Dryza Spices & cart orders? This will overwrite existing records.")) {
                onResetToDemoData();
              }
            }}
            className="px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/50 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>Seed 16 Spices + 3 Leads</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Panel 1: Leads Master Board */}
      {activeAdminSubTab === 'leads' && (
        <div className="space-y-4" id="leads-board-panel">
          
          {/* Recharts Analytics: 30-Day Inquiry Trend */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm" id="recharts-inquiry-trend-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-amber-700">
                  Global Freight & Order Analytics
                </span>
                <h4 className="text-base font-bold text-stone-900 font-sans tracking-tight">
                  Last 30 Days B2B Cart Orders Trend
                </h4>
              </div>
              
              {/* Legends */}
              <div className="flex items-center gap-4 text-[10.5px] font-mono font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-600 block shrink-0" />
                  <span className="text-stone-600">Total Leads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 block shrink-0" />
                  <span className="text-stone-600">Requested Volume (MT)</span>
                </div>
              </div>
            </div>

            {/* Recharts Element */}
            <div className="h-48 md:h-56 w-full select-none" id="trend-graph-recharts">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last30DaysTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#78716C" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={8}
                    interval={2}
                  />
                  <YAxis 
                    stroke="#78716C" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={true}
                  />
                  <Tooltip content={<CustomTooltipTrend />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#D97706" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="volumeMT" 
                    stroke="#10B981" 
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    fillOpacity={1} 
                    fill="url(#colorVolume)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <h3 className="text-lg font-bold text-stone-900 font-sans tracking-tight shrink-0 self-start">
              Corporate Shopping Cart Orders Tracker
            </h3>
            
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by company, client name, port country or product..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-240 rounded-xl outline-none focus:border-amber-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Table or list of inquiries */}
            <div className="lg:col-span-7 space-y-3">
              {filteredInquiries.length === 0 ? (
                <div className="border rounded-2xl p-8 text-center text-stone-500 text-xs">
                  No active B2B orders match your criteria. All incoming shopper orders are clean.
                </div>
              ) : (
                filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-3 ${
                      selectedInquiryId === inq.id
                        ? 'border-amber-550 bg-amber-50/20 shadow-md'
                        : inq.status === 'Ordered'
                        ? 'border-emerald-200 bg-emerald-50/10 hover:border-emerald-300'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          {inq.submittedAt ? new Date(inq.submittedAt).toLocaleDateString() : 'Active Portal'} | {inq.id}
                        </span>
                        <h4 className="text-sm font-extrabold text-stone-900 mt-0.5">{inq.companyName}</h4>
                        <span className="text-stone-500 italic block">{inq.fullName} - {inq.country}</span>
                      </div>

                      {/* Status indicator badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wide ${
                        inq.status === 'Ordered'
                          ? 'bg-amber-100 text-amber-900'
                          : inq.status === 'Packaging'
                          ? 'bg-amber-200/60 text-amber-950 animate-pulse'
                          : inq.status === 'Shipped'
                          ? 'bg-cyan-100 text-cyan-950'
                          : inq.status === 'Out for Delivery'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-emerald-105 text-emerald-800 bg-emerald-50'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-2.5 font-mono text-[10.5px]">
                      <span className="text-stone-600 font-bold">
                        Qty: <span className="text-stone-900 font-extrabold">{(inq.estimatedQuantityKg / 1000).toLocaleString()} MT</span>
                      </span>
                      <span className="text-stone-505 max-w-[200px] truncate">
                        {inq.productNames.join(', ')}
                      </span>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Selected Inquiry Detail Inspector Panel */}
            <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-5 border border-stone-200 h-fit space-y-4">
              {(() => {
                const activeLead = inquiries.find(i => i.id === selectedInquiryId) || inquiries[0];
                if (!activeLead) {
                  return (
                    <div className="text-stone-400 text-center font-mono py-12 text-xs">
                      No Leads initialized. Queue is clean.
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 text-xs">
                    <div className="border-b pb-3 border-stone-200">
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-stone-400 font-bold">
                        Live Quote Desk Inspection
                      </span>
                      <h4 className="text-base font-extrabold text-stone-950 mt-1">{activeLead.companyName}</h4>
                      <p className="text-stone-500 italic mt-0.5">{activeLead.customerType.toUpperCase()} Hub | {activeLead.country}</p>
                    </div>

                    {/* Quick contact panel */}
                    <div className="space-y-1.5 font-mono text-[11px] text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="text-stone-900 select-all font-bold">{activeLead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="text-stone-900 select-all font-bold">{activeLead.phone}</span>
                      </div>
                    </div>

                    {/* Products details segment */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-bold">
                        Requested Dehydrated Spices Range
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {activeLead.productNames.map((pn, i) => (
                          <span key={i} className="bg-white border border-stone-200 px-2.5 py-1 rounded-lg font-mono font-medium text-stone-800">
                            {pn}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quantity spec */}
                    <div className="p-3 bg-white rounded-xl border flex justify-between items-center">
                      <span className="font-semibold text-stone-600 font-sans">Required Volume:</span>
                      <span className="font-mono font-black text-emerald-900 border-stone-200 text-stone-900 font-bold">
                        {activeLead.estimatedQuantityKg.toLocaleString()} Kilograms ({ (activeLead.estimatedQuantityKg / 1000).toFixed(1) } MT)
                      </span>
                    </div>

                    {/* B2B Commercial Price Sync */}
                    <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 space-y-1.5">
                      <div className="flex justify-between items-center text-stone-700">
                        <span className="font-semibold font-sans">Estimated Order Price:</span>
                        <span className="font-mono font-bold text-stone-900">
                          {activeLead.totalPrice ? `Rs. ${activeLead.totalPrice.toLocaleString()}` : "Rs. " + (activeLead.estimatedQuantityKg * 350).toLocaleString()}
                        </span>
                      </div>
                      {activeLead.couponCode && (
                        <div className="flex justify-between items-center text-[11px] text-emerald-800">
                          <span>Applied Coupon:</span>
                          <span className="font-mono font-bold">{activeLead.couponCode.toUpperCase()}</span>
                        </div>
                      )}
                      {activeLead.discountAmount && (
                        <div className="flex justify-between items-center text-[11px] text-emerald-800">
                          <span>Promo Discount:</span>
                          <span className="font-mono font-semibold">-Rs. {activeLead.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {activeLead.csType && (
                        <div className="flex justify-between items-center text-[11px] text-amber-800 border-t pt-1 border-stone-200 mt-1">
                          <span>CS Representative Type:</span>
                          <span className="font-mono font-bold uppercase">{activeLead.csType}</span>
                        </div>
                      )}
                    </div>

                    {/* Message / Customer custom specs */}
                    <div className="bg-amber-50/20 p-3.5 rounded-xl border border-stone-204 space-y-1">
                      <span className="block text-[9.5px] uppercase font-mono font-bold text-stone-400">
                        Customer Spec Notes
                      </span>
                      <p className="text-stone-850 leading-relaxed font-sans mt-1 italic select-text">
                        "{activeLead.message}"
                      </p>
                      {activeLead.attachmentName && (
                        <div className="mt-2.5 bg-stone-100 p-1.5 rounded-lg border border-stone-200 text-[10.5px] font-mono font-medium text-stone-700 flex items-center justify-between">
                          <span className="truncate max-w-[200px]" title={activeLead.attachmentName}>
                            📁 {activeLead.attachmentName}
                          </span>
                          <span className="text-[9.5px] font-bold text-emerald-800 uppercase animate-pulse">
                            Securely Sanitized
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pipeline Status update section */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-bold">
                        Transition Pipeline Status
                      </span>
                      <div className="grid grid-cols-5 gap-1 font-mono text-[9px] font-extrabold text-center">
                        {(['Ordered', 'Packaging', 'Shipped', 'Out for Delivery', 'Delivered'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => onUpdateInquiryStatus(activeLead.id, st)}
                            className={`py-1.5 rounded-lg cursor-pointer ${
                              activeLead.status === st
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'bg-white hover:bg-stone-200 text-stone-705 border border-stone-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Private Admin Notes log */}
                    <div className="space-y-1 rounded-xl">
                      <span className="block text-[10px] text-zinc-400 uppercase font-mono tracking-wider font-bold col-span-2">
                        Internal Dryza Staff comments
                      </span>
                      <textarea
                        rows={2}
                        placeholder="Write custom notes like: Standard sample dispatched under batch #G-140, CIF pricing accepted but checking raw garlic tonnage limits..."
                        className="w-full text-xs p-2 bg-white border border-stone-200 rounded-xl outline-none focus:border-amber-700"
                        value={activeLead.adminNotes || ''}
                        onChange={(e) => onUpdateInquiryNotes(activeLead.id, e.target.value)}
                      />
                    </div>

                    {/* Danger action */}
                    <div className="flex justify-between items-center pt-2.5 border-t border-stone-200">
                      <span className="text-[10px] font-mono text-stone-400">Manage records:</span>
                      <button
                        onClick={() => {
                          if (confirm("Permanently archive and delete this RFQ lead from the Dryza board?")) {
                            onDeleteInquiry(activeLead.id);
                            setSelectedInquiryId(null);
                          }
                        }}
                        className="text-red-650 hover:text-red-800 font-bold font-mono text-[10.5px] flex items-center hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        <span>Discard Lead</span>
                      </button>
                    </div>

                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      )}

      {/* Sub Tab Panel 2: Product Silo Tonnage Stock Manager */}
      {activeAdminSubTab === 'inventory' && (
        <div className="space-y-6 animate-fade-in" id="inventory-board-panel">
          
          {/* Corporate Brand Logo Customization Module */}
          <div className="bg-gradient-to-br from-amber-50/80 to-white border border-amber-200/80 rounded-3xl p-5 md:p-6 space-y-4 shadow-sm" id="corporate-logo-editor">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-850 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5 text-amber-800" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-800 block">
                  Corporate Identity Settings
                </span>
                <h4 className="text-base font-extrabold text-stone-950 font-sans tracking-tight">
                  Dynamic Brand Logo Customization
                </h4>
              </div>
            </div>

            <p className="text-xs text-stone-650 max-w-2xl leading-relaxed text-left">
              Modify your official corporate logo to instantly update across the global storefront layout, including the Main Header Navbar and Footer. You can choose a local file or input an external URL.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center text-left">
              {/* Logo Preview box */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 h-36">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">Live Brand Preview</span>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden bg-white border shadow-inner">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Corporate Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 font-mono font-bold font-sans">
                      Default SVG
                    </div>
                  )}
                </div>
                {logoUrl && (
                  <span className="text-[9px] text-emerald-800 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Custom Logo Active</span>
                )}
              </div>

              {/* Input channels */}
              <div className="md:col-span-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Upload channel */}
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-stone-700 font-mono uppercase tracking-wider">
                      Upload Logo Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string' && onUpdateLogo) {
                              onUpdateLogo(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-stone-605 block file:mr-3.5 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-amber-200 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                    />
                  </div>

                  {/* Remote url channel */}
                  <div className="space-y-1.5">
                    <label className="block text-[10.5px] font-bold text-stone-700 font-mono uppercase tracking-wider">
                      Or Remote Image URL
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 bg-white border border-stone-200 rounded-xl font-mono text-xs outline-none focus:border-amber-700"
                      placeholder="https://example.com/logo.png"
                      value={logoUrl}
                      onChange={(e) => onUpdateLogo && onUpdateLogo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {logoUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => onUpdateLogo && onUpdateLogo('')}
                        className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Reset to Official Default Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLogoCropper(!showLogoCropper)}
                        className={`px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          showLogoCropper 
                            ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs' 
                            : 'bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{showLogoCropper ? 'Close Crop Studio' : 'Apply Circular Crop & Mask'}</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Sub Crop Studio Workshop Rendered dynamically */}
                {logoUrl && showLogoCropper && (
                  <div className="bg-white border-2 border-dashed border-amber-300 p-4 rounded-2xl space-y-4 shadow-sm text-left mt-3 max-w-2xl animate-fade-in" id="circular-overlay-cropper">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-mono font-bold text-amber-805 uppercase tracking-widest">Logo Circle mask cropping station</span>
                      <h5 className="text-xs font-black uppercase text-stone-850 font-mono">Custom Round Frame Fit Adjuster</h5>
                      <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                        Slide zoom and position values to align properly inside the circle cutout template, then trigger circular clipping.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                      {/* Round Live cropping crop-mask preview frame */}
                      <div className="flex flex-col items-center justify-center p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                        <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider mb-2.5">Circular Mask Preview</span>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-700 shadow bg-white flex items-center justify-center relative">
                          <img 
                            src={logoUrl} 
                            alt="Visual Crop Mock" 
                            style={{ 
                              transform: `scale(${logoCropScale}) translate(${logoCropX}px, ${logoCropY}px)`, 
                              transformOrigin: 'center center',
                              transition: 'none'
                            }} 
                            className="max-w-full max-h-full object-contain" 
                          />
                        </div>
                        <span className="text-[8.5px] text-amber-800 font-mono mt-2 uppercase font-medium">Safe Boundary circle</span>
                      </div>

                      {/* Slider adjusters */}
                      <div className="space-y-3 font-sans text-xs text-stone-605">
                        {/* Zoom / Scale factor */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[10px]">
                            <span className="font-bold">ZOOM MAGNIFICATION</span>
                            <span className="text-emerald-800 font-extrabold">{logoCropScale.toFixed(2)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.05"
                            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                            value={logoCropScale}
                            onChange={(e) => setLogoCropScale(parseFloat(e.target.value))}
                          />
                        </div>

                        {/* Position X factor */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[10px]">
                            <span className="font-bold">SHIFT HORIZONTAL (X)</span>
                            <span className="text-stone-800 font-bold">{logoCropX}px</span>
                          </div>
                          <input
                            type="range"
                            min="-120"
                            max="120"
                            step="1"
                            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                            value={logoCropX}
                            onChange={(e) => setLogoCropX(parseInt(e.target.value))}
                          />
                        </div>

                        {/* Position Y factor */}
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[10px]">
                            <span className="font-bold">SHIFT VERTICAL (Y)</span>
                            <span className="text-stone-800 font-bold">{logoCropY}px</span>
                          </div>
                          <input
                            type="range"
                            min="-120"
                            max="120"
                            step="1"
                            className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
                            value={logoCropY}
                            onChange={(e) => setLogoCropY(parseInt(e.target.value))}
                          />
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={handleLogoCircleCropSubmit}
                            className="px-3.5 py-1.5 bg-emerald-850 hover:bg-emerald-900 font-mono text-[10.5px] font-black uppercase text-[#FCFBF7] rounded-xl cursor-pointer shadow-sm transition-all"
                          >
                            Apply Circle Mask Crop
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowLogoCropper(false);
                              setLogoCropScale(1);
                              setLogoCropX(0);
                              setLogoCropY(0);
                            }}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-[10.5px] font-mono uppercase font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-sans tracking-tight">
                Products Catalog & Silo Stocks
              </h3>
              <p className="text-xs text-stone-500">Manage all registered wholesale dehydrated ingredients, register new products, or customize baseline stock volume/pricing estimates.</p>
            </div>
            
            {/* Direct bulk seeding trigger */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddProductForm(!showAddProductForm)}
                className="bg-emerald-850 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                id="add-new-product-subtab-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
              <div className="p-1 px-3 bg-stone-100 rounded-xl text-xs font-semibold text-stone-750 font-mono flex items-center border">
                Status: Active Directory
              </div>
            </div>
          </div>

          {/* Add Product Form Overlay/Section */}
          {showAddProductForm && (
            <form onSubmit={handleProductSubmit} className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-5 space-y-4 text-xs animate-fade-in" id="add-product-form">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-stone-900 text-sm flex items-center gap-1 font-sans">
                  <Plus className="w-4 h-4 text-emerald-850" /> Register New Product & Spice Ingredient
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddProductForm(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Ingredient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dehydrated Ginger Flakes"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Code ID (optional Slug)</label>
                  <input
                    type="text"
                    placeholder="e.g. ginger-flakes"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdId}
                    onChange={(e) => setNewProdId(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Category Group</label>
                  <select
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Silo Bulk Stock (MT)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 15"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg font-mono"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Price Per Kg B2B Range</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4.20 - ₹5.10"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg font-mono"
                    value={newProdPriceRange}
                    onChange={(e) => setNewProdPriceRange(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Product Image (File or URL)</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setNewProdImage(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-stone-600 block file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste an image URL instead..."
                      className="w-full p-2 bg-white border border-stone-250 rounded-lg font-mono text-xs"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                    />
                    {newProdImage && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] text-emerald-800 font-mono font-bold">Image selected:</span>
                        <img src={newProdImage} alt="Preview" className="w-8 h-8 rounded-md object-cover border" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CS Price Differentiation and Shelf Life Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-750">CS Representative Price Range *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹4.40 - ₹6.20"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg font-mono"
                    value={newProdCsPriceRange}
                    onChange={(e) => setNewProdCsPriceRange(e.target.value)}
                  />
                  <span className="text-[10px] text-stone-400 block font-normal">Entered prices display specifically for CS-authorized buyers.</span>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-750">Shelf Life Specification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12 Months / 24 Months"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg font-sans"
                    value={newProdShelfLife}
                    onChange={(e) => setNewProdShelfLife(e.target.value)}
                  />
                  <span className="text-[10px] text-stone-400 block font-normal">Maximum expiration duration under standard storage.</span>
                </div>
              </div>

              {/* Advanced Specifications / More Information Header */}
              <div className="pt-2 border-t border-stone-200">
                <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-800 mb-3">
                  Advanced Specifications & More Information
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-705">Sieve/Mesh Appearance</label>
                    <input
                      type="text"
                      placeholder="e.g. Off-white granules"
                      className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                      value={newProdAppearance}
                      onChange={(e) => setNewProdAppearance(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-stone-705">Country of Origin</label>
                    <input
                      type="text"
                      placeholder="e.g. India"
                      className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                      value={newProdOrigin}
                      onChange={(e) => setNewProdOrigin(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Packaging Solutions (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="25 kg poly bag, 50 kg carton, Custom pallets"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdPackaging}
                    onChange={(e) => setNewProdPackaging(e.target.value)}
                  />
                  <span className="text-[9.5px] text-stone-400">Separated by commas</span>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Industrial Applications (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Instant noodles, seasoning manufacturers, sauces, soups"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdApplications}
                    onChange={(e) => setNewProdApplications(e.target.value)}
                  />
                  <span className="text-[9.5px] text-stone-400">Separated by commas</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Airtight Storage Instruction</label>
                  <input
                    type="text"
                    placeholder="Store in dry, low humidity, clean conditions"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdStorage}
                    onChange={(e) => setNewProdStorage(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-stone-705">Quality Certifications (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="HACCP Compliant, ISO 22000, Non-GMO Verified, Halal"
                    className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                    value={newProdQualityStandards}
                    onChange={(e) => setNewProdQualityStandards(e.target.value)}
                  />
                  <span className="text-[9.5px] text-stone-400">Separated by commas</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-stone-705">Short Sourcing Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe volatile oil details, sorting type, slice width, or microbiological treatments..."
                  className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-stone-705">Long Elaborate Narrative Description (Commercial Detail Page)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Meticulously processed under clean, continuous zones. Excellent heat resistance, perfect for baking..."
                  className="w-full p-2 bg-white border border-stone-250 rounded-lg"
                  value={newProdLongDescription}
                  onChange={(e) => setNewProdLongDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddProductForm(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-lg font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-850 text-white hover:bg-emerald-900 rounded-lg font-mono font-bold shadow"
                >
                  Save Ingredient
                </button>
              </div>
            </form>
          )}

          {/* Product stocks table */}
          <div className="overflow-x-auto border rounded-2xl bg-stone-50/50">
            <table className="w-full text-left text-xs text-stone-800 border-collapse">
              <thead className="bg-[#FCFBF7] text-stone-500 font-mono text-[10px] uppercase border-b">
                <tr>
                  <th className="px-5 py-3">Ingredient Name</th>
                  <th className="px-5 py-3">Category Group</th>
                  <th className="px-5 py-3">Estimated Silo Bulk stock</th>
                  <th className="px-5 py-3">B2B Tag Price Range</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-stone-400 font-mono italic">
                      No silo stock items loaded inside the Dryza Register. Panel is completely empty. Click 'Seed 16 Spices + 3 Leads' above to restock instantly.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    return editingProductId === prod.id ? (
                      <tr key={prod.id} className="bg-amber-50/40 border border-amber-305 transition-colors" id={`edit-row-${prod.id}`}>
                        <td colSpan={5} className="px-6 py-6 font-sans">
                          <div className="space-y-4 max-w-3xl">
                            <div className="flex justify-between items-center border-b pb-1.5 mb-1">
                              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5 font-sans">
                                Modify Ingredient Specifications: <span className="text-emerald-900 font-extrabold">{prod.name}</span>
                              </span>
                              <span className="text-stone-400 font-mono text-[9px]">ID: {prod.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Ingredient Name *</label>
                                <input
                                  type="text"
                                  className="w-full text-xs p-2 bg-white border border-stone-250 rounded-lg outline-none focus:border-emerald-700 font-sans"
                                  value={tempName}
                                  onChange={(e) => setTempName(e.target.value)}
                                  required
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Silo Stock (MT) *</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  className="w-full text-xs p-2 bg-white border border-stone-250 rounded-lg font-mono outline-none focus:border-emerald-700"
                                  value={tempStock}
                                  onChange={(e) => setTempStock(Number(e.target.value))}
                                  required
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider font-mono">Shelf Life Option *</label>
                                <input
                                  type="text"
                                  className="w-full text-xs p-2 bg-white border border-stone-250 rounded-lg outline-none focus:border-emerald-700 font-sans"
                                  value={tempShelfLife}
                                  onChange={(e) => setTempShelfLife(e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider font-mono">B2B Corporate Price per Kg *</label>
                                <input
                                  type="text"
                                  className="w-full text-xs p-2 bg-white border border-stone-250 rounded-lg font-mono outline-none focus:border-emerald-700"
                                  value={tempPrice}
                                  onChange={(e) => setTempPrice(e.target.value)}
                                  required
                                />
                                <span className="text-[10.5px] text-stone-400 block font-normal text-stone-500">Standard estimate for B2B corporate buyers.</span>
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider font-mono">CS Representative Price *</label>
                                <input
                                  type="text"
                                  className="w-full text-xs p-2 bg-white border border-stone-250 rounded-lg font-mono outline-none focus:border-emerald-700"
                                  value={tempCsPrice}
                                  onChange={(e) => setTempCsPrice(e.target.value)}
                                  required
                                />
                                <span className="text-[10.5px] text-stone-400 block font-normal text-stone-500 font-normal">Differentiated price shown exclusively to CS logins.</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider font-mono">Product Sourcing Description</label>
                                <textarea
                                  rows={2}
                                  className="w-full text-xs p-2 bg-white border border-stone-250 rounded-lg outline-none focus:border-emerald-700 font-sans"
                                  value={tempDescription}
                                  onChange={(e) => setTempDescription(e.target.value)}
                                />
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="block text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">Product Image (File or URL)</label>
                                <div className="space-y-1">
                                  <label className="text-[9.5px] text-[#92400E] font-mono cursor-pointer bg-amber-50 rounded px-2 py-0.5 border border-amber-200 font-bold hover:bg-amber-100 max-w-max select-none inline-block">
                                    <span>Upload Local File</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            if (typeof reader.result === 'string') {
                                              setTempImage(reader.result);
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Or paste image URL link..."
                                    className="w-full text-[11px] p-1.5 bg-white border border-stone-250 rounded-lg font-mono outline-none focus:border-emerald-700"
                                    value={tempImage}
                                    onChange={(e) => setTempImage(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t font-mono text-[10px]">
                              <button
                                type="button"
                                onClick={() => saveProductMods(prod.id)}
                                className="bg-emerald-850 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg font-bold shadow cursor-pointer transition-colors"
                              >
                                Save Changes
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingProductId(null)}
                                className="bg-stone-300 hover:bg-stone-400 text-stone-850 px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={prod.id} className="hover:bg-white transition-colors">
                        <td className="px-5 py-4 font-bold text-stone-900 font-sans border-r border-[#FAF9F5]">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-stone-205 shadow-inner shrink-0 relative group">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover animate-fade-in" />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="truncate max-w-[200px]" title={prod.name}>{prod.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-emerald-800 font-semibold border-r border-[#FAF9F5]">
                          {prod.categoryLabel}
                        </td>
                        <td className="px-5 py-4 font-mono border-r border-[#FAF9F5]">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold leading-none ${
                            prod.stockTons < 8.0
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-950 border border-emerald-100'
                          }`}>
                            {prod.stockTons.toFixed(1)} MT
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-stone-955 font-bold border-r border-[#FAF9F5]">
                          <span>{prod.pricePerKgRange}</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              type="button"
                              onClick={() => triggerEditProduct(prod)}
                              className="text-amber-850 hover:text-amber-955 font-mono text-xs font-bold hover:underline cursor-pointer"
                            >
                              Modify
                            </button>
                            <span className="text-stone-300">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete "${prod.name}"? This will vanish details immediately.`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="text-red-700 hover:text-red-900 font-mono text-xs font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Sub Tab Panel 3: Cargo Estimator */}
      {activeAdminSubTab === 'estimator' && (
        <div className="space-y-4 animate-fade-in" id="weight-pricing-panel">
          <div>
            <h3 className="text-lg font-bold text-stone-900 font-sans tracking-tight">
              Wholesale B2B Cargo Tariff Sizing Model
            </h3>
            <p className="text-xs text-stone-500">Calculate CIF/FOB (Cost, Insurance & Freight) approximation metrics based on container load sizes and real world logistics tariffs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs">
            
            {/* Input params */}
            <div className="space-y-3.5">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-stone-400 font-black block">
                Logistics Parameter Modeler
              </span>

              {/* Product */}
              <div className="space-y-1">
                <label className="block text-xs text-stone-605">Model Ingredient:</label>
                <select
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                  value={calcProduct}
                  onChange={(e) => setCalcProduct(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.pricePerKgRange})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="block text-xs text-stone-605">Quantity (Kilograms):</label>
                <input
                  type="number"
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono text-sm"
                  value={calcQuantityKg}
                  onChange={(e) => setCalcQuantityKg(Math.max(100, Number(e.target.value)))}
                />
              </div>

              {/* Destination Port Zone */}
              <div className="space-y-1">
                <label className="block text-xs text-stone-605">Target Destination Zone:</label>
                <select
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl"
                  value={calcDestination}
                  onChange={(e) => {
                    const countryId = e.target.value;
                    setCalcDestination(countryId);
                    if (countryId === 'USA') setCalcFreightRateMT(10000);
                    else if (countryId === 'EU') setCalcFreightRateMT(12000);
                    else if (countryId === 'Japan') setCalcFreightRateMT(7000);
                    else if (countryId === 'Germany') setCalcFreightRateMT(11000);
                    else setCalcFreightRateMT(5000);
                  }}
                >
                  <option value="USA">Port of Houston / LA (United States) - ₹10,000/MT Freight</option>
                  <option value="EU">Felixtowe (United Kingdom) - ₹12,000/MT Freight</option>
                  <option value="Japan">Port of Yokohama (Japan) - ₹7,000/MT Freight</option>
                  <option value="Germany">Port of Hamburg (Germany) - ₹11,000/MT Freight</option>
                  <option value="MiddleEast">Jebel Ali (Middle East) - ₹5,000/MT Freight</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-amber-900 text-[11px] leading-relaxed flex items-start gap-1.5 font-sans">
                <Globe className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>Default transport assumes standardized cargo/truck container capacity structures. Processing fees calculated under standard wholesale guidelines.</span>
              </div>
            </div>

            {/* Calculations Outputs */}
            <div className="bg-white p-5 rounded-2xl border border-stone-150 space-y-4">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-emerald-800 font-bold block">
                Simulated B2B Bill of Lading (CIF Estimates)
              </span>

              <div className="space-y-2.5 font-mono">
                <div className="flex justify-between border-b pb-1.5 text-stone-500">
                  <span>Product FOB Value:</span>
                  <span className="font-bold text-stone-900">₹{quoteCalculated.baseCost.toLocaleString(undefined, { maximumFractionDigits: 1 })} INR</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 text-stone-500">
                  <span>Calculated Ocean Freight:</span>
                  <span className="font-bold text-stone-900">₹{quoteCalculated.freightCost.toLocaleString(undefined, { maximumFractionDigits: 1 })} INR</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 text-stone-500">
                  <span>Customs / Port Fees (Est. 4.5%):</span>
                  <span className="font-bold text-stone-900">₹{quoteCalculated.customsApproximation.toLocaleString(undefined, { maximumFractionDigits: 1 })} INR</span>
                </div>
                
                <div className="pt-2 flex justify-between text-base border-t border-stone-300 font-sans">
                  <span className="font-extrabold text-stone-900">CIF Grand Total approximation:</span>
                  <span className="font-black text-emerald-900 font-mono">₹{quoteCalculated.grandCIF.toLocaleString(undefined, { maximumFractionDigits: 1 })} INR</span>
                </div>
              </div>

              {/* Per Kilogram unit cost */}
              <div className="bg-emerald-50 text-emerald-950 p-4 rounded-xl border border-emerald-110 flex flex-col items-center justify-center text-center font-mono">
                <span className="text-emerald-700 text-[10px] uppercase font-bold">Estimated Cost Per Kilogram landed</span>
                <span className="text-xl font-black mt-1">
                  ₹{ (quoteCalculated.grandCIF / calcQuantityKg).toFixed(2) } INR
                </span>
                <span className="text-[9px] text-emerald-600 mt-1">Includes marine cargo ocean shipping and customs limits</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Client CS Accounts Directory Tab */}
      {activeAdminSubTab === 'clients' && (
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 md:p-8 space-y-6 animate-fade-in" id="admin-clients-info-subtab">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-sans tracking-tight text-stone-900">Corporate Clients & CS Records</h3>
            <p className="text-xs text-stone-500 font-medium">Verified corporate buyers, customer service representatives, and partner accounts with authorized B2B portal access.</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-150 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-150 text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                    <th className="px-6 py-4">B2B Company & Location</th>
                    <th className="px-6 py-4">Representative</th>
                    <th className="px-6 py-4">Direct Mail</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">B2B Portal Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-xs">
                  {customers && customers.length > 0 ? (
                    customers.map((client: any, idx: number) => (
                      <tr key={client.id || idx} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-stone-900">{client.companyName || 'N/A'}</div>
                          <div className="text-[10px] text-stone-400 font-medium mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {client.country || 'India'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-stone-800">{client.fullName || 'N/A'}</div>
                          <span className="inline-flex mt-1 items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-150">
                            Partner Account
                          </span>
                        </td>
                        <td className="px-6 py-5 font-mono text-stone-600">
                          {client.email || 'N/A'}
                        </td>
                        <td className="px-6 py-5 font-mono text-stone-600">
                          {client.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-stone-50 border border-stone-200 px-2.5 py-1 rounded text-stone-700 font-bold tracking-wide">
                              {client.password || 'N/A'}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(client.password || '');
                              }}
                              className="text-[10px] text-amber-700 hover:text-amber-900 font-mono font-bold hover:underline cursor-pointer"
                              title="Copy password to clipboard"
                            >
                              Copy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-400 font-mono">
                        No registered B2B client accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Admin Passcode Security Alteration Tab */}
      {activeAdminSubTab === 'authentication' && (
        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 md:p-8 space-y-6 animate-fade-in" id="admin-password-configure-subtab">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-sans tracking-tight text-stone-900">Admin Panel Security Settings</h3>
            <p className="text-xs text-stone-500 font-medium">Update the Executive staff passcode used to authenticate administrator credentials entering this control suite.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.currentTarget;
              const currentPass = (target.elements.namedItem('currentPass') as HTMLInputElement).value;
              const newPass = (target.elements.namedItem('newPass') as HTMLInputElement).value;
              const confirmPass = (target.elements.namedItem('confirmPass') as HTMLInputElement).value;

              if (currentPass !== adminPassword) {
                alert('Verification Failure: Current administrator passcode is incorrect.');
                return;
              }
              if (newPass !== confirmPass) {
                alert('Mismatched Inputs: Confirm passcode does not match the new entry.');
                return;
              }
              if (!newPass.trim()) {
                alert('Validation Failure: Passcode cannot be blank.');
                return;
              }

              if (onUpdateAdminPassword) {
                onUpdateAdminPassword(newPass);
                alert('Success: Dynamic administrative passcode has been updated on client session.');
                target.reset();
              }
            }}
            className="bg-white p-6 rounded-2xl border border-stone-150 max-w-md space-y-4 shadow-sm"
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">Current Staff Passcode</label>
              <input
                name="currentPass"
                type="password"
                required
                placeholder="Enter current password..."
                className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">New Passcode</label>
              <input
                name="newPass"
                type="password"
                required
                placeholder="Enter new passcode..."
                className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-stone-500 uppercase tracking-widest">Confirm New Passcode</label>
              <input
                name="confirmPass"
                type="password"
                required
                placeholder="Confirm new passcode..."
                className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-black text-[#FAF9F5] py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Update Security Passcode
            </button>
          </form>
        </div>
      )}

      {/* Dynamic Partner Engagement & Contests management under activeAdminSubTab === 'engagement' */}
      {activeAdminSubTab === 'engagement' && (
        <div className="space-y-6 animate-fade-in text-left" id="admin-engagement-panel">
          
          {/* Section 1: Cooking Contest Entries */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <div className="space-y-1 text-left">
              <h3 className="text-base font-bold font-sans text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Trophy className="w-5 h-5 text-amber-700" /> Community Cooking Battle Manager
              </h3>
              <p className="text-xs text-stone-500">Approve user-submitted food photos, monitor active B2B vote totals, and assign weekly winner medals instantly.</p>
            </div>

            <div className="overflow-x-auto border rounded-xl bg-white text-xs text-left">
              <table className="w-full font-sans">
                <thead>
                  <tr className="bg-stone-50 border-b font-mono font-bold text-[9.5px] uppercase text-stone-600">
                    <th className="p-3 text-left">Dish Info</th>
                    <th className="p-3 text-left">Cook / Company</th>
                    <th className="p-3 text-left">Votes Count</th>
                    <th className="p-3 text-left">Standing Status</th>
                    <th className="p-3 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-stone-700">
                  {contestEntries.length > 0 ? (
                    contestEntries.map((entry: any) => {
                      const isWinner = entry.status === 'winner';
                      let statusBadge = <span className="bg-amber-100 text-amber-850 px-2 py-0.5 rounded border border-amber-200">Pending Approval</span>;
                      if (entry.status === 'approved') statusBadge = <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">Approved Arena</span>;
                      if (entry.status === 'rejected') statusBadge = <span className="bg-red-50 text-red-800 px-2 py-0.5 rounded border border-red-150">Hidden</span>;
                      if (isWinner) statusBadge = <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-black font-mono">🏆 {entry.weeklyWinnerRank || 'CHAMPION'}</span>;

                      return (
                        <tr key={entry.id} className="hover:bg-stone-50/50">
                          <td className="p-3 flex items-center gap-2.5">
                            <img src={entry.image} alt={entry.dishName} className="w-10 h-10 object-cover rounded-md border text-[8px]" />
                            <div>
                              <strong className="block text-stone-900 text-xs">{entry.dishName}</strong>
                              <span className="text-[9.5px] text-stone-400 font-mono block">{entry.id}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="block font-bold text-stone-900">{entry.customerName}</span>
                            <span className="text-[10px] text-zinc-400 block font-mono">{entry.customerEmail}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-amber-900">{entry.votesCount} Votes</td>
                          <td className="p-3 font-mono text-[10.5px]">{statusBadge}</td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5 items-center flex-wrap">
                              <button
                                onClick={() => {
                                  const updated = contestEntries.map(e => e.id === entry.id ? { ...e, status: 'approved' } : e);
                                  onUpdateContestEntries?.(updated);
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[10px] rounded border cursor-pointer font-bold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  const updated = contestEntries.map(e => e.id === entry.id ? { ...e, status: 'rejected' } : e);
                                  onUpdateContestEntries?.(updated);
                                }}
                                className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-stone-700 font-mono text-[10px] rounded border cursor-pointer"
                              >
                                Hide
                              </button>
                              
                              <select
                                className="bg-amber-50 text-amber-900 font-mono text-[9.5px] p-1 border border-amber-300 rounded cursor-pointer outline-none"
                                value={entry.status === 'winner' ? entry.weeklyWinnerRank : ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (!val) {
                                    const updated = contestEntries.map(ent => ent.id === entry.id ? { ...ent, status: 'approved', weeklyWinnerRank: '' } : ent);
                                    onUpdateContestEntries?.(updated);
                                  } else {
                                    const updated = contestEntries.map(ent => ent.id === entry.id ? { ...ent, status: 'winner', weeklyWinnerRank: val } : ent);
                                    onUpdateContestEntries?.(updated);
                                    // Reward winner customer with massive 500 XP bonus instantly
                                    const updatedCusts = customers.map(c => c.email === entry.customerEmail ? { ...c, points: (c.points || 0) + 500 } : c);
                                    onUpdateCustomers?.(updatedCusts);
                                    alert(`Assigned Winner status! Awarded +500 XP Bonus points to contestant.`);
                                  }
                                }}
                              >
                                <option value="">-- Set Medal Winner --</option>
                                <option value="🥇 Weekly Gold Medal (1st)">🥇 1st Gold Medal</option>
                                <option value="🥈 Weekly Silver Medal (2nd)">🥈 2nd Silver Medal</option>
                                <option value="🥉 Weekly Bronze Medal (3rd)">🥉 3rd Bronze Medal</option>
                              </select>

                              <button
                                onClick={() => {
                                  if (confirm("Delete this contest entry permanently?")) {
                                    const updated = contestEntries.filter(e => e.id !== entry.id);
                                    onUpdateContestEntries?.(updated);
                                  }
                                }}
                                className="p-1 text-red-650 hover:bg-red-50 rounded border shrink-0 cursor-pointer border-red-200"
                                title="Delete Contest Submission"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-stone-400 font-mono italic">No contest entries loaded globally. Check the storefront Community tab to submit one.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Manage Client Loyalty Levels & XP Points directly */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <div className="space-y-1 text-left">
              <h3 className="text-base font-bold font-sans text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="w-5 h-5 text-amber-700" /> Client Loyalty Tier Panel
              </h3>
              <p className="text-xs text-stone-500">Explicitly modify points, adjust check-in visit tallies, and elevate Bronze buyers straight to Platinum VIP status instantly.</p>
            </div>

            <div className="overflow-x-auto border rounded-xl bg-white text-xs text-left">
              <table className="w-full font-sans">
                <thead>
                  <tr className="bg-stone-50 border-b font-mono font-bold text-[9.5px] uppercase text-stone-600">
                    <th className="p-3 text-left">Buyer Company Account</th>
                    <th className="p-3 text-left">Points Balance</th>
                    <th className="p-3 text-left">Assigned Tier</th>
                    <th className="p-3 text-right">Points modifier tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-medium text-stone-700">
                  {customers.length > 0 ? (
                    customers.map((cust: any) => {
                      return (
                        <tr key={cust.id} className="hover:bg-stone-50/50">
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold font-display uppercase">{cust.companyName ? cust.companyName[0] : 'C'}</div>
                            <div>
                              <strong className="block text-stone-900 text-sm">{cust.companyName}</strong>
                              <span className="text-[10.5px] text-stone-400 block font-mono">{cust.fullName} • {cust.email}</span>
                            </div>
                          </td>
                          <td className="p-3 text-left">
                            <span className="font-mono text-base font-black text-emerald-990 text-emerald-800">{cust.points || 0} XP</span>
                          </td>
                          <td className="p-3">
                            <select
                              className="bg-stone-100 font-mono text-[10.5px] font-bold text-stone-800 p-1.5 border border-stone-250 rounded cursor-pointer outline-none"
                              value={cust.loyaltyLevel || 'Bronze'}
                              onChange={(e) => {
                                const level = e.target.value;
                                const updated = customers.map(c => c.id === cust.id ? { ...c, loyaltyLevel: level } : c);
                                onUpdateCustomers?.(updated);
                                alert(`Loyalty level updated for ${cust.companyName} to ${level}!`);
                              }}
                            >
                              <option value="Bronze">🥉 Bronze Partner</option>
                              <option value="Silver">🥈 Silver Partner</option>
                              <option value="Gold">🥇 Gold Partner</option>
                              <option value="Platinum">👑 Platinum Elite</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  const updated = customers.map(c => c.id === cust.id ? { ...c, points: (c.points || 0) + 100 } : c);
                                  onUpdateCustomers?.(updated);
                                }}
                                className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono rounded cursor-pointer font-bold text-[10.5px]"
                              >
                                +100 XP
                              </button>
                              <button
                                onClick={() => {
                                  const updated = customers.map(c => c.id === cust.id ? { ...c, points: (c.points || 0) + 500 } : c);
                                  onUpdateCustomers?.(updated);
                                }}
                                className="px-2 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-[#FCFCFA] font-mono rounded cursor-pointer font-black text-[10.5px]"
                              >
                                +500 XP
                              </button>
                              <button
                                onClick={() => {
                                  const updated = customers.map(c => c.id === cust.id ? { ...c, points: 0, loyaltyLevel: 'Bronze' } : c);
                                  onUpdateCustomers?.(updated);
                                }}
                                className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-mono rounded cursor-pointer text-[10.5px] border border-red-200"
                              >
                                Reset XP
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-stone-400 italic">No registered corporate buyer profiles to modify.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Banners Carousel management under activeAdminSubTab === 'banners' */}
      {activeAdminSubTab === 'banners' && (
        <div className="space-y-6 animate-fade-in text-left font-sans" id="admin-banners-management">
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <ImageIcon className="w-5 h-5 text-amber-700" /> Executive Billboard Banners ({banners.length}/5)
                </h3>
                <p className="text-xs text-stone-500">
                  Manage the promotional banners carousel rendering at the top of the homepage. You can upload up to 5 concurrent active banners.
                </p>
              </div>

              {banners.length >= 5 ? (
                <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-bold font-mono">
                  ⚠️ Max capacity of 5 active banners reached.
                </div>
              ) : (
                <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-bold font-mono">
                  ✓ Ready for Upload ({5 - banners.length} slots open)
                </div>
              )}
            </div>

            {/* Upload New Banner Form */}
            {banners.length < 5 && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const title = formData.get('title') as string;
                  const subtitle = formData.get('subtitle') as string;
                  const imageUrl = formData.get('imageUrl') as string;
                  const linkTab = formData.get('linkTab') as string;

                  if (!title || !imageUrl) {
                    alert('Title and Image URL are required particulars.');
                    return;
                  }

                  const newBanner: Banner = {
                    id: `banner-${Date.now()}`,
                    title,
                    subtitle: subtitle || '',
                    imageUrl,
                    linkTab: linkTab || undefined
                  };

                  const updated = [...banners, newBanner];
                  onUpdateBanners?.(updated);
                  form.reset();
                  alert('Banner uploaded successfully!');
                }}
                className="bg-white border border-stone-200 rounded-xl p-4.5 space-y-4.5"
              >
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-850 font-mono">Upload New Billboard Banner</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase font-mono font-bold text-stone-500">Banner Title *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. Premium-Grade Dehydrated Garlic Flakes"
                      className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase font-mono font-bold text-stone-500">Image URL *</label>
                    <input
                      name="imageUrl"
                      type="url"
                      required
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase font-mono font-bold text-stone-500">Short Subtitle / Subtext</label>
                    <input
                      name="subtitle"
                      type="text"
                      placeholder="e.g. Engineered with extreme pungency and premium purity standards."
                      className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase font-mono font-bold text-stone-500">Navigation Destination Tab</label>
                    <select
                      name="linkTab"
                      className="w-full p-2.5 bg-stone-50 focus:bg-white border border-stone-200 focus:border-amber-700 outline-none rounded-xl text-xs"
                    >
                      <option value="">No redirection click action</option>
                      <option value="catalogue">Industrial Product Catalogue</option>
                      <option value="community">Culinary Cook-Off & Recipes</option>
                      <option value="rewards">Loyalty partner Rewards & XP Wheel</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-[10.5px] text-stone-400 italic">
                    Tip: Use high-quality landscape photos from Unsplash for maximum visual polish.
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-[#FAF9F5] rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer"
                  >
                    Publish Custom Banner
                  </button>
                </div>
              </form>
            )}

            {/* List of current Active Banners */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-850 font-mono">Active Billboard Carousel List ({banners.length})</h4>
              
              {banners.length === 0 ? (
                <div className="p-10 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-white">
                  <ImageIcon className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-500 font-medium">No active banners in rotation. Homepage space layout will stay empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map((banner) => (
                    <div 
                      key={banner.id} 
                      className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {/* Preview Crop */}
                        <div className="h-32 bg-cover bg-center border-b border-stone-100" style={{ backgroundImage: `url(${banner.imageUrl})` }} />
                        
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="font-bold text-stone-900 text-xs leading-snug line-clamp-1">{banner.title}</h5>
                            {banner.linkTab && (
                              <span className="bg-amber-50 text-amber-800 border border-amber-200/50 text-[8.5px] font-mono font-bold uppercase px-1.5 py-0.5 rounded">
                                Links: {banner.linkTab}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-650 line-clamp-2 md:line-clamp-3 leading-relaxed">{banner.subtitle}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex justify-between items-center text-xs">
                        <span className="text-[9.5px] font-mono text-stone-400 font-medium truncate max-w-[200px]">
                          ID: {banner.id}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete banner: "${banner.title}"?`)) {
                              const updated = banners.filter(b => b.id !== banner.id);
                              onUpdateBanners?.(updated);
                              alert('Banner deleted.');
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-[10.5px] font-bold rounded-xl cursor-pointer transition-colors"
                        >
                          Delete Banner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Settings & Coupons management under activeAdminSubTab === 'settings' */}
      {activeAdminSubTab === 'settings' && (
        <div className="space-y-6 animate-fade-in text-left font-sans" id="admin-settings-management">
          
          {/* Top Panel: Numeric Configurations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Trusted Customers & FSSAI License */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider font-sans">
                <Settings className="w-5 h-5 text-amber-700" /> Trust Badge & Food Licensing
              </h3>
              <p className="text-xs text-stone-500">
                Adjust corporate credential trademark metadata displayed. Trusted count rolls up from 0 to target on homepage refresh.
              </p>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-stone-600 uppercase">Trusted Clients Counter Target</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl font-mono focus:border-amber-700 outline-none"
                      value={trustedCount}
                      onChange={(e) => onUpdateTrustedCount(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-2 rounded-xl flex items-center justify-center shrink-0">
                      Target: {trustedCount}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-stone-600 uppercase">FSSAI India Lic. No.</label>
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="e.g. 12724999000234"
                    className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl font-mono focus:border-amber-700 outline-none"
                    value={fssaiLicNo}
                    onChange={(e) => onUpdateFssaiLicNo(e.target.value)}
                  />
                  <span className="text-[10px] text-stone-400 block font-mono">
                    Must be a 14-digit legal safety licensing flag. Renders with official logotype in page bottom layout footer.
                  </span>
                </div>
              </div>
            </div>

            {/* Coupons & Promo Engine */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider font-sans">
                <Percent className="w-5 h-5 text-amber-700" /> Create Corporate Coupon Code
              </h3>
              <p className="text-xs text-stone-500">
                Add discount codes validating instantly at checkout in user's shopping carts.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCouponCode) {
                    alert('Please supply a code.');
                    return;
                  }
                  const codeUpper = newCouponCode.toUpperCase().replace(/\s+/g, '');
                  if (coupons.some(c => c.code === codeUpper)) {
                    alert('This coupon code is already active.');
                    return;
                  }

                  const newCoupon: Coupon = {
                    id: `cop-${Date.now()}`,
                    code: codeUpper,
                    type: newCouponType,
                    value: Math.max(1, Number(newCouponValue)),
                    expirationDate: newCouponExp || '2026-12-31'
                  };

                  onUpdateCoupons([newCoupon, ...coupons]);
                  setNewCouponCode('');
                  alert(`Coupon code "${codeUpper}" is now active!`);
                }}
                className="space-y-3.5 pt-1.5"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-mono font-bold text-stone-500">PROMO CODE *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MONSOON30"
                      className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-700 font-mono"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-mono font-bold text-stone-500 font-sans">EXPIRATION *</label>
                    <input
                      type="date"
                      required
                      className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-700 font-mono"
                      value={newCouponExp}
                      onChange={(e) => setNewCouponExp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-mono font-bold text-stone-500 font-sans">DISCOUNT TYPE *</label>
                    <select
                      className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-700 font-sans"
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                    >
                      <option value="percent">Percentage Off (%)</option>
                      <option value="fixed">Rupees Off (Fixed INR)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-mono font-bold text-stone-500">VALUE *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg outline-none focus:border-amber-700 font-mono"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Math.max(1, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-mono text-[11px] py-2 font-bold rounded-lg uppercase transition-all shadow cursor-pointer"
                >
                  Create & Activate Promo Code
                </button>
              </form>
            </div>

          </div>

          {/* Active Coupons List Table */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-850 font-mono">Active Promotional Coupons ({coupons.length})</h4>
            <div className="overflow-x-auto border rounded-xl bg-white">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead className="bg-[#FCFBF7] text-stone-500 font-mono text-[10px] uppercase border-b">
                  <tr>
                    <th className="px-4 py-2.5">Promo Code</th>
                    <th className="px-4 py-2.5">Discount Calculation</th>
                    <th className="px-4 py-2.5">Expiration Date</th>
                    <th className="px-4 py-2.5 text-right">Delete Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-stone-400 font-mono italic text-xs">
                        No custom active coupon codes configured. Users will only be able to apply spin codes.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((cop) => (
                      <tr key={cop.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 font-mono font-bold text-amber-800 text-[13px]">
                          {cop.code}
                        </td>
                        <td className="px-4 py-3 font-medium text-stone-800">
                          {cop.type === 'percent' ? `${cop.value}% Discount` : `₹${cop.value} Off Discount`}
                        </td>
                        <td className="px-4 py-3 font-mono text-stone-600 text-xs">
                          {cop.expirationDate}
                        </td>
                        <td className="px-4 py-3 text-right text-stone-400">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete promo code: ${cop.code}?`)) {
                                onUpdateCoupons(coupons.filter(c => c.id !== cop.id));
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-750 hover:bg-red-100 text-red-700 px-3 py-1.5 border border-red-200 rounded-xl cursor-pointer text-xs font-semibold"
                          >
                            Delete Code
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fortune Wheel Customizer Panel */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider font-sans">
                  <Gift className="w-5 h-5 text-amber-700" /> Fortune Wheel Mechanics Editor
                </h3>
                <p className="text-xs text-stone-500">
                  Configure what price (minimum cart total) triggers the spin wheel, and fine-tune sectors, values, and probabilities.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to reset the Fortune Wheel to standard default sectors?')) {
                    onUpdateWheelSettings({
                      spinMinCartValue: 499,
                      spinCostPoints: 0,
                      sectors: [
                        { label: '50 XP Points', value: 'points:50', color: '#115E59', probability: 15 },
                        { label: '10% B2B Coupon', value: 'coupon:DRYZA10', color: '#D97706', probability: 15 },
                        { label: '100 XP Points', value: 'points:100', color: '#0F766E', probability: 15 },
                        { label: 'Free B2B Sample', value: 'offer:Freesample', color: '#B45309', probability: 10 },
                        { label: '250 XP Points', value: 'points:250', color: '#0D9488', probability: 15 },
                        { label: '15% Volume Discount', value: 'coupon:PLATINUM15', color: '#92400E', probability: 10 },
                        { label: '500 XP Points', value: 'points:500', color: '#047857', probability: 10 },
                        { label: 'Surprise Gift Pack', value: 'offer:Surprisepack', color: '#78350F', probability: 10 }
                      ]
                    });
                  }
                }}
                className="bg-stone-200 hover:bg-stone-300 text-stone-800 font-mono text-[10px] font-bold px-3 py-2 border rounded-xl select-none shrink-0 cursor-pointer"
              >
                Reset Default Sectors
              </button>
            </div>

            {/* Threshold and points configurations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1.5">
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-stone-600 uppercase">Min Cart Value Required for Wheel (₹ INR)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl font-mono focus:border-amber-700 outline-none"
                  value={wheelSettings.spinMinCartValue}
                  onChange={(e) => {
                    onUpdateWheelSettings({
                      ...wheelSettings,
                      spinMinCartValue: Math.max(0, parseInt(e.target.value) || 0)
                    });
                  }}
                />
                <span className="text-[10px] text-stone-400 block font-mono">
                  The Fortune Wheel pops up when user cart total is greater than or equal to this price threshhold.
                </span>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold text-stone-600 uppercase">Cost of Spin (LP Points / Spin)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl font-mono focus:border-amber-700 outline-none"
                  value={wheelSettings.spinCostPoints}
                  onChange={(e) => {
                    onUpdateWheelSettings({
                      ...wheelSettings,
                      spinCostPoints: Math.max(0, parseInt(e.target.value) || 0)
                    });
                  }}
                />
                <span className="text-[10px] text-stone-400 block font-mono">
                  Points deducted from customer points ledger upon spinning. Use 0 for free spins.
                </span>
              </div>
            </div>

            {/* Editable list of sectors */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-850 font-mono">Customize Wheel Sectors (Exactly 8 Slots required)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(wheelSettings.sectors || []).map((sec, idx) => {
                  return (
                    <div key={idx} className="bg-white p-4.5 rounded-xl border border-stone-200 space-y-2.5 shadow-xs text-xs text-stone-850">
                      <div className="flex justify-between items-center border-b pb-1">
                        <span className="font-bold text-stone-800">Sector Slot {idx + 1}</span>
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: sec.color }} />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-400 block">Sector Label Text *</label>
                        <input
                          type="text"
                          required
                          className="w-full text-xs px-2 py-1 border border-stone-200 rounded bg-stone-50"
                          value={sec.label}
                          onChange={(e) => {
                            const updatedSectors = [...wheelSettings.sectors];
                            updatedSectors[idx] = { ...updatedSectors[idx], label: e.target.value };
                            onUpdateWheelSettings({ ...wheelSettings, sectors: updatedSectors });
                          }}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-stone-400 block">Reward (type:value e.g. points:150 or coupon:DRY15) *</label>
                        <input
                          type="text"
                          required
                          className="w-full text-xs px-2 py-1 border border-stone-200 rounded font-mono bg-stone-50"
                          value={sec.value}
                          onChange={(e) => {
                            const updatedSectors = [...wheelSettings.sectors];
                            updatedSectors[idx] = { ...updatedSectors[idx], value: e.target.value };
                            onUpdateWheelSettings({ ...wheelSettings, sectors: updatedSectors });
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-stone-400 block">Weight (%) *</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            className="w-full text-xs px-2 py-1 border border-stone-200 rounded font-mono bg-stone-50"
                            value={sec.probability}
                            onChange={(e) => {
                              const updatedSectors = [...wheelSettings.sectors];
                              updatedSectors[idx] = { ...updatedSectors[idx], probability: Math.min(100, Math.max(1, parseInt(e.target.value) || 0)) };
                              onUpdateWheelSettings({ ...wheelSettings, sectors: updatedSectors });
                            }}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-stone-400 block">Color code *</label>
                          <input
                            type="text"
                            required
                            className="w-full text-xs px-2 py-1 border border-stone-200 rounded font-mono bg-stone-50 font-semibold"
                            value={sec.color}
                            onChange={(e) => {
                              const updatedSectors = [...wheelSettings.sectors];
                              updatedSectors[idx] = { ...updatedSectors[idx], color: e.target.value };
                              onUpdateWheelSettings({ ...wheelSettings, sectors: updatedSectors });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total probability count sum */}
              <div className="text-right text-xs font-mono font-medium text-stone-500">
                Sum of Probabilities: <span className={`font-bold ${wheelSettings.sectors.reduce((acc, curr) => acc + curr.probability, 0) === 100 ? 'text-emerald-800' : 'text-amber-700'}`}>
                  {wheelSettings.sectors.reduce((acc, curr) => acc + curr.probability, 0)}%
                </span>
                {wheelSettings.sectors.reduce((acc, curr) => acc + curr.probability, 0) !== 100 && (
                  <span className="block text-[10px] text-amber-700 font-sans mt-0.5">⚠️ Weight totals must sum to 100% for proper Fortune Wheel logic.</span>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
