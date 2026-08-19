import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Target } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

const painAreas = ['Neck', 'Shoulder', 'Upper Back', 'Lower Back', 'Knee', 'Wrist', 'Hip', 'Ankle'];

const exercises: Record<string, any[]> = {
  'Neck': [{ name: 'Neck Rolls', desc: 'Slowly roll head in circles, 10 each direction', duration: '2 min' }, { name: 'Chin Tucks', desc: 'Pull chin toward chest, hold 5s', duration: '3 min' }],
  'Lower Back': [{ name: 'Cat-Cow Stretch', desc: 'Alternate arching and rounding back on all fours', duration: '3 min' }, { name: 'Knee-to-Chest', desc: 'Pull one knee at a time toward chest', duration: '2 min' }],
  'Shoulder': [{ name: 'Shoulder Shrugs', desc: 'Raise shoulders to ears, hold 3s, release', duration: '2 min' }, { name: 'Arm Circles', desc: 'Small to large circles, forward and back', duration: '3 min' }],
  'Knee': [{ name: 'Quad Stretch', desc: 'Stand on one leg, pull other foot behind', duration: '2 min' }, { name: 'Wall Sits', desc: 'Lean against wall, slide down to 90 degrees', duration: '3 min' }],
  'Upper Back': [{ name: 'Thoracic Extension', desc: 'Arch upper back over a foam roller', duration: '2 min' }],
  'Wrist': [{ name: 'Wrist Flexor Stretch', desc: 'Gently pull fingers back toward forearm', duration: '2 min' }],
  'Hip': [{ name: 'Hip Flexor Stretch', desc: 'Kneel on one knee, lean forward gently', duration: '3 min' }],
  'Ankle': [{ name: 'Ankle Circles', desc: 'Rotate ankles 10 times each direction', duration: '2 min' }]
};

export default function PainRelief() {
  const router = useRouter();
  const [selected, setSelected] = useState('Lower Back');
  
  const currentExercises = exercises[selected] || exercises['Lower Back'];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>PAIN RELIEF</Text>
          <Text style={styles.title} numberOfLines={1}>Targeted Relief</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <View style={styles.chipsRow}>
          {painAreas.map(a => (
            <TouchableOpacity 
              key={a}
              onPress={() => setSelected(a)}
              style={[styles.chip, selected === a && styles.chipActive]}
            >
              <Text style={[styles.chipText, selected === a && styles.chipTextActive]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.exerciseList}>
          {currentExercises.map((ex, i) => (
            <GlassCard key={ex.name} hover={false} style={styles.card}>
              <View style={styles.cardHeader}>
                <Target size={20} color="#2563EB" />
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exDuration}>{ex.duration}</Text>
              </View>
              <Text style={styles.exDesc}>{ex.desc}</Text>
            </GlassCard>
          ))}
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  exerciseList: {
    gap: 16,
    marginBottom: 40,
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  exName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  exDuration: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  exDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    paddingLeft: 32,
  }
});
