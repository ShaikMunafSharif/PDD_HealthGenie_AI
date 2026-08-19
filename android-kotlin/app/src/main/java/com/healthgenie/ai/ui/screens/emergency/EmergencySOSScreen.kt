package com.healthgenie.ai.ui.screens.emergency

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.EmergencyViewModel
import kotlinx.coroutines.delay

@Composable
fun EmergencySOSScreen(
    navController: NavHostController,
    viewModel: EmergencyViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    val pulseScale = rememberInfiniteTransition(label = "pulse")
    val scale by pulseScale.animateFloat(
        1f, 1.15f, infiniteRepeatable(tween(1000), RepeatMode.Reverse), label = "s"
    )

    LaunchedEffect(uiState.isSOSActive) {
        if (uiState.isSOSActive) {
            for (i in 5 downTo 1) {
                viewModel.updateCountdown(i)
                delay(1000)
            }
            viewModel.callEmergency(context)
        }
    }

    Box(
        modifier = Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(NeonDanger.copy(alpha = 0.15f), BgVoid))),
        contentAlignment = Alignment.Center
    ) {
        IconButton(
            onClick = { viewModel.cancelSOS(); navController.popBackStack() },
            modifier = Modifier.align(Alignment.TopEnd).padding(24.dp)
        ) { Icon(Icons.Default.Close, "Cancel", tint = TextPrimary) }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            if (!uiState.isSOSActive) {
                Text("🆘", fontSize = 64.sp)
                Spacer(Modifier.height(24.dp))
                Text("Emergency SOS", style = MaterialTheme.typography.displayMedium, color = NeonDanger)
                Spacer(Modifier.height(8.dp))
                Text("This will call 112 and alert your contacts",
                    style = MaterialTheme.typography.bodyMedium, color = TextSecondary, textAlign = TextAlign.Center)
                Spacer(Modifier.height(48.dp))
                Box(
                    modifier = Modifier.size(160.dp).scale(scale).clip(CircleShape)
                        .background(NeonDanger.copy(alpha = 0.3f), CircleShape)
                        .clickable { viewModel.activateSOS() },
                    contentAlignment = Alignment.Center
                ) {
                    Box(modifier = Modifier.size(120.dp).clip(CircleShape).background(NeonDanger, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("SOS", style = MaterialTheme.typography.displayMedium.copy(
                            fontWeight = FontWeight.Bold), color = TextPrimary)
                    }
                }
                Spacer(Modifier.height(24.dp))
                Text("Tap to activate", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
            } else {
                Text("⚠️", fontSize = 64.sp)
                Spacer(Modifier.height(24.dp))
                Text("SOS ACTIVATING", style = MaterialTheme.typography.displayMedium, color = NeonDanger)
                Spacer(Modifier.height(24.dp))
                Text("${uiState.sosCountdown}", style = DataTextStyle.copy(fontSize = 72.sp), color = NeonDanger)
                Spacer(Modifier.height(24.dp))
                NeonButton("Cancel SOS", { viewModel.cancelSOS() }, variant = ButtonVariant.DANGER, fullWidth = true)
            }
        }
    }
}

