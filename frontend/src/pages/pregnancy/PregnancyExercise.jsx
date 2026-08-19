import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader } from '../../components/ui/Components';

const exercises = [
  { name: 'Walking', duration: '30 min', safe: 'All trimesters', icon: '🚶‍♀️', desc: 'Low-impact cardio that\'s safe throughout pregnancy' },
  { name: 'Prenatal Yoga', duration: '25 min', safe: 'All trimesters', icon: '🧘', desc: 'Improves flexibility, reduces stress, prepares for labor' },
  { name: 'Swimming', duration: '30 min', safe: 'All trimesters', icon: '🏊', desc: 'Takes weight off joints, excellent full-body workout' },
  { name: 'Pelvic Floor Exercises', duration: '10 min', safe: 'All trimesters', icon: '💪', desc: 'Strengthens muscles for labor and postpartum recovery' },
  { name: 'Gentle Stretching', duration: '15 min', safe: 'All trimesters', icon: '🤸', desc: 'Relieves tension and improves circulation' },
  { name: 'Stationary Cycling', duration: '20 min', safe: 'T1 & T2', icon: '🚴', desc: 'Low-impact cardio, avoid if balance becomes an issue' },
];

export default function PregnancyExercise() {
  return (
    <PageTransition>
      <div className="theme-pregnancy" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="FITNESS" title="Safe Pregnancy Exercises" subtitle="Doctor-approved workouts for each trimester" />
        <GlassCard className="p-4" style={{ marginBottom: 20, borderColor: 'rgba(255,179,71,0.2)', background: 'rgba(255,179,71,0.04)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--neon-preg)', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚠️ Always consult your OB-GYN before starting any exercise routine during pregnancy. Stop if you feel pain, dizziness, or shortness of breath.
          </p>
        </GlassCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {exercises.map((ex, i) => (
            <motion.div key={ex.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{ex.icon}</span>
                  <div>
                    <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{ex.name}</h3>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,179,71,0.1)', color: 'var(--neon-preg)', border: '1px solid rgba(255,179,71,0.2)' }}>{ex.safe}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 8 }}>{ex.desc}</p>
                <span className="font-data" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>⏱ {ex.duration}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
