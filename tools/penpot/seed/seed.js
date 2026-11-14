const palette = {
  primary: "#3AD9B5", onPrimary: "#08211F", mint: "#73F9BB", primaryContainer: "#143934",
  selected: "#1C4540", onSelected: "#C0F0E3", background: "#0A1A27", top: "#103431",
  text: "#EAF8F6", surface: "#0B2530", surfaceVariant: "#15303A", muted: "#9EB7BA",
  outline: "#6C898F", border: "#28434C", gain: "#59E89D", loss: "#FF8189",
};
const c = palette;
const width = 393;
const height = 852;
const inset = 14;
const contentWidth = width - inset * 2;
const font = penpot.fonts.findById("gfont-roboto");
const fill = (color, opacity = 1) => ({ fillColor: color, fillOpacity: opacity });
const stroke = (color, opacity = 1, size = 1) => ({
  strokeColor: color, strokeOpacity: opacity, strokeWidth: size, strokeStyle: "solid", strokeAlignment: "inner",
});

function gradient(start, end, horizontal = false, startOpacity = 1, endOpacity = 1, endOffset = 1) {
  return {
    fillOpacity: 1,
    fillColorGradient: {
      type: "linear", startX: 0, startY: 0, endX: horizontal ? 1 : 0, endY: horizontal ? 0 : 1,
      width: 1,
      stops: [{ color: start, opacity: startOpacity, offset: 0 }, { color: end, opacity: endOpacity, offset: endOffset }],
    },
  };
}

function place(parent, node, name, x, y) {
  node.name = name;
  if (parent) parent.appendChild(node);
  node.x = (parent?.x ?? 0) + x;
  node.y = (parent?.y ?? 0) + y;
  return node;
}

function surface(parent, name, x, y, w, h, { radius = 0, color, border, board = false } = {}) {
  const node = board ? penpot.createBoard() : penpot.createRectangle();
  node.resize(w, h);
  node.borderRadius = radius;
  node.fills = color ? [typeof color === "string" ? fill(color) : color] : [];
  if (border) node.strokes = [stroke(border)];
  return place(parent, node, name, x, y);
}

function text(parent, value, x, y, w, h, { size = 14, weight = 400, color = c.text, align = "left", name = value } = {}) {
  const node = penpot.createText(value);
  const variant = font?.variants.find(item => Number(item.fontWeight) === weight && item.fontStyle === "normal");
  font?.applyToText(node, variant);
  node.fontSize = String(size);
  node.align = align;
  node.fills = [fill(color)];
  node.resize(w, h);
  node.growType = "auto-height";
  return place(parent, node, name, x, y);
}

function vector(parent, name, x, y, w, h, svg) {
  const node = penpot.createShapeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>`);
  return place(parent, node, name, x, y);
}

const glyphs = {
  pulse: "M2,12 H6 L9,4 L14,20 L17,12 H22", chart: "M3,3 V21 H21 M6,15 L10,11 L14,14 L20,7",
  dashboard: "M3,3 H11 V11 H3 Z M13,3 H21 V11 H13 Z M3,13 H11 V21 H3 Z M13,13 H21 V21 H13 Z",
  watchlists: "M5,3 H19 V21 L12,17 L5,21 Z", portfolio: "M8,6 V4 H16 V6 M3,7 H21 V20 H3 Z M8,7 V20 M16,7 V20",
  alerts: "M18,8 A6,6 0,0 0,6 8 C6,16 3,16 3,18 H21 C21,16 18,16 18,8 M10,21 Q12,23 14,21",
  back: "M19,12 H5 M5,12 L12,5 M5,12 L12,19", plus: "M12,5 V19 M5,12 H19", check: "M5,12 L10,17 L19,7",
  more: "M4,12 H4.1 M12,12 H12.1 M20,12 H20.1",
};
function icon(parent, key, x, y, color = c.primary, size = 24) {
  const scale = size / 24;
  return vector(parent, key, x, y, size, size, `<path transform="scale(${scale})" d="${glyphs[key]}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
}

function panel(parent, name, x, y, w, h) {
  return surface(parent, name, x, y, w, h, { radius: 16, color: c.surface, border: c.border, board: true });
}

function control(parent, label, x, y, w, kind = "outline", h = 48) {
  const color = { primary: gradient(c.primary, c.mint, true), disabled: "#18323A", selected: c.selected }[kind];
  const border = { outline: c.outline, disabledOutline: "#344C54" }[kind];
  const foreground = { primary: c.onPrimary, disabled: "#799098", disabledOutline: "#799098", selected: c.onSelected }[kind] ?? c.primary;
  const node = surface(parent, label, x, y, w, h, { radius: h === 32 ? 8 : 14, color, border, board: true });
  text(node, label, 0, Math.round((h - 18) / 2), w, 18, { weight: 500, align: "center", color: foreground });
  return node;
}

function field(parent, value, x, y, w, disabled = false) {
  const node = surface(parent, value, x, y, w, 56, { radius: 14, border: disabled ? "#344C54" : c.outline, board: true });
  text(node, value, 16, 17, w - 32, 24, { size: 16, color: disabled ? "#799098" : c.muted });
}

function brand(parent, x, y) {
  surface(parent, "Pulse mark", x, y, 38, 38, { radius: 12, color: gradient(c.primary, c.mint, true) });
  icon(parent, "pulse", x + 7, y + 7, c.onPrimary);
  text(parent, "Pulse", x + 48, y + 5, 60, 28, { size: 22, weight: 700 });
}

const tabs = [["Dashboard", "dashboard"], ["Markets", "chart"], ["Watchlists", "watchlists"], ["Portfolio", "portfolio"], ["More", "more"]];
function nav(parent, current) {
  const w = width - 20;
  const bar = surface(parent, "Bottom navigation", 10, height - 108, w, 80, {
    radius: 22, color: gradient(c.surfaceVariant, c.surface, false, 0.90, 0.94), border: c.border, board: true,
  });
  for (const [i, [name, glyph]] of tabs.entries()) {
    const cell = w / 5;
    const center = cell * (i + 0.5);
    const active = name === current;
    if (active) surface(bar, "Selected indicator", center - 28, 14, 56, 32, { radius: 16, color: c.selected });
    icon(bar, glyph, center - 12, active ? 18 : 28, active ? c.onSelected : c.muted);
    if (active) text(bar, name, center - cell / 2, 52, cell, 18, { size: 12, weight: 500, align: "center" });
  }
}

function chart(parent, x, y, w, h, series) {
  const start = 4;
  const step = (w - 2 * start) / (series.length - 1);
  const grid = [0.25, 0.5, 0.75].map(fraction => `<path d="M0 ${h * fraction}H${w}" stroke="${c.border}"/>`).join("");
  const line = series.map((value, i) => `${i ? "L" : "M"}${(start + i * step).toFixed(2)},${(start + value * (h - 2 * start)).toFixed(2)}`).join(" ");
  const group = vector(parent, "Editable price chart", x, y, w, h, `
    ${grid}
    <path fill="#3AD9B5" d="${line} L${w - start},${h} L${start},${h}Z"/>
    <path d="${line}" fill="none" stroke="${c.primary}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`);
  const area = group.children.find(shape => shape.type === "path" && shape.strokes.length === 0);
  area.name = "Price area";
  area.fills = [gradient(c.primary, c.primary, false, 0.33, 0.02)];
  return group;
}

const quotes = [
  ["SPX", "S&P 500", "5,200.00", "+0.56%"], ["NDX", "Nasdaq 100", "18,200.00", "+0.82%"],
  ["DJI", "Dow Jones", "39,000.00", "+0.17%"], ["AAPL", "Apple Inc.", "190.00", "-1.45%"],
  ["MSFT", "Microsoft Corp.", "410.00", "-2.54%"], ["NVDA", "NVIDIA Corp.", "880.00", "+0.28%"],
  ["GOOGL", "Alphabet Inc.", "165.00", "+0.23%"], ["AMZN", "Amazon.com Inc.", "182.00", "+2.56%"],
  ["META", "Meta Platforms", "490.00", "+2.84%"], ["TSLA", "Tesla Inc.", "210.00", "-1.17%"],
  ["AMD", "Advanced Micro Devices", "160.00", "-0.40%"], ["NFLX", "Netflix Inc.", "620.00", "+0.36%"],
];
function quote(parent, [symbol, company, price, change], x, y, watching) {
  const hasAction = watching !== undefined;
  const row = surface(parent, symbol + " quote", x, y, contentWidth, hasAction ? 56 : 54, {
    radius: 12, color: c.surface, border: c.border, board: true,
  });
  text(row, symbol, 12, 7, 144, 21, { size: 16, weight: 600 });
  text(row, company, 12, 29, 177, 16, { size: 12, color: c.muted });
  const edge = contentWidth - (hasAction ? 62 : 12);
  text(row, price, edge - 96, 7, 96, 21, { size: 16, weight: 500, align: "right" });
  text(row, change, edge - 96, 29, 96, 18, { color: change.startsWith("-") ? c.loss : c.gain, align: "right", weight: 600 });
  if (hasAction) icon(row, watching ? "check" : "plus", contentWidth - 48, 16);
  return row;
}

function heading(parent, label, y = 39) {
  text(parent, label, inset, y, contentWidth, 38, { size: 28, weight: 700 });
}

function frame(name, index) {
  const board = surface(null, name, (index % 4) * (width + 48), Math.floor(index / 4) * (height + 64), width, height, {
    color: gradient(c.top, c.background, false, 1, 1, 0.5), board: true,
  });
  board.clipContent = true;
  text(board, "9:41", 23, 6, 80, 17, { size: 12, weight: 500, name: "Android clock" });
  vector(board, "Android status indicators", width - 70, 7, 47, 12,
    `<path d="M0 10H11V0ZM16 3Q22-2 28 3L22 10ZM33 1h11v9H33z M45 4h2v3h-2Z" fill="${c.text}"/>`);
  surface(board, "Android gesture handle", (width - 108) / 2, height - 13, 108, 4, { radius: 2, color: c.text });
  return board;
}

function landing(board) {
  brand(board, inset, 40);
  text(board, "The market,", inset, 94, contentWidth, 43, { size: 36, weight: 700 });
  text(board, "in your pocket.", inset, 138, contentWidth, 43, { size: 36, weight: 700, color: c.primary });
  text(board, "Beautiful charts, your own watchlists, portfolio tracking and price alerts.", inset, 187, contentWidth, 45, { size: 16, color: c.muted });
  const card = panel(board, "Nasdaq 100 preview", inset, 245, contentWidth, 220);
  text(card, "Nasdaq 100", 12, 12, 140, 16, { size: 12, color: c.muted });
  text(card, "18,200.00", 12, 29, 150, 32, { size: 24, weight: 700 });
  text(card, "+0.82%", contentWidth - 112, 12, 100, 18, { align: "right", color: c.gain, weight: 600 });
  chart(card, 12, 57, contentWidth - 24, 152, [
    0.9376, 0.8943, 0.8764, 0.8349, 0.8025, 0.7701, 0.7382, 0.7025, 0.7232, 0.6959, 0.6797, 0.7189,
    0.7210, 0.7261, 0.6985, 0.6989, 0.6611, 0.6584, 0.6550, 0.6079, 0.5661, 0.6001, 0.6119, 0.5857,
    0.5520, 0.5247, 0.4697, 0.4885, 0.5034, 0.5001, 0.4565, 0.5085, 0.4668, 0.4188, 0.3777, 0.4215,
    0.3722, 0.3963, 0.3895, 0.3662, 0.3285, 0.3467, 0.3407, 0.3406, 0.3345, 0.3742, 0.3768, 0.3878,
    0.3311, 0.3265, 0.3035, 0.3455, 0.2912, 0.2411, 0.2738, 0.2289, 0.2158, 0.2588, 0.2246, 0.2316,
    0.2773, 0.2944, 0.3299, 0.3591, 0.3148, 0.3146, 0.2973, 0.2964, 0.2412, 0.2290, 0.1866, 0.2124,
    0.1566, 0.1657, 0.1864, 0.2024, 0.2238, 0.1687, 0.1815, 0.2050, 0.1923, 0.2071, 0.2068, 0.2604,
    0.2314, 0.2694, 0.2528, 0.2293, 0.2534, 0.3037, 0.2749, 0.2252, 0.2404, 0.2171, 0.2640, 0.2135,
    0.2086, 0.1523, 0.1465, 0.1945, 0.2191, 0.2499, 0.2850, 0.2277, 0.2577, 0.2773, 0.2861, 0.3232,
    0.2854, 0.3269, 0.2853, 0.2339, 0.1922, 0.1484, 0.1250, 0.1740, 0.1285, 0.1188, 0.0980, 0.1158,
    0.0562, 0.0319, 0.0252, 0.0258, 0.0669, 0.0713, 0.1182, 0.0706, 0.1231, 0.1465, 0.0990, 0.1418,
    0.1643, 0.2148, 0.1709, 0.1670, 0.1388, 0.1399, 0.1801, 0.2177, 0.2692, 0.2262, 0.2254, 0.1742,
    0.2040, 0.2122, 0.2577, 0.2711, 0.2230, 0.1998, 0.1981, 0.2269, 0.2013, 0.1506, 0.2011, 0.2331,
    0.2830, 0.2632, 0.2248, 0.2328, 0.2859, 0.3166, 0.3020, 0.3255, 0.2790, 0.3324, 0.3391, 0.3404,
    0.3361, 0.3694, 0.3254, 0.3021, 0.2731, 0.2463, 0.2735, 0.2778, 0.2397, 0.2860, 0.3274, 0.3003,
    0.2485, 0.2002, 0.1741, 0.1774, 0.1591, 0.1418, 0.1926, 0.1711, 0.1284, 0.1713, 0.1835, 0.1706,
    0.1405, 0.1941, 0.2474, 0.2031, 0.2145, 0.2130, 0.1807, 0.1936, 0.1948, 0.2083, 0.1820, 0.1251,
    0.1692, 0.1963, 0.2136, 0.2386, 0.1800, 0.1755, 0.1572, 0.1799, 0.1992, 0.1944, 0.1856, 0.1879,
    0.2425, 0.2691, 0.2611, 0.2564, 0.3073, 0.2599, 0.2384, 0.1903, 0.2385, 0.1842, 0.1622, 0.1991,
    0.1605, 0.2000, 0.2178, 0.2432, 0.2237, 0.2671, 0.2406, 0.2756, 0.2352, 0.2547, 0.2704, 0.3021,
    0.2653, 0.2720, 0.3082, 0.3132, 0.3176, 0.3610, 0.3047, 0.3374, 0.3144, 0.2755, 0.2902, 0.2708,
  ]);
  const featureWidth = (contentWidth - 16) / 3;
  const features = [["Charts", "chart"], ["Portfolio", "portfolio"], ["Alerts", "alerts"]];
  for (const [i, [label, glyph]] of features.entries()) {
    const item = panel(board, label, inset + i * (featureWidth + 8), 479, featureWidth, 62);
    icon(item, glyph, (featureWidth - 22) / 2, 9, c.primary, 22);
    text(item, label, 0, 36, featureWidth, 16, { size: 12, weight: 500, align: "center" });
  }
  control(board, "Get started", inset, 555, contentWidth, "primary");
  text(board, "Prices are simulated demo data.", inset, 615, contentWidth, 18, { size: 12, color: c.muted, align: "center" });
}

function account(board, signup) {
  brand(board, (width - 108) / 2, 38);
  const h = signup ? 409 : 345;
  const card = panel(board, "Account form", inset, 90, contentWidth, h);
  const w = contentWidth - 28;
  text(card, signup ? "Create account" : "Welcome back", 14, 14, w, 38, { size: 28, weight: 700 });
  text(card, "Sign-in is unavailable in the demo.", 14, 56, w, 22, { color: c.muted });
  let y = 86;
  for (const label of signup ? ["Name", "Email", "Password"] : ["Email", "Password"]) {
    field(card, label, 14, y, w, true);
    y += 64;
  }
  control(card, signup ? "Sign up" : "Sign in", 14, y, w, "disabled", 40);
  control(card, "Continue with Google", 14, y + 48, w, "disabledOutline", 40);
  control(card, signup ? "Sign in" : "Create account", 14, y + 96, w, "text");
  control(board, "Continue in demo mode", inset, 104 + h, contentWidth, "primary");
}

function market(board, name, watching = false) {
  heading(board, name);
  if (name === "Dashboard") {
    text(board, "Market overview (demo prices)", inset, 82, contentWidth, 22, { color: c.muted });
    quotes.slice(0, 9).forEach((item, i) => quote(board, item, inset, 114 + i * 60));
  } else if (name === "Markets") {
    field(board, "Search stocks", inset, 81, contentWidth);
    quotes.slice(3).forEach((item, i) => quote(board, item, inset, 151 + i * 62, false));
  } else if (watching) {
    [quotes[3], quotes[5]].forEach((item, i) => quote(board, item, inset, 90 + i * 62, true));
  } else {
    text(board, "Add a stock from Markets to start your watchlist.", inset, 82, contentWidth, 22, { color: c.muted });
  }
  nav(board, name);
}

function stock(board) {
  icon(board, "back", 26, 44, c.text);
  heading(board, "AAPL", 90);
  text(board, "Apple Inc.", inset, 128, 218, 22, { color: c.muted });
  control(board, "Watch", width - 110, 96, 96);
  text(board, "190.00", inset, 157, 200, 38, { size: 28, weight: 700 });
  text(board, "-1.45%", inset, 199, 200, 18, { color: c.loss, weight: 600 });
  const card = panel(board, "Intraday price", inset, 228, contentWidth, 256);
  chart(card, 12, 12, contentWidth - 24, 232, [
    0.5393, 0.6418, 0.5898, 0.5322, 0.5119, 0.5432, 0.6433, 0.6969, 0.6812, 0.6503, 0.6075, 0.7043,
    0.6215, 0.6527, 0.7427, 0.6780, 0.5940, 0.6570, 0.5574, 0.4799, 0.4395, 0.4075, 0.3418, 0.3973,
    0.4092, 0.4101, 0.4130, 0.3180, 0.2787, 0.3948, 0.3078, 0.3903, 0.2890, 0.3909, 0.3095, 0.2329,
    0.1525, 0.2541, 0.1821, 0.2417, 0.2334, 0.2732, 0.3568, 0.4218, 0.3412, 0.4130, 0.3589, 0.4059,
    0.5167, 0.4804, 0.3499, 0.4243, 0.3999, 0.5024, 0.4312, 0.4551, 0.4739, 0.4536, 0.4907, 0.4274,
    0.5381, 0.5637, 0.6400, 0.6024, 0.7133, 0.8212, 0.7457, 0.7583, 0.7659, 0.8711, 0.8445, 0.7179,
    0.6113, 0.5313, 0.4504, 0.4313, 0.3596, 0.4645,
  ]);
  ["1D", "1W", "1M", "1Y", "5Y"].forEach((label, i) => control(board, label, inset + i * 55, 496, 47, i ? "outline" : "selected", 32));
  ["Area", "Line", "Candle"].forEach((label, i) => control(board, label, inset + i * 69, 544, 61, i ? "outline" : "selected", 32));
  text(board, "Apple Inc. is tracked here with simulated demo prices.", inset, 586, contentWidth, 38, { color: c.muted });
}

function more(board) {
  heading(board, "More");
  control(board, "Alerts", inset, 84, contentWidth);
  control(board, "Settings", inset, 140, contentWidth);
  nav(board, "More");
}

function placeholder(board, name) {
  const back = name !== "Portfolio";
  if (back) icon(board, "back", 26, 50, c.text);
  heading(board, name, back ? 94 : 39);
  text(board, "Coming soon.", inset, back ? 140 : 85, contentWidth, 22, { color: c.muted });
  if (!back) nav(board, name);
}

function components(board) {
  board.name = "Pulse components";
  board.resize(width, 400);
  board.fills = [fill(c.background)];
  for (const child of board.children) child.remove();
  const entries = [
    ["Primary action", control(board, "Continue in demo mode", inset, 24, contentWidth, "primary")],
    ["Outlined action", control(board, "Watch", inset, 88, 96)],
    ["Stock quote", quote(board, quotes[3], inset, 153, false)],
    ["Chart panel", panel(board, "Chart panel", inset, 225, contentWidth, 80)],
  ];
  for (const [name, shape] of entries) penpot.library.local.createComponent([shape]).name = name;
}

async function seed() {
  if (penpot.root.children.length || penpot.library.local.components.length || penpot.library.local.colors.length) {
    throw new Error("Open a blank Penpot file before running the Pulse initial design plugin.");
  }
  penpot.currentPage.name = "Pulse · Android";
  const history = penpot.history.undoBlockBegin();
  try {
    for (const [name, value] of Object.entries(palette)) {
      const color = penpot.library.local.createColor();
      color.name = name;
      color.color = value;
    }
    const screens = [
      ["Landing", landing],
      ["Account", board => account(board, false)],
      ["Account · Create account", board => account(board, true)],
      ["Dashboard", board => market(board, "Dashboard")],
      ["Markets", board => market(board, "Markets")],
      ["Stock detail", stock],
      ["Watchlists", board => market(board, "Watchlists")],
      ["Watchlists · Populated", board => market(board, "Watchlists", true)],
      ["Portfolio", board => placeholder(board, "Portfolio")],
      ["More", more],
      ["Alerts", board => placeholder(board, "Alerts")],
      ["Settings", board => placeholder(board, "Settings")],
    ];
    for (const [index, [name, draw]] of screens.entries()) draw(frame(name, index));
    components(frame("Pulse components", screens.length));
  } finally {
    penpot.history.undoBlockFinish(history);
  }
  penpot.viewport.zoomToFitAll();
}

async function open() {
  const base = "http://127.0.0.1:41783";
  penpot.ui.open("Pulse initial design", base + "/seed.html", { width: 360, height: 180 });
  penpot.ui.onMessage(async message => {
    if (message !== "seed") return;
    try {
      await seed();
      penpot.ui.sendMessage({
        fileId: penpot.currentFile.id,
        pageId: penpot.currentPage.id,
        boards: Object.fromEntries(penpot.root.children.map(board => [board.name, board.id])),
      });
    } catch (error) {
      penpot.ui.sendMessage({ error: error.message ?? String(error) });
    }
  });
}

open();
