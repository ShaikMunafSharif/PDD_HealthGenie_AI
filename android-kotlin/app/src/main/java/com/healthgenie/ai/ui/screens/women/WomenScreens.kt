package com.healthgenie.ai.ui.screens.women

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
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.WomenViewModel

@Composable
fun PeriodTrackerScreen(navController: NavHostController, viewModel: WomenViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Period Tracker", eyebrow = "CYCLE HEALTH")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            Text("FLOW INTENSITY", style = MaterialTheme.typography.labelSmall, color = NeonFem)
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Light", "Medium", "Heavy").forEach { f ->
                    SelectableChip(f, uiState.selectedFlow.equals(f, true), { viewModel.updateFlow(f.lowercase()) }, color = NeonFem)
                }
            }
            Spacer(Modifier.height(16.dp))
            Text("MOOD", style = MaterialTheme.typography.labelSmall, color = NeonFem)
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("😊 Happy", "😔 Sad", "😤 Irritable", "😴 Tired", "🥰 Relaxed").forEach { m ->
                    SelectableChip(m, uiState.selectedMood == m, { viewModel.updateMood(m) }, color = NeonFem)
                }
            }
            Spacer(Modifier.height(16.dp))
            GlassInput(uiState.periodNotes, viewModel::updateNotes, label = "Notes", placeholder = "How are you feeling?")
            Spacer(Modifier.height(16.dp))
            NeonButton("Log Today", { viewModel.logPeriod() }, variant = ButtonVariant.FEM, fullWidth = true)
        }
        Spacer(Modifier.height(16.dp))
        if (uiState.periodLogs.isNotEmpty()) {
            GlassCard(Modifier.fillMaxWidth()) {
                Text("RECENT LOGS", style = MaterialTheme.typography.labelSmall, color = NeonFem)
                Spacer(Modifier.height(12.dp))
                uiState.periodLogs.take(5).forEach { log ->
                    Row(Modifier.fillMaxWidth().padding(vertical = 4.dp), Arrangement.SpaceBetween) {
                        Text(log.date, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        Text(log.flow, style = MaterialTheme.typography.bodySmall, color = NeonFem)
                    }
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PeriodInsightsScreen(navController: NavHostController, viewModel: WomenViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Cycle Insights", eyebrow = "AI ANALYSIS")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.aiInsight.isEmpty() && !uiState.isLoading) {
                NeonButton("Get AI Insights", { viewModel.getInsights() }, variant = ButtonVariant.FEM, fullWidth = true)
            } else if (uiState.isLoading && uiState.aiInsight.isEmpty()) {
                NeuralProcessing(text = "Analyzing your cycle data...")
            } else {
                TypewriterText(uiState.aiInsight, uiState.isStreaming)
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun PCOSCareScreen(navController: NavHostController, viewModel: WomenViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "PCOS Care", eyebrow = "MANAGEMENT GUIDE")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.pcosInfo.isEmpty() && !uiState.isLoading) {
                NeonButton("Get PCOS Guide", { viewModel.getPCOSInfo() }, variant = ButtonVariant.FEM, fullWidth = true)
            } else if (uiState.isLoading && uiState.pcosInfo.isEmpty()) {
                NeuralProcessing()
            } else { TypewriterText(uiState.pcosInfo, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun SkinCareScreen(navController: NavHostController, viewModel: WomenViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Skin Care", eyebrow = "ROUTINE")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.skinInfo.isEmpty() && !uiState.isLoading) {
                NeonButton("Get Skincare Routine", { viewModel.getSkinInfo() }, variant = ButtonVariant.FEM, fullWidth = true)
            } else if (uiState.isLoading && uiState.skinInfo.isEmpty()) {
                NeuralProcessing()
            } else { TypewriterText(uiState.skinInfo, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun WomenDietScreen(navController: NavHostController, viewModel: WomenViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
        .verticalScroll(rememberScrollState()).padding(20.dp)) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Women's Diet", eyebrow = "NUTRITION PLAN")
        }
        GlassCard(Modifier.fillMaxWidth()) {
            if (uiState.dietInfo.isEmpty() && !uiState.isLoading) {
                NeonButton("Get Diet Plan", { viewModel.getDietInfo() }, variant = ButtonVariant.FEM, fullWidth = true)
            } else if (uiState.isLoading && uiState.dietInfo.isEmpty()) {
                NeuralProcessing()
            } else { TypewriterText(uiState.dietInfo, uiState.isLoading) }
        }
        Spacer(Modifier.height(80.dp))
    }
}
