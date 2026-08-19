import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { GlassCard, ProgressRing } from '../../components/ui/Components';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const nutrients = [
  { name: 'Iron', current: 12, target: 18, unit: 'mg', color: '#FF6B35', foods: ['Spinach', 'Red meat', 'Lentils', 'Chickpeas'] },
  { name: 'Calcium', current: 800, target: 1000, unit: 'mg', color: '#00F5FF', foods: ['Milk', 'Yogurt', 'Broccoli', 'Almonds'] },
  { name: 'Folate', current: 300, target: 400, unit: 'mcg', color: '#39FF14', foods: ['Leafy greens', 'Avocado', 'Oranges', 'Beans'] },
  { name: 'Vitamin D', current: 500, target: 600, unit: 'IU', color: '#FFB347', foods: ['Eggs', 'Fatty fish', 'Fortified milk', 'Sunlight'] },
];

export default function WomenDiet() {
  const router = useRouter();
  const { periodLog } = useWomenStore();
  const { user } = useAuthStore();

  const weightNum = parseFloat(user?.weight || '0');
  const heightNum = parseFloat(user?.height || '0');
  const bmi = (weightNum && heightNum) ? (weightNum / ((heightNum / 100) ** 2)) : null;

  const dynamicNutritionTip = useMemo(() => {
    const allLoggedSymptoms = new Set();
    periodLog.forEach((log: any) => {
      if (log.symptoms) {
        log.symptoms.forEach((s: any) => allLoggedSymptoms.add(s.toLowerCase()));
      }
    });

    let tipText = "";
    
    if (allLoggedSymptoms.has('cramps')) {
      tipText += "Since you logged cramps, prioritize magnesium-rich foods (dark chocolate, almonds, spinach) and potassium (bananas) to help relax uterine muscles and reduce spasms. ";
    }
    if (allLoggedSymptoms.has('fatigue')) {
      tipText += "To combat fatigue, prioritize complex carbs and iron-rich meals paired with Vitamin C to optimize absorption and restore cellular energy levels. ";
    }
    if (allLoggedSymptoms.has('acne')) {
      tipText += "To help manage hormonal breakouts and acne, consider cutting down on dairy and refined sugars, replacing them with antioxidant-rich berries and omega-3 fatty acids. ";
    }
    if (allLoggedSymptoms.has('bloating')) {
      tipText += "To ease bloating, minimize high-sodium foods and include natural water-balancing foods like cucumber, celery, and fennel tea. ";
    }

    if (bmi && bmi >= 25) {
      tipText += `With a BMI of ${bmi.toFixed(1)}, focusing on high-fiber, low-GI foods is highly recommended to improve insulin sensitivity and support weight management. `;
    } else if (bmi && bmi < 25) {
      tipText += `For your lean profile (BMI: ${bmi.toFixed(1)}), ensure you get sufficient healthy fats (avocado, nuts, seeds) to support healthy hormone synthesis and regular ovulation. `;
    }

    if (user?.activityLevel === 'active') {
      tipText += "Given your active routine, make sure to refuel with premium protein and calcium-dense foods to protect bone density and speed muscle recovery. ";
    }

    if (!tipText) {
      tipText = "Your iron intake is below the recommended daily target. Make sure to include more spinach and legumes in your meals, especially during your menstrual cycle when iron loss is higher. Pairing iron sources with vitamin C enhances absorption.";
    }

    return tipText;
  }, [periodLog, user, bmi]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>NUTRITION</Text>
          <Text style={styles.title} numberOfLines={1}>Women's Nutrition</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        {user?.age && (
          <GlassCard hover={false} style={styles.profileCard}>
            <View style={styles.profileGrid}>
              <Text style={styles.profileStat}>Age: <Text style={styles.profileStatBold}>{user.age} yrs</Text></Text>
              <Text style={styles.profileStat}>Height: <Text style={styles.profileStatBold}>{user.height} cm</Text></Text>
              <Text style={styles.profileStat}>Weight: <Text style={styles.profileStatBold}>{user.weight} kg</Text></Text>
              {bmi && <Text style={styles.profileStat}>BMI: <Text style={styles.profileStatAccent}>{bmi.toFixed(1)}</Text></Text>}
              <Text style={styles.profileStat}>Activity: <Text style={styles.profileStatAccent}>{user.activityLevel}</Text></Text>
              <Text style={styles.profileStat}>Goal: <Text style={styles.profileStatAccent}>{user.goal}</Text></Text>
            </View>
          </GlassCard>
        )}

        <View style={styles.grid}>
          {nutrients.map((n, i) => (
            <Animated.View key={n.name} entering={FadeInUp.delay(200 + i * 50)} style={styles.gridItemWrapper}>
              <GlassCard hover={false} style={styles.nutrientCard}>
                <View style={styles.progressBox}>
                  <ProgressRing value={n.current} max={n.target} size={80} strokeWidth={6} color={n.color} bgColor="#F1F5F9">
                    <Text style={[styles.progressText, { color: n.color }]}>
                      {Math.round(n.current / n.target * 100)}%
                    </Text>
                  </ProgressRing>
                </View>
                <Text style={styles.nutrientName}>{n.name}</Text>
                <Text style={[styles.nutrientValue, { color: n.color }]}>
                  {n.current}/{n.target} {n.unit}
                </Text>
                <View style={styles.foodsList}>
                  {n.foods.map(f => (
                    <View key={f} style={[styles.foodTag, { backgroundColor: `${n.color}15`, borderColor: `${n.color}30` }]}>
                      <Text style={[styles.foodTagText, { color: n.color }]}>{f}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
        
        <GlassCard hover={false} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={16} color="#10B981" />
            <Text style={styles.aiTitle}>AI NUTRITION TIPS</Text>
          </View>
          <Text style={styles.aiText}>{dynamicNutritionTip}</Text>
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
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6EE7B7',
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileStat: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  profileStatBold: {
    fontWeight: '700',
    color: '#111827',
  },
  profileStatAccent: {
    fontWeight: '700',
    color: '#10B981',
    textTransform: 'capitalize',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  nutrientCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    minHeight: 220,
  },
  progressBox: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '800',
  },
  nutrientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  nutrientValue: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  foodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  foodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  foodTagText: {
    fontSize: 10,
    fontWeight: '600',
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6EE7B7',
    borderWidth: 1,
    padding: 20,
    marginBottom: 40,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 1,
  },
  aiText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  }
});
