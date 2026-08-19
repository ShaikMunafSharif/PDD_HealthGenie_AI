package com.healthgenie.ai.ui.screens.diet

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
import com.healthgenie.ai.ui.viewmodels.DietViewModel

@Composable
fun DietPlanScreen(
    navController: NavHostController,
    viewModel: DietViewModel = hiltViewModel()
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
            SectionHeader(title = "Diet Plan", eyebrow = "NUTRITION")
        }

        // Quick meal cards
        val meals = listOf(
            Triple("🌅 Breakfast", "7:00 - 9:00 AM", NeonHealth),
            Triple("🥪 Lunch", "12:00 - 2:00 PM", NeonPulse),
            Triple("🍽️ Dinner", "7:00 - 9:00 PM", NeonPreg),
            Triple("🍎 Snacks", "Between meals", NeonFem),
        )

        meals.forEach { (meal, time, color) ->
            GlassCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                onClick = {
                    viewModel.getMealDetails(meal)
                    navController.navigate(Routes.MEAL_DETAILS)
                },
                borderColor = color.copy(alpha = 0.3f)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(meal, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Text(time, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = color)
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // AI meal plan
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, null, tint = NeonHealth, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("AI MEAL PLAN", style = MaterialTheme.typography.labelSmall, color = NeonHealth)
            }
            Spacer(Modifier.height(16.dp))

            if (uiState.mealPlan.isEmpty() && !uiState.isLoading) {
                NeonButton(
                    text = "Generate AI Meal Plan",
                    onClick = { viewModel.generateMealPlan() },
                    variant = ButtonVariant.PRIMARY,
                    fullWidth = true,
                    icon = { Icon(Icons.Default.Restaurant, null, tint = NeonPulse, modifier = Modifier.size(18.dp)) }
                )
            } else if (uiState.isLoading && uiState.mealPlan.isEmpty()) {
                NeuralProcessing(text = "Creating your personalized meal plan...")
            } else {
                TypewriterText(text = uiState.mealPlan, isStreaming = uiState.isStreaming)
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
