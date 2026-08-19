package com.healthgenie.ai.ui.screens.pregnancy

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
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.PregnancyViewModel

@Composable
fun PregnancyDashboardScreen(navController: NavHostController, viewModel: PregnancyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Pregnancy", eyebrow = "MATERNITY CARE")
        }
        // Week progress
        GlassCard(Modifier.fillMaxWidth(), borderColor = NeonPreg.copy(alpha = 0.3f)) {
            Text("CURRENT WEEK", style = MaterialTheme.typography.labelSmall, color = NeonPreg)
            Spacer(Modifier.height(12.dp))
            Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                Column {
                    Text("Week ${uiState.currentWeek}", style = DataTextStyle.copy(fontSize = 28.sp), color = NeonPreg)
                    Text("of 40 weeks", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
                ProgressRing(uiState.currentWeek.toFloat(), 40f, size = 80.dp, strokeWidth = 6.dp, color = NeonPreg) {
                    Text("${(uiState.currentWeek * 100 / 40)}%", style = MaterialTheme.typography.bodySmall, color = NeonPreg)
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        val items = listOf(
            Triple("Trimester Info", "Development & changes", Routes.PREGNANCY_TRIMESTER),
            Triple("Weekly Tips", "Week-by-week guide", Routes.PREGNANCY_WEEKLY_TIPS),
            Triple("Pregnancy Diet", "Safe nutrition", Routes.PREGNANCY_DIET),
            Triple("Safe Exercises", "Stay active safely", Routes.PREGNANCY_EXERCISE),
            Triple("Doctor Visits", "Appointment tracker", Routes.PREGNANCY_DOCTOR_VISITS),
        )
        items.forEach { (title, desc, route) ->
            GlassCard(Modifier.fillMaxWidth().padding(bottom = 12.dp),
                onClick = { navController.navigate(route) }, borderColor = NeonPreg.copy(alpha = 0.2f)) {
                Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                    Column { Text(title, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Text(desc, style = MaterialTheme.typography.bodySmall, color = TextSecondary) }
                    Icon(Icons.Default.ChevronRight, null, tint = NeonPreg)
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PregnancyTrimesterScreen(navController: NavHostController, viewModel: PregnancyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Trimester Info", eyebrow = "WEEK ${uiState.currentWeek}")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.trimesterInfo.isEmpty() && !uiState.isLoading) {
                NeonButton("Get Trimester Info", { viewModel.getTrimesterInfo() }, variant = ButtonVariant.PREG, fullWidth = true)
            } else if (uiState.isLoading && uiState.trimesterInfo.isEmpty()) { NeuralProcessing()
            } else { TypewriterText(uiState.trimesterInfo, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PregnancyWeeklyTipsScreen(navController: NavHostController, viewModel: PregnancyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Weekly Tips", eyebrow = "WEEK ${uiState.currentWeek}")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.weeklyTips.isEmpty() && !uiState.isLoading) {
                NeonButton("Get This Week's Tips", { viewModel.getWeeklyTips() }, variant = ButtonVariant.PREG, fullWidth = true)
            } else if (uiState.isLoading && uiState.weeklyTips.isEmpty()) { NeuralProcessing()
            } else { TypewriterText(uiState.weeklyTips, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PregnancyDietScreen(navController: NavHostController, viewModel: PregnancyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Pregnancy Diet", eyebrow = "SAFE NUTRITION")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.dietInfo.isEmpty() && !uiState.isLoading) {
                NeonButton("Get Diet Plan", { viewModel.getDietInfo() }, variant = ButtonVariant.PREG, fullWidth = true)
            } else if (uiState.isLoading && uiState.dietInfo.isEmpty()) { NeuralProcessing()
            } else { TypewriterText(uiState.dietInfo, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PregnancyExerciseScreen(navController: NavHostController, viewModel: PregnancyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Safe Exercises", eyebrow = "PREGNANCY FITNESS")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.exerciseInfo.isEmpty() && !uiState.isLoading) {
                NeonButton("Get Exercise Guide", { viewModel.getExerciseInfo() }, variant = ButtonVariant.PREG, fullWidth = true)
            } else if (uiState.isLoading && uiState.exerciseInfo.isEmpty()) { NeuralProcessing()
            } else { TypewriterText(uiState.exerciseInfo, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PregnancyDoctorVisitsScreen(navController: NavHostController, viewModel: PregnancyViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Doctor Visits", eyebrow = "APPOINTMENTS")
        }
        if (uiState.appointments.isEmpty()) {
            GlassCard(Modifier.fillMaxWidth()) {
                Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("📅", style = MaterialTheme.typography.displayLarge)
                    Spacer(Modifier.height(16.dp))
                    Text("No appointments yet", style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                }
            }
        } else {
            uiState.appointments.forEach { apt ->
                GlassCard(Modifier.fillMaxWidth().padding(bottom = 12.dp)) {
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                        Column {
                            Text(apt.title, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                            Text("${apt.doctorName} • ${apt.date}", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        }
                        Checkbox(apt.completed, { viewModel.toggleComplete(apt) },
                            colors = CheckboxDefaults.colors(checkedColor = NeonPreg))
                    }
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}
