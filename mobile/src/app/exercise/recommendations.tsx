import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Clock, Flame, ArrowRight, Sparkles, Target, ChevronRight } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { streamHealthGenie } from '../../services/ollamaService';
import { useAuthStore, useExerciseStore } from '../../store/healthStore';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const beginnerWorkoutPlan = {
  Monday: [
    { name: 'Morning Walk & Stretch', duration: '20 min', calories: 100, exercises: 4, level: 'Light', color: '#2563EB', icon: '🚶' },
    { name: 'Basic Core Exercises', duration: '15 min', calories: 80, exercises: 4, level: 'Light', color: '#F59E0B', icon: '🔥' }
  ],
  Tuesday: [{ name: 'Low Impact Cardio', duration: '25 min', calories: 150, exercises: 5, level: 'Light', color: '#06B6D4', icon: '🏃' }],
  Wednesday: [{ name: 'Yoga & Flexibility', duration: '20 min', calories: 90, exercises: 8, level: 'Light', color: '#8B5CF6', icon: '🧘' }],
  Thursday: [{ name: 'Evening Walk', duration: '30 min', calories: 130, exercises: 1, level: 'Light', color: '#10B981', icon: '🚶' }],
  Friday: [{ name: 'Light Full Body Tone', duration: '20 min', calories: 120, exercises: 5, level: 'Light', color: '#10B981', icon: '💪' }],
  Saturday: [{ name: 'Active Recovery Walk', duration: '35 min', calories: 150, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }],
  Sunday: [{ name: 'Deep Stretching', duration: '20 min', calories: 70, exercises: 8, level: 'Light', color: '#8B5CF6', icon: '🧘' }]
};

const intermediateWorkoutPlan = {
  Monday: [
    { name: 'Morning Cardio Run', duration: '30 min', calories: 250, exercises: 5, level: 'Moderate', color: '#2563EB', icon: '🏃' },
    { name: 'Core Crusher Workout', duration: '20 min', calories: 150, exercises: 6, level: 'Moderate', color: '#F59E0B', icon: '🔥' }
  ],
  Tuesday: [
    { name: 'Upper Body Strength', duration: '45 min', calories: 320, exercises: 8, level: 'Intense', color: '#10B981', icon: '💪' },
    { name: 'Evening Steady Walk', duration: '20 min', calories: 100, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Wednesday: [{ name: 'Yoga Flow & Balance', duration: '25 min', calories: 120, exercises: 10, level: 'Light', color: '#8B5CF6', icon: '🧘' }],
  Thursday: [{ name: 'HIIT Cardio Interval', duration: '25 min', calories: 350, exercises: 10, level: 'Intense', color: '#EF4444', icon: '⚡' }],
  Friday: [{ name: 'Lower Body Strength', duration: '40 min', calories: 300, exercises: 7, level: 'Moderate', color: '#10B981', icon: '💪' }],
  Saturday: [
    { name: 'Total Core Conditioning', duration: '20 min', calories: 160, exercises: 6, level: 'Moderate', color: '#F59E0B', icon: '🔥' },
    { name: 'Evening Walk', duration: '30 min', calories: 140, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Sunday: [{ name: 'Full Body Mobility & Rest', duration: '30 min', calories: 110, exercises: 10, level: 'Light', color: '#8B5CF6', icon: '🧘' }]
};

const advancedWorkoutPlan = {
  Monday: [
    { name: 'HIIT Sprint Cardio', duration: '40 min', calories: 450, exercises: 8, level: 'Intense', color: '#EF4444', icon: '⚡' },
    { name: 'Hardcore Abs & Core', duration: '25 min', calories: 200, exercises: 8, level: 'Intense', color: '#F59E0B', icon: '🔥' }
  ],
  Tuesday: [
    { name: 'Heavy Upper Body Strength', duration: '60 min', calories: 500, exercises: 10, level: 'Intense', color: '#10B981', icon: '💪' },
    { name: 'Power Evening Walk', duration: '30 min', calories: 180, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Wednesday: [{ name: 'Vinyasa Power Yoga', duration: '35 min', calories: 180, exercises: 12, level: 'Moderate', color: '#8B5CF6', icon: '🧘' }],
  Thursday: [{ name: 'Tabata Full Body Burn', duration: '30 min', calories: 480, exercises: 12, level: 'Intense', color: '#EF4444', icon: '⚡' }],
  Friday: [{ name: 'Heavy Lower Body Strength', duration: '55 min', calories: 450, exercises: 9, level: 'Intense', color: '#10B981', icon: '💪' }],
  Saturday: [
    { name: 'Full Body Kettlebell Style', duration: '45 min', calories: 400, exercises: 8, level: 'Intense', color: '#10B981', icon: '💪' },
    { name: 'Cardio Core Finisher', duration: '20 min', calories: 180, exercises: 6, level: 'Intense', color: '#F59E0B', icon: '🔥' }
  ],
  Sunday: [{ name: 'Deep Restorative Yoga & Recovery', duration: '45 min', calories: 150, exercises: 12, level: 'Light', color: '#8B5CF6', icon: '🧘' }]
};

export default function ExerciseRecommendations() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { workoutPlan } = useExerciseStore();
  
  const [activeDay, setActiveDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(true);

  let baselinePlan: any = intermediateWorkoutPlan;
  if (user?.goal === 'lose' || user?.activityLevel === 'sedentary') {
    baselinePlan = beginnerWorkoutPlan;
  } else if (user?.goal === 'gain' || user?.activityLevel === 'active') {
    baselinePlan = advancedWorkoutPlan;
  }

  const activePlan = workoutPlan || baselinePlan;
  const todayWorkouts = activePlan[activeDay] || baselinePlan[activeDay];

  const getImmediateRecommendation = (dayName: string, workoutsForDay: any) => {
    if (!workoutsForDay || workoutsForDay.length === 0) {
      return "Rest and recovery day! Practice light stretching or deep breathing to help your muscles heal and rebuild.";
    }
    const main = workoutsForDay[0];
    const totalDuration = workoutsForDay.reduce((sum: number, w: any) => sum + parseInt(w.duration) || 0, 0);
    const totalCalories = workoutsForDay.reduce((sum: number, w: any) => sum + w.calories || 0, 0);
    return `Today's recommendation: ${main.name} (${main.duration} • ${main.level} intensity). Overall active target is ${totalDuration} minutes with an estimated burn of ${totalCalories} kcal.`;
  };

  const fetchWorkoutPlan = async () => {
    setLoading(true);
    const immediateTip = getImmediateRecommendation(activeDay, todayWorkouts);
    setAiPlan(immediateTip);
    setLoading(false);

    const prompt = `Give me a short daily personalized exercise recommendation for ${activeDay} based on these scheduled workouts: ${JSON.stringify(todayWorkouts)}. Keep it under 2 sentences. Highlight the primary exercise and target calorie burn.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'exercise')) {
        setAiPlan(chunk.full);
      }
    } catch {
      // Keep immediate tip
    }
  };

  useEffect(() => {
    fetchWorkoutPlan();
  }, [activeDay]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>EXERCISE & FITNESS</Text>
          <Text style={styles.title}>Recommendations</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {/* Recommendation Card */}
        <GlassCard hover={false} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Sparkles size={20} color="#2563EB" />
            <Text style={styles.tipTitle}>AI Daily Guidance</Text>
          </View>
          {loading ? (
            <View style={{ width: '100%', height: 16, backgroundColor: '#DBEAFE', borderRadius: 8 }} />
          ) : (
            <Text style={styles.tipText}>{aiPlan}</Text>
          )}

          {todayWorkouts && todayWorkouts.length > 0 && (
            <GlassButton 
              variant="primary" 
              style={{ marginTop: 16, alignSelf: 'flex-end', paddingHorizontal: 16 }}
              onPress={() => router.push({ pathname: '/exercise/details', params: { workout: JSON.stringify(todayWorkouts[0]) } })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: '#020510', fontWeight: '700', fontSize: 13 }}>Start Session</Text>
                <ArrowRight size={14} color="#020510" />
              </View>
            </GlassButton>
          )}
        </GlassCard>

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

        {/* Workouts Grid */}
        <View style={styles.workoutsGrid}>
          {todayWorkouts.map((w: any, i: number) => (
            <TouchableOpacity 
              key={w.name} 
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/exercise/details', params: { workout: JSON.stringify(w) } })}
            >
              <GlassCard hover={false} style={styles.workoutCard}>
                <View style={styles.workoutHeaderRow}>
                  <View style={styles.iconBox}>
                    <Text style={{ fontSize: 20 }}>{w.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.workoutName}>{w.name}</Text>
                    <View style={[styles.levelBadge, { borderColor: `${w.color}40` }]}>
                      <Text style={[styles.levelText, { color: w.color }]}>{w.level}</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#9CA3AF" />
                </View>
                
                <View style={styles.workoutStatsRow}>
                  <View style={styles.statItem}>
                    <Clock size={12} color="#6B7280" />
                    <Text style={styles.statText}>{w.duration}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Flame size={12} color="#F97316" />
                    <Text style={styles.statText}>{w.calories} cal</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Target size={12} color="#2563EB" />
                    <Text style={styles.statText}>{w.exercises} ex.</Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
          {(!todayWorkouts || todayWorkouts.length === 0) && (
            <Text style={styles.restText}>Rest Day. Enjoy some downtime or gentle movement to allow your muscles to recover!</Text>
          )}
        </View>

        <GlassButton onPress={() => router.push('/exercise/pain-relief')} style={{ marginTop: 12, marginBottom: 40 }}>
          🎯 View Targeted Pain Relief
        </GlassButton>

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
  tipCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  tipText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 22,
    fontWeight: '500',
  },
  dayScroll: {
    marginBottom: 20,
  },
  dayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  workoutsGrid: {
    gap: 16,
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  workoutHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    marginTop: 4,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
  },
  workoutStatsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  restText: {
    textAlign: 'center',
    color: '#6B7280',
    padding: 20,
    fontSize: 14,
  }
});
