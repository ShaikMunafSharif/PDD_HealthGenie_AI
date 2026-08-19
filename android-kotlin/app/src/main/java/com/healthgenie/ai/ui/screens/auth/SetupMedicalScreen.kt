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

private val medicalConditions = listOf(
    "Diabetes", "Hypertension", "Heart Disease", "Asthma",
    "Thyroid Disorder", "PCOS", "Arthritis", "Migraine",
    "Anxiety", "Depression", "Anemia", "Kidney Disease",
    "Liver Disease", "Cancer", "Epilepsy", "None of the above"
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SetupMedicalScreen(
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
                                if (i <= 1) NeonPulse else GlassBorder,
                                shape = androidx.compose.foundation.shape.RoundedCornerShape(2.dp)
                            )
                    )
                }
            }

            Spacer(Modifier.height(32.dp))

            SectionHeader(
                title = "Medical History",
                eyebrow = "STEP 2 OF 3",
                subtitle = "Select any conditions that apply to you"
            )

            GlassCard(modifier = Modifier.fillMaxWidth()) {
                androidx.compose.foundation.layout.FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    medicalConditions.forEach { condition ->
                        SelectableChip(
                            label = condition,
                            selected = condition in uiState.selectedConditions,
                            onClick = { viewModel.toggleCondition(condition) },
                            color = NeonWarn
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
                    text = "Continue",
                    onClick = {
                        viewModel.saveMedicalHistory()
                        navController.navigate(Routes.SETUP_ALLERGIES)
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
