import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight, AlertTriangle, Phone } from 'lucide-react';
import { GlassCard, GlassInput, PageTransition, SectionHeader } from '../../components/ui/Components';

const procedures = [
  { id: 'cpr', title: 'CPR', icon: '❤️', severity: 'critical', steps: ['Check for responsiveness', 'Call emergency services', 'Place heel of hand on center of chest', '30 chest compressions at 2 inches deep', '2 rescue breaths', 'Repeat until help arrives'] },
  { id: 'choking', title: 'Choking', icon: '🫁', severity: 'critical', steps: ['Ask "Are you choking?"', 'Stand behind the person', 'Make a fist above navel', '5 abdominal thrusts', 'Repeat until object dislodged', 'Call 108 if unresponsive'] },
  { id: 'burns', title: 'Burns', icon: '🔥', severity: 'high', steps: ['Cool burn under running water (10-20 min)', 'Remove jewelry near burn', 'Cover with sterile bandage', 'Do NOT apply ice or butter', 'Seek medical help for severe burns'] },
  { id: 'bleeding', title: 'Severe Bleeding', icon: '🩸', severity: 'critical', steps: ['Apply firm pressure with clean cloth', 'Elevate the wound above heart level', 'Do NOT remove embedded objects', 'Add more cloth if blood soaks through', 'Call emergency services'] },
  { id: 'fracture', title: 'Fracture', icon: '🦴', severity: 'high', steps: ['Immobilize the injured area', 'Apply ice wrapped in cloth', 'Do NOT try to straighten the bone', 'Support with splint if available', 'Seek immediate medical attention'] },
  { id: 'allergic', title: 'Allergic Reaction', icon: '⚠️', severity: 'critical', steps: ['Use EpiPen if available', 'Call emergency services', 'Lay person flat with legs elevated', 'Loosen tight clothing', 'Monitor breathing', 'Be ready to perform CPR'] },
  { id: 'heatstroke', title: 'Heat Stroke', icon: '🌡️', severity: 'high', steps: ['Move to cool area immediately', 'Remove excess clothing', 'Cool with water or ice packs', 'Fan the person', 'Give cool water if conscious'] },
  { id: 'poisoning', title: 'Poisoning', icon: '☠️', severity: 'critical', steps: ['Call Poison Control immediately', 'Do NOT induce vomiting unless told', 'Save the substance container', 'Note the time of ingestion', 'Monitor vital signs'] },
];

export default function FirstAid() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const filtered = procedures.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="EMERGENCY" title="First Aid Guide" subtitle="Step-by-step procedures for common emergencies" />
        
        <GlassCard className="p-4" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, borderColor: 'rgba(255,107,53,0.3)' }}>
          <Phone size={20} color="var(--neon-warn)" />
          <p style={{ fontSize: '0.85rem' }}>In a medical emergency, always call <strong style={{ color: 'var(--neon-warn)' }}>108</strong> first</p>
        </GlassCard>

        <GlassCard className="p-3" style={{ marginBottom: 20 }}>
          <GlassInput icon={Search} placeholder="Search first aid procedures..." value={search} onChange={e => setSearch(e.target.value)} />
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((proc, i) => (
            <motion.div key={proc.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-0" onClick={() => setExpanded(expanded === proc.id ? null : proc.id)} style={{ cursor: 'pointer', borderColor: proc.severity === 'critical' ? 'rgba(255,107,53,0.2)' : 'var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{proc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{proc.title}</h3>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: proc.severity === 'critical' ? 'rgba(255,0,64,0.1)' : 'rgba(255,107,53,0.1)', color: proc.severity === 'critical' ? '#FF0040' : 'var(--neon-warn)', border: `1px solid ${proc.severity === 'critical' ? 'rgba(255,0,64,0.2)' : 'rgba(255,107,53,0.2)'}` }}>
                      {proc.severity.toUpperCase()}
                    </span>
                  </div>
                  <motion.div animate={{ rotate: expanded === proc.id ? 90 : 0 }}>
                    <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
                  </motion.div>
                </div>
                {expanded === proc.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    style={{ padding: '0 20px 20px', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ paddingTop: 16 }}>
                      {proc.steps.map((step, j) => (
                        <div key={j} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="font-data" style={{ fontSize: '0.7rem', color: 'var(--neon-pulse)' }}>{j + 1}</span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
