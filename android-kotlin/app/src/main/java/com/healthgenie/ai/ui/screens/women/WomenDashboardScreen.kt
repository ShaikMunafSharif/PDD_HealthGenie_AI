package com.healthgenie.ai.ui.screens.women

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.healthgenie.ai.navigation.Routes
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*

@Composable
fun WomenDashboardScreen(navController: NavHostController) {
    Column(
        modifier = Modifier.fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth))).padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) { Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary) }
            SectionHeader(title = "Women's Health", eyebrow = "WELLNESS")
        }

        val items = listOf(
            Triple("Period Tracker", "Track & predict cycles", Routes.PERIOD_TRACKER),
            Triple("Cycle Insights", "AI-powered analysis", Routes.PERIOD_INSIGHTS),
            Triple("PCOS Care", "Management guide", Routes.PCOS_CARE),
            Triple("Skin Care", "Personalized routine", Routes.SKIN_CARE),
            Triple("Women's Diet", "Nutrition plan", Routes.WOMEN_DIET),
        )
        items.forEach { (title, desc, route) ->
            GlassCard(Modifier.fillMaxWidth().padding(bottom = 12.dp),
                onClick = { navController.navigate(route) }, borderColor = NeonFem.copy(alpha = 0.3f)) {
                Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween, Alignment.CenterVertically) {
                    Column {
                        Text(title, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                        Text(desc, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = NeonFem)
                }
            }
        }
        Spacer(Modifier.height(80.dp))
    }
}
