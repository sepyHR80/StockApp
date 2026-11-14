package com.example.androidstockapp

import android.graphics.Color as AndroidColor
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(AndroidColor.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.dark(AndroidColor.TRANSPARENT),
        )
        setContent { PulseTheme { PulseApp() } }
    }
}

private enum class Screen(val title: Int, val icon: Int = 0) {
    Landing(R.string.app_name),
    Account(R.string.sign_in),
    Dashboard(R.string.dashboard, R.drawable.ic_dashboard),
    Markets(R.string.markets, R.drawable.ic_chart),
    Watchlists(R.string.watchlists, R.drawable.ic_watchlist),
    Portfolio(R.string.portfolio, R.drawable.ic_portfolio),
    More(R.string.more, R.drawable.ic_more),
    Alerts(R.string.alerts),
    Settings(R.string.settings),
}

private val tabs = listOf(Screen.Dashboard, Screen.Markets, Screen.Watchlists, Screen.Portfolio, Screen.More)

@Composable
private fun PulseApp() {
    var screen by rememberSaveable { mutableStateOf(Screen.Landing) }
    var detailSymbol by rememberSaveable { mutableStateOf<String?>(null) }
    var query by rememberSaveable { mutableStateOf("") }
    var watchlist by rememberSaveable { mutableStateOf(emptyList<String>()) }
    val selectedQuote = demoQuotes.firstOrNull { it.symbol == detailSymbol }
    val showTabs = screen in tabs && selectedQuote == null
    val colors = MaterialTheme.colorScheme
    fun back() {
        when {
            detailSymbol != null -> detailSymbol = null
            screen == Screen.Alerts || screen == Screen.Settings -> screen = Screen.More
            screen == Screen.Account -> screen = Screen.Landing
            screen == Screen.Dashboard -> screen = Screen.Account
            else -> screen = Screen.Dashboard
        }
    }
    fun toggleWatch(symbol: String) {
        watchlist = if (symbol in watchlist) watchlist - symbol else watchlist + symbol
    }
    BackHandler(enabled = screen != Screen.Landing, onBack = ::back)
    Scaffold(
        containerColor = colors.background,
        bottomBar = {
            if (showTabs) {
                NavigationBar(
                    modifier = Modifier.navigationBarsPadding().padding(horizontal = 12.dp, vertical = 6.dp)
                        .clip(MaterialTheme.shapes.extraLarge),
                    containerColor = colors.surface,
                    windowInsets = WindowInsets(0, 0, 0, 0),
                ) {
                    for (tab in tabs) {
                        NavigationBarItem(
                            selected = screen == tab,
                            onClick = { screen = tab },
                            icon = {
                                Icon(
                                    painterResource(tab.icon),
                                    contentDescription = if (screen == tab) null else stringResource(tab.title),
                                )
                            },
                            label = { Text(stringResource(tab.title)) },
                            alwaysShowLabel = false,
                        )
                    }
                }
            }
        },
    ) { padding ->
        Box(
            Modifier.fillMaxSize()
                .background(Brush.verticalGradient(listOf(Color(0xFF103431), colors.background, colors.background)))
                .padding(padding).consumeWindowInsets(padding).safeDrawingPadding(),
            contentAlignment = Alignment.TopCenter,
        ) {
            Box(Modifier.widthIn(max = 540.dp).fillMaxWidth()) {
                if (selectedQuote != null) {
                    StockScreen(selectedQuote, selectedQuote.symbol in watchlist, ::back) {
                        toggleWatch(selectedQuote.symbol)
                    }
                } else {
                    when (screen) {
                        Screen.Landing -> LandingScreen { screen = Screen.Account }
                        Screen.Account -> AccountScreen { screen = Screen.Dashboard }
                        Screen.Dashboard -> MarketList(
                            title = screen.title, quotes = demoQuotes.take(9),
                            onQuote = { detailSymbol = it },
                        )
                        Screen.Markets -> MarketList(
                            title = screen.title, quotes = demoQuotes.drop(3),
                            onQuote = { detailSymbol = it }, query = query, onQuery = { query = it },
                            watchlist = watchlist, onWatch = ::toggleWatch,
                        )
                        Screen.Watchlists -> MarketList(
                            title = screen.title, quotes = demoQuotes.filter { it.symbol in watchlist },
                            onQuote = { detailSymbol = it }, watchlist = watchlist, onWatch = ::toggleWatch,
                        )
                        Screen.More -> MoreScreen { alerts -> screen = if (alerts) Screen.Alerts else Screen.Settings }
                        Screen.Portfolio, Screen.Alerts, Screen.Settings ->
                            PlaceholderScreen(screen.title, if (screen == Screen.Portfolio) null else ::back)
                    }
                }
            }
        }
    }
}
