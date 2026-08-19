import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-void)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'var(--neon-pulse)' : i % 3 === 1 ? 'var(--neon-health)' : 'var(--neon-fem)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Logo Orb */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
        style={{ position: 'relative', marginBottom: 40 }}
      >
        <motion.div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #00F5FF, #39FF14 60%, #00F5FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animate={{
            boxShadow: [
              '0 0 40px rgba(0,245,255,0.3), 0 0 80px rgba(57,255,20,0.15)',
              '0 0 60px rgba(0,245,255,0.5), 0 0 120px rgba(57,255,20,0.25)',
              '0 0 40px rgba(0,245,255,0.3), 0 0 80px rgba(57,255,20,0.15)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles size={48} color="#020510" />
        </motion.div>

        {/* Orbiting rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 140 + i * 30,
              height: 140 + i * 30,
              borderRadius: '50%',
              border: '1px solid',
              borderColor: `rgba(0, 245, 255, ${0.15 - i * 0.04})`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6 + i * 3, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-display"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #00F5FF, #39FF14)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}
      >
        HealthGenie AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          marginTop: 12,
          fontFamily: 'Inter',
        }}
      >
        Your Personal Health Partner
      </motion.p>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: 80,
          width: 200,
          height: 3,
          borderRadius: 2,
          background: 'rgba(100, 180, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, var(--neon-pulse), transparent)',
            borderRadius: 2,
          }}
        />
      </motion.div>
    </div>
  );
}
