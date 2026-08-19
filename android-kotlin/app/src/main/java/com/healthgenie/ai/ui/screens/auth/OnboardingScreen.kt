package com.healthgenie.ai.ui.screens.auth

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.AuthViewModel
import kotlinx.coroutines.launch

data class OnboardingPage(
    val icon: ImageVector,
    val title: String,
    val subtitle: String,
    val color: androidx.compose.ui.graphics.Color,
    val features: List<String>
)

private val pages = listOf(
    OnboardingPage(
        icon = Icons.Default.MonitorHeart,
        title = "AI Health Analysis",
        subtitle = "Get instant health insights powered by advanced AI",
        color = NeonPulse,
        features = listOf(
            "🧬  Smart symptom analysis",
            "📊  Personalized health scores",
            "💡  AI-powered recommendations"
        )
    ),
    OnboardingPage(
        icon = Icons.Default.WaterDrop,
        title = "Track Everything",
        subtitle = "Monitor your water, diet, exercise, and wellness",
        color = NeonHealth,
        features = listOf(
            "💧  Water intake tracking",
            "🥗  Smart diet plans",
            "🏃  Exercise recommendations"
        )
    ),
    OnboardingPage(
        icon = Icons.Default.Emergency,
        title = "Emergency Ready",
        subtitle = "Instant SOS, hospital locator, and first aid",
        color = NeonWarn,
        features = listOf(
            "🆘  One-tap SOS alerts",
            "🏥  Nearby hospital finder",
            "🩹  AI first aid guidance"
        )
    )
)

@Composable
fun OnboardingScreen(
    navController: NavHostController,
    page: Int = 1,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val pagerState = rememberPagerState(initialPage = page - 1, pageCount = { 3 })
    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Skip button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = {
                    viewModel.completeOnboarding()
                    navController.navigate(Routes.SETUP_PROFILE) {
                        popUpTo(Routes.ONBOARDING_1) { inclusive = true }
                    }
                }) {
                    Text("Skip", color = TextSecondary)
                }
            }

            // Pager
            HorizontalPager(
                state = pagerState,
                modifier = Modifier.weight(1f)
            ) { pageIndex ->
                val pageData = pages[pageIndex]

                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // Icon circle
                    Box(
                        modifier = Modifier
                            .size(120.dp)
                            .clip(CircleShape)
                            .background(pageData.color.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = pageData.icon,
                            contentDescription = null,
                            tint = pageData.color,
                            modifier = Modifier.size(56.dp)
                        )
                    }

                    Spacer(Modifier.height(40.dp))

                    Text(
                        text = pageData.title,
                        style = MaterialTheme.typography.displayMedium,
                        color = TextPrimary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(Modifier.height(12.dp))

                    Text(
                        text = pageData.subtitle,
                        style = MaterialTheme.typography.bodyLarge,
                        color = TextSecondary,
                        textAlign = TextAlign.Center
                    )

                    Spacer(Modifier.height(40.dp))

                    // Feature list
                    GlassCard(modifier = Modifier.fillMaxWidth()) {
                        pageData.features.forEach { feature ->
                            Text(
                                text = feature,
                                style = MaterialTheme.typography.bodyLarge,
                                color = TextPrimary,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        }
                    }
                }
            }

            // Page indicators
            Row(
                modifier = Modifier.padding(bottom = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                repeat(3) { idx ->
                    val isActive = pagerState.currentPage == idx
                    Box(
                        modifier = Modifier
                            .height(8.dp)
                            .width(if (isActive) 32.dp else 8.dp)
                            .clip(CircleShape)
                            .background(
                                if (isActive) pages[idx].color
                                else GlassBorder
                            )
                    )
                }
            }

            // Button
            Box(modifier = Modifier.padding(horizontal = 32.dp, vertical = 24.dp)) {
                if (pagerState.currentPage < 2) {
                    NeonButton(
                        text = "Next",
                        onClick = {
                            scope.launch {
                                pagerState.animateScrollToPage(pagerState.currentPage + 1)
                            }
                        },
                        variant = ButtonVariant.PRIMARY,
                        fullWidth = true
                    )
                } else {
                    NeonButton(
                        text = "Get Started",
                        onClick = {
                            viewModel.completeOnboarding()
                            navController.navigate(Routes.SETUP_PROFILE) {
                                popUpTo(Routes.ONBOARDING_1) { inclusive = true }
                            }
                        },
                        variant = ButtonVariant.PRIMARY,
                        fullWidth = true
                    )
                }
            }
        }
    }
}
