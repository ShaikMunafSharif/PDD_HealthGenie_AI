import { getBaseUrl } from './api';

// In-Memory Client Cache for Mobile
const clientImageCache = new Map();

export function clearClientImageCache() {
  clientImageCache.clear();
}

/**
 * Fetch validated meal image from the backend architecture
 */
export async function fetchBackendMealImage({ mealTitle, mealType = 'lunch', description = '' }: any) {
  if (!mealTitle) return null;

  const cacheKey = `${mealTitle.toLowerCase().trim()}_${mealType.toLowerCase().trim()}`;
  if (clientImageCache.has(cacheKey)) {
    return clientImageCache.get(cacheKey);
  }

  try {
    const res = await fetch(`${getBaseUrl()}/diet/meal-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mealTitle, mealType, description })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.imageUrl) {
        clientImageCache.set(cacheKey, data);
        return data;
      }
    }
  } catch (err: any) {
    console.warn('[DietImageService] Could not connect to backend, utilizing client-side fallback:', err.message);
  }

  // Local fallback object if backend is offline
  const fallbackObj = {
    mealTitle,
    imageUrl: getFallbackImageByTitle(mealTitle, mealType),
    imageSource: 'client_fallback',
    confidence: 85,
    cached: false
  };

  return fallbackObj;
}

export function getFallbackImageByTitle(title = '', mealType = 'lunch') {
  const name = (title || '').toLowerCase();

  // 1. Primary Breakfast & Grain Dishes (Higher priority than individual fruit ingredients)
  if (name.includes('oatmeal') || name.includes('porridge') || name.includes('oats')) return 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80';
  if (name.includes('avocado toast')) return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80';
  if (name.includes('chia')) return 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80';
  if (name.includes('acai')) return 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80';
  if (name.includes('french toast')) return 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&auto=format&fit=crop&q=80';
  if (name.includes('pancake') || name.includes('waffle')) return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80';

  // 2. Eggs & Prepared Breakfast
  if (name.includes('hard-boiled') || name.includes('hard boiled') || name.includes('boiled egg')) return 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop&q=80';
  if (name.includes('omelette')) return 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80';
  if (name.includes('scramble') || name.includes('poached egg') || name.includes('egg white')) return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80';

  // 3. Shakes, Bars, Dairy & Snacks
  if (name.includes('smoothie') || name.includes('shake') || name.includes('mass gainer')) return 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80';
  if (name.includes('protein bar') || name.includes('energy bar') || name.includes('bar')) return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80';
  if (name.includes('tea')) return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80';
  if (name.includes('yogurt')) return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80';
  if (name.includes('cottage cheese')) return 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80';
  if (name.includes('nuts') || name.includes('almond') || name.includes('trail mix')) return 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&auto=format&fit=crop&q=80';
  if (name.includes('chocolate')) return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&auto=format&fit=crop&q=80';

  // 4. Mains & Entrees
  if (name.includes('chicken')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80';
  if (name.includes('turkey')) return 'https://images.unsplash.com/photo-1514944288352-fffac99f0bdf?w=800&auto=format&fit=crop&q=80';
  if (name.includes('sandwich')) return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80';
  if (name.includes('wrap') || name.includes('burrito') || name.includes('taco')) return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80';
  if (name.includes('burger')) return 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80';
  if (name.includes('salmon')) return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80';
  if (name.includes('tuna')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
  if (name.includes('cod') || name.includes('fish') || name.includes('sea bass')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80';
  if (name.includes('shrimp') || name.includes('zoodle') || name.includes('zucchini noodles')) return 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800&auto=format&fit=crop&q=80';
  if (name.includes('steak') || name.includes('beef') || name.includes('ribeye')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
  if (name.includes('tofu') || name.includes('stir-fry')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
  if (name.includes('quinoa') || name.includes('chickpea') || name.includes('bean') || name.includes('lentil salad')) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';
  if (name.includes('soup') || name.includes('stew')) return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80';
  if (name.includes('pasta') || name.includes('spaghetti')) return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80';
  if (name.includes('salad')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80';
  if (name.includes('cucumber') || name.includes('hummus') || name.includes('celery')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80';

  // 5. Individual Produce & Standalone Fruits
  if (name.includes('grapefruit')) return 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=800&auto=format&fit=crop&q=80';
  if (name.includes('apple')) return 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&auto=format&fit=crop&q=80';
  if (name.includes('banana')) return 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&auto=format&fit=crop&q=80';
  if (name.includes('berry') || name.includes('berries') || name.includes('strawberry') || name.includes('blueberry')) return 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&auto=format&fit=crop&q=80';
  if (name.includes('pineapple')) return 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&auto=format&fit=crop&q=80';

  // Category Defaults
  if (mealType === 'breakfast') return 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80';
  if (mealType === 'dinner') return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
  if (mealType === 'snack') return 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=800&auto=format&fit=crop&q=80';
  return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80';
}
