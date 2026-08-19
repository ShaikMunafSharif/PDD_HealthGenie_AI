package com.healthgenie.ai.ui.screens.auth

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.AuthViewModel

@Composable
fun LoginScreen(
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
            val dest = when {
                uiState.hasCompletedSetup -> Routes.DASHBOARD
                uiState.hasCompletedOnboarding -> Routes.SETUP_PROFILE
                else -> Routes.ONBOARDING_1
            }
            navController.navigate(dest) {
                popUpTo(Routes.LOGIN) { inclusive = true }
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
            Spacer(Modifier.height(60.dp))

            // Logo
            HealthOrb(score = 80, size = 100)

            Spacer(Modifier.height(24.dp))

            Text(
                text = "Welcome Back",
                style = MaterialTheme.typography.displayMedium,
                color = TextPrimary
            )
            Text(
                text = "Sign in to continue your health journey",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                modifier = Modifier.padding(top = 8.dp)
            )

            Spacer(Modifier.height(40.dp))

            // Login Form
            GlassCard(modifier = Modifier.fillMaxWidth()) {
                GlassInput(
                    value = uiState.email,
                    onValueChange = viewModel::updateEmail,
                    label = "Email",
                    placeholder = "Enter your email",
                    leadingIcon = {
                        Icon(Icons.Default.Email, null, tint = NeonPulse)
                    },
                    keyboardType = androidx.compose.ui.text.input.KeyboardType.Email
                )

                Spacer(Modifier.height(16.dp))

                GlassInput(
                    value = uiState.password,
                    onValueChange = viewModel::updatePassword,
                    label = "Password",
                    placeholder = "Enter your password",
                    isPassword = !passwordVisible,
                    leadingIcon = {
                        Icon(Icons.Default.Lock, null, tint = NeonPulse)
                    },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                if (passwordVisible) Icons.Default.Visibility
                                else Icons.Default.VisibilityOff,
                                contentDescription = "Toggle password",
                                tint = TextSecondary
                            )
                        }
                    }
                )

                // Forgot password
                Text(
                    text = "Forgot Password?",
                    style = MaterialTheme.typography.bodySmall,
                    color = NeonPulse,
                    modifier = Modifier
                        .align(Alignment.End)
                        .padding(top = 8.dp)
                        .clickable { navController.navigate(Routes.FORGOT_PASSWORD) }
                )

                // Error
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
                    text = if (uiState.isLoading) "Signing in..." else "Sign In",
                    onClick = { viewModel.login() },
                    variant = ButtonVariant.PRIMARY,
                    fullWidth = true,
                    enabled = !uiState.isLoading
                )
            }

            Spacer(Modifier.height(32.dp))

            // Sign up link
            Text(
                text = buildAnnotatedString {
                    withStyle(SpanStyle(color = TextSecondary)) {
                        append("Don't have an account? ")
                    }
                    withStyle(SpanStyle(color = NeonPulse, fontWeight = FontWeight.SemiBold)) {
                        append("Sign Up")
                    }
                },
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.clickable {
                    navController.navigate(Routes.SIGNUP)
                }
            )

            Spacer(Modifier.height(40.dp))
        }
    }
}
