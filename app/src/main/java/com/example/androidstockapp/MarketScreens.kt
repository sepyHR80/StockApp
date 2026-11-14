package com.example.androidstockapp

import androidx.annotation.StringRes
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
internal fun MarketList(
    @StringRes title: Int,
    quotes: List<DemoQuote>,
    onQuote: (String) -> Unit,
    query: String = "",
    onQuery: ((String) -> Unit)? = null,
    watchlist: List<String> = emptyList(),
    onWatch: ((String) -> Unit)? = null,
    bottomPadding: Dp,
) {
    val visibleQuotes = remember(quotes, query) {
        val term = query.trim()
        if (term.isEmpty()) quotes else quotes.filter {
            it.symbol.contains(term, ignoreCase = true) || it.name.contains(term, ignoreCase = true)
        }
    }
    LazyColumn(
        Modifier.fillMaxWidth().padding(horizontal = 14.dp),
        contentPadding = PaddingValues(bottom = bottomPadding),
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        item {
            Column(Modifier.padding(top = 16.dp, bottom = 8.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                PageTitle(stringResource(title))
                if (title == R.string.dashboard) {
                    Text(stringResource(R.string.market_overview), color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                if (onQuery != null) {
                    OutlinedTextField(
                        value = query,
                        onValueChange = onQuery,
                        label = { Text(stringResource(R.string.search_stocks)) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = MaterialTheme.shapes.medium,
                    )
                }
                if (visibleQuotes.isEmpty()) {
                    val message = if (title == R.string.watchlists) R.string.watch_empty else R.string.no_quotes
                    Text(stringResource(message), color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
        items(visibleQuotes, key = { it.symbol }) { quote ->
            val colors = MaterialTheme.colorScheme
            Surface(
                onClick = { onQuote(quote.symbol) },
                color = colors.surface,
                shape = MaterialTheme.shapes.small,
                border = BorderStroke(1.dp, colors.outlineVariant),
            ) {
                Row(
                    Modifier.fillMaxWidth().heightIn(min = 54.dp).padding(horizontal = 12.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(Modifier.weight(1f)) {
                        Text(quote.symbol, fontWeight = FontWeight.SemiBold)
                        Text(quote.name, color = colors.onSurfaceVariant, style = MaterialTheme.typography.bodySmall)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text(formatPrice(quote.price), fontWeight = FontWeight.Medium)
                        QuoteChange(quote)
                    }
                    if (onWatch != null) {
                        val watching = quote.symbol in watchlist
                        IconButton(onClick = { onWatch(quote.symbol) }) {
                            Icon(
                                painterResource(if (watching) R.drawable.ic_check else R.drawable.ic_plus),
                                stringResource(if (watching) R.string.unwatch_stock else R.string.watch_stock, quote.symbol),
                                tint = colors.primary,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
internal fun QuoteChange(quote: DemoQuote) {
    Text(
        formatChange(quote.changePercent),
        color = if (quote.changePercent >= 0) gain else loss,
        style = MaterialTheme.typography.labelLarge,
        fontWeight = FontWeight.SemiBold,
    )
}

@Composable
internal fun StockScreen(quote: DemoQuote, watching: Boolean, onBack: () -> Unit, onWatch: () -> Unit) {
    var range by rememberSaveable(quote.symbol) { mutableStateOf(ChartRange.Day) }
    var style by rememberSaveable(quote.symbol) { mutableStateOf(ChartStyle.Area) }
    Column(
        Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = 14.dp, vertical = 10.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        BackButton(onBack)
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(Modifier.weight(1f)) {
                PageTitle(quote.symbol)
                Text(quote.name, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            OutlinedButton(onClick = onWatch, shape = MaterialTheme.shapes.medium) {
                Text(stringResource(if (watching) R.string.watching else R.string.watch))
            }
        }
        Text(formatPrice(quote.price), style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        QuoteChange(quote)
        PulsePanel(Modifier.fillMaxWidth()) {
            PriceChart(quote, range, style, Modifier.padding(12.dp).fillMaxWidth().height(232.dp))
        }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            for (option in ChartRange.entries) {
                FilterChip(
                    selected = range == option,
                    onClick = { range = option },
                    label = { Text(option.label) },
                )
            }
        }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            for (option in ChartStyle.entries) {
                FilterChip(
                    selected = style == option,
                    onClick = { style = option },
                    label = { Text(stringResource(option.label)) },
                )
            }
        }
        Text(stringResource(R.string.stock_about, quote.name), color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
internal fun MoreScreen(onSelect: (Boolean) -> Unit) {
    Column(Modifier.fillMaxWidth().padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        PageTitle(stringResource(R.string.more))
        OutlinedButton(onClick = { onSelect(true) }, Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.medium) {
            Text(stringResource(R.string.alerts))
        }
        OutlinedButton(onClick = { onSelect(false) }, Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.medium) {
            Text(stringResource(R.string.settings))
        }
    }
}

@Composable
internal fun PlaceholderScreen(@StringRes title: Int, onBack: (() -> Unit)?) {
    Column(Modifier.fillMaxWidth().padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        if (onBack != null) BackButton(onBack)
        PageTitle(stringResource(title))
        Text(stringResource(R.string.coming_soon), color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun BackButton(onBack: () -> Unit) {
    IconButton(onClick = onBack) {
        Icon(painterResource(R.drawable.ic_back), contentDescription = stringResource(R.string.back))
    }
}
