package com.example.androidstockapp

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

internal val gain = Color(0xFF59E89D)
internal val loss = Color(0xFFFF8189)
internal val panelShape = RoundedCornerShape(24.dp)

private val pulseShapes = Shapes(
    extraSmall = RoundedCornerShape(12.dp),
    small = RoundedCornerShape(16.dp),
    medium = RoundedCornerShape(20.dp),
    large = panelShape,
    extraLarge = RoundedCornerShape(32.dp),
)

private val pulseColors = darkColorScheme(
    primary = Color(0xFF3AD9B5),
    onPrimary = Color(0xFF08211F),
    primaryContainer = Color(0xFF143934),
    onPrimaryContainer = Color(0xFF9DF3DE),
    secondary = Color(0xFF9ED8CE),
    onSecondary = Color(0xFF0B2B28),
    secondaryContainer = Color(0xFF1C4540),
    onSecondaryContainer = Color(0xFFC0F0E3),
    background = Color(0xFF0A1A27),
    onBackground = Color(0xFFEAF8F6),
    surface = Color(0xFF0B2530),
    onSurface = Color(0xFFEAF8F6),
    surfaceVariant = Color(0xFF15303A),
    onSurfaceVariant = Color(0xFF9EB7BA),
    outline = Color(0xFF6C898F),
    outlineVariant = Color(0xFF28434C),
)

@Composable
internal fun PulseTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = pulseColors, shapes = pulseShapes, content = content)
}

@Composable
internal fun PulseBrand(modifier: Modifier = Modifier) {
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier.size(40.dp).background(pulseGradient(), RoundedCornerShape(14.dp)),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                painterResource(R.drawable.ic_pulse),
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onPrimary,
            )
        }
        Text(
            stringResource(R.string.app_name),
            modifier = Modifier.padding(start = 10.dp),
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
        )
    }
}

@Composable
internal fun PulsePanel(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Surface(
        modifier = modifier,
        shape = panelShape,
        color = MaterialTheme.colorScheme.surface,
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
        content = content,
    )
}

@Composable
internal fun PulseButton(label: String, onClick: () -> Unit) {
    val colors = MaterialTheme.colorScheme
    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth().heightIn(min = 52.dp)
            .background(pulseGradient(), CircleShape),
        shape = CircleShape,
        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent, contentColor = colors.onPrimary),
    ) {
        Text(label, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
internal fun PageTitle(text: String, modifier: Modifier = Modifier) {
    Text(
        text,
        modifier = modifier.semantics { heading() },
        style = MaterialTheme.typography.headlineMedium,
        fontWeight = FontWeight.Bold,
    )
}

@Composable
private fun pulseGradient() =
    Brush.linearGradient(listOf(MaterialTheme.colorScheme.primary, Color(0xFF73F9BB)))
