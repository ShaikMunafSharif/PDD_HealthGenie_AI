import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ━━━ AUTH STORE ━━━
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      hasCompletedSetup: false,
      
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setSetupComplete: () => set({ hasCompletedSetup: true }),
      updateProfile: (data) => set((s) => ({ user: { ...s.user, ...data } })),
    }),
    { name: 'healthgenie-auth' }
  )
);

// ━━━ HEALTH STORE ━━━
export const useHealthStore = create(
  persist(
    (set, get) => ({
      healthScore: 72,
      categories: {
        fitness: 65,
        diet: 70,
        sleep: 80,
        hydration: 60,
        vitals: 75,
      },
      dailyStats: {
        steps: 6240,
        water: 1500,
        calories: 1800,
        sleep: 7.2,
      },
      history: [],
      achievements: [
        { id: 'first_login', name: 'First Steps', icon: '🌟', unlocked: true, date: new Date().toISOString() },
        { id: 'water_streak_3', name: '3-Day Hydration', icon: '💧', unlocked: false },
        { id: 'exercise_streak_7', name: 'Week Warrior', icon: '💪', unlocked: false },
        { id: 'health_score_80', name: 'Health Champion', icon: '🏆', unlocked: false },
        { id: 'perfect_day', name: 'Perfect Day', icon: '✨', unlocked: false },
      ],
      
      updateHealthScore: (score) => set({ healthScore: Math.min(100, Math.max(0, score)) }),
      updateCategory: (cat, val) => set((s) => ({
        categories: { ...s.categories, [cat]: Math.min(100, Math.max(0, val)) }
      })),
      updateDailyStat: (stat, val) => set((s) => ({
        dailyStats: { ...s.dailyStats, [stat]: val }
      })),
      addHistoryEntry: (entry) => set((s) => ({
        history: [...s.history.slice(-89), { ...entry, date: new Date().toISOString() }]
      })),
      unlockAchievement: (id) => set((s) => ({
        achievements: s.achievements.map(a => 
          a.id === id ? { ...a, unlocked: true, date: new Date().toISOString() } : a
        )
      })),
    }),
    { name: 'healthgenie-health' }
  )
);

// ━━━ WATER STORE ━━━
export const useWaterStore = create(
  persist(
    (set, get) => ({
      dailyGoal: 3500,
      currentIntake: 0,
      intakeLog: [],
      history: [],
      streak: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      
      checkNewDay: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastUpdated } = get();
        
        // Populate dummy history if completely empty (for nice UI showcase)
        if (get().history.length === 0) {
          const dummyHistory = [];
          for (let i = 6; i > 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dummyHistory.push({
              date: d.toISOString().split('T')[0],
              intake: Math.floor(Math.random() * 1500) + 2000,
              goal: 3500,
              completed: true
            });
          }
          set({ history: dummyHistory });
        }

        if (lastUpdated && lastUpdated !== today) {
          get().resetDaily(lastUpdated);
          set({ lastUpdated: today });
        } else if (!lastUpdated) {
          set({ lastUpdated: today });
        }
      },

      addIntake: (ml) => {
        get().checkNewDay();
        const now = new Date();
        set((s) => ({
          currentIntake: s.currentIntake + ml,
          intakeLog: [...s.intakeLog, { id: Date.now() + Math.random(), amount: ml, time: now.toISOString() }],
        }));
      },
      subtractIntake: (ml) => {
        get().checkNewDay();
        set((s) => ({
          currentIntake: Math.max(0, s.currentIntake - ml)
        }));
      },
      undoLastIntake: () => {
        get().checkNewDay();
        set((s) => {
          if (s.intakeLog.length === 0) return s;
          const last = s.intakeLog[s.intakeLog.length - 1];
          return {
            currentIntake: Math.max(0, s.currentIntake - last.amount),
            intakeLog: s.intakeLog.slice(0, -1)
          };
        });
      },
      removeIntakeLogItem: (index) => {
        get().checkNewDay();
        set((s) => {
          if (index < 0 || index >= s.intakeLog.length) return s;
          const item = s.intakeLog[index];
          const newLog = s.intakeLog.filter((_, i) => i !== index);
          return {
            currentIntake: Math.max(0, s.currentIntake - item.amount),
            intakeLog: newLog
          };
        });
      },
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      clearTodayIntake: () => set({ currentIntake: 0, intakeLog: [] }),
      resetDaily: (dateToSave) => {
        const state = get();
        const completed = state.currentIntake >= state.dailyGoal;
        const saveDate = dateToSave || new Date().toISOString().split('T')[0];
        set((s) => ({
          currentIntake: 0,
          intakeLog: [],
          history: [...s.history.filter(h => h.date !== saveDate).slice(-29), {
            date: saveDate,
            intake: s.currentIntake,
            goal: s.dailyGoal,
            completed
          }],
          streak: completed ? s.streak + 1 : 0,
        }));
      },
    }),
    { name: 'healthgenie-water' }
  )
);

// ━━━ STEP STORE ━━━
export const useStepStore = create(
  persist(
    (set, get) => ({
      dailyGoal: 10000,
      currentSteps: 0,
      stepLog: [],
      history: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      
      checkNewDay: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastUpdated } = get();
        
        if (lastUpdated && lastUpdated !== today) {
          get().resetDaily(lastUpdated);
          set({ lastUpdated: today });
        } else if (!lastUpdated) {
          set({ lastUpdated: today });
        }
      },

      addSteps: (steps) => {
        get().checkNewDay();
        const now = new Date();
        set((s) => ({
          currentSteps: s.currentSteps + steps,
          stepLog: [...s.stepLog, { id: Date.now() + Math.random(), amount: steps, time: now.toISOString() }],
        }));
      },
      subtractSteps: (steps) => {
        get().checkNewDay();
        set((s) => ({
          currentSteps: Math.max(0, s.currentSteps - steps)
        }));
      },
      undoLastStep: () => {
        get().checkNewDay();
        set((s) => {
          if (s.stepLog.length === 0) return s;
          const last = s.stepLog[s.stepLog.length - 1];
          return {
            currentSteps: Math.max(0, s.currentSteps - last.amount),
            stepLog: s.stepLog.slice(0, -1)
          };
        });
      },
      removeStepLogItem: (index) => {
        get().checkNewDay();
        set((s) => {
          if (index < 0 || index >= s.stepLog.length) return s;
          const item = s.stepLog[index];
          const newLog = s.stepLog.filter((_, i) => i !== index);
          return {
            currentSteps: Math.max(0, s.currentSteps - item.amount),
            stepLog: newLog
          };
        });
      },
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      clearTodaySteps: () => set({ currentSteps: 0, stepLog: [] }),
      resetDaily: (dateToSave) => {
        const state = get();
        const completed = state.currentSteps >= state.dailyGoal;
        const saveDate = dateToSave || new Date().toISOString().split('T')[0];
        set((s) => ({
          currentSteps: 0,
          stepLog: [],
          history: [...s.history.filter(h => h.date !== saveDate).slice(-29), {
            date: saveDate,
            steps: s.currentSteps,
            goal: s.dailyGoal,
            completed
          }],
        }));
      },
    }),
    { name: 'healthgenie-steps' }
  )
);

// ━━━ DIET STORE ━━━
export const useDietStore = create(
  persist(
    (set) => ({
      weeklyPlan: null,
      calorieTarget: 2000,
      macros: { protein: 30, carbs: 45, fat: 25 },
      mealsLogged: [],
      
      setWeeklyPlan: (plan) => set({ weeklyPlan: plan }),
      setCalorieTarget: (cal) => set({ calorieTarget: cal }),
      setMacros: (macros) => set({ macros }),
      logMeal: (meal) => set((s) => ({
        mealsLogged: [...s.mealsLogged, { ...meal, timestamp: new Date().toISOString() }]
      })),
    }),
    { name: 'healthgenie-diet' }
  )
);

// ━━━ WOMEN'S HEALTH STORE ━━━
export const useWomenStore = create(
  persist(
    (set, get) => ({
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: null,
      periodLog: [],
      symptoms: [],
      
      setLastPeriod: (date) => set({ lastPeriodStart: date }),
      setCycleLength: (len) => set({ cycleLength: len }),
      setPeriodLength: (len) => set({ periodLength: len }),
      logPeriodDay: (entry) => set((s) => {
        const entryDate = entry.date || new Date().toISOString().split('T')[0];
        const filtered = s.periodLog.filter(x => x.date !== entryDate);
        return {
          periodLog: [...filtered, { ...entry, date: entryDate }]
        };
      }),
      logSymptom: (symptom) => set((s) => {
        const entryDate = symptom.date || new Date().toISOString().split('T')[0];
        const filtered = s.symptoms.filter(x => !(x.date === entryDate && x.name === symptom.name));
        return {
          symptoms: [...filtered, { ...symptom, date: entryDate }]
        };
      }),
      
      getNextPeriod: () => {
        const { lastPeriodStart, cycleLength } = get();
        if (!lastPeriodStart) return null;
        const next = new Date(lastPeriodStart);
        next.setDate(next.getDate() + cycleLength);
        return next;
      },
      
      getCycleDay: () => {
        const { lastPeriodStart } = get();
        if (!lastPeriodStart) return null;
        const diff = Math.floor((Date.now() - new Date(lastPeriodStart)) / 86400000);
        return diff + 1;
      },
    }),
    { name: 'healthgenie-women' }
  )
);

// ━━━ PREGNANCY STORE ━━━
export const usePregnancyStore = create(
  persist(
    (set, get) => ({
      isPregnant: false,
      dueDate: null,
      lastMenstrualPeriod: null,
      appointments: [],
      weeklyNotes: [],
      
      setPregnancy: (dueDate, lmp) => set({ 
        isPregnant: true, 
        dueDate, 
        lastMenstrualPeriod: lmp 
      }),
      
      getCurrentWeek: () => {
        const { lastMenstrualPeriod } = get();
        if (!lastMenstrualPeriod) return 0;
        const diff = Date.now() - new Date(lastMenstrualPeriod).getTime();
        return Math.floor(diff / (7 * 86400000));
      },
      
      getTrimester: () => {
        const week = get().getCurrentWeek();
        if (week <= 12) return 1;
        if (week <= 26) return 2;
        return 3;
      },
      
      addAppointment: (apt) => set((s) => ({
        appointments: [...s.appointments, { ...apt, id: Date.now() }]
      })),
      
      addWeeklyNote: (note) => set((s) => ({
        weeklyNotes: [...s.weeklyNotes, { ...note, date: new Date().toISOString() }]
      })),
    }),
    { name: 'healthgenie-pregnancy' }
  )
);

// ━━━ EMERGENCY STORE ━━━
export const useEmergencyStore = create(
  persist(
    (set) => ({
      contacts: [
        { id: 1, name: 'Emergency Services', phone: '108', type: 'emergency', isPrimary: true },
      ],
      sosActive: false,
      
      addContact: (contact) => set((s) => ({
        contacts: [...s.contacts, { ...contact, id: Date.now() }]
      })),
      removeContact: (id) => set((s) => ({
        contacts: s.contacts.filter(c => c.id !== id)
      })),
      updateContact: (id, data) => set((s) => ({
        contacts: s.contacts.map(c => c.id === id ? { ...c, ...data } : c)
      })),
      activateSOS: () => set({ sosActive: true }),
      deactivateSOS: () => set({ sosActive: false }),
    }),
    { name: 'healthgenie-emergency' }
  )
);

// ━━━ NOTIFICATION STORE ━━━
export const useNotificationStore = create(
  persist(
    (set) => ({
      preferences: {
        waterReminder: true,
        exerciseReminder: true,
        mealReminder: true,
        medicationReminder: false,
        periodReminder: true,
        appointmentReminder: true,
        dailySummary: true,
      },
      notifications: [],
      
      togglePreference: (key) => set((s) => ({
        preferences: { ...s.preferences, [key]: !s.preferences[key] }
      })),
      addNotification: (notification) => set((s) => ({
        notifications: [{ ...notification, id: Date.now(), read: false, time: new Date().toISOString() }, ...s.notifications.slice(0, 49)]
      })),
      markRead: (id) => set((s) => ({
        notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, read: true }))
      })),
      unreadCount: () => 0, // Computed in components
    }),
    { name: 'healthgenie-notifications' }
  )
);

// ━━━ CHAT STORE ━━━
export const useChatStore = create(
  persist(
    (set) => ({
      messages: [],
      isStreaming: false,
      isOpen: false,
      
      addMessage: (msg) => set((s) => ({
        messages: [...s.messages, { ...msg, id: Date.now(), timestamp: new Date().toISOString() }]
      })),
      updateLastBotMessage: (content) => set((s) => {
        const msgs = [...s.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === 'assistant') {
            msgs[i] = { ...msgs[i], content };
            break;
          }
        }
        return { messages: msgs };
      }),
      setStreaming: (val) => set({ isStreaming: val }),
      toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'healthgenie-chat' }
  )
);

// ━━━ SYMPTOM STORE ━━━
export const useSymptomStore = create(
  (set) => ({
    selectedBodyParts: [],
    selectedSymptoms: [],
    duration: '',
    severity: 5,
    frequency: 'occasional',
    additionalNotes: '',
    analysisResult: null,
    isAnalyzing: false,
    
    addBodyPart: (part) => set((s) => ({
      selectedBodyParts: s.selectedBodyParts.includes(part) 
        ? s.selectedBodyParts.filter(p => p !== part)
        : [...s.selectedBodyParts, part]
    })),
    addSymptom: (symptom) => set((s) => ({
      selectedSymptoms: s.selectedSymptoms.includes(symptom)
        ? s.selectedSymptoms.filter(sy => sy !== symptom)
        : [...s.selectedSymptoms, symptom]
    })),
    setDuration: (d) => set({ duration: d }),
    setSeverity: (s) => set({ severity: s }),
    setFrequency: (f) => set({ frequency: f }),
    setAdditionalNotes: (n) => set({ additionalNotes: n }),
    setAnalysisResult: (r) => set({ analysisResult: r }),
    setIsAnalyzing: (v) => set({ isAnalyzing: v }),
    reset: () => set({
      selectedBodyParts: [],
      selectedSymptoms: [],
      duration: '',
      severity: 5,
      frequency: 'occasional',
      additionalNotes: '',
      analysisResult: null,
      isAnalyzing: false,
    }),
  })
);

// ━━━ EXERCISE STORE ━━━
export const useExerciseStore = create(
  persist(
    (set) => ({
      workoutPlan: null,
      exerciseLog: [],
      favoriteExercises: [],
      
      setWorkoutPlan: (plan) => set({ workoutPlan: plan }),
      logExercise: (entry) => set((s) => ({
        exerciseLog: [...s.exerciseLog, { ...entry, date: new Date().toISOString() }]
      })),
      toggleFavorite: (exercise) => set((s) => ({
        favoriteExercises: s.favoriteExercises.includes(exercise)
          ? s.favoriteExercises.filter(e => e !== exercise)
          : [...s.favoriteExercises, exercise]
      })),
    }),
    { name: 'healthgenie-exercise' }
  )
);

// ━━━ STREAKS STORE ━━━
export const useStreakStore = create(
  persist(
    (set, get) => ({
      currentStreak: 3,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      activityMap: {},
      
      recordActivity: (type = 'general') => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, currentStreak } = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const newStreak = lastActiveDate === yesterday ? currentStreak + 1 :
                         lastActiveDate === today ? currentStreak : 1;
        
        set((s) => ({
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
          lastActiveDate: today,
          activityMap: {
            ...s.activityMap,
            [today]: (s.activityMap[today] || 0) + 1
          }
        }));
      },
    }),
    { name: 'healthgenie-streaks' }
  )
);
