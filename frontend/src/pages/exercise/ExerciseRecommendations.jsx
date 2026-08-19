import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Flame, ArrowRight, Sparkles, Target, ChevronRight, Footprints, Trash2, RotateCcw } from 'lucide-react';
import { GlassCard, PageTransition, SectionHeader, GlassButton, ProgressRing, AnimatedCounter } from '../../components/ui/Components';
import { streamHealthGenie } from '../../services/ollamaService';
import { useAuthStore, useExerciseStore, useStepStore } from '../../store/healthStore';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const beginnerWorkoutPlan = {
  Monday: [
    { name: 'Morning Walk & Stretch', duration: '20 min', calories: 100, exercises: 4, level: 'Light', color: '#2563EB', icon: '🚶' },
    { name: 'Basic Core Exercises', duration: '15 min', calories: 80, exercises: 4, level: 'Light', color: '#F59E0B', icon: '🔥' }
  ],
  Tuesday: [
    { name: 'Low Impact Cardio', duration: '25 min', calories: 150, exercises: 5, level: 'Light', color: '#06B6D4', icon: '🏃' }
  ],
  Wednesday: [
    { name: 'Yoga & Flexibility', duration: '20 min', calories: 90, exercises: 8, level: 'Light', color: '#8B5CF6', icon: '🧘' }
  ],
  Thursday: [
    { name: 'Evening Walk', duration: '30 min', calories: 130, exercises: 1, level: 'Light', color: '#10B981', icon: '🚶' }
  ],
  Friday: [
    { name: 'Light Full Body Tone', duration: '20 min', calories: 120, exercises: 5, level: 'Light', color: '#10B981', icon: '💪' }
  ],
  Saturday: [
    { name: 'Active Recovery Walk', duration: '35 min', calories: 150, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Sunday: [
    { name: 'Deep Stretching', duration: '20 min', calories: 70, exercises: 8, level: 'Light', color: '#8B5CF6', icon: '🧘' }
  ]
};

const intermediateWorkoutPlan = {
  Monday: [
    { name: 'Morning Cardio Run', duration: '30 min', calories: 250, exercises: 5, level: 'Moderate', color: '#2563EB', icon: '🏃' },
    { name: 'Core Crusher Workout', duration: '20 min', calories: 150, exercises: 6, level: 'Moderate', color: '#F59E0B', icon: '🔥' }
  ],
  Tuesday: [
    { name: 'Upper Body Strength', duration: '45 min', calories: 320, exercises: 8, level: 'Intense', color: '#10B981', icon: '💪' },
    { name: 'Evening Steady Walk', duration: '20 min', calories: 100, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Wednesday: [
    { name: 'Yoga Flow & Balance', duration: '25 min', calories: 120, exercises: 10, level: 'Light', color: '#8B5CF6', icon: '🧘' }
  ],
  Thursday: [
    { name: 'HIIT Cardio Interval', duration: '25 min', calories: 350, exercises: 10, level: 'Intense', color: '#EF4444', icon: '⚡' }
  ],
  Friday: [
    { name: 'Lower Body Strength', duration: '40 min', calories: 300, exercises: 7, level: 'Moderate', color: '#10B981', icon: '💪' }
  ],
  Saturday: [
    { name: 'Total Core Conditioning', duration: '20 min', calories: 160, exercises: 6, level: 'Moderate', color: '#F59E0B', icon: '🔥' },
    { name: 'Evening Walk', duration: '30 min', calories: 140, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Sunday: [
    { name: 'Full Body Mobility & Rest', duration: '30 min', calories: 110, exercises: 10, level: 'Light', color: '#8B5CF6', icon: '🧘' }
  ]
};

const advancedWorkoutPlan = {
  Monday: [
    { name: 'HIIT Sprint Cardio', duration: '40 min', calories: 450, exercises: 8, level: 'Intense', color: '#EF4444', icon: '⚡' },
    { name: 'Hardcore Abs & Core', duration: '25 min', calories: 200, exercises: 8, level: 'Intense', color: '#F59E0B', icon: '🔥' }
  ],
  Tuesday: [
    { name: 'Heavy Upper Body Strength', duration: '60 min', calories: 500, exercises: 10, level: 'Intense', color: '#10B981', icon: '💪' },
    { name: 'Power Evening Walk', duration: '30 min', calories: 180, exercises: 1, level: 'Light', color: '#06B6D4', icon: '🚶' }
  ],
  Wednesday: [
    { name: 'Vinyasa Power Yoga', duration: '35 min', calories: 180, exercises: 12, level: 'Moderate', color: '#8B5CF6', icon: '🧘' }
  ],
  Thursday: [
    { name: 'Tabata Full Body Burn', duration: '30 min', calories: 480, exercises: 12, level: 'Intense', color: '#EF4444', icon: '⚡' }
  ],
  Friday: [
    { name: 'Heavy Lower Body Strength', duration: '55 min', calories: 450, exercises: 9, level: 'Intense', color: '#10B981', icon: '💪' }
  ],
  Saturday: [
    { name: 'Full Body Kettlebell Style', duration: '45 min', calories: 400, exercises: 8, level: 'Intense', color: '#10B981', icon: '💪' },
    { name: 'Cardio Core Finisher', duration: '20 min', calories: 180, exercises: 6, level: 'Intense', color: '#F59E0B', icon: '🔥' }
  ],
  Sunday: [
    { name: 'Deep Restorative Yoga & Recovery', duration: '45 min', calories: 150, exercises: 12, level: 'Light', color: '#8B5CF6', icon: '🧘' }
  ]
};

export default function ExerciseRecommendations() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { workoutPlan } = useExerciseStore();
  
  const [activeDay, setActiveDay] = useState(days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [aiPlan, setAiPlan] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Steps Tab State
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'steps'
  const [customSteps, setCustomSteps] = useState('');
  const { currentSteps, dailyGoal, addSteps, subtractSteps, undoLastStep, stepLog, removeStepLogItem, setDailyGoal } = useStepStore();

  let baselinePlan = intermediateWorkoutPlan;
  if (user?.goal === 'lose' || user?.activityLevel === 'sedentary') {
    baselinePlan = beginnerWorkoutPlan;
  } else if (user?.goal === 'gain' || user?.activityLevel === 'active') {
    baselinePlan = advancedWorkoutPlan;
  }

  const activePlan = workoutPlan || baselinePlan;
  const todayWorkouts = activePlan[activeDay] || baselinePlan[activeDay];

  const getImmediateRecommendation = (dayName, workoutsForDay) => {
    if (!workoutsForDay || workoutsForDay.length === 0) {
      return "Rest and recovery day! Practice light stretching or deep breathing to help your muscles heal and rebuild.";
    }
    const main = workoutsForDay[0];
    const totalDuration = workoutsForDay.reduce((sum, w) => sum + parseInt(w.duration) || 0, 0);
    const totalCalories = workoutsForDay.reduce((sum, w) => sum + w.calories || 0, 0);
    return `Today's recommendation: ${main.name} (${main.duration} • ${main.level} intensity). Overall active target is ${totalDuration} minutes with an estimated burn of ${totalCalories} kcal.`;
  };

  const fetchWorkoutPlan = async () => {
    const immediateTip = getImmediateRecommendation(activeDay, todayWorkouts);
    setAiPlan(immediateTip);
    setLoading(false);

    const prompt = `Give me a short daily personalized exercise recommendation for ${activeDay} based on these scheduled workouts: ${JSON.stringify(todayWorkouts)}. Keep it under 2 sentences. Highlight the primary exercise and target calorie burn.`;

    try {
      for await (const chunk of streamHealthGenie(prompt, 'exercise_tip')) {
        setAiPlan(chunk.full);
      }
    } catch {
      // Keep immediate tip
    }
  };

  useEffect(() => {
    fetchWorkoutPlan();
  }, [activeDay]);

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeader eyebrow="EXERCISE & FITNESS" title="Workout & Activity" subtitle="Personalized training schedule and daily step tracking" />
        
        {/* Top Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, padding: 4, background: '#F8FAFC', borderRadius: 16, border: '1px solid #E5E7EB', width: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('workout')}
            style={{
              padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 8,
              background: activeTab === 'workout' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'workout' ? '#2563EB' : '#6B7280',
              boxShadow: activeTab === 'workout' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
            }}>
            <Dumbbell size={18} /> Workout Plan
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            style={{
              padding: '10px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 8,
              background: activeTab === 'steps' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'steps' ? '#10B981' : '#6B7280',
              boxShadow: activeTab === 'steps' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s',
            }}>
            <Footprints size={18} /> Steps Tracker
          </button>
        </div>

        {activeTab === 'workout' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Recommendation Card */}
        <GlassCard className="p-6" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12, background: 'linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 100%)', borderRadius: 24, border: '1px solid #DBEAFE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={22} color="#2563EB" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>AI Daily Exercise Guidance</h3>
          </div>

          {loading ? (
            <div style={{ width: '100%', height: 16, background: '#DBEAFE', borderRadius: 8 }} />
          ) : (
            <p style={{ color: '#1F2937', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontWeight: 500 }}>
              {aiPlan}
            </p>
          )}


        </GlassCard>

        {/* Day Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 8 }}>
          {days.map(d => (
            <motion.button key={d} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveDay(d)}
              style={{
                padding: '10px 20px', borderRadius: 14, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Inter', whiteSpace: 'nowrap', fontWeight: 600,
                background: activeDay === d ? '#2563EB' : '#FFFFFF',
                border: `1px solid ${activeDay === d ? '#2563EB' : '#E5E7EB'}`,
                color: activeDay === d ? '#FFFFFF' : '#4B5563',
                boxShadow: activeDay === d ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
              }}>
              {d.slice(0, 3)}
            </motion.button>
          ))}
        </div>

        {/* Workouts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
          {todayWorkouts.map((w, i) => (
            <motion.div key={w.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard 
                className="p-5 hover:shadow-lg transition-shadow" 
                style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB', cursor: 'pointer' }}
                onClick={() => navigate('/exercise/details', { state: { workout: w } })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {w.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>{w.name}</h3>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: w.color, fontWeight: 700, border: `1px solid ${w.color}40`, display: 'inline-block', marginTop: 4 }}>{w.level}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} color="#6B7280" /><span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{w.duration}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={14} color="#F97316" /><span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{w.calories} cal</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target size={14} color="#2563EB" /><span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{w.exercises} exercises</span></div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
          {(!todayWorkouts || todayWorkouts.length === 0) && (
            <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: '#6B7280' }}>
              Rest Day. Enjoy some downtime or gentle movement to allow your muscles to recover!
            </div>
          )}
        </div>
        </motion.div>
        )}

        {activeTab === 'steps' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Progress Card */}
            <GlassCard className="p-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)', borderRadius: 24, border: '1px solid #DCFCE7' }}>
              <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 24px' }}>
                <ProgressRing progress={Math.min(100, (currentSteps / dailyGoal) * 100)} size={220} strokeWidth={18} color="#10B981" />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Footprints size={28} color="#10B981" style={{ marginBottom: 4 }} />
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', lineHeight: 1.1, fontFamily: 'Inter' }}>
                    <AnimatedCounter value={currentSteps} />
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>/ {dailyGoal} steps</span>
                </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>Daily Steps Goal</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', textAlign: 'center', maxWidth: 280 }}>
                {currentSteps >= dailyGoal ? "Incredible! You've reached your daily step target." : "Keep moving! Every step brings you closer to your goal."}
              </p>
            </GlassCard>

            {/* Controls Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <GlassCard className="p-6">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: 16 }}>Quick Add Steps</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {[100, 500, 1000, 2000].map(amt => (
                    <button key={amt} onClick={() => addSteps(amt)}
                      style={{ padding: '12px', borderRadius: 14, border: '1px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.color = '#10B981'; e.currentTarget.style.background = '#ECFDF5'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#F9FAFB'; }}>
                      + {amt}
                    </button>
                  ))}
                </div>

                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4B5563', marginBottom: 12 }}>Custom Amount</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    type="number"
                    placeholder="Enter steps..."
                    value={customSteps}
                    onChange={(e) => setCustomSteps(e.target.value)}
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '0.95rem', outline: 'none' }}
                  />
                  <GlassButton variant="primary" onClick={() => { if(customSteps) { addSteps(Number(customSteps)); setCustomSteps(''); } }}>
                    Add
                  </GlassButton>
                </div>
              </GlassCard>

              {/* Goal & Log */}
              <GlassCard className="p-6">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>Step History</h3>
                  <button onClick={undoLastStep} disabled={stepLog.length === 0} style={{ background: 'none', border: 'none', color: stepLog.length === 0 ? '#D1D5DB' : '#EF4444', cursor: stepLog.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600 }}>
                    <RotateCcw size={14} /> Undo Last
                  </button>
                </div>

                <div style={{ maxHeight: 200, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stepLog.slice().reverse().map((log, i) => (
                    <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Footprints size={16} color="#10B981" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>+{log.amount} steps</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button onClick={() => removeStepLogItem(stepLog.length - 1 - i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {stepLog.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF', fontSize: '0.85rem' }}>No steps logged today.</div>
                  )}
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#4B5563', marginBottom: 12 }}>Adjust Daily Goal</h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input
                      type="number"
                      defaultValue={dailyGoal}
                      onBlur={(e) => setDailyGoal(Number(e.target.value) || 10000)}
                      style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', background: '#F9FAFB', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}


      </div>
    </PageTransition>
  );
}
