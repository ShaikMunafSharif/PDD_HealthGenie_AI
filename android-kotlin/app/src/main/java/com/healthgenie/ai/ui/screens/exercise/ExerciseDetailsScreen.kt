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
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.ExerciseViewModel

@Composable
fun ExerciseDetailsScreen(
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
            SectionHeader(
                title = uiState.selectedExercise.ifEmpty { "Exercise Details" },
                eyebrow = "INSTRUCTIONS"
            )
        }

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            if (uiState.isLoadingDetail && uiState.exerciseDetail.isEmpty()) {
                NeuralProcessing(text = "Loading exercise details...")
            } else if (uiState.exerciseDetail.isNotEmpty()) {
                TypewriterText(text = uiState.exerciseDetail, isStreaming = uiState.isLoadingDetail)
            } else {
                Text(
                    "Select an exercise to view details",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
