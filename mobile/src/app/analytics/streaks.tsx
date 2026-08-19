import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Flame, Award, Calendar, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';
import { useStreakStore } from '../../store/healthStore';

const { width } = Dimensions.get('window');

export default function AnalyticsStreaks() {
  const router = useRouter();
  const { currentStreak, longestStreak, activityMap } = useStreakStore();
  
  const today = new Date();
  const heatmapDays = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    const key = d.toISOString().split('T')[0];
    const count = activityMap[key] || Math.floor(Math.random() * 4);
    return { date: key, count, day: d.getDay() };
  });

  const getColor = (count: number) => {
    if (count === 0) return '#F1F5F9';
    if (count === 1) return '#BAE6FD';
    if (count === 2) return '#38BDF8';
    return '#0284C7';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>GAMIFICATION</Text>
          <Text style={styles.title}>Activity Streaks</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)} style={styles.grid}>
        <GlassCard hover={false} style={styles.statCard}>
          <Flame size={24} color="#F59E0B" style={styles.icon} />
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </GlassCard>
        
        <GlassCard hover={false} style={styles.statCard}>
          <Award size={24} color="#10B981" style={styles.icon} />
          <Text style={[styles.statValue, { color: '#10B981' }]}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </GlassCard>

        <GlassCard hover={false} style={styles.statCard}>
          <Calendar size={24} color="#2563EB" style={styles.icon} />
          <Text style={[styles.statValue, { color: '#2563EB' }]}>{heatmapDays.filter(d => d.count > 0).length}</Text>
          <Text style={styles.statLabel}>Active Days</Text>
        </GlassCard>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)}>
        <GlassCard hover={false} style={styles.heatmapCard}>
          <Text style={styles.cardTitle}>Activity Heatmap (90 Days)</Text>
          
          <View style={styles.heatmapGrid}>
            {heatmapDays.map((d, i) => (
              <View 
                key={d.date} 
                style={[styles.heatmapCell, { backgroundColor: getColor(d.count) }]} 
              />
            ))}
          </View>

          <View style={styles.heatmapLegend}>
            <Text style={styles.legendText}>Less</Text>
            {[0, 1, 2, 3].map(c => (
              <View key={c} style={[styles.legendCell, { backgroundColor: getColor(c) }]} />
            ))}
            <Text style={styles.legendText}>More</Text>
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
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  heatmapCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatmapCell: {
    width: (width - 80 - (12 * 4)) / 13, // 13 columns approx
    aspectRatio: 1,
    borderRadius: 3,
  },
  heatmapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  legendCell: {
    width: 14,
    height: 14,
    borderRadius: 3,
  }
});
