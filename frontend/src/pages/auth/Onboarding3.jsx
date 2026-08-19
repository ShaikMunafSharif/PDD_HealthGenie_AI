import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, PartyPopper } from 'lucide-react';
import { GlassButton } from '../../components/ui/Components';
import { useAuthStore } from '../../store/healthStore';

const confettiColors = ['#00F5FF', '#39FF14', '#BF5FFF', '#FFB347', '#FF6B35'];

export default function Onboarding3() {
  const navigate = useNavigate();
  const setOnboardingComplete = useAuthStore(s => s.setOnboardingComplete);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 8,
    }));
    setConfetti(pieces);
  }, []);

  const handleFinish = () => {
    setOnboardingComplete();
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      {confetti.map((c) => (
        <motion.div key={c.id}
          initial={{ y: -20, x: `${c.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 720 }}
          transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
          style={{ position: 'absolute', top: 0, width: c.size, height: c.size, borderRadius: c.size > 8 ? 2 : '50%', background: c.color, zIndex: 10 }} />
      ))}

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        style={{ marginBottom: 32 }}>
        <motion.div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #00F5FF, #39FF14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          animate={{ rotate: [0, 10, -10, 0], boxShadow: ['0 0 30px rgba(0,245,255,0.4)', '0 0 60px rgba(57,255,20,0.5)', '0 0 30px rgba(0,245,255,0.4)'] }}
          transition={{ rotate: { duration: 2, repeat: Infinity }, boxShadow: { duration: 2, repeat: Infinity } }}>
          <PartyPopper size={44} color="#020510" />
        </motion.div>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.03em', marginBottom: 8 }}>
        You're All Set! 🎉
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 450, marginBottom: 40, fontSize: '1.05rem' }}>
        Your personal health journey begins now. HealthGenie AI is ready to help you achieve your wellness goals.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[1, 2, 3].map(s => (<div key={s} style={{ width: s === 3 ? 24 : 8, height: 8, borderRadius: 4, background: s === 3 ? 'var(--neon-pulse)' : 'var(--neon-health)' }} />))}
        </div>
        <GlassButton variant="primary" onClick={handleFinish}>
          <Sparkles size={18} /> Start My Journey <ArrowRight size={18} />
        </GlassButton>
      </motion.div>
    </div>
  );
}
