package com.healthgenie.ai.ui.screens.analytics

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.AnalyticsViewModel

@Composable
fun AnalyticsProgressScreen(navController: NavHostController, viewModel: AnalyticsViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Progress", eyebrow = "ANALYTICS")
        }
        // Score trend
        GlassCard(Modifier.fillMaxWidth()) {
            Text("HEALTH SCORE TREND", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(16.dp))
            if (uiState.healthHistory.isNotEmpty()) {
                uiState.healthHistory.take(7).forEachIndexed { i, score ->
                    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween) {
                        Text(score.date.takeLast(5), style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("${score.overallScore}", style = DataTextStyle.copy(fontSize = 16.sp),
                                color = when { score.overallScore >= 80 -> NeonHealth; score.overallScore >= 50 -> NeonPulse; else -> NeonWarn })
                            Text("/100", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        }
                    }
                }
            } else {
                Text("No data yet. Start tracking!", style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth(), Arrangement.spacedBy(12.dp)) {
            NeonButton("Streaks", { navController.navigate(Routes.ANALYTICS_STREAKS) }, modifier = Modifier.weight(1f), fullWidth = true)
            NeonButton("Report", { navController.navigate(Routes.ANALYTICS_REPORT) }, variant = ButtonVariant.PRIMARY, modifier = Modifier.weight(1f), fullWidth = true)
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun AnalyticsStreaksScreen(navController: NavHostController, viewModel: AnalyticsViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Streaks", eyebrow = "CONSISTENCY")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            Row(Modifier.fillMaxWidth(), Arrangement.SpaceEvenly) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("🔥", style = MaterialTheme.typography.displayMedium)
                    AnimatedCounter(uiState.totalActiveDays, color = NeonWarn)
                    Text("Active Days", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("⚡", style = MaterialTheme.typography.displayMedium)
                    AnimatedCounter(uiState.longestStreak, color = NeonPulse)
                    Text("Best Streak", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        GlassCard(Modifier.fillMaxWidth()) {
            Text("ACTIVITY LOG", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            if (uiState.streaks.isEmpty()) {
                Text("Start tracking to build streaks!", style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
            } else {
                uiState.streaks.take(14).forEach { streak ->
                    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween) {
                        Text(streak.date, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        Text("${streak.activityCount} activities", style = MaterialTheme.typography.bodySmall, color = NeonHealth)
                    }
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun AnalyticsReportScreen(navController: NavHostController, viewModel: AnalyticsViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Health Report", eyebrow = "SUMMARY")
        }
        val latest = uiState.healthHistory.firstOrNull()
        GlassCard(Modifier.fillMaxWidth()) {
            Text("LATEST SCORES", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(16.dp))
            if (latest != null) {
                listOf("Overall" to latest.overallScore, "Fitness" to latest.fitness, "Diet" to latest.diet,
                    "Sleep" to latest.sleep, "Hydration" to latest.hydration, "Vitals" to latest.vitals
                ).forEach { (label, score) ->
                    Row(Modifier.fillMaxWidth().padding(vertical = 6.dp), Arrangement.SpaceBetween) {
                        Text(label, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                        Text("$score/100", style = DataTextStyle, color = when { score >= 80 -> NeonHealth; score >= 50 -> NeonPulse; else -> NeonWarn })
                    }
                }
            } else { Text("No health data recorded yet", style = MaterialTheme.typography.bodyMedium, color = TextSecondary) }
        }
        Spacer(Modifier.height(16.dp))
        GlassCard(Modifier.fillMaxWidth()) {
            Text("ACTIVITY STATS", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                Text("Active Days", style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                Text("${uiState.totalActiveDays}", style = DataTextStyle, color = NeonHealth)
            }
            Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                Text("Best Streak", style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                Text("${uiState.longestStreak} days", style = DataTextStyle, color = NeonWarn)
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}
