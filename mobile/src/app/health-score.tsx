import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, TrendingUp, Award, Sparkles, ArrowRight, ShieldCheck, Activity, Flame, Droplet, Moon, Heart } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { GlassCard, GlassButton, ProgressRing } from '../components/ui/Components';
import { useHealthStore } from '../store/healthStore';
import { streamHealthGenie } from '../services/ollamaService';

const { width } = Dimensions.get('window');

const trendData = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
  datasets: [
    {
      data: [65, 70, 68, 75, 78, 84],
      color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
      strokeWidth: 3,
    },
  ],
};

export default function HealthScoreScreen() {
  const router = useRouter();
  const { healthScore, categories, achievements } = useHealthStore();

  const scoreColor = healthScore >= 80 ? '#10B981' : healthScore >= 50 ? '#2563EB' : '#8B5CF6';

  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAIInsights = async () => {
    setLoading(true);
    setInsights('');

    const prompt = `Analyze my health score profile and suggest improvements. My overall health score is ${healthScore}. Detailed categories: ${JSON.stringify(categories)}. Provide 2 specific actionable health tips. Keep it concise.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'healthScore')) {
        setInsights(chunk.full);
        setLoading(false);
      }
    } catch (err) {
      setInsights("Maintain a consistent daily sleep schedule, prioritize hydration with 2.5L+ water daily, and engage in 30 minutes of moderate activity to optimize your overall health score.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [healthScore]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>ANALYTICS</Text>
          <Text style={styles.title}>Health Score Overview</Text>
        </View>
      </View>

      {/* Main Score Hero Card */}
      <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
        <GlassCard hover={false} style={styles.heroCard}>
          <ProgressRing value={healthScore} size={160} strokeWidth={10} color={scoreColor} bgColor="#F1F5F9">
            <Text style={styles.scoreNumber}>{healthScore}</Text>
            <Text style={styles.scoreLabel}>OUT OF 100</Text>
          </ProgressRing>

          <View style={[styles.statusBadge, { backgroundColor: healthScore >= 80 ? '#ECFDF5' : '#EFF6FF', borderColor: healthScore >= 80 ? '#A7F3D0' : '#BFDBFE' }]}>
            <ShieldCheck size={14} color={scoreColor} />
            <Text style={[styles.statusText, { color: scoreColor }]}>
              {healthScore >= 80 ? 'Optimal Health Index' : healthScore >= 60 ? 'Good Health Status' : 'Attention Recommended'}
            </Text>
          </View>

          <Text style={styles.heroDesc}>
            Calculated from your sleep, step count, hydration intake, and nutrition metrics.
          </Text>
        </GlassCard>
      </Animated.View>

      {/* 30-Day Health Trend Chart */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
        <GlassCard hover={false} style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
          <View style={styles.cardHeaderRow}>
            <TrendingUp size={20} color="#2563EB" />
            <Text style={styles.cardTitle}>30-Day Health Trend</Text>
          </View>
          <LineChart
            data={trendData}
            width={width - 72}
            height={180}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" },
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
            withVerticalLines={false}
          />
        </GlassCard>
      </Animated.View>

      {/* Category Metric Breakdown */}
      <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.cardTitle}>Detailed Metric Scores</Text>
          {Object.entries(categories || {}).map(([key, val]: any) => {
            const barColor = val >= 80 ? '#10B981' : val >= 50 ? '#2563EB' : '#F59E0B';
            return (
              <View key={key} style={styles.catItem}>
                <View style={styles.catRow}>
                  <Text style={styles.catName}>{key}</Text>
                  <Text style={[styles.catVal, { color: barColor }]}>{val}/100</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${val}%`, backgroundColor: barColor }]} />
                </View>
              </View>
            );
          })}
        </GlassCard>
      </Animated.View>

      {/* Achievements Grid */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Award size={20} color="#F59E0B" />
            <Text style={styles.cardTitle}>Unlocked Achievements</Text>
          </View>

          <View style={styles.achievementsGrid}>
            {(achievements || []).map((a: any) => (
              <View
                key={a.id}
                style={[
                  styles.achieveCard,
                  a.unlocked ? styles.achieveUnlocked : styles.achieveLocked
                ]}
              >
                <Text style={styles.achieveIcon}>{a.icon}</Text>
                <Text style={[styles.achieveName, { color: a.unlocked ? '#1E40AF' : '#6B7280' }]}>
                  {a.name}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </Animated.View>

      {/* AI Powered Insights */}
      <Animated.View entering={FadeInUp.delay(500)} style={[styles.section, { marginBottom: 40 }]}>
        <GlassCard hover={false} style={styles.aiCard}>
          <View style={styles.cardHeaderRow}>
            <Sparkles size={18} color="#2563EB" />
            <Text style={styles.aiEyebrow}>AI-POWERED INSIGHTS</Text>
          </View>

          <Text style={styles.aiBody}>
            {loading ? "HealthGenie AI is evaluating your vital metrics..." : insights}
          </Text>

          <GlassButton
            variant="primary"
            fullWidth
            onPress={() => router.push('/analytics/progress' as any)}
            style={{ marginTop: 16 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.btnText}>View Analytics Progress</Text>
              <ArrowRight size={16} color="#020510" />
            </View>
          </GlassButton>
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
  section: {
    marginBottom: 20,
  },
  heroCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  scoreNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#111827',
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  heroDesc: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  catItem: {
    marginBottom: 14,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  catVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  achieveCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achieveUnlocked: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
  },
  achieveLocked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    opacity: 0.5,
  },
  achieveIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  achieveName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  aiCard: {
    padding: 20,
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
    borderRadius: 24,
  },
  aiEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  aiBody: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 22,
    fontWeight: '500',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#020510',
  },
});
