import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowRight, ArrowLeft, Activity } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../components/ui/Components';
import { useAuthStore } from '../store/healthStore';

const conditions = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'PCOS', 'Arthritis', 'Migraine', 'Anemia', 'Depression', 'Anxiety', 'None'];
const medications = ['Metformin', 'Amlodipine', 'Levothyroxine', 'Ibuprofen', 'Omeprazole', 'Vitamin D', 'Iron Supplement', 'Multivitamin', 'None'];

export default function SetupMedicalHistory() {
  const router = useRouter();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);

  const toggleC = (c: string) => setSelectedConditions(s => s.includes(c) ? s.filter(i => i !== c) : [...s, c]);
  const toggleM = (m: string) => setSelectedMeds(s => s.includes(m) ? s.filter(i => i !== m) : [...s, m]);

  const handleNext = () => {
    updateProfile({ conditions: selectedConditions, medications: selectedMeds });
    router.push('/setup-allergies');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>STEP 2 OF 3</Text>
          <Text style={styles.title}>Medical History</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.sectionTitle}>Chronic Conditions</Text>
          <View style={styles.chipGrid}>
            {conditions.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => toggleC(c)}
                style={[styles.chip, selectedConditions.includes(c) && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedConditions.includes(c) && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Current Medications</Text>
          <View style={styles.chipGrid}>
            {medications.map(m => (
              <TouchableOpacity
                key={m}
                onPress={() => toggleM(m)}
                style={[styles.chip, selectedMeds.includes(m) && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedMeds.includes(m) && styles.chipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <GlassButton
            variant="primary"
            fullWidth
            onPress={handleNext}
            style={{ marginTop: 32 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.btnText}>Continue to Allergies</Text>
              <ArrowRight size={18} color="#020510" />
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
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#1E40AF',
  },
  btnText: {
    color: '#020510',
    fontSize: 16,
    fontWeight: '700',
  }
});
