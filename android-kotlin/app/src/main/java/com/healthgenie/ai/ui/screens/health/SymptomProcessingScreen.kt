package com.healthgenie.ai.ui.screens.health

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.NeuralProcessing
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.SymptomViewModel

@Composable
fun SymptomProcessingScreen(
    navController: NavHostController,
    viewModel: SymptomViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(uiState.isProcessing) {
        if (!uiState.isProcessing && uiState.analysisResult.isNotEmpty()) {
            navController.navigate(Routes.SYMPTOM_RESULTS) {
                popUpTo(Routes.SYMPTOM_PROCESSING) { inclusive = true }
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth))),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            NeuralProcessing(text = "HealthGenie is analyzing your symptoms...")

            Spacer(Modifier.height(16.dp))

            Text(
                text = "This may take a moment",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary
            )
        }
    }
}
