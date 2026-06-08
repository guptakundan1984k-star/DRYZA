import React, { useState, useEffect, useMemo } from 'react';
import { db } from './lib/firebase';
import { collection, doc, onSnapshot, setDoc, writeBatch, deleteDoc, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pages from './components/Pages';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import InquiryForm from './components/InquiryForm';
import CustomerAuthModal from './components/CustomerAuthModal';
import AdminPanel from './components/AdminPanel';
import RewardsPanel from './components/RewardsPanel';
import MyOrdersPage from './components/MyOrdersPage';
import CommunityPanel from './components/CommunityPanel';
import BlogSection from './components/BlogSection';
import HomepageBanners from './components/HomepageBanners';
import Footer from './components/Footer';
import ProductPouch from './components/ProductPouch';
import { CATEGORIES, PRODUCTS, SEED_INQUIRIES, SEED_CONTEST_ENTRIES, SEED_BANNERS, QUIZ_QUESTIONS } from './data';
import { Product, Inquiry, Banner, Coupon, WheelSettings, QuizQuestion } from './types';
import { Search, ChevronRight, ShieldCheck, Award, Info, AlertTriangle, X, Brain, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchWord, setSearchWord] = useState<string>('');
  const [localSearchTerm, setLocalSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentTab]);

  // AI Semantic Custom Search States
  const [isAiSearch, setIsAiSearch] = useState<boolean>(true);
  const [isAiSearchActive, setIsAiSearchActive] = useState<boolean>(false);
  const [aiSearchMatches, setAiSearchMatches] = useState<{ productId: string; relevanceScore: number; matchExplanation: string }[]>([]);
  const [aiSearchLoading, setAiSearchLoading] = useState<boolean>(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);

  // Cart Quantities state
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('dryza_cart_quantities');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('dryza_cart_quantities', JSON.stringify(cartQuantities));
  }, [cartQuantities]);

  // Flying animations particle tracker
  const [flyingItems, setFlyingItems] = useState<{ id: string; startX: number; startY: number; image: string; sprinkles?: { id: string; startX: number; startY: number; color: string; size: number; delay: number }[] }[]>([]);

  // Sourcing Client Accounts State
  const [customers, setCustomers] = useState<any[]>(() => {
    const saved = localStorage.getItem('dryza_customers');
    let parsed = saved ? JSON.parse(saved) : [];
    
    // Force insert 'anshgupta' if missing so they don't have to clear localStorage
    if (!parsed.some((c: any) => c.phone === '6205284423')) {
      parsed.push({
        id: 'cs-anshgupta',
        fullName: 'Ansh Gupta',
        email: 'anshgupta4525@gmail.com',
        phone: '6205284423',
        companyName: 'Ansh Enterprises',
        country: 'India',
        password: 'OTP_AUTH',
        role: 'corporate',
        joinedAt: new Date().toISOString()
      });
    }

    if (!saved || parsed.length === 1) {
      parsed.push(
        {
          id: 'cs-sanjay',
          fullName: 'Sanjay Nair',
          email: 'snair@vikasfoods.co.in',
          phone: '+91 98230 45432',
          companyName: 'Vikas Foods Co.',
          country: 'India',
          password: 'sanjay'
        },
        {
          id: 'cs-kenji',
          fullName: 'Kenji Suzuki',
          email: 'suzuki@noodleworld.co.jp',
          phone: '+81 3 5555 0142',
          companyName: 'NoodleWorld Co.',
          country: 'Japan',
          password: 'kenji'
        }
      );
    }
    return parsed;
  });

  const [loggedInCustomer, setLoggedInCustomer] = useState<any | null>(() => {
    const saved = localStorage.getItem('dryza_logged_in_customer');
    return saved ? JSON.parse(saved) : null;
  });

  const [isClientAuthOpen, setIsClientAuthOpen] = useState(false);

  // Dynamic admin password
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('dryza_admin_password') || 'DRYZAjamshedpur';
  });

  // Synchronize customer/admin configs
  useEffect(() => {
    localStorage.setItem('dryza_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (loggedInCustomer) {
      localStorage.setItem('dryza_logged_in_customer', JSON.stringify(loggedInCustomer));
    } else {
      localStorage.removeItem('dryza_logged_in_customer');
    }
  }, [loggedInCustomer]);

  useEffect(() => {
    localStorage.setItem('dryza_admin_password', adminPassword);
  }, [adminPassword]);

  // Sourcing & Quote queue State
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dryza_selected_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal inspection triggers
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Admin Mode state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem('dryza_is_admin');
    return saved ? JSON.parse(saved) === true : false;
  });

  // Dynamic corporate brand logo url state
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('dryza_logo_url') || '';
  });

  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('dryza_logo_url', logoUrl);
    } else {
      localStorage.removeItem('dryza_logo_url');
    }
  }, [logoUrl]);


  // Password Verification States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Intercept Admin access changes with credential prompt
  const handleSetIsAdmin = (value: boolean) => {
    if (value === true) {
      setIsPasswordModalOpen(true);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setIsAdmin(false);
    }
  };

  const triggerAdminWithPassword = () => {
    setIsPasswordModalOpen(true);
    setPasswordInput('');
    setPasswordError('');
  };

  // Active inquiries state - Fallback to [] so the dashboard starts with no orders
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('dryza_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // Active Weekly Cooking Contest entries state
  const [contestEntries, setContestEntries] = useState<any[]>(() => {
    const saved = localStorage.getItem('dryza_contest_entries');
    return saved ? JSON.parse(saved) : SEED_CONTEST_ENTRIES;
  });

  useEffect(() => {
    localStorage.setItem('dryza_contest_entries', JSON.stringify(contestEntries));
  }, [contestEntries]);

  // Active Banners state
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('dryza_banners');
    return saved ? JSON.parse(saved) : SEED_BANNERS;
  });

  useEffect(() => {
    localStorage.setItem('dryza_banners', JSON.stringify(banners));
  }, [banners]);

  // Global Dynamic Settings States (Admin Configurable)
  const [trustedCount, setTrustedCount] = useState<number>(() => {
    const saved = localStorage.getItem('dryza_trusted_count');
    return saved ? parseInt(saved) : 103;
  });

  useEffect(() => {
    localStorage.setItem('dryza_trusted_count', trustedCount.toString());
  }, [trustedCount]);

  const [fssaiLicNo, setFssaiLicNo] = useState<string>(() => {
    return localStorage.getItem('dryza_fssai_lic') || '12724999000234';
  });

  useEffect(() => {
    localStorage.setItem('dryza_fssai_lic', fssaiLicNo);
  }, [fssaiLicNo]);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem('dryza_quiz_questions');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return QUIZ_QUESTIONS;
  });

  useEffect(() => {
    localStorage.setItem('dryza_quiz_questions', JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('dryza_coupons');
    return saved ? JSON.parse(saved) : [
      { id: 'cop-1', code: 'DRYZA20', type: 'percent', value: 20, expirationDate: '2026-12-31' },
      { id: 'cop-2', code: 'FSSAI300', type: 'fixed', value: 300, expirationDate: '2026-11-30' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('dryza_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const [wheelSettings, setWheelSettings] = useState<WheelSettings>(() => {
    const saved = localStorage.getItem('dryza_wheel_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.spinMinCartValue === 2000) {
        parsed.spinMinCartValue = 499;
      }
      return parsed;
    }
    return {
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
    };
  });

  useEffect(() => {
    localStorage.setItem('dryza_wheel_settings', JSON.stringify(wheelSettings));
  }, [wheelSettings]);

  const handleSpinWheelForOrder = (orderId: string, prizeLabel: string) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) =>
        inq.id === orderId
          ? { ...inq, hasSpunWheel: true, spinWheelResult: prizeLabel }
          : inq
      );
      localStorage.setItem('dryza_inquiries', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle continuous XP adding which maintains sync in both lists
  const handleUpdateCustomerPoints = (pointsToAdd: number, reason: string) => {
    if (!loggedInCustomer) return;

    const currentPoints = loggedInCustomer.points || 0;
    const nextPoints = currentPoints + pointsToAdd;

    let nextLevel = loggedInCustomer.loyaltyLevel || 'Bronze';
    if (nextPoints >= 1000) nextLevel = 'Platinum';
    else if (nextPoints >= 500) nextLevel = 'Gold';
    else if (nextPoints >= 200) nextLevel = 'Silver';

    const updatedLoggedIn = {
      ...loggedInCustomer,
      points: nextPoints,
      loyaltyLevel: nextLevel,
      pointsHistory: [
        ...(loggedInCustomer.pointsHistory || []),
        { date: new Date().toISOString().split('T')[0], points: pointsToAdd, reason }
      ]
    };

    setLoggedInCustomer(updatedLoggedIn);

    // Sync back directly to general master list of buyer accounts
    setCustomers((prev) => {
      const next = prev.map((c) => (c.email === loggedInCustomer.email ? updatedLoggedIn : c));
      const target = next.find((c) => c.email === loggedInCustomer.email);
      if (target) setDoc(doc(db, 'customers', target.id), target);
      return next;
    });
  };

  const handleVoteContestEntry = (entryId: string, voterEmail: string) => {
    setContestEntries((prev) => {
      const next = prev.map((entry) => {
        if (entry.id === entryId) {
          const votedList = entry.votedUserEmails || [];
          if (votedList.includes(voterEmail)) {
            alert('Your corporate representative has already voted for this dish!');
            return entry;
          }
          const updatedEntry = {
            ...entry,
            votesCount: entry.votesCount + 1,
            votedUserEmails: [...votedList, voterEmail]
          };
          // Reward voter corporate account with 10 XP points
          handleUpdateCustomerPoints(10, `Voted on dish: ${entry.dishName}`);
          setDoc(doc(db, 'contestEntries', entryId), updatedEntry);
          return updatedEntry;
        }
        return entry;
      });
      return next;
    });
  };

  const handleAddUnlockedOffer = (offer: any) => {
    if (!loggedInCustomer) return;
    const currentOffers = loggedInCustomer.unlockedOffers || [];
    const updatedLoggedIn = {
      ...loggedInCustomer,
      unlockedOffers: [...currentOffers, offer]
    };
    setLoggedInCustomer(updatedLoggedIn);
    setCustomers((prev) => {
      const next = prev.map((c) => (c.email === loggedInCustomer.email ? updatedLoggedIn : c));
      const target = next.find((c) => c.email === loggedInCustomer.email);
      if (target) setDoc(doc(db, 'customers', target.id), target);
      return next;
    });
  };

  const handleImportBackup = async (backupData: any) => {
    if (!backupData) return;
    try {
      const batch = writeBatch(db);
      if (backupData.customers) {
        setCustomers(backupData.customers);
        backupData.customers.forEach((c: any) => batch.set(doc(db, 'customers', c.id), c));
      }
      if (backupData.inquiries) {
        setInquiries(backupData.inquiries);
        backupData.inquiries.forEach((i: any) => batch.set(doc(db, 'inquiries', i.id), i));
      }
      if (backupData.products) {
        setProductsList(backupData.products);
        backupData.products.forEach((p: any) => batch.set(doc(db, 'products', p.id), p));
      }
      if (backupData.contestEntries) {
        setContestEntries(backupData.contestEntries);
        backupData.contestEntries.forEach((c: any) => batch.set(doc(db, 'contestEntries', c.id), c));
      }
      await batch.commit();
      if (backupData.logoUrl !== undefined) {
        setLogoUrl(backupData.logoUrl);
      }
      
      // Auto hydrate current loggedIn user if matching email still exists
      if (loggedInCustomer && backupData.customers) {
        const found = backupData.customers.find((c: any) => c.email === loggedInCustomer.email);
        if (found) {
          setLoggedInCustomer(found);
        }
      }
      alert('Corporate Backup synchronization successfully restored all database partitions!');
    } catch (err) {
      console.error('Failed to import backup.', err);
      alert('Corrupt payload error. Verification failed.');
    }
  };

  // Product master list - Fallback to [] so stock begins completely empty as requested
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dryza_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Inquiry request form sheet modal visibility
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);

  // FIREBASE SYNC - One global block
  useEffect(() => {
    // Single Docs
    const unsubLogo = onSnapshot(doc(db, 'settings', 'logo'), (d) => {
      if (d.exists()) setLogoUrl(prev => prev === d.data().url ? prev : d.data().url);
    });

    const unsubQuiz = onSnapshot(doc(db, 'settings', 'quiz'), (d) => {
      if (d.exists() && d.data().questions) setQuizQuestions(d.data().questions);
    });

    const unsubAdminPass = onSnapshot(doc(db, 'settings', 'adminPass'), (d) => {
      if (d.exists() && d.data().value) setAdminPassword(d.data().value);
    });

    const unsubTrustedCount = onSnapshot(doc(db, 'settings', 'trustedCount'), (d) => {
      if (d.exists() && d.data().value !== undefined) setTrustedCount(d.data().value);
    });

    const unsubFssai = onSnapshot(doc(db, 'settings', 'fssai'), (d) => {
      if (d.exists() && d.data().value) setFssaiLicNo(d.data().value);
    });

    const unsubWheel = onSnapshot(doc(db, 'settings', 'wheelSettings'), (d) => {
      if (d.exists() && d.data().value) setWheelSettings(d.data().value);
    });

    // Collections
    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      const inqs: any[] = [];
      snapshot.forEach(doc => inqs.push({ id: doc.id, ...doc.data() }));
      inqs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setInquiries(prev => JSON.stringify(prev) === JSON.stringify(inqs) ? prev : inqs);
    });

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const custs: any[] = [];
      snapshot.forEach(doc => custs.push({ id: doc.id, ...doc.data() }));
      setCustomers(prev => JSON.stringify(prev) === JSON.stringify(custs) ? prev : custs);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setProductsList(prev => JSON.stringify(prev) === JSON.stringify(arr) ? prev : arr);
    });

    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setBanners(prev => JSON.stringify(prev) === JSON.stringify(arr) ? prev : arr);
    });

    const unsubCouponsCol = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(doc => arr.push({ ...doc.data() }));
      setCoupons(prev => JSON.stringify(prev) === JSON.stringify(arr) ? prev : arr);
    });

    const unsubContests = onSnapshot(collection(db, 'contestEntries'), (snapshot) => {
      const arr: any[] = [];
      snapshot.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setContestEntries(prev => JSON.stringify(prev) === JSON.stringify(arr) ? prev : arr);
    });

    return () => {
      unsubLogo(); unsubQuiz(); unsubAdminPass(); unsubTrustedCount(); unsubFssai(); unsubWheel();
      unsubInquiries(); unsubCustomers(); unsubProducts(); unsubBanners(); unsubCouponsCol(); unsubContests();
    };
  }, []);

  // Sync back hook blocks
  useEffect(() => { if (logoUrl) setDoc(doc(db, 'settings', 'logo'), { url: logoUrl }); }, [logoUrl]);
  useEffect(() => { if (quizQuestions.length > 0) setDoc(doc(db, 'settings', 'quiz'), { questions: quizQuestions }); }, [quizQuestions]);
  useEffect(() => { if (adminPassword) setDoc(doc(db, 'settings', 'adminPass'), { value: adminPassword }); }, [adminPassword]);
  useEffect(() => { if (trustedCount !== undefined) setDoc(doc(db, 'settings', 'trustedCount'), { value: trustedCount }); }, [trustedCount]);
  useEffect(() => { if (fssaiLicNo) setDoc(doc(db, 'settings', 'fssai'), { value: fssaiLicNo }); }, [fssaiLicNo]);
  useEffect(() => { if (wheelSettings) setDoc(doc(db, 'settings', 'wheelSettings'), { value: wheelSettings }); }, [wheelSettings]);

  // Anti-inspect and anti-right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12
      if (e.key === 'F12') e.preventDefault();
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'i' || e.key === 'j')) {
        e.preventDefault();
      }
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);



  // Synchronize collections
  useEffect(() => {
    localStorage.setItem('dryza_selected_products', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  useEffect(() => {
    localStorage.setItem('dryza_is_admin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('dryza_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('dryza_products', JSON.stringify(productsList));
  }, [productsList]);

  // Lead State modifiers
  const handleUpdateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries((prev) => {
      const next = prev.map((inq) => (inq.id === id ? { ...inq, status } : inq));
      const target = next.find(i => i.id === id);
      if (target) setDoc(doc(db, 'inquiries', id), target);
      return next;
    });
  };

  const handleUpdateInquiryNotes = (id: string, adminNotes: string) => {
    setInquiries((prev) => {
      const next = prev.map((inq) => (inq.id === id ? { ...inq, adminNotes } : inq));
      const target = next.find(i => i.id === id);
      if (target) setDoc(doc(db, 'inquiries', id), target);
      return next;
    });
  };

  const handleDeleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    await deleteDoc(doc(db, 'inquiries', id));
  };

  // Product Stocks modifier (for silos tonnage limits)
  const handleUpdateProductStock = (id: string, tons: number) => {
    setProductsList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, stockTons: tons };
          setSelectedProducts((currentSel) =>
            currentSel.map((sel) => (sel.id === id ? updated : sel))
          );
          if (selectedProductForModal?.id === id) {
            setSelectedProductForModal(updated);
          }
          setDoc(doc(db, 'products', id), updated);
          return updated;
        }
        return p;
      });
      return next;
    });
  };

  const handleUpdateProductPrice = (id: string, pricePerKgRange: string) => {
    setProductsList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, pricePerKgRange };
          setSelectedProducts((currentSel) =>
            currentSel.map((sel) => (sel.id === id ? updated : sel))
          );
          if (selectedProductForModal?.id === id) {
            setSelectedProductForModal(updated);
          }
          setDoc(doc(db, 'products', id), updated);
          return updated;
        }
        return p;
      });
      return next;
    });
  };

  const handleUpdateProductPhoto = (id: string, image: string) => {
    setProductsList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, image };
          setSelectedProducts((currentSel) =>
            currentSel.map((sel) => (sel.id === id ? updated : sel))
          );
          if (selectedProductForModal?.id === id) {
            setSelectedProductForModal(updated);
          }
          setDoc(doc(db, 'products', id), updated);
          return updated;
        }
        return p;
      });
      return next;
    });
  };

  const handleUpdateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProductsList((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updatedFields };
          setSelectedProducts((currentSel) =>
            currentSel.map((sel) => (sel.id === id ? updated : sel))
          );
          if (selectedProductForModal?.id === id) {
            setSelectedProductForModal(updated);
          }
          setDoc(doc(db, 'products', id), updated);
          return updated;
        }
        return p;
      });
      return next;
    });
  };

  // Database handlers for clean/empty/seed control
  const handleAddProduct = (newProduct: Product) => {
    setProductsList((prev) => [...prev, newProduct]);
    setDoc(doc(db, 'products', newProduct.id), newProduct);
  };

  const handleDeleteProduct = async (id: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProductForModal?.id === id) {
      setSelectedProductForModal(null);
    }
    await deleteDoc(doc(db, 'products', id));
  };

  const handleResetToDemoData = async () => {
    setProductsList(PRODUCTS);
    setInquiries(SEED_INQUIRIES);
    
    // Seed DB
    const batch = writeBatch(db);
    PRODUCTS.forEach((p, idx) => batch.set(doc(db, 'products', p.id || `product_${idx}`), p));
    SEED_INQUIRIES.forEach((i, idx) => batch.set(doc(db, 'inquiries', i.id || `inquiry_${idx}`), i));
    await batch.commit();
  };

  const handleClearAllProducts = async () => {
    setProductsList([]);
    setSelectedProducts([]);
    setSelectedProductForModal(null);
    const snap = await getDocs(collection(db, 'products'));
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  const handleClearAllInquiries = async () => {
    setInquiries([]);
    const snap = await getDocs(collection(db, 'inquiries'));
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  };

  // Cart / Queue interactions
  const handleAddToInquiry = (product: Product, event?: React.MouseEvent) => {
    if (!loggedInCustomer) {
      setIsClientAuthOpen(true);
      return;
    }
    
    const isAdding = !selectedProducts.some((p) => p.id === product.id);
    
    if (isAdding) {
      // Trigger fly animation
      if (event) {
        triggerFlyAnimation(product, event.clientX, event.clientY);
      } else {
        triggerFlyAnimation(product, window.innerWidth / 2, window.innerHeight / 2);
      }
      
      setSelectedProducts((prev) => [...prev, product]);
      setCartQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
      setCartQuantities((prev) => {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      });
    }
  };

  const handleRemoveProductFromInquiry = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleAddProductToInquiryInPlace = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev;
      setCartQuantities((q) => ({ ...q, [product.id]: 1 }));
      return [...prev, product];
    });
  };

  const handleIncrementQuantity = (productId: string) => {
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecrementQuantity = (productId: string) => {
    const currentQty = cartQuantities[productId] || 1;
    if (currentQty <= 1) {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
      setCartQuantities((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } else {
      setCartQuantities((prev) => ({
        ...prev,
        [productId]: currentQty - 1,
      }));
    }
  };

  // Launching quote submission from RFQ form modal
  const handleFormSubmitInquiry = async (newInq: Omit<Inquiry, 'id' | 'submittedAt' | 'status'>): Promise<Inquiry> => {
    const freshInquiry: Inquiry = {
      ...newInq,
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      status: 'Ordered',
    };
    setInquiries((prev) => [freshInquiry, ...prev]);
    setDoc(doc(db, 'inquiries', freshInquiry.id), freshInquiry);
    setSelectedProducts([]); // Clean selection queue after positive launch
    setCartQuantities({}); // Reset cart quantities

    // Try to send an email to the customer
    try {
      const { getDoc, doc } = await import('firebase/firestore');
      const { db } = await import('./lib/firebase');
      const { sendOrderEmail } = await import('./lib/gmail');
      
      const gmailSetting = await getDoc(doc(db, 'settings', 'gmail'));
      let token = null;
      if (gmailSetting.exists()) {
        token = gmailSetting.data().token;
      }

      if (token && freshInquiry.email) {
          await sendOrderEmail(freshInquiry.email, freshInquiry, token);
          console.log(`Order confirmation email sent to ${freshInquiry.email}`);
      } else {
          console.log('No Admin Gmail access token available in Firestore, or customer email is missing. Skipping email send.');
      }
    } catch (err) {
      console.error('Failed to send order confirmation email via Gmail:', err);
    }

    return freshInquiry;
  };

  // Trigger fly animation handler
  const triggerFlyAnimation = (product: Product, startX: number, startY: number) => {
    const animationId = Math.random().toString(36).substring(2, 9);
    
    // Generate beautiful sprinkles for trail effect when adding to cart
    const sprinkles = Array.from({ length: 24 }).map((_, i) => ({
      id: `sprinkle-${animationId}-${i}`,
      startX: (startX || window.innerWidth / 2) + (Math.random() - 0.5) * 60,
      startY: (startY || window.innerHeight / 2) + (Math.random() - 0.5) * 60,
      color: ['#059669', '#10b981', '#f59e0b', '#d97706', '#fbbf24', '#ffffff'][Math.floor(Math.random() * 6)],
      size: Math.random() * 6 + 3,
      delay: Math.random() * 0.3
    }));

    setFlyingItems((prev) => [
      ...prev,
      {
        id: animationId,
        startX: startX || window.innerWidth / 2,
        startY: startY || window.innerHeight / 2,
        image: product.image || '',
        sprinkles
      },
    ]);
  };

  // Perform Gemini AI semantic match query
  const performAiSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setIsAiSearchActive(false);
      setAiSearchMatches([]);
      return;
    }
    setAiSearchLoading(true);
    setAiSearchError(null);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, products: productsList }),
      });
      if (!response.ok) {
        throw new Error('Remote semantic index mapping returned error.');
      }
      const data = await response.json();
      setAiSearchMatches(data.results || []);
      setIsAiSearchActive(true);
    } catch (err: any) {
      console.warn('AI Search Error, utilizing local regex semantic approximation:', err);
      // Fallback matching
      const term = query.toLowerCase();
      const fallbackResults = productsList
        .map((p) => {
          let score = 0;
          let explanation = '';
          if (p.name.toLowerCase().includes(term)) {
            score = 100;
            explanation = 'Direct match found in spice product catalog.';
          } else if (p.description.toLowerCase().includes(term) || (p.applications && p.applications.some((app: string) => app.toLowerCase().includes(term)))) {
            score = 80;
            explanation = `Matched details and application profile for "${query}".`;
          } else if (p.categoryLabel.toLowerCase().includes(term)) {
            score = 60;
            explanation = `Matched general category: ${p.categoryLabel}.`;
          }
          return { productId: p.id, relevanceScore: score, matchExplanation: explanation };
        })
        .filter((r) => r.relevanceScore >= 40);
      setAiSearchMatches(fallbackResults);
      setIsAiSearchActive(true);
    } finally {
      setAiSearchLoading(false);
    }
  };

  // Filters calculation
  const filteredProducts = useMemo(() => {
    if (isAiSearch && isAiSearchActive && aiSearchMatches.length > 0) {
      return productsList
        .filter((product) => {
          const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
          const hasMatch = aiSearchMatches.some((m) => m.productId === product.id);
          return matchesCategory && hasMatch;
        })
        .sort((a, b) => {
          const scoreA = aiSearchMatches.find((m) => m.productId === a.id)?.relevanceScore ?? 0;
          const scoreB = aiSearchMatches.find((m) => m.productId === b.id)?.relevanceScore ?? 0;
          return scoreB - scoreA;
        });
    }

    return productsList.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchWord.toLowerCase()) ||
        product.categoryLabel.toLowerCase().includes(searchWord.toLowerCase()) ||
        product.description.toLowerCase().includes(searchWord.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productsList, selectedCategory, searchWord, isAiSearch, isAiSearchActive, aiSearchMatches]);

  const criticalStockBannerShown = productsList.some((p) => p.stockTons < 8.0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 font-sans" id="dryza-site-scaffold">
      
      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // If we navigate from policies or other tabs, clear terms/filters
          if (tab !== 'catalogue') {
            setSearchWord('');
          }
        }}
        inquiryCount={selectedProducts.length}
        openInquiryForm={() => setCurrentTab('cart')}
        isAdmin={isAdmin}
        setIsAdmin={handleSetIsAdmin}
        logoUrl={logoUrl}
        loggedInCustomer={loggedInCustomer}
        onOpenClientAuth={() => setIsClientAuthOpen(true)}
        onClientLogout={() => setLoggedInCustomer(null)}
      />

      {/* Main Contents Segment */}
      <main className="flex-grow pt-2">
        {/* If Administrator Mode is toggled and we want the Admin panel rendered instead of normal pages */}
        {isAdmin ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs font-mono text-amber-900 flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-700 shrink-0" />
                <span>You are currently visualizing the **Dryza Corporate Control Suite**. Modifications persist in local storage.</span>
              </div>
              <button
                onClick={() => setIsAdmin(false)}
                className="bg-amber-800 text-stone-100 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-900 cursor-pointer transition-colors"
              >
                Switch to Customer Storefront
              </button>
            </div>
            
            <AdminPanel
              inquiries={inquiries}
              products={productsList}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onUpdateInquiryNotes={handleUpdateInquiryNotes}
              onDeleteInquiry={handleDeleteInquiry}
              onUpdateProductStock={handleUpdateProductStock}
              onUpdateProductPrice={handleUpdateProductPrice}
              onUpdateProductPhoto={handleUpdateProductPhoto}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetToDemoData={handleResetToDemoData}
              onClearAllProducts={handleClearAllProducts}
              onClearAllInquiries={handleClearAllInquiries}
              logoUrl={logoUrl}
              onUpdateLogo={setLogoUrl}
              customers={customers}
              onUpdateCustomers={setCustomers}
              quizQuestions={quizQuestions}
              onUpdateQuizQuestions={setQuizQuestions}
              contestEntries={contestEntries}
              onUpdateContestEntries={setContestEntries}
              banners={banners}
              onUpdateBanners={setBanners}
              adminPassword={adminPassword}
              onUpdateAdminPassword={setAdminPassword}
              trustedCount={trustedCount}
              onUpdateTrustedCount={setTrustedCount}
              fssaiLicNo={fssaiLicNo}
              onUpdateFssaiLicNo={setFssaiLicNo}
              coupons={coupons}
              onUpdateCoupons={setCoupons}
              wheelSettings={wheelSettings}
              onUpdateWheelSettings={setWheelSettings}
            />
          </div>
        ) : (
          /* Normal Retail and B2B client flow */
          <div id="customer-storefront-body">
            {currentTab === 'home' && (
              <div className="space-y-4">
                {/* Prominent Top Search Bar on Homepage */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSearchWord(localSearchTerm);
                      setCurrentTab('catalogue');
                    }}
                    className="relative bg-[#FAF9F5]/90 backdrop-blur-md p-3 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-3 focus-within:border-amber-700 focus-within:ring-2 focus-within:ring-amber-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 px-2 shrink-0 border-r border-stone-200 text-stone-500 font-mono text-xs font-bold uppercase tracking-wider">
                      <Search className="w-4 h-4 text-amber-800" />
                      <span className="hidden sm:inline text-stone-700">Lookup</span>
                    </div>
                    <input
                      type="text"
                      className="w-full bg-transparent font-sans text-xs sm:text-sm text-stone-850 outline-none placeholder-stone-450"
                      placeholder="Enterprise Instant Lookup: Search dehydrated garlic, onion flakes, spice grades, mesh size, quality standards..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                    />
                    {localSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setLocalSearchTerm('')}
                        className="text-stone-400 hover:text-stone-700 p-1 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-5 py-2 sm:py-2.5 bg-amber-800 hover:bg-amber-900 text-[#FAF9F5] rounded-xl font-mono text-xs font-black uppercase tracking-wider shadow transition-colors cursor-pointer shrink-0"
                    >
                      Instant Search
                    </button>
                  </form>
                </div>

                {/* Banners carousel displayed below header */}
                <HomepageBanners banners={banners} setCurrentTab={setCurrentTab} />

                {/* Hero */}
                <Hero
                  onSearch={(term) => setSearchWord(term)}
                  onExploreProducts={() => setCurrentTab('catalogue')}
                  onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
                  trustedCount={trustedCount}
                />

                {/* Popular Products Segment on Home Page */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10" id="home-featured-products">
                  <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                      Dry-Milling Highlights
                    </span>
                    <h3 className="text-3xl font-extrabold tracking-tight text-stone-900">
                      High-Capacity Dehydrated Ingredients
                    </h3>
                    <p className="text-[#57534E] text-sm md:text-base">
                      Ready-to-ship premium dried ingredients. Capture extreme pungency, pristine quality controls, and complete microbiological sanitization.
                    </p>
                  </div>

                  {/* Core 4 Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productsList.filter((p) => p.isPopular).slice(0, 4).map((p) => (
                      <div key={p.id}>
                        <ProductCard
                          product={p}
                          onViewDetails={(prod) => setSelectedProductForModal(prod)}
                          onAddToInquiry={handleAddToInquiry}
                          isInInquiry={selectedProducts.some((sq) => sq.id === p.id)}
                          loggedInCustomer={loggedInCustomer}
                        />
                      </div>
                    ))}
                  </div>

                  {/* CTA button to full listing */}
                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchWord('');
                        setCurrentTab('catalogue');
                      }}
                      className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-black text-[#FAF9F5] px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      id="home-view-catalogue"
                    >
                      <span>Explore 16+ Corporate Ingredients</span>
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                {/* Quality / Facilities Trust Badges Bento */}
                <div className="bg-stone-50 border-y border-stone-200 py-16">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      <div className="lg:col-span-7 space-y-6">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-50 px-3 py-1 rounded-full">
                          Industrial Standards & Analytics
                        </span>
                        <h3 className="text-3xl font-extrabold text-stone-950 tracking-tight font-sans leading-tight">
                          Modern Dehydration Architecture built for Food Conglomerates
                        </h3>
                        <p className="text-xs text-stone-605 leading-relaxed">
                          By leveraging modern continuous-belt tunnel dryers, we guarantee that the final volatile compound concentrations (like the natural allicin content in our premium garlic powders or pungency scoville rating in dry chilis) are perfectly conserved under strict quality guidelines.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-stone-200 flex gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-5.5 h-5.5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-stone-900 text-xs">Purity Certifications</h5>
                              <p className="text-[10px] text-stone-500 leading-normal mt-0.5">SGS validated BRCGS Grade AA facility compliance, USDA compliant residue limits.</p>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-stone-200 flex gap-3.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                              <Award className="w-5.5 h-5.5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-stone-900 text-xs">Double-Barrier Protection</h5>
                              <p className="text-[10px] text-stone-500 leading-normal mt-0.5">Dual inner LDPE sealed liners ensure complete isolation against ambient atmosphere.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cargo estimates sizing card visual */}
                      <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-200 space-y-5">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400 font-extrabold block border-b pb-1.5">
                          Commercial Transport Volumes
                        </span>

                        <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
                          <div className="bg-stone-50 p-3 rounded-lg border">
                            <span className="text-zinc-400 text-[8.5px] uppercase block">Micro Consignment</span>
                            <span className="block text-sm font-black text-stone-900 mt-1">1.0 MT (LCL)</span>
                            <span className="text-[9px] text-stone-505 block mt-0.5">Dry sorting boards</span>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-lg border">
                            <span className="text-zinc-400 text-[8.5px] uppercase block">Bulk Solids</span>
                            <span className="block text-sm font-black text-emerald-800 mt-1">15 - 25 MT</span>
                            <span className="text-[9px] text-stone-505 block mt-0.5">Multi-Silo packing</span>
                          </div>
                        </div>

                        <div className="p-4 bg-emerald-51 rounded-xl border border-emerald-100 flex items-center justify-between gap-4 text-xs font-sans">
                          <div>
                            <span className="font-bold text-[#115E59]">Sample requests are free of charge</span>
                            <p className="text-[10px] text-[#0F766E] mt-0.5">Freight dispatched via DHL Express worldwide within 24 working hours.</p>
                          </div>
                          <button
                            onClick={() => setIsInquiryOpen(true)}
                            className="bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg px-3 py-2 text-[10px] font-bold font-mono shrink-0 transition-colors cursor-pointer"
                          >
                            Get Sample
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            )}

            {currentTab === 'catalogue' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="scatalog-view">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#B45309] bg-amber-100/60 px-3 py-1 rounded-full">
                      Premium Grade Materials Sourcing
                    </span>
                    <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight leading-none">
                      Dehydrated Vegetable & Herbs Catalog
                    </h2>
                    <p className="text-sm text-stone-605 max-w-2xl">
                      Select raw parameters, browse packaging layouts, and queue active ingredients into your corporate RFQ basket.
                    </p>
                  </div>

                  {/* Inline Filter Search Box with AI Semantic Selector */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:max-w-2xl">
                    {/* Mode Toggle Button */}
                    <div className="bg-stone-100 p-1 rounded-xl border flex items-center shrink-0 self-start sm:self-auto shadow-inner-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAiSearch(false);
                          setIsAiSearchActive(false);
                        }}
                        className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          !isAiSearch ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Fuzzy-Match</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAiSearch(true);
                          if (localSearchTerm.trim()) {
                            performAiSemanticSearch(localSearchTerm);
                          }
                        }}
                        className={`px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAiSearch ? 'bg-[#0D9488] text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'
                        }`}
                      >
                        <Brain className="w-3.5 h-3.5" />
                        <span>AI Semantic-Match</span>
                      </button>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (isAiSearch) {
                          performAiSemanticSearch(localSearchTerm);
                        } else {
                          setSearchWord(localSearchTerm);
                        }
                      }}
                      className="relative flex-1 flex items-center gap-1.5"
                      id="tapped-search-unit"
                    >
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder={isAiSearch ? "Describe food style, menu or raw parameters..." : "Search ingredients..."}
                          className="w-full pl-3 pr-8 py-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:border-[#0D9488] focus:outline-none font-sans"
                          value={localSearchTerm}
                          onChange={(e) => setLocalSearchTerm(e.target.value)}
                        />
                        {(localSearchTerm || searchWord || isAiSearchActive) && (
                          <button
                            type="button"
                            onClick={() => {
                              setLocalSearchTerm('');
                              setSearchWord('');
                              setIsAiSearchActive(false);
                              setAiSearchMatches([]);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={aiSearchLoading}
                        className={`rounded-xl p-2.5 flex items-center justify-center cursor-pointer shadow-sm transition-colors shrink-0 text-stone-950 ${
                          isAiSearch ? 'bg-[#0F766E] hover:bg-[#0D9488]' : 'bg-emerald-900 hover:bg-emerald-950'
                        }`}
                        title="Execute Match"
                        id="search-icon-submit"
                      >
                        {aiSearchLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Categories filtering tab bar */}
                <div className="flex flex-wrap items-center gap-1.5" id="category-filter-segment">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-850 text-[#FCFBF7] shadow-sm font-extrabold'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    All Ingredients
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-850 text-[#FCFBF7] shadow-sm font-extrabold'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Render Filtered Grid list */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-stone-100 rounded-3xl border-2 border-dashed border-stone-300 space-y-3">
                    <p className="text-stone-500 font-mono text-sm">No products found matching your search term.</p>
                    <button
                      onClick={() => {
                        setSearchWord('');
                        setSelectedCategory('all');
                      }}
                      className="text-xs bg-stone-900 text-white px-4 py-2 rounded-xl font-mono font-bold cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Optional loading banner */}
                    {aiSearchLoading && (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-3 animate-pulse text-xs text-emerald-800">
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                        <span>Resynthesizing matching vectors. Consulting backend ingredient index...</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProducts.map((p) => {
                        const criticalStock = p.stockTons < 8.0;
                        const aiMatch = isAiSearch && isAiSearchActive ? aiSearchMatches.find(m => m.productId === p.id) : null;
                        return (
                          <div key={p.id} className="relative flex flex-col h-full space-y-2.5">
                            {criticalStock && (
                              <div className="absolute top-2.5 right-2.5 z-10 bg-amber-600 text-white text-[8.5px] uppercase font-mono font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Critical Tonnage</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <ProductCard
                                product={p}
                                onViewDetails={(prod) => setSelectedProductForModal(prod)}
                                onAddToInquiry={handleAddToInquiry}
                                isInInquiry={selectedProducts.some((sq) => sq.id === p.id)}
                                loggedInCustomer={loggedInCustomer}
                                quantity={cartQuantities[p.id] || 1}
                                onIncrement={handleIncrementQuantity}
                                onDecrement={handleDecrementQuantity}
                              />
                            </div>
                            
                            {aiMatch && (
                              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-[11px] text-emerald-950 font-sans shadow-sm animate-fade-in flex items-start gap-2 leading-relaxed">
                                <Brain className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-mono text-[8px] font-bold uppercase text-emerald-700 tracking-widest block">AI Match: {aiMatch.relevanceScore}% Relevant</span>
                                  <p className="text-stone-701 text-[11px] mt-0.5">{aiMatch.matchExplanation}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentTab === 'recipes' && (
              <BlogSection
                products={productsList}
                onExploreProduct={(product) => {
                  setSelectedProductForModal(product);
                  setCurrentTab('catalogue');
                }}
              />
            )}

            {currentTab === 'community' && (
              <CommunityPanel
                loggedInCustomer={loggedInCustomer}
                onUpdateCustomerPoints={handleUpdateCustomerPoints}
                contestEntries={contestEntries}
                onAddContestEntry={(entry) => {
                  setContestEntries((prev) => [entry, ...prev]);
                  setDoc(doc(db, 'contestEntries', entry.id), entry);
                }}
                onVoteContestEntry={handleVoteContestEntry}
                customers={customers}
                quizQuestions={quizQuestions}
                onUpdateCustomerRecord={(updates) => {
                  if (!loggedInCustomer) return;
                  const updated = { ...loggedInCustomer, ...updates };
                  setLoggedInCustomer(updated);
                  setCustomers(prev => prev.map(c => c.email === updated.email ? updated : c));
                }}
                onOpenLogin={() => setIsClientAuthOpen(true)}
              />
            )}

            {currentTab === 'rewards' && (
              <RewardsPanel
                loggedInCustomer={loggedInCustomer}
                onUpdateCustomerPoints={handleUpdateCustomerPoints}
                onAddUnlockedOffer={handleAddUnlockedOffer}
                customers={customers}
                onOpenLogin={() => setIsClientAuthOpen(true)}
                onImportBackup={handleImportBackup}
                wheelSettings={wheelSettings}
                inquiries={inquiries}
                onSpinWheelForOrder={handleSpinWheelForOrder}
              />
            )}

            {currentTab === 'cart' && (
              <div className="max-w-7xl mx-auto px-1 py-1" id="scart-view-pane">
                <InquiryForm
                  allProducts={productsList}
                  selectedProducts={selectedProducts}
                  onRemoveProduct={handleRemoveProductFromInquiry}
                  onAddProduct={handleAddProductToInquiryInPlace}
                  onSubmitInquiry={handleFormSubmitInquiry}
                  onClose={() => setCurrentTab('catalogue')}
                  onGoToOrders={() => setCurrentTab('orders')}
                  loggedInCustomer={loggedInCustomer}
                  customers={customers}
                  onRegister={(newCs) => {
                    setCustomers((prev) => [...prev, newCs]);
                    setDoc(doc(db, 'customers', newCs.id), newCs);
                  }}
                  onLogin={(cs) => setLoggedInCustomer(cs)}
                  coupons={coupons}
                  wheelSettings={wheelSettings}
                  onSpinWheelForOrder={handleSpinWheelForOrder}
                  onUpdateCustomerPoints={handleUpdateCustomerPoints}
                  onAddUnlockedOffer={handleAddUnlockedOffer}
                  cartQuantities={cartQuantities}
                  onIncrementQuantity={handleIncrementQuantity}
                  onDecrementQuantity={handleDecrementQuantity}
                  isFullPage={true}
                />
              </div>
            )}

            {currentTab === 'orders' && (
              <MyOrdersPage
                inquiries={inquiries}
                allProducts={productsList}
                loggedInCustomer={loggedInCustomer}
                onOpenLogin={() => setIsClientAuthOpen(true)}
                setCurrentTab={setCurrentTab}
                wheelSettings={wheelSettings}
                onCancelOrder={(id) => {
                  setInquiries(prev => prev.filter(inq => inq.id !== id));
                }}
              />
            )}

            {/* Other informational pages */}
            {currentTab !== 'home' && currentTab !== 'catalogue' && currentTab !== 'recipes' && currentTab !== 'community' && currentTab !== 'rewards' && currentTab !== 'cart' && currentTab !== 'orders' && (
              <Pages
                currentTab={currentTab}
                openInquiryForm={() => setCurrentTab('cart')}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Page Footer */}
      <Footer
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'catalogue') {
            setSearchWord('');
          }
        }}
        openBulkForm={() => setCurrentTab('cart')}
        logoUrl={logoUrl}
        fssaiLicNo={fssaiLicNo}
        onSecretAdminTripleClick={triggerAdminWithPassword}
      />

      {/* Product Specification Inspection Modal */}
      {selectedProductForModal && (
        <ProductDetailsModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToInquiry={handleAddProductToInquiryInPlace}
          isInInquiry={selectedProducts.some((p) => p.id === selectedProductForModal.id)}
          openBulkForm={() => setCurrentTab('cart')}
          loggedInCustomer={loggedInCustomer}
        />
      )}

      {/* B2B RFQ Inquiry Multi-Stage Form Overlay is now rendered full-page under the cart tab */}

      {/* Global Customer Authentication Modal */}
      <CustomerAuthModal
        isOpen={isClientAuthOpen}
        onClose={() => setIsClientAuthOpen(false)}
        customers={customers}
        onRegister={(newCs) => {
          setCustomers((prev) => [...prev, newCs]);
          setDoc(doc(db, 'customers', newCs.id), newCs);
        }}
        onLogin={(cs) => setLoggedInCustomer(cs)}
      />

      {/* Corporate Admin Passcode Verification Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4" id="passcode-modal">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-stone-200/80 shadow-2xl relative space-y-6 animate-fade-in text-center">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-950 font-sans tracking-tight">Executive Authentication</h3>
              <p className="text-xs text-stone-500 font-medium">Entering Dryza administrative layers. DRYZA corporate authentication is required.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordInput === adminPassword) {
                  setIsAdmin(true);
                  setIsPasswordModalOpen(false);
                  setPasswordError('');
                } else {
                  setPasswordError('Incorrect administrator passcode. Please reverify.');
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black text-left">
                  Staff Passkey
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoFocus
                    placeholder="Enter credentials..."
                    className="w-full text-center text-xs p-3 pr-10 font-mono bg-stone-50 border border-stone-200 rounded-xl focus:border-amber-700 focus:bg-white outline-none"
                    value={passwordInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPasswordInput(val);
                      if (passwordError) setPasswordError('');
                      if (val === adminPassword || val === 'DRYZAjamshedpur') {
                        setIsAdmin(true);
                        setIsPasswordModalOpen(false);
                        setPasswordInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[10px] text-red-600 font-mono text-center font-bold">
                    ⚠️ {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-stone-950 hover:bg-black text-[#FAF9F5] py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Authenticate Gateway
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating flying particles */}
      <AnimatePresence>
        {flyingItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.sprinkles?.map((sprinkle) => (
              <motion.div
                key={sprinkle.id}
                initial={{
                  position: 'fixed',
                  left: sprinkle.startX,
                  top: sprinkle.startY,
                  scale: 0,
                  opacity: 1,
                  zIndex: 9998,
                  backgroundColor: sprinkle.color,
                  width: sprinkle.size,
                  height: sprinkle.size,
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                }}
                animate={{
                  left: [sprinkle.startX, (item.startX + window.innerWidth) / 2 + (Math.random() - 0.5) * 150, window.innerWidth - 80 + (Math.random() - 0.5) * 80],
                  top: [sprinkle.startY, item.startY - 150 + (Math.random() - 0.5) * 150, 40 + (Math.random() - 0.5) * 80],
                  scale: [0, 1.5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: 1.1 + Math.random() * 0.3,
                  ease: 'easeInOut',
                  delay: sprinkle.delay
                }}
                className="pointer-events-none"
              />
            ))}
            <motion.div
              initial={{
                position: 'fixed',
                left: item.startX,
                top: item.startY,
                x: '-50%',
                y: '-50%',
                scale: 0.95,
                opacity: 1,
                zIndex: 9999,
              }}
              animate={{
                left: [item.startX, (item.startX + window.innerWidth) / 2, window.innerWidth - 80],
                top: [item.startY, item.startY - 150, 40],
                scale: 0.35,
                opacity: [1, 0.95, 0.25],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.1,
                ease: 'easeInOut',
              }}
              onAnimationComplete={() => {
                setFlyingItems((prev) => prev.filter((i) => i.id !== item.id));
              }}
              className="w-24 h-32 flex items-center justify-center pointer-events-none select-none bg-white rounded-2xl p-2.5 shadow-2.5xl border border-stone-200/80"
            >
              <ProductPouch product={productsList.find(p => p.image === item.image) || productsList[0] || PRODUCTS[0]} widthClass="w-[75px]" heightClass="h-[105px]" />
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>

    </div>
  );
}
