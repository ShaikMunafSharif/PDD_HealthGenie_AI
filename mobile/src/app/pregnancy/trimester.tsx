import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

const trimesters = [
  { num: 1, weeks: 'Weeks 1-12', title: 'First Trimester', icon: '🌱', color: '#10B981', milestones: ['Baby\'s heart begins beating (week 6)', 'Brain and nervous system developing', 'All major organs begin forming', 'Baby is about 2.5 inches by end'] },
  { num: 2, weeks: 'Weeks 13-26', title: 'Second Trimester', icon: '🌸', color: '#F59E0B', milestones: ['Baby can hear your voice (week 18)', 'First movements felt (quickening)', 'Fingerprints are forming', 'Baby weighs about 2 pounds by end'] },
  { num: 3, weeks: 'Weeks 27-40', title: 'Third Trimester', icon: '🌟', color: '#F97316', milestones: ['Baby\'s lungs mature for breathing', 'Rapid brain development', 'Baby drops into birth position', 'Full term at 39-40 weeks'] },
];

export default function PregnancyTrimester() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>OVERVIEW</Text>
          <Text style={styles.title} numberOfLines={1}>Trimester Guide</Text>
        </View>
      </View>

      <View style={styles.timelineContainer}>
        <View style={styles.timelineLine} />
        
        {trimesters.map((t, i) => (
          <Animated.View key={t.num} entering={FadeInUp.delay(100 + i * 150)} style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: t.color }]} />
            
            <GlassCard hover={false} style={[styles.card, { borderColor: `${t.color}30` }]}>
              <View style={styles.cardHeader}>
                <Text style={{ fontSize: 32 }}>{t.icon}</Text>
                <View>
                  <Text style={styles.cardTitle}>{t.title}</Text>
                  <Text style={[styles.cardWeeks, { color: t.color }]}>{t.weeks}</Text>
                </View>
              </View>
              <View style={styles.milestonesList}>
                {t.milestones.map((m, j) => (
                  <View key={j} style={styles.milestoneRow}>
                    <View style={[styles.milestoneDot, { backgroundColor: t.color }]} />
                    <Text style={styles.milestoneText}>{m}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>
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
    marginBottom: 30,
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
  timelineContainer: {
    position: 'relative',
    paddingLeft: 20,
    paddingBottom: 40,
  },
  timelineLine: {
    position: 'absolute',
    left: 8,
    top: 20,
    bottom: 20,
    width: 2,
    backgroundColor: '#FDE68A',
  },
  timelineItem: {
    position: 'relative',
    marginBottom: 24,
  },
  timelineDot: {
    position: 'absolute',
    left: -17,
    top: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardWeeks: {
    fontSize: 13,
    fontWeight: '700',
  },
  milestonesList: {
    gap: 12,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  milestoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  milestoneText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    flex: 1,
  }
});
