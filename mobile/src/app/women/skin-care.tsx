import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import { GlassCard } from '../../components/ui/Components';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const basePhases = [
  { name: 'Menstrual (Day 1-5)', skin: 'Skin may be dull and dry', tips: ['Use hydrating serums', 'Gentle cleansing', 'Sheet masks for moisture'], icon: '🌙' },
  { name: 'Follicular (Day 6-13)', skin: 'Skin is at its best, glowing', tips: ['Try new products', 'Exfoliate gently', 'Light moisturizer'], icon: '🌸' },
  { name: 'Ovulation (Day 14-16)', skin: 'Oily skin, possible breakouts', tips: ['Oil-free products', 'Clay masks', 'Salicylic acid for acne'], icon: '☀️' },
  { name: 'Luteal (Day 17-28)', skin: 'Sensitive, prone to breakouts', tips: ['Calming ingredients (aloe, chamomile)', 'Avoid harsh products', 'Spot treatment for acne'], icon: '🍂' },
];

export default function SkinCare() {
  const router = useRouter();
  const { lastPeriodStart, getCycleDay, periodLog } = useWomenStore();
  const { user } = useAuthStore();

  const cycleDay = getCycleDay();

  let currentPhaseIndex = -1;
  let currentPhaseName = 'Not Syncing';
  let currentPhaseDesc = 'Log your last period start date in the tracker to sync skincare tips with your daily cycle.';

  if (lastPeriodStart && cycleDay) {
    if (cycleDay <= 5) {
      currentPhaseIndex = 0;
      currentPhaseName = 'Menstrual (Day ' + cycleDay + ')';
      currentPhaseDesc = 'Estrogen & progesterone are low. Skin barrier needs hydration and gentle care.';
    } else if (cycleDay <= 13) {
      currentPhaseIndex = 1;
      currentPhaseName = 'Follicular (Day ' + cycleDay + ')';
      currentPhaseDesc = 'Estrogen rises, increasing collagen. Skin is resilient and glowing! Perfect time for gentle exfoliation.';
    } else if (cycleDay <= 16) {
      currentPhaseIndex = 2;
      currentPhaseName = 'Ovulation (Day ' + cycleDay + ')';
      currentPhaseDesc = 'Luteinizing hormone peaks. Sebum production increases; swap to oil-free hydration.';
    } else {
      currentPhaseIndex = 3;
      currentPhaseName = 'Luteal (Day ' + cycleDay + ')';
      currentPhaseDesc = 'Progesterone is high. Skin is sensitive and prone to hormonal breakouts. Use calming, anti-inflammatory steps.';
    }
  }

  const hasAcneLog = useMemo(() => {
    return periodLog.some((log: any) => log.symptoms && log.symptoms.map((s: any) => s.toLowerCase()).includes('acne'));
  }, [periodLog]);

  const personalizedPhases = useMemo(() => {
    return basePhases.map((phase, idx) => {
      let tips = [...phase.tips];
      if (hasAcneLog) {
        if (idx === 2) {
          tips.push('Double cleanse with Salicylic Acid to clear hormonal sebum.');
        }
        if (idx === 3) {
          tips.push('Keep hydrocolloid spot patches handy for cystic blemishes.');
        }
      }
      return {
        ...phase,
        tips
      };
    });
  }, [hasAcneLog]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>SKINCARE</Text>
          <Text style={styles.title} numberOfLines={1}>Hormone-Synced Skincare</Text>
        </View>
      </View>

      <Animated.View entering={FadeInUp.delay(100)}>
        <GlassCard hover={false} style={[styles.infoCard, lastPeriodStart ? styles.infoCardActive : {}]}>
          <View style={styles.infoHeader}>
            <Sparkles size={24} color="#F43F5E" />
            <Text style={styles.infoLabel}>Current Phase: <Text style={styles.infoLabelHighlight}>{currentPhaseName}</Text></Text>
          </View>
          <Text style={styles.infoDesc}>
            {currentPhaseDesc} {hasAcneLog && <Text style={{ color: '#F43F5E', fontWeight: '700' }}>(Acne care tips enabled)</Text>}
          </Text>
        </GlassCard>

        <View style={styles.grid}>
          {personalizedPhases.map((p, i) => {
            const isCurrent = i === currentPhaseIndex;
            return (
              <Animated.View key={p.name} entering={FadeInUp.delay(200 + i * 50)} style={styles.gridItemWrapper}>
                <GlassCard hover={false} style={[styles.phaseCard, isCurrent && styles.phaseCardCurrent]}>
                  <View style={styles.phaseHeader}>
                    <Text style={{ fontSize: 24 }}>{p.icon}</Text>
                    <Text style={[styles.phaseTitle, isCurrent && styles.phaseTitleCurrent]}>{p.name}</Text>
                  </View>
                  <Text style={[styles.phaseSkin, isCurrent && styles.phaseSkinCurrent]}>{p.skin}</Text>
                  <View style={styles.tipsList}>
                    {p.tips.map(t => (
                      <View key={t} style={styles.tipRow}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </GlassCard>
              </Animated.View>
            );
          })}
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardActive: {
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  infoLabelHighlight: {
    fontWeight: '700',
    color: '#F43F5E',
  },
  infoDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  grid: {
    gap: 16,
    paddingBottom: 40,
  },
  gridItemWrapper: {
    width: '100%',
  },
  phaseCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  phaseCardCurrent: {
    borderColor: '#F43F5E',
    borderWidth: 1,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  phaseTitleCurrent: {
    color: '#F43F5E',
  },
  phaseSkin: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  phaseSkinCurrent: {
    color: '#E11D48',
    fontWeight: '600',
  },
  tipsList: {
    gap: 6,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipBullet: {
    color: '#F43F5E',
    fontSize: 14,
    fontWeight: '700',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  }
});
