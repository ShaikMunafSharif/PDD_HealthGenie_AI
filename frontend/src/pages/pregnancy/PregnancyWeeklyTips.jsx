import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader, GlassButton } from '../../components/ui/Components';
import { streamHealthGenie, checkOllamaStatus } from '../../services/ollamaService';

const weeklyTips = [
  { week: 14, title: 'Energy Boost', tip: 'Many women feel increased energy as morning sickness subsides. Great time to start gentle exercise!', emoji: '⚡' },
  { week: 15, title: 'Screening Tests', tip: 'Discuss prenatal screening options with your doctor. Second-trimester screenings are typically done between weeks 15-20.', emoji: '🔬' },
  { week: 16, title: 'Baby\'s Movements', tip: 'You might start feeling "quickening" — butterfly-like flutters in your lower abdomen. This is your baby moving!', emoji: '🦋' },
  { week: 17, title: 'Body Changes', tip: 'Your uterus is growing rapidly. You may notice a visible baby bump now. Time to invest in comfortable maternity wear.', emoji: '👗' },
  { week: 18, title: 'Anatomy Scan', tip: 'The mid-pregnancy ultrasound (anatomy scan) typically happens around week 18-20. You might learn the baby\'s sex!', emoji: '🏥' },
];

export default function PregnancyWeeklyTips() {
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('checking');
  const [stillThinking, setStillThinking] = useState(false);

  const fetchPregnancyTips = async () => {
    setLoading(true);
    setStillThinking(false);
    setTip('');

    setStatus('ready');
    const prompt = `Give me a brief, warm weekly pregnancy tip for Week 16. Keep it to 2 sentences. Focus on baby's development or mother's health.`;

    const timer = setTimeout(() => {
      setStillThinking(true);
    }, 10000);

    try {
      for await (const chunk of streamHealthGenie(prompt, 'pregnancy')) {
        setTip(chunk.full);
        setLoading(false);
      }
    } catch {
      setStatus('ready');
      setTip("Week 16 Tip: Your baby's hearing is developing rapidly! Talking, reading, or playing soothing music can help foster bonding early on.");
    } finally {
      clearTimeout(timer);
      setStillThinking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPregnancyTips();
  }, []);

  return (
    <PageTransition>
      <div className="theme-pregnancy" style={{ padding: '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader eyebrow="WEEKLY GUIDE" title="Weekly Tips" subtitle="Personalized guidance for each week of your pregnancy" />
        <GlassCard className="p-5" style={{ marginBottom: 20, borderColor: 'rgba(255,179,71,0.3)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Sparkles size={24} color="var(--neon-preg)" />
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 600 }}>AI Pregnancy Tip of the Week</h3>
          </div>


          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ width: '100%', height: 12 }} />
              <div className="skeleton" style={{ width: '85%', height: 12 }} />
              {stillThinking && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Still thinking...</span>}
            </div>
          ) : (
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {tip}
            </p>
          )}
        </GlassCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {weeklyTips.map((t, i) => (
            <GlassCard key={t.week} className="p-5" style={{ borderLeft: t.week === 16 ? '3px solid var(--neon-preg)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: '1.5rem' }}>{t.emoji}</span>
                <div>
                  <span className="font-data" style={{ color: 'var(--neon-preg)', fontSize: '0.8rem' }}>WEEK {t.week}</span>
                  <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>{t.title}</h3>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{t.tip}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
