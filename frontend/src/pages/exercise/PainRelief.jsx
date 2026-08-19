import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, PageTransition, SectionHeader, Chip } from '../../components/ui/Components';

const painAreas = ['Neck', 'Shoulder', 'Upper Back', 'Lower Back', 'Knee', 'Wrist', 'Hip', 'Ankle'];
const exercises = {
  'Neck': [{ name: 'Neck Rolls', desc: 'Slowly roll head in circles, 10 each direction', duration: '2 min' }, { name: 'Chin Tucks', desc: 'Pull chin toward chest, hold 5s', duration: '3 min' }],
  'Lower Back': [{ name: 'Cat-Cow Stretch', desc: 'Alternate arching and rounding back on all fours', duration: '3 min' }, { name: 'Knee-to-Chest', desc: 'Pull one knee at a time toward chest', duration: '2 min' }],
  'Shoulder': [{ name: 'Shoulder Shrugs', desc: 'Raise shoulders to ears, hold 3s, release', duration: '2 min' }, { name: 'Arm Circles', desc: 'Small to large circles, forward and back', duration: '3 min' }],
  'Knee': [{ name: 'Quad Stretch', desc: 'Stand on one leg, pull other foot behind', duration: '2 min' }, { name: 'Wall Sits', desc: 'Lean against wall, slide down to 90 degrees', duration: '3 min' }],
};

export default function PainRelief() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('Lower Back');
  const currentExercises = exercises[selected] || exercises['Lower Back'];

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="PAIN RELIEF" title="Targeted Relief Exercises" subtitle="Select your pain area for personalized exercises" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {painAreas.map(a => (<Chip key={a} label={a} active={selected === a} onClick={() => setSelected(a)} />))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {currentExercises.map((ex, i) => (
            <motion.div key={ex.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <GlassCard className="p-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <Target size={20} color="var(--neon-pulse)" />
                  <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{ex.name}</h3>
                  <span className="font-data" style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--neon-pulse)' }}>{ex.duration}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{ex.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <GlassButton onClick={() => navigate('/exercise/recommendations')}><ArrowLeft size={16} /> Back</GlassButton>
      </div>
    </PageTransition>
  );
}
