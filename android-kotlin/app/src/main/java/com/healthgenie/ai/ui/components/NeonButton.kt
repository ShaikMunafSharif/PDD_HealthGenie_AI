package com.healthgenie.ai.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.healthgenie.ai.ui.theme.*

enum class ButtonVariant {
    DEFAULT, PRIMARY, DANGER, FEM, PREG
}

@Composable
fun NeonButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.DEFAULT,
    enabled: Boolean = true,
    fullWidth: Boolean = false,
    icon: @Composable (() -> Unit)? = null
) {
    val (bgColor, borderColor) = when (variant) {
        ButtonVariant.PRIMARY -> Pair(
            Brush.linearGradient(listOf(NeonPulse.copy(alpha = 0.2f), NeonHealth.copy(alpha = 0.15f))),
            NeonPulse.copy(alpha = 0.4f)
        )
        ButtonVariant.DANGER -> Pair(
            Brush.linearGradient(listOf(NeonWarn.copy(alpha = 0.2f), NeonDanger.copy(alpha = 0.15f))),
            NeonWarn.copy(alpha = 0.4f)
        )
        ButtonVariant.FEM -> Pair(
            Brush.linearGradient(listOf(NeonFem.copy(alpha = 0.2f), NeonFem.copy(alpha = 0.1f))),
            NeonFem.copy(alpha = 0.4f)
        )
        ButtonVariant.PREG -> Pair(
            Brush.linearGradient(listOf(NeonPreg.copy(alpha = 0.2f), NeonPreg.copy(alpha = 0.1f))),
            NeonPreg.copy(alpha = 0.4f)
        )
        else -> Pair(
            Brush.linearGradient(listOf(GlassSurfaceLight, GlassSurface)),
            GlassBorder
        )
    }

    val textColor = when (variant) {
        ButtonVariant.PRIMARY -> NeonPulse
        ButtonVariant.DANGER -> NeonWarn
        ButtonVariant.FEM -> NeonFem
        ButtonVariant.PREG -> NeonPreg
        else -> TextPrimary
    }

    val shape = RoundedCornerShape(14.dp)

    Row(
        modifier = modifier
            .then(if (fullWidth) Modifier.fillMaxWidth() else Modifier)
            .clip(shape)
            .background(bgColor, shape)
            .border(1.dp, borderColor, shape)
            .clickable(
                enabled = enabled,
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onClick
            )
            .padding(horizontal = 20.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        icon?.invoke()
        if (icon != null) Spacer(Modifier.width(8.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge,
            color = if (enabled) textColor else textColor.copy(alpha = 0.5f)
        )
    }
}
