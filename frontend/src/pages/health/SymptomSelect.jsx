import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { GlassCard, GlassInput, Chip, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

const bodyParts = [
  { id: 'head', label: 'Head', x: 50, y: 8 },
  { id: 'throat', label: 'Throat', x: 50, y: 16 },
  { id: 'chest', label: 'Chest', x: 50, y: 28 },
  { id: 'stomach', label: 'Stomach', x: 50, y: 40 },
  { id: 'leftArm', label: 'Left Arm', x: 25, y: 35 },
  { id: 'rightArm', label: 'Right Arm', x: 75, y: 35 },
  { id: 'back', label: 'Back', x: 50, y: 45 },
  { id: 'hip', label: 'Hip', x: 50, y: 52 },
  { id: 'leftLeg', label: 'Left Leg', x: 40, y: 72 },
  { id: 'rightLeg', label: 'Right Leg', x: 60, y: 72 },
  { id: 'leftKnee', label: 'Left Knee', x: 40, y: 65 },
  { id: 'rightKnee', label: 'Right Knee', x: 60, y: 65 },
];

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
  'Body Ache', 'Sore Throat', 'Chest Pain', 'Shortness of Breath',
  'Stomach Pain', 'Diarrhea', 'Back Pain', 'Joint Pain', 'Rash',
  'Insomnia', 'Anxiety', 'Loss of Appetite', 'Swelling', 'Numbness',
];

export default function SymptomSelect() {
  const navigate = useNavigate();
  const { selectedBodyParts, selectedSymptoms, addBodyPart, addSymptom } = useSymptomStore();
  const [search, setSearch] = React.useState('');

  const filtered = commonSymptoms.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="SYMPTOM ANALYSIS" title="Select Your Symptoms" subtitle="Click on the body map or choose from common symptoms" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Body Map */}
          <GlassCard className="p-6">
            <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Body Map</h3>
            <div style={{ position: 'relative', width: '100%', maxWidth: 300, margin: '0 auto', aspectRatio: '1/2' }}>
              {/* SVG Human Silhouette */}
              <svg viewBox="0 0 100 200" style={{ width: '100%', height: '100%' }}>
                {/* Head */}
                <circle cx="50" cy="18" r="12" fill="none" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                {/* Body */}
                <line x1="50" y1="30" x2="50" y2="90" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                {/* Arms */}
                <line x1="50" y1="45" x2="25" y2="70" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                <line x1="50" y1="45" x2="75" y2="70" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                {/* Legs */}
                <line x1="50" y1="90" x2="35" y2="145" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                <line x1="50" y1="90" x2="65" y2="145" stroke="rgba(100,180,255,0.2)" strokeWidth="0.8" />
                {/* Torso outline */}
                <ellipse cx="50" cy="60" rx="18" ry="30" fill="none" stroke="rgba(100,180,255,0.15)" strokeWidth="0.5" />
              </svg>

              {/* Clickable body part hotspots */}
              {bodyParts.map((part) => {
                const isSelected = selectedBodyParts.includes(part.id);
                return (
                  <motion.div
                    key={part.id}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addBodyPart(part.id)}
                    style={{
                      position: 'absolute',
                      left: `${part.x}%`,
                      top: `${part.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: isSelected ? 'rgba(0,245,255,0.4)' : 'rgba(0,245,255,0.1)',
                      border: `2px solid ${isSelected ? 'var(--neon-pulse)' : 'rgba(0,245,255,0.2)'}`,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 12px rgba(0,245,255,0.5)' : 'none',
                      transition: 'all 0.3s',
                    }}
                    data-tooltip={part.label}
                    className="tooltip"
                  />
                );
              })}
            </div>

            {selectedBodyParts.length > 0 && (
              <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedBodyParts.map(bp => {
                  const part = bodyParts.find(p => p.id === bp);
                  return <Chip key={bp} label={part?.label || bp} active removable onRemove={() => addBodyPart(bp)} />;
                })}
              </div>
            )}
          </GlassCard>

          {/* Symptom List */}
          <div>
            <GlassCard className="p-6" style={{ marginBottom: 16 }}>
              <GlassInput icon={Search} placeholder="Search symptoms..." value={search} onChange={e => setSearch(e.target.value)} />
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Common Symptoms</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {filtered.map(s => (
                  <Chip key={s} label={s} active={selectedSymptoms.includes(s)} onClick={() => addSymptom(s)} />
                ))}
              </div>
            </GlassCard>

            {(selectedSymptoms.length > 0 || selectedBodyParts.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/symptoms/details')}
                  className="glass-btn glass-btn-primary"
                  style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                >
                  Continue to Details <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
