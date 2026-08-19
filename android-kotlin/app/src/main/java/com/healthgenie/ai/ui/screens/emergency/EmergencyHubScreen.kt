package com.healthgenie.ai.ui.screens.emergency

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
fun EmergencyHubScreen(navController: NavHostController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
            .padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
            }
            SectionHeader(title = "Emergency", eyebrow = "SAFETY CENTER")
        }

        // SOS Button
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            onClick = { navController.navigate(Routes.EMERGENCY_SOS) },
            borderColor = NeonDanger.copy(alpha = 0.5f),
            backgroundColor = NeonDanger.copy(alpha = 0.1f)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("🆘 Emergency SOS", style = MaterialTheme.typography.titleLarge, color = NeonDanger)
                    Text("Send alert to emergency contacts", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                }
                Icon(Icons.Default.ChevronRight, null, tint = NeonDanger)
            }
        }

        Spacer(Modifier.height(16.dp))

        val items = listOf(
            Triple("Emergency Dashboard", Icons.Default.Dashboard, Routes.EMERGENCY_DASHBOARD),
            Triple("Nearby Hospitals", Icons.Default.LocalHospital, Routes.EMERGENCY_HOSPITALS),
            Triple("Emergency Contacts", Icons.Default.Contacts, Routes.EMERGENCY_CONTACTS),
            Triple("First Aid Guide", Icons.Default.MedicalServices, Routes.FIRST_AID),
        )

        items.forEach { (title, icon, route) ->
            GlassCard(
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                onClick = { navController.navigate(route) }
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(icon, null, tint = NeonWarn, modifier = Modifier.size(24.dp))
                        Spacer(Modifier.width(16.dp))
                        Text(title, style = MaterialTheme.typography.titleMedium, color = TextPrimary)
                    }
                    Icon(Icons.Default.ChevronRight, null, tint = TextSecondary)
                }
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
fun EmergencyDashboardScreen(navController: NavHostController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
            .padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
            }
            SectionHeader(title = "Emergency Dashboard", eyebrow = "QUICK ACCESS")
        }

        // Emergency numbers
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("EMERGENCY NUMBERS", style = MaterialTheme.typography.labelSmall, color = NeonDanger)
            Spacer(Modifier.height(12.dp))
            val numbers = listOf(
                "112" to "Universal Emergency",
                "108" to "Ambulance",
                "100" to "Police",
                "101" to "Fire Department",
                "1098" to "Child Helpline",
                "181" to "Women Helpline"
            )
            numbers.forEach { (num, label) ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(label, style = MaterialTheme.typography.bodyMedium, color = TextPrimary)
                    Text(num, style = DataTextStyle, color = NeonDanger)
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        // Quick actions
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            NeonButton(
                text = "🆘 SOS",
                onClick = { navController.navigate(Routes.EMERGENCY_SOS) },
                variant = ButtonVariant.DANGER,
                modifier = Modifier.weight(1f),
                fullWidth = true
            )
            NeonButton(
                text = "🏥 Hospitals",
                onClick = { navController.navigate(Routes.EMERGENCY_HOSPITALS) },
                modifier = Modifier.weight(1f),
                fullWidth = true
            )
        }

        Spacer(Modifier.height(80.dp))
    }
}
