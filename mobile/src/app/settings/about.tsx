import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Info, Heart, Shield, Sparkles, ExternalLink, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';

export default function SettingsAbout() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.eyebrow}>ABOUT</Text>
          <Text style={styles.title}>HealthGenie AI</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.cardCenter}>
          <View style={styles.logoBox}>
            <Sparkles size={32} color="#020510" />
          </View>
          <Text style={styles.appName}>HealthGenie AI</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDesc}>
            An AI-powered personal healthcare companion combining cutting-edge artificial intelligence with comprehensive health tracking.
          </Text>
        </GlassCard>

        <View style={styles.links}>
          {[
            { icon: Shield, label: 'Privacy Policy', color: '#2563EB' },
            { icon: Info, label: 'Terms of Service', color: '#2563EB' },
            { icon: Heart, label: 'Rate the App', color: '#F97316' },
          ].map(item => (
            <GlassCard key={item.label} hover={false} style={styles.linkCard}>
              <View style={styles.linkLeft}>
                <item.icon size={20} color={item.color} />
                <Text style={styles.linkLabel}>{item.label}</Text>
              </View>
              <ExternalLink size={16} color="#9CA3AF" />
            </GlassCard>
          ))}
        </View>

        <GlassCard hover={false} style={styles.footerCard}>
          <Text style={styles.footerText}>Powered by HealthGenie AI Engine{'\n'}Built with React Native & Expo</Text>
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
  cardCenter: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  appDesc: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
  links: {
    gap: 12,
    marginBottom: 24,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  footerCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  }
});
