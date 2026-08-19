import React, { useState } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, GlassInput, PageTransition, SectionHeader } from '../../components/ui/Components';

const checklist = [
  { week: 8, item: 'First prenatal visit', done: true }, { week: 12, item: 'First trimester screening', done: true },
  { week: 16, item: 'Quad screen blood test', done: false }, { week: 20, item: 'Anatomy scan (ultrasound)', done: false },
  { week: 24, item: 'Glucose screening test', done: false }, { week: 28, item: 'Rh factor test', done: false },
  { week: 32, item: 'Growth ultrasound', done: false }, { week: 36, item: 'Group B strep test', done: false },
  { week: 38, item: 'Weekly checkups begin', done: false }, { week: 40, item: 'Due date checkup', done: false },
];

export default function PregnancyDoctorVisits() {
  const [items, setItems] = useState(checklist);
  const toggle = (i) => setItems(items.map((item, idx) => idx === i ? { ...item, done: !item.done } : item));

  return (
    <PageTransition>
      <div className="theme-pregnancy" style={{ padding: '24px 24px 40px', maxWidth: 800, margin: '0 auto' }}>
        <SectionHeader eyebrow="APPOINTMENTS" title="Doctor Visits" subtitle="Prenatal checkup schedule and checklist" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <GlassCard className="p-4" onClick={() => toggle(i)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, opacity: item.done ? 0.6 : 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: item.done ? 'rgba(57,255,20,0.15)' : 'rgba(255,179,71,0.1)', border: `1px solid ${item.done ? 'var(--neon-health)' : 'rgba(255,179,71,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.done && <Check size={16} color="var(--neon-health)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: item.done ? 'line-through' : 'none' }}>{item.item}</p>
                </div>
                <span className="font-data" style={{ fontSize: '0.75rem', color: 'var(--neon-preg)' }}>Week {item.week}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
