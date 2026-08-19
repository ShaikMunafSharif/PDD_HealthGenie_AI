import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Droplets, Flame, Moon, Footprints } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader } from '../../components/ui/Components';
import { useHealthStore, useWaterStore, useStepStore } from '../../store/healthStore';
import { generateHistoricalData } from '../../utils/healthCalculations';

export default function AnalyticsProgress() {
  const { dailyStats, healthScore } = useHealthStore();
  const currentIntake = useWaterStore(s => s.currentIntake);
  const currentSteps = useStepStore(s => s.currentSteps);

  const healthData = useMemo(() => {
    return generateHistoricalData(30, { ...dailyStats, steps: currentSteps }, healthScore, currentIntake);
  }, [dailyStats, currentSteps, healthScore, currentIntake]);

  return (
    <PageTransition>
      <div style={{ padding: '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="ANALYTICS" title="Progress Dashboard" subtitle="Track your health metrics over time" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <GlassCard className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><TrendingUp size={18} color="var(--neon-pulse)" /><h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Health Score Trend</h3></div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={healthData}>
                <defs><linearGradient id="scoreG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} /><stop offset="95%" stopColor="#00F5FF" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="dayIndex" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#00F5FF" fill="url(#scoreG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Droplets size={18} color="#00F5FF" /><h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Water Intake</h3></div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthData.slice(-14)}>
                <XAxis dataKey="dayIndex" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12 }} />
                <Bar dataKey="water" fill="#00F5FF" radius={[4, 4, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <GlassCard className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Footprints size={18} color="#39FF14" /><h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Daily Steps</h3></div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={healthData.slice(-14)}>
                <defs><linearGradient id="stepsG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} /><stop offset="95%" stopColor="#39FF14" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="dayIndex" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="steps" stroke="#39FF14" fill="url(#stepsG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>
          <GlassCard className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><Moon size={18} color="#BF5FFF" /><h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 600 }}>Sleep Hours</h3></div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthData.slice(-14)}>
                <XAxis dataKey="dayIndex" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 12]} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(4,13,31,0.95)', border: '1px solid var(--glass-border)', borderRadius: 12 }} />
                <Bar dataKey="sleep" fill="#BF5FFF" radius={[4, 4, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
