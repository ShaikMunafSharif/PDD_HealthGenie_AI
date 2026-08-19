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
import com.healthgenie.ai.ui.viewmodels.SymptomViewModel
import com.healthgenie.ai.ui.viewmodels.bodyPartOptions

@Composable
fun SymptomSelectScreen(
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
            SectionHeader(
                title = "Select Body Areas",
                eyebrow = "SYMPTOM CHECKER",
                subtitle = "Where are you experiencing discomfort?"
            )
        }

        Spacer(Modifier.height(8.dp))

        GlassCard(modifier = Modifier.fillMaxWidth()) {
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                bodyPartOptions.forEach { part ->
                    SelectableChip(
                        label = part,
                        selected = part in uiState.selectedBodyParts,
                        onClick = { viewModel.toggleBodyPart(part) },
                        color = NeonWarn
                    )
                }
            }
        }

        Spacer(Modifier.weight(1f))

        NeonButton(
            text = "Continue (${uiState.selectedBodyParts.size} selected)",
            onClick = { navController.navigate(Routes.SYMPTOM_DETAILS) },
            variant = ButtonVariant.PRIMARY,
            fullWidth = true,
            enabled = uiState.selectedBodyParts.isNotEmpty()
        )

        Spacer(Modifier.height(24.dp))
    }
}
