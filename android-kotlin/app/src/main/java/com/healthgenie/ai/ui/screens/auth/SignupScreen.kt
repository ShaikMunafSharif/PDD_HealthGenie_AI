package com.healthgenie.ai.ui.screens.auth

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.AuthViewModel

@Composable
fun SignupScreen(
    navController: NavHostController,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var passwordVisible by remember { mutableStateOf(false) }
    var showContent by remember { mutableStateOf(false) }

    val contentAlpha by animateFloatAsState(
        targetValue = if (showContent) 1f else 0f,
        animationSpec = tween(800, easing = EaseOutCubic),
        label = "contentAlpha"
    )

    LaunchedEffect(Unit) { showContent = true }

    LaunchedEffect(uiState.isAuthenticated) {
        if (uiState.isAuthenticated) {
            navController.navigate(Routes.ONBOARDING_1) {
                popUpTo(Routes.SIGNUP) { inclusive = true }
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp)
                .alpha(contentAlpha),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(40.dp))

            // Back button
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
                }
            }

            Spacer(Modifier.height(16.dp))

            Text(
                text = "Create Account",
                style = MaterialTheme.typography.displayMedium,
                color = TextPrimary
            )
            Text(
                text = "Start your AI-powered health journey",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                modifier = Modifier.padding(top = 8.dp)
            )

            Spacer(Modifier.height(32.dp))

            GlassCard(modifier = Modifier.fillMaxWidth()) {
                GlassInput(
                    value = uiState.name,
                    onValueChange = viewModel::updateName,
                    label = "Full Name",
                    placeholder = "Enter your name",
                    leadingIcon = { Icon(Icons.Default.Person, null, tint = NeonPulse) }
                )

                Spacer(Modifier.height(16.dp))

                GlassInput(
                    value = uiState.email,
                    onValueChange = viewModel::updateEmail,
                    label = "Email",
                    placeholder = "Enter your email",
                    leadingIcon = { Icon(Icons.Default.Email, null, tint = NeonPulse) },
                    keyboardType = androidx.compose.ui.text.input.KeyboardType.Email
                )

                Spacer(Modifier.height(16.dp))

                GlassInput(
                    value = uiState.password,
                    onValueChange = viewModel::updatePassword,
                    label = "Password",
                    placeholder = "Min 6 characters",
                    isPassword = !passwordVisible,
                    leadingIcon = { Icon(Icons.Default.Lock, null, tint = NeonPulse) },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                if (passwordVisible) Icons.Default.Visibility
                                else Icons.Default.VisibilityOff,
                                contentDescription = "Toggle",
                                tint = TextSecondary
                            )
                        }
                    }
                )

                Spacer(Modifier.height(16.dp))

                GlassInput(
                    value = uiState.confirmPassword,
                    onValueChange = viewModel::updateConfirmPassword,
                    label = "Confirm Password",
                    placeholder = "Re-enter password",
                    isPassword = true,
                    leadingIcon = { Icon(Icons.Default.Lock, null, tint = NeonPulse) }
                )

                if (uiState.error != null) {
                    Text(
                        text = uiState.error!!,
                        style = MaterialTheme.typography.bodySmall,
                        color = NeonWarn,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }

                Spacer(Modifier.height(24.dp))

                NeonButton(
                    text = if (uiState.isLoading) "Creating Account..." else "Create Account",
                    onClick = { viewModel.signup() },
                    variant = ButtonVariant.PRIMARY,
                    fullWidth = true,
                    enabled = !uiState.isLoading
                )
            }

            Spacer(Modifier.height(24.dp))

            Text(
                text = buildAnnotatedString {
                    withStyle(SpanStyle(color = TextSecondary)) {
                        append("Already have an account? ")
                    }
                    withStyle(SpanStyle(color = NeonPulse, fontWeight = FontWeight.SemiBold)) {
                        append("Sign In")
                    }
                },
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.clickable { navController.popBackStack() }
            )

            Spacer(Modifier.height(40.dp))
        }
    }
}
