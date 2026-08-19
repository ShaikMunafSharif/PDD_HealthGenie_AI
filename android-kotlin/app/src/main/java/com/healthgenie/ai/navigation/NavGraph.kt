package com.healthgenie.ai.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.healthgenie.ai.ui.screens.auth.*
import com.healthgenie.ai.ui.screens.dashboard.DashboardScreen
import com.healthgenie.ai.ui.screens.health.*
import com.healthgenie.ai.ui.screens.water.WaterTrackerScreen
import com.healthgenie.ai.ui.screens.diet.*
import com.healthgenie.ai.ui.screens.exercise.*
import com.healthgenie.ai.ui.screens.firstaid.FirstAidScreen
import com.healthgenie.ai.ui.screens.doctor.*
import com.healthgenie.ai.ui.screens.emergency.*
import com.healthgenie.ai.ui.screens.women.*
import com.healthgenie.ai.ui.screens.pregnancy.*
import com.healthgenie.ai.ui.screens.analytics.*
import com.healthgenie.ai.ui.screens.settings.*

private val enterTransition: EnterTransition = fadeIn(tween(300)) + slideInHorizontally(tween(300)) { it / 4 }
private val exitTransition: ExitTransition = fadeOut(tween(200)) + slideOutHorizontally(tween(200)) { -it / 4 }
private val popEnterTransition: EnterTransition = fadeIn(tween(300)) + slideInHorizontally(tween(300)) { -it / 4 }
private val popExitTransition: ExitTransition = fadeOut(tween(200)) + slideOutHorizontally(tween(200)) { it / 4 }

@Composable
fun HealthGenieNavGraph(
    navController: NavHostController,
    startDestination: String = Routes.SPLASH
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
        enterTransition = { enterTransition },
        exitTransition = { exitTransition },
        popEnterTransition = { popEnterTransition },
        popExitTransition = { popExitTransition }
    ) {
        // ━━━ AUTH ━━━
        composable(Routes.SPLASH) { SplashScreen(navController) }
        composable(Routes.LOGIN) { LoginScreen(navController) }
        composable(Routes.SIGNUP) { SignupScreen(navController) }
        composable(Routes.FORGOT_PASSWORD) { ForgotPasswordScreen(navController) }
        composable(Routes.ONBOARDING_1) { OnboardingScreen(navController, page = 1) }
        composable(Routes.ONBOARDING_2) { OnboardingScreen(navController, page = 2) }
        composable(Routes.ONBOARDING_3) { OnboardingScreen(navController, page = 3) }
        composable(Routes.SETUP_PROFILE) { SetupProfileScreen(navController) }
        composable(Routes.SETUP_MEDICAL) { SetupMedicalScreen(navController) }
        composable(Routes.SETUP_ALLERGIES) { SetupAllergiesScreen(navController) }

        // ━━━ CORE ━━━
        composable(Routes.DASHBOARD) { DashboardScreen(navController) }
        composable(Routes.HEALTH_SCORE) { HealthScoreScreen(navController) }
        composable(Routes.SYMPTOM_SELECT) { SymptomSelectScreen(navController) }
        composable(Routes.SYMPTOM_DETAILS) { SymptomDetailsScreen(navController) }
        composable(Routes.SYMPTOM_PROCESSING) { SymptomProcessingScreen(navController) }
        composable(Routes.SYMPTOM_RESULTS) { SymptomResultsScreen(navController) }
        composable(Routes.WATER) { WaterTrackerScreen(navController) }
        composable(Routes.DIET_PLAN) { DietPlanScreen(navController) }
        composable(Routes.MEAL_DETAILS) { MealDetailsScreen(navController) }
        composable(Routes.EXERCISE_RECS) { ExerciseRecommendationsScreen(navController) }
        composable(Routes.EXERCISE_DETAILS) { ExerciseDetailsScreen(navController) }
        composable(Routes.PAIN_RELIEF) { PainReliefScreen(navController) }
        composable(Routes.FIRST_AID) { FirstAidScreen(navController) }
        composable(Routes.DOCTOR_REC) { DoctorRecommendationScreen(navController) }
        composable(Routes.DOCTOR_SPECIALIST) { DoctorSpecialistScreen(navController) }

        // ━━━ EMERGENCY ━━━
        composable(Routes.EMERGENCY) { EmergencyHubScreen(navController) }
        composable(Routes.EMERGENCY_DASHBOARD) { EmergencyDashboardScreen(navController) }
        composable(Routes.EMERGENCY_HOSPITALS) { EmergencyHospitalsScreen(navController) }
        composable(Routes.EMERGENCY_CONTACTS) { EmergencyContactsScreen(navController) }
        composable(Routes.EMERGENCY_ADD_CONTACT) { EmergencyAddContactScreen(navController) }
        composable(Routes.EMERGENCY_SOS) { EmergencySOSScreen(navController) }

        // ━━━ WOMEN ━━━
        composable(Routes.WOMEN_DASHBOARD) { WomenDashboardScreen(navController) }
        composable(Routes.PERIOD_TRACKER) { PeriodTrackerScreen(navController) }
        composable(Routes.PERIOD_INSIGHTS) { PeriodInsightsScreen(navController) }
        composable(Routes.PCOS_CARE) { PCOSCareScreen(navController) }
        composable(Routes.SKIN_CARE) { SkinCareScreen(navController) }
        composable(Routes.WOMEN_DIET) { WomenDietScreen(navController) }

        // ━━━ PREGNANCY ━━━
        composable(Routes.PREGNANCY_DASHBOARD) { PregnancyDashboardScreen(navController) }
        composable(Routes.PREGNANCY_TRIMESTER) { PregnancyTrimesterScreen(navController) }
        composable(Routes.PREGNANCY_WEEKLY_TIPS) { PregnancyWeeklyTipsScreen(navController) }
        composable(Routes.PREGNANCY_DIET) { PregnancyDietScreen(navController) }
        composable(Routes.PREGNANCY_DOCTOR_VISITS) { PregnancyDoctorVisitsScreen(navController) }
        composable(Routes.PREGNANCY_EXERCISE) { PregnancyExerciseScreen(navController) }

        // ━━━ ANALYTICS ━━━
        composable(Routes.ANALYTICS_PROGRESS) { AnalyticsProgressScreen(navController) }
        composable(Routes.ANALYTICS_STREAKS) { AnalyticsStreaksScreen(navController) }
        composable(Routes.ANALYTICS_REPORT) { AnalyticsReportScreen(navController) }

        // ━━━ SETTINGS ━━━
        composable(Routes.NOTIFICATIONS) { NotificationSettingsScreen(navController) }
        composable(Routes.SETTINGS_PROFILE) { SettingsProfileScreen(navController) }
        composable(Routes.SETTINGS_ABOUT) { SettingsAboutScreen(navController) }
    }
}
