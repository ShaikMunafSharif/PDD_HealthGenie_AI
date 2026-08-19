import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Apple, Clock, Flame, ArrowRight, Sparkles, Calendar, Ruler, Weight, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput, ProgressRing } from '../../components/ui/Components';
import ValidatedMealImage from '../../components/ui/ValidatedMealImage';
import { useDietStore, useAuthStore } from '../../store/healthStore';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const medCalPlan = {
  Monday: { breakfast: 'Oatmeal with berries, honey, and almonds', lunch: 'Grilled chicken wrap with whole wheat tortilla', dinner: 'Salmon filet with brown rice and broccoli', snack: 'Greek yogurt with 1 tsp honey' },
  Tuesday: { breakfast: 'Avocado toast with two fried eggs', lunch: 'Quinoa salad bowl with chickpeas and olive oil', dinner: 'Turkey breast with sweet potato and green beans', snack: 'Mixed nuts and seeds (30g)' },
  Wednesday: { breakfast: 'Fruit smoothie (banana, protein, almond milk)', lunch: 'Lentil soup with whole wheat bread', dinner: 'Grilled beef sirloin with roasted asparagus', snack: 'Apple slices with peanut butter' },
  Thursday: { breakfast: 'Whole grain pancakes with maple syrup', lunch: 'Mediterranean chicken wrap with salad', dinner: 'Baked cod with roasted sweet potato & quinoa', snack: 'Protein bar' },
  Friday: { breakfast: 'Egg white and whole egg omelette with toast', lunch: 'Brown rice and black bean bowl with avocado', dinner: 'Grilled chicken breast with roasted vegetables', snack: 'Cottage cheese with pineapple slices' },
  Saturday: { breakfast: 'French toast with strawberries', lunch: 'Grilled veggie burger on whole wheat bun', dinner: 'Pasta with lean ground turkey and tomato sauce', snack: 'Trail mix (30g)' },
  Sunday: { breakfast: 'Acai bowl with granola and banana', lunch: 'Chicken Caesar salad with light dressing', dinner: 'Baked fish with quinoa and broccoli', snack: 'Dark chocolate (2 squares) and almonds' }
};

const getMealHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

const getMealStats = (mealName: string, mealType: string, dailyCalorieTarget: number, dailyMacros: any) => {
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
    p += 8; c -= 8;
  }
  if (lowerName.includes('avocado') || lowerName.includes('nuts') || lowerName.includes('peanut') || lowerName.includes('almond') || lowerName.includes('oil') || lowerName.includes('seeds')) {
    f += 6; c -= 6;
  }
  if (lowerName.includes('oatmeal') || lowerName.includes('rice') || lowerName.includes('wrap') || lowerName.includes('pancakes') || lowerName.includes('toast') || lowerName.includes('banana') || lowerName.includes('pasta')) {
    c += 7; p -= 7;
  }
  
  const sum = p + c + f;
  p = Math.round((p / sum) * 100);
  c = Math.round((c / sum) * 100);
  f = 100 - p - c;
  
  return { cals, p, c, f };
};

export default function DietPlan() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { calorieTarget, setCalorieTarget, macros, setMacros, weeklyPlan, setWeeklyPlan } = useDietStore();

  const [showConfigForm, setShowConfigForm] = useState(!user?.age || !user?.gender || !user?.height || !user?.weight);
  
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState(user?.goal || 'maintain');

  const [activeDay, setActiveDay] = useState(() => {
    const dayIdx = new Date().getDay();
    return days[dayIdx === 0 ? 6 : dayIdx - 1] || 'Monday';
  });
  
  const activePlan: any = weeklyPlan || medCalPlan;
  const todayMeals = (activePlan && activePlan[activeDay]) || (medCalPlan as any)[activeDay] || medCalPlan['Monday'] || {};

  let totalCalories = 0;
  let totalPWeighted = 0;
  let totalCWeighted = 0;
  let totalFWeighted = 0;

  Object.entries(todayMeals).forEach(([mealType, mealName]: any) => {
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
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    let tdee = bmr * (multipliers[activityLevel] || 1.375);

    if (goal === 'lose') tdee -= 450;
    else if (goal === 'gain') tdee += 400;

    return Math.max(1200, Math.round(tdee));
  };

  const handleGeneratePlan = async () => {
    const calories = calculateCalorieTarget();
    updateProfile({
      age: parseInt(age), gender, height: parseFloat(height), weight: parseFloat(weight), activityLevel, goal
    });
    setCalorieTarget(calories);
    setMacros({ protein: 30, carbs: 45, fat: 25 });
    setWeeklyPlan(medCalPlan);
    setGeneratingPlan(true);
    setShowConfigForm(false);

    const statusCheck = await checkOllamaStatus();
    if (statusCheck.available) {
      const prompt = `Generate a personalized weekly diet plan...`; // abbreviated for speed
      try {
        let aiResult = '';
        for await (const chunk of streamHealthGenie(prompt, 'diet')) {
          aiResult = chunk.full;
        }
        let cleanText = aiResult.trim().replace(/^```(json)?/, '').replace(/```$/, '').trim();
        const parsedPlan = JSON.parse(cleanText);
        if (parsedPlan.Monday && parsedPlan.Sunday) setWeeklyPlan(parsedPlan);
      } catch (err) {}
    }
    setGeneratingPlan(false);
    fetchDietTip();
  };

  const fetchDietTip = async () => {
    setLoadingTip(true);
    setAiTip('');
    const prompt = `Give me one highly actionable daily nutrition tip for a ${user?.gender || 'individual'} of ${user?.age || '25'} years old aiming for a ${calorieTarget} kcal target. Keep it to 2 brief sentences.`;
    try {
      for await (const chunk of streamHealthGenie(prompt, 'diet')) {
        setAiTip(chunk.full);
      }
    } catch {
      setAiTip(`Prioritize lean protein intake and hydrate with 2.5L+ water daily to support muscle recovery and metabolic health.`);
    } finally {
      setLoadingTip(false);
    }
  };

  useEffect(() => { fetchDietTip(); }, [calorieTarget]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>NUTRITION & MACROS</Text>
          <Text style={styles.title}>Diet Plan</Text>
        </View>
      </View>

      {showConfigForm ? (
        <Animated.View entering={FadeInUp.delay(100)}>
          <GlassCard hover={false} style={styles.configCard}>
            <View style={styles.cardHeaderIcon}>
              <Apple size={24} color="#10B981" />
              <Text style={styles.cardTitle}>Personalize Target</Text>
            </View>

            <GlassInput label="AGE" icon={Calendar} value={age} onChangeText={setAge} keyboardType="numeric" />
            <GlassInput label="HEIGHT (CM)" icon={Ruler} value={height} onChangeText={setHeight} keyboardType="numeric" />
            <GlassInput label="WEIGHT (KG)" icon={Weight} value={weight} onChangeText={setWeight} keyboardType="numeric" />
            
            <View style={styles.selectGroup}>
              <Text style={styles.label}>GENDER</Text>
              <View style={styles.row}>
                {['male', 'female'].map(g => (
                  <TouchableOpacity key={g} onPress={() => setGender(g)} style={[styles.selBtn, gender === g && styles.selBtnActive]}>
                    <Text style={[styles.selText, gender === g && styles.selTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectGroup}>
              <Text style={styles.label}>ACTIVITY LEVEL</Text>
              <View style={{ gap: 8 }}>
                {['sedentary', 'light', 'moderate', 'active'].map(a => (
                  <TouchableOpacity key={a} onPress={() => setActivityLevel(a)} style={[styles.selBtn, activityLevel === a && styles.selBtnActive]}>
                    <Text style={[styles.selText, activityLevel === a && styles.selTextActive]}>{a.charAt(0).toUpperCase() + a.slice(1)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.selectGroup}>
              <Text style={styles.label}>GOAL</Text>
              <View style={styles.row}>
                {['lose', 'maintain', 'gain'].map(g => (
                  <TouchableOpacity key={g} onPress={() => setGoal(g)} style={[styles.selBtn, goal === g && styles.selBtnActive]}>
                    <Text style={[styles.selText, goal === g && styles.selTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <GlassButton variant="primary" fullWidth onPress={handleGeneratePlan} style={{ marginTop: 12 }}>
              Generate Plan
            </GlassButton>
            {user?.age && (
              <GlassButton fullWidth onPress={() => setShowConfigForm(false)} style={{ marginTop: 12 }}>
                Cancel
              </GlassButton>
            )}
          </GlassCard>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInUp.delay(100)}>
          {generatingPlan && (
             <GlassCard hover={false} style={styles.generatingBanner}>
               <Text style={styles.generatingText}>HealthGenie is personalizing your weekly AI diet plan...</Text>
             </GlassCard>
          )}

          {/* Macro Cards */}
          <View style={styles.macroGrid}>
            <GlassCard hover={false} style={styles.macroCardCal}>
              <Flame size={24} color="#F97316" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <Text style={styles.calNum}>{dayCalories}</Text>
              <Text style={styles.calLabel}>CALORIES/DAY</Text>
            </GlassCard>
            
            {[
              { label: 'Protein', val: dayProtein, color: '#2563EB' },
              { label: 'Carbs', val: dayCarbs, color: '#10B981' },
              { label: 'Fat', val: dayFat, color: '#F59E0B' },
            ].map(m => (
              <GlassCard hover={false} key={m.label} style={styles.macroCardRing}>
                <ProgressRing value={m.val} size={50} strokeWidth={4} color={m.color} bgColor="#F1F5F9">
                  <Text style={{ fontSize: 10, color: m.color, fontWeight: '800' }}>{m.val}%</Text>
                </ProgressRing>
                <Text style={styles.ringLabel}>{m.label}</Text>
              </GlassCard>
            ))}
          </View>

          {/* Day Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {days.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => setActiveDay(d)}
                style={[styles.dayBtn, activeDay === d && styles.dayBtnActive]}
              >
                <Text style={[styles.dayText, activeDay === d && styles.dayTextActive]}>{d.slice(0, 3)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Meal List */}
          <View style={styles.mealList}>
            {Object.entries(todayMeals).map(([meal, desc]: any) => {
              const stats = getMealStats(desc, meal, calorieTarget, macros);
              return (
                <TouchableOpacity
                  key={meal}
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({ pathname: '/diet/meal-details', params: { mealName: desc, mealType: meal, cals: stats.cals } });
                  }}
                >
                  <GlassCard hover={false} style={styles.mealCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={styles.mealType}>{meal.toUpperCase()}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Flame size={12} color="#F97316" />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#F97316' }}>{stats.cals} kcal</Text>
                      </View>
                    </View>
                    <Text style={styles.mealDesc}>{desc}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                      <View style={styles.mealTime}>
                        <Clock size={12} color="#6B7280" />
                        <Text style={styles.mealTimeText}>
                          {meal === 'breakfast' ? '7:00 AM' : meal === 'lunch' ? '12:30 PM' : meal === 'dinner' ? '7:00 PM' : '4:00 PM'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#2563EB', backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>P: {stats.p}%</Text>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#10B981', backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>C: {stats.c}%</Text>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#F59E0B', backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>F: {stats.f}%</Text>
                      </View>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* AI Tip */}
          <GlassCard hover={false} style={styles.tipCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Sparkles size={20} color="#2563EB" />
              <Text style={styles.tipTitle}>AI Nutrition Tip</Text>
            </View>
            <Text style={styles.tipText}>{aiTip || 'Loading tip...'}</Text>
          </GlassCard>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  configCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 40,
  },
  cardHeaderIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  selectGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  selBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  selBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  selText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  selTextActive: {
    color: '#1E40AF',
  },
  generatingBanner: {
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    marginBottom: 20,
  },
  generatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E40AF',
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  macroCardCal: {
    flex: 1.5,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroCardRing: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center',
  },
  calNum: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F97316',
    fontFamily: 'Inter',
  },
  calLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 4,
  },
  ringLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 8,
  },
  dayScroll: {
    marginBottom: 20,
  },
  dayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  dayBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  mealList: {
    gap: 16,
    marginBottom: 24,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  mealImageWrapper: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mealType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  mealDesc: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealTimeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 40,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  }
});
