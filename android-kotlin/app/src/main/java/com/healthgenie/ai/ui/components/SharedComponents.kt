package com.healthgenie.ai.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.healthgenie.ai.ui.theme.*
import androidx.compose.foundation.border
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.foundation.clickable


// ━━━ PROGRESS RING ━━━
@Composable
fun ProgressRing(
    value: Float,
    max: Float = 100f,
    modifier: Modifier = Modifier,
    size: Dp = 120.dp,
    strokeWidth: Dp = 8.dp,
    color: Color = NeonPulse,
    bgColor: Color = NeonPulse.copy(alpha = 0.1f),
    content: @Composable () -> Unit = {}
) {
    val animatedValue by animateFloatAsState(
        targetValue = value,
        animationSpec = tween(1500, easing = EaseOutCubic),
        label = "progressAnim"
    )

    val sweepAngle = (animatedValue / max) * 360f

    Box(modifier = modifier.size(size), contentAlignment = Alignment.Center) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val stroke = strokeWidth.toPx()
            val radius = (this.size.minDimension - stroke) / 2f
            val center = Offset(this.size.width / 2f, this.size.height / 2f)

            // Background ring
            drawCircle(color = bgColor, radius = radius, style = Stroke(width = stroke))

            // Progress arc
            drawArc(
                color = color,
                startAngle = -90f,
                sweepAngle = sweepAngle,
                useCenter = false,
                style = Stroke(width = stroke, cap = StrokeCap.Round),
                topLeft = Offset(center.x - radius, center.y - radius),
                size = androidx.compose.ui.geometry.Size(radius * 2, radius * 2)
            )
        }
        content()
    }
}

// ━━━ SHIMMER SKELETON ━━━
@Composable
fun ShimmerSkeleton(
    modifier: Modifier = Modifier,
    width: Dp = 100.dp,
    height: Dp = 20.dp,
) {
    val infiniteTransition = rememberInfiniteTransition(label = "shimmer")
    val shimmerOffset by infiniteTransition.animateFloat(
        initialValue = -1f,
        targetValue = 2f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing)
        ), label = "shimmerOffset"
    )

    Box(
        modifier = modifier
            .width(width)
            .height(height)
            .clip(RoundedCornerShape(8.dp))
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        GlassSurface,
                        NeonPulse.copy(alpha = 0.08f),
                        GlassSurface,
                    ),
                    start = Offset(shimmerOffset * 300f, 0f),
                    end = Offset(shimmerOffset * 300f + 300f, 0f),
                )
            )
    )
}

// ━━━ ANIMATED COUNTER ━━━
@Composable
fun AnimatedCounter(
    value: Int,
    modifier: Modifier = Modifier,
    color: Color = TextPrimary,
    prefix: String = "",
    suffix: String = ""
) {
    val animatedValue by animateIntAsState(
        targetValue = value,
        animationSpec = tween(800, easing = EaseOutCubic),
        label = "counter"
    )

    Text(
        text = "$prefix${animatedValue.toString().let { if (value >= 1000) String.format("%,d", animatedValue) else it }}$suffix",
        style = DataTextStyle,
        color = color,
        modifier = modifier
    )
}

// ━━━ SECTION HEADER ━━━
@Composable
fun SectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    eyebrow: String? = null,
    subtitle: String? = null,
) {
    Column(modifier = modifier.padding(bottom = 24.dp)) {
        if (eyebrow != null) {
            Text(
                text = eyebrow.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = NeonPulse,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }
        Text(
            text = title,
            style = MaterialTheme.typography.displayMedium,
            color = TextPrimary
        )
        if (subtitle != null) {
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

// ━━━ STREAK BADGE ━━━
@Composable
fun StreakBadge(count: Int, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text("🔥", style = MaterialTheme.typography.titleLarge)
        Text(
            text = "$count",
            style = DataTextStyle.copy(fontSize = MaterialTheme.typography.titleLarge.fontSize),
            color = NeonWarn
        )
        Text(
            text = "day streak",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary
        )
    }
}

// ━━━ GLASS INPUT ━━━
@Composable
fun GlassInput(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String = "",
    error: String? = null,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    isPassword: Boolean = false,
    keyboardType: androidx.compose.ui.text.input.KeyboardType = androidx.compose.ui.text.input.KeyboardType.Text,
) {
    Column(modifier = modifier.fillMaxWidth()) {
        if (label != null) {
            Text(
                text = label.uppercase(),
                style = MaterialTheme.typography.labelSmall,
                color = NeonPulse,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }
        androidx.compose.material3.OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            placeholder = {
                Text(placeholder, color = TextSecondary.copy(alpha = 0.5f))
            },
            leadingIcon = leadingIcon,
            trailingIcon = trailingIcon,
            isError = error != null,
            visualTransformation = if (isPassword) {
                androidx.compose.ui.text.input.PasswordVisualTransformation()
            } else {
                androidx.compose.ui.text.input.VisualTransformation.None
            },
            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = keyboardType),
            colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                unfocusedContainerColor = GlassSurfaceLight,
                focusedContainerColor = GlassSurface,
                unfocusedBorderColor = GlassBorder,
                focusedBorderColor = NeonPulse.copy(alpha = 0.5f),
                errorBorderColor = NeonWarn,
                cursorColor = NeonPulse,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary,
            ),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
        )
        if (error != null) {
            Text(
                text = error,
                style = MaterialTheme.typography.bodySmall,
                color = NeonWarn,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

// ━━━ CHIP ━━━
@Composable
fun SelectableChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    color: Color = NeonPulse,
) {
    val bg = if (selected) color.copy(alpha = 0.2f) else GlassSurfaceLight
    val borderCol = if (selected) color.copy(alpha = 0.5f) else GlassBorder

    Text(
        text = label,
        style = MaterialTheme.typography.bodySmall,
        color = if (selected) color else TextSecondary,
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(bg, RoundedCornerShape(20.dp))
            .border(1.dp, borderCol, RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp)
    )
}

// ━━━ TYPEWRITER TEXT ━━━
@Composable
fun TypewriterText(
    text: String,
    isStreaming: Boolean = false,
    modifier: Modifier = Modifier,
    color: Color = TextPrimary
) {
    val infiniteTransition = rememberInfiniteTransition(label = "cursor")
    val cursorAlpha by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(500),
            repeatMode = RepeatMode.Reverse
        ), label = "cursorBlink"
    )

    Text(
        text = if (isStreaming) "$text▊" else text,
        style = MaterialTheme.typography.bodyLarge.copy(
            color = color,
            lineHeight = MaterialTheme.typography.bodyLarge.lineHeight * 1.1f
        ),
        modifier = modifier
    )
}

// ━━━ NEURAL PROCESSING ANIMATION ━━━
@Composable
fun NeuralProcessing(
    text: String = "HealthGenie is analyzing...",
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "neural")

    Column(
        modifier = modifier.fillMaxWidth().padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(modifier = Modifier.size(80.dp), contentAlignment = Alignment.Center) {
            repeat(3) { i ->
                val rotation by infiniteTransition.animateFloat(
                    initialValue = 0f,
                    targetValue = 360f,
                    animationSpec = infiniteRepeatable(
                        animation = tween((3000 + i * 1000), easing = LinearEasing)
                    ), label = "ring$i"
                )
                val scale by infiniteTransition.animateFloat(
                    initialValue = 1f,
                    targetValue = 1.1f,
                    animationSpec = infiniteRepeatable(
                        animation = tween(2000, delayMillis = i * 300),
                        repeatMode = RepeatMode.Reverse
                    ), label = "scale$i"
                )
                Canvas(
                    modifier = Modifier
                        .fillMaxSize()
                        .graphicsLayer {
                            rotationZ = rotation
                            scaleX = scale
                            scaleY = scale
                        }
                ) {
                    drawCircle(
                        color = NeonPulse.copy(alpha = 0.3f - i * 0.08f),
                        style = Stroke(width = 2f)
                    )
                }
            }
            // Center dots
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                repeat(3) { i ->
                    val dotScale by infiniteTransition.animateFloat(
                        initialValue = 1f,
                        targetValue = 1.4f,
                        animationSpec = infiniteRepeatable(
                            animation = tween(800, delayMillis = i * 200),
                            repeatMode = RepeatMode.Reverse
                        ), label = "dot$i"
                    )
                    Canvas(
                        modifier = Modifier
                            .size(8.dp)
                            .graphicsLayer { scaleX = dotScale; scaleY = dotScale }
                    ) {
                        drawCircle(color = NeonPulse)
                    }
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        val textAlpha by infiniteTransition.animateFloat(
            initialValue = 0.5f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(2000),
                repeatMode = RepeatMode.Reverse
            ), label = "textPulse"
        )
        Text(
            text = text,
            style = MaterialTheme.typography.titleMedium,
            color = NeonPulse.copy(alpha = textAlpha)
        )
    }
}
