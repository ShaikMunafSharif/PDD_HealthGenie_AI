import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, SkipForward, Target, Heart, Droplets, Apple, Dumbbell, Moon, Brain } from 'lucide-react';
import { GlassButton } from '../../components/ui/Components';

const goals = [
  { id: 'weight', icon: Target, label: 'Manage Weight', color: '#00F5FF' },
  { id: 'fitness', icon: Dumbbell, label: 'Get Fit', color: '#39FF14' },
  { id: 'nutrition', icon: Apple, label: 'Eat Healthier', color: '#FFB347' },
  { id: 'hydration', icon: Droplets, label: 'Stay Hydrated', color: '#00F5FF' },
  { id: 'sleep', icon: Moon, label: 'Better Sleep', color: '#BF5FFF' },
  { id: 'mental', icon: Brain, label: 'Mental Wellness', color: '#BF5FFF' },
  { id: 'heart', icon: Heart, label: 'Heart Health', color: '#FF6B35' },
];

export default function Onboarding2() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <button onClick={() => navigate('/dashboard')} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontFamily: 'Inter' }}>
        Skip <SkipForward size={16} />
      </button>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display"
        style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.03em', marginBottom: 8 }}>
        Personalize Your Experience
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 450, marginBottom: 32 }}>
        Select your health goals so we can customize your journey
      </motion.p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, maxWidth: 500, width: '100%', marginBottom: 40 }}>
        {goals.map((g, i) => {
          const isSelected = selected.includes(g.id);
          return (
            <motion.div key={g.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => toggle(g.id)}
              style={{
                padding: 20, borderRadius: 16, textAlign: 'center', cursor: 'pointer',
                background: isSelected ? `${g.color}15` : 'var(--glass-surface)',
                border: `1px solid ${isSelected ? `${g.color}60` : 'var(--glass-border)'}`,
                boxShadow: isSelected ? `0 0 20px ${g.color}20` : 'none',
                transition: 'all 0.3s',
              }}>
              <motion.div animate={isSelected ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
                <g.icon size={28} style={{ color: isSelected ? g.color : 'var(--text-secondary)', margin: '0 auto 8px', display: 'block' }} />
              </motion.div>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{g.label}</span>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{ width: 20, height: 20, borderRadius: '50%', background: g.color, margin: '8px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#020510', fontWeight: 700 }}>✓</motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[1, 2, 3].map(s => (<div key={s} style={{ width: s === 2 ? 24 : 8, height: 8, borderRadius: 4, background: s === 2 ? 'var(--neon-pulse)' : s < 2 ? 'var(--neon-health)' : 'rgba(100,180,255,0.2)' }} />))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <GlassButton onClick={() => navigate('/onboarding/1')}><ArrowLeft size={18} /> Back</GlassButton>
        <GlassButton variant="primary" onClick={() => navigate('/onboarding/3')}>Continue <ArrowRight size={18} /></GlassButton>
      </div>
    </div>
  );
}
