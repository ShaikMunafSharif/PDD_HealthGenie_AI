import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Stethoscope, Apple, Dumbbell, Droplets, Heart, Baby, AlertTriangle,
  HeartPulse, UserCheck, Activity, Bell, User, ChevronRight, ShieldCheck
} from 'lucide-react-native';
import { GlassCard } from '../components/ui/Components';
import { useAuthStore } from '../store/healthStore';

const { width } = Dimensions.get('window');

const allModules = [
  { path: '/symptoms', icon: Stethoscope, label: 'Symptom Analysis', desc: 'AI medical diagnostic assistant', color: '#2563EB', bg: '#EFF6FF' },
  { path: '/(tabs)/diet', icon: Apple, label: 'Diet & Nutrition', desc: 'Personalized meal plans & calories', color: '#10B981', bg: '#ECFDF5' },
  { path: '/exercise/recommendations', icon: Dumbbell, label: 'Workout & Fitness', desc: 'Custom routines & pain relief', color: '#3B82F6', bg: '#EFF6FF' },
  { path: '/water', icon: Droplets, label: 'Water Hydration', desc: 'Interactive bottle tracker', color: '#06B6D4', bg: '#CFFAFE' },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", desc: 'Period tracking & PCOS care', color: '#8B5CF6', bg: '#F3E8FF', femaleOnly: true },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy Care', desc: 'Trimester progress & weekly tips', color: '#F59E0B', bg: '#FEF3C7', femaleOnly: true },
  { path: '/emergency/hospitals', icon: AlertTriangle, label: 'Emergency Hub', desc: 'GPS hospital map & 112 SOS', color: '#EF4444', bg: '#FEF2F2' },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid Guides', desc: '16 Step-by-step emergency protocols', color: '#F97316', bg: '#FFEDD5' },
  { path: '/doctor/recommendation', icon: UserCheck, label: 'Doctor Finder', desc: 'Specialist referral & search', color: '#6366F1', bg: '#EEF2FF' },
  { path: '/health-score', icon: Activity, label: 'Health Score', desc: 'Detailed category metrics', color: '#10B981', bg: '#ECFDF5' },
  { path: '/analytics/progress', icon: ShieldCheck, label: 'Analytics & Streaks', desc: 'Long-term progress & reports', color: '#8B5CF6', bg: '#F3E8FF' },
  { path: '/settings/profile', icon: User, label: 'Profile & Settings', desc: 'Manage your medical profile', color: '#6B7280', bg: '#F1F5F9' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);

  const filteredModules = useMemo(() => {
    return allModules.filter(mod => {
      if (mod.femaleOnly) {
        return user?.gender === 'female';
      }
      return true;
    });
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Explore Health Modules</Text>
      <Text style={styles.subtitle}>Access all AI-powered health & wellness tools.</Text>

      <View style={styles.grid}>
        {filteredModules.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.cardWrapper}
            activeOpacity={0.8}
            onPress={() => router.push(item.path as any)}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  <item.icon size={22} color={item.color} />
                </View>
                <ChevronRight size={18} color="#9CA3AF" />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#020510',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 130,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 15,
  },
});
