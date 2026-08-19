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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.DoctorViewModel

private val specialists = listOf(
    Triple("General Physician", "🩺", NeonPulse),
    Triple("Cardiologist", "❤️", NeonDanger),
    Triple("Dermatologist", "🧴", NeonFem),
    Triple("Neurologist", "🧠", NeonPulse),
    Triple("Orthopedic", "🦴", NeonHealth),
    Triple("Gynecologist", "👩‍⚕️", NeonFem),
    Triple("Pediatrician", "👶", NeonPreg),
    Triple("Psychiatrist", "🧠", NeonFem),
    Triple("ENT Specialist", "👂", NeonWarn),
    Triple("Ophthalmologist", "👁️", NeonPulse),
    Triple("Dentist", "🦷", TextPrimary),
    Triple("Endocrinologist", "🧬", NeonHealth),
)

@Composable
fun DoctorSpecialistScreen(
    navController: NavHostController,
    viewModel: DoctorViewModel = hiltViewModel()
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
            SectionHeader(title = "Specialists", eyebrow = "DOCTOR TYPES")
        }

        specialists.forEach { (name, emoji, color) ->
            GlassCard(
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                onClick = { viewModel.getSpecialistInfo(name) },
                borderColor = if (uiState.selectedSpecialist == name) color.copy(alpha = 0.5f) else GlassBorder
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(emoji, style = MaterialTheme.typography.titleLarge)
                        Spacer(Modifier.width(12.dp))
                        Text(name, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = color)
                }

                if (uiState.selectedSpecialist == name) {
                    Spacer(Modifier.height(12.dp))
                    if (uiState.isLoadingSpecialist && uiState.specialistInfo.isEmpty()) {
                        ShimmerSkeleton(width = 280.dp, height = 60.dp)
                    } else if (uiState.specialistInfo.isNotEmpty()) {
                        TypewriterText(text = uiState.specialistInfo, isStreaming = uiState.isLoadingSpecialist)
                    }
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
