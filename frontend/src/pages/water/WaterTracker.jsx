import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus, Target, Award, TrendingUp, Undo, Trash2, RotateCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard, GlassButton, GlassInput, ProgressRing, PageTransition, SectionHeader, AnimatedCounter } from '../../components/ui/Components';
import { useWaterStore } from '../../store/healthStore';

const TARGET_PRESETS = [2500, 3000, 3500, 4000, 4500];

export default function WaterTracker() {
  const { 
    currentIntake, 
    dailyGoal, 
    intakeLog, 
    history, 
    streak, 
    addIntake, 
    subtractIntake, 
    undoLastIntake, 
    removeIntakeLogItem, 
    setDailyGoal, 
    clearTodayIntake 
  } = useWaterStore();

  const [customAmount, setCustomAmount] = useState('');

  // If stored goal in localStorage is unrealistically low (e.g. < 2000 ml like 750ml), automatically update to standard 3,500 ml
  useEffect(() => {
    useWaterStore.getState().checkNewDay();
    if (!dailyGoal || dailyGoal < 2000) {
      setDailyGoal(3500);
    }
  }, [dailyGoal, setDailyGoal]);

  const handleCustomAdd = (e) => {
    e.preventDefault();
    const val = parseInt(customAmount, 10);
    if (val && val > 0) {
      addIntake(val);
      setCustomAmount('');
    }
  };

  const pct = Math.min(100, (currentIntake / dailyGoal) * 100);
  const remaining = Math.max(0, dailyGoal - currentIntake);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const chartData = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysOfWeek[d.getDay()];
    
    if (i === 0) {
      chartData.push({
        day: dayName,
        intake: currentIntake,
        goal: dailyGoal,
      });
    } else {
      const pastEntry = history.find(h => h.date === dateStr);
      chartData.push({
        day: dayName,
        intake: pastEntry ? pastEntry.intake : 0,
        goal: pastEntry ? pastEntry.goal : dailyGoal,
      });
    }
  }

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 48px', maxWidth: 1040, margin: '0 auto' }}>
        <SectionHeader eyebrow="HYDRATION" title="Water Hydration Tracker" subtitle="Monitor daily fluid consumption and maintain healthy hydration goals" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 24 }}>
          {/* Water Bottle Visualization */}
          <GlassCard className="p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ position: 'relative', width: 130, height: 250, marginBottom: 16 }}>
              <svg viewBox="0 0 120 240" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.75" />
                  </linearGradient>
                  <clipPath id="bottleClip">
                    <rect x="25" y="40" width="70" height="180" rx="12" />
                  </clipPath>
                </defs>
                <rect x="40" y="10" width="40" height="25" rx="6" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                <rect x="25" y="40" width="70" height="180" rx="12" fill="#F8FAFC" stroke="#2563EB" strokeWidth="2.5" />
                <rect
                  clipPath="url(#bottleClip)"
                  x="25"
                  y={220 - (pct * 1.8)}
                  height={pct * 1.8}
                  width="70"
                  fill="url(#waterGrad)"
                  style={{ transition: 'all 0.8s ease-out' }}
                />
                <path
                  clipPath="url(#bottleClip)"
                  d={`M 25 ${220 - pct * 1.8} Q 45 ${215 - pct * 1.8} 60 ${220 - pct * 1.8} T 95 ${220 - pct * 1.8}`}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  style={{ transition: 'all 0.8s ease-out' }}
                />
                <text x="60" y="135" textAnchor="middle" fill="#111827" fontFamily="Inter" fontSize="22" fontWeight="800">
                  {Math.round(pct)}%
                </text>
              </svg>
            </div>

            <div style={{ fontSize: '2.4rem', color: '#111827', fontWeight: 800, fontFamily: 'Inter' }}>
              <AnimatedCounter value={currentIntake} suffix=" ml" />
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', marginTop: 2, fontWeight: 600 }}>
              of {dailyGoal.toLocaleString()} ml daily target • {remaining.toLocaleString()} ml remaining
            </p>

            {/* Quick Add Buttons */}
            <div style={{ width: '100%', marginTop: 16 }}>
              <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, letterSpacing: '0.04em', display: 'block', textAlign: 'center', marginBottom: 8 }}>
                QUICK PRESET ADD
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[250, 500, 750, 1000].map(ml => (
                  <GlassButton key={ml} onClick={() => addIntake(ml)} variant="primary" style={{ padding: '7px 12px', fontSize: '0.82rem', fontWeight: 700 }}>
                    <Plus size={13} /> +{ml}ml
                  </GlassButton>
                ))}
              </div>
            </div>

            {/* Custom Typed Intake Input */}
            <div style={{ width: '100%', marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, letterSpacing: '0.04em', display: 'block', textAlign: 'center', marginBottom: 8 }}>
                TYPE EXACT AMOUNT (ML)
              </span>
              <form onSubmit={handleCustomAdd} style={{ display: 'flex', gap: 8, maxWidth: 280, margin: '0 auto' }}>
                <GlassInput
                  type="number"
                  min="1"
                  max="5000"
                  placeholder="e.g. 67"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, color: '#111827', fontWeight: 600 }}
                />
                <GlassButton type="submit" variant="primary" style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}>
                  <Plus size={14} /> Add
                </GlassButton>
              </form>
            </div>

            {/* Quick Correct / Subtract / Undo Controls */}
            <div style={{ width: '100%', marginTop: 14, paddingTop: 14, borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 700, letterSpacing: '0.04em', display: 'block', textAlign: 'center', marginBottom: 8 }}>
                CORRECT MISTAKEN LOGS
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <GlassButton onClick={() => subtractIntake(250)} disabled={currentIntake <= 0} style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444', border: '1px solid #FECACA', background: '#FEF2F2' }}>
                  <Minus size={13} /> -250ml
                </GlassButton>
                <GlassButton onClick={() => subtractIntake(500)} disabled={currentIntake <= 0} style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#EF4444', border: '1px solid #FECACA', background: '#FEF2F2' }}>
                  <Minus size={13} /> -500ml
                </GlassButton>
                <GlassButton onClick={undoLastIntake} disabled={intakeLog.length === 0} style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#1D4ED8', border: '1px solid #BFDBFE', background: '#EFF6FF', fontWeight: 700 }}>
                  <Undo size={13} /> Undo Last
                </GlassButton>
              </div>
            </div>
          </GlassCard>

          {/* Stats & Goal Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <GlassCard className="p-5" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Target size={18} color="#2563EB" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Daily Goal Target</h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>Recommended healthy daily intake: 3,000 ml – 4,000 ml</p>
                </div>

                <ProgressRing value={currentIntake} max={dailyGoal} size={70} strokeWidth={6} color="#2563EB" bgColor="#F1F5F9">
                  <span style={{ fontSize: '0.82rem', color: '#2563EB', fontWeight: 800 }}>{Math.round(pct)}%</span>
                </ProgressRing>
              </div>

              {/* Target Selector Presets */}
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 8 }}>SELECT RECOMMENDED GOAL</span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {TARGET_PRESETS.map(preset => (
                    <motion.button key={preset} whileTap={{ scale: 0.95 }}
                      onClick={() => setDailyGoal(preset)}
                      style={{
                        padding: '6px 14px', borderRadius: 10, cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Inter', fontWeight: 700,
                        background: dailyGoal === preset ? '#2563EB' : '#F8FAFC',
                        border: `1px solid ${dailyGoal === preset ? '#2563EB' : '#E2E8F0'}`,
                        color: dailyGoal === preset ? '#FFFFFF' : '#4B5563',
                      }}>
                      {preset.toLocaleString()} ml
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Fine-tune Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.8rem', color: '#4B5563', fontWeight: 600 }}>Custom Fine-tune Target:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDailyGoal(Math.max(1000, dailyGoal - 250))}
                    style={{ width: 32, height: 32, borderRadius: 8, background: '#F1F5F9', border: '1px solid #E2E8F0', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Minus size={14} />
                  </motion.button>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', fontFamily: 'Inter' }}>{dailyGoal.toLocaleString()} ml</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setDailyGoal(dailyGoal + 250)}
                    style={{ width: 32, height: 32, borderRadius: 8, background: '#F1F5F9', border: '1px solid #E2E8F0', cursor: 'pointer', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={24} color="#D97706" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Hydration Streak</h3>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706', fontFamily: 'Inter' }}>{streak} Days Active</div>
              </div>
            </GlassCard>

            <GlassCard className="p-5" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Today's Consumption Log</h3>
                {intakeLog.length > 0 && (
                  <button onClick={clearTodayIntake} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <RotateCcw size={12} /> Clear All
                  </button>
                )}
              </div>
              {intakeLog.length === 0 ? (
                <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: 0 }}>No intake logged yet today</p>
              ) : (
                <div style={{ maxHeight: 140, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {intakeLog.map((entry, originalIdx) => (
                    <div key={entry.id || originalIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 700 }}>+{entry.amount} ml</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{new Date(entry.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                          onClick={() => removeIntakeLogItem(originalIdx)}
                          title="Delete this entry"
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>
                  )).reverse()}
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* History Chart */}
        <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={20} color="#2563EB" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>Weekly Intake History</h3>
          </div>
          <div style={{ width: '100%', height: 210, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={false} contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="intake" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
