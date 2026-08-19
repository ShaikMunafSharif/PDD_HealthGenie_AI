package com.healthgenie.ai.ui.screens.diet

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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.DietViewModel

@Composable
fun MealDetailsScreen(
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
            SectionHeader(
                title = uiState.selectedMeal.ifEmpty { "Meal Details" },
                eyebrow = "NUTRITION INFO"
            )
        }

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, null, tint = NeonHealth, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("NUTRITIONAL BREAKDOWN", style = MaterialTheme.typography.labelSmall, color = NeonHealth)
            }
            Spacer(Modifier.height(16.dp))

            if (uiState.isLoadingDetail && uiState.mealDetail.isEmpty()) {
                NeuralProcessing(text = "Analyzing nutritional content...")
            } else if (uiState.mealDetail.isNotEmpty()) {
                TypewriterText(text = uiState.mealDetail, isStreaming = uiState.isLoadingDetail)
            } else {
                Text(
                    "Select a meal to view nutritional details",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
