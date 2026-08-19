package com.healthgenie.ai.ui.screens.health

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
import com.healthgenie.ai.ui.viewmodels.SymptomViewModel

@Composable
fun SymptomResultsScreen(
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
            IconButton(onClick = {
                viewModel.reset()
                navController.navigate(Routes.DASHBOARD) {
                    popUpTo(Routes.DASHBOARD) { inclusive = true }
                }
            }) {
                Icon(Icons.Default.Close, "Close", tint = TextPrimary)
            }
            SectionHeader(title = "Analysis Results", eyebrow = "AI DIAGNOSIS")
        }

        // Summary card
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.LocalHospital, null, tint = NeonWarn, modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Areas Affected", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
                    Text(
                        uiState.selectedBodyParts.joinToString(", "),
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                }
            }
            Spacer(Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Thermostat, null, tint = NeonDanger, modifier = Modifier.size(24.dp))
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Severity", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
                    Text(
                        "${uiState.severity.toInt()}/10 • ${uiState.duration}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = TextPrimary
                    )
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // AI Analysis
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, null, tint = NeonPulse, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(8.dp))
                Text("AI ANALYSIS", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            }
            Spacer(Modifier.height(16.dp))

            if (uiState.analysisResult.isNotEmpty()) {
                TypewriterText(
                    text = uiState.analysisResult,
                    isStreaming = uiState.isStreaming
                )
            } else {
                NeuralProcessing()
            }
        }

        Spacer(Modifier.height(20.dp))

        // Actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            NeonButton(
                text = "Find Doctor",
                onClick = { navController.navigate(Routes.DOCTOR_REC) },
                modifier = Modifier.weight(1f),
                fullWidth = true
            )
            NeonButton(
                text = "New Check",
                onClick = {
                    viewModel.reset()
                    navController.navigate(Routes.SYMPTOM_SELECT) {
                        popUpTo(Routes.SYMPTOM_SELECT) { inclusive = true }
                    }
                },
                variant = ButtonVariant.PRIMARY,
                modifier = Modifier.weight(1f),
                fullWidth = true
            )
        }

        Spacer(Modifier.height(80.dp))
    }
}
