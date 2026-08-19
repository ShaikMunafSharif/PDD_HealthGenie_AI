package com.healthgenie.ai.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.healthgenie.ai.ui.theme.*
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun HealthOrb(
    score: Int,
    modifier: Modifier = Modifier,
    size: Int = 140
) {
    val scoreColor = when {
        score >= 80 -> NeonHealth
        score >= 50 -> NeonPulse
        else -> NeonFem
    }

    val infiniteTransition = rememberInfiniteTransition(label = "orb")

    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = EaseInOutCubic),
            repeatMode = RepeatMode.Reverse
        ), label = "pulse"
    )

    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = 0.7f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = EaseInOutCubic),
            repeatMode = RepeatMode.Reverse
        ), label = "glow"
    )

    val ring1Rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(6000, easing = LinearEasing)
        ), label = "ring1"
    )

    val ring2Rotation by infiniteTransition.animateFloat(
        initialValue = 360f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(9000, easing = LinearEasing)
        ), label = "ring2"
    )

    Box(
        modifier = modifier.size(size.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(this.size.width / 2f, this.size.height / 2f)
            val orbRadius = this.size.minDimension / 4f

            // Outer glow rings
            drawOrbitRing(center, orbRadius * 2.2f, ring1Rotation, scoreColor.copy(alpha = 0.12f))
            drawOrbitRing(center, orbRadius * 1.8f, ring2Rotation, scoreColor.copy(alpha = 0.08f))

            // Glow aura
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        scoreColor.copy(alpha = glowAlpha * 0.4f),
                        scoreColor.copy(alpha = glowAlpha * 0.15f),
                        Color.Transparent
                    ),
                    center = center,
                    radius = orbRadius * pulseScale * 2.5f
                ),
                center = center,
                radius = orbRadius * pulseScale * 2.5f
            )

            // Main orb
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        scoreColor,
                        scoreColor.copy(alpha = 0.6f),
                        scoreColor.copy(alpha = 0.3f)
                    ),
                    center = Offset(center.x - orbRadius * 0.3f, center.y - orbRadius * 0.3f),
                    radius = orbRadius * pulseScale
                ),
                center = center,
                radius = orbRadius * pulseScale
            )

            // Inner highlight
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color.White.copy(alpha = 0.35f),
                        Color.Transparent
                    ),
                    center = Offset(center.x - orbRadius * 0.25f, center.y - orbRadius * 0.25f),
                    radius = orbRadius * 0.5f
                ),
                center = Offset(center.x - orbRadius * 0.15f, center.y - orbRadius * 0.15f),
                radius = orbRadius * 0.4f
            )
        }
    }
}

private fun DrawScope.drawOrbitRing(
    center: Offset,
    radius: Float,
    rotation: Float,
    color: Color
) {
    drawCircle(
        color = color,
        center = center,
        radius = radius,
        style = Stroke(width = 1.5f)
    )
    // Small orbiting dot
    val radians = Math.toRadians(rotation.toDouble())
    val dotX = center.x + radius * cos(radians).toFloat()
    val dotY = center.y + radius * sin(radians).toFloat()
    drawCircle(
        color = color.copy(alpha = color.alpha * 3f),
        center = Offset(dotX, dotY),
        radius = 3f
    )
}
