import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { AlertTriangle, MapPin, Users, Siren, Shield } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

const modules = [
  { path: '/emergency/sos-confirm', icon: Siren, label: 'SOS Alert', desc: 'Trigger emergency broadcast', color: '#FF6B35' },
  { path: '/emergency/hospitals', icon: MapPin, label: 'Nearby Hospitals', desc: 'Find hospitals near you', color: '#FF0040' },
  { path: '/emergency/contacts', icon: Users, label: 'Emergency Contacts', desc: 'Manage your contacts', color: '#FFB347' },
];

export default function SOSScreen() {
  const router = useRouter();

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
          )
        }
      ]
    };
  });

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>EMERGENCY</Text>
        <Text style={styles.title}>Emergency Hub</Text>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => router.push('/emergency/sos-confirm')}
          style={styles.sosMainWrapper}
        >
          <GlassCard hover={false} style={styles.sosMainCard}>
            <Animated.View style={[styles.sosMainIcon, pulseStyle]}>
              <Siren size={40} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.sosMainTitle}>SOS Emergency</Text>
            <Text style={styles.sosMainDesc}>Tap to activate emergency alert</Text>
          </GlassCard>
        </TouchableOpacity>

        <View style={styles.grid}>
          {modules.map((mod, i) => (
            <Animated.View key={mod.path} entering={FadeInUp.delay(200 + i * 100)} style={{ width: '48%' }}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(mod.path as any)}>
                <GlassCard hover={false} style={styles.gridCard}>
                  <mod.icon size={28} color={mod.color} style={{ marginBottom: 12 }} />
                  <Text style={styles.gridTitle}>{mod.label}</Text>
                  <Text style={styles.gridDesc}>{mod.desc}</Text>
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <GlassCard hover={false} style={styles.infoBanner}>
          <Shield size={24} color="#2563EB" />
          <Text style={styles.infoText}>
            Emergency services: Always dial <Text style={{ color: '#EF4444', fontWeight: '800' }}>108</Text> for life-threatening situations
          </Text>
        </GlassCard>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  sosMainWrapper: {
    marginBottom: 24,
  },
  sosMainCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosMainIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  sosMainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#B91C1C',
    marginBottom: 4,
  },
  sosMainDesc: {
    fontSize: 14,
    color: '#7F1D1D',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    textAlign: 'center',
    height: 140,
    justifyContent: 'center',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  gridDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
    fontWeight: '500',
  }
});
