package com.healthgenie.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.healthgenie.ai.navigation.HealthGenieNavGraph
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.BottomNavBar
import com.healthgenie.ai.ui.theme.BgVoid
import com.healthgenie.ai.ui.theme.HealthGenieTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            HealthGenieTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: ""

                // Hide bottom nav on auth screens
                val showBottomNav = currentRoute !in listOf(
                    Routes.SPLASH, Routes.LOGIN, Routes.SIGNUP, Routes.FORGOT_PASSWORD,
                    Routes.ONBOARDING_1, Routes.ONBOARDING_2, Routes.ONBOARDING_3,
                    Routes.SETUP_PROFILE, Routes.SETUP_MEDICAL, Routes.SETUP_ALLERGIES,
                    Routes.EMERGENCY_SOS
                )

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(BgVoid)
                ) {
                    Column(modifier = Modifier.fillMaxSize()) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth()
                        ) {
                            HealthGenieNavGraph(
                                navController = navController,
                                startDestination = Routes.SPLASH
                            )
                        }

                        if (showBottomNav) {
                            BottomNavBar(
                                currentRoute = currentRoute,
                                onNavigate = { route ->
                                    navController.navigate(route) {
                                        popUpTo(Routes.DASHBOARD) { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
