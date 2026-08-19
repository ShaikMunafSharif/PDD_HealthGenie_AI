import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, BookOpen, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, PageTransition, SectionHeader, Chip, GlassButton } from '../../components/ui/Components';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';
import { useWomenStore, useAuthStore } from '../../store/healthStore';

const defaultTips = [
  { title: 'Diet Management', desc: 'Focus on low-GI, anti-inflammatory foods (leafy greens, berries, fatty fish) to help stabilize blood sugar and manage insulin sensitivity.', icon: '🥗', key: 'diet' },
  { title: 'Regular Exercise', desc: 'Mix strength training with steady-state cardio (30 mins, 4-5x a week) to improve insulin response and lower testosterone levels.', icon: '🏃‍♀️', key: 'exercise' },
  { title: 'Stress Management', desc: 'High stress increases cortisol, which worsens insulin resistance. Practice yoga, breathing, or mindfulness.', icon: '🧘', key: 'stress' },
  { title: 'Sleep Hygiene', desc: 'Prioritize 7-8 hours of sound sleep. Inadequate sleep disrupts circadian rhythms and drives cravings.', icon: '😴', key: 'sleep' },
  { title: 'Supplementation', desc: 'Consider discussing Inositol (Ovasitol), Vitamin D3, and Omega-3s with your doctor to support cycle regularity.', icon: '💊', key: 'supplements' }
];

const trackerSymptoms = ['Irregular Periods', 'Weight Gain', 'Acne', 'Hair Loss', 'Excess Hair Growth', 'Fatigue', 'Mood Changes', 'Insulin Resistance'];

export default function PCOSCare() {
  const { periodLog, cycleLength } = useWomenStore();
  const { user } = useAuthStore();
  
  const [guidance, setGuidance] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  // Calculate BMI from user profile
  const weightNum = parseFloat(user?.weight);
  const heightNum = parseFloat(user?.height);
  const bmi = (weightNum && heightNum) ? (weightNum / ((heightNum / 100) ** 2)) : null;

  // Dynamically personalize management tips based on period tracker logs and user profile setup
  const getPersonalizedTips = () => {
    const allLoggedSymptoms = new Set();
    periodLog.forEach(log => {
      if (log.symptoms) {
        log.symptoms.forEach(s => allLoggedSymptoms.add(s.toLowerCase()));
      }
    });

    return defaultTips.map(tip => {
      let personalizedDesc = tip.desc;
      let isHighlighted = false;

      // Symptom-based enhancements
      if (tip.key === 'diet') {
        if (allLoggedSymptoms.has('acne')) {
          personalizedDesc += " (Highly recommended to reduce systemic inflammation driving your acne.)";
          isHighlighted = true;
        }
        if (allLoggedSymptoms.has('bloating')) {
          personalizedDesc += " (Helps flush excess water weight and alleviate bloating.)";
          isHighlighted = true;
        }
        if (allLoggedSymptoms.has('cravings')) {
          personalizedDesc += " (Stabilizes glucose levels to curb sugar cravings.)";
          isHighlighted = true;
        }
      }
      if (tip.key === 'exercise') {
        if (allLoggedSymptoms.has('fatigue')) {
          personalizedDesc += " (Boosts mitochondrial activity to counter your fatigue.)";
          isHighlighted = true;
        }
      }
      if (tip.key === 'stress') {
        if (allLoggedSymptoms.has('cramps')) {
          personalizedDesc += " (Directly calms the pelvic muscle contractions easing cramps.)";
          isHighlighted = true;
        }
        if (allLoggedSymptoms.has('mood swings')) {
          personalizedDesc += " (Regulates adrenaline spikes to smooth mood fluctuations.)";
          isHighlighted = true;
        }
      }
      if (tip.key === 'sleep') {
        if (allLoggedSymptoms.has('fatigue')) {
          personalizedDesc += " (Crucial to reset cellular energy levels and fight chronic fatigue.)";
          isHighlighted = true;
        }
      }

      // Profile-based enhancements
      if (bmi) {
        if (tip.key === 'diet' && bmi >= 25) {
          personalizedDesc += ` *Highly critical for weight control and improving insulin response given your BMI of ${bmi.toFixed(1)}.*`;
          isHighlighted = true;
        }
        if (tip.key === 'exercise' && bmi >= 25) {
          personalizedDesc += " *Helps clear glucose from blood to reduce fat storage matching your metabolic needs.*";
          isHighlighted = true;
        }
        if (tip.key === 'stress' && bmi < 25) {
          personalizedDesc += ` *Primary focus for Lean PCOS (BMI: ${bmi.toFixed(1)}) where stress and high cortisol are the primary cycle disruptors.*`;
          isHighlighted = true;
        }
      }
      if (user?.activityLevel === 'sedentary' && tip.key === 'exercise') {
        personalizedDesc += " *Since you have a sedentary routine, start with gentle 15-minute walks to build metabolic stamina.*";
        isHighlighted = true;
      }

      return {
        ...tip,
        desc: personalizedDesc,
        highlighted: isHighlighted
      };
    });
  };

  const getImmediatePCOSGuidance = (symptomListStr) => {
    const bmiStr = bmi ? ` (BMI: ${bmi.toFixed(1)})` : '';
    const weightFocus = bmi && bmi >= 25 
      ? "Given your BMI, we prioritize managing insulin sensitivity and gentle caloric balance."
      : "For lean PCOS, we focus primarily on stress reduction and strength training to balance cortisol.";
    
    return `PCOS Management Guidance: Stabilizing blood sugar levels and managing cortisol are key. Based on cycle logs averaging ${cycleLength} days ${symptomListStr ? `with logged symptoms (${symptomListStr})` : ''}${bmiStr}, ${weightFocus} We recommend focusing on low-GI meals, progressive strength training, and consistent stress-reduction habits.`;
  };

  const fetchPCOSGuidance = async () => {
    // Collect logged symptoms
    const loggedSymptoms = {};
    periodLog.forEach(log => {
      if (log.symptoms) {
        log.symptoms.forEach(s => {
          loggedSymptoms[s] = (loggedSymptoms[s] || 0) + 1;
        });
      }
    });

    const symptomListStr = Object.entries(loggedSymptoms)
      .map(([name]) => `${name}`)
      .join(', ');

    // Display immediate tip
    const immediateTip = getImmediatePCOSGuidance(symptomListStr);
    setGuidance(immediateTip);
    setLoading(false);
    setStillThinking(false);

    setStatus('ready');
    
    const bmiStr = bmi ? `, BMI of ${bmi.toFixed(1)} (${bmi >= 25 ? 'overweight/insulin-resistant focus' : 'lean PCOS focus'})` : '';
    const ageStr = user?.age ? `, age ${user?.age} years` : '';
    const goalStr = user?.goal ? `, goal to ${user?.goal} weight` : '';

    const prompt = `Give me a personalized, empathetic PCOS management tip based on these cycle logs: average cycle length of ${cycleLength} days, frequently logged symptoms: ${symptomListStr || 'none logged yet'}. Also consider user profile: ${ageStr}${bmiStr}${goalStr}. Keep it to 2 sentences. Highlight cycle length, primary symptoms, and BMI considerations.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'women')) {
        setGuidance(chunk.full);
      }
    } catch {
      setStatus('ready');
    }
  };

  useEffect(() => {
    fetchPCOSGuidance();
  }, [periodLog]);

  const personalizedTips = getPersonalizedTips();

  return (
    <PageTransition>
      <div className="theme-women" style={{ padding: '24px 24px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader eyebrow="PCOS MANAGEMENT" title="PCOS Care" subtitle="Personalized management and education" />

        {/* Profile Metrics Summary Panel */}
        {user?.age && (
          <GlassCard className="p-4" style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(191,95,255,0.15)' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <span>Age: <strong style={{ color: 'var(--text-primary)' }}>{user.age} yrs</strong></span>
              <span>Height: <strong style={{ color: 'var(--text-primary)' }}>{user.height} cm</strong></span>
              <span>Weight: <strong style={{ color: 'var(--text-primary)' }}>{user.weight} kg</strong></span>
              {bmi && <span>BMI: <strong style={{ color: 'var(--neon-fem)' }}>{bmi.toFixed(1)} ({bmi >= 25 ? 'Overweight' : 'Normal/Lean'})</strong></span>}
              <span>Activity: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{user.activityLevel}</strong></span>
              <span>Goal: <strong style={{ color: 'var(--neon-fem)', textTransform: 'capitalize' }}>{user.goal} weight</strong></span>
            </div>
          </GlassCard>
        )}
        
        <GlassCard className="p-6" style={{ marginBottom: 20, borderColor: 'rgba(191,95,255,0.3)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="var(--neon-fem)" />
            <span className="text-eyebrow" style={{ color: 'var(--neon-fem)' }}>AI-POWERED GUIDANCE</span>
          </div>


          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: '100%', height: 12 }} />
              <div className="skeleton" style={{ width: '85%', height: 12 }} />
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {guidance}
            </p>
          )}
        </GlassCard>

        <h3 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Personalized Management Tips</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 24 }}>
          {personalizedTips.map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <GlassCard className="p-5" style={{ height: '100%', border: t.highlighted ? '1px solid var(--neon-fem)' : '1px solid var(--glass-border)', boxShadow: t.highlighted ? '0 0 10px rgba(191,95,255,0.15)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                  <h4 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 600, color: t.highlighted ? 'var(--neon-fem)' : 'var(--text-primary)' }}>{t.title}</h4>
                </div>
                <p style={{ color: t.highlighted ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{t.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard className="p-6">
          <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Symptom Tracker</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12 }}>Track your PCOS symptoms to identify patterns</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {trackerSymptoms.map(s => <Chip key={s} label={s} variant="fem" />)}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
