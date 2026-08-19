import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Apple, Clock, Flame, ArrowRight, Sparkles, User, Ruler, Weight, Calendar, Activity } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput, ProgressRing, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useDietStore, useAuthStore } from '../../store/healthStore';
import { streamHealthGenie, checkAIStatus } from '../../services/ollamaService';
import { getFallbackImageByTitle } from '../../services/dietImageService';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const lowCalPlan = {
  Monday: { breakfast: 'Egg white scramble with spinach (3 whites)', lunch: 'Grilled chicken breast salad with light dressing', dinner: 'Baked cod with steamed asparagus', snack: '100g cucumber slices with 2 tbsp hummus' },
  Tuesday: { breakfast: 'Chia seed pudding with unsweetened almond milk', lunch: 'Turkey breast slices wrapped in lettuce leaves', dinner: 'Grilled tofu with mixed stir-fry vegetables', snack: 'Small handful of almonds (15g)' },
  Wednesday: { breakfast: 'Protein shake with water & half banana', lunch: 'Lentil salad with lemon-tahini dressing', dinner: 'Grilled shrimp with zucchini noodles', snack: 'One hard-boiled egg' },
  Thursday: { breakfast: 'Oatmeal (40g) made with water & cinnamon', lunch: 'Tuna salad (in water) with celery sticks', dinner: 'Lean turkey meatballs with tomato sauce', snack: '100g fat-free Greek yogurt' },
  Friday: { breakfast: 'Two poached eggs with spinach', lunch: 'Quinoa and mixed salad bowl', dinner: 'Grilled salmon (120g) with broccoli', snack: 'Half grapefruit' },
  Saturday: { breakfast: 'Protein pancakes (banana + egg whites)', lunch: 'Baked chicken tenderloins with salad', dinner: 'Grilled white fish with cauliflower mash', snack: 'Celery sticks with 1 tsp peanut butter' },
  Sunday: { breakfast: 'Spinach and mushroom omelette', lunch: 'Mixed bean salad with cucumber', dinner: 'Grilled chicken breast with asparagus', snack: 'A cup of green tea and 5 almonds' }
};

const medCalPlan = {
  Monday: { breakfast: 'Oatmeal with berries, honey, and almonds', lunch: 'Grilled chicken wrap with whole wheat tortilla', dinner: 'Salmon filet with brown rice and broccoli', snack: 'Greek yogurt with 1 tsp honey' },
  Tuesday: { breakfast: 'Avocado toast with two fried eggs', lunch: 'Quinoa salad bowl with chickpeas and olive oil', dinner: 'Turkey breast with sweet potato and green beans', snack: 'Mixed nuts and seeds (30g)' },
  Wednesday: { breakfast: 'Fruit smoothie (banana, protein, almond milk)', lunch: 'Lentil soup with whole wheat bread', dinner: 'Grilled beef sirloin with roasted asparagus', snack: 'Apple slices with peanut butter' },
  Thursday: { breakfast: 'Whole grain pancakes with maple syrup', lunch: 'Mediterranean chicken wrap with salad', dinner: 'Baked cod with roasted sweet potato & quinoa', snack: 'Protein bar' },
  Friday: { breakfast: 'Egg white and whole egg omelette with toast', lunch: 'Brown rice and black bean bowl with avocado', dinner: 'Grilled chicken breast with roasted vegetables', snack: 'Cottage cheese with pineapple slices' },
  Saturday: { breakfast: 'French toast with strawberries', lunch: 'Grilled veggie burger on whole wheat bun', dinner: 'Pasta with lean ground turkey and tomato sauce', snack: 'Trail mix (30g)' },
  Sunday: { breakfast: 'Acai bowl with granola and banana', lunch: 'Chicken Caesar salad with light dressing', dinner: 'Baked fish with quinoa and broccoli', snack: 'Dark chocolate (2 squares) and almonds' }
};

const highCalPlan = {
  Monday: { breakfast: 'Large bowl of oatmeal with peanut butter, banana, and protein powder', lunch: 'Double grilled chicken bowl with rice, beans, and avocado', dinner: 'Ribeye steak with baked potato and roasted vegetables', snack: 'Protein shake and a banana' },
  Tuesday: { breakfast: 'Avocado toast (2 slices) with 3 eggs and cheese', lunch: 'Quinoa bowl with olive oil, chickpeas, feta, and chicken', dinner: 'Grilled salmon (200g) with double rice and green beans', snack: 'Mixed nuts (50g) and dried fruit' },
  Wednesday: { breakfast: 'Smoothie bowl with peanut butter, protein, and granola', lunch: 'Turkey club sandwich with sweet potato fries', dinner: 'Baked fish with roasted potatoes and asparagus', snack: 'Greek yogurt with honey and almonds' },
  Thursday: { breakfast: '3 whole wheat pancakes with syrup and scrambled eggs', lunch: 'Mediterranean wrap with hummus, chicken, and extra olive oil', dinner: 'Grilled chicken breast (200g) with pasta and garlic bread', snack: 'Mass gainer shake or protein bar' },
  Friday: { breakfast: 'Omelette (4 eggs, spinach, mushrooms) with 2 slices of sourdough', lunch: 'Beef and rice bowl with avocado and black beans', dinner: 'Grilled sirloin steak with sweet potato fries', snack: 'Cottage cheese with honey and walnuts' },
  Saturday: { breakfast: 'French toast with maple syrup and sausage', lunch: 'Double beef burger on brioche bun with side salad', dinner: 'Pasta carbonara with chicken breast', snack: 'Protein bar and mixed berries' },
  Sunday: { breakfast: 'Breakfast burrito (eggs, black beans, salsa, cheese)', lunch: 'Chicken bowl with rice, avocado, and sour cream', dinner: 'Baked fish with quinoa and sweet potato mash', snack: 'Almond butter toast and dark chocolate' }
};

const getMealHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getMealStats = (mealName, mealType, dailyCalorieTarget, dailyMacros) => {
  const hash = getMealHash(mealName || '');
  const variation = (hash % 15) - 7;
  
  let pct = 0.25;
  if (mealType === 'lunch') pct = 0.35;
  else if (mealType === 'dinner') pct = 0.30;
  else if (mealType === 'snack') pct = 0.10;

  const cals = Math.round(dailyCalorieTarget * pct * (1 + variation / 100));
  
  let p = dailyMacros?.protein ?? 30;
  let c = dailyMacros?.carbs ?? 45;
  let f = dailyMacros?.fat ?? 25;
  
  const lowerName = (mealName || '').toLowerCase();
  if (lowerName.includes('chicken') || lowerName.includes('salmon') || lowerName.includes('fish') || lowerName.includes('beef') || lowerName.includes('turkey') || lowerName.includes('tofu') || lowerName.includes('egg') || lowerName.includes('protein')) {
    p += 8;
    c -= 8;
  }
  if (lowerName.includes('avocado') || lowerName.includes('nuts') || lowerName.includes('peanut') || lowerName.includes('almond') || lowerName.includes('oil') || lowerName.includes('seeds')) {
    f += 6;
    c -= 6;
  }
  if (lowerName.includes('oatmeal') || lowerName.includes('rice') || lowerName.includes('wrap') || lowerName.includes('pancakes') || lowerName.includes('toast') || lowerName.includes('banana') || lowerName.includes('pasta')) {
    c += 7;
    p -= 7;
  }
  
  const sum = p + c + f;
  p = Math.round((p / sum) * 100);
  c = Math.round((c / sum) * 100);
  f = 100 - p - c;
  
  return { cals, p, c, f };
};

const getMealImage = (mealName, mealType) => getFallbackImageByTitle(mealName, mealType);

export default function DietPlan() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const { calorieTarget, setCalorieTarget, macros, setMacros, weeklyPlan, setWeeklyPlan } = useDietStore();

  const [showConfigForm, setShowConfigForm] = useState(!user?.age || !user?.gender || !user?.height || !user?.weight);
  
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState(user?.goal || 'maintain');

  const [activeDay, setActiveDay] = useState(() => {
    const dayIdx = new Date().getDay();
    return days[dayIdx === 0 ? 6 : dayIdx - 1] || 'Monday';
  });
  const activePlan = weeklyPlan || medCalPlan;
  const todayMeals = (activePlan && activePlan[activeDay]) || medCalPlan[activeDay] || medCalPlan['Monday'] || {};

  let totalCalories = 0;
  let totalPWeighted = 0;
  let totalCWeighted = 0;
  let totalFWeighted = 0;

  Object.entries(todayMeals).forEach(([mealType, mealName]) => {
    const stats = getMealStats(mealName, mealType, calorieTarget, macros);
    totalCalories += stats.cals;
    totalPWeighted += stats.p * stats.cals;
    totalCWeighted += stats.c * stats.cals;
    totalFWeighted += stats.f * stats.cals;
  });

  const dayCalories = totalCalories || calorieTarget || 2000;
  const dayProtein = totalCalories ? Math.round(totalPWeighted / totalCalories) : (macros?.protein || 30);
  const dayCarbs = totalCalories ? Math.round(totalCWeighted / totalCalories) : (macros?.carbs || 45);
  const dayFat = totalCalories ? (100 - dayProtein - dayCarbs) : (macros?.fat || 25);

  const [aiTip, setAiTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const calculateCalorieTarget = () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum) || !gender) return 2000;

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else if (gender === 'female') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 78;
    }

    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725
    };
    const factor = multipliers[activityLevel] || 1.375;
    let tdee = bmr * factor;

    if (goal === 'lose') {
      tdee -= 450;
    } else if (goal === 'gain') {
      tdee += 400;
    }

    return Math.max(1200, Math.round(tdee));
  };

  const handleGeneratePlan = async () => {
    const calories = calculateCalorieTarget();
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    updateProfile({
      age: ageNum,
      gender,
      height: heightNum,
      weight: weightNum,
      activityLevel,
      goal
    });

    setCalorieTarget(calories);
    setMacros({ protein: 30, carbs: 45, fat: 25 });

    let baselinePlan = medCalPlan;
    if (calories < 1700) {
      baselinePlan = lowCalPlan;
    } else if (calories > 2300) {
      baselinePlan = highCalPlan;
    }
    setWeeklyPlan(baselinePlan);

    setGeneratingPlan(true);
    setShowConfigForm(false);

    const statusCheck = await checkAIStatus();
    
    if (statusCheck.available) {
      const prompt = `Generate a personalized weekly diet plan (Monday to Sunday) for a ${gender} of ${ageNum} years, height ${heightNum} cm, weight ${weightNum} kg, with a daily calorie target of ${calories} kcal. Format the output strictly as a raw JSON object matching this structure (do not include markdown backticks or any conversation, just start with {):
{
  "Monday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." },
  "Tuesday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." },
  "Wednesday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." },
  "Thursday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." },
  "Friday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." },
  "Saturday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." },
  "Sunday": { "breakfast": "...", "lunch": "...", "dinner": "...", "snack": "..." }
}`;

      try {
        let aiResult = '';
        for await (const chunk of streamHealthGenie(prompt, 'diet')) {
          aiResult = chunk.full;
        }

        let cleanText = aiResult.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
        const parsedPlan = JSON.parse(cleanText);
        if (parsedPlan.Monday && parsedPlan.Sunday) {
          setWeeklyPlan(parsedPlan);
        }
      } catch (err) {
        console.warn("Could not generate AI diet plan, sticking with personalized template:", err);
      }
    }

    setGeneratingPlan(false);
    fetchDietTip();
  };

  const fetchDietTip = async () => {
    setLoadingTip(true);
    setAiTip('');

    const prompt = `Give me one highly actionable daily nutrition tip for a ${user?.gender || 'individual'} of ${user?.age || '25'} years old aiming for a ${calorieTarget} kcal target. Keep it to 2 brief sentences.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'diet_tip')) {
        setAiTip(chunk.full);
      }
    } catch {
      setAiTip(`Personalized Tip: Prioritize lean protein intake and hydrate with 2.5L+ water daily to support muscle recovery and metabolic health.`);
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => {
    fetchDietTip();
  }, [calorieTarget]);

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="NUTRITION & MACROS" title="Personalized Diet Plan" subtitle="Calculated metabolic meal schedules tailored to your biometric target" />

        {!showConfigForm && user?.age && (
          <GlassCard className="p-4" style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.88rem', color: '#6B7280' }}>
              <span>Gender: <strong style={{ color: '#111827', textTransform: 'capitalize' }}>{user.gender}</strong></span>
              <span>Age: <strong style={{ color: '#111827' }}>{user.age} yrs</strong></span>
              <span>Height: <strong style={{ color: '#111827' }}>{user.height} cm</strong></span>
              <span>Weight: <strong style={{ color: '#111827' }}>{user.weight} kg</strong></span>
              <span>Activity: <strong style={{ color: '#111827', textTransform: 'capitalize' }}>{user.activityLevel}</strong></span>
              <span>Goal: <strong style={{ color: '#2563EB', textTransform: 'capitalize' }}>{user.goal} weight</strong></span>
            </div>
            <GlassButton style={{ padding: '6px 14px', fontSize: '0.82rem' }} onClick={() => setShowConfigForm(true)}>
              Recalculate Target
            </GlassButton>
          </GlassCard>
        )}

        {showConfigForm ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-8" hover={false} style={{ maxWidth: 620, margin: '0 auto 24px', background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Apple size={24} color="#10B981" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Personalize Your Calorie & Macro Target</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <GlassInput label="AGE" icon={Calendar} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" />
                  <div>
                    <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8, color: '#6B7280' }}>GENDER</label>
                    <select className="glass-select" value={gender} onChange={e => setGender(e.target.value)} style={{ background: '#F8FAFC', color: '#111827', border: '1px solid #E2E8F0' }}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <GlassInput label="HEIGHT (CM)" icon={Ruler} type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" />
                  <GlassInput label="WEIGHT (KG)" icon={Weight} type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8, color: '#6B7280' }}>ACTIVITY LEVEL</label>
                    <select className="glass-select" value={activityLevel} onChange={e => setActivityLevel(e.target.value)} style={{ background: '#F8FAFC', color: '#111827', border: '1px solid #E2E8F0' }}>
                      <option value="sedentary">Sedentary (desk job)</option>
                      <option value="light">Light (1-2 days exercise)</option>
                      <option value="moderate">Moderate (3-5 days exercise)</option>
                      <option value="active">Active (6-7 days heavy training)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-eyebrow" style={{ display: 'block', marginBottom: 8, color: '#6B7280' }}>NUTRITION GOAL</label>
                    <select className="glass-select" value={goal} onChange={e => setGoal(e.target.value)} style={{ background: '#F8FAFC', color: '#111827', border: '1px solid #E2E8F0' }}>
                      <option value="lose">Lose Weight</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="gain">Gain Weight</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <GlassButton variant="primary" fullWidth onClick={handleGeneratePlan} disabled={!age || !gender || !height || !weight}>
                    Calculate & Generate Plan
                  </GlassButton>
                  {!showConfigForm && (
                    <GlassButton fullWidth onClick={() => setShowConfigForm(false)}>Cancel</GlassButton>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <>
            {generatingPlan && (
              <GlassCard className="p-4" style={{ marginBottom: 24, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16 }}>
                <span style={{ fontSize: '0.88rem', color: '#1E40AF', fontWeight: 600 }}>HealthGenie is personalizing your weekly AI diet plan in the background...</span>
              </GlassCard>
            )}

            {/* Macro Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
              <GlassCard className="p-5" style={{ textAlign: 'center', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                <Flame size={24} style={{ color: '#F97316', margin: '0 auto 8px', display: 'block' }} />
                <span style={{ fontSize: '1.8rem', color: '#F97316', fontWeight: 800, fontFamily: 'Inter' }}>{dayCalories}</span>
                <p style={{ color: '#6B7280', fontSize: '0.72rem', marginTop: 2, fontWeight: 700, letterSpacing: '0.05em' }}>CALORIES/DAY</p>
              </GlassCard>
              {[
                { label: 'Protein', value: dayProtein, color: '#2563EB' },
                { label: 'Carbs', value: dayCarbs, color: '#10B981' },
                { label: 'Fat', value: dayFat, color: '#F59E0B' },
              ].map(m => (
                <GlassCard key={m.label} className="p-5" style={{ textAlign: 'center', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                  <ProgressRing value={m.value} size={64} strokeWidth={6} color={m.color} bgColor="#F1F5F9">
                    <span style={{ fontSize: '0.8rem', color: m.color, fontWeight: 800 }}>{m.value}%</span>
                  </ProgressRing>
                  <p style={{ color: '#6B7280', fontSize: '0.72rem', marginTop: 8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{m.label}</p>
                </GlassCard>
              ))}
            </div>

            {/* Day Selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
              {days.map(d => (
                <motion.button key={d} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveDay(d)}
                  style={{
                    padding: '10px 20px', borderRadius: 14, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Inter', whiteSpace: 'nowrap', fontWeight: 600,
                    background: activeDay === d ? '#2563EB' : '#FFFFFF',
                    border: `1px solid ${activeDay === d ? '#2563EB' : '#E5E7EB'}`,
                    color: activeDay === d ? '#FFFFFF' : '#4B5563',
                    boxShadow: activeDay === d ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                  }}>
                  {d.slice(0, 3)}
                </motion.button>
              ))}
            </div>

            {/* Meal Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {Object.entries(todayMeals).map(([meal, desc], i) => (
                <motion.div key={meal} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <GlassCard className="p-5" style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                    <p style={{ marginBottom: 4, color: '#2563EB', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>{meal.toUpperCase()}</p>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 8, fontFamily: 'Inter' }}>{desc}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} color="#6B7280" />
                      <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500 }}>
                        {meal === 'breakfast' ? '7:00 AM' : meal === 'lunch' ? '12:30 PM' : meal === 'dinner' ? '7:00 PM' : '4:00 PM'}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* AI Nutrition Tip */}
            <GlassCard className="p-6" style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)', borderRadius: 24, border: '1px solid #DBEAFE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={22} color="#2563EB" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>AI Nutrition Tip of the Day</h3>
              </div>

              {loadingTip ? (
                <div style={{ width: '100%', height: 16, background: '#DBEAFE', borderRadius: 8 }} />
              ) : (
                <p style={{ color: '#1F2937', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
                  {aiTip}
                </p>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </PageTransition>
  );
}
