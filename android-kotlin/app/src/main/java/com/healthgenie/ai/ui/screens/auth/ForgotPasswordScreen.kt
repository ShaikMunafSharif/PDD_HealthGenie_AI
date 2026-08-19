package com.healthgenie.ai.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Email
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.AuthViewModel

@Composable
fun ForgotPasswordScreen(
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

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
                }
                Text(
                    text = "Reset Password",
                    style = MaterialTheme.typography.titleLarge,
                    color = TextPrimary
                )
            }

            Spacer(Modifier.height(40.dp))

            Text(
                text = "🔐",
                style = MaterialTheme.typography.displayLarge
            )

            Spacer(Modifier.height(24.dp))

            Text(
                text = "Forgot your password?",
                style = MaterialTheme.typography.displayMedium,
                color = TextPrimary
            )
            Text(
                text = "Enter your email address and we'll send you a link to reset it.",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                modifier = Modifier.padding(top = 8.dp)
            )

            Spacer(Modifier.height(32.dp))

            GlassCard(modifier = Modifier.fillMaxWidth()) {
                GlassInput(
                    value = uiState.email,
                    onValueChange = viewModel::updateEmail,
                    label = "Email Address",
                    placeholder = "Enter your registered email",
                    leadingIcon = { Icon(Icons.Default.Email, null, tint = NeonPulse) },
                    keyboardType = androidx.compose.ui.text.input.KeyboardType.Email
                )

                if (uiState.error != null) {
                    Text(
                        text = uiState.error!!,
                        style = MaterialTheme.typography.bodySmall,
                        color = NeonHealth,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }

                Spacer(Modifier.height(24.dp))

                NeonButton(
                    text = "Send Reset Link",
                    onClick = { viewModel.resetPassword() },
                    variant = ButtonVariant.PRIMARY,
                    fullWidth = true
                )
            }
        }
    }
}
