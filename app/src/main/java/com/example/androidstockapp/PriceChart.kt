package com.example.androidstockapp

import androidx.annotation.StringRes
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Box
import kotlin.math.abs

internal enum class ChartStyle(@param:StringRes val label: Int) {
    Area(R.string.chart_area), Line(R.string.chart_line), Candle(R.string.chart_candle),
}

@Composable
internal fun PriceChart(quote: DemoQuote, range: ChartRange, style: ChartStyle, modifier: Modifier) {
    val series = remember(quote, range) { chartSeries(quote, range) }
    val colors = MaterialTheme.colorScheme
    val description = stringResource(
        R.string.chart_summary,
        quote.symbol,
        range.label,
        stringResource(style.label),
        formatPrice(series.first().close.toDouble()),
        formatPrice(series.last().close.toDouble()),
    )
    Box(modifier.semantics { contentDescription = description }.drawWithCache {
        val low = series.minOf { it.low }
        val span = (series.maxOf { it.high } - low).coerceAtLeast(1f)
        val gutter = 4.dp.toPx()
        val step = (size.width - 2 * gutter).coerceAtLeast(1f) / (series.size - 1)
        fun x(index: Int) = gutter + index * step
        fun y(price: Float) = gutter + (1f - (price - low) / span) * (size.height - 2 * gutter)
        val stroke = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
        val line = Path().apply {
            moveTo(x(0), y(series.first().close))
            for (index in 1 until series.size) lineTo(x(index), y(series[index].close))
        }
        val area = Path().apply {
            addPath(line)
            lineTo(x(series.lastIndex), size.height)
            lineTo(x(0), size.height)
            close()
        }
        val fill = Brush.verticalGradient(listOf(colors.primary.copy(alpha = 0.33f), colors.primary.copy(alpha = 0.02f)))
        onDrawBehind {
            repeat(3) { index ->
                val gridY = (index + 1) * size.height / 4
                drawLine(colors.outlineVariant, Offset(0f, gridY), Offset(size.width, gridY))
            }
            if (style == ChartStyle.Candle) {
                val bodyWidth = (step * 0.62f).coerceAtLeast(1f)
                series.forEachIndexed { index, candle ->
                    val color = if (candle.close >= candle.open) gain else loss
                    val openY = y(candle.open)
                    val closeY = y(candle.close)
                    drawLine(color, Offset(x(index), y(candle.high)), Offset(x(index), y(candle.low)))
                    drawRect(
                        color,
                        Offset(x(index) - bodyWidth / 2, minOf(openY, closeY)),
                        Size(bodyWidth, abs(openY - closeY).coerceAtLeast(1f)),
                    )
                }
            } else {
                if (style == ChartStyle.Area) drawPath(area, fill)
                drawPath(line, colors.primary, style = stroke)
            }
        }
    })
}
