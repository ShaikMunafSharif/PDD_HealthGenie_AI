import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, CheckCircle, Droplet, Plus } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../components/ui/Components';
import { useAuthStore } from '../store/healthStore';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const commonAllergies = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Penicillin', 'Aspirin', 'Latex', 'Pollen', 'Dust', 'None'];

export default function SetupAllergies() {
  const router = useRouter();
  const { updateProfile, setSetupComplete } = useAuthStore();
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');

  const toggleA = (a: string) => setAllergies(s => s.includes(a) ? s.filter(i => i !== a) : [...s, a]);

  const addCustom = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies(s => [...s, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleFinish = () => {
    updateProfile({ bloodGroup, allergies });
    setSetupComplete();
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>FINAL STEP 3 OF 3</Text>
          <Text style={styles.title}>Allergies & Blood Group</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.card}>
          
          {/* Blood Type */}
          <View style={styles.sectionHeader}>
            <Droplet size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>Blood Type</Text>
          </View>

          <View style={styles.bloodGrid}>
            {bloodGroups.map(bg => (
              <TouchableOpacity
                key={bg}
                onPress={() => setBloodGroup(bg)}
                style={[styles.bloodCard, bloodGroup === bg && styles.bloodCardActive]}
              >
                <Text style={[styles.bloodText, bloodGroup === bg && styles.bloodTextActive]}>{bg}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Allergies */}
          <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Allergies & Sensitivities</Text>
          <View style={styles.chipGrid}>
            {commonAllergies.map(a => (
              <TouchableOpacity
                key={a}
                onPress={() => toggleA(a)}
                style={[styles.chip, allergies.includes(a) && styles.chipDangerActive]}
              >
                <Text style={[styles.chipText, allergies.includes(a) && styles.chipDangerTextActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
            {allergies.filter(a => !commonAllergies.includes(a)).map(a => (
              <TouchableOpacity
                key={a}
                onPress={() => toggleA(a)}
                style={[styles.chip, styles.chipDangerActive]}
              >
                <Text style={styles.chipDangerTextActive}>{a} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Allergy Input */}
          <View style={styles.customContainer}>
            <TextInput
              style={styles.customInput}
              placeholder="Add custom allergy..."
              placeholderTextColor="#9CA3AF"
              value={customAllergy}
              onChangeText={setCustomAllergy}
              onSubmitEditing={addCustom}
            />
            <TouchableOpacity onPress={addCustom} style={styles.addBtn}>
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <GlassButton
            variant="primary"
            fullWidth
            onPress={handleFinish}
            style={{ marginTop: 32 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={18} color="#020510" />
              <Text style={styles.btnText}>Complete Onboarding</Text>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bloodCard: {
    width: '22%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  bloodCardActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  bloodText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  bloodTextActive: {
    color: '#DC2626',
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
  chipDangerActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipDangerTextActive: {
    color: '#DC2626',
    fontWeight: '600',
  },
  customContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  customInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  addBtn: {
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  btnText: {
    color: '#020510',
    fontSize: 16,
    fontWeight: '700',
  }
});
