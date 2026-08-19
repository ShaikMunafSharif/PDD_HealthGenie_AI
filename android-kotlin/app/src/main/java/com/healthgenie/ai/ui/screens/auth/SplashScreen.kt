package com.healthgenie.ai.ui.screens.auth

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.HealthOrb
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.AuthViewModel
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    navController: NavHostController,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var showContent by remember { mutableStateOf(false) }
    var showSubtitle by remember { mutableStateOf(false) }

    val orbAlpha by animateFloatAsState(
        targetValue = if (showContent) 1f else 0f,
        animationSpec = tween(1200, easing = EaseOutCubic),
        label = "orbAlpha"
    )

    val titleAlpha by animateFloatAsState(
        targetValue = if (showContent) 1f else 0f,
        animationSpec = tween(800, delayMillis = 400, easing = EaseOutCubic),
        label = "titleAlpha"
    )

    val subtitleAlpha by animateFloatAsState(
        targetValue = if (showSubtitle) 1f else 0f,
        animationSpec = tween(600, easing = EaseOutCubic),
        label = "subAlpha"
    )

    LaunchedEffect(Unit) {
        showContent = true
        delay(800)
        showSubtitle = true
        delay(2000)
        // Navigate based on auth state
        val destination = when {
            uiState.isAuthenticated && uiState.hasCompletedSetup -> Routes.DASHBOARD
            uiState.isAuthenticated && uiState.hasCompletedOnboarding -> Routes.SETUP_PROFILE
            uiState.isAuthenticated -> Routes.ONBOARDING_1
            else -> Routes.LOGIN
        }
        navController.navigate(destination) {
            popUpTo(Routes.SPLASH) { inclusive = true }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(BgVoid, BgDepth, BgVoid)
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Animated Health Orb
            Box(modifier = Modifier.alpha(orbAlpha)) {
                HealthOrb(score = 85, size = 160)
            }

            Spacer(Modifier.height(40.dp))

            // Title
            Text(
                text = "HealthGenie",
                style = MaterialTheme.typography.displayLarge.copy(
                    fontSize = 42.sp,
                    fontWeight = FontWeight.Bold,
                    brush = Brush.horizontalGradient(
                        colors = listOf(NeonPulse, NeonHealth)
                    )
                ),
                modifier = Modifier.alpha(titleAlpha)
            )

            Spacer(Modifier.height(8.dp))

            Text(
                text = "AI",
                style = MaterialTheme.typography.displayMedium.copy(
                    fontWeight = FontWeight.Light,
                    letterSpacing = 8.sp
                ),
                color = TextSecondary,
                modifier = Modifier.alpha(titleAlpha)
            )

            Spacer(Modifier.height(24.dp))

            // Subtitle
            Text(
                text = "Your Intelligent Health Companion",
                style = MaterialTheme.typography.bodyLarge,
                color = TextSecondary,
                modifier = Modifier.alpha(subtitleAlpha)
            )
        }
    }
}
