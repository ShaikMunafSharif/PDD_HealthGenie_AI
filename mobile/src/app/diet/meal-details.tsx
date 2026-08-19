import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react-native';
import { GlassCard, GlassButton, ProgressRing } from '../../components/ui/Components';
import ValidatedMealImage from '../../components/ui/ValidatedMealImage';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const getRecipe = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('salad') || lowerName.includes('wrap') || lowerName.includes('bowl')) {
    return [
      'Wash and prepare mixed greens, vegetables, and selected toppings.',
      'Prepare protein source and slice.',
      'Toss all ingredients together with a light vinaigrette.',
      'Portion out and serve fresh.'
    ];
  }
  if (lowerName.includes('oatmeal') || lowerName.includes('pudding') || lowerName.includes('toast') || lowerName.includes('pancakes')) {
    return [
      'Prepare base grains, bread, or batter.',
      'Cook or toast the base until perfectly warm and golden.',
      'Assemble with healthy toppings (berries, nuts, etc).',
      'Serve warm immediately.'
    ];
  }
  return [
    'Season protein or grains with a pinch of salt, pepper, and herbs.',
    'Cook on a medium-hot pan with olive oil.',
    'Steam or roast seasonal vegetables.',
    'Plate everything and serve with a fresh squeeze of lemon.'
  ];
};

export default function MealDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const mealName = params.mealName as string || 'Grilled Chicken Salad';
  const mealType = params.mealType as string || 'lunch';
  const cals = parseInt(params.cals as string) || 450;

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
      setSwappedMeal(`**Recommending a Healthy Meal Swap:**\n\n**Sesame Tofu & Veggie Stir-Fry**\n- Calories: ${altCal} kcal\n- Protein: ${altP}g\n- Carbs: ${altC}g\n- Fat: ${altF}g\n\n*Preparation Steps:*\n1. Cube and pan-sear tofu.\n2. Add snap peas and broccoli.\n3. Stir in soy-ginger sauce.`);
      return;
    }
    
    const prompt = `Suggest one healthy alternative to ${mealName} (${calories} kcal). Provide:\n1. Meal Name\n2. Nutrition breakdown\n3. 3-4 simple preparation steps. Keep it brief.`;

    try {
      let fullText = '';
      for await (const chunk of streamHealthGenie(prompt, 'diet')) {
        fullText = chunk.full;
        setSwappedMeal(fullText);
      }
    } catch {
      setSwappedMeal(`**Sesame Tofu & Veggie Stir-Fry**\n- Calories: ${calories} kcal\n- Protein: ${protein}g\n- Carbs: ${carbs}g\n- Fat: ${fat}g`);
    } finally {
      setSwapping(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>RECIPE & MACROS</Text>
          <Text style={styles.title} numberOfLines={1}>{mealName}</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {/* Recipe Card */}
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.cardTitle}>Preparation Instructions</Text>
          <View style={styles.recipeSteps}>
            {recipe.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNum}>{i + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Nutrition Card */}
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.cardTitle}>Nutritional Profile</Text>
          
          <View style={styles.macroRingRow}>
            {[
              { label: 'Protein', val: protein, unit: 'g', color: '#2563EB' },
              { label: 'Carbs', val: carbs, unit: 'g', color: '#10B981' },
              { label: 'Fat', val: fat, unit: 'g', color: '#F59E0B' },
            ].map(n => (
              <View key={n.label} style={styles.ringCol}>
                <ProgressRing value={n.val} max={100} size={64} strokeWidth={5} color={n.color} bgColor="#F1F5F9">
                  <Text style={{ fontSize: 11, color: n.color, fontWeight: '800' }}>{n.val}{n.unit}</Text>
                </ProgressRing>
                <Text style={styles.ringLabel}>{n.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.nutritionList}>
            {Object.entries(nutritionData).map(([k, v]) => (
              <View key={k} style={styles.nutritionRow}>
                <Text style={styles.nutritionKey}>{k}</Text>
                <Text style={styles.nutritionVal}>{v}{k === 'calories' ? ' kcal' : k === 'sodium' ? ' mg' : ' g'}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Swap Card */}
        <GlassCard hover={false} style={styles.swapCard}>
          <View style={styles.swapHeader}>
            <Sparkles size={20} color="#2563EB" />
            <Text style={styles.swapTitle}>AI Meal Swap</Text>
          </View>
          <Text style={styles.swapDesc}>Prefer a different meal? Generate a smart replacement.</Text>
          
          <GlassButton onPress={handleSwap} disabled={swapping} style={styles.swapBtn}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {swapping ? <ActivityIndicator size="small" color="#000" /> : <RefreshCw size={16} color="#000" />}
              <Text style={styles.swapBtnText}>Generate Alternative</Text>
            </View>
          </GlassButton>

          {!swapping && swappedMeal ? (
            <Animated.View entering={FadeInUp} style={styles.swappedResultBox}>
              <Text style={styles.swappedResultText}>{swappedMeal}</Text>
            </Animated.View>
          ) : null}
        </GlassCard>

      </Animated.View>
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
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  recipeSteps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
    width: 20,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  macroRingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  ringCol: {
    alignItems: 'center',
  },
  ringLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  nutritionList: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  nutritionKey: {
    fontSize: 13,
    color: '#4B5563',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  nutritionVal: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '700',
  },
  swapCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 40,
  },
  swapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  swapTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  swapDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  swapBtn: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    borderWidth: 1,
  },
  swapBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  swappedResultBox: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  swappedResultText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  }
});
