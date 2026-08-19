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

private val painAreas = listOf(
    "Neck", "Shoulders", "Upper Back", "Lower Back",
    "Knees", "Hips", "Wrists", "Ankles", "Headache/Tension"
)

@Composable
fun PainReliefScreen(
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
            SectionHeader(title = "Pain Relief", eyebrow = "TARGETED EXERCISES", subtitle = "Select where you feel pain")
        }

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                painAreas.forEach { area ->
                    SelectableChip(
                        label = area,
                        selected = uiState.painArea == area,
                        onClick = { viewModel.getPainRelief(area) },
                        color = NeonWarn
                    )
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        if (uiState.painArea.isNotEmpty()) {
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Healing, null, tint = NeonWarn, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("${uiState.painArea.uppercase()} RELIEF", style = MaterialTheme.typography.labelSmall, color = NeonWarn)
                }
                Spacer(Modifier.height(16.dp))

                if (uiState.isLoadingRelief && uiState.painRelief.isEmpty()) {
                    NeuralProcessing(text = "Finding relief exercises...")
                } else if (uiState.painRelief.isNotEmpty()) {
                    TypewriterText(text = uiState.painRelief, isStreaming = uiState.isLoadingRelief)
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
