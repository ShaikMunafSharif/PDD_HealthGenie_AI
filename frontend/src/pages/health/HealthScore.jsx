import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, Award, Sparkles, ArrowRight } from 'lucide-react';
import { GlassCard, ProgressRing, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useHealthStore } from '../../store/healthStore';
import { streamHealthGenie } from '../../services/ollamaService';

const radarData = [
  { subject: 'Fitness', A: 65 }, { subject: 'Diet', A: 70 }, { subject: 'Sleep', A: 80 },
  { subject: 'Hydration', A: 60 }, { subject: 'Vitals', A: 75 },
];

const trendData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1, score: 55 + Math.floor(Math.random() * 30) + Math.floor(i * 0.5),
}));

export default function HealthScore() {
  const { healthScore, categories, achievements } = useHealthStore();
  const scoreColor = healthScore >= 80 ? '#10B981' : healthScore >= 50 ? '#2563EB' : '#8B5CF6';
  const navigate = useNavigate();

  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAIInsights = async () => {
    setLoading(true);
    setInsights('');
    
    const prompt = `Analyze my health score profile and suggest improvements. My overall health score is ${healthScore}. Detailed categories: ${JSON.stringify(categories)}. Achievements: ${achievements.map(a => a.name).join(', ')}. Provide 3 specific actionable tips and 1 short-term goal.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'healthScore')) {
        setInsights(chunk.full);
        setLoading(false);
      }
    } catch (err) {
      setInsights("Maintain a consistent daily sleep schedule, prioritize hydration with 2.5L+ water daily, and engage in 30 minutes of moderate activity to optimize your overall health score.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, []);

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="ANALYTICS" title="Health Score Overview" subtitle="Comprehensive intelligence breakdown of your daily vital health metrics" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
          {/* Big Score Card */}
          <GlassCard className="p-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <ProgressRing value={healthScore} size={200} strokeWidth={12} color={scoreColor} bgColor="#F1F5F9">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '3rem', color: '#111827', fontWeight: 800, lineHeight: 1, fontFamily: 'Inter' }}>{healthScore}</span>
                <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, letterSpacing: '0.05em', marginTop: 4 }}>OUT OF 100</span>
              </div>
            </ProgressRing>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginTop: 20, marginBottom: 4 }}>
              {healthScore >= 80 ? 'Optimal Health Index' : healthScore >= 60 ? 'Good Health Status' : 'Attention Recommended'}
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', textAlign: 'center' }}>
              You are performing in the top {100 - healthScore}% of HealthGenie users
            </p>
          </GlassCard>

          {/* Radar Chart */}
          <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: 16 }}>Category Breakdown</h3>
            <div style={{ width: '100%', height: 250, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Trend Chart */}
        <GlassCard className="p-6" style={{ marginBottom: 24, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>30-Day Health Trend</h3>
          </div>
          <div style={{ width: '100%', height: 210, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  labelStyle={{ color: '#111827', fontWeight: 700 }}
                />
                <Area type="monotone" dataKey="score" stroke="#2563EB" fill="url(#scoreGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Detail + Achievements */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: 16 }}>Detailed Metric Scores</h3>
            {Object.entries(categories).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ textTransform: 'capitalize', fontSize: '0.9rem', color: '#374151', fontWeight: 600 }}>{key}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: val >= 80 ? '#10B981' : val >= 50 ? '#2563EB' : '#F59E0B' }}>{val}/100</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#F1F5F9' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1 }}
                    style={{ height: '100%', borderRadius: 4, background: val >= 80 ? '#10B981' : val >= 50 ? '#2563EB' : '#F59E0B' }} />
                </div>
              </div>
            ))}
          </GlassCard>

          <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Award size={20} color="#F59E0B" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Unlocked Achievements</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {achievements.map((a) => (
                <motion.div key={a.id}
                  whileHover={{ scale: 1.03 }}
                  style={{
                    padding: 16, borderRadius: 16, textAlign: 'center',
                    background: a.unlocked ? '#EFF6FF' : '#F8FAFC',
                    border: `1px solid ${a.unlocked ? '#BFDBFE' : '#E5E7EB'}`,
                    opacity: a.unlocked ? 1 : 0.6,
                  }}>
                  <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: 4 }}>{a.icon}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: a.unlocked ? '#1E40AF' : '#6B7280' }}>{a.name}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* AI Insights */}
        <GlassCard className="p-6" style={{ marginTop: 24, background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)', borderRadius: 24, border: '1px solid #DBEAFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={18} color="#2563EB" />
            <span className="text-eyebrow">AI-POWERED INSIGHTS</span>
          </div>

          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0' }}>
              <div style={{ width: '100%', height: 16, background: '#DBEAFE', borderRadius: 8 }} />
              <div style={{ width: '90%', height: 16, background: '#DBEAFE', borderRadius: 8 }} />
            </div>
          )}

          {!loading && (
            <p style={{ color: '#1F2937', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.95rem', fontWeight: 500 }}>
              {insights}
            </p>
          )}

          <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/analytics/progress')}
            style={{ marginTop: 16, background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', fontWeight: 700, fontFamily: 'Inter' }}>
            View Full Analytics Progress <ArrowRight size={14} />
          </motion.button>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
