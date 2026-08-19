import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { GlassCard } from '../../components/ui/Components';
import { streamHealthGenie } from '../../services/ollamaService';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const { width } = Dimensions.get('window');

export default function PeriodInsights() {
  const router = useRouter();
  const { periodLog, cycleLength } = useWomenStore();
  const { user } = useAuthStore();

  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);

  const weightNum = parseFloat(user?.weight || '0');
  const heightNum = parseFloat(user?.height || '0');
  const bmi = (weightNum && heightNum) ? (weightNum / ((heightNum / 100) ** 2)) : null;

  const dynamicSymptomData = useMemo(() => {
    if (!periodLog || periodLog.length === 0) {
      return [
        { symptom: 'Cramps', frequency: 80 },
        { symptom: 'Headache', frequency: 45 },
        { symptom: 'Bloating', frequency: 65 },
        { symptom: 'Fatigue', frequency: 55 },
        { symptom: 'Mood Swings', frequency: 70 }
      ];
    }
    const counts: Record<string, number> = {};
    let totalDaysLogged = periodLog.length;
    periodLog.forEach((log: any) => {
      if (log.symptoms) {
        log.symptoms.forEach((s: any) => {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });
    
    const keys = Object.keys(counts);
    if (keys.length === 0) {
      return [
        { symptom: 'Cramps', frequency: 0 },
        { symptom: 'Headache', frequency: 0 },
        { symptom: 'Bloating', frequency: 0 },
        { symptom: 'Fatigue', frequency: 0 },
        { symptom: 'Mood Swings', frequency: 0 }
      ];
    }
    
    return keys.map(s => ({
      symptom: s,
      frequency: Math.round((counts[s] / totalDaysLogged) * 100)
    })).sort((a, b) => b.frequency - a.frequency);
  }, [periodLog]);

  const dynamicCycleData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: [
        {
          data: months.map((_, idx) => {
            const variation = ((idx * 7 + 3) % 5) - 2; 
            return (cycleLength || 28) + variation;
          })
        }
      ]
    };
  }, [cycleLength]);

  const getImmediateInsights = (symptomListStr: string) => {
    const bmiStr = bmi ? ` (BMI: ${bmi.toFixed(1)})` : '';
    const ageStr = user?.age ? `, Age ${user?.age} yrs` : '';
    const weightFocus = bmi && bmi >= 25 
      ? "Given your BMI, optimizing glycemic control and nutrition is key."
      : "For a lean profile, focus on cortisol control and stress reduction to balance cycle health.";
    
    return `Cycle Insights: Based on your average cycle length of ${cycleLength} days ${symptomListStr ? `with logged symptoms (${symptomListStr})` : ''}${ageStr}${bmiStr}, we recommend monitoring energy patterns. ${weightFocus} Prioritize rest and hydration.`;
  };

  const fetchCycleInsights = async () => {
    const loggedSymptoms: Record<string, number> = {};
    periodLog.forEach((log: any) => {
      if (log.symptoms) {
        log.symptoms.forEach((s: any) => {
          loggedSymptoms[s] = (loggedSymptoms[s] || 0) + 1;
        });
      }
    });

    const symptomListStr = Object.entries(loggedSymptoms).map(([name]) => name).join(', ');
    const baseInsights = getImmediateInsights(symptomListStr);
    
    setInsights(baseInsights);
    setLoading(false);

    const bmiStr = bmi ? `, BMI of ${bmi.toFixed(1)} (${bmi >= 25 ? 'overweight focus' : 'normal/lean focus'})` : '';
    const ageStr = user?.age ? `, age ${user?.age} years` : '';
    const goalStr = user?.goal ? `, goal to ${user?.goal} weight` : '';

    const prompt = `Based on menstrual cycle logs showing average cycle length of ${cycleLength} days and logged symptoms: ${symptomListStr || 'none logged yet'}. User profile details: ${ageStr}${bmiStr}${goalStr}. Provide a personalized, empathetic health tip. Keep it to 2 sentences.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'women')) {
        setInsights(chunk.full);
      }
    } catch {
      console.warn("AI stream failed, keeping immediate insight.");
    }
  };

  useEffect(() => {
    fetchCycleInsights();
  }, [periodLog]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>ANALYTICS</Text>
          <Text style={styles.title} numberOfLines={1}>Cycle Insights</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        {user?.age && (
          <GlassCard hover={false} style={styles.profileCard}>
            <View style={styles.profileGrid}>
              <Text style={styles.profileStat}>Age: <Text style={styles.profileStatBold}>{user.age} yrs</Text></Text>
              <Text style={styles.profileStat}>Height: <Text style={styles.profileStatBold}>{user.height} cm</Text></Text>
              <Text style={styles.profileStat}>Weight: <Text style={styles.profileStatBold}>{user.weight} kg</Text></Text>
              {bmi && <Text style={styles.profileStat}>BMI: <Text style={styles.profileStatAccent}>{bmi.toFixed(1)}</Text></Text>}
              <Text style={styles.profileStat}>Goal: <Text style={styles.profileStatAccent}>{user.goal}</Text></Text>
            </View>
          </GlassCard>
        )}

        <GlassCard hover={false} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={16} color="#8B5CF6" />
            <Text style={styles.aiTitle}>AI INSIGHTS</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
          ) : (
            <Text style={styles.aiText}>{insights}</Text>
          )}
        </GlassCard>

        <GlassCard hover={false} style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Cycle Length Trend</Text>
          <LineChart
            data={dynamicCycleData}
            width={width - 72}
            height={200}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#8B5CF6" }
            }}
            bezier
            style={{ marginVertical: 16, borderRadius: 16, alignSelf: 'center' }}
            withVerticalLines={false}
          />
        </GlassCard>

        <GlassCard hover={false} style={styles.symptomsCard}>
          <Text style={styles.sectionTitle}>Symptom Frequency</Text>
          <View style={styles.symptomsList}>
            {dynamicSymptomData.map((s: any) => (
              <View key={s.symptom} style={styles.symptomRow}>
                <View style={styles.symptomLabels}>
                  <Text style={styles.symptomName}>{s.symptom}</Text>
                  <Text style={styles.symptomFreq}>{s.frequency}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${s.frequency}%` }]} />
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C4B5FD',
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileStat: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  profileStatBold: {
    fontWeight: '700',
    color: '#111827',
  },
  profileStatAccent: {
    fontWeight: '700',
    color: '#8B5CF6',
    textTransform: 'capitalize',
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
    letterSpacing: 1,
  },
  aiText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  symptomsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 40,
  },
  symptomsList: {
    gap: 12,
  },
  symptomRow: {
    width: '100%',
  },
  symptomLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  symptomName: {
    fontSize: 13,
    color: '#374151',
  },
  symptomFreq: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F3E8FF',
    borderRadius: 3,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  }
});
