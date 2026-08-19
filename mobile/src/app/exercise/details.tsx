import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Clock, Flame, Target, Play, Heart, Pause } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';

const exerciseImageMap: Record<string, any> = {
  'Jumping Jacks': require('../../../assets/exercises/jumping_jacks.png'),
  'High Knees': require('../../../assets/exercises/high_knees.png'),
  'Mountain Climbers': require('../../../assets/exercises/mountain_climbers.png'),
  'Bodyweight Squats': require('../../../assets/exercises/bodyweight_squats.png'),
  'Squats': require('../../../assets/exercises/bodyweight_squats.png'),
  'Plank Hold': require('../../../assets/exercises/plank_hold.png'),
  'Plank': require('../../../assets/exercises/plank_hold.png'),
  'Push-ups': require('../../../assets/exercises/push_ups.png'),
  'Plank to Push-up': require('../../../assets/exercises/plank_to_pushup.png'),
  'Glute Bridges': require('../../../assets/exercises/glute_bridges.png'),
  'Lunges': require('../../../assets/exercises/lunges.png'),
  'Child Pose': require('../../../assets/exercises/child_pose.png'),
  'Downward Dog': require('../../../assets/exercises/downward_dog.png'),
  'Cobra Stretch': require('../../../assets/exercises/cobra_stretch.png'),
  'Cat-Cow Pose': require('../../../assets/exercises/cat_cow.png'),
  'Pigeon Pose': require('../../../assets/exercises/pigeon_pose.png'),
  'Crunches': require('../../../assets/exercises/crunches.png'),
  'Leg Raises': require('../../../assets/exercises/leg_raises.png'),
  'Russian Twists': require('../../../assets/exercises/russian_twists.png'),
  'Bicycle Crunches': require('../../../assets/exercises/bicycle_crunches.png'),
};

const getDurationInSeconds = (repsOrTime: string) => {
  const lower = (repsOrTime || '').toLowerCase();
  if (lower.includes('min')) {
    const min = parseFloat(lower) || 1;
    return Math.round(min * 60);
  }
  const match = lower.match(/(\d+)\s*s/);
  if (match) return parseInt(match[1]);
  const matchSec = lower.match(/(\d+)\s*sec/);
  if (matchSec) return parseInt(matchSec[1]);
  return 30; 
};

const getExercisesForWorkout = (workoutName: string) => {
  const lower = (workoutName || '').toLowerCase();
  if (lower.includes('cardio') || lower.includes('walk') || lower.includes('run')) {
    return [
      { name: 'Jumping Jacks', sets: 3, reps: '30s work', rest: '15s', muscles: ['Full Body'] },
      { name: 'High Knees', sets: 3, reps: '30s work', rest: '15s', muscles: ['Cardio', 'Legs'] },
      { name: 'Mountain Climbers', sets: 3, reps: '30s work', rest: '15s', muscles: ['Core', 'Shoulders'] },
      { name: 'Bodyweight Squats', sets: 3, reps: '15 reps', rest: '30s', muscles: ['Quads', 'Glutes'] },
      { name: 'Plank Hold', sets: 3, reps: '45s hold', rest: '30s', muscles: ['Core'] }
    ];
  }
  if (lower.includes('strength') || lower.includes('upper') || lower.includes('lower') || lower.includes('tone') || lower.includes('full body')) {
    return [
      { name: 'Push-ups', sets: 3, reps: '12 reps', rest: '45s', muscles: ['Chest', 'Triceps'] },
      { name: 'Bodyweight Squats', sets: 4, reps: '15 reps', rest: '45s', muscles: ['Quads', 'Glutes'] },
      { name: 'Plank to Push-up', sets: 3, reps: '10 reps', rest: '45s', muscles: ['Core', 'Shoulders'] },
      { name: 'Glute Bridges', sets: 3, reps: '15 reps', rest: '30s', muscles: ['Glutes', 'Hamstrings'] },
      { name: 'Lunges', sets: 3, reps: '12 each', rest: '30s', muscles: ['Legs', 'Glutes'] }
    ];
  }
  if (lower.includes('yoga') || lower.includes('stretch') || lower.includes('mobility') || lower.includes('flexibility') || lower.includes('recovery')) {
    return [
      { name: 'Child Pose', sets: 1, reps: '1 min', rest: '0s', muscles: ['Back', 'Shoulders'] },
      { name: 'Downward Dog', sets: 3, reps: '30s hold', rest: '15s', muscles: ['Hamstrings', 'Shoulders'] },
      { name: 'Cobra Stretch', sets: 3, reps: '30s hold', rest: '15s', muscles: ['Abs', 'Lower Back'] },
      { name: 'Cat-Cow Pose', sets: 1, reps: '2 min', rest: '0s', muscles: ['Spine', 'Neck'] },
      { name: 'Pigeon Pose', sets: 2, reps: '45s each', rest: '15s', muscles: ['Hips', 'Glutes'] }
    ];
  }
  return [
    { name: 'Crunches', sets: 3, reps: '15 reps', rest: '30s', muscles: ['Upper Abs'] },
    { name: 'Leg Raises', sets: 3, reps: '12 reps', rest: '30s', muscles: ['Lower Abs'] },
    { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '30s', muscles: ['Obliques'] },
    { name: 'Plank Hold', sets: 3, reps: '45 sec', rest: '30s', muscles: ['Core'] }
  ];
};

export default function ExerciseDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  let workout = { name: 'Morning Cardio', duration: '30 min', calories: 250, exercises: 5, level: 'Moderate', color: '#2563EB', icon: '🏃' };
  try {
    if (params.workout) workout = JSON.parse(params.workout as string);
  } catch (e) {}

  const exerciseList = getExercisesForWorkout(workout.name);

  const [activeExIndex, setActiveExIndex] = useState<number | null>(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      
      if (activeExIndex !== null) {
        const currentEx = exerciseList[activeExIndex];
        if (currentSet < currentEx.sets) {
          setCurrentSet((prev) => prev + 1);
          setTimeLeft(getDurationInSeconds(currentEx.reps));
        } else {
          setCompletedExercises((prev) => ({
            ...prev,
            [currentEx.name]: true
          }));
          setActiveExIndex(null);
        }
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, activeExIndex, currentSet, exerciseList]);

  const handlePlayClick = (index: number, ex: any) => {
    if (activeExIndex === index) {
      setIsTimerRunning((prev) => !prev);
    } else {
      setActiveExIndex(index);
      setCurrentSet(1);
      setTimeLeft(getDurationInSeconds(ex.reps));
      setIsTimerRunning(true);
    }
  };

  const handleSkipSet = () => {
    if (activeExIndex === null) return;
    setIsTimerRunning(false);
    const currentEx = exerciseList[activeExIndex];
    if (currentSet < currentEx.sets) {
      setCurrentSet((prev) => prev + 1);
      setTimeLeft(getDurationInSeconds(currentEx.reps));
    } else {
      setCompletedExercises((prev) => ({
        ...prev,
        [currentEx.name]: true
      }));
      setActiveExIndex(null);
    }
  };

  const handleResetExercise = () => {
    if (activeExIndex === null) return;
    setIsTimerRunning(false);
    const currentEx = exerciseList[activeExIndex];
    setCurrentSet(1);
    setTimeLeft(getDurationInSeconds(currentEx.reps));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>SESSION DETAILS</Text>
          <Text style={styles.title} numberOfLines={1}>{workout.name}</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        
        {/* Workout Summary */}
        <GlassCard hover={false} style={styles.summaryCard}>
          {[
            { icon: Clock, label: workout.duration, color: '#2563EB' },
            { icon: Flame, label: `${workout.calories} cal`, color: '#F97316' },
            { icon: Target, label: `${exerciseList.length} ex.`, color: '#10B981' },
            { icon: Heart, label: '120 bpm', color: '#8B5CF6' }
          ].map(s => (
            <View key={s.label} style={styles.summaryCol}>
              <s.icon size={20} color={s.color} style={{ marginBottom: 4 }} />
              <Text style={styles.summaryText}>{s.label}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Exercises */}
        <View style={styles.exerciseList}>
          {exerciseList.map((ex, i) => {
            const isActive = activeExIndex === i;
            const isCompleted = !!completedExercises[ex.name];
            const imageSource = exerciseImageMap[ex.name] || exerciseImageMap['Jumping Jacks'];

            return (
              <GlassCard 
                key={ex.name} 
                hover={false} 
                style={[
                  styles.exCard, 
                  isActive && styles.exCardActive, 
                  isCompleted && !isActive && styles.exCardCompleted
                ]}
              >
                <View style={styles.exRow}>
                  <View style={[styles.checkCircle, isCompleted && styles.checkCircleDone]}>
                    {isCompleted && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
                  </View>

                  <View style={styles.iconBox}>
                    <Image source={imageSource} style={{ width: 34, height: 34, resizeMode: 'contain' }} />
                  </View>

                  <View style={styles.exInfo}>
                    <Text style={styles.exName}>{ex.name}</Text>
                    <View style={styles.exMetaRow}>
                      <Text style={styles.exMetaText}>{ex.sets} sets × {ex.reps}</Text>
                      <Text style={styles.exMetaText}>Rest: {ex.rest}</Text>
                    </View>
                    <View style={styles.muscleTags}>
                      {ex.muscles.map(m => (
                        <View key={m} style={styles.muscleTag}>
                          <Text style={styles.muscleTagText}>{m}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => handlePlayClick(i, ex)} style={[styles.playBtn, isActive && isTimerRunning && styles.playBtnActive]}>
                    {isActive && isTimerRunning ? (
                      <Pause size={18} color="#EF4444" />
                    ) : (
                      <Play size={18} color="#2563EB" style={{ marginLeft: isActive ? 0 : 2 }} />
                    )}
                  </TouchableOpacity>
                </View>

                {isActive && (
                  <View style={styles.trackerBox}>
                    <View style={styles.trackerRow}>
                      <View>
                        <Text style={styles.trackerLabel}>ACTIVE SET TRACKER</Text>
                        <Text style={styles.trackerValue}>Set {currentSet} <Text style={{ fontSize: 13, color: '#6B7280' }}>of {ex.sets}</Text></Text>
                      </View>
                      <View style={styles.timerBox}>
                        <Text style={styles.timerLabel}>COUNTDOWN</Text>
                        <Text style={styles.timerValue}>{timeLeft}s</Text>
                      </View>
                    </View>
                    <View style={styles.trackerActions}>
                      <GlassButton onPress={() => setIsTimerRunning(!isTimerRunning)} style={styles.actionBtn}>
                        <Text style={styles.actionText}>{isTimerRunning ? 'Pause' : 'Play'}</Text>
                      </GlassButton>
                      <GlassButton onPress={handleSkipSet} style={styles.actionBtn}>
                        <Text style={styles.actionText}>Skip Set</Text>
                      </GlassButton>
                      <GlassButton onPress={handleResetExercise} style={styles.actionBtn}>
                        <Text style={styles.actionText}>Reset</Text>
                      </GlassButton>
                    </View>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>

        {/* Checklist */}
        <GlassCard hover={false} style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>📋 Workout Progress</Text>
            <Text style={styles.checklistRatio}>
              ({Object.keys(completedExercises).length} of {exerciseList.length} done)
            </Text>
          </View>
          <View style={styles.checklistItems}>
            {exerciseList.map((ex) => {
              const isDone = !!completedExercises[ex.name];
              return (
                <View key={ex.name} style={[styles.checklistItem, isDone && styles.checklistItemDone]}>
                  <View style={[styles.checkCircleSmall, isDone && styles.checkCircleSmallDone]}>
                    {isDone && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
                  </View>
                  <Text style={[styles.checklistName, isDone && styles.checklistNameDone]}>{ex.name}</Text>
                  <Text style={styles.checklistMeta}>{ex.sets} sets</Text>
                </View>
              );
            })}
          </View>
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
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  summaryCol: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  exerciseList: {
    gap: 16,
    marginBottom: 24,
  },
  exCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  exCardActive: {
    borderColor: '#2563EB',
    borderWidth: 2,
  },
  exCardCompleted: {
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exInfo: {
    flex: 1,
  },
  exName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  exMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  exMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  muscleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  muscleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#EFF6FF',
  },
  muscleTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  trackerBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trackerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  trackerValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  timerBox: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  timerValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E40AF',
  },
  trackerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 40,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  checklistRatio: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  checklistItems: {
    gap: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checklistItemDone: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  checkCircleSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSmallDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checklistName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  checklistNameDone: {
    color: '#065F46',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  checklistMeta: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  }
});
