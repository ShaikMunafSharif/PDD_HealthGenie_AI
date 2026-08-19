import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { TrendingUp, Droplets, Flame, Moon, Footprints, ArrowLeft } from 'lucide-react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { GlassCard } from '../../components/ui/Components';

const { width } = Dimensions.get('window');
const chartWidth = (width - 40 - 16) / 2; // two columns with gap

const healthData = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  score: 55 + Math.floor(Math.random() * 30),
  water: 1500 + Math.floor(Math.random() * 1200),
  steps: 4000 + Math.floor(Math.random() * 8000),
  sleep: 5 + Math.random() * 4
}));

export default function AnalyticsProgress() {
  const router = useRouter();

  const scoreChartData = { labels: [], datasets: [{ data: healthData.map(d => d.score), color: () => '#2563EB' }] };
  const waterChartData = { labels: [], datasets: [{ data: healthData.map(d => d.water), color: () => '#06B6D4' }] };
  const stepsChartData = { labels: [], datasets: [{ data: healthData.map(d => d.steps), color: () => '#10B981' }] };
  const sleepChartData = { labels: [], datasets: [{ data: healthData.map(d => d.sleep), color: () => '#8B5CF6' }] };

  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    propsForDots: { r: '0' },
    propsForBackgroundLines: { stroke: 'transparent' },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>ANALYTICS</Text>
          <Text style={styles.title}>Progress Dashboard</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <Animated.View entering={FadeInUp.delay(100)} style={styles.col}>
          <GlassCard hover={false} style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp size={16} color="#00F5FF" />
              <Text style={styles.cardTitle}>Health Score</Text>
            </View>
            <LineChart
              data={scoreChartData}
              width={chartWidth}
              height={120}
              chartConfig={chartConfig}
              bezier
              withHorizontalLabels={false}
              withVerticalLabels={false}
              style={styles.chart}
            />
          </GlassCard>

          <GlassCard hover={false} style={styles.card}>
            <View style={styles.cardHeader}>
              <Footprints size={16} color="#39FF14" />
              <Text style={styles.cardTitle}>Daily Steps</Text>
            </View>
            <LineChart
              data={stepsChartData}
              width={chartWidth}
              height={120}
              chartConfig={chartConfig}
              bezier
              withHorizontalLabels={false}
              withVerticalLabels={false}
              style={styles.chart}
            />
          </GlassCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.col}>
          <GlassCard hover={false} style={styles.card}>
            <View style={styles.cardHeader}>
              <Droplets size={16} color="#00F5FF" />
              <Text style={styles.cardTitle}>Water Intake</Text>
            </View>
            <BarChart
              data={waterChartData}
              width={chartWidth}
              height={120}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{ ...chartConfig, fillShadowGradientOpacity: 1, fillShadowGradient: '#00F5FF' }}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              style={styles.chart}
            />
          </GlassCard>

          <GlassCard hover={false} style={styles.card}>
            <View style={styles.cardHeader}>
              <Moon size={16} color="#BF5FFF" />
              <Text style={styles.cardTitle}>Sleep Hours</Text>
            </View>
            <BarChart
              data={sleepChartData}
              width={chartWidth}
              height={120}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{ ...chartConfig, fillShadowGradientOpacity: 1, fillShadowGradient: '#BF5FFF' }}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              style={styles.chart}
            />
          </GlassCard>
        </Animated.View>
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
  },
  col: {
    width: '48%',
    gap: 16,
  },
  card: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  chart: {
    marginLeft: -20,
  }
});
