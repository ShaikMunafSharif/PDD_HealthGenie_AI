import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import { GlassCard, GlassButton, ProgressRing, PageTransition, SectionHeader } from '../../components/ui/Components';
import ValidatedMealImage from '../../components/ui/ValidatedMealImage';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const getRecipe = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('salad') || lowerName.includes('wrap') || lowerName.includes('bowl')) {
    return [
      'Wash and prepare mixed greens, vegetables, and selected toppings.',
      'Prepare protein source (e.g. grill chicken/tofu or boil eggs) and slice.',
      'Toss all ingredients together with a light vinaigrette or olive oil.',
      'Portion out and serve fresh.'
    ];
  }
  if (lowerName.includes('oatmeal') || lowerName.includes('pudding') || lowerName.includes('toast') || lowerName.includes('pancakes')) {
    return [
      'Prepare base grains, bread, or batter (e.g. oatmeal, sourdough, pancake mix).',
      'Cook or toast the base until perfectly warm and golden.',
      'Assemble with healthy toppings (berries, sliced banana, nuts, or avocado).',
      'Serve warm immediately.'
    ];
  }
  return [
    'Season protein or grains with a pinch of salt, pepper, and herbs.',
    'Cook on a medium-hot pan or grill with 1 tsp of olive oil.',
    'Steam or roast seasonal vegetables as a side dish.',
    'Plate everything and serve with a fresh squeeze of lemon.'
  ];
};

export default function MealDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { mealName, mealType, cals } = location.state || { 
    mealName: 'Grilled Chicken Salad', 
    mealType: 'lunch', 
    cals: 450 
  };

  const calories = cals;
  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.45) / 4);
  const fat = Math.round((calories * 0.25) / 9);

  const nutritionData = { 
    calories, 
    protein, 
    carbs, 
    fat, 
    fiber: Math.round(calories * 0.015), 
    sugar: Math.round(calories * 0.025), 
    sodium: Math.round(calories * 0.9) 
  };

  const recipe = getRecipe(mealName);

  const [swappedMeal, setSwappedMeal] = useState('');
  const [swapping, setSwapping] = useState(false);

  const handleSwap = async () => {
    setSwapping(true);
    setSwappedMeal('');
    
    const statusCheck = await checkOllamaStatus();
    if (!statusCheck.available) {
      setSwapping(false);
      
      const altCal = Math.round(calories * 0.95);
      const altP = Math.round((altCal * 0.28) / 4);
      const altC = Math.round((altCal * 0.48) / 4);
      const altF = Math.round((altCal * 0.24) / 9);
      
      setSwappedMeal(`**Recommending a Healthy Meal Swap:**\n\n**Sesame Tofu & Veggie Stir-Fry**\n- Calories: ${altCal} kcal\n- Protein: ${altP}g\n- Carbs: ${altC}g\n- Fat: ${altF}g\n\n*Preparation Steps:*\n1. Cube and pan-sear tofu with sesame oil.\n2. Add snap peas, broccoli, and bell peppers.\n3. Stir in soy-ginger sauce and serve warm.`);
      return;
    }
    
    const prompt = `Suggest one healthy alternative to ${mealName} (${calories} kcal, Protein: ${protein}g, Carbs: ${carbs}g, Fat: ${fat}g). Provide:\n1. Meal Name\n2. Nutrition breakdown (calories, protein, carbs, fat)\n3. 3-4 simple preparation steps. Keep it brief.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'diet')) {
        setSwappedMeal(chunk.full);
        setSwapping(false);
      }
    } catch {
      const altCal = Math.round(calories * 0.95);
      const altP = Math.round((altCal * 0.28) / 4);
      const altC = Math.round((altCal * 0.48) / 4);
      const altF = Math.round((altCal * 0.24) / 9);
      setSwappedMeal(`**Recommending a Healthy Meal Swap:**\n\n**Sesame Tofu & Veggie Stir-Fry**\n- Calories: ${altCal} kcal\n- Protein: ${altP}g\n- Carbs: ${altC}g\n- Fat: ${altF}g`);
    } finally {
      setSwapping(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 940, margin: '0 auto' }}>
        <SectionHeader eyebrow="RECIPE & MACROS" title={mealName} subtitle={`Healthy ${mealType} option — ${calories} kcal`} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
          {/* Recipe Card */}
          <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ width: '100%', height: 210, borderRadius: 16, overflow: 'hidden', position: 'relative', background: '#F1F5F9', marginBottom: 18 }}>
              <ValidatedMealImage mealTitle={mealName} mealType={mealType} description={mealName} alt={mealName} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', marginBottom: 14, fontFamily: 'Inter' }}>Preparation Instructions</h3>
            {recipe.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <span style={{ color: '#2563EB', fontSize: '0.85rem', width: 22, flexShrink: 0, fontWeight: 800, fontFamily: 'Inter' }}>{i + 1}.</span>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>{step}</p>
              </div>
            ))}
          </GlassCard>

          {/* Nutrition & Swap Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: 16, fontFamily: 'Inter' }}>Nutritional Profile</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 18 }}>
                {[
                  { label: 'Protein', val: nutritionData.protein, unit: 'g', color: '#2563EB' },
                  { label: 'Carbs', val: nutritionData.carbs, unit: 'g', color: '#10B981' },
                  { label: 'Fat', val: nutritionData.fat, unit: 'g', color: '#F59E0B' },
                ].map(n => (
                  <div key={n.label} style={{ textAlign: 'center' }}>
                    <ProgressRing value={n.val} max={100} size={72} strokeWidth={6} color={n.color} bgColor="#F1F5F9">
                      <span style={{ fontSize: '0.8rem', color: n.color, fontWeight: 800 }}>{n.val}{n.unit}</span>
                    </ProgressRing>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 6, fontWeight: 600 }}>{n.label}</p>
                  </div>
                ))}
              </div>

              {Object.entries(nutritionData).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.88rem', textTransform: 'capitalize', color: '#4B5563', fontWeight: 500 }}>{k}</span>
                  <span style={{ fontSize: '0.88rem', color: '#111827', fontWeight: 700, fontFamily: 'Inter' }}>{v}{k === 'calories' ? ' kcal' : k === 'sodium' ? ' mg' : ' g'}</span>
                </div>
              ))}
            </GlassCard>

            <GlassCard className="p-5" style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)', borderRadius: 20, border: '1px solid #DBEAFE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} color="#2563EB" />
                <p style={{ flex: 1, fontSize: '0.85rem', color: '#4B5563', margin: 0, fontWeight: 500 }}>Prefer a different meal? AI can generate smart replacements.</p>
                <GlassButton onClick={handleSwap} disabled={swapping} style={{ gap: 6 }}>
                  <RefreshCw size={14} className={swapping ? 'spin' : ''} /> Swap
                </GlassButton>
              </div>

              {swapping && (
                <div style={{ width: '100%', height: 16, background: '#DBEAFE', borderRadius: 8 }} />
              )}

              {!swapping && swappedMeal && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: 16, borderRadius: 16, background: '#FFFFFF', border: '1px solid #E2E8F0',
                    fontSize: '0.88rem', color: '#1F2937', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontWeight: 500
                  }}>
                  {swappedMeal}
                </motion.div>
              )}
            </GlassCard>
          </div>
        </div>

        <GlassButton onClick={() => navigate('/diet/plan')} style={{ gap: 6 }}>
          <ArrowLeft size={16} /> Return to Diet Plan
        </GlassButton>
      </div>
    </PageTransition>
  );
}
