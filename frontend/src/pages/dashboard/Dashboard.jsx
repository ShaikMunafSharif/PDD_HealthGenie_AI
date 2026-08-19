import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, Droplets, Apple, Dumbbell, Stethoscope, AlertTriangle,
  Heart, Baby, BarChart3, Bell, Footprints, Moon, Flame, Sparkles,
  HeartPulse, ArrowRight, TrendingUp, Download, CheckCircle2,
  Calendar, Clock, ShieldCheck, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard, GlassButton, ProgressRing, AnimatedCounter, StreakBadge, PageTransition } from '../../components/ui/Components';
import { useHealthStore, useWaterStore, useAuthStore, useStreakStore, useStepStore } from '../../store/healthStore';
import { calculateBMR, calculateDailyCalories, calculateDailyStepsTarget, calculateSleepTarget, generateHistoricalData } from '../../utils/healthCalculations';

const moduleCards = [
  { path: '/symptoms/select', icon: Stethoscope, label: 'Symptom Analysis', desc: 'AI-powered health check', color: '#2563EB', bg: '#EFF6FF' },
  { path: '/diet/plan', icon: Apple, label: 'Diet & Nutrition', desc: 'Personalized meal plans', color: '#10B981', bg: '#ECFDF5' },
  { path: '/exercise/recommendations', icon: Dumbbell, label: 'Workout Plan', desc: 'Custom exercise routines', color: '#3B82F6', bg: '#EFF6FF' },
  { path: '/water', icon: Droplets, label: 'Water Hydration', desc: 'Track daily fluid intake', color: '#06B6D4', bg: '#CFFAFE' },
  { path: '/women/dashboard', icon: Heart, label: "Women's Health", desc: 'Period & PCOS care', color: '#8B5CF6', bg: '#F3E8FF' },
  { path: '/pregnancy/dashboard', icon: Baby, label: 'Pregnancy Care', desc: 'Weekly maternal tracking', color: '#F59E0B', bg: '#FEF3C7' },
  { path: '/emergency', icon: AlertTriangle, label: 'Emergency Hub', desc: 'SOS alerts & hospitals', color: '#EF4444', bg: '#FEF2F2' },
  { path: '/first-aid', icon: HeartPulse, label: 'First Aid Guides', desc: 'Step-by-step emergency care', color: '#F97316', bg: '#FFEDD5' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { healthScore, categories, dailyStats } = useHealthStore();
  const { currentIntake, dailyGoal } = useWaterStore();
  const { currentSteps } = useStepStore();
  const user = useAuthStore(s => s.user);
  const { currentStreak } = useStreakStore();

  const filteredModuleCards = useMemo(() => {
    return moduleCards.filter(card => {
      if (card.path.startsWith('/women') || card.path.startsWith('/pregnancy')) {
        return user?.gender === 'female';
      }
      return true;
    });
  }, [user]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const scoreColor = healthScore >= 80 ? '#10B981' : healthScore >= 50 ? '#2563EB' : '#8B5CF6';

  // --- DYNAMIC CALCULATIONS ---
  const bmr = calculateBMR(user?.weight || 70, user?.height || 170, user?.age || 30, user?.gender || 'male');
  const calTarget = calculateDailyCalories(bmr, user?.activityLevel || 'moderate');
  const stepTarget = calculateDailyStepsTarget(user?.activityLevel || 'moderate');
  const sleepTarget = calculateSleepTarget(user?.age || 30);
  
  const weeklyData = useMemo(() => {
    return generateHistoricalData(7, dailyStats, healthScore, currentIntake);
  }, [dailyStats, healthScore, currentIntake]);

  const stats = [
    { icon: Footprints, label: 'Daily Steps', value: currentSteps, target: stepTarget, unit: '', trend: '+12% vs yesterday', color: '#2563EB', bg: '#EFF6FF' },
    { icon: Droplets, label: 'Water Intake', value: currentIntake, target: dailyGoal, unit: 'ml', trend: `${Math.round((currentIntake / dailyGoal) * 100)}% of daily goal`, color: '#06B6D4', bg: '#CFFAFE' },
    { icon: Flame, label: 'Active Calories', value: dailyStats.calories, target: calTarget, unit: 'kcal', trend: '+15% active burn', color: '#F97316', bg: '#FFEDD5' },
    { icon: Moon, label: 'Sleep Rest', value: dailyStats.sleep, target: sleepTarget, unit: 'hrs', trend: '92% optimal rest', color: '#8B5CF6', bg: '#F3E8FF' },
  ];

  // --- DYNAMIC AI INSIGHTS ---
  const aiInsight = useMemo(() => {
    const waterDeficit = dailyGoal - currentIntake;
    const stepDeficit = stepTarget - currentSteps;
    
    if (healthScore >= 80) {
      if (waterDeficit > 0) return `Great job maintaining strong vitals! Your physical activity patterns are in sync. Consider adding ${waterDeficit}ml of water to complete today's streak.`;
      if (stepDeficit > 0) return `Excellent overall health index today! You only need ${stepDeficit} more steps to hit your dynamic daily target. Keep moving!`;
      return "Outstanding work! All your vital metrics and goals for today have been met. Focus on recovery and maintaining this perfect streak.";
    } else if (healthScore >= 60) {
      return `You are making steady progress today. To reach an optimal score of 80+, aim to cover ${Math.max(0, stepDeficit)} steps and drink ${Math.max(0, waterDeficit)}ml of water before the day ends.`;
    } else {
      return `Focus on building foundational habits today. Your system detects a deficit in daily activity. Try to log ${Math.max(0, waterDeficit)}ml of water and increase your movement.`;
    }
  }, [healthScore, dailyGoal, currentIntake, stepTarget, currentSteps]);

  const recommendedAction = useMemo(() => {
    if (currentIntake < dailyGoal) return { title: `Log ${Math.min(500, dailyGoal - currentIntake)}ml Water`, path: '/water' };
    if (currentSteps < stepTarget) return { title: 'Take a 15-Min Walk', path: '/exercise/recommendations' };
    return { title: 'Review Health Report', path: '/analytics/health-report' };
  }, [currentIntake, dailyGoal, currentSteps, stepTarget]);

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ padding: '28px 32px 48px', maxWidth: 1280, margin: '0 auto' }}
      >
        {/* Header Greeting */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="text-eyebrow" style={{ marginBottom: 4 }}>DASHBOARD OVERVIEW</p>
              <h1 style={{ fontFamily: 'Inter', fontSize: '2.2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.03em' }}>
                {greeting}, {user?.name || 'User'} 👋
              </h1>
              <p style={{ color: '#6B7280', fontSize: '0.95rem', marginTop: 2 }}>
                Here is your personal health intelligence and vital metrics for today.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <StreakBadge count={currentStreak} />
              <GlassButton variant="primary" onClick={() => navigate('/health-score')}>
                <Activity size={16} /> View Score Details
              </GlassButton>
            </div>
          </div>
        </motion.div>

        {/* HERO SECTION: Health Score Card + AI Insights Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 28 }}>
          {/* Health Score Hero Card */}
          <motion.div variants={itemVariants}>
            <GlassCard
              className="p-6"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 60%, #EFF6FF 100%)',
                border: '1px solid #E5E7EB',
                borderRadius: 24,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 260,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  {/* Progress Ring */}
                  <ProgressRing value={healthScore} size={130} strokeWidth={10} color={scoreColor} bgColor="#F1F5F9">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1, fontFamily: 'Inter' }}>
                        {healthScore}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700, letterSpacing: '0.05em', marginTop: 2 }}>
                        OUT OF 100
                      </span>
                    </div>
                  </ProgressRing>

                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: healthScore >= 80 ? '#ECFDF5' : '#EFF6FF', border: `1px solid ${healthScore >= 80 ? '#A7F3D0' : '#BFDBFE'}`, marginBottom: 8 }}>
                      <ShieldCheck size={14} color={scoreColor} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: scoreColor }}>
                        {healthScore >= 80 ? 'Optimal Health Status' : healthScore >= 60 ? 'Good Condition' : 'Attention Recommended'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: 6 }}>Overall Health Index</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: 260 }}>
                      Calculated from your sleep quality, daily steps, hydration, and nutrition intake.
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievements & Action CTA Row */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 16, marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>
                    <CheckCircle2 size={16} color="#10B981" /> Daily goals 85% met
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '2px 8px', borderRadius: 12 }}>
                    <TrendingUp size={14} /> +5% this week
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <GlassButton variant="primary" onClick={() => navigate('/analytics/health-report')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    View Full Report <ArrowRight size={14} />
                  </GlassButton>
                  <GlassButton onClick={() => navigate('/analytics/health-report')} style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    <Download size={14} />
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Insight Assistant Panel */}
          <motion.div variants={itemVariants}>
            <GlassCard
              className="p-6"
              style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 60%, #F0FDFA 100%)',
                border: '1px solid #DBEAFE',
                borderRadius: 24,
                boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 260,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={18} color="#FFFFFF" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>AI Health Intelligence</h3>
                      <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 500 }}>Engineered by HealthGenie AI</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2563EB', background: '#DBEAFE', padding: '3px 8px', borderRadius: 12 }}>
                      98% Confidence
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', background: '#F1F5F9', padding: '3px 8px', borderRadius: 12 }}>
                      Generated Today
                    </span>
                  </div>
                </div>

                <p style={{ color: '#1F2937', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500, margin: '12px 0 16px' }}>
                  {aiInsight}
                </p>
              </div>

              <div style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Zap size={18} color="#2563EB" />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Recommended Action</p>
                    <p style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 700 }}>{recommendedAction.title}</p>
                  </div>
                </div>
                <GlassButton variant="primary" onClick={() => navigate(recommendedAction.path)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Complete
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* 4 STATS CARDS GRID */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard
                  className="p-5"
                  style={{
                    borderRadius: 20,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <stat.icon size={22} style={{ color: stat.color }} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#10B981', background: '#ECFDF5', padding: '2px 8px', borderRadius: 10 }}>
                      {stat.trend}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                    {stat.label}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', fontFamily: 'Inter', lineHeight: 1 }}>
                      <AnimatedCounter value={stat.value} />
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>
                      / {stat.target.toLocaleString()} {stat.unit}
                    </span>
                  </div>

                  {/* Sparkline / Progress Bar */}
                  <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stat.value / stat.target) * 100)}%` }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 3, background: stat.color }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MIDDLE SECTION: Weekly Health Trends Chart + Category Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 28 }}>
          {/* Recharts Analytics Chart */}
          <motion.div variants={itemVariants} style={{ gridColumn: 'span 2' }}>
            <GlassCard className="p-6" style={{ borderRadius: 24, background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Weekly Health Trends</h3>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Your score and step performance over the last 7 days</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#2563EB', fontWeight: 600 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB' }} /> Health Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} /> Step Index
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', height: 230, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} domain={[60, 100]} />
                    <Tooltip
                      contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      labelStyle={{ fontWeight: 700, color: '#111827' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Categories & Goals */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" style={{ borderRadius: 24, background: '#FFFFFF', border: '1px solid #E5E7EB', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Category Progress</h3>
                  <BarChart3 size={18} color="#2563EB" />
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 20 }}>Breakdown by vital wellness sectors</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {Object.entries(categories).map(([key, val]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                        <span style={{ textTransform: 'capitalize' }}>{key}</span>
                        <span style={{ color: val >= 80 ? '#10B981' : '#2563EB', fontWeight: 700 }}>{val}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${val}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          style={{
                            height: '100%',
                            borderRadius: 4,
                            background: val >= 80 ? '#10B981' : val >= 60 ? '#2563EB' : '#F59E0B',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>All metrics synced</span>
                <GlassButton onClick={() => navigate('/analytics/progress')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Details <ArrowRight size={12} />
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* MODULE CARDS GRID */}
        <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Health Modules</h2>
              <p style={{ fontSize: '0.88rem', color: '#6B7280' }}>Access specialized AI healthcare services</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {filteredModuleCards.map((mod) => (
              <motion.div
                key={mod.path}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard
                  className="p-5"
                  onClick={() => navigate(mod.path)}
                  style={{
                    borderRadius: 20,
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    cursor: 'pointer',
                    minHeight: 140,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: mod.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                    }}>
                      <mod.icon size={22} style={{ color: mod.color }} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>{mod.label}</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.8rem', lineHeight: 1.4 }}>{mod.desc}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', fontWeight: 600, color: mod.color, marginTop: 12 }}>
                    Open Module <ArrowRight size={12} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* UPCOMING REMINDERS & TASKS */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6" style={{ borderRadius: 24, background: '#FFFFFF', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Bell size={20} color="#2563EB" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Upcoming Health Schedule</h3>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2563EB', background: '#EFF6FF', padding: '4px 10px', borderRadius: 12 }}>
                3 Pending Today
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {[
                { time: '12:30 PM', task: 'Hydration Intake (300ml)', tag: 'Water', color: '#06B6D4', bg: '#CFFAFE' },
                { time: '01:30 PM', task: 'Balanced Low-Carb Lunch', tag: 'Diet', color: '#10B981', bg: '#ECFDF5' },
                { time: '05:00 PM', task: '15-Min Evening Stretch', tag: 'Exercise', color: '#2563EB', bg: '#EFF6FF' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 16,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Clock size={16} color="#6B7280" />
                    <div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827' }}>{item.task}</p>
                      <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Scheduled for {item.time}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: item.color, background: item.bg, padding: '3px 8px', borderRadius: 10 }}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
