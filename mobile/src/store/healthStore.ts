import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ━━━ AUTH STORE ━━━
export const useAuthStore = create<any>(
  persist(
    (set: any, get: any) => ({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      hasCompletedSetup: false,
      
      login: (user: any) => set({ user, isAuthenticated: true, hasCompletedOnboarding: true, hasCompletedSetup: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
      setSetupComplete: () => set({ hasCompletedSetup: true }),
      updateProfile: (data: any) => set((s: any) => ({ user: { ...s.user, ...data } })),
    }),
    { 
      name: 'healthgenie-auth',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ HEALTH STORE ━━━
export const useHealthStore = create<any>(
  persist(
    (set: any, get: any) => ({
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
      
      updateHealthScore: (score: number) => set({ healthScore: Math.min(100, Math.max(0, score)) }),
      updateCategory: (cat: string, val: number) => set((s: any) => ({
        categories: { ...s.categories, [cat]: Math.min(100, Math.max(0, val)) }
      })),
      updateDailyStat: (stat: string, val: number) => set((s: any) => ({
        dailyStats: { ...s.dailyStats, [stat]: val }
      })),
      addHistoryEntry: (entry: any) => set((s: any) => ({
        history: [...s.history.slice(-89), { ...entry, date: new Date().toISOString() }]
      })),
      unlockAchievement: (id: string) => set((s: any) => ({
        achievements: s.achievements.map((a: any) => 
          a.id === id ? { ...a, unlocked: true, date: new Date().toISOString() } : a
        )
      })),
    }),
    { 
      name: 'healthgenie-health',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ WATER STORE ━━━
export const useWaterStore = create<any>(
  persist(
    (set: any, get: any) => ({
      dailyGoal: 3500,
      currentIntake: 0,
      intakeLog: [],
      history: [],
      streak: 0,
      
      addIntake: (ml: number) => {
        const now = new Date();
        set((s: any) => ({
          currentIntake: s.currentIntake + ml,
          intakeLog: [...s.intakeLog, { id: Date.now() + Math.random(), amount: ml, time: now.toISOString() }],
        }));
      },
      subtractIntake: (ml: number) => {
        set((s: any) => ({
          currentIntake: Math.max(0, s.currentIntake - ml)
        }));
      },
      undoLastIntake: () => {
        set((s: any) => {
          if (s.intakeLog.length === 0) return s;
          const last = s.intakeLog[s.intakeLog.length - 1];
          return {
            currentIntake: Math.max(0, s.currentIntake - last.amount),
            intakeLog: s.intakeLog.slice(0, -1)
          };
        });
      },
      removeIntakeLogItem: (index: number) => {
        set((s: any) => {
          if (index < 0 || index >= s.intakeLog.length) return s;
          const item = s.intakeLog[index];
          const newLog = s.intakeLog.filter((_: any, i: number) => i !== index);
          return {
            currentIntake: Math.max(0, s.currentIntake - item.amount),
            intakeLog: newLog
          };
        });
      },
      setDailyGoal: (goal: number) => set({ dailyGoal: goal }),
      clearTodayIntake: () => set({ currentIntake: 0, intakeLog: [] }),
      resetDaily: () => {
        const state: any = get();
        const completed = state.currentIntake >= state.dailyGoal;
        set((s: any) => ({
          currentIntake: 0,
          intakeLog: [],
          history: [...s.history.slice(-29), {
            date: new Date().toISOString().split('T')[0],
            intake: s.currentIntake,
            goal: s.dailyGoal,
            completed
          }],
          streak: completed ? s.streak + 1 : 0,
        }));
      },
    }),
    { 
      name: 'healthgenie-water',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ DIET STORE ━━━
export const useDietStore = create<any>(
  persist(
    (set: any) => ({
      weeklyPlan: null,
      calorieTarget: 2000,
      macros: { protein: 30, carbs: 45, fat: 25 },
      mealsLogged: [],
      
      setWeeklyPlan: (plan: any) => set({ weeklyPlan: plan }),
      setCalorieTarget: (cal: number) => set({ calorieTarget: cal }),
      setMacros: (macros: any) => set({ macros }),
      logMeal: (meal: any) => set((s: any) => ({
        mealsLogged: [...s.mealsLogged, { ...meal, timestamp: new Date().toISOString() }]
      })),
    }),
    { 
      name: 'healthgenie-diet',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ WOMEN'S HEALTH STORE ━━━
export const useWomenStore = create<any>(
  persist(
    (set: any, get: any) => ({
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: null,
      periodLog: [],
      symptoms: [],
      
      setLastPeriod: (date: string) => set({ lastPeriodStart: date }),
      setCycleLength: (len: number) => set({ cycleLength: len }),
      setPeriodLength: (len: number) => set({ periodLength: len }),
      logPeriodDay: (entry: any) => set((s: any) => {
        const entryDate = entry.date || new Date().toISOString().split('T')[0];
        const filtered = s.periodLog.filter((x: any) => x.date !== entryDate);
        return {
          periodLog: [...filtered, { ...entry, date: entryDate }]
        };
      }),
      logSymptom: (symptom: any) => set((s: any) => {
        const entryDate = symptom.date || new Date().toISOString().split('T')[0];
        const filtered = s.symptoms.filter((x: any) => !(x.date === entryDate && x.name === symptom.name));
        return {
          symptoms: [...filtered, { ...symptom, date: entryDate }]
        };
      }),
      
      getNextPeriod: () => {
        const { lastPeriodStart, cycleLength }: any = get();
        if (!lastPeriodStart) return null;
        const next = new Date(lastPeriodStart);
        next.setDate(next.getDate() + cycleLength);
        return next;
      },
      
      getCycleDay: () => {
        const { lastPeriodStart }: any = get();
        if (!lastPeriodStart) return null;
        const diff = Math.floor((Date.now() - new Date(lastPeriodStart).getTime()) / 86400000);
        return diff + 1;
      },
    }),
    { 
      name: 'healthgenie-women',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ PREGNANCY STORE ━━━
export const usePregnancyStore = create<any>(
  persist(
    (set: any, get: any) => ({
      isPregnant: false,
      dueDate: null,
      lastMenstrualPeriod: null,
      appointments: [],
      weeklyNotes: [],
      
      setPregnancy: (dueDate: string, lmp: string) => set({ 
        isPregnant: true, 
        dueDate, 
        lastMenstrualPeriod: lmp 
      }),
      
      getCurrentWeek: () => {
        const { lastMenstrualPeriod }: any = get();
        if (!lastMenstrualPeriod) return 0;
        const diff = Date.now() - new Date(lastMenstrualPeriod).getTime();
        return Math.floor(diff / (7 * 86400000));
      },
      
      getTrimester: () => {
        const { getCurrentWeek }: any = get();
        const week = getCurrentWeek();
        if (week <= 12) return 1;
        if (week <= 26) return 2;
        return 3;
      },
      
      addAppointment: (apt: any) => set((s: any) => ({
        appointments: [...s.appointments, { ...apt, id: Date.now() }]
      })),
      
      addWeeklyNote: (note: any) => set((s: any) => ({
        weeklyNotes: [...s.weeklyNotes, { ...note, date: new Date().toISOString() }]
      })),
    }),
    { 
      name: 'healthgenie-pregnancy',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ EMERGENCY STORE ━━━
export const useEmergencyStore = create<any>(
  persist(
    (set: any) => ({
      contacts: [
        { id: 1, name: 'Emergency Services', phone: '108', type: 'emergency', isPrimary: true },
      ],
      sosActive: false,
      
      addContact: (contact: any) => set((s: any) => ({
        contacts: [...s.contacts, { ...contact, id: Date.now() }]
      })),
      removeContact: (id: number) => set((s: any) => ({
        contacts: s.contacts.filter((c: any) => c.id !== id)
      })),
      updateContact: (id: number, data: any) => set((s: any) => ({
        contacts: s.contacts.map((c: any) => c.id === id ? { ...c, ...data } : c)
      })),
      activateSOS: () => set({ sosActive: true }),
      deactivateSOS: () => set({ sosActive: false }),
    }),
    { 
      name: 'healthgenie-emergency',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ NOTIFICATION STORE ━━━
export const useNotificationStore = create<any>(
  persist(
    (set: any) => ({
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
      
      togglePreference: (key: string) => set((s: any) => ({
        preferences: { ...s.preferences, [key]: !s.preferences[key] }
      })),
      addNotification: (notification: any) => set((s: any) => ({
        notifications: [{ ...notification, id: Date.now(), read: false, time: new Date().toISOString() }, ...s.notifications.slice(0, 49)]
      })),
      markRead: (id: number) => set((s: any) => ({
        notifications: s.notifications.map((n: any) => n.id === id ? { ...n, read: true } : n)
      })),
      markAllRead: () => set((s: any) => ({
        notifications: s.notifications.map((n: any) => ({ ...n, read: true }))
      })),
      unreadCount: () => 0,
    }),
    { 
      name: 'healthgenie-notifications',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ CHAT STORE ━━━
export const useChatStore = create<any>(
  persist(
    (set: any) => ({
      messages: [],
      isStreaming: false,
      isOpen: false,
      
      addMessage: (msg: any) => set((s: any) => ({
        messages: [...s.messages, { ...msg, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: new Date().toISOString() }]
      })),
      updateLastBotMessage: (content: string) => set((s: any) => {
        const msgs = [...s.messages];
        for (let i = msgs.length - 1; i >= 0; i--) {
          if (msgs[i].role === 'assistant') {
            msgs[i] = { ...msgs[i], content };
            break;
          }
        }
        return { messages: msgs };
      }),
      setStreaming: (val: boolean) => set({ isStreaming: val }),
      toggleChat: () => set((s: any) => ({ isOpen: !s.isOpen })),
      openChat: () => set({ isOpen: true }),
      closeChat: () => set({ isOpen: false }),
      clearHistory: () => set({ messages: [] }),
    }),
    { 
      name: 'healthgenie-chat',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ SYMPTOM STORE ━━━ (Not persisted originally)
export const useSymptomStore = create<any>(
  (set: any) => ({
    selectedBodyParts: [],
    selectedSymptoms: [],
    duration: '',
    severity: 5,
    frequency: 'occasional',
    additionalNotes: '',
    analysisResult: null,
    isAnalyzing: false,
    
    addBodyPart: (part: string) => set((s: any) => ({
      selectedBodyParts: s.selectedBodyParts.includes(part) 
        ? s.selectedBodyParts.filter((p: string) => p !== part)
        : [...s.selectedBodyParts, part]
    })),
    addSymptom: (symptom: string) => set((s: any) => ({
      selectedSymptoms: s.selectedSymptoms.includes(symptom)
        ? s.selectedSymptoms.filter((sy: string) => sy !== symptom)
        : [...s.selectedSymptoms, symptom]
    })),
    setDuration: (d: string) => set({ duration: d }),
    setSeverity: (s: number) => set({ severity: s }),
    setFrequency: (f: string) => set({ frequency: f }),
    setAdditionalNotes: (n: string) => set({ additionalNotes: n }),
    setAnalysisResult: (r: any) => set({ analysisResult: r }),
    setIsAnalyzing: (v: boolean) => set({ isAnalyzing: v }),
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
export const useExerciseStore = create<any>(
  persist(
    (set: any) => ({
      workoutPlan: null,
      exerciseLog: [],
      favoriteExercises: [],
      
      setWorkoutPlan: (plan: any) => set({ workoutPlan: plan }),
      logExercise: (entry: any) => set((s: any) => ({
        exerciseLog: [...s.exerciseLog, { ...entry, date: new Date().toISOString() }]
      })),
      toggleFavorite: (exercise: any) => set((s: any) => ({
        favoriteExercises: s.favoriteExercises.includes(exercise)
          ? s.favoriteExercises.filter((e: any) => e !== exercise)
          : [...s.favoriteExercises, exercise]
      })),
    }),
    { 
      name: 'healthgenie-exercise',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);

// ━━━ STREAKS STORE ━━━
export const useStreakStore = create<any>(
  persist(
    (set: any, get: any) => ({
      currentStreak: 3,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      activityMap: {},
      
      recordActivity: (type = 'general') => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, currentStreak }: any = get();
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        const newStreak = lastActiveDate === yesterday ? currentStreak + 1 :
                         lastActiveDate === today ? currentStreak : 1;
        
        set((s: any) => ({
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
    { 
      name: 'healthgenie-streaks',
      storage: createJSONStorage(() => AsyncStorage)
    }
  ) as any
);
