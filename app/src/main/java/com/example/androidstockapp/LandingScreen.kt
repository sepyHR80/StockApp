package com.example.androidstockapp

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
internal fun LandingScreen(onGetStarted: () -> Unit) {
    val colors = MaterialTheme.colorScheme
    Column(
        Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp, vertical = 24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        PulseBrand()
        Column(Modifier.padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Column(Modifier.semantics(mergeDescendants = true) { heading() }) {
                val titleStyle = MaterialTheme.typography.displaySmall.copy(fontWeight = FontWeight.Bold)
                Text(stringResource(R.string.hero_title), style = titleStyle)
                Text(stringResource(R.string.hero_accent), style = titleStyle, color = colors.primary)
            }
            Text(
                stringResource(R.string.hero_description),
                style = MaterialTheme.typography.bodyLarge,
                color = colors.onSurfaceVariant,
            )
        }
        PulsePanel(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(nasdaq.name, color = colors.onSurfaceVariant, style = MaterialTheme.typography.bodySmall)
                        Text(
                            formatPrice(nasdaq.price),
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    QuoteChange(nasdaq)
                }
                PriceChart(nasdaq, ChartRange.Year, ChartStyle.Area, Modifier.fillMaxWidth().height(152.dp))
            }
        }
        FlowRow(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            for ((label, icon) in landingFeatures) {
                PulsePanel(Modifier.weight(1f)) {
                    Column(
                        Modifier.fillMaxWidth().padding(horizontal = 6.dp, vertical = 10.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Icon(painterResource(icon), contentDescription = null, Modifier.size(22.dp), tint = colors.primary)
                        Text(stringResource(label), style = MaterialTheme.typography.labelMedium)
                    }
                }
            }
        }
        Column(
            Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            PulseButton(stringResource(R.string.get_started), onGetStarted)
            Text(
                stringResource(R.string.demo_prices),
                color = colors.onSurfaceVariant,
                style = MaterialTheme.typography.bodySmall,
            )
        }
    }
}

private val landingFeatures = listOf(
    R.string.charts to R.drawable.ic_chart,
    R.string.portfolio to R.drawable.ic_portfolio,
    R.string.alerts to R.drawable.ic_bell,
)
