package com.healthgenie.ai.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import com.healthgenie.ai.ui.viewmodels.AuthViewModel

private val genderOptions = listOf("Male", "Female", "Other", "Prefer not to say")
private val bloodGroups = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SetupProfileScreen(
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
                                if (i == 0) NeonPulse else GlassBorder,
                                shape = androidx.compose.foundation.shape.RoundedCornerShape(2.dp)
                            )
                    )
                }
            }

            Spacer(Modifier.height(32.dp))

            SectionHeader(
                title = "Your Profile",
                eyebrow = "STEP 1 OF 3",
                subtitle = "Help us personalize your health experience"
            )

            GlassCard(modifier = Modifier.fillMaxWidth()) {
                // Gender selection
                Text(
                    text = "GENDER",
                    style = MaterialTheme.typography.labelSmall,
                    color = NeonPulse,
                    modifier = Modifier.padding(bottom = 12.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    genderOptions.forEach { gender ->
                        SelectableChip(
                            label = gender,
                            selected = uiState.gender == gender,
                            onClick = { viewModel.updateGender(gender) }
                        )
                    }
                }

                Spacer(Modifier.height(20.dp))

                GlassInput(
                    value = uiState.age,
                    onValueChange = viewModel::updateAge,
                    label = "Age",
                    placeholder = "Enter your age",
                    leadingIcon = { Icon(Icons.Default.Cake, null, tint = NeonPulse) },
                    keyboardType = androidx.compose.ui.text.input.KeyboardType.Number
                )

                Spacer(Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    GlassInput(
                        value = uiState.height,
                        onValueChange = viewModel::updateHeight,
                        label = "Height (cm)",
                        placeholder = "170",
                        modifier = Modifier.weight(1f),
                        keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal
                    )
                    GlassInput(
                        value = uiState.weight,
                        onValueChange = viewModel::updateWeight,
                        label = "Weight (kg)",
                        placeholder = "65",
                        modifier = Modifier.weight(1f),
                        keyboardType = androidx.compose.ui.text.input.KeyboardType.Decimal
                    )
                }

                Spacer(Modifier.height(20.dp))

                // Blood group
                Text(
                    text = "BLOOD GROUP",
                    style = MaterialTheme.typography.labelSmall,
                    color = NeonPulse,
                    modifier = Modifier.padding(bottom = 12.dp)
                )
                androidx.compose.foundation.layout. FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    bloodGroups.forEach { bg ->
                        SelectableChip(
                            label = bg,
                            selected = uiState.bloodGroup == bg,
                            onClick = { viewModel.updateBloodGroup(bg) },
                            color = NeonDanger
                        )
                    }
                }
            }

            Spacer(Modifier.weight(1f))

            NeonButton(
                text = "Continue",
                onClick = {
                    viewModel.saveProfile()
                    navController.navigate(Routes.SETUP_MEDICAL)
                },
                variant = ButtonVariant.PRIMARY,
                fullWidth = true
            )

            Spacer(Modifier.height(24.dp))
        }
    }
}
