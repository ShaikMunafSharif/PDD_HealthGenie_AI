package com.healthgenie.ai.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.healthgenie.ai.ui.viewmodels.AuthViewModel

private val allergyOptions = listOf(
    "Peanuts", "Tree Nuts", "Milk", "Eggs", "Wheat",
    "Soy", "Fish", "Shellfish", "Sesame", "Sulphites",
    "Penicillin", "Aspirin", "NSAIDs", "Latex",
    "Pollen", "Dust Mites", "Pet Dander", "Mold",
    "Insect Stings", "None"
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SetupAllergiesScreen(
    navController: NavHostController,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(40.dp))

            // Progress indicator
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                repeat(3) { i ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(4.dp)
                            .background(
                                NeonPulse,
                                shape = androidx.compose.foundation.shape.RoundedCornerShape(2.dp)
                            )
                    )
                }
            }

            Spacer(Modifier.height(32.dp))

            SectionHeader(
                title = "Allergies",
                eyebrow = "STEP 3 OF 3",
                subtitle = "Select any allergies you have"
            )

            GlassCard(modifier = Modifier.fillMaxWidth()) {
                androidx.compose.foundation.layout.FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    allergyOptions.forEach { allergy ->
                        SelectableChip(
                            label = allergy,
                            selected = allergy in uiState.selectedAllergies,
                            onClick = { viewModel.toggleAllergy(allergy) },
                            color = NeonDanger
                        )
                    }
                }
            }

            Spacer(Modifier.weight(1f))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                NeonButton(
                    text = "Back",
                    onClick = { navController.popBackStack() },
                    modifier = Modifier.weight(1f),
                    fullWidth = true
                )
                NeonButton(
                    text = "Complete Setup",
                    onClick = {
                        viewModel.saveAllergiesAndComplete()
                        navController.navigate(Routes.DASHBOARD) {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    variant = ButtonVariant.PRIMARY,
                    modifier = Modifier.weight(1f),
                    fullWidth = true
                )
            }

            Spacer(Modifier.height(24.dp))
        }
    }
}
