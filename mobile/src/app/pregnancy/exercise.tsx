import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

const exercises = [
  { name: 'Walking', duration: '30 min', safe: 'All trimesters', icon: '🚶‍♀️', desc: 'Low-impact cardio that\'s safe throughout pregnancy' },
  { name: 'Prenatal Yoga', duration: '25 min', safe: 'All trimesters', icon: '🧘', desc: 'Improves flexibility, reduces stress, prepares for labor' },
  { name: 'Swimming', duration: '30 min', safe: 'All trimesters', icon: '🏊', desc: 'Takes weight off joints, excellent full-body workout' },
  { name: 'Pelvic Floor Exercises', duration: '10 min', safe: 'All trimesters', icon: '💪', desc: 'Strengthens muscles for labor and postpartum recovery' },
  { name: 'Gentle Stretching', duration: '15 min', safe: 'All trimesters', icon: '🤸', desc: 'Relieves tension and improves circulation' },
  { name: 'Stationary Cycling', duration: '20 min', safe: 'T1 & T2', icon: '🚴', desc: 'Low-impact cardio, avoid if balance becomes an issue' },
];

export default function PregnancyExercise() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>FITNESS</Text>
          <Text style={styles.title} numberOfLines={1}>Safe Exercises</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.warningCard}>
          <Text style={styles.warningText}>
            ⚠️ Always consult your OB-GYN before starting any exercise routine during pregnancy. Stop if you feel pain, dizziness, or shortness of breath.
          </Text>
        </GlassCard>

        <View style={styles.grid}>
          {exercises.map((ex, i) => (
            <Animated.View key={ex.name} entering={FadeInUp.delay(200 + i * 50)} style={styles.gridItemWrapper}>
              <GlassCard hover={false} style={styles.exerciseCard}>
                <View style={styles.exHeader}>
                  <Text style={{ fontSize: 24 }}>{ex.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exTitle}>{ex.name}</Text>
                    <View style={styles.tagWrap}>
                      <Text style={styles.tagText}>{ex.safe}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.exDesc}>{ex.desc}</Text>
                <View style={styles.timeRow}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.timeText}>{ex.duration}</Text>
                </View>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
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
  warningCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 13,
    color: '#D97706',
    lineHeight: 20,
    fontWeight: '500',
  },
  grid: {
    gap: 16,
    paddingBottom: 40,
  },
  gridItemWrapper: {
    width: '100%',
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  exTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  tagWrap: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tagText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
  },
  exDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  }
});
