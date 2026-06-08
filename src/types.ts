export interface Product {
  id: string;
  name: string;
  category: 'garlic' | 'onion' | 'spices' | 'herbs' | 'blends' | 'industrial';
  categoryLabel: string;
  description: string;
  longDescription: string;
  appearance: string; // e.g. "Off-white granules"
  shelfLife: string; // e.g. "12 Months"
  packaging: string[]; // e.g. ["25 kg poly bag", "50 kg carton"]
  applications: string[]; // e.g. ["Instant noodles", "Seasoning manufacturers", "Sauces"]
  storage: string; // e.g. "Store in a cool, dry place"
  origin: string; // e.g. "India"
  qualityStandards: string[]; // e.g. ["USP", "ASTA", "FSSAI"]
  stockTons: number; // For admin panel inventory tracking
  pricePerKgRange: string; // For B2B estimated pricing
  csPricePerKgRange?: string; // For CS representative pricing
  isPopular?: boolean;
  image: string;
  backImage?: string;
  additionalImages?: string[];
  netWt?: string;
  mrp?: string;
  ingredientsText?: string;
  nutritionFacts?: Record<string, string>;
}

export interface Inquiry {
  id: string;
  productIds: string[];
  productNames: string[];
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  customerType: 'restaurant' | 'manufacturer' | 'seasoning_brand' | 'hotel' | 'trader' | 'retail_buyer' | 'distributor';
  estimatedQuantityKg: number;
  message: string;
  attachmentName?: string;
  status: 'Ordered' | 'Processed' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  submittedAt: string;
  adminNotes?: string;
  couponCode?: string;
  discountAmount?: number;
  totalPrice?: number;
  csType?: string;
  hasSpunWheel?: boolean;
  spinWheelResult?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  dryzaIngredients: string[];
  image: string;
}

export interface CertInfo {
  name: string;
  authority: string;
  validUntil: string;
  certifiedFor: string;
  description: string;
  logoText: string;
}

export interface StepInfo {
  step: number;
  title: string;
  description: string;
  details: string[];
  iconName: string;
}

export interface ContestEntry {
  id: string;
  customerName: string;
  companyName?: string;
  customerEmail: string;
  dishName: string;
  image: string;
  videoUrl?: string;
  votesCount: number;
  submittedAt: string;
  status: 'approved' | 'pending' | 'rejected' | 'winner';
  weeklyWinnerRank?: string; // e.g., "Weekly Gold Medal"
  votedUserEmails?: string[]; // tracks who has voted already to prevent duplicate voting
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  password?: string;
  points: number;
  loyaltyLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  lastSpinTime?: string; // ISO String
  quizCompletedAt?: string; // ISO String
  quizHighscore?: number;
  dailyVisitStreak?: number;
  lastVisitDate?: string; // YYYY-MM-DD format
  unlockedOffers?: Array<{ id: string; title: string; rewardCode: string; description: string; dateEarned: string }>;
  completedChallenges?: string[]; // list of challenge IDs
  role?: 'corporate' | 'cs';
  csType?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  expirationDate: string;
}

export interface WheelSector {
  label: string;
  value: string;
  color: string;
  probability: number; // Percentage chance e.g. 15 for 15%
}

export interface WheelSettings {
  spinMinCartValue: number;
  spinCostPoints: number;
  sectors: WheelSector[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  pointsReward: number;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  tag: string;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkTab?: string;
}

