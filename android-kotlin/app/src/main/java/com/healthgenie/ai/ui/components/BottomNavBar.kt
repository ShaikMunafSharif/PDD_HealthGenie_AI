package com.healthgenie.ai.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.healthgenie.ai.ui.theme.*

data class BottomNavItem(
    val route: String,
    val icon: ImageVector,
    val label: String
)

val bottomNavItems = listOf(
    BottomNavItem("dashboard", Icons.Default.Dashboard, "Home"),
    BottomNavItem("health-score", Icons.Default.MonitorHeart, "Health"),
    BottomNavItem("symptoms/select", Icons.Default.LocalHospital, "Symptoms"),
    BottomNavItem("women/dashboard", Icons.Default.Favorite, "Women"),
    BottomNavItem("settings/profile", Icons.Default.Settings, "More"),
)

@Composable
fun BottomNavBar(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
    showWomenTab: Boolean = true
) {
    val items = if (showWomenTab) bottomNavItems else bottomNavItems.filterNot { it.route == "women/dashboard" }

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = BgDepth.copy(alpha = 0.95f),
        tonalElevation = 0.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(72.dp)
                .border(
                    width = 1.dp,
                    color = GlassBorder,
                    shape = RoundedCornerShape(topStart = 0.dp, topEnd = 0.dp)
                )
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEach { item ->
                val isActive = currentRoute.startsWith(item.route.split("/").first())

                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { onNavigate(item.route) }
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(contentAlignment = Alignment.TopCenter) {
                        if (isActive) {
                            Box(
                                modifier = Modifier
                                    .width(24.dp)
                                    .height(3.dp)
                                    .offset(y = (-8).dp)
                                    .clip(RoundedCornerShape(2.dp))
                                    .background(NeonPulse)
                            )
                        }
                        Icon(
                            imageVector = item.icon,
                            contentDescription = item.label,
                            tint = if (isActive) NeonPulse else TextSecondary,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Text(
                        text = item.label,
                        fontSize = 10.sp,
                        color = if (isActive) NeonPulse else TextSecondary,
                        fontWeight = if (isActive) androidx.compose.ui.text.font.FontWeight.SemiBold
                            else androidx.compose.ui.text.font.FontWeight.Normal
                    )
                }
            }
        }
    }
}
