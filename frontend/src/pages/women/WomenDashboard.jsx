import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Calendar, BarChart3, Sparkles, Apple, ArrowRight } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useWomenStore } from '../../store/healthStore';

const modules = [
  { path: '/women/period-tracker', icon: Calendar, label: 'Period Tracker', desc: 'Track your cycle and predict next period', color: '#EC4899', icon2: '🌸' },
  { path: '/women/period-insights', icon: BarChart3, label: 'Cycle Insights', desc: 'AI-powered pattern analysis', color: '#8B5CF6', icon2: '📊' },
  { path: '/women/pcos-care', icon: Heart, label: 'PCOS Care', desc: 'Personalized PCOS management', color: '#D946EF', icon2: '💜' },
  { path: '/women/skin-care', icon: Sparkles, label: 'Skin Care', desc: 'Hormone-synced skincare tips', color: '#F43F5E', icon2: '✨' },
  { path: '/women/diet', icon: Apple, label: "Women's Nutrition", desc: 'Iron, calcium & hormone-aware diet', color: '#10B981', icon2: '🥗' },
];

export default function WomenDashboard() {
  const navigate = useNavigate();
  const { lastPeriodStart, getCycleDay, getNextPeriod } = useWomenStore();

  const cycleDay = getCycleDay();
  const nextPeriod = getNextPeriod();

  let titleText = 'No Cycle Logged';
  let descText = 'Track your period cycle to enable daily hormone-synced tips and predictions.';

  if (lastPeriodStart && cycleDay) {
    titleText = `Cycle Day ${cycleDay}`;
    
    let phaseName = 'Follicular Phase';
    if (cycleDay <= 5) phaseName = 'Menstrual Phase';
    else if (cycleDay <= 11) phaseName = 'Follicular Phase';
    else if (cycleDay <= 16) phaseName = 'Ovulation Phase';
    else phaseName = 'Luteal Phase';

    const daysToNext = nextPeriod ? Math.max(0, Math.ceil((new Date(nextPeriod).getTime() - Date.now()) / 86400000)) : null;
    const countdownStr = daysToNext !== null ? ` • Next period in ~${daysToNext} day${daysToNext === 1 ? '' : 's'}` : '';
    
    descText = `${phaseName}${countdownStr}`;
  }

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1040, margin: '0 auto' }}>
        <SectionHeader eyebrow="WOMEN'S HEALTH" title="Your Wellness Hub" subtitle="Comprehensive specialized health care and cycle tracking" />

        {/* Hero Card */}
        <GlassCard className="p-6" style={{ marginBottom: 24, borderRadius: 24, border: '1px solid #FBCFE8', background: 'linear-gradient(135deg, #FDF2F8 0%, #FFFFFF 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: '#FCE7F3', border: '1px solid #FBCFE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={28} color="#EC4899" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>{titleText}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.88rem', margin: '3px 0 0' }}>{descText}</p>
            </div>
            <GlassButton variant="primary" onClick={() => navigate('/women/period-tracker')} style={{ background: '#EC4899', borderColor: '#EC4899' }}>
              Track Cycle <ArrowRight size={16} />
            </GlassButton>
          </div>
        </GlassCard>

        {/* Modules Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {modules.map((mod, i) => (
            <motion.div key={mod.path} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard className="p-6" onClick={() => navigate(mod.path)} style={{ cursor: 'pointer', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                    {mod.icon2}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>{mod.label}</h3>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>{mod.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
