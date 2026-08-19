import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, FadeOutLeft, ZoomIn } from 'react-native-reanimated';
import { User, Calendar, Ruler, Weight, ArrowRight, ArrowLeft, CheckCircle, Droplet } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput } from '../components/ui/Components';
import { useAuthStore } from '../store/healthStore';

const conditionsList = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Thyroid', 'PCOS', 'Arthritis', 'Migraine', 'Anemia', 'Depression', 'Anxiety', 'None'];
const medicationsList = ['Metformin', 'Amlodipine', 'Levothyroxine', 'Ibuprofen', 'Omeprazole', 'Vitamin D', 'Iron Supplement', 'Multivitamin', 'None'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const commonAllergies = ['Peanuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Penicillin', 'Aspirin', 'Latex', 'Pollen', 'Dust', 'None'];

export default function SetupProfile() {
  const router = useRouter();
  const { updateProfile, setSetupComplete, user } = useAuthStore();
  const [step, setStep] = useState(1);

  // Step 1: Profile
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');

  // Step 2: Medical History
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  // Step 3: Allergies
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');

  const toggleItem = (list: string[], setList: any, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies([...allergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleFinish = () => {
    updateProfile({
      name, age, gender, height, weight,
      conditions, medications,
      bloodGroup, allergies
    });
    setSetupComplete();
    router.replace('/(tabs)/dashboard');
  };

  const renderChip = (label: string, active: boolean, onPress: () => void, isDanger = false) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        active && (isDanger ? styles.chipDangerActive : styles.chipActive),
        !active && isDanger && { borderColor: '#FECACA' }
      ]}
    >
      <Text style={[
        styles.chipText,
        active && (isDanger ? styles.chipTextDangerActive : styles.chipTextActive),
        !active && isDanger && { color: '#EF4444' }
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View key={step} entering={FadeInRight} exiting={FadeOutLeft} style={styles.content}>
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.eyebrow}>STEP {step} OF 3</Text>
          
          {step === 1 && (
            <View>
              <Text style={styles.title}>Tell Us About Yourself</Text>
              
              <View style={styles.form}>
                <GlassInput label="FULL NAME" icon={User} value={name} onChangeText={setName} placeholder="Your name" />
                
                <View style={styles.row}>
                  <View style={{ flex: 1 }}><GlassInput label="AGE" icon={Calendar} value={age} onChangeText={setAge} placeholder="25" keyboardType="numeric" /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>GENDER</Text>
                    <View style={styles.genderRow}>
                      {['Male', 'Female'].map(g => (
                        <TouchableOpacity
                          key={g}
                          style={[styles.genderBtn, gender === g.toLowerCase() && styles.genderBtnActive]}
                          onPress={() => setGender(g.toLowerCase())}
                        >
                          <Text style={[styles.genderText, gender === g.toLowerCase() && styles.genderTextActive]}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                
                <View style={styles.row}>
                  <View style={{ flex: 1 }}><GlassInput label="HEIGHT (CM)" icon={Ruler} value={height} onChangeText={setHeight} placeholder="170" keyboardType="numeric" /></View>
                  <View style={{ flex: 1 }}><GlassInput label="WEIGHT (KG)" icon={Weight} value={weight} onChangeText={setWeight} placeholder="70" keyboardType="numeric" /></View>
                </View>

                {height && weight ? (
                  <Animated.View entering={ZoomIn} style={styles.bmiBox}>
                    <Text style={styles.bmiLabel}>BMI</Text>
                    <Text style={[styles.bmiValue, { color: (parseFloat(weight) / Math.pow(parseFloat(height)/100, 2)) < 25 ? '#39FF14' : '#EF4444' }]}>
                      {(parseFloat(weight) / Math.pow(parseFloat(height)/100, 2)).toFixed(1)}
                    </Text>
                  </Animated.View>
                ) : null}

                <GlassButton variant="primary" fullWidth onPress={() => setStep(2)} style={{ marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.btnTextPrimary}>Continue</Text>
                    <ArrowRight size={18} color="#020510" />
                  </View>
                </GlassButton>
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.title}>Your Health Background</Text>
              
              <Text style={styles.sectionTitle}>Chronic Conditions</Text>
              <View style={styles.chipContainer}>
                {conditionsList.map(c => renderChip(c, conditions.includes(c), () => toggleItem(conditions, setConditions, c)))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Current Medications</Text>
              <View style={styles.chipContainer}>
                {medicationsList.map(m => renderChip(m, medications.includes(m), () => toggleItem(medications, setMedications, m)))}
              </View>

              <View style={styles.btnRow}>
                <GlassButton onPress={() => setStep(1)} style={{ flex: 1, marginRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={18} color="#111827" />
                    <Text style={styles.btnText}>Back</Text>
                  </View>
                </GlassButton>
                <GlassButton variant="primary" onPress={() => setStep(3)} style={{ flex: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.btnTextPrimary}>Continue</Text>
                    <ArrowRight size={18} color="#020510" />
                  </View>
                </GlassButton>
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.title}>Blood Group & Allergies</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Droplet size={18} color="#EF4444" />
                <Text style={styles.sectionTitle}>Blood Type</Text>
              </View>
              <View style={styles.bloodGrid}>
                {bloodGroups.map(bg => (
                  <TouchableOpacity
                    key={bg}
                    activeOpacity={0.7}
                    onPress={() => setBloodGroup(bg)}
                    style={[styles.bloodBtn, bloodGroup === bg && styles.bloodBtnActive]}
                  >
                    <Text style={[styles.bloodText, bloodGroup === bg && styles.bloodTextActive]}>{bg}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Clinical Allergies</Text>
              <View style={styles.chipContainer}>
                {commonAllergies.map(a => renderChip(a, allergies.includes(a), () => toggleItem(allergies, setAllergies, a), true))}
                {allergies.filter(a => !commonAllergies.includes(a)).map(a => renderChip(a, true, () => toggleItem(allergies, setAllergies, a), true))}
              </View>
              
              <View style={styles.customAllergyRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <GlassInput placeholder="Custom allergy..." value={customAllergy} onChangeText={setCustomAllergy} onSubmitEditing={addCustomAllergy} />
                </View>
                <GlassButton onPress={addCustomAllergy} style={{ paddingHorizontal: 16 }}>Add</GlassButton>
              </View>

              <View style={styles.btnRow}>
                <GlassButton onPress={() => setStep(2)} style={{ flex: 1, marginRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={18} color="#111827" />
                    <Text style={styles.btnText}>Back</Text>
                  </View>
                </GlassButton>
                <GlassButton variant="primary" onPress={handleFinish} style={{ flex: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={18} color="#020510" />
                    <Text style={styles.btnTextPrimary}>Complete</Text>
                  </View>
                </GlassButton>
              </View>
            </View>
          )}

        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 480,
  },
  card: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    height: 48,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  genderBtnActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  genderTextActive: {
    color: '#2563EB',
  },
  bmiBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,245,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  bmiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  btnTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#020510',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  chipDangerActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#2563EB',
  },
  chipTextDangerActive: {
    color: '#DC2626',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 32,
  },
  bloodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bloodBtn: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodBtnActive: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  bloodText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4B5563',
  },
  bloodTextActive: {
    color: '#DC2626',
  },
  customAllergyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  }
});
