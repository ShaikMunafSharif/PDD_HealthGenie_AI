import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Target, Play, Heart, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassButton, PageTransition, SectionHeader } from '../../components/ui/Components';

const playAlertSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    console.warn("Failed to play audio alert sound:", e);
  }
};

const getDurationInSeconds = (repsOrTime) => {
  const lower = (repsOrTime || '').toLowerCase();
  if (lower.includes('min')) {
    const min = parseFloat(lower) || 1;
    return Math.round(min * 60);
  }
  const match = lower.match(/(\d+)\s*s/);
  if (match) {
    return parseInt(match[1]);
  }
  const matchSec = lower.match(/(\d+)\s*sec/);
  if (matchSec) {
    return parseInt(matchSec[1]);
  }
  return 30; 
};

const getExercisesForWorkout = (workoutName) => {
  const lower = (workoutName || '').toLowerCase();
  if (lower.includes('cardio') || lower.includes('walk') || lower.includes('run')) {
    return [
      { name: 'Jumping Jacks', sets: 3, reps: '30s work', rest: '15s', muscles: ['Full Body'], icon: '/exercises/jumping_jacks.png' },
      { name: 'High Knees', sets: 3, reps: '30s work', rest: '15s', muscles: ['Cardio', 'Legs'], icon: '/exercises/high_knees.png' },
      { name: 'Mountain Climbers', sets: 3, reps: '30s work', rest: '15s', muscles: ['Core', 'Shoulders'], icon: '/exercises/mountain_climbers.png' },
      { name: 'Bodyweight Squats', sets: 3, reps: '15 reps', rest: '30s', muscles: ['Quads', 'Glutes'], icon: '/exercises/bodyweight_squats.png' },
      { name: 'Plank Hold', sets: 3, reps: '45s hold', rest: '30s', muscles: ['Core'], icon: '/exercises/plank_hold.png' }
    ];
  }
  if (lower.includes('strength') || lower.includes('upper') || lower.includes('lower') || lower.includes('tone') || lower.includes('full body')) {
    return [
      { name: 'Push-ups', sets: 3, reps: '12 reps', rest: '45s', muscles: ['Chest', 'Triceps'], icon: '/exercises/push_ups.png' },
      { name: 'Bodyweight Squats', sets: 4, reps: '15 reps', rest: '45s', muscles: ['Quads', 'Glutes'], icon: '/exercises/bodyweight_squats.png' },
      { name: 'Plank to Push-up', sets: 3, reps: '10 reps', rest: '45s', muscles: ['Core', 'Shoulders'], icon: '/exercises/plank_to_pushup.png' },
      { name: 'Glute Bridges', sets: 3, reps: '15 reps', rest: '30s', muscles: ['Glutes', 'Hamstrings'], icon: '/exercises/glute_bridges.png' },
      { name: 'Lunges', sets: 3, reps: '12 each', rest: '30s', muscles: ['Legs', 'Glutes'], icon: '/exercises/lunges.png' }
    ];
  }
  if (lower.includes('yoga') || lower.includes('stretch') || lower.includes('mobility') || lower.includes('flexibility') || lower.includes('recovery')) {
    return [
      { name: 'Child Pose', sets: 1, reps: '1 min', rest: '0s', muscles: ['Back', 'Shoulders'], icon: '/exercises/child_pose.png' },
      { name: 'Downward Dog', sets: 3, reps: '30s hold', rest: '15s', muscles: ['Hamstrings', 'Shoulders'], icon: '/exercises/downward_dog.png' },
      { name: 'Cobra Stretch', sets: 3, reps: '30s hold', rest: '15s', muscles: ['Abs', 'Lower Back'], icon: '/exercises/cobra_stretch.png' },
      { name: 'Cat-Cow Pose', sets: 1, reps: '2 min', rest: '0s', muscles: ['Spine', 'Neck'], icon: '/exercises/cat_cow.png' },
      { name: 'Pigeon Pose', sets: 2, reps: '45s each', rest: '15s', muscles: ['Hips', 'Glutes'], icon: '/exercises/pigeon_pose.png' }
    ];
  }
  if (lower.includes('core') || lower.includes('abs') || lower.includes('crusher') || lower.includes('conditioning')) {
    return [
      { name: 'Crunches', sets: 3, reps: '15 reps', rest: '30s', muscles: ['Upper Abs'], icon: '/exercises/crunches.png' },
      { name: 'Leg Raises', sets: 3, reps: '12 reps', rest: '30s', muscles: ['Lower Abs'], icon: '/exercises/leg_raises.png' },
      { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '30s', muscles: ['Obliques'], icon: '/exercises/russian_twists.png' },
      { name: 'Plank Hold', sets: 3, reps: '45 sec', rest: '30s', muscles: ['Core'], icon: '/exercises/plank_hold.png' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: '30s', muscles: ['Obliques', 'Abs'], icon: '/exercises/bicycle_crunches.png' }
    ];
  }
  return [
    { name: 'Jumping Jacks', sets: 3, reps: '20 reps', rest: '30s', muscles: ['Full Body'], icon: '/exercises/jumping_jacks.png' },
    { name: 'Push-ups', sets: 3, reps: '12 reps', rest: '45s', muscles: ['Chest', 'Triceps'], icon: '/exercises/push_ups.png' },
    { name: 'Squats', sets: 4, reps: '15 reps', rest: '45s', muscles: ['Quads', 'Glutes'], icon: '/exercises/bodyweight_squats.png' },
    { name: 'Plank', sets: 3, reps: '45 sec', rest: '30s', muscles: ['Core'], icon: '/exercises/plank_hold.png' },
    { name: 'Lunges', sets: 3, reps: '12 each', rest: '30s', muscles: ['Legs', 'Glutes'], icon: '/exercises/lunges.png' }
  ];
};

export default function ExerciseDetails() {
  const navigate = useNavigate();
  const location = useLocation();

  const { workout } = location.state || {
    workout: { name: 'Morning Cardio', duration: '30 min', calories: 250, exercises: 5, level: 'Moderate', color: '#2563EB', icon: '🏃' }
  };

  const exerciseList = getExercisesForWorkout(workout.name);

  const [activeExIndex, setActiveExIndex] = useState(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState({});

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      playAlertSound();
      setIsTimerRunning(false);
      
      const currentEx = exerciseList[activeExIndex];
      if (currentSet < currentEx.sets) {
        setCurrentSet((prev) => prev + 1);
        setTimeLeft(getDurationInSeconds(currentEx.reps));
      } else {
        setCompletedExercises((prev) => ({
          ...prev,
          [currentEx.name]: true
        }));
        setActiveExIndex(null);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, activeExIndex, currentSet, exerciseList]);

  const handlePlayClick = (index, ex) => {
    if (activeExIndex === index) {
      setIsTimerRunning((prev) => !prev);
    } else {
      setActiveExIndex(index);
      setCurrentSet(1);
      setTimeLeft(getDurationInSeconds(ex.reps));
      setIsTimerRunning(true);
    }
  };

  const handleSkipSet = () => {
    playAlertSound();
    setIsTimerRunning(false);
    const currentEx = exerciseList[activeExIndex];
    if (currentSet < currentEx.sets) {
      setCurrentSet((prev) => prev + 1);
      setTimeLeft(getDurationInSeconds(currentEx.reps));
    } else {
      setCompletedExercises((prev) => ({
        ...prev,
        [currentEx.name]: true
      }));
      setActiveExIndex(null);
    }
  };

  const handleResetExercise = () => {
    setIsTimerRunning(false);
    const currentEx = exerciseList[activeExIndex];
    setCurrentSet(1);
    setTimeLeft(getDurationInSeconds(currentEx.reps));
  };

  return (
    <PageTransition>
      <div style={{ padding: '28px 32px 60px', maxWidth: 940, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <GlassButton onClick={() => navigate('/exercise/recommendations')} style={{ gap: 6 }}>
            <ArrowLeft size={16} /> Back to Workout Schedule
          </GlassButton>
        </div>
        <SectionHeader eyebrow="SESSION DETAILS" title={workout.name} subtitle={`${workout.duration} • ${workout.calories} calories • ${workout.level} intensity`} />
        
        <GlassCard className="p-5" style={{ marginBottom: 24, background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {[
              { icon: Clock, label: workout.duration, color: '#2563EB' },
              { icon: Flame, label: `${workout.calories} cal`, color: '#F97316' },
              { icon: Target, label: `${exerciseList.length} exercises`, color: '#10B981' },
              { icon: Heart, label: '120-150 bpm', color: '#8B5CF6' }
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', minWidth: 90 }}>
                <s.icon size={24} style={{ color: s.color, display: 'block', margin: '0 auto 6px' }} />
                <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Dynamic Exercise List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {exerciseList.map((ex, i) => {
            const isActive = activeExIndex === i;
            const isCompleted = !!completedExercises[ex.name];

            return (
              <motion.div key={ex.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <GlassCard className="p-5" style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#FFFFFF', borderRadius: 20, border: isActive ? '2px solid #2563EB' : isCompleted ? '1px solid #A7F3D0' : '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: `2px solid ${isCompleted ? '#10B981' : '#CBD5E1'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isCompleted ? '#10B981' : 'transparent',
                      color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 'bold', flexShrink: 0
                    }}>
                      {isCompleted && '✓'}
                    </div>

                    <div style={{ width: 50, height: 50, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, overflow: 'hidden' }}>
                      {ex.icon.includes('.') ? (
                        <img src={ex.icon} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
                      ) : (
                        ex.icon
                      )}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter' }}>{ex.name}</h3>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{ex.sets} sets × {ex.reps}</span>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>Rest: {ex.rest}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                        {ex.muscles.map(m => (
                          <span key={m} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: '#EFF6FF', color: '#2563EB', fontWeight: 600 }}>{m}</span>
                        ))}
                      </div>
                    </div>

                    <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                      onClick={() => handlePlayClick(i, ex)}
                      style={{ 
                        width: 44, height: 44, borderRadius: '50%', 
                        background: isActive && isTimerRunning ? '#FEF2F2' : '#EFF6FF', 
                        border: `1px solid ${isActive && isTimerRunning ? '#FCA5A5' : '#BFDBFE'}`, 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                      {isActive && isTimerRunning ? (
                        <Pause size={18} color="#EF4444" />
                      ) : (
                        <Play size={18} color="#2563EB" style={{ marginLeft: isActive ? 0 : 2 }} />
                      )}
                    </motion.button>
                  </div>

                  {isActive && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      style={{ marginTop: 8, padding: 16, borderRadius: 16, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700 }}>ACTIVE SET TRACKER</span>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '2px 0 0', fontFamily: 'Inter' }}>
                            Set {currentSet} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#6B7280' }}>of {ex.sets}</span>
                          </h4>
                        </div>

                        <div style={{ textAlign: 'center', padding: '6px 20px', borderRadius: 12, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                          <span style={{ fontSize: '0.68rem', color: '#2563EB', display: 'block', fontWeight: 700 }}>COUNTDOWN</span>
                          <span style={{ fontSize: '1.6rem', color: '#1E40AF', fontWeight: 800, fontFamily: 'Inter' }}>
                            {timeLeft}s
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <GlassButton onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {isTimerRunning ? 'Pause' : 'Play'}
                          </GlassButton>
                          <GlassButton onClick={handleSkipSet} style={{ padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600 }}>
                            Skip Set
                          </GlassButton>
                          <GlassButton onClick={handleResetExercise} style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#6B7280' }}>
                            Reset
                          </GlassButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Summary Checklist */}
        <GlassCard className="p-6" style={{ marginTop: 24, background: '#FFFFFF', borderRadius: 24, border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter' }}>
            <span>📋 Workout Progress Checklist</span>
            <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>
              ({Object.keys(completedExercises).length} of {exerciseList.length} completed)
            </span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {exerciseList.map((ex) => {
              const isDone = !!completedExercises[ex.name];
              return (
                <div key={ex.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: isDone ? '#ECFDF5' : '#F8FAFC', border: `1px solid ${isDone ? '#A7F3D0' : '#E2E8F0'}` }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `2px solid ${isDone ? '#10B981' : '#CBD5E1'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? '#10B981' : 'transparent',
                    color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 'bold'
                  }}>
                    {isDone && '✓'}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: isDone ? '#065F46' : '#374151', textDecoration: isDone ? 'line-through' : 'none', fontWeight: isDone ? 600 : 500 }}>
                    {ex.name}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#6B7280', marginLeft: 'auto', fontWeight: 500 }}>
                    {ex.sets} sets × {ex.reps}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
