package com.healthgenie.ai.ui.screens.water

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.healthgenie.ai.ui.components.*
import com.healthgenie.ai.ui.theme.*
import com.healthgenie.ai.ui.viewmodels.WaterViewModel
import kotlin.math.sin

@Composable
fun WaterTrackerScreen(
    navController: NavHostController,
    viewModel: WaterViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val progress = (uiState.todayMl.toFloat() / uiState.goalMl).coerceIn(0f, 1f)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(listOf(BgVoid, BgDepth)))
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        Spacer(Modifier.height(16.dp))

        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, "Back", tint = TextPrimary)
            }
            SectionHeader(title = "Water Tracker", eyebrow = "HYDRATION")
        }

        // Water bottle visual
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text("TODAY'S INTAKE", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.Bottom) {
                        AnimatedCounter(value = uiState.todayMl, color = NeonPulse)
                        Text(
                            " / ${uiState.goalMl} ml",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = "${(progress * 100).toInt()}% of daily goal",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (progress >= 1f) NeonHealth else TextSecondary
                    )
                }

                // Animated bottle
                WaterBottle(progress = progress, modifier = Modifier.size(80.dp, 140.dp))
            }
        }

        Spacer(Modifier.height(20.dp))

        // Quick add buttons
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("QUICK ADD", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(150 to "🥤", 250 to "🥛", 500 to "🍶", 750 to "🫗").forEach { (ml, emoji) ->
                    NeonButton(
                        text = "$emoji ${ml}ml",
                        onClick = { viewModel.addWater(ml) },
                        modifier = Modifier.weight(1f),
                        fullWidth = true,
                        variant = ButtonVariant.PRIMARY
                    )
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // Progress ring
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("DAILY PROGRESS", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(16.dp))
            Box(
                modifier = Modifier.fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                ProgressRing(
                    value = uiState.todayMl.toFloat(),
                    max = uiState.goalMl.toFloat(),
                    size = 140.dp,
                    color = NeonPulse
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "${(progress * 100).toInt()}%",
                            style = DataTextStyle.copy(fontSize = 24.sp),
                            color = NeonPulse
                        )
                        Text("hydrated", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                    }
                }
            }
        }

        Spacer(Modifier.height(20.dp))

        // Hydration tips
        GlassCard(modifier = Modifier.fillMaxWidth()) {
            Text("💡 HYDRATION TIPS", style = MaterialTheme.typography.labelSmall, color = NeonPulse)
            Spacer(Modifier.height(12.dp))
            val tips = listOf(
                "Drink a glass of water first thing in the morning",
                "Keep a water bottle at your desk",
                "Set reminders every 2 hours",
                "Eat water-rich fruits like watermelon & cucumber",
                "Drink before, during, and after exercise"
            )
            tips.forEach { tip ->
                Text(
                    "• $tip",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }
        }

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun WaterBottle(progress: Float, modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "wave")
    val waveOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing)
        ), label = "waveAnim"
    )

    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        animationSpec = tween(1500, easing = EaseOutCubic),
        label = "fillAnim"
    )

    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height
        val bottleRadius = 12f

        // Bottle outline
        drawRoundRect(
            color = NeonPulse.copy(alpha = 0.2f),
            cornerRadius = CornerRadius(bottleRadius, bottleRadius),
            size = size,
            style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2f)
        )

        // Water fill
        val fillHeight = h * animatedProgress
        val fillTop = h - fillHeight

        if (animatedProgress > 0f) {
            val wavePath = Path().apply {
                moveTo(0f, fillTop)
                val waveHeight = 4f
                for (x in 0..w.toInt() step 2) {
                    val y = fillTop + waveHeight * sin(Math.toRadians((x * 3 + waveOffset).toDouble())).toFloat()
                    lineTo(x.toFloat(), y)
                }
                lineTo(w, h)
                lineTo(0f, h)
                close()
            }

            drawPath(
                path = wavePath,
                brush = Brush.verticalGradient(
                    colors = listOf(
                        NeonPulse.copy(alpha = 0.5f),
                        NeonPulse.copy(alpha = 0.2f)
                    ),
                    startY = fillTop,
                    endY = h
                )
            )
        }
    }
}
