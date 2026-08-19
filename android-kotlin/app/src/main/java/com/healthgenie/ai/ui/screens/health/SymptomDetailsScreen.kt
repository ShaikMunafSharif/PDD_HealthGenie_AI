package com.healthgenie.ai.ui.screens.health

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
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
import com.healthgenie.ai.ui.viewmodels.*

@Composable
fun SymptomDetailsScreen(
    navController: NavHostController,
    viewModel: SymptomViewModel = hiltViewModel()
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
            SectionHeader(title = "Symptom Details", eyebrow = "STEP 2")
        }

        // Symptoms for selected body parts
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("SYMPTOMS", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            val availableSymptoms = uiState.selectedBodyParts.flatMap { part ->
                symptomOptions[part] ?: symptomOptions["General"] ?: emptyList()
            }.distinct()
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                availableSymptoms.forEach { symptom ->
                    SelectableChip(
                        label = symptom,
                        selected = symptom in uiState.selectedSymptoms,
                        onClick = { viewModel.toggleSymptom(symptom) },
                        color = NeonWarn
                    )
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // Severity
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("SEVERITY", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Mild", style = MaterialTheme.typography.bodySmall, color = NeonHealth)
                Text("${uiState.severity.toInt()}/10", style = DataTextStyle, color = TextPrimary)
                Text("Severe", style = MaterialTheme.typography.bodySmall, color = NeonDanger)
            }
            Slider(
                value = uiState.severity,
                onValueChange = viewModel::updateSeverity,
                valueRange = 1f..10f,
                steps = 8,
                colors = SliderDefaults.colors(
                    thumbColor = NeonWarn,
                    activeTrackColor = NeonWarn,
                    inactiveTrackColor = GlassBorder
                )
            )
        }

        Spacer(Modifier.height(16.dp))

        // Duration
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("DURATION", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                durationOptions.forEach { d ->
                    SelectableChip(
                        label = d,
                        selected = uiState.duration == d,
                        onClick = { viewModel.updateDuration(d) }
                    )
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // Frequency
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("FREQUENCY", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                frequencyOptions.forEach { f ->
                    SelectableChip(
                        label = f,
                        selected = uiState.frequency == f,
                        onClick = { viewModel.updateFrequency(f) }
                    )
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // Notes
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            GlassInput(
                value = uiState.notes,
                onValueChange = viewModel::updateNotes,
                label = "Additional Notes",
                placeholder = "Describe anything else..."
            )
        }

        Spacer(Modifier.height(24.dp))

        NeonButton(
            text = "Analyze Symptoms",
            onClick = {
                viewModel.startAnalysis()
                navController.navigate(Routes.SYMPTOM_PROCESSING)
            },
            variant = ButtonVariant.DANGER,
            fullWidth = true,
            enabled = uiState.selectedSymptoms.isNotEmpty()
        )

        Spacer(Modifier.height(24.dp))
    }
}
