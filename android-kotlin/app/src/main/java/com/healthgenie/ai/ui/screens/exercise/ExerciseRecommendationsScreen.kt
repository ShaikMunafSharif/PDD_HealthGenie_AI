package com.healthgenie.ai.ui.screens.exercise

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
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.ExerciseViewModel

@Composable
fun ExerciseRecommendationsScreen(
    navController: NavHostController,
    viewModel: ExerciseViewModel = hiltViewModel()
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
            SectionHeader(title = "Exercise", eyebrow = "FITNESS")
        }

        // Quick categories
        val categories = listOf(
            Triple("🏃 Cardio", "Heart health", NeonDanger),
            Triple("💪 Strength", "Build muscle", NeonHealth),
            Triple("🧘 Flexibility", "Stretch & relax", NeonFem),
            Triple("🩹 Pain Relief", "Targeted relief", NeonWarn),
        )
        categories.forEach { (name, desc, color) ->
            GlassCard(
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                onClick = {
                    if (name.contains("Pain")) {
                        navController.navigate(Routes.PAIN_RELIEF)
                    } else {
                        viewModel.getExerciseDetails(name)
                        navController.navigate(Routes.EXERCISE_DETAILS)
                    }
                },
                borderColor = color.copy(alpha = 0.3f)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(name, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Text(desc, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = color)
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // AI recommendations
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, null, tint = NeonHealth, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("AI WORKOUT", style = MaterialTheme.typography.labelSmall, color = NeonHealth)
            }
            Spacer(Modifier.height(16.dp))

            if (uiState.recommendations.isEmpty() && !uiState.isLoading) {
                NeonButton(
                    text = "Get Today's Workout",
                    onClick = { viewModel.getRecommendations() },
                    variant = ButtonVariant.PRIMARY,
                    fullWidth = true,
                    icon = { Icon(Icons.Default.FitnessCenter, null, tint = NeonPulse, modifier = Modifier.size(18.dp)) }
                )
            } else if (uiState.isLoading && uiState.recommendations.isEmpty()) {
                NeuralProcessing(text = "Creating your workout plan...")
            } else {
                TypewriterText(text = uiState.recommendations, isStreaming = uiState.isStreaming)
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
