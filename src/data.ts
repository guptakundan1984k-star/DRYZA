import { Product, Inquiry, Recipe, CertInfo, StepInfo, ContestEntry, Customer, QuizQuestion, WeeklyChallenge, Banner } from './types';

export const CATEGORIES = [
  { id: 'garlic', label: 'Dehydrated Garlic' },
  { id: 'onion', label: 'Dehydrated Onion' },
  { id: 'spices', label: 'Dehydrated Spices & Chilies' },
] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'garlic-powder',
    name: 'Dehydrated Garlic Powder',
    category: 'garlic',
    categoryLabel: 'Dehydrated Garlic',
    description: 'Fine mesh, free-flowing dry garlic powder with intense natural aroma and high pungency.',
    longDescription: 'Milled from high-pungency dry garlic, our Garlic Powder provides uniform flavor distribution. Highly valued in dry spice mixtures, processed food industries due to its anti-caking properties and intense flavor concentration.',
    appearance: 'Creamy off-white, fine powder (80-100 Mesh size)',
    shelfLife: '12 Months',
    packaging: ['100g Pouch with Dual-barrier zip-lock', '25 kg Kraft Paper Bag with PE lining', 'Double corrugated carton packages'],
    applications: ['Snack seasonings', 'Bouillon cubes', 'Instant gravies', 'Spice blends', 'Sauces'],
    storage: 'Store in a cool, dry place. Always use a dry spoon. Keep away from moisture, direct sunlight and strong odour.',
    origin: 'India (Production Unit At MP, Indore)',
    qualityStandards: ['FSSAI Certified', 'ISO 22000', 'BRCGS Top Grade'],
    stockTons: 24.0,
    pricePerKgRange: '₹3.80 - ₹4.65',
    isPopular: true,
    image: 'garlic',
    netWt: '100g',
    mrp: '₹121',
    ingredientsText: '100% Dehydrated Garlic Powder.',
    nutritionFacts: {
      energy: '331 kcal',
      protein: '16.6 g',
      carbohydrate: '72.7 g',
      totalSugars: '2.4 g',
      addedSugars: '0 g',
      dietaryFiber: '9.0 g',
      totalFat: '0.7 g',
      saturatedFat: '0.1 g',
      transFat: '0 g',
      cholesterol: '0 mg',
      sodium: '60 mg',
      calcium: '79 mg',
      iron: '5.7 mg',
      potassium: '1193 mg'
    }
  },
  {
    id: 'onion-powder',
    name: 'Dehydrated Onion Powder',
    category: 'onion',
    categoryLabel: 'Dehydrated Onion',
    description: 'Sweet, flavorful red onion powder that acts as an invisible umami foundational element.',
    longDescription: 'Our industrial-grade Onion Powder dissolves instantly in culinary bases, delivering heavy umami onion flavor. An exceptional clean-label compound ideal for manufacturers wanting smooth texture.',
    appearance: 'Creamy light-greyish to light yellow fine powder (80-100 mesh)',
    shelfLife: '12 Months',
    packaging: ['100g Pouch with Dual-barrier zip-lock', '25 kg Kraft bags with multi-layer barrier films', 'Tightly sealed steel B2B drums'],
    applications: ['Instant snack foods', 'Cured meats', 'Ketchup and BBQ sauces', 'Cheese & Onion spice blends'],
    storage: 'Store in a cool, dry place. Always use a dry spoon. Keep away from moisture, direct sunlight and strong odour.',
    origin: 'India (Production Unit At MP, Indore)',
    qualityStandards: ['FSSAI Certified', 'BRCGS Top Grade', 'HALAL'],
    stockTons: 40.0,
    pricePerKgRange: '₹3.10 - ₹3.95',
    isPopular: true,
    image: 'onion',
    netWt: '100g',
    mrp: '₹120',
    ingredientsText: '100% Dehydrated Onion Powder.',
    nutritionFacts: {
      energy: '341 kcal',
      protein: '9.2 g',
      carbohydrate: '75.8 g',
      totalSugars: '18.7 g',
      dietaryFiber: '14.5 g',
      totalFat: '1.3 g',
      saturatedFat: '0.2 g',
      transFat: '0 g',
      cholesterol: '0 mg',
      sodium: '52 mg'
    }
  },
  {
    id: 'tomato-powder',
    name: 'Dehydrated Tomato Powder',
    category: 'spices',
    categoryLabel: 'Dehydrated Spices & Chilies',
    description: '100% pure dehydrated tomato powder with a rich, tangy crimson profile.',
    longDescription: 'Constructed from fully ripe, deep red tomatoes. Yields instant liquid tomato paste or sauce when blended with warm water. Packed with lycopene, featuring a naturally high-glutamate tomato savory profile.',
    appearance: 'Fine red to orange-red powder with delicious acidic-fruity aroma',
    shelfLife: '12 Months',
    packaging: ['100g Pouch with Dual-barrier zip-lock', '20 kg Aluminum vacuum foil packs inside carton blocks'],
    applications: ['Instant tomato soup', 'Chips coatings', 'Pasta sauces', 'Salad dressings', 'Ready-to-eat baby food'],
    storage: 'Store in a cool, dry place. Always use a dry spoon. Keep away from moisture, direct sunlight and strong odour.',
    origin: 'India (Production Unit At MP, Indore)',
    qualityStandards: ['FSSAI Certified', 'BRCGS Top Grade', 'HACCP Standard'],
    stockTons: 11.0,
    pricePerKgRange: '₹5.50 - ₹7.20',
    isPopular: true,
    image: 'tomato',
    netWt: '100g',
    mrp: '₹238',
    ingredientsText: '100% Dehydrated Tomato Powder.',
    nutritionFacts: {
      energy: '358 kcal',
      protein: '14.1 g',
      carbohydrate: '63.5 g',
      totalSugars: '28.7 g',
      addedSugars: '0 g',
      dietaryFiber: '22.9 g',
      totalFat: '1.4 g',
      saturatedFat: '0.2 g',
      transFat: '0 g',
      cholesterol: '0 mg',
      sodium: '88 mg',
      calcium: '124 mg',
      iron: '7.0 mg',
      potassium: '2360 mg'
    }
  },
  {
    id: 'ginger-powder',
    name: 'Dehydrated Ginger Powder',
    category: 'spices',
    categoryLabel: 'Dehydrated Spices & Chilies',
    description: 'Hot, spicy ginger powder processed from handpicked washed rhizomes.',
    longDescription: 'High-purity dehydrated ginger containing rich gingerol oils. Extremely beneficial for winter beverages, tea blends, bakery operations, and therapeutic seasoning blends.',
    appearance: 'Pale yellow, fine ground fibrous powder',
    shelfLife: '12 Months',
    packaging: ['100g Pouch with Dual-barrier zip-lock', '25 kg laminated woven bags', 'Bulk paper sacks with high isolation barrier film'],
    applications: ['Gingerbread baking', 'Herbal teas', 'Chai masala mix', 'Asian stir-fry industrial sauces'],
    storage: 'Store in a cool, dry place. Always use a dry spoon. Keep away from moisture, direct sunlight and strong odour.',
    origin: 'India (Production Unit At MP, Indore)',
    qualityStandards: ['FSSAI Certified', 'ISO 22000', 'Non-GMO Certified'],
    stockTons: 15.0,
    pricePerKgRange: '₹4.20 - ₹5.50',
    image: 'ginger',
    netWt: '100g',
    mrp: '₹249',
    ingredientsText: '100% Dehydrated Ginger Powder.',
    nutritionFacts: {
      energy: '335 kcal',
      protein: '9.0 g',
      carbohydrate: '71.6 g',
      totalSugars: '3.4 g',
      dietaryFiber: '14.1 g',
      totalFat: '4.2 g',
      saturatedFat: '2.6 g',
      transFat: '0 g',
      cholesterol: '0 mg',
      sodium: '27 mg',
      calcium: '114 mg',
      iron: '19.8 mg',
      potassium: '1320 mg'
    }
  },
  {
    id: 'lemon-powder',
    name: 'Dehydrated Lemon Powder',
    category: 'spices',
    categoryLabel: 'Dehydrated Spices & Chilies',
    description: 'Highly aromatic, zesty dehydrated lemon powder ideal for flavor enhancement and beverages.',
    longDescription: 'Manufactured from selected, mature, clean Indian lemons. Gently dehydrated under continuous belt dryers to retain high volatile vitamin C acidity, zesty aroma and crisp color profile.',
    appearance: 'Off-white to light yellow fine powder',
    shelfLife: '12 Months',
    packaging: ['50g Pouch with Dual-barrier zip-lock', 'Bulk packaging on demand'],
    applications: ['Tangy beverages', 'Salad dressings', 'Snack coatings', 'Bakery products', 'Confectioneries'],
    storage: 'Store in a cool, dry place. Always use a dry spoon. Keep away from moisture, direct sunlight and strong odour.',
    origin: 'India (Production Unit At MP, Indore)',
    qualityStandards: ['FSSAI Certified', 'BRCGS Top Grade', 'HACCP Standard'],
    stockTons: 12.5,
    pricePerKgRange: '₹4.50 - ₹6.20',
    image: 'lemon',
    netWt: '50g',
    mrp: '₹60',
    ingredientsText: '100% Dehydrated Lemon Powder.',
    nutritionFacts: {
      energy: '320 kcal',
      protein: '6.8 g',
      carbohydrate: '75.5 g',
      totalSugars: '18.5 g',
      dietaryFiber: '12.5 g',
      totalFat: '1.5 g',
      saturatedFat: '0.2 g',
      transFat: '0 g',
      cholesterol: '0 mg',
      sodium: '12 mg',
      calcium: '126 mg',
      iron: '2.8 mg',
      potassium: '980 mg'
    }
  },
  {
    id: 'green-chilli-powder',
    name: 'Dehydrated Green Chilli Powder',
    category: 'spices',
    categoryLabel: 'Dehydrated Spices & Chilies',
    description: 'Naturally bright light-green, intensely hot and spicy ground green chilli powder.',
    longDescription: 'Selected fresh hot green chillies are washed, sliced, dehydrated swiftly under temperature control to keep the chlorophyll green color and capsaicin heat values fully intact.',
    appearance: 'Ground light-green powder',
    shelfLife: '12 Months',
    packaging: ['50g Pouch with Dual-barrier zip-lock', '15 kg bags with dual nitrogen flushing'],
    applications: ['Pungent snacks', 'Mexican / Asian seasoning', 'Instant noodle tastemaker packets', 'Canned pickles'],
    storage: 'Store in a cool, dry place. Always use a dry spoon. Keep away from moisture, direct sunlight and strong odour.',
    origin: 'India (Production Unit At MP, Indore)',
    qualityStandards: ['FSSAI Certified', 'ISO 22000', 'ASTA Grade Quality'],
    stockTons: 8.8,
    pricePerKgRange: '₹6.00 - ₹7.80',
    isPopular: true,
    image: 'green_chilli',
    netWt: '50g',
    mrp: '₹80',
    ingredientsText: '100% Dehydrated Green Chilli Powder.',
    nutritionFacts: {
      energy: '282 kcal',
      protein: '12.0 g',
      carbohydrate: '56.0 g',
      totalSugars: '8.5 g',
      dietaryFiber: '27.0 g',
      totalFat: '4.5 g',
      saturatedFat: '0.8 g',
      transFat: '0 g',
      cholesterol: '0 mg',
      sodium: '30 mg',
      calcium: '120 mg',
      iron: '6.5 mg',
      potassium: '1450 mg'
    }
  }
];

export const CERTIFICATIONS: CertInfo[] = [
  {
    name: 'FSSAI License 21126180000120',
    authority: 'Food Safety and Standards Authority of India',
    validUntil: 'FSSAI Approved Manufacturer',
    certifiedFor: 'Dehydrated Food Products & Spices Processing',
    description: 'Official licensure guarantees absolute adherence to hygiene, safe ingredient practices, and chemical testing standards under Indian regulatory mandates.',
    logoText: 'FSSAI'
  },
  {
    name: 'ISO 22000:2018',
    authority: 'SGS International Certification Services',
    validUntil: 'December 2028',
    certifiedFor: 'Food Safety Management Systems (FSMS)',
    description: 'Verifies Dryza Spices implements rigorous risk assessment and safety control points from sourcing to transit delivery.',
    logoText: 'ISO 22000'
  },
  {
    name: 'BRCGS Global Standard',
    authority: 'British Retail Consortium Global Standards',
    validUntil: 'April 2027',
    certifiedFor: 'Food Safety (Grade AA Certified)',
    description: 'The global gold standard in food safety, confirming exceptional hygienic performance, allergen control, and trace capability.',
    logoText: 'BRCGS'
  },
  {
    name: 'HACCP Certified',
    authority: 'Intertek Assurance Services',
    validUntil: 'October 2028',
    certifiedFor: 'Hazard Analysis Critical Control Point',
    description: 'Ensures systematic prevention of chemical, biological, and physical hazards across our entire product manufacturing chain.',
    logoText: 'HACCP'
  }
];

export const MANUFACTURING_STEPS: StepInfo[] = [
  {
    step: 1,
    title: 'Sourcing & Smart Multi-Tier Sorting',
    description: 'Sourcing clean, pesticide-safe fresh crops from verified farms.',
    details: [
      'Strict lab verification of pesticide residual and heavy metal values prior to unloading at plant.',
      'Manual sorting to separate spoiled or underripe crops under strict QA supervision.'
    ],
    iconName: 'ShieldCheck'
  },
  {
    step: 2,
    title: 'High-Velocity Hydro-Washing & Peeling',
    description: 'Hygienically cleaning harvested elements utilizing ozone-infused micro-bubble washers.',
    details: [
      'Multi-stage dirt clearing to remove soil particles.',
      'Natural compressed air peeling for garlic and onions to avoid unnecessary water absorption.'
    ],
    iconName: 'Droplets'
  },
  {
    step: 3,
    title: 'Advanced Low-Temp Continuous Dehydration',
    description: 'Gently drying ingredients while completely locking in precious flavor oil compounds.',
    details: [
      'Modern automated belt dryer tunnels with computer-regulated dual air zone temperatures.',
      'Dehydration conducted at optimal low heat thresholds to preserve volatile sulfides and natural color.'
    ],
    iconName: 'Flame'
  },
  {
    step: 4,
    title: 'X-Ray Safety & Metal Detection',
    description: 'An ironclad guarantee of premium item purity under zero-contamination guidelines.',
    details: [
      'Optical color sorters extract off-color flakes and external specks.',
      'Continuous passage through highly sensitive Ferrum, Non-Ferrum, and Stainless Steel detection arches.'
    ],
    iconName: 'Eye'
  },
  {
    step: 5,
    title: 'Milling & Controlled In-House Granulation',
    description: 'Customizing size attributes ranging from high-finesse flour powder to specified mesh grades.',
    details: [
      'Temperature-monitored grinding mill prevents thermal damage during pulverization.',
      'Classification vibrating screen shakers isolate exact mesh ratios specified by corporate B2B contracts.'
    ],
    iconName: 'Settings'
  },
  {
    step: 6,
    title: 'Dual-Barrier Nitrogen-Flush Kraft Bagging',
    description: 'Locking premium quality ingredients inside atmospheric-controlled bulk packing.',
    details: [
      'Packing inside durable Kraft pouches with dual LDPE heat-sealed inner liners.',
      'Protects ingredients perfectly against tropical maritime winds and high humidity.'
    ],
    iconName: 'Package'
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 'noodle-seasoning',
    title: 'Instant Umami Ramen Soup Base',
    description: 'Build a premium commercial sachet noodle seasoning blend using dry powders and vegetable flakes.',
    prepTime: '10 Mins',
    servings: 100,
    ingredients: [
      '400g Dryza Onion Powder',
      '300g Dryza Garlic Powder',
      '150g Fine Sea Salt',
      '50g Dryza Ginger Powder',
      '30g Dehydrated Green Chilli Powder',
      '10g Ground White Pepper'
    ],
    instructions: [
      'Combine Onion Powder and Garlic Powder in a large dry laboratory mixing bowl.',
      'Sift with sea salt to ensure continuous uniform color-texture distribution.',
      'Stir in the dehydrated green chilli and ginger powder carefully.',
      'Store in gas-tight containers. Use 10-12 grams of this seasoning mix per serving of instant ramen.'
    ],
    dryzaIngredients: ['Dehydrated Onion Powder', 'Dehydrated Garlic Powder', 'Dehydrated Green Chilli Powder', 'Dehydrated Ginger Powder'],
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=600'
  }
];

export const INDUSTRIES_SERVED = [
  {
    title: 'Instant Foods & Ready-to-Eat',
    description: 'Crucial ingredients for instant noodles, cup soups, dehydrated rice premixes, and oatmeal meals. Our items hydrate within 3 minutes in boiled water.',
    icon: 'Activity',
    matchRatio: '98% rehydration rate'
  },
  {
    title: 'Snack Foods & Seasoning Houses',
    description: 'Supplying precise mesh sizing powders (Onion, Garlic, Chilli, Ginger) for coating potato chips, popped snacks, peanuts, and dry gourmet retail seasonings.',
    icon: 'Sparkles',
    matchRatio: 'Custom dry blending'
  },
  {
    title: 'Hotels, Restaurants & Catering (HORECA)',
    description: 'Supplying bulky packs to hotel back-kitchens, catering operators, and global burger franchises. Keeps menu taste uniform 365 days a year with zero kitchen waste.',
    icon: 'ChefHat',
    matchRatio: 'Saves 40% prep labor cost'
  }
];

export const SEED_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-4209',
    productIds: ['garlic-powder', 'onion-powder'],
    productNames: ['Dehydrated Garlic Powder', 'Dehydrated Onion Powder'],
    companyName: 'Apex Seasoning Industries',
    fullName: 'David Vance',
    email: 'purchasing@apexseasoning.com',
    phone: '+1 (555) 019-3243',
    country: 'United States',
    customerType: 'seasoning_brand',
    estimatedQuantityKg: 5000,
    message: 'Seeking a continuous container-load supplier for high-mesh density garlic and onion powders. Please provide current lead times for 5 Metric Tons shipment CIF Port of Houston.',
    status: 'Ordered',
    submittedAt: '2026-06-05T14:12:00Z',
    attachmentName: 'SpecSheet_Requirements.pdf',
    adminNotes: 'Initial contact. Wants premium grade packaging.'
  },
  {
    id: 'INQ-4112',
    productIds: ['tomato-powder'],
    productNames: ['Dehydrated Tomato Powder'],
    companyName: 'Vikas Instant Foods Pvt Ltd',
    fullName: 'Sanjay Nair',
    email: 'snair@vikasfoods.co.in',
    phone: '+91 98230 45432',
    country: 'India',
    customerType: 'manufacturer',
    estimatedQuantityKg: 2500,
    message: 'We are looking for Premium Tomato Powder with rich crimson color to formulate tomato instant cup soup base. Delivery to our Nagpur plant.',
    status: 'Processed',
    submittedAt: '2026-06-04T09:30:00Z',
    adminNotes: 'Sent sample from batch #T-230. Awaiting laboratory trial confirmation.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    question: 'Under what parameters must our Premium Garlic & Onion powders be processed to prevent caking and optimize shelf life?',
    options: [
      'Under 10.0%',
      'Under 5.0% - 6.0%',
      'Under 15.0%',
      'No limit (completely wet)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Dryza Spices utilizes continuous fluid-bed thermal dryers and humidity controls to ensure high-stability, preventing caking and preserving valuable volatile volatile contents.',
    pointsReward: 50
  },
  {
    id: 'quiz-2',
    question: 'What is the primary drying technology for conserving volatile gingerol and sulfites in Dryza ginger and onion processing?',
    options: [
      'Open sun-drying under simple atmospheric humidity',
      'Continuous-Belt Multistage Tunnel Dryers with precise humidity control',
      'High-speed microwave cookers',
      'Deep oil immersion frying'
    ],
    correctAnswerIndex: 1,
    explanation: 'Multistage tunnel dryers carefully regulate convection currents, gently driving water off while locking in delicate heat and aromatic oils for premium taste.',
    pointsReward: 50
  }
];

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'chall-1',
    title: 'The Master Seasoner',
    description: 'Create a Dry Rub using at least 3 Dryza Spices (e.g. Tomato Powder, Garlic, and Onion Powder) on any protein or vegetable, and upload a beautiful photo.',
    pointsReward: 150,
    tag: 'SPICE RUB Challenge'
  }
];

export const SEED_CONTEST_ENTRIES: ContestEntry[] = [
  {
    id: 'entry-1',
    customerName: 'Aarav Mehta',
    companyName: 'Mehta Catering Services',
    customerEmail: 'aarav@mehtafoods.com',
    dishName: 'Premium Dehydrated Tomato Powder Crust Bruschetta',
    image: 'https://images.unsplash.com/photo-1572448862527-d3c904757de6?auto=format&fit=crop&q=80&w=600',
    votesCount: 42,
    submittedAt: '2026-06-03T10:00:00Z',
    status: 'winner',
    weeklyWinnerRank: '🏆 1st Winner (Weekly Gold Medal)',
    votedUserEmails: []
  }
];

export const SEED_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200',
    title: 'Direct-from-Source Dryza Dehydrated Spices',
    subtitle: '100% natural, certified, zero-impurity dry powders engineered for commercial food systems.',
    linkTab: 'catalogue'
  }
];
