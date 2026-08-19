import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Check } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

const initialChecklist = [
  { week: 8, item: 'First prenatal visit', done: true }, 
  { week: 12, item: 'First trimester screening', done: true },
  { week: 16, item: 'Quad screen blood test', done: false }, 
  { week: 20, item: 'Anatomy scan (ultrasound)', done: false },
  { week: 24, item: 'Glucose screening test', done: false }, 
  { week: 28, item: 'Rh factor test', done: false },
  { week: 32, item: 'Growth ultrasound', done: false }, 
  { week: 36, item: 'Group B strep test', done: false },
  { week: 38, item: 'Weekly checkups begin', done: false }, 
  { week: 40, item: 'Due date checkup', done: false },
];

export default function PregnancyDoctorVisits() {
  const router = useRouter();
  const [items, setItems] = useState(initialChecklist);

  const toggle = (index: number) => {
    setItems(items.map((item, i) => i === index ? { ...item, done: !item.done } : item));
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>APPOINTMENTS</Text>
          <Text style={styles.title} numberOfLines={1}>Doctor Visits</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)} style={styles.listContainer}>
        {items.map((item, i) => (
          <Animated.View key={item.item} entering={FadeInUp.delay(200 + i * 40)}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => toggle(i)}>
              <GlassCard hover={false} style={[styles.card, item.done && styles.cardDone]}>
                <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                  {item.done && <Check size={14} color="#10B981" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemText, item.done && styles.itemTextDone]}>{item.item}</Text>
                </View>
                <Text style={styles.weekText}>Week {item.week}</Text>
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>
        ))}
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
  listContainer: {
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardDone: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  itemTextDone: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  weekText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  }
});
