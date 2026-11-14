package com.example.androidstockapp

import java.text.NumberFormat
import java.util.Locale
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

internal data class DemoQuote(
    val symbol: String,
    val name: String,
    val price: Double,
    val changePercent: Double,
)

internal val demoQuotes = listOf(
    DemoQuote("SPX", "S&P 500", 5200.00, 0.56),
    DemoQuote("NDX", "Nasdaq 100", 18200.00, 0.82),
    DemoQuote("DJI", "Dow Jones", 39000.00, 0.17),
    DemoQuote("AAPL", "Apple Inc.", 190.00, -1.45),
    DemoQuote("MSFT", "Microsoft Corp.", 410.00, -2.54),
    DemoQuote("NVDA", "NVIDIA Corp.", 880.00, 0.28),
    DemoQuote("GOOGL", "Alphabet Inc.", 165.00, 0.23),
    DemoQuote("AMZN", "Amazon.com Inc.", 182.00, 2.56),
    DemoQuote("META", "Meta Platforms", 490.00, 2.84),
    DemoQuote("TSLA", "Tesla Inc.", 210.00, -1.17),
    DemoQuote("AMD", "Advanced Micro Devices", 160.00, -0.40),
    DemoQuote("NFLX", "Netflix Inc.", 620.00, 0.36),
    DemoQuote("CRM", "Salesforce Inc.", 280.00, 2.43),
    DemoQuote("ORCL", "Oracle Corp.", 125.00, 2.35),
    DemoQuote("ADBE", "Adobe Inc.", 520.00, 1.64),
    DemoQuote("INTC", "Intel Corp.", 32.00, 1.69),
    DemoQuote("AVGO", "Broadcom Inc.", 1350.00, -0.06),
    DemoQuote("JPM", "JPMorgan Chase", 198.00, -1.41),
    DemoQuote("BAC", "Bank of America", 38.00, 0.39),
    DemoQuote("GS", "Goldman Sachs", 455.00, -0.61),
    DemoQuote("V", "Visa Inc.", 275.00, -3.36),
    DemoQuote("MA", "Mastercard Inc.", 460.00, -1.02),
    DemoQuote("PYPL", "PayPal Holdings", 64.00, 2.10),
    DemoQuote("JNJ", "Johnson & Johnson", 152.00, -0.40),
    DemoQuote("PFE", "Pfizer Inc.", 28.00, 2.04),
    DemoQuote("UNH", "UnitedHealth Group", 510.00, -0.10),
    DemoQuote("LLY", "Eli Lilly", 780.00, -0.98),
    DemoQuote("MRNA", "Moderna Inc.", 110.00, 2.09),
    DemoQuote("XOM", "Exxon Mobil", 115.00, 1.86),
    DemoQuote("CVX", "Chevron Corp.", 158.00, 2.88),
    DemoQuote("KO", "Coca-Cola Co.", 62.00, -0.34),
    DemoQuote("PEP", "PepsiCo Inc.", 172.00, -0.16),
    DemoQuote("WMT", "Walmart Inc.", 68.00, 0.75),
    DemoQuote("COST", "Costco Wholesale", 780.00, -0.55),
    DemoQuote("NKE", "Nike Inc.", 92.00, -1.00),
    DemoQuote("DIS", "Walt Disney Co.", 112.00, 1.17),
    DemoQuote("SBUX", "Starbucks Corp.", 82.00, -2.17),
    DemoQuote("BA", "Boeing Co.", 185.00, -2.35),
    DemoQuote("CAT", "Caterpillar Inc.", 340.00, 1.74),
    DemoQuote("UBER", "Uber Technologies", 72.00, 0.13),
    DemoQuote("SHOP", "Shopify Inc.", 78.00, 1.87),
    DemoQuote("COIN", "Coinbase Global", 230.00, -1.05),
    DemoQuote("PLTR", "Palantir Tech.", 24.00, 0.70),
)

internal val nasdaq = demoQuotes[1]

internal enum class ChartRange(val label: String, val points: Int) {
    Day("1D", 78), Week("1W", 5), Month("1M", 22), Year("1Y", 252), FiveYears("5Y", 252),
}

internal data class Candle(val open: Float, val close: Float, val low: Float, val high: Float)

internal fun chartSeries(quote: DemoQuote, range: ChartRange): List<Candle> {
    val random = Random(quote.symbol.hashCode() * 31 + range.ordinal)
    val volatility = if (range == ChartRange.Day) 0.003f else 0.02f
    var price = quote.price.toFloat()
    return List(range.points) {
        val close = price
        val open = close * (1f + (random.nextFloat() - 0.515f) * volatility)
        val wick = close * (0.001f + random.nextFloat() * volatility / 3f)
        price = open
        Candle(open, close, min(open, close) - wick, max(open, close) + wick)
    }.asReversed()
}

internal fun formatPrice(price: Double): String =
    NumberFormat.getNumberInstance(Locale.US).apply {
        minimumFractionDigits = 2
        maximumFractionDigits = 2
    }.format(price)

internal fun formatChange(change: Double): String = "%+.2f%%".format(Locale.US, change)
