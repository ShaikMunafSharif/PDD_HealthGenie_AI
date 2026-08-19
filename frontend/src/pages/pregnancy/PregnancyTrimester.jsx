import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader } from '../../components/ui/Components';

const trimesters = [
  { num: 1, weeks: 'Weeks 1-12', title: 'First Trimester', icon: '🌱', color: '#39FF14', milestones: ['Baby\'s heart begins beating (week 6)', 'Brain and nervous system developing', 'All major organs begin forming', 'Baby is about 2.5 inches by end'] },
  { num: 2, weeks: 'Weeks 13-26', title: 'Second Trimester', icon: '🌸', color: '#FFB347', milestones: ['Baby can hear your voice (week 18)', 'First movements felt (quickening)', 'Fingerprints are forming', 'Baby weighs about 2 pounds by end'] },
  { num: 3, weeks: 'Weeks 27-40', title: 'Third Trimester', icon: '🌟', color: '#FF6B35', milestones: ['Baby\'s lungs mature for breathing', 'Rapid brain development', 'Baby drops into birth position', 'Full term at 39-40 weeks'] },
];

export default function PregnancyTrimester() {
  return (
    <PageTransition>
      <div className="theme-pregnancy" style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="OVERVIEW" title="Trimester Guide" subtitle="Your complete pregnancy timeline" />
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: 2, background: 'rgba(255,179,71,0.2)' }} />
          
          {trimesters.map((t, i) => (
            <motion.div key={t.num} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
              style={{ position: 'relative', marginBottom: 24, paddingLeft: 60 }}>
              {/* Timeline dot */}
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                style={{ position: 'absolute', left: 22, top: 20, width: 18, height: 18, borderRadius: '50%', background: t.color, boxShadow: `0 0 12px ${t.color}60`, zIndex: 2 }} />
              
              <GlassCard className="p-6" style={{ borderColor: `${t.color}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                  <div>
                    <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{t.title}</h3>
                    <p className="font-data" style={{ color: t.color, fontSize: '0.8rem' }}>{t.weeks}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {t.milestones.map((m, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{m}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
