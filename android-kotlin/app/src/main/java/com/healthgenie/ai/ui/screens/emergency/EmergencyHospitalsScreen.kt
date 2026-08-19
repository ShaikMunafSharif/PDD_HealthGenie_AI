package com.healthgenie.ai.ui.screens.emergency

import android.content.Intent
import android.net.Uri
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.EmergencyViewModel

private val defaultHospitals = listOf(
    Triple("Apollo Hospital", "Multi-specialty", "4.5 ★"),
    Triple("AIIMS", "Government", "4.3 ★"),
    Triple("Max Healthcare", "Multi-specialty", "4.4 ★"),
    Triple("Fortis Hospital", "Multi-specialty", "4.2 ★"),
    Triple("Medanta", "Super-specialty", "4.6 ★"),
    Triple("City General Hospital", "Government", "3.8 ★"),
)

@Composable
fun EmergencyHospitalsScreen(
    navController: NavHostController,
    viewModel: EmergencyViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

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
            SectionHeader(title = "Nearby Hospitals", eyebrow = "EMERGENCY")
        }

        // Open Maps button
        NeonButton(
            text = "Open in Google Maps",
            onClick = {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=hospitals+near+me"))
                context.startActivity(intent)
            },
            variant = ButtonVariant.PRIMARY,
            fullWidth = true,
            icon = { Icon(Icons.Default.Map, null, tint = NeonPulse, modifier = Modifier.size(18.dp)) }
        )

        Spacer(Modifier.height(20.dp))

        if (uiState.isLoadingHospitals) {
            NeuralProcessing(text = "Fetching nearby hospitals from backend...")
        } else if (uiState.nearbyHospitals.isNotEmpty()) {
            uiState.nearbyHospitals.forEach { hospital ->
                GlassCard(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                    onClick = {
                        val query = Uri.encode(hospital.name)
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=$query"))
                        context.startActivity(intent)
                    }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(hospital.name, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text(hospital.type ?: "Hospital", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                if (hospital.rating != null) {
                                    Text("${hospital.rating} ★", style = MaterialTheme.typography.bodySmall, color = NeonPreg)
                                }
                            }
                            if (!hospital.address.isNullOrBlank()) {
                                Text(hospital.address, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                            }
                        }
                        Icon(Icons.Default.Directions, null, tint = NeonPulse)
                    }
                }
            }
        } else {
            defaultHospitals.forEach { (name, type, rating) ->
                GlassCard(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                    onClick = {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=$name"))
                        context.startActivity(intent)
                    }
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(name, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text(type, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                Text(rating, style = MaterialTheme.typography.bodySmall, color = NeonPreg)
                            }
                        }
                        Icon(Icons.Default.Directions, null, tint = NeonPulse)
                    }
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}
