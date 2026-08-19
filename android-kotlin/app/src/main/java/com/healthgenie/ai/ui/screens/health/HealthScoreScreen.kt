package com.healthgenie.ai.ui.screens.health

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.HealthViewModel

@Composable
fun HealthScoreScreen(
    navController: NavHostController,
    viewModel: HealthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
            }
            SectionHeader(title = "Health Score", eyebrow = "ANALYTICS")
        }

        // Overall Score
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("OVERALL SCORE", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
                    Spacer(Modifier.height(8.dp))
                    AnimatedCounter(
                        value = uiState.overallScore,
                        color = when {
                            uiState.overallScore >= 80 -> NeonHealth
                            uiState.overallScore >= 50 -> NeonPulse
                            else -> NeonWarn
                        }
                    )
                }
                ProgressRing(
                    value = uiState.overallScore.toFloat(),
                    size = 100.dp,
                    color = when {
                        uiState.overallScore >= 80 -> NeonHealth
                        uiState.overallScore >= 50 -> NeonPulse
                        else -> NeonWarn
                    }
                ) {
                    Text(
                        "${uiState.overallScore}",
                        style = DataTextStyle.copy(fontSize = 20.sp),
                        color = TextPrimary
                    )
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // Category Cards
        val categories = listOf(
            Triple("Fitness", uiState.fitness, NeonHealth),
            Triple("Diet", uiState.diet, NeonPreg),
            Triple("Sleep", uiState.sleep, NeonFem),
            Triple("Hydration", uiState.hydration, NeonPulse),
            Triple("Vitals", uiState.vitals, NeonWarn),
        )

        categories.chunked(2).forEach { row ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                row.forEach { (label, value, color) ->
                    CategoryCard(label, value, color, Modifier.weight(1f))
                }
                if (row.size == 1) Spacer(Modifier.weight(1f))
            }
        }

        Spacer(Modifier.height(20.dp))

        // AI Insights
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, null, tint = NeonPulse, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("AI INSIGHTS", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            }
            Spacer(Modifier.height(16.dp))

            if (uiState.aiInsight.isEmpty() && !uiState.isLoadingInsight) {
                NeonButton(
                    text = "Get AI Analysis",
                    onClick = { viewModel.fetchAIInsight() },
                    variant = ButtonVariant.PRIMARY,
                    fullWidth = true
                )
            } else if (uiState.isLoadingInsight && uiState.aiInsight.isEmpty()) {
                NeuralProcessing(text = "Analyzing your health data...")
            } else {
                TypewriterText(
                    text = uiState.aiInsight,
                    isStreaming = uiState.isLoadingInsight
                )
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun CategoryCard(
    label: String,
    value: Int,
    color: Color,
    modifier: Modifier = Modifier
) {
    GlassCard(modifier = modifier) {
        Text(label.uppercase(), style = MaterialTheme.typography.labelSmall, color = color)
        Spacer(Modifier.height(12.dp))
        ProgressRing(
            value = value.toFloat(),
            size = 70.dp,
            strokeWidth = 6.dp,
            color = color,
            modifier = Modifier.align(Alignment.CenterHorizontally)
        ) {
            Text(
                "$value",
                style = DataTextStyle.copy(fontSize = 16.sp),
                color = TextPrimary
            )
        }
    }
}
