import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { User, Mail, Calendar, Ruler, Weight, Save, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

export default function SettingsProfile() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [height, setHeight] = useState(user?.height || '');
  const [weight, setWeight] = useState(user?.weight || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ name, email, age, gender, height, weight });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>SETTINGS</Text>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.card}>
          <View style={styles.form}>
            <GlassInput label="FULL NAME" icon={User} value={name} onChangeText={setName} />
            <GlassInput label="EMAIL" icon={Mail} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <GlassInput label="AGE" icon={Calendar} value={age} onChangeText={setAge} keyboardType="numeric" />
              </View>
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
              <View style={{ flex: 1 }}>
                <GlassInput label="HEIGHT (CM)" icon={Ruler} value={height} onChangeText={setHeight} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <GlassInput label="WEIGHT (KG)" icon={Weight} value={weight} onChangeText={setWeight} keyboardType="numeric" />
              </View>
            </View>

            <GlassButton variant="primary" fullWidth onPress={handleSave} style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Save size={18} color="#020510" />
                <Text style={styles.btnTextPrimary}>{saved ? 'Saved ✓' : 'Save Changes'}</Text>
              </View>
            </GlassButton>
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
  card: {
    padding: 24,
    backgroundColor: '#FFFFFF',
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
  btnTextPrimary: {
    fontSize: 15,
    fontWeight: '600',
    color: '#020510',
  }
});
