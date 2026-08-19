import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Droplets, Dumbbell, Apple, Bell, BellOff, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GlassButton } from '../../components/ui/Components';

export default function NotificationSettings() {
  const router = useRouter();
  
  const [waterEnabled, setWaterEnabled] = useState(true);
  const [exerciseEnabled, setExerciseEnabled] = useState(true);
  const [mealEnabled, setMealEnabled] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>SETTINGS</Text>
          <Text style={styles.title}>Notifications</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)} style={styles.banner}>
        <Bell size={18} color="#10B981" />
        <Text style={styles.bannerText}>Notifications Active — Reminders will alert you directly on your device</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.list}>
        
        {/* WATER */}
        <GlassCard hover={false} style={[styles.card, waterEnabled && styles.cardActiveWater]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#CFFAFE' }]}>
                <Text style={{ fontSize: 20 }}>💧</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Water Reminders</Text>
                <Text style={styles.cardDesc}>Hydration alerts at regular intervals</Text>
              </View>
            </View>
            <Switch
              value={waterEnabled}
              onValueChange={setWaterEnabled}
              trackColor={{ false: '#E2E8F0', true: '#06B6D4' }}
              thumbColor="#FFFFFF"
            />
          </View>
          {waterEnabled && (
            <View style={styles.cardExpanded}>
              <Text style={styles.label}>REMINDER INTERVAL</Text>
              <View style={styles.selectBox}>
                <Text style={styles.selectText}>2 hours</Text>
              </View>
            </View>
          )}
        </GlassCard>

        {/* EXERCISE */}
        <GlassCard hover={false} style={[styles.card, exerciseEnabled && styles.cardActiveExercise]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Text style={{ fontSize: 20 }}>🏋️</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Exercise Reminders</Text>
                <Text style={styles.cardDesc}>Daily workout notifications</Text>
              </View>
            </View>
            <Switch
              value={exerciseEnabled}
              onValueChange={setExerciseEnabled}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
          {exerciseEnabled && (
            <View style={styles.cardExpanded}>
              <Text style={styles.label}>DAILY WORKOUT TIME</Text>
              <View style={styles.selectBox}>
                <Text style={styles.selectText}>07:00 AM</Text>
              </View>
            </View>
          )}
        </GlassCard>

        {/* MEALS */}
        <GlassCard hover={false} style={[styles.card, mealEnabled && styles.cardActiveMeal]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                <Text style={{ fontSize: 20 }}>🍎</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Meal Reminders</Text>
                <Text style={styles.cardDesc}>Breakfast, lunch & dinner alerts</Text>
              </View>
            </View>
            <Switch
              value={mealEnabled}
              onValueChange={setMealEnabled}
              trackColor={{ false: '#E2E8F0', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
          {mealEnabled && (
            <View style={styles.cardExpanded}>
              <Text style={styles.label}>MEAL SCHEDULES</Text>
              <View style={{ gap: 8 }}>
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Breakfast</Text>
                  <View style={styles.selectBoxTime}><Text style={styles.selectText}>08:00 AM</Text></View>
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Lunch</Text>
                  <View style={styles.selectBoxTime}><Text style={styles.selectText}>01:00 PM</Text></View>
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>Dinner</Text>
                  <View style={styles.selectBoxTime}><Text style={styles.selectText}>08:00 PM</Text></View>
                </View>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 24,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    fontWeight: '600',
    lineHeight: 20,
  },
  list: {
    gap: 16,
  },
  card: {
    padding: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardActiveWater: { borderColor: '#06B6D440' },
  cardActiveExercise: { borderColor: '#2563EB40' },
  cardActiveMeal: { borderColor: '#10B98140' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  cardExpanded: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  selectBox: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  selectBoxTime: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    width: 100,
  }
});
