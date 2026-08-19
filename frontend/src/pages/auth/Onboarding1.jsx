import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, SkipForward, Activity, Shield, Brain } from 'lucide-react';
import { GlassCard, GlassButton } from '../../components/ui/Components';

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Get instant health insights from advanced AI', color: '#00F5FF' },
  { icon: Activity, title: 'Complete Health Tracking', desc: 'Monitor diet, exercise, water & more', color: '#39FF14' },
  { icon: Shield, title: 'Emergency Ready', desc: 'Quick access to emergency support 24/7', color: '#FF6B35' },
];

export default function Onboarding1() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <button onClick={() => navigate('/dashboard')} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontFamily: 'Inter' }}>
        Skip <SkipForward size={16} />
      </button>

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} style={{ marginBottom: 40, position: 'relative' }}>
        <motion.div style={{ width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #00F5FF, #39FF14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          animate={{ boxShadow: ['0 0 30px rgba(0,245,255,0.3)', '0 0 60px rgba(0,245,255,0.5)', '0 0 30px rgba(0,245,255,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <Sparkles size={40} color="#020510" />
        </motion.div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="font-display" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.03em', marginBottom: 8 }}>
        Meet Your Health Partner
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 500, marginBottom: 40 }}>
        HealthGenie AI combines cutting-edge artificial intelligence with comprehensive health tracking to be your personal health companion.
      </motion.p>

      <div style={{ display: 'grid', gap: 16, maxWidth: 500, width: '100%', marginBottom: 40 }}>
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}>
            <GlassCard className="p-5" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon size={22} style={{ color: f.color }} />
              </div>
              <div>
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 2 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{f.desc}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {[1, 2, 3].map(s => (<div key={s} style={{ width: s === 1 ? 24 : 8, height: 8, borderRadius: 4, background: s === 1 ? 'var(--neon-pulse)' : 'rgba(100,180,255,0.2)', transition: 'all 0.3s' }} />))}
      </div>
      <GlassButton variant="primary" onClick={() => navigate('/onboarding/2')}>Continue <ArrowRight size={18} /></GlassButton>
    </div>
  );
}
