import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { GlassCard, Chip } from '../../components/ui/Components';
import { streamHealthGenie } from '../../services/ollamaService';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const defaultTips = [
  { title: 'Diet Management', desc: 'Focus on low-GI, anti-inflammatory foods (leafy greens, berries, fatty fish) to help stabilize blood sugar and manage insulin sensitivity.', icon: '🥗', key: 'diet' },
  { title: 'Regular Exercise', desc: 'Mix strength training with steady-state cardio (30 mins, 4-5x a week) to improve insulin response and lower testosterone levels.', icon: '🏃‍♀️', key: 'exercise' },
  { title: 'Stress Management', desc: 'High stress increases cortisol, which worsens insulin resistance. Practice yoga, breathing, or mindfulness.', icon: '🧘', key: 'stress' },
  { title: 'Sleep Hygiene', desc: 'Prioritize 7-8 hours of sound sleep. Inadequate sleep disrupts circadian rhythms and drives cravings.', icon: '😴', key: 'sleep' },
  { title: 'Supplementation', desc: 'Consider discussing Inositol (Ovasitol), Vitamin D3, and Omega-3s with your doctor to support cycle regularity.', icon: '💊', key: 'supplements' }
];

const trackerSymptoms = ['Irregular Periods', 'Weight Gain', 'Acne', 'Hair Loss', 'Excess Hair Growth', 'Fatigue', 'Mood Changes', 'Insulin Resistance'];

export default function PCOSCare() {
  const router = useRouter();
  const { periodLog, cycleLength } = useWomenStore();
  const { user } = useAuthStore();
  
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(true);

  const weightNum = parseFloat(user?.weight || '0');
  const heightNum = parseFloat(user?.height || '0');
  const bmi = (weightNum && heightNum) ? (weightNum / ((heightNum / 100) ** 2)) : null;

  const getPersonalizedTips = () => {
    const allLoggedSymptoms = new Set();
    periodLog.forEach((log: any) => {
      if (log.symptoms) {
        log.symptoms.forEach((s: any) => allLoggedSymptoms.add(s.toLowerCase()));
      }
    });

    return defaultTips.map(tip => {
      let personalizedDesc = tip.desc;
      let isHighlighted = false;

      if (tip.key === 'diet') {
        if (allLoggedSymptoms.has('acne')) {
          personalizedDesc += " (Highly recommended to reduce systemic inflammation driving your acne.)";
          isHighlighted = true;
        }
        if (allLoggedSymptoms.has('bloating')) {
          personalizedDesc += " (Helps flush excess water weight and alleviate bloating.)";
          isHighlighted = true;
        }
        if (allLoggedSymptoms.has('cravings')) {
          personalizedDesc += " (Stabilizes glucose levels to curb sugar cravings.)";
          isHighlighted = true;
        }
      }
      if (tip.key === 'exercise') {
        if (allLoggedSymptoms.has('fatigue')) {
          personalizedDesc += " (Boosts mitochondrial activity to counter your fatigue.)";
          isHighlighted = true;
        }
      }
      if (tip.key === 'stress') {
        if (allLoggedSymptoms.has('cramps')) {
          personalizedDesc += " (Directly calms the pelvic muscle contractions easing cramps.)";
          isHighlighted = true;
        }
        if (allLoggedSymptoms.has('mood swings')) {
          personalizedDesc += " (Regulates adrenaline spikes to smooth mood fluctuations.)";
          isHighlighted = true;
        }
      }
      if (tip.key === 'sleep') {
        if (allLoggedSymptoms.has('fatigue')) {
          personalizedDesc += " (Crucial to reset cellular energy levels and fight chronic fatigue.)";
          isHighlighted = true;
        }
      }

      if (bmi) {
        if (tip.key === 'diet' && bmi >= 25) {
          personalizedDesc += ` Highly critical for weight control and improving insulin response given your BMI of ${bmi.toFixed(1)}.`;
          isHighlighted = true;
        }
        if (tip.key === 'exercise' && bmi >= 25) {
          personalizedDesc += " Helps clear glucose from blood to reduce fat storage matching your metabolic needs.";
          isHighlighted = true;
        }
        if (tip.key === 'stress' && bmi < 25) {
          personalizedDesc += ` Primary focus for Lean PCOS (BMI: ${bmi.toFixed(1)}) where stress and high cortisol are the primary cycle disruptors.`;
          isHighlighted = true;
        }
      }
      if (user?.activityLevel === 'sedentary' && tip.key === 'exercise') {
        personalizedDesc += " Since you have a sedentary routine, start with gentle 15-minute walks to build metabolic stamina.";
        isHighlighted = true;
      }

      return {
        ...tip,
        desc: personalizedDesc,
        highlighted: isHighlighted
      };
    });
  };

  const getImmediatePCOSGuidance = (symptomListStr: string) => {
    const bmiStr = bmi ? ` (BMI: ${bmi.toFixed(1)})` : '';
    const weightFocus = bmi && bmi >= 25 
      ? "Given your BMI, we prioritize managing insulin sensitivity and gentle caloric balance."
      : "For lean PCOS, we focus primarily on stress reduction and strength training to balance cortisol.";
    
    return `PCOS Management Guidance: Stabilizing blood sugar levels and managing cortisol are key. Based on cycle logs averaging ${cycleLength} days ${symptomListStr ? `with logged symptoms (${symptomListStr})` : ''}${bmiStr}, ${weightFocus} We recommend focusing on low-GI meals, progressive strength training, and consistent stress-reduction habits.`;
  };

  const fetchPCOSGuidance = async () => {
    const loggedSymptoms: Record<string, number> = {};
    periodLog.forEach((log: any) => {
      if (log.symptoms) {
        log.symptoms.forEach((s: any) => {
          loggedSymptoms[s] = (loggedSymptoms[s] || 0) + 1;
        });
      }
    });

    const symptomListStr = Object.entries(loggedSymptoms).map(([name]) => name).join(', ');
    const immediateTip = getImmediatePCOSGuidance(symptomListStr);
    
    setGuidance(immediateTip);
    setLoading(false);

    const bmiStr = bmi ? `, BMI of ${bmi.toFixed(1)} (${bmi >= 25 ? 'overweight/insulin-resistant focus' : 'lean PCOS focus'})` : '';
    const ageStr = user?.age ? `, age ${user?.age} years` : '';
    const goalStr = user?.goal ? `, goal to ${user?.goal} weight` : '';

    const prompt = `Give me a personalized, empathetic PCOS management tip based on these cycle logs: average cycle length of ${cycleLength} days, frequently logged symptoms: ${symptomListStr || 'none logged yet'}. Also consider user profile: ${ageStr}${bmiStr}${goalStr}. Keep it to 2 sentences. Highlight cycle length, primary symptoms, and BMI considerations.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'women')) {
        setGuidance(chunk.full);
      }
    } catch (err) {
      console.warn("AI stream failed, keeping immediate tip.");
    }
  };

  useEffect(() => {
    fetchPCOSGuidance();
  }, [periodLog]);

  const personalizedTips = getPersonalizedTips();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>PCOS MANAGEMENT</Text>
          <Text style={styles.title} numberOfLines={1}>PCOS Care</Text>
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
            <Sparkles size={16} color="#D946EF" />
            <Text style={styles.aiTitle}>AI-POWERED GUIDANCE</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#D946EF" />
          ) : (
            <Text style={styles.aiText}>{guidance}</Text>
          )}
        </GlassCard>

        <Text style={styles.sectionTitle}>Personalized Management Tips</Text>
        
        <View style={styles.tipsList}>
          {personalizedTips.map((t, i) => (
            <Animated.View key={t.title} entering={FadeInUp.delay(200 + i * 50)}>
              <GlassCard hover={false} style={[styles.tipCard, t.highlighted && styles.tipCardHighlighted]}>
                <View style={styles.tipHeader}>
                  <Text style={{ fontSize: 22 }}>{t.icon}</Text>
                  <Text style={[styles.tipTitle, t.highlighted && styles.tipTitleHighlighted]}>{t.title}</Text>
                </View>
                <Text style={[styles.tipDesc, t.highlighted && styles.tipDescHighlighted]}>{t.desc}</Text>
              </GlassCard>
            </Animated.View>
          ))}
        </View>

        <GlassCard hover={false} style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>Symptom Tracker</Text>
          <Text style={styles.trackerDesc}>Track your PCOS symptoms to identify patterns</Text>
          <View style={styles.chipContainer}>
            {trackerSymptoms.map(s => <Chip key={s} label={s} active={false} onPress={() => {}} />)}
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
    borderColor: '#F9A8D4',
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
    color: '#D946EF',
    textTransform: 'capitalize',
  },
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F9A8D4',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
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
    color: '#D946EF',
    letterSpacing: 1,
  },
  aiText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  tipsList: {
    gap: 16,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  tipCardHighlighted: {
    borderColor: '#D946EF',
    borderWidth: 1,
    backgroundColor: '#FDF4FF',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  tipTitleHighlighted: {
    color: '#D946EF',
  },
  tipDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  tipDescHighlighted: {
    color: '#374151',
  },
  trackerCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 40,
  },
  trackerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  trackerDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  }
});
