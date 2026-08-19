import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Dumbbell, Apple, Bell, BellOff, Zap, Clock, ChevronDown, Pill, Plus, X } from 'lucide-react';
import { PageTransition, SectionHeader, GlassButton } from '../../components/ui/Components';

// ━━━ CONSTANTS ━━━
const LS_KEY = 'healthgenie-reminder-settings';

const WATER_INTERVALS = [
  { label: '30 minutes', value: 30 * 60 * 1000 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '2 hours', value: 2 * 60 * 60 * 1000 },
  { label: '4 hours', value: 4 * 60 * 60 * 1000 },
];

const DEFAULT_SETTINGS = {
  water: { enabled: true, interval: 2 * 60 * 60 * 1000 },
  exercise: { enabled: true, time: '07:00' },
  meal: {
    enabled: true,
    breakfast: '08:00',
    lunch: '13:00',
    dinner: '20:00',
  },
  medicine: {
    enabled: true,
    times: ['09:00', '21:00']
  },
};

// ━━━ HELPERS ━━━
function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { 
        ...DEFAULT_SETTINGS, 
        ...parsed,
        medicine: parsed.medicine || DEFAULT_SETTINGS.medicine 
      };
    }
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings) {
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

function msUntilTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}

function getNextWaterTime(intervalMs) {
  const now = new Date();
  
  let startOfDay = new Date(now);
  startOfDay.setHours(8, 0, 0, 0); // 8:00 AM
  
  let endOfDay = new Date(now);
  endOfDay.setHours(22, 0, 0, 0); // 10:00 PM

  if (now < startOfDay) return startOfDay.getTime();
  
  if (now >= endOfDay) {
    startOfDay.setDate(startOfDay.getDate() + 1);
    return startOfDay.getTime();
  }

  // Calculate next interval relative to 8 AM
  const elapsedSince8AM = now.getTime() - startOfDay.getTime();
  const nextMultiple = Math.floor(elapsedSince8AM / intervalMs) * intervalMs + intervalMs;
  let nextTime = startOfDay.getTime() + nextMultiple;
  
  // If nextTime exceeds 10 PM, push to 8 AM tomorrow
  if (nextTime > endOfDay.getTime()) {
    startOfDay.setDate(startOfDay.getDate() + 1);
    return startOfDay.getTime();
  }
  
  return nextTime;
}

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatTimeLabel(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

function fireNotification(title, body, icon) {
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon, badge: icon, silent: false });
    } catch {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'notification', title, body });
      }
    }
  }
}

// ━━━ LIGHT THEME TOGGLE ━━━
function LightToggle({ active, onToggle, activeColor = '#2563EB' }) {
  return (
    <motion.div
      onClick={onToggle}
      whileTap={{ scale: 0.94 }}
      style={{
        position: 'relative',
        width: 52,
        height: 28,
        borderRadius: 14,
        background: active ? activeColor : '#E2E8F0',
        border: `1px solid ${active ? activeColor : '#CBD5E1'}`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: active ? `0 2px 8px ${activeColor}40` : 'none',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: active ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: 2,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </motion.div>
  );
}

// ━━━ LIGHT SELECT ━━━
function LightSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentLabel = options.find(o => o.value === value)?.label || '';

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderRadius: 12,
          background: '#F8FAFC', border: '1px solid #E5E7EB',
          cursor: 'pointer', fontSize: '0.88rem', color: '#111827',
          fontFamily: 'Inter, sans-serif', fontWeight: 500,
        }}
      >
        <span>{currentLabel}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={16} color="#6B7280" /></motion.div>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
              background: '#FFFFFF',
              border: '1px solid #E5E7EB', borderRadius: 12,
              overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
            }}
          >
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding: '10px 14px', fontSize: '0.88rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: opt.value === value ? '#EFF6FF' : 'transparent',
                  color: opt.value === value ? '#2563EB' : '#374151',
                  fontWeight: opt.value === value ? 600 : 400,
                  fontFamily: 'Inter, sans-serif',
                  borderBottom: '1px solid #F1F5F9',
                }}
                onMouseEnter={e => e.target.style.background = '#F8FAFC'}
                onMouseLeave={e => e.target.style.background = opt.value === value ? '#EFF6FF' : 'transparent'}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ━━━ LIGHT TIME PICKER ━━━
function LightTimePicker({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      {label && (
        <span style={{ fontSize: '0.82rem', color: '#4B5563', minWidth: 90, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          {label}
        </span>
      )}
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, padding: '9px 14px', borderRadius: 12,
          background: '#F8FAFC', border: '1px solid #E5E7EB',
          color: '#111827', fontSize: '0.9rem', outline: 'none',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
        onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.background = '#FFFFFF'; }}
        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#F8FAFC'; }}
      />
    </div>
  );
}

// ━━━ COUNTDOWN DISPLAY ━━━
function CountdownDisplay({ ms, color = '#2563EB' }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.82rem',
      fontWeight: 700,
      color: color,
    }}>
      {formatCountdown(ms)}
    </span>
  );
}

// ━━━ STATUS BADGE ━━━
function StatusBadge({ active, nextMs, color = '#2563EB' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 12px', borderRadius: 20,
        background: active ? '#EFF6FF' : '#F1F5F9',
        border: `1px solid ${active ? '#DBEAFE' : '#E2E8F0'}`,
        fontSize: '0.78rem', fontFamily: 'Inter, sans-serif', fontWeight: 500,
      }}
    >
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: active ? color : '#9CA3AF',
      }} />
      {active ? (
        <span style={{ color: '#374151' }}>
          Next in <CountdownDisplay ms={nextMs} color={color} />
        </span>
      ) : (
        <span style={{ color: '#6B7280' }}>Paused</span>
      )}
    </motion.div>
  );
}

// ━━━ REMINDER CARD ━━━
function ReminderCard({ icon: Icon, emoji, title, subtitle, color, bg, active, onToggle, onTest, statusActive, nextMs, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${active ? `${color}40` : '#E5E7EB'}`,
        borderRadius: 20,
        padding: 0,
        overflow: 'visible',
        boxShadow: active
          ? '0 6px 20px -3px rgba(0, 0, 0, 0.05)'
          : '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '20px 24px 14px',
      }}>
        <div
          style={{
            width: 44, height: 44, borderRadius: 14,
            background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{emoji}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: '#111827',
            fontFamily: 'Inter, sans-serif', margin: 0,
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '0.82rem', color: '#6B7280',
            fontFamily: 'Inter, sans-serif', margin: '2px 0 0',
          }}>
            {subtitle}
          </p>
        </div>

        <LightToggle active={active} onToggle={onToggle} activeColor={color} />
      </div>

      {/* Status badge */}
      <div style={{ padding: '0 24px 14px' }}>
        <StatusBadge active={statusActive} nextMs={nextMs} color={color} />
      </div>

      {/* Expandable settings */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}
          >
            <div style={{
              padding: '0 24px 16px',
              borderTop: '1px solid #F1F5F9',
              paddingTop: 16,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test button */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 24px 18px',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <GlassButton
                onClick={onTest}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  background: bg,
                  borderColor: `${color}40`,
                  color: color,
                }}
              >
                <Zap size={14} /> Test Notification
              </GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ━━━ PERMISSION BANNER ━━━
function PermissionBanner({ permission }) {
  if (permission === 'granted') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 18px', borderRadius: 16, marginBottom: 24,
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
        }}
      >
        <Bell size={18} color="#10B981" />
        <span style={{ fontSize: '0.85rem', color: '#065F46', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Notifications Active — Reminders will alert you directly on your system
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 18px', borderRadius: 16, marginBottom: 24,
        background: '#FEF2F2',
        border: '1px solid #FEE2E2',
        cursor: permission === 'default' ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (permission === 'default') Notification.requestPermission();
      }}
    >
      <BellOff size={18} color="#EF4444" />
      <span style={{ fontSize: '0.85rem', color: '#991B1B', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
        {permission === 'denied'
          ? 'Notifications are blocked — please enable notification permissions in browser settings'
          : 'Click here to enable browser notification alerts'
        }
      </span>
    </motion.div>
  );
}

// ━━━ MAIN COMPONENT ━━━
export default function NotificationSettings() {
  const [settings, setSettings] = useState(loadSettings);
  const [permission, setPermission] = useState('default');
  const [countdowns, setCountdowns] = useState({ water: 0, exercise: 0, meal: 0, medicine: 0 });
  
  const waterTimeoutRef = useRef(null);
  const exerciseTimeoutRef = useRef(null);
  const mealTimeoutsRef = useRef({ breakfast: null, lunch: null, dinner: null });
  const medicineTimeoutsRef = useRef({});
  const nextWaterRef = useRef(0);
  const nextExerciseRef = useRef(0);
  const nextMealRef = useRef(0);
  const nextMedicineRef = useRef(0);
  const countdownTickRef = useRef(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(p => setPermission(p));
      }
    }
  }, []);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    countdownTickRef.current = setInterval(() => {
      const now = Date.now();
      setCountdowns({
        water: Math.max(0, nextWaterRef.current - now),
        exercise: Math.max(0, nextExerciseRef.current - now),
        meal: Math.max(0, nextMealRef.current - now),
        medicine: Math.max(0, nextMedicineRef.current - now),
      });
    }, 1000);
    return () => clearInterval(countdownTickRef.current);
  }, []);

  const startWaterReminder = useCallback(() => {
    clearTimeout(waterTimeoutRef.current);
    if (!settings.water.enabled) { nextWaterRef.current = 0; return; }
    
    const scheduleNext = () => {
      const nextTime = getNextWaterTime(settings.water.interval);
      nextWaterRef.current = nextTime;
      const msUntilNext = nextTime - Date.now();
      
      waterTimeoutRef.current = setTimeout(() => {
        fireNotification('💧 Time to Drink Water!', 'Stay hydrated! Drink a glass of water now.', '💧');
        scheduleNext();
      }, msUntilNext);
    };
    
    scheduleNext();
  }, [settings.water.enabled, settings.water.interval]);

  useEffect(() => {
    startWaterReminder();
    return () => clearTimeout(waterTimeoutRef.current);
  }, [startWaterReminder]);

  const startExerciseReminder = useCallback(() => {
    clearTimeout(exerciseTimeoutRef.current);
    if (!settings.exercise.enabled) { nextExerciseRef.current = 0; return; }
    const ms = msUntilTime(settings.exercise.time);
    nextExerciseRef.current = Date.now() + ms;
    const scheduleNext = () => {
      const msNext = msUntilTime(settings.exercise.time);
      nextExerciseRef.current = Date.now() + msNext;
      exerciseTimeoutRef.current = setTimeout(() => {
        fireNotification('🏋️ Workout Time!', 'Time for your daily exercise! Stay active and healthy.', '🏋️');
        scheduleNext();
      }, msNext);
    };
    exerciseTimeoutRef.current = setTimeout(() => {
      fireNotification('🏋️ Workout Time!', 'Time for your daily exercise! Stay active and healthy.', '🏋️');
      scheduleNext();
    }, ms);
  }, [settings.exercise.enabled, settings.exercise.time]);

  useEffect(() => {
    startExerciseReminder();
    return () => clearTimeout(exerciseTimeoutRef.current);
  }, [startExerciseReminder]);

  const startMealReminders = useCallback(() => {
    clearTimeout(mealTimeoutsRef.current.breakfast);
    clearTimeout(mealTimeoutsRef.current.lunch);
    clearTimeout(mealTimeoutsRef.current.dinner);
    if (!settings.meal.enabled) { nextMealRef.current = 0; return; }

    const meals = [
      { key: 'breakfast', label: 'Breakfast', time: settings.meal.breakfast },
      { key: 'lunch', label: 'Lunch', time: settings.meal.lunch },
      { key: 'dinner', label: 'Dinner', time: settings.meal.dinner },
    ];

    let nearestMs = Infinity;
    meals.forEach(({ key, label, time }) => {
      const ms = msUntilTime(time);
      if (ms < nearestMs) nearestMs = ms;
      const schedule = () => {
        const nextMs = msUntilTime(time);
        mealTimeoutsRef.current[key] = setTimeout(() => {
          fireNotification(`🍽️ ${label} Time!`, `It's time for ${label.toLowerCase()}! Eat well and stay nourished.`, '🍎');
          schedule();
        }, nextMs);
      };
      mealTimeoutsRef.current[key] = setTimeout(() => {
        fireNotification(`🍽️ ${label} Time!`, `It's time for ${label.toLowerCase()}! Eat well and stay nourished.`, '🍎');
        schedule();
      }, ms);
    });
    nextMealRef.current = Date.now() + nearestMs;
  }, [settings.meal.enabled, settings.meal.breakfast, settings.meal.lunch, settings.meal.dinner]);

  useEffect(() => {
    startMealReminders();
    return () => {
      clearTimeout(mealTimeoutsRef.current.breakfast);
      clearTimeout(mealTimeoutsRef.current.lunch);
      clearTimeout(mealTimeoutsRef.current.dinner);
    };
  }, [startMealReminders]);

  const startMedicineReminders = useCallback(() => {
    Object.values(medicineTimeoutsRef.current).forEach(clearTimeout);
    medicineTimeoutsRef.current = {};
    if (!settings.medicine.enabled || !settings.medicine.times.length) { nextMedicineRef.current = 0; return; }

    let nearestMs = Infinity;
    settings.medicine.times.forEach((time, index) => {
      const ms = msUntilTime(time);
      if (ms < nearestMs) nearestMs = ms;
      const schedule = () => {
        const nextMs = msUntilTime(time);
        medicineTimeoutsRef.current[index] = setTimeout(() => {
          fireNotification(`💊 Medicine Time!`, `It's time to take your scheduled medicine.`, '💊');
          schedule();
        }, nextMs);
      };
      medicineTimeoutsRef.current[index] = setTimeout(() => {
        fireNotification(`💊 Medicine Time!`, `It's time to take your scheduled medicine.`, '💊');
        schedule();
      }, ms);
    });
    nextMedicineRef.current = Date.now() + nearestMs;
  }, [settings.medicine.enabled, settings.medicine.times]);

  useEffect(() => {
    startMedicineReminders();
    return () => Object.values(medicineTimeoutsRef.current).forEach(clearTimeout);
  }, [startMedicineReminders]);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  };

  const addMedicineTime = () => {
    setSettings(prev => ({
      ...prev,
      medicine: { ...prev.medicine, times: [...prev.medicine.times, '12:00'] }
    }));
  };

  const updateMedicineTime = (index, value) => {
    setSettings(prev => {
      const newTimes = [...prev.medicine.times];
      newTimes[index] = value;
      return { ...prev, medicine: { ...prev.medicine, times: newTimes } };
    });
  };

  const removeMedicineTime = (index) => {
    setSettings(prev => {
      const newTimes = prev.medicine.times.filter((_, i) => i !== index);
      return { ...prev, medicine: { ...prev.medicine, times: newTimes } };
    });
  };

  const toggleCategory = (category) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], enabled: !prev[category].enabled },
    }));
  };

  const testWater = () => fireNotification('💧 Water Reminder (Test)', 'This is a test! Drink a glass of water.', '💧');
  const testExercise = () => fireNotification('🏋️ Exercise Reminder (Test)', 'This is a test! Time to work out.', '🏋️');
  const testMeal = () => fireNotification('🍽️ Meal Reminder (Test)', 'This is a test! Time to eat well.', '🍎');
  const testMedicine = () => fireNotification('💊 Medicine Reminder (Test)', 'This is a test! Time to take your medicine.', '💊');

  useEffect(() => {
    if (!settings.meal.enabled) return;
    const tick = setInterval(() => {
      const times = [settings.meal.breakfast, settings.meal.lunch, settings.meal.dinner];
      const nearest = Math.min(...times.map(t => msUntilTime(t)));
      nextMealRef.current = Date.now() + nearest;
    }, 5000);
    return () => clearInterval(tick);
  }, [settings.meal.enabled, settings.meal.breakfast, settings.meal.lunch, settings.meal.dinner]);

  useEffect(() => {
    if (!settings.medicine.enabled || !settings.medicine.times.length) return;
    const tick = setInterval(() => {
      const nearest = Math.min(...settings.medicine.times.map(t => msUntilTime(t)));
      nextMedicineRef.current = Date.now() + nearest;
    }, 5000);
    return () => clearInterval(tick);
  }, [settings.medicine.enabled, settings.medicine.times]);

  return (
    <PageTransition>
      <div style={{
        padding: '28px 32px 60px',
        maxWidth: 720,
        margin: '0 auto',
      }}>
        <SectionHeader
          eyebrow="SETTINGS"
          title="Notification Reminders"
          subtitle="Configure daily alerts for hydration, workouts, and nutrition schedules"
        />

        <PermissionBanner permission={permission} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ━━━ WATER CARD ━━━ */}
          <ReminderCard
            icon={Droplets}
            emoji="💧"
            title="Water Reminders"
            subtitle="Hydration reminders at regular intervals"
            color="#06B6D4"
            bg="#CFFAFE"
            active={settings.water.enabled}
            onToggle={() => toggleCategory('water')}
            onTest={testWater}
            statusActive={settings.water.enabled}
            nextMs={countdowns.water}
          >
            <div>
              <label style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em',
                fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 8,
              }}>
                Reminder Interval
              </label>
              <LightSelect
                value={settings.water.interval}
                onChange={v => updateSetting('water', 'interval', v)}
                options={WATER_INTERVALS}
              />
            </div>
          </ReminderCard>

          {/* ━━━ EXERCISE CARD ━━━ */}
          <ReminderCard
            icon={Dumbbell}
            emoji="🏋️"
            title="Exercise Reminders"
            subtitle="Daily workout notifications"
            color="#2563EB"
            bg="#EFF6FF"
            active={settings.exercise.enabled}
            onToggle={() => toggleCategory('exercise')}
            onTest={testExercise}
            statusActive={settings.exercise.enabled}
            nextMs={countdowns.exercise}
          >
            <div>
              <label style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em',
                fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: 8,
              }}>
                Daily Workout Time
              </label>
              <LightTimePicker
                value={settings.exercise.time}
                onChange={v => updateSetting('exercise', 'time', v)}
              />
              <p style={{
                fontSize: '0.78rem', color: '#6B7280',
                marginTop: 6, fontFamily: 'Inter, sans-serif',
              }}>
                You'll be notified daily at {formatTimeLabel(settings.exercise.time)}
              </p>
            </div>
          </ReminderCard>

          {/* ━━━ MEAL CARD ━━━ */}
          <ReminderCard
            icon={Apple}
            emoji="🍎"
            title="Meal Reminders"
            subtitle="Breakfast, lunch & dinner alerts"
            color="#10B981"
            bg="#ECFDF5"
            active={settings.meal.enabled}
            onToggle={() => toggleCategory('meal')}
            onTest={testMeal}
            statusActive={settings.meal.enabled}
            nextMs={countdowns.meal}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em',
                fontFamily: 'Inter, sans-serif',
              }}>
                Meal Schedules
              </label>
              <LightTimePicker
                label="Breakfast"
                value={settings.meal.breakfast}
                onChange={v => updateSetting('meal', 'breakfast', v)}
              />
              <LightTimePicker
                label="Lunch"
                value={settings.meal.lunch}
                onChange={v => updateSetting('meal', 'lunch', v)}
              />
              <LightTimePicker
                label="Dinner"
                value={settings.meal.dinner}
                onChange={v => updateSetting('meal', 'dinner', v)}
              />
            </div>
          </ReminderCard>

          {/* ━━━ MEDICINE CARD ━━━ */}
          <ReminderCard
            icon={Pill}
            emoji="💊"
            title="Medicine Reminders"
            subtitle="Custom alerts for your daily medications"
            color="#8B5CF6"
            bg="#EDE9FE"
            active={settings.medicine.enabled}
            onToggle={() => toggleCategory('medicine')}
            onTest={testMedicine}
            statusActive={settings.medicine.enabled}
            nextMs={countdowns.medicine}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{
                  fontSize: '0.78rem', fontWeight: 600,
                  color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Medicine Schedule
                </label>
                <GlassButton
                  onClick={addMedicineTime}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    background: '#EDE9FE',
                    color: '#8B5CF6',
                    borderColor: '#DDD6FE',
                  }}
                >
                  <Plus size={14} style={{ marginRight: 4 }} /> Add Time
                </GlassButton>
              </div>

              {settings.medicine.times.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '4px 0' }}>
                  No medicine reminders scheduled. Click 'Add Time' to create one.
                </p>
              )}

              {settings.medicine.times.map((time, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.82rem', color: '#4B5563', minWidth: 20, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    #{idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <LightTimePicker
                      value={time}
                      onChange={v => updateMedicineTime(idx, v)}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, color: '#EF4444' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeMedicineTime(idx)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', padding: 4, display: 'flex',
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              ))}
            </div>
          </ReminderCard>
        </div>

        {/* ━━━ FOOTER INFO ━━━ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: 28,
            padding: '16px 20px',
            borderRadius: 16,
            background: '#F8FAFC',
            border: '1px solid #E5E7EB',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}
        >
          <Clock size={18} color="#6B7280" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{
            fontSize: '0.82rem', color: '#6B7280',
            lineHeight: 1.5, fontFamily: 'Inter, sans-serif', margin: 0,
          }}>
            Reminders are active while your browser is open. All preferences are saved automatically in your local browser profile.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
}
