import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import {
  Activity, Droplets, Apple, Dumbbell, Stethoscope, AlertTriangle,
  Heart, Baby, Bell, Footprints, Moon, Flame, Sparkles,
  HeartPulse, ArrowRight, TrendingUp, ShieldCheck, Zap,
  Clock, BarChart3, CheckCircle2, Download
} from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { GlassCard, GlassButton, ProgressRing, AnimatedCounter, StreakBadge } from '../../components/ui/Components';
import { useHealthStore, useWaterStore, useAuthStore, useStreakStore } from '../../store/healthStore';

const { width } = Dimensions.get('window');

const moduleCards = [
  { path: '/symptoms', icon: Stethoscope, label: 'Symptom Analysis', desc: 'AI-powered health check', color: '#2563EB', bg: '#EFF6FF' },
  { path: '/(tabs)/diet', icon: Apple, label: 'Diet & Nutrition', desc: 'Personalized meal plans', color: '#10B981', bg: '#ECFDF5' },
  { path: '/exercise', icon: Dumbbell, label: 'Workout Plan', desc: 'Custom routines', color: '#3B82F6', bg: '#EFF6FF' },
  { path: '/water', icon: Droplets, label: 'Water Hydration', desc: 'Track fluid intake', color: '#06B6D4', bg: '#CFFAFE' },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", desc: 'Period & PCOS care', color: '#8B5CF6', bg: '#F3E8FF' },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy Care', desc: 'Maternal tracking', color: '#F59E0B', bg: '#FEF3C7' },
  { path: '/(tabs)/sos', icon: AlertTriangle, label: 'Emergency Hub', desc: 'SOS alerts', color: '#EF4444', bg: '#FEF2F2' },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid Guides', desc: 'Step-by-step care', color: '#F97316', bg: '#FFEDD5' },
];

const weeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    { data: [78, 82, 80, 85, 88, 84, 89], color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, strokeWidth: 3 }, // Score
  ],
};

export default function Dashboard() {
  const router = useRouter();
  const { healthScore, categories, dailyStats } = useHealthStore();
  const { currentIntake, dailyGoal } = useWaterStore();
  const user = useAuthStore(s => s.user);
  const { currentStreak } = useStreakStore();

  const filteredModuleCards = useMemo(() => {
    return moduleCards.filter(card => {
      if (card.path === '/women/dashboard' || card.path === '/pregnancy/dashboard') {
        return user?.gender === 'female';
      }
      return true;
    });
  }, [user]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const scoreColor = healthScore >= 80 ? '#10B981' : healthScore >= 50 ? '#2563EB' : '#8B5CF6';

  const stats = [
    { icon: Footprints, label: 'Steps', value: dailyStats.steps, target: 10000, unit: '', trend: '+12%', color: '#2563EB', bg: '#EFF6FF' },
    { icon: Droplets, label: 'Water', value: currentIntake, target: dailyGoal, unit: 'ml', trend: `${Math.round((currentIntake / dailyGoal) * 100)}%`, color: '#06B6D4', bg: '#CFFAFE' },
    { icon: Flame, label: 'Calories', value: dailyStats.calories, target: 2200, unit: 'cal', trend: '+15%', color: '#F97316', bg: '#FFEDD5' },
    { icon: Moon, label: 'Sleep', value: dailyStats.sleep, target: 8, unit: 'hr', trend: '92%', color: '#8B5CF6', bg: '#F3E8FF' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DASHBOARD OVERVIEW</Text>
          <Text style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0] || 'User'} 👋</Text>
          <Text style={styles.subtitle}>Here is your personal health intelligence.</Text>
        </View>
        <View style={styles.headerActions}>
          <StreakBadge count={currentStreak} />
        </View>
      </Animated.View>

      {/* HEALTH SCORE HERO */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
        <GlassCard hover={false} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <ProgressRing value={healthScore} size={110} strokeWidth={8} color={scoreColor} bgColor="#F1F5F9">
              <Text style={styles.scoreNumber}>{healthScore}</Text>
              <Text style={styles.scoreLabel}>OUT OF 100</Text>
            </ProgressRing>
            
            <View style={styles.heroInfo}>
              <View style={[styles.statusBadge, { backgroundColor: healthScore >= 80 ? '#ECFDF5' : '#EFF6FF', borderColor: healthScore >= 80 ? '#A7F3D0' : '#BFDBFE' }]}>
                <ShieldCheck size={14} color={scoreColor} />
                <Text style={[styles.statusText, { color: scoreColor }]}>
                  {healthScore >= 80 ? 'Optimal Health' : healthScore >= 60 ? 'Good Condition' : 'Needs Attention'}
                </Text>
              </View>
              <Text style={styles.heroTitle}>Overall Health Index</Text>
              <Text style={styles.heroDesc}>Calculated from your sleep, steps, hydration, and nutrition.</Text>
            </View>
          </View>

          <View style={styles.heroBottom}>
            <View style={styles.heroStats}>
              <Text style={styles.heroStatText}><CheckCircle2 size={14} color="#10B981" /> 85% met</Text>
              <Text style={styles.heroStatTrend}><TrendingUp size={12} color="#10B981" /> +5% week</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <GlassButton variant="primary" style={{ paddingHorizontal: 16, paddingVertical: 8 }} onPress={() => router.push('/analytics/health-report' as any)}>
                <Text style={styles.btnTextPrimary}>Report</Text>
              </GlassButton>
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {/* AI INSIGHT */}
      <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
        <GlassCard hover={false} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiHeaderLeft}>
              <View style={styles.aiIconWrapper}><Sparkles size={16} color="#FFF" /></View>
              <View>
                <Text style={styles.aiTitle}>AI Intelligence</Text>
                <Text style={styles.aiSubtitle}>Engineered by HealthGenie</Text>
              </View>
            </View>
            <View style={styles.aiTag}><Text style={styles.aiTagText}>98% Conf</Text></View>
          </View>
          <Text style={styles.aiMessage}>
            {healthScore >= 80
              ? "Great job maintaining strong vitals! Consider adding an extra 250ml of water to complete today's streak."
              : "You are making steady progress today. To reach an optimal score, aim for a short 15-minute walk."}
          </Text>
          <View style={styles.aiActionBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color="#2563EB" />
              <View>
                <Text style={styles.aiActionLabel}>RECOMMENDED</Text>
                <Text style={styles.aiActionValue}>Log 250ml Water</Text>
              </View>
            </View>
            <GlassButton variant="primary" onPress={() => router.push('/water')} style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={styles.btnTextPrimary}>Do It</Text>
            </GlassButton>
          </View>
        </GlassCard>
      </Animated.View>

      {/* STATS GRID */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.statsGrid}>
        {stats.map((stat, i) => {
          const path = stat.label === 'Water' ? '/water' : stat.label === 'Steps' ? '/exercise' : stat.label === 'Calories' ? '/(tabs)/diet' : '/health-score';
          return (
            <View key={stat.label} style={styles.statWrapper}>
              <GlassCard hover={true} onPress={() => router.push(path as any)} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <View style={[styles.statIconBox, { backgroundColor: stat.bg }]}><stat.icon size={18} color={stat.color} /></View>
                  <View style={styles.statTrendBox}><Text style={styles.statTrend}>{stat.trend}</Text></View>
                </View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statValueRow}>
                  <AnimatedCounter style={styles.statValue} value={stat.value} />
                  <Text style={styles.statTarget}>/{stat.target}{stat.unit}</Text>
                </View>
                <View style={styles.statBarBg}>
                  <View style={[styles.statBarFill, { backgroundColor: stat.color, width: `${Math.min(100, (stat.value / stat.target) * 100)}%` }]} />
                </View>
              </GlassCard>
            </View>
          );
        })}
      </Animated.View>

      {/* CHARTS & CATEGORIES */}
      <Animated.View entering={FadeInUp.delay(500)} style={styles.section}>
        <GlassCard hover={false} style={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Weekly Health Trends</Text>
          <LineChart
            data={weeklyData}
            width={width - 72}
            height={200}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" }
            }}
            bezier
            style={{ marginVertical: 16, borderRadius: 16 }}
            withVerticalLines={false}
          />
        </GlassCard>
      </Animated.View>

      {/* MODULES */}
      <Animated.View entering={SlideInRight.delay(600)} style={styles.section}>
        <Text style={styles.sectionTitleMain}>Health Modules</Text>
        <View style={styles.modulesGrid}>
          {filteredModuleCards.map(mod => (
            <View key={mod.label} style={styles.moduleWrapper}>
              <GlassCard onPress={() => router.push(mod.path as any)} hover={true} style={styles.moduleCard}>
                <View style={[styles.moduleIconBox, { backgroundColor: mod.bg }]}>
                  <mod.icon size={20} color={mod.color} />
                </View>
                <Text style={styles.moduleLabel}>{mod.label}</Text>
                <Text style={styles.moduleDesc} numberOfLines={2}>{mod.desc}</Text>
              </GlassCard>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* SCHEDULE */}
      <Animated.View entering={FadeInUp.delay(700)} style={[styles.section, { marginBottom: 40 }]}>
        <GlassCard hover={false} style={{ padding: 16 }}>
          <View style={styles.scheduleHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Bell size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
            </View>
          </View>
          <View style={styles.scheduleList}>
            {[
              { time: '12:30 PM', task: 'Hydration Intake', tag: 'Water', color: '#06B6D4', bg: '#CFFAFE' },
              { time: '01:30 PM', task: 'Low-Carb Lunch', tag: 'Diet', color: '#10B981', bg: '#ECFDF5' },
            ].map((item, idx) => (
              <View key={idx} style={styles.scheduleItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Clock size={16} color="#6B7280" />
                  <View>
                    <Text style={styles.scheduleTask}>{item.task}</Text>
                    <Text style={styles.scheduleTime}>Scheduled for {item.time}</Text>
                  </View>
                </View>
                <View style={[styles.scheduleTag, { backgroundColor: item.bg }]}>
                  <Text style={[styles.scheduleTagText, { color: item.color }]}>{item.tag}</Text>
                </View>
              </View>
            ))}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  section: {
    marginBottom: 20,
  },
  heroCard: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  heroInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  heroBottom: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroStatText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  heroStatTrend: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  btnTextPrimary: {
    color: '#020510',
    fontSize: 13,
    fontWeight: '600',
  },
  aiCard: {
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  aiSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },
  aiTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  aiMessage: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
    marginBottom: 16,
  },
  aiActionBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aiActionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  aiActionValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  statCard: {
    padding: 14,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTrendBox: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statTrend: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statTarget: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statBarBg: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  sectionTitleMain: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  moduleCard: {
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  moduleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moduleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  moduleDesc: {
    fontSize: 11,
    color: '#6B7280',
  },
  scheduleHeader: {
    marginBottom: 16,
  },
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleTask: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  scheduleTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  scheduleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scheduleTagText: {
    fontSize: 10,
    fontWeight: '700',
  }
});
