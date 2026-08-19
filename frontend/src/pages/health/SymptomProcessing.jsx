import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NeuralProcessing, PageTransition } from '../../components/ui/Components';
import { useSymptomStore } from '../../store/healthStore';

export default function SymptomProcessing() {
  const navigate = useNavigate();
  const { selectedSymptoms } = useSymptomStore();
  const statusText = 'Connecting to HealthGenie AI...';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/symptoms/results');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageTransition>
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <NeuralProcessing text={statusText} />
        <motion.div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 400 }}>
          {selectedSymptoms.slice(0, 5).map((s, i) => (
            <motion.span key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              style={{ padding: '6px 14px', borderRadius: 20, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)', fontSize: '0.8rem', color: 'var(--neon-pulse)' }}>
              {s}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
