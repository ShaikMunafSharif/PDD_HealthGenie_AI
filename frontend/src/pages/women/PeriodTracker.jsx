import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { GlassCard, GlassButton, PageTransition, SectionHeader, Chip } from '../../components/ui/Components';
import { useWomenStore } from '../../store/healthStore';

const symptoms = ['Cramps', 'Headache', 'Bloating', 'Mood Swings', 'Fatigue', 'Acne', 'Back Pain', 'Cravings'];
const flowLevels = [{ id: 'none', label: 'None', color: 'transparent' }, { id: 'light', label: 'Light', color: '#FBCFE8' }, { id: 'medium', label: 'Medium', color: '#F472B6' }, { id: 'heavy', label: 'Heavy', color: '#EC4899' }];

export default function PeriodTracker() {
  const { cycleLength, lastPeriodStart, setLastPeriod, periodLog, logPeriodDay } = useWomenStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [flow, setFlow] = useState('none');
  const [saveStatus, setSaveStatus] = useState('');

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  useEffect(() => {
    if (selectedDate) {
      const existingLog = periodLog.find(log => log.date === selectedDate);
      if (existingLog) {
        setFlow(existingLog.flow || 'none');
        setSelectedSymptoms(existingLog.symptoms || []);
      } else {
        setFlow('none');
        setSelectedSymptoms([]);
      }
    }
  }, [selectedDate, periodLog]);

  const periodDays = useMemo(() => {
    if (!lastPeriodStart) return new Set();
    const days = new Set();
    const start = new Date(lastPeriodStart);
    for (let cycle = -2; cycle < 12; cycle++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(cycleStart.getDate() + (cycle * cycleLength));
      for (let i = 0; i < 5; i++) {
        const d = new Date(cycleStart);
        d.setDate(d.getDate() + i);
        days.add(d.toISOString().split('T')[0]);
      }
    }
    return days;
  }, [lastPeriodStart, cycleLength]);

  const ovulationDays = useMemo(() => {
    if (!lastPeriodStart) return new Set();
    const days = new Set();
    const start = new Date(lastPeriodStart);
    for (let cycle = -2; cycle < 12; cycle++) {
      const cycleStart = new Date(start);
      cycleStart.setDate(cycleStart.getDate() + (cycle * cycleLength) + Math.floor(cycleLength / 2));
      days.add(cycleStart.toISOString().split('T')[0]);
    }
    return days;
  }, [lastPeriodStart, cycleLength]);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const handleSaveLog = () => {
    logPeriodDay({
      date: selectedDate,
      flow: flow,
      symptoms: selectedSymptoms
    });
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1040, margin: '0 auto' }}>
        <SectionHeader eyebrow="CYCLE TRACKING" title="Period & Fertility Tracker" subtitle="Log cycle symptoms, track flow intensity, and forecast upcoming periods" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* Calendar Card */}
          <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <motion.button whileTap={{ scale: 0.9 }} onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><ChevronLeft size={20} /></motion.button>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <motion.button whileTap={{ scale: 0.9 }} onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><ChevronRight size={20} /></motion.button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} style={{ fontSize: '0.75rem', color: '#6B7280', padding: 4, fontWeight: 700 }}>{d}</span>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                const isPeriod = periodDays.has(dateStr);
                const isOvulation = ovulationDays.has(dateStr);
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const isSelected = selectedDate === dateStr;

                return (
                  <motion.div key={i} whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', cursor: 'pointer', margin: '0 auto',
                      background: isPeriod ? '#FCE7F3' : isOvulation ? '#E0F2FE' : 'transparent',
                      border: isSelected ? '2px solid #EC4899' : isToday ? '2px solid #2563EB' : '1px solid transparent',
                      color: isPeriod ? '#EC4899' : isOvulation ? '#0284C7' : isToday ? '#2563EB' : '#111827',
                      fontWeight: (isToday || isSelected) ? 700 : 500,
                    }}>
                    {i + 1}
                  </motion.div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 18, justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FCE7F3', border: '1px solid #EC4899' }} /><span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500 }}>Period</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E0F2FE', border: '1px solid #0284C7' }} /><span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500 }}>Ovulation</span></div>
            </div>

            <GlassButton variant="primary" fullWidth style={{ marginTop: 18, background: '#EC4899', borderColor: '#EC4899' }} onClick={() => {
              const dateToLog = selectedDate || new Date().toISOString().split('T')[0];
              setLastPeriod(dateToLog);
            }}>
              <Calendar size={16} style={{ marginRight: 8 }} /> Set {selectedDate ? selectedDate : 'Today'} as Period Start
            </GlassButton>

            {lastPeriodStart && (
              <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.82rem', color: '#6B7280' }}>
                Last period start: <strong style={{ color: '#EC4899' }}>{lastPeriodStart}</strong>
              </div>
            )}
          </GlassCard>

          {/* Symptom & Flow Log Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12 }}>Log Daily Symptoms</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {symptoms.map(s => (
                  <Chip key={s} label={s} active={selectedSymptoms.includes(s)}
                    onClick={() => setSelectedSymptoms(ss => ss.includes(s) ? ss.filter(i => i !== s) : [...ss, s])} />
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6" style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Droplets size={16} color="#EC4899" /> Flow Intensity
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {flowLevels.map(f => (
                  <motion.div key={f.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setFlow(f.id)}
                    style={{
                      padding: 12, borderRadius: 14, textAlign: 'center', cursor: 'pointer',
                      background: flow === f.id ? '#FCE7F3' : '#F8FAFC',
                      border: `1px solid ${flow === f.id ? '#EC4899' : '#E2E8F0'}`,
                    }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: f.color, border: '1px solid #F472B6', margin: '0 auto 6px' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: flow === f.id ? 700 : 500, color: flow === f.id ? '#BE185D' : '#4B5563' }}>{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
              <GlassCard className="p-5" style={{ textAlign: 'center', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
                <p style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700, letterSpacing: '0.05em', margin: '0 0 4px' }}>CYCLE AVERAGE</p>
                <span style={{ fontSize: '2.2rem', color: '#EC4899', fontWeight: 800, fontFamily: 'Inter' }}>{cycleLength}</span>
                <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0 }}>days</p>
              </GlassCard>

              <div>
                <GlassButton variant="primary" fullWidth onClick={handleSaveLog} style={{ background: '#EC4899', borderColor: '#EC4899', height: 48 }}>
                  Save Daily Log
                </GlassButton>
                {saveStatus && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    style={{ color: '#10B981', fontSize: '0.82rem', marginTop: 8, textAlign: 'center', fontWeight: 600 }}>
                    ✓ {saveStatus}
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
