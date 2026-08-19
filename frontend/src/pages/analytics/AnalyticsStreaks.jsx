import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Award, Calendar } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader, StreakBadge } from '../../components/ui/Components';
import { useStreakStore } from '../../store/healthStore';

export default function AnalyticsStreaks() {
  const { currentStreak, longestStreak, activityMap } = useStreakStore();
  
  // Generate GitHub-style heatmap for last 90 days
  const today = new Date();
  const heatmapDays = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    const key = d.toISOString().split('T')[0];
    const count = activityMap[key] || Math.floor(Math.random() * 4); // demo data
    return { date: key, count, day: d.getDay() };
  });

  const getColor = (count) => {
    if (count === 0) return 'rgba(100,180,255,0.05)';
    if (count === 1) return 'rgba(0,245,255,0.2)';
    if (count === 2) return 'rgba(0,245,255,0.4)';
    return 'rgba(0,245,255,0.7)';
  };

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="GAMIFICATION" title="Activity Streaks" subtitle="Build healthy habits with consistency" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <GlassCard className="p-5" style={{ textAlign: 'center' }}>
            <Flame size={28} style={{ color: 'var(--neon-warn)', margin: '0 auto 8px', display: 'block' }} />
            <span className="font-data" style={{ fontSize: '2.5rem', color: 'var(--neon-warn)' }}>{currentStreak}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Streak</p>
          </GlassCard>
          <GlassCard className="p-5" style={{ textAlign: 'center' }}>
            <Award size={28} style={{ color: 'var(--neon-health)', margin: '0 auto 8px', display: 'block' }} />
            <span className="font-data" style={{ fontSize: '2.5rem', color: 'var(--neon-health)' }}>{longestStreak}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Longest Streak</p>
          </GlassCard>
          <GlassCard className="p-5" style={{ textAlign: 'center' }}>
            <Calendar size={28} style={{ color: 'var(--neon-pulse)', margin: '0 auto 8px', display: 'block' }} />
            <span className="font-data" style={{ fontSize: '2.5rem', color: 'var(--neon-pulse)' }}>{heatmapDays.filter(d => d.count > 0).length}</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Days (90d)</p>
          </GlassCard>
        </div>

        {/* GitHub-style Heatmap */}
        <GlassCard className="p-6">
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Activity Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.ceil(90 / 7)}, 1fr)`, gap: 3, maxWidth: 600 }}>
            {heatmapDays.map((d, i) => (
              <motion.div key={d.date}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.005 }}
                data-tooltip={`${d.date}: ${d.count} activities`}
                className="tooltip"
                style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: getColor(d.count),
                  border: '1px solid rgba(100,180,255,0.05)',
                  cursor: 'pointer',
                }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 12 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Less</span>
            {[0, 1, 2, 3].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: 2, background: getColor(c) }} />
            ))}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>More</span>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
