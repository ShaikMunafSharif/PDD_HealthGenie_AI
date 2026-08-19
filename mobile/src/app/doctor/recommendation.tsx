import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Stethoscope, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';

const specialists = [
  { type: 'General Practitioner', desc: 'Primary care, routine checkups, general health & initial evaluation', icon: '🩺', symptoms: ['Fever', 'Fatigue', 'Body ache', 'General malaise'] },
  { type: 'Cardiologist', desc: 'Heart conditions, blood pressure, chest pain & circulation issues', icon: '❤️', symptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'High BP'] },
  { type: 'Dermatologist', desc: 'Skin conditions, rashes, acne, moles & allergic skin responses', icon: '🧴', symptoms: ['Rashes', 'Itching', 'Acne', 'Skin lesions'] },
  { type: 'Orthopedist', desc: 'Bone & joint issues, fractures, arthritis & sports injuries', icon: '🦴', symptoms: ['Joint pain', 'Back pain', 'Fractures', 'Mobility issues'] },
  { type: 'Gynecologist', desc: "Women's reproductive health, period irregularities & pregnancy care", icon: '👩‍⚕️', symptoms: ['Pelvic pain', 'Irregular cycles', 'PCOS', 'Pregnancy'] },
  { type: 'Neurologist', desc: 'Headaches, migraines, nerve pain, seizures & brain disorders', icon: '🧠', symptoms: ['Severe headache', 'Dizziness', 'Numbness', 'Memory loss'] },
  { type: 'Gastroenterologist', desc: 'Digestive issues, stomach pain, acid reflux & gut health', icon: '🫃', symptoms: ['Stomach pain', 'Acid reflux', 'Nausea', 'Bloating'] },
  { type: 'Endocrinologist', desc: 'Diabetes, thyroid issues, hormone imbalances & metabolic care', icon: '⚗️', symptoms: ['Thyroid issues', 'Diabetes', 'Unexplained weight changes'] },
  { type: 'Psychiatrist', desc: 'Mental wellness, anxiety, depression, sleep & stress disorders', icon: '🧘', symptoms: ['Anxiety', 'Depression', 'Insomnia', 'Chronic stress'] },
  { type: 'Pulmonologist', desc: 'Lung & breathing disorders, asthma, chronic cough & respiratory care', icon: '🫁', symptoms: ['Persistent cough', 'Asthma', 'Wheezing', 'Shortness of breath'] },
];

export default function DoctorRecommendation() {
  const router = useRouter();
  const { selectedSymptoms, analysisResult } = useSymptomStore();

  const [aiRec, setAiRec] = useState('');
  const [loading, setLoading] = useState(true);

  const getSuggestedSpecialistFromAI = () => {
    if (!analysisResult) return null;
    const lowerResult = analysisResult.toLowerCase();
    
    for (const spec of specialists) {
      if (lowerResult.includes(spec.type.toLowerCase())) {
        return spec.type;
      }
    }

    if (lowerResult.includes('family medicine') || lowerResult.includes('internal medicine') || lowerResult.includes('gp') || lowerResult.includes('primary care')) {
      return 'General Practitioner';
    }
    if (lowerResult.includes('cardiologist') || lowerResult.includes('cardiology')) return 'Cardiologist';
    if (lowerResult.includes('dermatologist') || lowerResult.includes('dermatology')) return 'Dermatologist';
    if (lowerResult.includes('orthopedist') || lowerResult.includes('orthopedic')) return 'Orthopedist';
    if (lowerResult.includes('gynecologist') || lowerResult.includes('gynecology')) return 'Gynecologist';
    if (lowerResult.includes('neurologist') || lowerResult.includes('neurology')) return 'Neurologist';
    if (lowerResult.includes('gastroenterologist') || lowerResult.includes('gastroenterology')) return 'Gastroenterologist';
    if (lowerResult.includes('endocrinologist') || lowerResult.includes('endocrinology')) return 'Endocrinologist';
    if (lowerResult.includes('psychiatrist') || lowerResult.includes('therapist')) return 'Psychiatrist';
    if (lowerResult.includes('pulmonologist') || lowerResult.includes('pulmonology')) return 'Pulmonologist';

    return null;
  };

  const getSuggestedSpecialistsFromSymptoms = () => {
    const matched = new Set<string>();
    selectedSymptoms.forEach((s: any) => {
      const lowerS = s.toLowerCase();
      if (lowerS.includes('chest') || lowerS.includes('palpitations')) matched.add('Cardiologist');
      if (lowerS.includes('rash') || lowerS.includes('skin') || lowerS.includes('acne')) matched.add('Dermatologist');
      if (lowerS.includes('joint') || lowerS.includes('back pain') || lowerS.includes('bone')) matched.add('Orthopedist');
      if (lowerS.includes('cramps') || lowerS.includes('period') || lowerS.includes('pregnancy')) matched.add('Gynecologist');
      if (lowerS.includes('headache') || lowerS.includes('dizziness') || lowerS.includes('numbness')) matched.add('Neurologist');
      if (lowerS.includes('stomach') || lowerS.includes('nausea') || lowerS.includes('bloating')) matched.add('Gastroenterologist');
      if (lowerS.includes('fatigue') || lowerS.includes('diabetes') || lowerS.includes('thyroid')) matched.add('Endocrinologist');
      if (lowerS.includes('anxiety') || lowerS.includes('insomnia') || lowerS.includes('depression')) matched.add('Psychiatrist');
      if (lowerS.includes('cough') || lowerS.includes('breath') || lowerS.includes('asthma')) matched.add('Pulmonologist');
      if (lowerS.includes('fever') || lowerS.includes('body ache')) matched.add('General Practitioner');
    });
    return Array.from(matched);
  };

  const recommendedSpecialistName = useMemo(() => {
    const aiSuggested = getSuggestedSpecialistFromAI();
    if (aiSuggested) return aiSuggested;
    const symptomSuggested = getSuggestedSpecialistsFromSymptoms();
    if (symptomSuggested.length > 0) return symptomSuggested[0];
    return 'General Practitioner';
  }, [analysisResult, selectedSymptoms]);

  const recommendedSpecialist = useMemo(() => {
    return specialists.find(s => s.type === recommendedSpecialistName) || specialists[0];
  }, [recommendedSpecialistName]);

  const fetchDoctorRecommendations = async () => {
    setLoading(true);
    setAiRec('');
    const prompt = `Based on the user's reported symptoms (${selectedSymptoms.join(', ') || 'general wellness checkup'}), specify WHICH TYPE OF MEDICAL SPECIALIST they should consult. Give a concise 2-sentence explanation of why to consult this specialist and what questions to ask them.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'doctor')) {
        setAiRec(chunk.full);
        setLoading(false);
      }
    } catch {
      setAiRec(`We strongly recommend consulting a ${recommendedSpecialist.type}. Based on your reported symptoms, a consultation with a ${recommendedSpecialist.type} will provide targeted diagnostic evaluation and personalized treatment.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorRecommendations();
  }, [selectedSymptoms]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>SPECIALIST RECOMMENDATION</Text>
          <Text style={styles.title} numberOfLines={1}>Which Specialist?</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiTitleBox}>
              <Sparkles size={18} color="#2563EB" />
              <Text style={styles.aiTitleText}>AI Consultation Advisory</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RECOMMENDED</Text>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 20 }} />
          ) : (
            <View>
              <Text style={styles.aiResultText}>{aiRec}</Text>

              <View style={styles.highlightBox}>
                <View style={styles.highlightTop}>
                  <View style={styles.highlightIcon}>
                    <Text style={{ fontSize: 32 }}>{recommendedSpecialist.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightSub}>PRIMARY MATCH</Text>
                    <Text style={styles.highlightTitle}>{recommendedSpecialist.type}</Text>
                  </View>
                </View>
                <Text style={styles.highlightDesc}>{recommendedSpecialist.desc}</Text>

                <GlassButton 
                  variant="primary" 
                  onPress={() => router.push({ pathname: '/doctor/specialist', params: { specialty: recommendedSpecialist.type } })}
                  style={{ marginTop: 12 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>View Guide & Hospitals</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </View>
                </GlassButton>
              </View>
            </View>
          )}
        </GlassCard>

        <Text style={styles.sectionTitle}>Browse All Categories</Text>
        
        <View style={styles.grid}>
          {specialists.map((s, i) => {
            const isRec = s.type === recommendedSpecialist.type;
            return (
              <TouchableOpacity 
                key={s.type}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/doctor/specialist', params: { specialty: s.type } })}
                style={[styles.gridItem, isRec && styles.gridItemRec]}
              >
                {isRec && (
                  <View style={styles.recBadgeSmall}>
                    <Text style={styles.recBadgeSmallText}>REC</Text>
                  </View>
                )}
                <Text style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</Text>
                <Text style={[styles.gridItemTitle, isRec && styles.gridItemTitleRec]}>{s.type}</Text>
              </TouchableOpacity>
            );
          })}
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
  aiCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
  },
  aiResultText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 20,
  },
  highlightBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 16,
  },
  highlightTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  highlightIcon: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
  },
  highlightSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 2,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E40AF',
  },
  highlightDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  gridItemRec: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  gridItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  gridItemTitleRec: {
    color: '#1E40AF',
  },
  recBadgeSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recBadgeSmallText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  }
});
