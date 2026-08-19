package com.healthgenie.ai.ui.screens.dashboard

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.DashboardViewModel

data class ModuleCard(
    val title: String,
    val icon: ImageVector,
    val color: Color,
    val route: String,
    val description: String
)

private val modules = listOf(
    ModuleCard("Health Score", Icons.Default.MonitorHeart, NeonPulse, Routes.HEALTH_SCORE, "AI Analysis"),
    ModuleCard("Symptoms", Icons.Default.LocalHospital, NeonWarn, Routes.SYMPTOM_SELECT, "Check Symptoms"),
    ModuleCard("Water", Icons.Default.WaterDrop, NeonPulse, Routes.WATER, "Track Intake"),
    ModuleCard("Diet Plan", Icons.Default.Restaurant, NeonHealth, Routes.DIET_PLAN, "Smart Meals"),
    ModuleCard("Exercise", Icons.Default.FitnessCenter, NeonHealth, Routes.EXERCISE_RECS, "Stay Active"),
    ModuleCard("First Aid", Icons.Default.MedicalServices, NeonWarn, Routes.FIRST_AID, "Quick Help"),
    ModuleCard("Emergency", Icons.Default.Emergency, NeonDanger, Routes.EMERGENCY, "SOS & Hospitals"),
    ModuleCard("Women", Icons.Default.Favorite, NeonFem, Routes.WOMEN_DASHBOARD, "Women's Health"),
    ModuleCard("Pregnancy", Icons.Default.ChildCare, NeonPreg, Routes.PREGNANCY_DASHBOARD, "Pregnancy Care"),
    ModuleCard("Analytics", Icons.Default.Analytics, NeonPulse, Routes.ANALYTICS_PROGRESS, "Your Progress"),
    ModuleCard("Doctor", Icons.Default.PersonSearch, NeonHealth, Routes.DOCTOR_REC, "Find Specialist"),
    ModuleCard("Settings", Icons.Default.Settings, TextSecondary, Routes.SETTINGS_PROFILE, "Preferences"),
)

@Composable
fun DashboardScreen(
    navController: NavHostController,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        Spacer(Modifier.height(20.dp))

        // ━━━ GREETING ━━━
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = uiState.greeting,
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
                Text(
                    text = uiState.userName,
                    style = MaterialTheme.typography.displayMedium,
                    color = TextPrimary
                )
            }
            if (uiState.streakDays > 0) {
                StreakBadge(count = uiState.streakDays)
            }
        }

        Spacer(Modifier.height(28.dp))

        // ━━━ HEALTH ORB HERO ━━━
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            onClick = { navController.navigate(Routes.HEALTH_SCORE) }
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "HEALTH SCORE",
                        style = MaterialTheme.typography.labelSmall,
                        color = NeonPulse
                    )
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.Bottom) {
                        AnimatedCounter(
                            value = uiState.healthScore,
                            color = when {
                                uiState.healthScore >= 80 -> NeonHealth
                                uiState.healthScore >= 50 -> NeonPulse
                                else -> NeonWarn
                            }
                        )
                        Text(
                            text = "/100",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary,
                            modifier = Modifier.padding(bottom = 4.dp, start = 4.dp)
                        )
                    }
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = when {
                            uiState.healthScore >= 80 -> "Excellent health!"
                            uiState.healthScore >= 60 -> "Good, keep improving"
                            else -> "Needs attention"
                        },
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }
                HealthOrb(score = uiState.healthScore, size = 120)
            }
        }

        Spacer(Modifier.height(20.dp))

        // ━━━ QUICK STATS GRID ━━━
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                label = "Steps",
                value = "${uiState.steps}",
                icon = Icons.Default.DirectionsWalk,
                color = NeonHealth,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                label = "Calories",
                value = "${uiState.calories}",
                icon = Icons.Default.LocalFireDepartment,
                color = NeonWarn,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                label = "Sleep",
                value = "${uiState.sleepHours}h",
                icon = Icons.Default.Bedtime,
                color = NeonFem,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                label = "Water",
                value = "${uiState.waterMl}ml",
                icon = Icons.Default.WaterDrop,
                color = NeonPulse,
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(Modifier.height(28.dp))

        // ━━━ MODULES GRID ━━━
        SectionHeader(
            title = "Health Modules",
            eyebrow = "EXPLORE"
        )

        // 3-column grid
        val rows = modules.chunked(3)
        rows.forEach { rowItems ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                rowItems.forEach { module ->
                    ModuleCardItem(
                        module = module,
                        onClick = { navController.navigate(module.route) },
                        modifier = Modifier.weight(1f)
                    )
                }
                // Fill remaining space if row is not full
                repeat(3 - rowItems.size) {
                    Spacer(Modifier.weight(1f))
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun StatCard(
    label: String,
    value: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    GlassCard(modifier = modifier) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, null, tint = color, modifier = Modifier.size(22.dp))
            }
            Column {
                Text(
                    text = value,
                    style = DataTextStyle.copy(fontSize = 16.sp),
                    color = TextPrimary
                )
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary
                )
            }
        }
    }
}

@Composable
private fun ModuleCardItem(
    module: ModuleCard,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(GlassSurface, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(12.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(module.color.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                module.icon,
                contentDescription = module.title,
                tint = module.color,
                modifier = Modifier.size(24.dp)
            )
        }
        Text(
            text = module.title,
            style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
            color = TextPrimary,
            maxLines = 1
        )
        Text(
            text = module.description,
            style = MaterialTheme.typography.bodySmall.copy(fontSize = 10.sp),
            color = TextSecondary,
            maxLines = 1
        )
    }
}
