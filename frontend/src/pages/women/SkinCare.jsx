import React, { useMemo } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const basePhases = [
  { name: 'Menstrual (Day 1-5)', skin: 'Skin may be dull and dry', tips: ['Use hydrating serums', 'Gentle cleansing', 'Sheet masks for moisture'], icon: '🌙' },
  { name: 'Follicular (Day 6-13)', skin: 'Skin is at its best, glowing', tips: ['Try new products', 'Exfoliate gently', 'Light moisturizer'], icon: '🌸' },
  { name: 'Ovulation (Day 14-16)', skin: 'Oily skin, possible breakouts', tips: ['Oil-free products', 'Clay masks', 'Salicylic acid for acne'], icon: '☀️' },
  { name: 'Luteal (Day 17-28)', skin: 'Sensitive, prone to breakouts', tips: ['Calming ingredients (aloe, chamomile)', 'Avoid harsh products', 'Spot treatment for acne'], icon: '🍂' },
];

export default function SkinCare() {
  const { lastPeriodStart, cycleLength, getCycleDay, periodLog } = useWomenStore();
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

  // Check if Acne symptom was recently logged
  const hasAcneLog = useMemo(() => {
    return periodLog.some(log => log.symptoms && log.symptoms.map(s => s.toLowerCase()).includes('acne'));
  }, [periodLog]);

  // Personalize phase descriptions if acne is an active symptom
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
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="SKINCARE" title="Hormone-Synced Skincare" subtitle="Skincare recommendations aligned with your menstrual cycle" />
        
        <GlassCard className="p-5" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, borderColor: lastPeriodStart ? 'rgba(191,95,255,0.4)' : 'rgba(255,255,255,0.1)' }}>
          <Sparkles size={24} color="var(--neon-fem)" />
          <div>
            <p style={{ fontSize: '0.9rem' }}>
              Current phase: <strong style={{ color: 'var(--neon-fem)' }}>{currentPhaseName}</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 4 }}>
              {currentPhaseDesc} {hasAcneLog && <strong style={{ color: 'var(--neon-fem)' }}>(Acne care tips enabled)</strong>}
            </p>
          </div>
        </GlassCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {personalizedPhases.map((p, i) => {
            const isCurrent = i === currentPhaseIndex;
            return (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-5" style={{ 
                  height: '100%', 
                  border: isCurrent ? '1px solid var(--neon-fem)' : '1px solid var(--glass-border)',
                  boxShadow: isCurrent ? '0 0 10px rgba(191,95,255,0.2)' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                    <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, color: isCurrent ? 'var(--neon-fem)' : 'var(--text-primary)' }}>{p.name}</h3>
                  </div>
                  <p style={{ color: isCurrent ? 'var(--neon-fem)' : 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 10, fontWeight: isCurrent ? 600 : 400 }}>{p.skin}</p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {p.tips.map(t => (
                      <li key={t} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--neon-fem)' }}>•</span> {t}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
