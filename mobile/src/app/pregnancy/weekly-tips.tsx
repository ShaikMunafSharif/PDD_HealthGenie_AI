import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';
import { streamHealthGenie } from '../../services/ollamaService';

const weeklyTips = [
  { week: 14, title: 'Energy Boost', tip: 'Many women feel increased energy as morning sickness subsides. Great time to start gentle exercise!', emoji: '⚡' },
  { week: 15, title: 'Screening Tests', tip: 'Discuss prenatal screening options with your doctor. Second-trimester screenings are typically done between weeks 15-20.', emoji: '🔬' },
  { week: 16, title: 'Baby\'s Movements', tip: 'You might start feeling "quickening" — butterfly-like flutters in your lower abdomen. This is your baby moving!', emoji: '🦋' },
  { week: 17, title: 'Body Changes', tip: 'Your uterus is growing rapidly. You may notice a visible baby bump now. Time to invest in comfortable maternity wear.', emoji: '👗' },
  { week: 18, title: 'Anatomy Scan', tip: 'The mid-pregnancy ultrasound (anatomy scan) typically happens around week 18-20. You might learn the baby\'s sex!', emoji: '🏥' },
];

export default function PregnancyWeeklyTips() {
  const router = useRouter();
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPregnancyTips = async () => {
    setLoading(true);
    const prompt = `Give me a brief, warm weekly pregnancy tip for Week 16. Keep it to 2 sentences. Focus on baby's development or mother's health.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'pregnancy')) {
        setTip(chunk.full);
        setLoading(false);
      }
    } catch {
      setTip("Week 16 Tip: Your baby's hearing is developing rapidly! Talking, reading, or playing soothing music can help foster bonding early on.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPregnancyTips();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>WEEKLY GUIDE</Text>
          <Text style={styles.title} numberOfLines={1}>Weekly Tips</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Sparkles size={20} color="#F59E0B" />
            <Text style={styles.aiTitle}>AI Pregnancy Tip of the Week</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="small" color="#F59E0B" />
          ) : (
            <Text style={styles.aiText}>{tip}</Text>
          )}
        </GlassCard>

        <View style={styles.tipsList}>
          {weeklyTips.map((t, i) => (
            <Animated.View key={t.week} entering={FadeInUp.delay(200 + i * 50)}>
              <GlassCard hover={false} style={[styles.tipCard, t.week === 16 && styles.tipCardCurrent]}>
                <View style={styles.tipHeader}>
                  <Text style={{ fontSize: 24 }}>{t.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipWeek}>WEEK {t.week}</Text>
                    <Text style={styles.tipTitle}>{t.title}</Text>
                  </View>
                </View>
                <Text style={styles.tipDesc}>{t.tip}</Text>
              </GlassCard>
            </Animated.View>
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
  aiCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FDE68A',
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  aiText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  tipsList: {
    gap: 16,
    paddingBottom: 40,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  tipCardCurrent: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  tipWeek: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  tipDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  }
});
