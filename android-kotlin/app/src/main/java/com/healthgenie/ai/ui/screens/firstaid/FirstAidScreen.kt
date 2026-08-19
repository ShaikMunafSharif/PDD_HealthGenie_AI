package com.healthgenie.ai.ui.screens.firstaid

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
import com.healthgenie.ai.ui.viewmodels.FirstAidViewModel

private val firstAidCategories = listOf(
    "Burns", "Cuts & Wounds", "Choking", "CPR",
    "Fractures", "Poisoning", "Allergic Reaction", "Heart Attack",
    "Stroke", "Seizures", "Snake Bite", "Heat Stroke",
    "Drowning", "Electric Shock", "Nosebleed", "Fainting"
)

@Composable
fun FirstAidScreen(
    navController: NavHostController,
    viewModel: FirstAidViewModel = hiltViewModel()
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
            SectionHeader(title = "First Aid", eyebrow = "EMERGENCY GUIDE", subtitle = "Select a situation for step-by-step help")
        }

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                firstAidCategories.forEach { cat ->
                    SelectableChip(
                        label = cat,
                        selected = uiState.selectedCategory == cat,
                        onClick = { viewModel.getInstructions(cat) },
                        color = NeonWarn
                    )
                }
            }
        }

        if (uiState.selectedCategory.isNotEmpty()) {
            Spacer(Modifier.height(20.dp))
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.MedicalServices, null, tint = NeonWarn, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text(uiState.selectedCategory.uppercase(), style = MaterialTheme.typography.labelSmall, color = NeonWarn)
                }
                Spacer(Modifier.height(16.dp))

                if (uiState.isLoading && uiState.instructions.isEmpty()) {
                    NeuralProcessing(text = "Loading first aid instructions...")
                } else {
                    TypewriterText(text = uiState.instructions, isStreaming = uiState.isStreaming)
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
