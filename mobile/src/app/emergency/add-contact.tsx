import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, UserPlus } from 'lucide-react-native';
import { GlassCard, GlassButton, GlassInput } from '../../components/ui/Components';
import { useEmergencyStore } from '../../store/healthStore';

export default function EmergencyAddContact() {
  const router = useRouter();
  const addContact = useEmergencyStore((s: any) => s.addContact);
  
  const [form, setForm] = useState({ name: '', phone: '', type: 'family', relationship: '' });
  
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    addContact({
      name: form.name.trim(),
      phone: form.phone.trim(),
      type: form.type ? form.type.charAt(0).toUpperCase() + form.type.slice(1) : 'Family',
      relationship: form.relationship,
      isPrimary: false
    });
    router.back(); // Dismiss modal and return to contacts
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.cardWrapper}>
        <GlassCard hover={false} style={styles.card}>
          <Text style={styles.eyebrow}>EMERGENCY</Text>
          <Text style={styles.title}>Add Contact</Text>
          
          <View style={styles.form}>
            <GlassInput 
              label="NAME" 
              placeholder="Contact name" 
              value={form.name} 
              onChangeText={(t: string) => update('name', t)} 
            />
            
            <GlassInput 
              label="PHONE" 
              placeholder="+1 234 567 8900" 
              keyboardType="phone-pad" 
              value={form.phone} 
              onChangeText={(t: string) => update('phone', t)} 
            />
            
            <GlassInput 
              label="RELATIONSHIP" 
              placeholder="e.g. Spouse, Parent" 
              value={form.relationship} 
              onChangeText={(t: string) => update('relationship', t)} 
            />
            
            <View style={styles.pickerBox}>
              <Text style={styles.pickerLabel}>TYPE</Text>
              <View style={styles.typeRow}>
                {['family', 'friend', 'doctor'].map((t: string) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => update('type', t)}
                    style={[styles.typeBtn, form.type === t && styles.typeBtnActive]}
                  >
                    <Text style={[styles.typeText, form.type === t && styles.typeTextActive]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.btnRow}>
              <GlassButton onPress={() => router.back()} style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ArrowLeft size={16} color="#111827" />
                  <Text style={{ fontWeight: '600' }}>Cancel</Text>
                </View>
              </GlassButton>
              <GlassButton variant="primary" onPress={handleSave} style={{ flex: 1.5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <UserPlus size={16} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Save Contact</Text>
                </View>
              </GlassButton>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000080',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 4,
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
  pickerBox: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 1,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  typeBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  }
});
