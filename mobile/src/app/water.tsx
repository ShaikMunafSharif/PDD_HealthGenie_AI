import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing, useAnimatedProps } from 'react-native-reanimated';
import Svg, { Rect, Path, Defs, LinearGradient, Stop, ClipPath } from 'react-native-svg';
import { Droplets, Plus, Minus, Target, Award, TrendingUp, Undo, Trash2, RotateCcw, ArrowLeft } from 'lucide-react-native';
import { BarChart } from 'react-native-chart-kit';
import { GlassCard, GlassButton, GlassInput, ProgressRing, AnimatedCounter } from '../components/ui/Components';
import { useWaterStore } from '../store/healthStore';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const { width } = Dimensions.get('window');
const TARGET_PRESETS = [2500, 3000, 3500, 4000, 4500];

export default function WaterTracker() {
  const router = useRouter();
  const { 
    currentIntake, dailyGoal, intakeLog, history, streak, 
    addIntake, subtractIntake, undoLastIntake, removeIntakeLogItem, 
    setDailyGoal, clearTodayIntake 
  } = useWaterStore();

  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    if (!dailyGoal || dailyGoal < 2000) {
      setDailyGoal(3500);
    }
  }, [dailyGoal]);

  const handleCustomAdd = () => {
    const val = parseInt(customAmount, 10);
    if (val && val > 0) {
      addIntake(val);
      setCustomAmount('');
    }
  };

  const pct = Math.min(100, (currentIntake / dailyGoal) * 100);
  const remaining = Math.max(0, dailyGoal - currentIntake);

  // Animation values for Water Bottle
  const fillHeight = useSharedValue(0);
  const fillY = useSharedValue(220);
  const waveOffset = useSharedValue(0);

  useEffect(() => {
    fillHeight.value = withSpring(pct * 1.8, { damping: 15, stiffness: 60 });
    fillY.value = withSpring(220 - (pct * 1.8), { damping: 15, stiffness: 60 });
    
    // Wave animation
    waveOffset.value = withRepeat(
      withTiming(20, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [pct]);

  const animatedWaterProps = useAnimatedProps(() => {
    return {
      height: fillHeight.value,
      y: fillY.value
    };
  });

  const animatedWaveProps = useAnimatedProps(() => {
    const y = fillY.value;
    const dy = waveOffset.value;
    return {
      d: `M 25 ${y} Q 45 ${y - 5 + (dy/4)} 60 ${y} T 95 ${y}`
    };
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = {
    labels: [] as string[],
    datasets: [{ data: [] as number[], colors: [] as any[] }]
  };
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    chartData.labels.push(daysOfWeek[d.getDay()]);
    
    if (i === 0) {
      chartData.datasets[0].data.push(currentIntake);
    } else {
      const pastEntry = history.find((h: any) => h.date === dateStr);
      chartData.datasets[0].data.push(pastEntry ? pastEntry.intake : 0);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>HYDRATION</Text>
          <Text style={styles.title}>Water Tracker</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)} style={styles.mainGrid}>
        
        {/* WATER BOTTLE CARD */}
        <GlassCard hover={false} style={styles.bottleCard}>
          <View style={styles.svgContainer}>
            <Svg viewBox="0 0 120 240" width="100%" height="100%">
              <Defs>
                <LinearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#06B6D4" stopOpacity="0.85" />
                  <Stop offset="100%" stopColor="#2563EB" stopOpacity="0.75" />
                </LinearGradient>
                <ClipPath id="bottleClip">
                  <Rect x="25" y="40" width="70" height="180" rx="12" />
                </ClipPath>
              </Defs>
              <Rect x="40" y="10" width="40" height="25" rx="6" fill="none" stroke="#2563EB" strokeWidth="2.5" />
              <Rect x="25" y="40" width="70" height="180" rx="12" fill="#F8FAFC" stroke="#2563EB" strokeWidth="2.5" />
              
              <AnimatedRect
                clipPath="url(#bottleClip)"
                x="25"
                width="70"
                fill="url(#waterGrad)"
                animatedProps={animatedWaterProps}
              />
              <AnimatedPath
                clipPath="url(#bottleClip)"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                animatedProps={animatedWaveProps}
              />
            </Svg>
            <View style={styles.pctOverlay}>
              <Text style={styles.pctText}>{Math.round(pct)}%</Text>
            </View>
          </View>

          <View style={styles.intakeStats}>
            <AnimatedCounter style={styles.currentIntake} value={currentIntake} suffix=" ml" />
            <Text style={styles.remainingText}>
              of {dailyGoal.toLocaleString()} ml • {remaining.toLocaleString()} ml remaining
            </Text>
          </View>

          {/* Quick Add */}
          <View style={styles.quickAddSection}>
            <Text style={styles.sectionLabel}>QUICK PRESET ADD</Text>
            <View style={styles.presetGrid}>
              {[250, 500, 750, 1000].map(ml => (
                <GlassButton key={ml} onPress={() => addIntake(ml)} variant="primary" style={styles.presetBtn}>
                  <Text style={styles.presetBtnText}>+{ml}ml</Text>
                </GlassButton>
              ))}
            </View>
          </View>

          {/* Custom Input */}
          <View style={styles.customInputSection}>
            <Text style={styles.sectionLabelBlue}>TYPE EXACT AMOUNT (ML)</Text>
            <View style={styles.customInputRow}>
              <GlassInput
                keyboardType="numeric"
                placeholder="e.g. 67"
                value={customAmount}
                onChangeText={setCustomAmount}
                style={{ flex: 1, marginBottom: 0 }}
              />
              <GlassButton variant="primary" onPress={handleCustomAdd} style={styles.addBtn}>
                <Plus size={16} color="#020510" />
                <Text style={styles.presetBtnText}>Add</Text>
              </GlassButton>
            </View>
          </View>

          {/* Quick Correct */}
          <View style={styles.correctSection}>
            <Text style={styles.sectionLabelRed}>CORRECT MISTAKEN LOGS</Text>
            <View style={styles.presetGrid}>
              <GlassButton onPress={() => subtractIntake(250)} disabled={currentIntake <= 0} style={styles.minusBtn}>
                <Text style={styles.minusBtnText}>-250ml</Text>
              </GlassButton>
              <GlassButton onPress={() => subtractIntake(500)} disabled={currentIntake <= 0} style={styles.minusBtn}>
                <Text style={styles.minusBtnText}>-500ml</Text>
              </GlassButton>
              <GlassButton onPress={undoLastIntake} disabled={intakeLog.length === 0} style={styles.undoBtn}>
                <Text style={styles.undoBtnText}>Undo</Text>
              </GlassButton>
            </View>
          </View>
        </GlassCard>

        {/* RIGHT COLUMN CARDS */}
        <View style={styles.rightColumn}>
          
          {/* Target Card */}
          <GlassCard hover={false} style={styles.card}>
            <View style={styles.targetHeader}>
              <View>
                <View style={styles.targetHeaderLeft}>
                  <Target size={18} color="#2563EB" />
                  <Text style={styles.cardTitle}>Daily Target</Text>
                </View>
                <Text style={styles.cardDesc}>Recommended: 3k - 4k ml</Text>
              </View>
              <ProgressRing value={currentIntake} max={dailyGoal} size={60} strokeWidth={5}>
                <Text style={styles.ringText}>{Math.round(pct)}%</Text>
              </ProgressRing>
            </View>

            <Text style={styles.labelMuted}>SELECT PRESET</Text>
            <View style={styles.targetPresets}>
              {TARGET_PRESETS.map(preset => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => setDailyGoal(preset)}
                  style={[styles.targetPresetBtn, dailyGoal === preset && styles.targetPresetBtnActive]}
                >
                  <Text style={[styles.targetPresetText, dailyGoal === preset && styles.targetPresetTextActive]}>
                    {(preset/1000).toFixed(1)}L
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customTargetRow}>
              <Text style={styles.customTargetLabel}>Fine-tune:</Text>
              <View style={styles.tunerControls}>
                <TouchableOpacity onPress={() => setDailyGoal(Math.max(1000, dailyGoal - 250))} style={styles.tunerBtn}>
                  <Minus size={14} color="#374151" />
                </TouchableOpacity>
                <Text style={styles.tunerValue}>{dailyGoal} ml</Text>
                <TouchableOpacity onPress={() => setDailyGoal(dailyGoal + 250)} style={styles.tunerBtn}>
                  <Plus size={14} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>

          {/* Streak Card */}
          <GlassCard hover={false} style={[styles.card, styles.streakCard]}>
            <View style={styles.streakIconBox}>
              <Award size={24} color="#D97706" />
            </View>
            <View>
              <Text style={styles.cardTitle}>Hydration Streak</Text>
              <Text style={styles.streakValue}>{streak} Days Active</Text>
            </View>
          </GlassCard>

          {/* Log Card */}
          <GlassCard hover={false} style={styles.card}>
            <View style={styles.logHeader}>
              <Text style={styles.cardTitle}>Today's Log</Text>
              {intakeLog.length > 0 && (
                <TouchableOpacity onPress={clearTodayIntake} style={styles.clearBtn}>
                  <RotateCcw size={12} color="#EF4444" />
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {intakeLog.length === 0 ? (
              <Text style={styles.emptyLog}>No intake logged yet today</Text>
            ) : (
              <View style={styles.logList}>
                {intakeLog.map((entry: any, idx: number) => (
                  <View key={entry.id || idx} style={styles.logItem}>
                    <Text style={styles.logAmount}>+{entry.amount} ml</Text>
                    <View style={styles.logRight}>
                      <Text style={styles.logTime}>
                        {new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <TouchableOpacity onPress={() => removeIntakeLogItem(idx)} style={styles.deleteBtn}>
                        <Trash2 size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )).reverse()}
              </View>
            )}
          </GlassCard>
          
        </View>
      </Animated.View>

      {/* CHART */}
      <Animated.View entering={FadeInUp.delay(300)} style={[styles.card, { marginTop: 24, marginBottom: 40 }]}>
        <View style={styles.chartHeader}>
          <TrendingUp size={20} color="#2563EB" />
          <Text style={styles.cardTitle}>Weekly Intake History</Text>
        </View>
        <BarChart
          data={chartData}
          width={width - 72}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
            barPercentage: 0.6,
          }}
          style={{ marginVertical: 16, borderRadius: 16 }}
          showValuesOnTopOfBars
        />
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
  mainGrid: {
    flexDirection: 'column',
    gap: 20,
  },
  bottleCard: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  svgContainer: {
    width: 140,
    height: 280,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pctOverlay: {
    position: 'absolute',
    top: '55%',
  },
  pctText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  intakeStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentIntake: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
  },
  remainingText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionLabelBlue: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionLabelRed: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 12,
  },
  quickAddSection: {
    width: '100%',
    marginTop: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  presetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  presetBtnText: {
    color: '#020510',
    fontSize: 13,
    fontWeight: '700',
  },
  customInputSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 6,
  },
  correctSection: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  minusBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  minusBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  undoBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  undoBtnText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  rightColumn: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  ringText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  labelMuted: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 8,
  },
  targetPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  targetPresetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  targetPresetBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  targetPresetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  targetPresetTextActive: {
    color: '#FFFFFF',
  },
  customTargetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  customTargetLabel: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  tunerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tunerBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tunerValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  streakIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#D97706',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  emptyLog: {
    fontSize: 12,
    color: '#6B7280',
  },
  logList: {
    gap: 8,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  logAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  logRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  deleteBtn: {
    padding: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  }
});
