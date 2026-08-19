package com.healthgenie.ai.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val HealthGenieDarkColorScheme = darkColorScheme(
    primary = NeonPulse,
    onPrimary = BgVoid,
    primaryContainer = NeonPulseAlpha20,
    onPrimaryContainer = NeonPulse,
    secondary = NeonHealth,
    onSecondary = BgVoid,
    secondaryContainer = NeonHealthAlpha20,
    onSecondaryContainer = NeonHealth,
    tertiary = NeonFem,
    onTertiary = BgVoid,
    tertiaryContainer = NeonFemAlpha20,
    onTertiaryContainer = NeonFem,
    error = NeonWarn,
    onError = BgVoid,
    errorContainer = NeonWarnAlpha20,
    onErrorContainer = NeonWarn,
    background = BgVoid,
    onBackground = TextPrimary,
    surface = BgDepth,
    onSurface = TextPrimary,
    surfaceVariant = GlassSurface,
    onSurfaceVariant = TextSecondary,
    outline = GlassBorder,
    outlineVariant = GlassBorder,
    inverseSurface = TextPrimary,
    inverseOnSurface = BgVoid,
    inversePrimary = NeonPulse,
    surfaceTint = NeonPulse,
)

@Composable
fun HealthGenieTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = HealthGenieDarkColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = BgVoid.toArgb()
            window.navigationBarColor = BgVoid.toArgb()
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = false
                isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = HealthGenieTypography,
        content = content
    )
}
