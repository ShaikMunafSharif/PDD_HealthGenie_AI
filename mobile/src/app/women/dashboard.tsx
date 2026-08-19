import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Heart, Calendar, BarChart3, Sparkles, Apple, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useWomenStore } from '../../store/healthStore';

const modules = [
  { path: '/women/period-tracker', icon: Calendar, label: 'Period Tracker', desc: 'Track your cycle and predict next period', icon2: '🌸' },
  { path: '/women/period-insights', icon: BarChart3, label: 'Cycle Insights', desc: 'AI-powered pattern analysis', icon2: '📊' },
  { path: '/women/pcos-care', icon: Heart, label: 'PCOS Care', desc: 'Personalized PCOS management', icon2: '💜' },
  { path: '/women/skin-care', icon: Sparkles, label: 'Skin Care', desc: 'Hormone-synced skincare tips', icon2: '✨' },
  { path: '/women/diet', icon: Apple, label: "Women's Nutrition", desc: 'Iron, calcium & hormone-aware diet', icon2: '🥗' },
];

export default function WomenDashboard() {
  const router = useRouter();
  const { lastPeriodStart, getCycleDay, getNextPeriod } = useWomenStore();

  const cycleDay = getCycleDay();
  const nextPeriod = getNextPeriod();

  let titleText = 'No Cycle Logged';
  let descText = 'Track your period cycle to enable daily hormone-synced tips and predictions.';

  if (lastPeriodStart && cycleDay) {
    titleText = `Cycle Day ${cycleDay}`;
    
    let phaseName = 'Follicular Phase';
    if (cycleDay <= 5) phaseName = 'Menstrual Phase';
    else if (cycleDay <= 11) phaseName = 'Follicular Phase';
    else if (cycleDay <= 16) phaseName = 'Ovulation Phase';
    else phaseName = 'Luteal Phase';

    const daysToNext = nextPeriod ? Math.max(0, Math.ceil((new Date(nextPeriod).getTime() - Date.now()) / 86400000)) : null;
    const countdownStr = daysToNext !== null ? ` • Next period in ~${daysToNext} day${daysToNext === 1 ? '' : 's'}` : '';
    
    descText = `${phaseName}${countdownStr}`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>WOMEN'S HEALTH</Text>
          <Text style={styles.title} numberOfLines={1}>Your Wellness Hub</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroIconBox}>
              <Heart size={28} color="#EC4899" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{titleText}</Text>
              <Text style={styles.heroDesc}>{descText}</Text>
            </View>
          </View>
          <GlassButton 
            onPress={() => router.push('/women/period-tracker')} 
            style={styles.heroBtn}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.heroBtnText}>Track Cycle</Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </View>
          </GlassButton>
        </GlassCard>

        <View style={styles.grid}>
          {modules.map((mod, i) => (
            <Animated.View key={mod.path} entering={FadeInUp.delay(200 + i * 50)} style={styles.gridItemWrapper}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(mod.path as any)}>
                <GlassCard hover={false} style={styles.gridItem}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemIconBox}>
                      <Text style={{ fontSize: 24 }}>{mod.icon2}</Text>
                    </View>
                    <Text style={styles.itemTitle}>{mod.label}</Text>
                  </View>
                  <Text style={styles.itemDesc}>{mod.desc}</Text>
                </GlassCard>
              </TouchableOpacity>
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
  heroCard: {
    backgroundColor: '#FDF2F8',
    borderColor: '#FBCFE8',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FCE7F3',
    borderColor: '#FBCFE8',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  heroBtn: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  grid: {
    gap: 16,
    paddingBottom: 20,
  },
  gridItemWrapper: {
    width: '100%',
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  itemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  }
});
