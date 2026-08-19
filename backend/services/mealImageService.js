import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CACHE_FILE = path.join(DATA_DIR, 'meal_image_cache.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory & File Cache Storage
let mealCache = new Map();

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      const data = JSON.parse(raw);
      for (const [key, value] of Object.entries(data)) {
        mealCache.set(key, value);
      }
      console.log(`[MealImageService] Loaded ${mealCache.size} cached meal image records.`);
    }
  } catch (err) {
    console.warn('[MealImageService] Warning reading cache file:', err.message);
  }
}

function saveCache() {
  try {
    const obj = {};
    for (const [key, value] of mealCache.entries()) {
      obj[key] = value;
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (err) {
    console.warn('[MealImageService] Warning saving cache file:', err.message);
  }
}

// Load on startup
loadCache();

export function getMealHashId(title, mealType = '') {
  const str = `${(title || '').toLowerCase().trim()}_${(mealType || '').toLowerCase().trim()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `meal_img_${Math.abs(hash)}`;
}

// Extract ingredients and cooking style from description
export function extractMealDetails(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  
  const ingredientKeywords = [
    'oatmeal', 'oats', 'peanut butter', 'banana', 'protein powder', 'berries', 'honey', 'almonds',
    'egg', 'egg white', 'spinach', 'chia', 'almond milk', 'avocado', 'chickpeas', 'quinoa',
    'turkey', 'sweet potato', 'green beans', 'chicken', 'salmon', 'cod', 'fish', 'tofu',
    'beef', 'sirloin', 'steak', 'pancakes', 'french toast', 'waffles', 'yogurt', 'cottage cheese',
    'pineapple', 'cucumber', 'hummus', 'lentil', 'shrimp', 'zucchini', 'meatballs', 'mushroom',
    'chocolate', 'rice', 'beans', 'asparagus', 'sauce', 'pasta'
  ];

  const foundIngredients = ingredientKeywords.filter(ing => text.includes(ing));

  let style = 'fresh & healthy';
  if (text.includes('grilled')) style = 'grilled';
  else if (text.includes('baked')) style = 'baked';
  else if (text.includes('poached')) style = 'poached';
  else if (text.includes('scrambled') || text.includes('scramble')) style = 'scrambled';
  else if (text.includes('smoothie') || text.includes('shake')) style = 'blended smoothie';
  else if (text.includes('roasted')) style = 'roasted';

  let cuisine = 'modern healthy';
  if (text.includes('mediterranean')) cuisine = 'mediterranean';
  else if (text.includes('caesar')) cuisine = 'classic caesar';
  else if (text.includes('carbonara')) cuisine = 'italian';
  else if (text.includes('burrito') || text.includes('taco')) cuisine = 'mexican style';

  return {
    ingredients: foundIngredients.length > 0 ? foundIngredients : [title],
    cookingStyle: style,
    cuisine
  };
}

// Generate Rich Prompt according to prompt engineering specification
export function generateRichImagePrompt(mealTitle, mealType, description = '') {
  const details = extractMealDetails(mealTitle, description);
  const ingString = details.ingredients.join(', ');
  
  return `A realistic healthy ${mealType} dish consisting of ${mealTitle}, containing ${ingString}, ${details.cookingStyle} preparation, ${details.cuisine} style, food photography, soft natural lighting, 4k quality`;
}

// SEMANTIC VALIDATION ENGINE (Confidence checklist)
export function validateMealImage(mealTitle, mealType, imageUrl, imageSource = '') {
  const titleLower = (mealTitle || '').toLowerCase();
  const typeLower = (mealType || '').toLowerCase();
  const urlLower = (imageUrl || '').toLowerCase();

  let confidence = 90;
  let rejectionReason = null;

  // Negative Check 1: Breakfast vs Heavy dinner items
  const isBreakfast = typeLower === 'breakfast' || titleLower.includes('oatmeal') || titleLower.includes('pancake') || titleLower.includes('toast') || titleLower.includes('cereal') || titleLower.includes('chia');
  if (isBreakfast) {
    if (urlLower.includes('steak') || urlLower.includes('burger') || urlLower.includes('pizza') || urlLower.includes('curry') || urlLower.includes('knead-dough')) {
      confidence = 10;
      rejectionReason = 'Breakfast meal matched with heavy dinner item (steak/burger/pizza/dough)';
    }
  }

  // Negative Check 2: Salad vs Pizza/Burger/Steak
  if (titleLower.includes('salad')) {
    if (urlLower.includes('pizza') || urlLower.includes('burger') || urlLower.includes('pancake') || urlLower.includes('waffle')) {
      confidence = 15;
      rejectionReason = 'Salad matched with pizza/burger/sweet dessert';
    }
  }

  // Negative Check 3: Smoothie vs Meat/Chicken/Pizza
  if (titleLower.includes('smoothie') || titleLower.includes('shake')) {
    if (urlLower.includes('chicken') || urlLower.includes('steak') || urlLower.includes('pizza') || urlLower.includes('burger') || urlLower.includes('salad')) {
      confidence = 15;
      rejectionReason = 'Smoothie/shake matched with solid meat or savory dish';
    }
  }

  // Negative Check 4: Steak/Beef vs Oatmeal/Fruit/Dessert
  if (titleLower.includes('steak') || titleLower.includes('beef') || titleLower.includes('ribeye')) {
    if (urlLower.includes('oatmeal') || urlLower.includes('smoothie') || urlLower.includes('pancake') || urlLower.includes('chia')) {
      confidence = 10;
      rejectionReason = 'Steak/Beef matched with sweet breakfast cereal';
    }
  }

  // Negative Check 5: Fish/Salmon vs Pancakes/Breakfast
  if (titleLower.includes('salmon') || titleLower.includes('cod') || titleLower.includes('fish') || titleLower.includes('shrimp')) {
    if (urlLower.includes('pancake') || urlLower.includes('waffle') || urlLower.includes('dough')) {
      confidence = 20;
      rejectionReason = 'Seafood matched with breakfast pastry/dough';
    }
  }

  const isValid = confidence >= 80;
  return { isValid, confidence, rejectionReason };
}

// Curated Semantic Verified High-Quality Food Database Map (Dish-first priority hierarchy)
const SEMANTIC_FOOD_DATABASE = [
  // 1. Specific Breakfast & Grain Dishes
  {
    keywords: ['oatmeal', 'oats', 'porridge'],
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    title: 'Nutritious Bowl of Oatmeal with Fruits & Nuts'
  },
  {
    keywords: ['avocado toast'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    title: 'Avocado Toast with Sunny Side Egg'
  },
  {
    keywords: ['chia', 'chia seed'],
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80',
    title: 'Chia Seed Pudding Jar with Berries'
  },
  {
    keywords: ['acai', 'acai bowl'],
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80',
    title: 'Acai Smoothie Bowl with Granola & Banana'
  },
  {
    keywords: ['french toast'],
    imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop&q=80',
    title: 'Golden French Toast Stack with Berries'
  },
  {
    keywords: ['pancake', 'pancakes', 'waffles'],
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80',
    title: 'Whole Grain Pancakes with Syrup'
  },
  {
    keywords: ['omelette', 'spinach omelette', 'egg omelette'],
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80',
    title: 'Spinach & Veggie Egg Omelette'
  },
  {
    keywords: ['hard-boiled', 'hard boiled', 'boiled egg', 'boiled eggs'],
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop&q=80',
    title: 'Nutritious Hard-Boiled Eggs'
  },
  {
    keywords: ['poached egg', 'poached eggs', 'scramble', 'scrambled', 'egg white', 'egg whites'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    title: 'Poached & Scrambled Eggs'
  },

  // 2. Specific Main Meal Dishes & Formats
  {
    keywords: ['pasta', 'carbonara', 'spaghetti'],
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    title: 'Delicious Italian Pasta Bowl'
  },
  {
    keywords: ['burger', 'veggie burger'],
    imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80',
    title: 'Gourmet Veggie Burger on Whole Wheat Bun'
  },
  {
    keywords: ['sandwich', 'turkey club'],
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80',
    title: 'Whole Wheat Turkey Club Sandwich'
  },
  {
    keywords: ['wrap', 'burrito', 'taco', 'lettuce wrap'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Grilled Chicken Wrap'
  },
  {
    keywords: ['soup', 'lentil soup', 'stew'],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80',
    title: 'Hearty Bowl of Hot Lentil Soup'
  },
  {
    keywords: ['caesar', 'salad', 'greens'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    title: 'Crispy Fresh Salad Bowl'
  },
  {
    keywords: ['quinoa', 'chickpea', 'lentil salad', 'bean salad'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    title: 'Nutritious Quinoa Chickpea Salad Bowl'
  },
  {
    keywords: ['tofu', 'stir-fry'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    title: 'Pan-Seared Tofu Vegetable Stir-Fry'
  },

  // 3. Primary Protein / Meat / Seafood Cuts
  {
    keywords: ['salmon'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    title: 'Pan-Seared Salmon Fillet with Vegetables'
  },
  {
    keywords: ['tuna', 'tuna salad'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Tuna Bowl'
  },
  {
    keywords: ['baked fish', 'white fish', 'cod', 'fish', 'sea bass'],
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
    title: 'Oven-Baked White Fish Fillet with Herbs'
  },
  {
    keywords: ['shrimp', 'zoodle', 'zucchini noodles'],
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800&auto=format&fit=crop&q=80',
    title: 'Grilled Shrimp with Zucchini Noodles'
  },
  {
    keywords: ['steak', 'ribeye', 'sirloin', 'beef'],
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    title: 'Grilled Sirloin Steak with Roasted Asparagus'
  },
  {
    keywords: ['chicken breast', 'grilled chicken', 'chicken bowl', 'chicken'],
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80',
    title: 'Grilled Chicken Breast with Vegetables'
  },
  {
    keywords: ['turkey meatballs', 'turkey breast', 'turkey'],
    imageUrl: 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?w=800&auto=format&fit=crop&q=80',
    title: 'Lean Oven-Roasted Turkey Breast'
  },

  // 4. Specific Fruit & Produce Snacks
  {
    keywords: ['grapefruit'],
    imageUrl: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Grapefruit Halves'
  },
  {
    keywords: ['apple', 'apples'],
    imageUrl: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Red Apple Slices'
  },
  {
    keywords: ['banana', 'bananas'],
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Ripe Bananas'
  },
  {
    keywords: ['berry', 'berries', 'strawberry', 'strawberries', 'blueberry', 'blueberries'],
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Mixed Berries'
  },
  {
    keywords: ['pineapple'],
    imageUrl: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Sliced Pineapple'
  },
  {
    keywords: ['cucumber', 'hummus', 'celery', 'celery sticks'],
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Cucumber Slices & Veggie Hummus Dip'
  },

  // 5. Dairy, Nuts, Shakes & Snacks
  {
    keywords: ['protein bar', 'energy bar', 'mass gainer shake or protein bar', 'bar'],
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    title: 'Nutritious Protein Bar'
  },
  {
    keywords: ['smoothie', 'protein shake', 'shake'],
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Fruit Protein Smoothie Glass'
  },
  {
    keywords: ['tea', 'green tea'],
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    title: 'Hot Green Tea Cup with Almonds'
  },
  {
    keywords: ['yogurt', 'greek yogurt'],
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    title: 'Creamy Greek Yogurt with Honey'
  },
  {
    keywords: ['cottage cheese'],
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80',
    title: 'Fresh Cottage Cheese Bowl with Fruits'
  },
  {
    keywords: ['nuts', 'almonds', 'walnuts', 'trail mix', 'mixed nuts'],
    imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&auto=format&fit=crop&q=80',
    title: 'Bowl of Premium Mixed Roasted Nuts'
  },
  {
    keywords: ['chocolate'],
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80',
    title: 'Dark Chocolate Squares with Nuts'
  }
];

// MAIN ARCHITECTURAL IMAGE RESOLUTION ENGINE
export async function getValidatedMealImageRecord({ mealTitle, mealType = 'lunch', description = '' }) {
  const mealId = getMealHashId(mealTitle, mealType);

  // Priority 1: Check Cache (File/Memory)
  if (mealCache.has(mealId)) {
    const cachedRecord = mealCache.get(mealId);
    // Validate that the cached image still passes quality checks
    const val = validateMealImage(mealTitle, mealType, cachedRecord.imageUrl, cachedRecord.imageSource);
    if (val.isValid) {
      return {
        ...cachedRecord,
        cached: true
      };
    }
  }

  // Generate Rich Prompt
  const imagePrompt = generateRichImagePrompt(mealTitle, mealType, description);
  const details = extractMealDetails(mealTitle, description);

  let selectedImageUrl = null;
  let source = 'fallback';
  let confidenceScore = 95;

  // Priority 2: Match against Curated Semantic Verified Database
  const titleLower = mealTitle.toLowerCase();
  const matchedEntry = SEMANTIC_FOOD_DATABASE.find(entry => 
    entry.keywords.some(kw => titleLower.includes(kw))
  );

  if (matchedEntry) {
    selectedImageUrl = matchedEntry.imageUrl;
    source = 'semantic_verified_database';
    confidenceScore = 98;
  }

  // Priority 3: External Unsplash Search Query (if unsplash or dynamic query requested)
  if (!selectedImageUrl && process.env.UNSPLASH_ACCESS_KEY) {
    try {
      const q = encodeURIComponent(`${mealTitle} food`);
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${q}&per_page=1&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const candUrl = data.results[0].urls.regular;
          const val = validateMealImage(mealTitle, mealType, candUrl, 'unsplash_api');
          if (val.isValid) {
            selectedImageUrl = candUrl;
            source = 'unsplash_api';
            confidenceScore = val.confidence;
          }
        }
      }
    } catch (err) {
      console.warn('[MealImageService] Unsplash API fetch error:', err.message);
    }
  }

  // Priority 4: Fallback Meal-Type Specific High Quality Photo
  if (!selectedImageUrl) {
    if (mealType === 'breakfast') {
      selectedImageUrl = 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&auto=format&fit=crop&q=80';
    } else if (mealType === 'lunch') {
      selectedImageUrl = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80';
    } else if (mealType === 'dinner') {
      selectedImageUrl = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
    } else {
      selectedImageUrl = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&auto=format&fit=crop&q=80';
    }
    source = 'meal_type_fallback';
    confidenceScore = 90;
  }

  // Construct Final Validated Database Record
  const newRecord = {
    mealId,
    mealTitle,
    description: description || mealTitle,
    ingredients: details.ingredients,
    mealCategory: mealType,
    mealType,
    imagePrompt,
    imageUrl: selectedImageUrl,
    imageSource: source,
    confidence: confidenceScore,
    cached: true,
    createdAt: new Date().toISOString()
  };

  // Save to Memory and File Cache
  mealCache.set(mealId, newRecord);
  saveCache();

  return newRecord;
}
