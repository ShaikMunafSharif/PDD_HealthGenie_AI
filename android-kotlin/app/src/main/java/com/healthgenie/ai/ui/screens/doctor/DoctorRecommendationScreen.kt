package com.healthgenie.ai.ui.screens.doctor

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
import com.healthgenie.ai.ui.viewmodels.DoctorViewModel

@Composable
fun DoctorRecommendationScreen(
    navController: NavHostController,
    viewModel: DoctorViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var symptoms by remember { mutableStateOf("") }

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
            SectionHeader(title = "Find a Doctor", eyebrow = "SPECIALIST FINDER")
        }

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            GlassInput(
                value = symptoms,
                onValueChange = { symptoms = it },
                label = "Describe your symptoms",
                placeholder = "e.g., persistent headache, blurred vision..."
            )
            Spacer(Modifier.height(16.dp))
            NeonButton(
                text = "Get Recommendation",
                onClick = { viewModel.getRecommendation(symptoms) },
                variant = ButtonVariant.PRIMARY,
                fullWidth = true,
                enabled = symptoms.isNotBlank()
            )
        }

        if (uiState.recommendation.isNotEmpty() || uiState.isLoading) {
            Spacer(Modifier.height(20.dp))
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, null, tint = NeonHealth, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("AI RECOMMENDATION", style = MaterialTheme.typography.labelSmall, color = NeonHealth)
                }
                Spacer(Modifier.height(16.dp))
                if (uiState.isLoading && uiState.recommendation.isEmpty()) {
                    NeuralProcessing(text = "Finding the right specialist...")
                } else {
                    TypewriterText(text = uiState.recommendation, isStreaming = uiState.isStreaming)
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        NeonButton(
            text = "Browse Specialists",
            onClick = { navController.navigate(Routes.DOCTOR_SPECIALIST) },
            fullWidth = true
        )

        Spacer(Modifier.height(80.dp))
    }
}
