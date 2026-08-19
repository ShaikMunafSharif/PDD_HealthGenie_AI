import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Stethoscope, CheckSquare, CheckCircle, Navigation } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';

const specialistGuide: Record<string, any> = {
  'General Practitioner': {
    title: 'General Practitioner',
    icon: '🩺',
    desc: 'Primary care doctors provide comprehensive healthcare, diagnose general ailments, perform routine health checkups, and provide referrals to sub-specialists when needed.',
    whenToSee: ['Routine annual health checkups', 'Fever, cough, body ache, or cold symptoms', 'Unexplained fatigue', 'Initial evaluation for persistent discomfort'],
    prepTips: ['List all your current symptoms and when they started', 'Bring a list of all current medications', 'Note down family medical history']
  },
  'Cardiologist': {
    title: 'Cardiologist',
    icon: '❤️',
    desc: 'Cardiologists specialize in diagnosing, treating, and preventing diseases of the heart, blood vessels, and circulatory system.',
    whenToSee: ['Chest pain, pressure, or tightness', 'Shortness of breath or rapid heartbeat', 'High blood pressure', 'Family history of heart disease'],
    prepTips: ['Keep a record of your blood pressure readings', 'Note triggers for chest discomfort', 'Bring recent ECG or lipid panel reports']
  },
  'Dermatologist': {
    title: 'Dermatologist',
    icon: '🧴',
    desc: 'Dermatologists diagnose and treat medical conditions affecting the skin, hair, nails, and mucous membranes.',
    whenToSee: ['Persistent skin rash or hives', 'Severe acne or discoloration', 'Changing moles', 'Chronic hair loss'],
    prepTips: ['Do not apply makeup or heavy creams before visit', 'Take photos of flare-ups', 'List all skincare products used']
  },
  'Orthopedist': {
    title: 'Orthopedist',
    icon: '🦴',
    desc: 'Orthopedic specialists focus on the musculoskeletal system including bones, joints, ligaments, tendons, and muscles.',
    whenToSee: ['Severe joint pain or swelling', 'Back, neck, or spine discomfort', 'Sports injuries or fractures', 'Reduced mobility'],
    prepTips: ['Wear comfortable clothing', 'Bring X-rays or MRI reports', 'Note which activities aggravate pain']
  },
  'Gynecologist': {
    title: 'Gynecologist',
    icon: '👩‍⚕️',
    desc: 'Gynecologists specialize in female reproductive health, pregnancy, hormonal balance, and pelvic care.',
    whenToSee: ['Irregular or painful menstrual cycles', 'Pelvic pain or PCOS', 'Prenatal & pregnancy consultation', 'Hormonal symptoms'],
    prepTips: ['Note the first day of last period', 'Track cycle symptoms for 2-3 months', 'Prepare questions regarding fertility']
  },
  'Neurologist': {
    title: 'Neurologist',
    icon: '🧠',
    desc: 'Neurologists treat disorders that affect the brain, spinal cord, nerves, and muscles.',
    whenToSee: ['Severe headaches or migraines', 'Unexplained dizziness or vertigo', 'Numbness or tingling', 'Seizures or memory lapses'],
    prepTips: ['Keep a headache diary', 'List all neurological symptoms', 'Bring someone along if memory is an issue']
  },
  'Gastroenterologist': {
    title: 'Gastroenterologist',
    icon: '🫃',
    desc: 'Gastroenterologists specialize in the digestive system, stomach, intestines, liver, gallbladder, and pancreas.',
    whenToSee: ['Chronic stomach pain or acid reflux', 'Persistent diarrhea or constipation', 'Difficulty swallowing', 'Jaundice'],
    prepTips: ['Track food triggers', 'Note bowel movement frequency', 'Avoid heavy meals before examination']
  },
  'Endocrinologist': {
    title: 'Endocrinologist',
    icon: '⚗️',
    desc: 'Endocrinologists specialize in hormones and glands including diabetes, thyroid, adrenal, and metabolic disorders.',
    whenToSee: ['Unexplained weight changes', 'Diabetes management', 'Thyroid imbalance (fatigue)', 'Hormonal disorders'],
    prepTips: ['Bring recent blood glucose logs', 'Bring thyroid lab panel results', 'List any history of fatigue or temperature sensitivity']
  },
  'Psychiatrist': {
    title: 'Psychiatrist',
    icon: '🧘',
    desc: 'Psychiatrists are medical doctors who diagnose, treat, and prevent mental health, emotional, and behavioral conditions.',
    whenToSee: ['Persistent feelings of sadness or anxiety', 'Severe sleep disturbances', 'Mood swings', 'Panic attacks'],
    prepTips: ['Write down emotional concerns', 'Note sleep patterns', 'Be open about stress factors']
  },
  'Pulmonologist': {
    title: 'Pulmonologist',
    icon: '🫁',
    desc: 'Pulmonologists specialize in the respiratory system, lungs, airways, and breathing disorders.',
    whenToSee: ['Persistent cough over 3 weeks', 'Asthma or wheezing', 'Shortness of breath on exertion', 'Sleep apnea'],
    prepTips: ['Bring spirometry reports if available', 'Note environmental triggers', 'List any inhalers used']
  }
};

export default function DoctorSpecialist() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const specialty = (params.specialty as string) || 'General Practitioner';
  
  const activeGuide = useMemo(() => specialistGuide[specialty] || specialistGuide['General Practitioner'], [specialty]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>SPECIALIST GUIDE</Text>
          <Text style={styles.title} numberOfLines={1}>{activeGuide.title}</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View style={styles.iconWrapper}>
              <Text style={{ fontSize: 40 }}>{activeGuide.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.overviewTitle}>{activeGuide.title}</Text>
            </View>
          </View>
          <Text style={styles.overviewDesc}>{activeGuide.desc}</Text>
          
          <GlassButton 
            variant="primary" 
            onPress={() => router.push('/emergency/hospitals')} 
            style={{ marginTop: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Navigation size={16} color="#FFFFFF" />
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Find Hospitals Near Me</Text>
            </View>
          </GlassButton>
        </GlassCard>

        <Text style={styles.sectionHeading}>When to Consult</Text>
        <GlassCard hover={false} style={styles.listCard}>
          <View style={styles.listHeader}>
            <Stethoscope size={18} color="#10B981" />
            <Text style={styles.listTitle}>Conditions & Symptoms</Text>
          </View>
          {activeGuide.whenToSee.map((item: string, idx: number) => (
            <View key={idx} style={styles.listItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </GlassCard>

        <Text style={styles.sectionHeading}>Preparation Tips</Text>
        <GlassCard hover={false} style={styles.listCard}>
          <View style={styles.listHeader}>
            <CheckSquare size={18} color="#2563EB" />
            <Text style={styles.listTitle}>How to Prepare</Text>
          </View>
          {activeGuide.prepTips.map((item: string, idx: number) => (
            <View key={idx} style={styles.listItem}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{idx + 1}</Text>
              </View>
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
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
  overviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 24,
  },
  overviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  overviewDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginLeft: 4,
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  numberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  }
});
