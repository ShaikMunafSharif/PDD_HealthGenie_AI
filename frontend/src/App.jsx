import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar, TopBar } from './components/layout/Navigation';
import { FloatingChat } from './components/chat/FloatingChat';
import { useAuthStore } from './store/healthStore';
import { NeuralProcessing } from './components/ui/Components';

// ━━━ LAZY LOADED PAGES ━━━
const Splash = lazy(() => import('./pages/auth/Splash'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Onboarding1 = lazy(() => import('./pages/auth/Onboarding1'));
const Onboarding2 = lazy(() => import('./pages/auth/Onboarding2'));
const Onboarding3 = lazy(() => import('./pages/auth/Onboarding3'));
const SetupProfile = lazy(() => import('./pages/auth/SetupProfile'));
const SetupMedicalHistory = lazy(() => import('./pages/auth/SetupMedicalHistory'));
const SetupAllergies = lazy(() => import('./pages/auth/SetupAllergies'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const HealthScore = lazy(() => import('./pages/health/HealthScore'));
const SymptomSelect = lazy(() => import('./pages/health/SymptomSelect'));
const SymptomDetails = lazy(() => import('./pages/health/SymptomDetails'));
const SymptomProcessing = lazy(() => import('./pages/health/SymptomProcessing'));
const SymptomResults = lazy(() => import('./pages/health/SymptomResults'));
const WaterTracker = lazy(() => import('./pages/water/WaterTracker'));
const DietPlan = lazy(() => import('./pages/diet/DietPlan'));
const MealDetails = lazy(() => import('./pages/diet/MealDetails'));
const ExerciseRecommendations = lazy(() => import('./pages/exercise/ExerciseRecommendations'));
const ExerciseDetails = lazy(() => import('./pages/exercise/ExerciseDetails'));

const PainRelief = lazy(() => import('./pages/exercise/PainRelief'));
const FirstAid = lazy(() => import('./pages/firstaid/FirstAid'));
const DoctorRecommendation = lazy(() => import('./pages/doctor/DoctorRecommendation'));
const DoctorSpecialist = lazy(() => import('./pages/doctor/DoctorSpecialist'));
const EmergencyHub = lazy(() => import('./pages/emergency/EmergencyHub'));
const EmergencyDashboard = lazy(() => import('./pages/emergency/EmergencyDashboard'));
const EmergencyHospitals = lazy(() => import('./pages/emergency/EmergencyHospitals'));
const EmergencyContacts = lazy(() => import('./pages/emergency/EmergencyContacts'));
const EmergencyAddContact = lazy(() => import('./pages/emergency/EmergencyAddContact'));
const EmergencySOS = lazy(() => import('./pages/emergency/EmergencySOS'));
const WomenDashboard = lazy(() => import('./pages/women/WomenDashboard'));
const PeriodTracker = lazy(() => import('./pages/women/PeriodTracker'));
const PeriodInsights = lazy(() => import('./pages/women/PeriodInsights'));
const PCOSCare = lazy(() => import('./pages/women/PCOSCare'));
const SkinCare = lazy(() => import('./pages/women/SkinCare'));
const WomenDiet = lazy(() => import('./pages/women/WomenDiet'));
const PregnancyDashboard = lazy(() => import('./pages/pregnancy/PregnancyDashboard'));
const PregnancyTrimester = lazy(() => import('./pages/pregnancy/PregnancyTrimester'));
const PregnancyWeeklyTips = lazy(() => import('./pages/pregnancy/PregnancyWeeklyTips'));
const PregnancyDiet = lazy(() => import('./pages/pregnancy/PregnancyDiet'));
const PregnancyDoctorVisits = lazy(() => import('./pages/pregnancy/PregnancyDoctorVisits'));
const PregnancyExercise = lazy(() => import('./pages/pregnancy/PregnancyExercise'));
const AnalyticsProgress = lazy(() => import('./pages/analytics/AnalyticsProgress'));
const AnalyticsStreaks = lazy(() => import('./pages/analytics/AnalyticsStreaks'));
const AnalyticsReport = lazy(() => import('./pages/analytics/AnalyticsReport'));
const NotificationSettings = lazy(() => import('./pages/settings/NotificationSettings'));
const SettingsProfile = lazy(() => import('./pages/settings/SettingsProfile'));
const SettingsAbout = lazy(() => import('./pages/settings/SettingsAbout'));

// ━━━ LOADING FALLBACK ━━━
function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-void)',
    }}>
      <NeuralProcessing text="Loading..." />
    </div>
  );
}

// ━━━ PROTECTED LAYOUT ━━━
function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-void)' }}>
      <Sidebar />
      <TopBar />
      <main style={{
        flex: 1,
        marginLeft: 72,
        marginTop: 64,
        paddingBottom: 24,
        minHeight: 'calc(100vh - 64px)',
        overflowX: 'hidden',
      }}
        className="main-content"
      >
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-score" element={<HealthScore />} />
              <Route path="/symptoms/select" element={<SymptomSelect />} />
              <Route path="/symptoms/details" element={<SymptomDetails />} />
              <Route path="/symptoms/processing" element={<SymptomProcessing />} />
              <Route path="/symptoms/results" element={<SymptomResults />} />
              <Route path="/water" element={<WaterTracker />} />
              <Route path="/diet/plan" element={<DietPlan />} />
              <Route path="/diet/meal-details" element={<MealDetails />} />
              <Route path="/exercise/recommendations" element={<ExerciseRecommendations />} />
              <Route path="/exercise/details" element={<ExerciseDetails />} />

              <Route path="/exercise/pain-relief" element={<PainRelief />} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route path="/doctor/recommendation" element={<DoctorRecommendation />} />
              <Route path="/doctor/specialist" element={<DoctorSpecialist />} />
              <Route path="/emergency" element={<EmergencyHub />} />
              <Route path="/emergency/dashboard" element={<EmergencyDashboard />} />
              <Route path="/emergency/hospitals" element={<EmergencyHospitals />} />
              <Route path="/emergency/contacts" element={<EmergencyContacts />} />
              <Route path="/emergency/add-contact" element={<EmergencyAddContact />} />
              <Route path="/emergency/sos-confirm" element={<EmergencySOS />} />
              <Route path="/women/dashboard" element={<WomenDashboard />} />
              <Route path="/women/period-tracker" element={<PeriodTracker />} />
              <Route path="/women/period-insights" element={<PeriodInsights />} />
              <Route path="/women/pcos-care" element={<PCOSCare />} />
              <Route path="/women/skin-care" element={<SkinCare />} />
              <Route path="/women/diet" element={<WomenDiet />} />
              <Route path="/pregnancy/dashboard" element={<PregnancyDashboard />} />
              <Route path="/pregnancy/trimester" element={<PregnancyTrimester />} />
              <Route path="/pregnancy/weekly-tips" element={<PregnancyWeeklyTips />} />
              <Route path="/pregnancy/diet" element={<PregnancyDiet />} />
              <Route path="/pregnancy/doctor-visits" element={<PregnancyDoctorVisits />} />
              <Route path="/pregnancy/exercise" element={<PregnancyExercise />} />
              <Route path="/analytics/progress" element={<AnalyticsProgress />} />
              <Route path="/analytics/streaks" element={<AnalyticsStreaks />} />
              <Route path="/analytics/health-report" element={<AnalyticsReport />} />
              <Route path="/notifications" element={<NotificationSettings />} />
              <Route path="/settings/profile" element={<SettingsProfile />} />
              <Route path="/settings/about" element={<SettingsAbout />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <FloatingChat />
    </div>
  );
}

// ━━━ AUTH LAYOUT ━━━
function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding/1" element={<Onboarding1 />} />
          <Route path="/onboarding/2" element={<Onboarding2 />} />
          <Route path="/onboarding/3" element={<Onboarding3 />} />
          <Route path="/setup/profile" element={<SetupProfile />} />
          <Route path="/setup/medical-history" element={<SetupMedicalHistory />} />
          <Route path="/setup/allergies" element={<SetupAllergies />} />
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// ━━━ APP ROOT ━━━
function AppRoutes() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const authPaths = ['/splash', '/login', '/signup', '/verify-otp', '/forgot-password', '/onboarding', '/setup'];
  const isAuthRoute = authPaths.some(p => location.pathname.startsWith(p));

  // Check if essential profile details are filled
  const isProfileComplete = user && user.age && user.gender && user.height && user.weight;

  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/splash" replace />;
  }

  // Force users with incomplete profiles to the edit profile page
  if (isAuthenticated && !isProfileComplete && !isAuthRoute && location.pathname !== '/settings/profile') {
    return <Navigate to="/settings/profile" replace />;
  }

  if (isAuthenticated && isAuthRoute && !location.pathname.startsWith('/setup') && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return isAuthenticated && !isAuthRoute ? <AppLayout /> : <AuthLayout />;
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
