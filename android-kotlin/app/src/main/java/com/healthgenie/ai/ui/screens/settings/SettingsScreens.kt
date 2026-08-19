package com.healthgenie.ai.ui.screens.settings

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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.SettingsViewModel

@Composable
fun NotificationSettingsScreen(navController: NavHostController, viewModel: SettingsViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth))).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Notifications", eyebrow = "REMINDERS")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            ReminderToggle("💧 Water Reminders", "Every 2 hours", uiState.waterReminders, viewModel::toggleWaterReminders)
            Spacer(Modifier.height(16.dp))
            ReminderToggle("🏃 Exercise Reminders", "Daily at set time", uiState.exerciseReminders, viewModel::toggleExerciseReminders)
            Spacer(Modifier.height(16.dp))
            ReminderToggle("🍽️ Meal Reminders", "Breakfast, Lunch, Dinner", uiState.mealReminders, viewModel::toggleMealReminders)
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun ReminderToggle(title: String, desc: String, checked: Boolean, onToggle: (Boolean) -> Unit) {
    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
        Column {
            Text(title, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
            Text(desc, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
        }
        Switch(checked, onToggle, colors = SwitchDefaults.colors(checkedThumbColor = NeonPulse, checkedTrackColor = NeonPulse.copy(alpha = 0.3f)))
    }
}

@Composable
fun SettingsProfileScreen(navController: NavHostController, viewModel: SettingsViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Settings", eyebrow = "PROFILE")
        }
        val p = uiState.profile
        if (p != null) {
            GlassCard(Modifier.fillMaxWidth()) {
                Text("PROFILE INFO", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
                Spacer(Modifier.height(16.dp))
                listOf("Name" to p.name, "Email" to p.email, "Gender" to p.gender,
                    "Age" to "${p.age}", "Height" to "${p.height} cm", "Weight" to "${p.weight} kg",
                    "Blood Group" to p.bloodGroup
                ).forEach { (label, value) ->
                    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween) {
                        Text(label, style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
                        Text(value.ifEmpty { "—" }, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                    }
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        GlassCard(Modifier.fillMaxWidth()) {
            NeonButton("Notification Settings", { navController.navigate(Routes.NOTIFICATIONS) }, fullWidth = true,
                icon = { Icon(Icons.Default.Notifications, null, tint = NeonPulse, modifier = Modifier.size(18.dp)) })
            Spacer(Modifier.height(12.dp))
            NeonButton("About", { navController.navigate(Routes.SETTINGS_ABOUT) }, fullWidth = true,
                icon = { Icon(Icons.Default.Info, null, tint = TextSecondary, modifier = Modifier.size(18.dp)) })
            Spacer(Modifier.height(12.dp))
            NeonButton("Logout", {
                viewModel.logout()
                navController.navigate(Routes.LOGIN) { popUpTo(0) { inclusive = true } }
            }, variant = ButtonVariant.DANGER, fullWidth = true,
                icon = { Icon(Icons.Default.Logout, null, tint = NeonWarn, modifier = Modifier.size(18.dp)) })
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun SettingsAboutScreen(navController: NavHostController) {
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth))).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "About", eyebrow = "APP INFO")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                HealthOrb(score = 85, size = 80)
                Spacer(Modifier.height(16.dp))
                Text("HealthGenie AI", style = MaterialTheme.typography.titleLarge, color = TextPrimary)
                Text("Version 1.0.0", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                Spacer(Modifier.height(24.dp))
                Text("Your Intelligent Health Companion", style = MaterialTheme.typography.bodyMedium, color = TextSecondary)
                Spacer(Modifier.height(24.dp))
                Text("Built with ❤️ using Kotlin, Jetpack Compose, and AI",
                    style = MaterialTheme.typography.bodySmall, color = TextSecondary)
            }
        }
        Spacer(Modifier.height(16.dp))
        GlassCard(Modifier.fillMaxWidth()) {
            Text("TECHNOLOGIES", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            listOf("Kotlin" to "100%", "Jetpack Compose" to "UI Framework", "Room" to "Local Database",
                "Hilt" to "Dependency Injection", "Ollama" to "AI Engine", "Material 3" to "Design System"
            ).forEach { (tech, desc) ->
                Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween) {
                    Text(tech, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                    Text(desc, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}
