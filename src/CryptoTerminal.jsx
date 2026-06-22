import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Waves, Activity, Bell,
  ArrowUpRight, ArrowDownRight, Zap, Settings, Globe, BookOpen,
  LayoutDashboard, Shield, Search, Layers, Wallet, NotebookPen,
} from "lucide-react";

/* ============================== i18n dictionary ============================= */
const T = {
  en: {
    brand_sub: "TERMINAL", connected: "connected",
    tab_dash: "Dashboard", tab_ta: "Technical Analysis", tab_info: "Guide", lang: "中文",
    grp_market: "Market", grp_analysis: "Analysis", grp_assets: "Assets", grp_tools: "Tools",
    pair: (n) => `${n} / USDT`, high: "H", low: "L",
    vol_title: "Volume · Buy / Sell pressure", buy: "Buy", sell: "Sell",
    whale_title: "Whale direction", net_flow: "Net exchange flow (1h)",
    accumulation: "Net outflow → accumulation", distribution: "Net inflow → distribution",
    inflow: "in", outflow: "out", sig_title: "Technical signals",
    overbought: "Overbought", oversold: "Oversold", neutral: "Neutral",
    bullish: "Bullish", bearish: "Bearish", above: "EMA12 > EMA26", below: "EMA12 < EMA26",
    sig_read: "Signal read",
    read_bull: "Momentum, buy-pressure and outflows align — bullish bias.",
    read_bear: "Momentum and flow both soft — caution.",
    read_mix: "Mixed signals — wait for confirmation.",
    alerts_title: "Alerts", add: "+ Add",
    foot: "Prototype · simulated market data for demo. Wire to exchange / on-chain APIs for production.",
    legend_res: "resistance", legend_sup: "support",
    soon: "coming next",
    fng_title: "Fear & Greed Index",
    fng_ef: "Extreme Fear", fng_f: "Fear", fng_n: "Neutral", fng_g: "Greed", fng_eg: "Extreme Greed",
    fng_hint_fear: "Extreme fear often marks bottoms — when others panic-sell, accumulation zones appear.",
    fng_hint_greed: "Extreme greed often marks tops — when everyone's euphoric, consider taking profit.",
    fng_hint_neu: "Neutral sentiment — no strong contrarian edge right now.",
    fng_yesterday: "Yesterday", fng_week: "Last week", fng_contrarian: "Contrarian read",
    mtf_title: "Multi-Timeframe", mtf_tf: "TF", mtf_trend: "Trend", mtf_rsi: "RSI", mtf_signal: "Bias",
    mtf_align: "All timeframes aligned", mtf_conflict: "Timeframes conflict — trade the higher one",
    mtf_mixed: "Mixed across timeframes",
    ex_label: "Exchange", ex_price_note: "Prices differ slightly between exchanges",
    search_ph: "Search symbol or name…", search_add: "Add", search_added: "Added", search_none: "No results", search_remove: "Remove",
    cat_all: "All", cat_crypto: "Crypto", cat_commodity: "Commodities", cat_label_crypto: "Crypto", cat_label_commodity: "Commodity",
    sec_major: "Major", sec_layer1: "Layer 1", sec_layer2: "Layer 2", sec_defi: "DeFi", sec_ai: "AI", sec_meme: "Meme", sec_gaming: "GameFi", sec_commodity: "Commodities",
    wl_title: "Watchlist", wl_manage: "Manage", wl_done: "Done", wl_empty: "No items yet — search to add", wl_browse: "Browse by sector",
    sec_all: "All", sec_major: "Major", sec_layer1: "Layer 1", sec_layer2: "Layer 2", sec_defi: "DeFi", sec_meme: "Meme", sec_ai: "AI", sec_gaming: "Gaming", sec_commodity: "Commodities",
    wl_title: "Watchlist", wl_manage: "Manage", wl_done: "Done", wl_empty: "No assets yet — search to add.",
    mtf_title: "Multi-Timeframe", mtf_sub: "Trend agreement across timeframes",
    mtf_aligned: "All timeframes aligned — high-conviction setup.",
    mtf_mixed: "Timeframes disagree — wait for alignment.",
    mtf_tf: "TF", mtf_trend: "Trend", mtf_rsi: "RSI", mtf_signal: "Signal",
    exch_label: "Exchange", tf_label: "Timeframe",
    // ---- TA tab ----
    ta_score: "Confluence Score", ta_score_sub: "Multi-signal alignment · 0–10",
    ta_bias: "Bias", ta_long: "Long bias", ta_short: "Short bias", ta_wait: "No edge — wait",
    ta_score_hint: "Trade only when ≥ 6 signals align. Below 6 = watchlist, not a trade.",
    ai_title: "AI Market Read", ai_sub: "Claude analyzes all signals together",
    ai_btn: "Analyze now", ai_loading: "Analyzing market data…",
    ai_disclaimer: "AI-generated analysis for education only. Not financial advice. Always manage your own risk.",
    ai_error: "Couldn't reach the AI service. Try again.",
    ai_intro: "Tap analyze to have AI read the current indicators, multi-timeframe picture and whale flow, then give a plain-language take on how to approach this setup.",
    vp_title: "Volume Profile", vp_poc: "POC (Point of Control)", vp_va: "Value Area (70%)",
    vp_note: "The longest bars mark price levels with the most trading — the strongest support/resistance. POC is the single highest-volume price; price tends to gravitate back to it. The value area is where 70% of volume traded.",
    vp_above: "Price above value area — buyers in control.", vp_below: "Price below value area — sellers in control.", vp_inside: "Price inside value area — balanced.",
    struct_title: "Market Structure", struct_trend: "Structure", struct_event: "Last event",
    struct_bos: "BOS = Break of Structure (trend continues)", struct_choch: "CHoCH = Change of Character (possible reversal)",
    struct_up: "Higher highs & higher lows — uptrend.", struct_down: "Lower highs & lower lows — downtrend.", struct_range: "Mixed structure — ranging.",
    struct_hi: "Recent swing high", struct_lo: "Recent swing low",
    struct_note: "Tracks swing highs and lows like institutions do. BOS confirms the trend continues; CHoCH warns the trend may be flipping — the earliest reversal signal.",
    ind_struct: "Market Structure", ind_vp: "Volume Profile (POC)",
    d_struct_bull: "Uptrend structure — higher highs holding.", d_struct_bear: "Downtrend structure — lower lows forming.", d_struct_neu: "Ranging structure — no clear trend.",
    d_vp_bull: "Price above POC — value buyers in control.", d_vp_bear: "Price below POC — value sellers in control.",
    ta_ind: "Indicators", ta_signal: "Signal",
    bull: "Bullish", bear: "Bearish", neu: "Neutral",
    ind_ma: "Moving Average (50/200)", ind_macd: "MACD", ind_rsi: "RSI (14)",
    ind_boll: "Bollinger Bands", ind_adx: "ADX (trend strength)", ind_vwap: "VWAP",
    ind_stoch: "Stochastic", ind_vol: "Volume pressure",
    d_ma_bull: "Price above MA50, golden cross — uptrend intact.",
    d_ma_bear: "Price below MA50, death cross — downtrend.",
    d_ma_neu: "Price and MAs tangled — no clear regime.",
    d_macd_bull: "MACD histogram positive — momentum building.",
    d_macd_bear: "MACD histogram negative — momentum fading.",
    d_macd_div: " Bearish divergence detected.",
    d_rsi_ob: "Overbought (>70) — pullback risk.",
    d_rsi_os: "Oversold (<30) — bounce potential.",
    d_rsi_neu: "Mid-range — momentum neutral.",
    d_boll_up: "Tagging upper band — stretched, mean-reversion risk.",
    d_boll_lo: "Tagging lower band — stretched, bounce potential.",
    d_boll_neu: "Inside bands — normal range.",
    d_adx_trend: "ADX > 25 — strong trend, trend tools valid.",
    d_adx_weak: "ADX < 25 — choppy, avoid trend trades.",
    d_vwap_bull: "Above VWAP — intraday buyers in control.",
    d_vwap_bear: "Below VWAP — intraday sellers in control.",
    d_stoch_ob: "Stochastic overbought — near-term top risk.",
    d_stoch_os: "Stochastic oversold — near-term bottom.",
    d_stoch_neu: "Stochastic mid-range.",
    d_vol_bull: "Buyers dominate recent volume.",
    d_vol_bear: "Sellers dominate recent volume.",
    note_title: "Why confluence?",
    note_body: "A single indicator hits ~52% in crypto. Edge comes from agreement across trend, momentum and volume — not one magic signal. Always set a stop and never trade against the higher timeframe.",
    tf_note: "Higher-timeframe conflict: if the daily is bearish and a lower timeframe flashes buy, skip it.",
    fib_title: "Fibonacci Retracement", fib_swing: "Swing",
    fib_up: "low → high", fib_down: "high → low",
    fib_support: "Nearest support", fib_resistance: "Nearest resistance",
    fib_gp: "Golden pocket (0.618)", fib_here: "price here",
    fib_note: "Crypto frequently respects Fib levels because so many traders watch them — they become self-fulfilling. The 0.618 'golden pocket' is the highest-probability entry zone on a pullback.",
    ind_fib: "Fibonacci (0.618)",
    d_fib_bull: "Holding above the golden pocket — pullback buyers in control.",
    d_fib_bear: "Lost the golden pocket — retracement deepening.",
    // ---- Risk tab ----
    tab_risk: "Risk",
    risk_calc: "Position Calculator", risk_inputs: "Inputs",
    r_account: "Account size (USDT)", r_risk: "Risk per trade (%)",
    r_entry: "Entry price", r_stop: "Stop-loss price", r_target: "Target price",
    r_side: "Direction", r_long: "Long", r_short: "Short", r_lev: "Leverage",
    r_out: "Result", r_possize: "Position size", r_units: "Quantity",
    r_riskamt: "Amount at risk", r_liq: "Est. liquidation price",
    r_rr: "Risk : Reward", r_loss_stop: "Loss if stopped", r_gain_target: "Gain if target hit",
    r_rr_good: "Good — reward ≥ 2× risk.", r_rr_ok: "Acceptable — aim for ≥ 1:2.",
    r_rr_bad: "Skip it — reward below 2× risk. Not worth it.",
    r_warn_stop: "Stop must be on the losing side of entry.",
    r_atr_title: "ATR Stop Suggestion", r_atr_sub: "Volatility-based stop distance",
    r_atr_val: "ATR (14)", r_atr_1: "Tight (1× ATR)", r_atr_2: "Standard (2× ATR)", r_atr_3: "Wide (3× ATR)",
    r_atr_note: "Set stops beyond normal noise. 2× ATR is the common default; tighten only in low-volatility ranges.",
    r_rules: "Survival rules",
    r_rule1: "Never risk more than 1–2% of your account on one trade.",
    r_rule2: "Always set the stop before you enter — not after price moves against you.",
    r_rule3: "If the R:R is below 1:2, it's a watchlist item, not a trade.",
    r_rule4: "High leverage doesn't raise profit potential — it just moves your liquidation closer.",
    r_apply: "Use signal price",
    // ---- Futures tab ----
    tab_fut: "Futures",
    fr_title: "Funding Rate", fr_sub: "Perpetual swap · paid every 8h",
    fr_long_pays: "Longs pay shorts", fr_short_pays: "Shorts pay longs",
    fr_annual: "Annualized", fr_next: "Next funding",
    fr_hot: "Elevated — longs crowded, contrarian short signal", fr_cold: "Negative — shorts crowded, contrarian long signal", fr_normal: "Normal range — no crowding",
    oi_title: "Open Interest", oi_sub: "Total open contracts",
    oi_rising: "OI rising with price — trend backed by new money (real move)", oi_falling: "OI falling — positions closing, move may be exhausting", oi_div: "Price up but OI down — short covering, weak rally",
    oi_change: "24h change",
    ls_title: "Long / Short Ratio", ls_sub: "Top traders positioning", ls_long: "Long", ls_short: "Short",
    ls_crowded_long: "Crowd heavily long — caution near tops", ls_crowded_short: "Crowd heavily short — squeeze risk", ls_balanced: "Fairly balanced positioning",
    liq_title: "Liquidation Map", liq_sub: "Where leveraged positions get liquidated", liq_longs: "Long liquidations", liq_shorts: "Short liquidations",
    liq_note: "Clusters mark where stop-losses and liquidations pile up. Price is often magnetically drawn to these zones — big players hunt liquidity there before reversing.",
    liq_price: "Price", liq_cur: "current",
    fut_disclaimer: "Derivatives data shown for analysis. Futures carry high risk of total loss.",
    fai_title: "AI Futures Analysis", fai_sub: "Funding + OI + structure + Fib, cross-checked",
    fai_btn: "Analyze setup", fai_loading: "Cross-checking futures & technicals…",
    fai_intro: "AI combines the funding rate, open interest, long/short ratio and liquidation zones with Fibonacci levels and market structure — looking for confluence where multiple signals point the same way. Best for spotting high-probability futures entries and avoiding crowded traps.",
    fai_err: "Couldn't reach the AI service. Try again.",
    fai_disc: "AI analysis for education only. Not financial advice. Leverage amplifies losses — always use a stop.",
    // ---- Portfolio tab ----
    tab_pf: "Portfolio",
    pf_total: "Total Value", pf_pnl: "Total P&L", pf_cost: "Total Cost", pf_holdings: "Holdings",
    pf_add: "+ Add Position", pf_empty: "No positions yet. Add one to track your P&L.",
    pf_asset: "Asset", pf_qty: "Quantity", pf_entry: "Avg entry price", pf_save: "Save", pf_cancel: "Cancel",
    pf_avg: "Avg", pf_now: "Now", pf_value: "Value", pf_alloc: "Allocation",
    pf_delete: "Delete", pf_confirm_del: "Remove this position?",
    pf_best: "Best", pf_worst: "Worst", pf_disclaimer: "Tracked locally on this device. Prices simulated in demo.",
    pf_pick: "Pick asset",
    // ---- Journal tab ----
    tab_jr: "Journal",
    jr_add: "+ New Entry", jr_empty: "No trades logged yet. Record one to start learning from your results.",
    jr_sym: "Asset", jr_side: "Direction", jr_long: "Long", jr_short: "Short",
    jr_entry: "Entry price", jr_exit: "Exit price (leave blank if open)", jr_qty: "Size (USDT)",
    jr_reason: "Why this trade? (setup, signals)", jr_result: "Result / lesson learned",
    jr_save: "Save entry", jr_cancel: "Cancel", jr_open: "Open", jr_closed: "Closed",
    jr_pnl: "P&L", jr_winrate: "Win rate", jr_trades: "Trades", jr_wins: "Wins", jr_losses: "Losses",
    jr_status: "Status", jr_open_label: "OPEN", jr_del: "Delete",
    jr_avg_win: "Avg win", jr_avg_loss: "Avg loss", jr_stats: "Performance",
    jr_disclaimer: "Your trading journal is stored locally on this device.",
    jr_note_ph: "e.g. Broke above 0.618 fib with rising OI and bullish structure",
    jr_result_ph: "e.g. Hit target. Patience paid off — waited for confluence.",
    // ---- Info tab ----
    info_intro: "ABYSS Terminal is a complete crypto trading-intelligence platform. Below is a quick-start walkthrough showing how all the tools work together in one real trade, followed by detailed sections on each feature.",
    info_s1: "Dashboard", info_s2: "Technical Analysis", info_s3: "Risk Manager", info_s4: "Indicators Explained", info_s5: "Golden Rules",
    qs_title: "Quick Start — One Trade, Start to Finish", qs_sub: "How all the tabs work together",
    qs_intro: "New here? Follow this flow. It chains every tool into one disciplined trade — the way a pro actually works.",
    qs_steps: [
      { n: "1", t: "Find a candidate", b: "On the Dashboard, search a coin or tap a sector chip (Major, DeFi, Meme…). Tap to load its chart. Glance at the Fear & Greed gauge — extreme fear can be opportunity, extreme greed means caution." },
      { n: "2", t: "Check the trend across timeframes", b: "Open the Multi-Timeframe table. If the daily and 4H both lean the same way, the setup is stronger. If they conflict, trade the higher timeframe or skip it." },
      { n: "3", t: "Confirm with Technical Analysis", b: "Go to the Analysis tab. Look at the Confluence Score — only act when 6+ signals agree. Check where price sits on the Fibonacci levels (the 0.618 golden pocket is the highest-probability entry) and whether market structure shows BOS (continuation) or CHoCH (reversal)." },
      { n: "4", t: "Let AI cross-check", b: "Tap 'Analyze now'. The AI reads every indicator together and gives a plain-language take — a fast sanity check before you commit." },
      { n: "5", t: "If trading futures, check the crowd", b: "Open the Futures tab. High funding = longs crowded (contrarian short risk). See where liquidation clusters sit — price often gets pulled toward them. Run the AI Futures Analysis for confluence between Fib and liquidation zones." },
      { n: "6", t: "Size the position safely", b: "Before entering, open Risk. Enter your account size, risk %, entry and stop. It tells you exactly how much to buy, your liquidation price, and the R:R. If R:R is below 1:2 — skip it. Never risk more than 1–2% per trade." },
      { n: "7", t: "Track and review", b: "Add the trade to Portfolio to watch P&L live. Then log it in the Journal with your reasoning. Over time the Journal reveals which setups make you money — this is how you actually improve." },
    ],
    qs_takeaway: "The whole point: never trade on one signal. Stack confluence (trend + structure + Fib + futures data), size with risk management, and review every trade. That discipline is the edge — not any single indicator.",
    setup_title: "Going Live (for the builder)", setup_sub: "Deploying & connecting real data",
    setup_body: "This is a working prototype with simulated market data. To take it live: (1) push the code to GitHub, (2) deploy free on Vercel for a shareable link, (3) connect real prices via exchange public APIs (Binance/OKX/BingX/MEXC websockets — no key needed for prices). Funding rate, open interest and long/short ratio come from the same exchange APIs; liquidation maps from services like Coinglass; on-chain whale data from Glassnode or Arkham. Browser local-storage makes the portfolio, journal and watchlist persist.",
    demo_note: "Note: whale flow, Fear & Greed, funding, OI and liquidation data shown are simulated for demonstration. Logic and formulas are real — they work directly once wired to live APIs.",
    info_dash1_t: "Whale tape (top bar)", info_dash1_b: "The scrolling bar shows real-time large transfers between wallets and exchanges. → Exchange means coins moving IN (bearish — likely selling). ← Exchange means coins moving OUT (bullish — likely accumulating).",
    info_dash2_t: "Watchlist", info_dash2_b: "Tap any coin to switch the chart. The % shown is the 24-hour change. Green = up, red = down.",
    info_dash3_t: "Price chart", info_dash3_b: "The amber line is the price. Blue = EMA12 (faster), purple = EMA26 (slower). When EMA12 crosses above EMA26 = bullish momentum. Dashed lines mark the swing high (resistance) and low (support) of the visible period.",
    info_dash4_t: "Volume · Buy/Sell pressure", info_dash4_b: "Green bars = price closed up on that candle. Red bars = price closed down. The bar at the bottom shows the ratio of buying to selling pressure in the last 20 candles — a quick read on who's in control right now.",
    info_dash5_t: "Whale direction panel", info_dash5_b: "Net flow summary: if more coins are flowing OUT of exchanges than in, the market is in accumulation mode (bullish). If more coins flow IN, distribution (bearish). Individual whale moves are listed below.",
    info_dash6_t: "Alerts", info_dash6_b: "Tap '+ Add' to create a new price alert for the active coin. Toggle the switch on/off to enable or disable each alert.",
    info_ta1_t: "Confluence Score (0–10)", info_ta1_b: "The gauge scores how many of the 9 indicators agree. 7–10 = strong signal, consider acting. 4–6 = mixed, wait for clarity. 0–3 = counter-trend, high risk. Never trade on a single indicator alone.",
    info_ta2_t: "Indicator table", info_ta2_b: "Each row shows the indicator value, a bullish/bearish/neutral badge, and a plain-English explanation. Use this to understand WHY the score is what it is, not just what it is.",
    info_ta3_t: "Fibonacci panel", info_ta3_b: "Auto-detects the recent swing high and low and draws the key retracement levels. The golden pocket (0.618) is highlighted — this is where pullbacks most often find buyers in an uptrend. The blue line shows where price sits right now.",
    info_r1_t: "Position Calculator", info_r1_b: "Fill in your account size, how much % you're willing to risk, entry price, stop-loss, and target. The calculator tells you: how big the position should be, how many coins to buy, the estimated liquidation price, and the R:R ratio. The '↻ Use signal price' button fills in the current market price as your entry.",
    info_r2_t: "R:R (Risk : Reward)", info_r2_b: "This is the most important number. A trade with 1:1 means you risk $1 to make $1 — not worth it. Minimum 1:2 means risking $1 to make $2. The calculator color-codes this: green = good, amber = acceptable, red = skip the trade.",
    info_r3_t: "ATR Stop Suggestion", info_r3_b: "ATR measures normal price 'noise'. Setting a stop too close means getting knocked out by random volatility before your thesis even plays out. 2× ATR (standard) places the stop outside normal noise — one-click to apply it.",
    ind_exp: [
      { name: "EMA (12 / 26)", body: "Exponential Moving Averages smooth out price to show the trend. EMA12 reacts faster, EMA26 is slower. When 12 is above 26 = bullish momentum. When 12 crosses below 26 = momentum lost. Use as a trend filter, not a trade trigger on its own." },
      { name: "MACD", body: "MACD = EMA12 minus EMA26. When the histogram bar is growing upward = buyers gaining control. Shrinking bars warn the move is fading. Bearish divergence (price makes new high but MACD doesn't) is an early warning of reversal." },
      { name: "RSI (14)", body: "Measures momentum 0–100. Above 70 = overbought (pullback risk). Below 30 = oversold (bounce potential). In a strong trend RSI can stay >70 for a long time — don't short just because it's 'overbought'. The 50 level is key: in bull markets RSI finds support at 50." },
      { name: "Bollinger Bands", body: "A price channel 2 standard deviations wide. Price touching the upper band = stretched, mean-reversion risk. Lower band = stretched other way. %B near 1 = upper band, near 0 = lower band. Works best in ranging markets, less useful in strong trends." },
      { name: "ADX", body: "Measures trend STRENGTH, not direction. Below 25 = choppy, no real trend — avoid trend-following indicators. Above 25 = trend is real, EMA and MACD signals become more reliable. Think of ADX as the 'on/off switch' for the other indicators." },
      { name: "VWAP", body: "Volume-Weighted Average Price — the average price weighted by how much was traded at each level. Institutions use it as a benchmark. Price above VWAP = intraday buyers in control. Best used on intraday charts (15M, 1H). Less meaningful on daily." },
      { name: "Stochastic (KD)", body: "Similar to RSI but uses the high/low range. K > 80 = overbought, K < 20 = oversold. Most useful when it crosses back from extreme levels — a cross back below 80 confirms a top, cross back above 20 confirms a bottom." },
      { name: "Fibonacci", body: "Key retracement levels drawn between a swing high and low. The 0.618 (golden pocket) is where the most buyers tend to appear in an uptrend pullback. Works because so many traders watch it — self-fulfilling. Always check if price is near a Fib level before entering." },
    ],
    rules: [
      { t: "Risk 1–2% per trade", b: "If you risk 2% and lose 10 trades in a row (a normal bad streak), you still have 82% of your capital. Risk 10% per trade and the same streak wipes you out. Survival first." },
      { t: "Set the stop before you enter", b: "Decide where you're wrong BEFORE you put money in. After you're in, emotions take over. Pre-set stops are the only stops that actually get honored." },
      { t: "Don't fight the higher timeframe", b: "If the daily chart is bearish, don't take long signals on the 15-minute chart. Always trade with the higher timeframe, not against it." },
      { t: "Confluence before conviction", b: "One indicator flashing doesn't mean anything. 6+ indicators agreeing means something. Use the Confluence Score as your permission slip." },
      { t: "Leverage kills slowly, then suddenly", b: "20× leverage means a 5% move against you is a wipeout. Most retail traders blow up not from bad analysis but from too much leverage on a trade they were eventually right about." },
    ],
  },
  zh: {
    brand_sub: "終端", connected: "已連線",
    tab_dash: "儀表板", tab_ta: "技術分析", tab_info: "功能說明", lang: "EN",
    grp_market: "行情", grp_analysis: "分析", grp_assets: "資產", grp_tools: "工具",
    pair: (n) => `${n} / USDT`, high: "高", low: "低",
    vol_title: "成交量 · 買賣壓力", buy: "買盤", sell: "賣盤",
    whale_title: "巨鯨方向", net_flow: "交易所淨流向（1小時）",
    accumulation: "淨流出 → 吸籌", distribution: "淨流入 → 出貨",
    inflow: "流入", outflow: "流出", sig_title: "技術訊號",
    overbought: "超買", oversold: "超賣", neutral: "中性",
    bullish: "多頭", bearish: "空頭", above: "EMA12 > EMA26", below: "EMA12 < EMA26",
    sig_read: "訊號解讀",
    read_bull: "動能、買壓與資金流出三者一致——偏多。",
    read_bear: "動能與資金流皆偏弱——保持謹慎。",
    read_mix: "訊號分歧——等待確認。",
    alerts_title: "警報", add: "+ 新增",
    foot: "原型 · 展示用模擬數據。正式版接交易所 / 鏈上 API。",
    legend_res: "壓力", legend_sup: "支撐",
    soon: "下一步建立",
    fng_title: "恐懼貪婪指數",
    fng_ef: "極度恐懼", fng_f: "恐懼", fng_n: "中性", fng_g: "貪婪", fng_eg: "極度貪婪",
    fng_hint_fear: "極度恐懼常是底部——當別人恐慌拋售，吸籌的機會就出現了。",
    fng_hint_greed: "極度貪婪常是頂部——當所有人都狂熱時，考慮獲利了結。",
    fng_hint_neu: "情緒中性——目前沒有明顯的反向操作優勢。",
    fng_yesterday: "昨日", fng_week: "上週", fng_contrarian: "反向解讀",
    mtf_title: "多時間框架對照", mtf_tf: "框架", mtf_trend: "趨勢", mtf_rsi: "RSI", mtf_signal: "傾向",
    mtf_align: "各框架方向一致", mtf_conflict: "框架衝突——以大週期為準",
    mtf_mixed: "各框架方向分歧",
    ex_label: "交易所", ex_price_note: "各交易所價格略有差異",
    search_ph: "搜尋代號或名稱…", search_add: "加入", search_added: "已加入", search_none: "找不到結果", search_remove: "移除",
    cat_all: "全部", cat_crypto: "加密貨幣", cat_commodity: "大宗商品", cat_label_crypto: "加密", cat_label_commodity: "商品",
    sec_major: "主流幣", sec_layer1: "公鏈 L1", sec_layer2: "L2", sec_defi: "DeFi", sec_ai: "AI", sec_meme: "迷因幣", sec_gaming: "鏈遊", sec_commodity: "大宗商品",
    wl_title: "自選名單", wl_manage: "管理", wl_done: "完成", wl_empty: "尚無項目——搜尋以加入", wl_browse: "依板塊瀏覽",
    sec_all: "全部", sec_major: "主流幣", sec_layer1: "Layer 1", sec_layer2: "Layer 2", sec_defi: "DeFi", sec_meme: "迷因幣", sec_ai: "AI", sec_gaming: "遊戲", sec_commodity: "大宗商品",
    wl_title: "自選清單", wl_manage: "管理", wl_done: "完成", wl_empty: "尚無標的——搜尋以加入。",
    // ---- TA tab ----
    ta_score: "匯流評分", ta_score_sub: "多訊號一致度 · 0–10",
    ta_bias: "傾向", ta_long: "偏多", ta_short: "偏空", ta_wait: "無優勢 — 觀望",
    ta_score_hint: "≥ 6 個訊號一致才進場。低於 6 分只進觀察清單，不交易。",
    ai_title: "AI 綜合解盤", ai_sub: "Claude 把所有訊號一起判讀",
    ai_btn: "立即分析", ai_loading: "正在分析市場數據…",
    ai_disclaimer: "AI 生成的分析僅供教育參考，非投資建議。請自行做好風險管理。",
    ai_error: "無法連線 AI 服務，請再試一次。",
    ai_intro: "點擊分析，讓 AI 判讀目前的指標、多時間框架與巨鯨流向，再用白話給你一段「這個盤該怎麼看」的解讀。",
    vp_title: "成交量分佈", vp_poc: "POC（控制點）", vp_va: "價值區（70%）",
    vp_note: "最長的橫條代表成交最密集的價位——最強的支撐壓力。POC 是成交量最大的單一價位，價格傾向回到這裡。價值區是 70% 成交量集中的範圍。",
    vp_above: "價格在價值區之上——買方主導。", vp_below: "價格在價值區之下——賣方主導。", vp_inside: "價格在價值區內——多空平衡。",
    struct_title: "市場結構", struct_trend: "結構", struct_event: "最近事件",
    struct_bos: "BOS = 結構突破（趨勢延續）", struct_choch: "CHoCH = 結構轉變（可能反轉）",
    struct_up: "更高的高點與更高的低點——上升趨勢。", struct_down: "更低的高點與更低的低點——下降趨勢。", struct_range: "結構分歧——盤整。",
    struct_hi: "近期波段高點", struct_lo: "近期波段低點",
    struct_note: "像主力一樣追蹤波段高低點。BOS 確認趨勢延續；CHoCH 警示趨勢可能反轉——最早的反轉訊號。",
    ind_struct: "市場結構", ind_vp: "成交量分佈（POC）",
    d_struct_bull: "上升結構——高點持續墊高。", d_struct_bear: "下降結構——低點持續下移。", d_struct_neu: "盤整結構——方向不明。",
    d_vp_bull: "價格在 POC 之上——價值區買方主導。", d_vp_bear: "價格在 POC 之下——價值區賣方主導。",
    ta_ind: "指標", ta_signal: "訊號",
    bull: "多頭", bear: "空頭", neu: "中性",
    ind_ma: "均線（50/200）", ind_macd: "MACD", ind_rsi: "RSI（14）",
    ind_boll: "布林通道", ind_adx: "ADX（趨勢強度）", ind_vwap: "VWAP",
    ind_stoch: "隨機指標 KD", ind_vol: "量能買賣壓",
    d_ma_bull: "價格在 MA50 之上，黃金交叉——上升趨勢成立。",
    d_ma_bear: "價格跌破 MA50，死亡交叉——下降趨勢。",
    d_ma_neu: "價格與均線糾纏——方向不明。",
    d_macd_bull: "MACD 柱狀體翻正——動能轉強。",
    d_macd_bear: "MACD 柱狀體翻負——動能轉弱。",
    d_macd_div: " 偵測到頂背離。",
    d_rsi_ob: "超買（>70）——回檔風險。",
    d_rsi_os: "超賣（<30）——反彈機會。",
    d_rsi_neu: "中性區間——動能持平。",
    d_boll_up: "觸及上軌——過度延伸，留意均值回歸。",
    d_boll_lo: "觸及下軌——過度延伸，反彈機會。",
    d_boll_neu: "通道內運行——正常區間。",
    d_adx_trend: "ADX > 25——趨勢強，趨勢型指標有效。",
    d_adx_weak: "ADX < 25——盤整震盪，避免做趨勢單。",
    d_vwap_bull: "在 VWAP 之上——日內買方主導。",
    d_vwap_bear: "在 VWAP 之下——日內賣方主導。",
    d_stoch_ob: "KD 超買——短線見頂風險。",
    d_stoch_os: "KD 超賣——短線見底。",
    d_stoch_neu: "KD 中性區間。",
    d_vol_bull: "近期成交量買方主導。",
    d_vol_bear: "近期成交量賣方主導。",
    note_title: "為什麼要看匯流？",
    note_body: "單一指標在加密市場大約只有 52% 命中率。優勢來自趨勢、動能、量能三者一致，而非單一神奇訊號。永遠設停損，絕不逆大週期交易。",
    tf_note: "大週期衝突：若日線偏空、小週期出現買進訊號，直接略過。",
    fib_title: "斐波那契回撤", fib_swing: "波段",
    fib_up: "低 → 高", fib_down: "高 → 低",
    fib_support: "最近支撐", fib_resistance: "最近壓力",
    fib_gp: "黃金口袋（0.618）", fib_here: "目前價位",
    fib_note: "加密市場常常會在斐波位反應，因為看的人太多——形成自我實現。0.618「黃金口袋」是回檔時勝率最高的進場區。",
    ind_fib: "斐波那契（0.618）",
    d_fib_bull: "守住黃金口袋之上——回檔買盤主導。",
    d_fib_bear: "跌破黃金口袋——回撤加深。",
    // ---- Risk tab ----
    tab_risk: "風控",
    risk_calc: "倉位計算機", risk_inputs: "輸入",
    r_account: "本金（USDT）", r_risk: "單筆風險（%）",
    r_entry: "進場價", r_stop: "停損價", r_target: "目標價",
    r_side: "方向", r_long: "做多", r_short: "做空", r_lev: "槓桿",
    r_out: "計算結果", r_possize: "倉位金額", r_units: "數量",
    r_riskamt: "風險金額", r_liq: "預估爆倉價",
    r_rr: "風險報酬比", r_loss_stop: "停損損失", r_gain_target: "達標獲利",
    r_rr_good: "不錯——報酬 ≥ 2 倍風險。", r_rr_ok: "可接受——目標 ≥ 1:2。",
    r_rr_bad: "別做——報酬不到 2 倍風險，不值得。",
    r_warn_stop: "停損必須設在進場價的虧損方向。",
    r_atr_title: "ATR 停損建議", r_atr_sub: "依波動度計算停損距離",
    r_atr_val: "ATR（14）", r_atr_1: "緊（1× ATR）", r_atr_2: "標準（2× ATR）", r_atr_3: "寬（3× ATR）",
    r_atr_note: "停損要設在正常波動雜訊之外。2× ATR 是常用預設；只有在低波動盤整時才收緊。",
    r_rules: "活下來的鐵則",
    r_rule1: "單筆交易絕不冒超過本金的 1–2%。",
    r_rule2: "進場前就設好停損——不是等價格走反了才設。",
    r_rule3: "風險報酬比低於 1:2，那是觀察標的，不是交易。",
    r_rule4: "高槓桿不會提高獲利潛力——只會把你的爆倉價往前推。",
    r_apply: "帶入訊號價",
    // ---- Futures tab ----
    tab_fut: "合約",
    fr_title: "資金費率", fr_sub: "永續合約 · 每 8 小時收取",
    fr_long_pays: "多單付給空單", fr_short_pays: "空單付給多單",
    fr_annual: "年化", fr_next: "下次收取",
    fr_hot: "偏高——多單擁擠，反向做空訊號", fr_cold: "負費率——空單擁擠，反向做多訊號", fr_normal: "正常區間——無擁擠",
    oi_title: "未平倉量 OI", oi_sub: "市場總未平倉合約",
    oi_rising: "OI 隨價格上升——新資金進場（真突破）", oi_falling: "OI 下降——倉位平倉，動能可能耗盡", oi_div: "價漲但 OI 降——空單回補，反彈虛弱",
    oi_change: "24小時變化",
    ls_title: "多空比", ls_sub: "頂級交易者持倉", ls_long: "多單", ls_short: "空單",
    ls_crowded_long: "市場過度偏多——接近頂部需謹慎", ls_crowded_short: "市場過度偏空——留意軋空風險", ls_balanced: "持倉相對平衡",
    liq_title: "清算地圖", liq_sub: "槓桿倉位的爆倉價位分佈", liq_longs: "多單清算", liq_shorts: "空單清算",
    liq_note: "密集區代表止損和爆倉單堆積的價位。價格常被磁吸到這些區域——主力會去這裡掃流動性，掃完才反轉。",
    liq_price: "價格", liq_cur: "目前",
    fut_disclaimer: "合約數據僅供分析。合約交易有極高的全額虧損風險。",
    fai_title: "AI 合約分析", fai_sub: "資金費率 + OI + 結構 + 斐波 交叉驗證",
    fai_btn: "分析此盤", fai_loading: "正在交叉比對合約與技術面…",
    fai_intro: "AI 把資金費率、未平倉量、多空比、清算區，跟斐波那契價位和市場結構一起判讀——尋找多個訊號同方向的「共振」。最適合找出高勝率的合約進場點、避開擁擠的陷阱。",
    fai_err: "無法連線 AI 服務，請再試一次。",
    fai_disc: "AI 分析僅供教育參考，非投資建議。槓桿會放大虧損——務必設停損。",
    // ---- Portfolio tab ----
    tab_pf: "持倉",
    pf_total: "總資產", pf_pnl: "總盈虧", pf_cost: "總成本", pf_holdings: "持倉明細",
    pf_add: "+ 新增持倉", pf_empty: "尚無持倉。新增一筆即可追蹤盈虧。",
    pf_asset: "標的", pf_qty: "數量", pf_entry: "平均買入價", pf_save: "儲存", pf_cancel: "取消",
    pf_avg: "成本", pf_now: "現價", pf_value: "市值", pf_alloc: "佔比",
    pf_delete: "刪除", pf_confirm_del: "移除這筆持倉？",
    pf_best: "最佳", pf_worst: "最差", pf_disclaimer: "資料儲存在本機裝置。展示版價格為模擬。",
    pf_pick: "選擇標的",
    // ---- Journal tab ----
    tab_jr: "交易日誌",
    jr_add: "+ 新增紀錄", jr_empty: "尚無交易紀錄。記錄一筆，開始從結果中學習。",
    jr_sym: "標的", jr_side: "方向", jr_long: "做多", jr_short: "做空",
    jr_entry: "進場價", jr_exit: "出場價（未平倉留空）", jr_qty: "倉位（USDT）",
    jr_reason: "進場理由？（setup、訊號）", jr_result: "結果／學到的教訓",
    jr_save: "儲存紀錄", jr_cancel: "取消", jr_open: "持倉中", jr_closed: "已平倉",
    jr_pnl: "盈虧", jr_winrate: "勝率", jr_trades: "筆數", jr_wins: "獲利", jr_losses: "虧損",
    jr_status: "狀態", jr_open_label: "持倉中", jr_del: "刪除",
    jr_avg_win: "平均獲利", jr_avg_loss: "平均虧損", jr_stats: "績效統計",
    jr_disclaimer: "交易日誌儲存在本機裝置。",
    jr_note_ph: "例如：站上斐波 0.618、OI 上升、結構轉多",
    jr_result_ph: "例如：到達目標。耐心有回報——等到了訊號共振。",
    // ---- Info tab ----
    info_intro: "ABYSS Terminal 是一個完整的加密貨幣交易智慧平台。以下先用一筆完整的交易示範所有工具怎麼搭配使用，後面再詳細說明每個功能。",
    info_s1: "儀表板", info_s2: "技術分析", info_s3: "風控計算機", info_s4: "指標說明", info_s5: "生存鐵則",
    qs_title: "快速上手 — 一筆完整交易", qs_sub: "所有分頁怎麼搭配運作",
    qs_intro: "第一次用？跟著這個流程走。它把每個工具串成一筆有紀律的交易——這就是老手實際的操作方式。",
    qs_steps: [
      { n: "1", t: "找標的", b: "在儀表板搜尋幣種，或點板塊標籤（主流、DeFi、迷因…）。點一下載入圖表。瞄一眼恐懼貪婪指數——極度恐懼常是機會、極度貪婪要謹慎。" },
      { n: "2", t: "看多框架趨勢", b: "打開多時間框架對照表。如果日線和 4H 方向一致，這個 setup 更可靠；如果衝突，以大週期為準，或乾脆略過。" },
      { n: "3", t: "用技術分析確認", b: "切到技術分析分頁。看匯流評分——6 分以上、多個訊號一致才動手。看價格在斐波哪個位置（0.618 黃金口袋勝率最高），以及市場結構是 BOS（延續）還是 CHoCH（反轉）。" },
      { n: "4", t: "讓 AI 交叉驗證", b: "點「立即分析」。AI 會把所有指標一起判讀、用白話給你結論——進場前快速做個理智檢查。" },
      { n: "5", t: "做合約先看人群", b: "打開合約分頁。資金費率高=多單擁擠（反向做空風險）。看清算密集區在哪——價格常被磁吸過去。跑 AI 合約分析，找斐波和清算區的共振。" },
      { n: "6", t: "安全計算倉位", b: "進場前打開風控。輸入本金、風險%、進場價、停損價，它會算出該買多少、爆倉價在哪、R:R 多少。R:R 低於 1:2 就別做。單筆絕不冒超過本金的 1–2%。" },
      { n: "7", t: "追蹤與檢討", b: "把交易加進持倉即時看盈虧。再記進交易日誌、寫下理由。久了日誌會告訴你哪種 setup 會賺——這才是真正進步的方法。" },
    ],
    qs_takeaway: "核心觀念：絕不靠單一訊號交易。疊加共振（趨勢 + 結構 + 斐波 + 合約數據）、用風控算倉位、每筆都檢討。這份紀律才是你的優勢——不是任何單一指標。",
    setup_title: "正式上線（給建置者）", setup_sub: "部署與接真實數據",
    setup_body: "這是一個用模擬數據的可運作原型。要正式上線：(1) 把程式碼推上 GitHub，(2) 用 Vercel 免費部署、拿到可分享的網址，(3) 透過交易所公開 API 接真實價格（Binance/OKX/BingX/MEXC 的 websocket——看價格不用 key）。資金費率、未平倉量、多空比來自同樣的交易所 API；清算地圖可接 Coinglass；鏈上巨鯨數據來自 Glassnode 或 Arkham。用瀏覽器本地儲存就能讓持倉、日誌、自選永久保存。",
    demo_note: "注意：目前顯示的巨鯨流向、恐懼貪婪、資金費率、OI、清算數據都是展示用的模擬數據。邏輯和公式都是真的——接上即時 API 後可直接運作。",
    info_dash1_t: "巨鯨飛報（頂部跑馬燈）", info_dash1_b: "即時顯示大額資金在錢包與交易所之間的轉移。→ 交易所 = 幣流入（偏空，可能要賣）。← 交易所 = 幣流出（偏多，可能在囤幣）。",
    info_dash2_t: "自選幣種列", info_dash2_b: "點任何幣種即可切換圖表。顯示的 % 是 24 小時漲跌幅。綠色 = 漲，紅色 = 跌。",
    info_dash3_t: "價格走勢圖", info_dash3_b: "琥珀色線是價格。藍色 = EMA12（快線），紫色 = EMA26（慢線）。EMA12 上穿 EMA26 = 動能轉多。虛線標出可見區間的波段高點（壓力）和低點（支撐）。",
    info_dash4_t: "成交量 · 買賣壓力", info_dash4_b: "綠色柱 = 當根收紅（上漲）。紅色柱 = 當根收綠（下跌）。底部的進度條顯示最近 20 根的買賣力道比例——快速判斷誰在主導。",
    info_dash5_t: "巨鯨方向面板", info_dash5_b: "淨流向總結：流出交易所 > 流入 = 市場在吸籌（偏多）。流入 > 流出 = 市場在出貨（偏空）。下方列出個別大戶動向。",
    info_dash6_t: "警報", info_dash6_b: "點「+ 新增」為目前幣種新增價格警報。切換開關可啟用或停用。",
    info_ta1_t: "匯流評分（0–10）", info_ta1_b: "儀表顯示 9 個指標中有幾個一致。7–10 = 訊號強，可考慮進場。4–6 = 分歧，等待確認。0–3 = 逆趨勢，風險高。永遠不要只靠單一指標交易。",
    info_ta2_t: "指標清單", info_ta2_b: "每一行顯示指標數值、多空中性徽章，以及白話解讀。用來理解評分「為什麼」是這個數字，不只是看結果。",
    info_ta3_t: "斐波那契面板", info_ta3_b: "自動偵測近期波段高低點，畫出關鍵回撤比例。黃金口袋（0.618）高亮——上升趨勢的回檔最常在這裡找到買盤。藍線標示目前價位。",
    info_r1_t: "倉位計算機", info_r1_b: "填入本金、願意冒的風險百分比、進場價、停損價、目標價。計算機告訴你：倉位該多大、買幾顆、預估爆倉價、R:R 比。「↻ 帶入訊號價」按鈕把目前市價填為進場價。",
    info_r2_t: "R:R（風險報酬比）", info_r2_b: "這是最重要的數字。1:1 代表冒 $1 賺 $1——不值得。最低 1:2 才做，也就是冒 $1 賺 $2。計算機用顏色標示：綠色 = 好，琥珀 = 可接受，紅色 = 跳過這筆交易。",
    info_r3_t: "ATR 停損建議", info_r3_b: "ATR 衡量正常的價格波動「雜訊」。停損設太近，會在你的判斷還沒被驗證前就被洗出去。2× ATR（標準）把停損設在正常雜訊之外——一鍵套用。",
    ind_exp: [
      { name: "EMA（12 / 26）", body: "指數移動平均線，用來平滑價格顯示趨勢。EMA12 反應快，EMA26 慢。12 在 26 之上 = 多頭動能。12 下穿 26 = 動能轉弱。用作趨勢過濾器，不要單獨用來進場。" },
      { name: "MACD", body: "EMA12 減 EMA26。柱狀體往上增大 = 買方取得主導。柱狀體縮小 = 動能在消退。頂背離（價格創新高但 MACD 沒有）是趨勢反轉的早期警示。" },
      { name: "RSI（14）", body: "衡量動能，0–100。超過 70 = 超買（回檔風險）。低於 30 = 超賣（反彈機會）。強趨勢中 RSI 可長期停在 70 以上——不要只因為「超買」就做空。50 是關鍵線：多頭市場中 RSI 常在 50 附近找支撐。" },
      { name: "布林通道", body: "價格通道，寬度為 2 個標準差。觸及上軌 = 過度延伸，留意均值回歸。觸及下軌 = 反向延伸。%B 接近 1 = 在上軌，接近 0 = 在下軌。在震盪市最好用，強趨勢市場效果較差。" },
      { name: "ADX", body: "衡量趨勢「強度」，不是方向。低於 25 = 盤整，沒有真正的趨勢——避開趨勢型指標。高於 25 = 趨勢成立，EMA 和 MACD 的訊號才更可靠。把 ADX 當作其他指標的開關。" },
      { name: "VWAP", body: "成交量加權平均價——以各價位的成交量為權重算出的均價。機構常用作基準。價格在 VWAP 之上 = 日內買方主導。最適合用在日內圖（15分、1小時），日線圖意義較小。" },
      { name: "隨機指標 KD", body: "類似 RSI，但用的是高低價區間。K > 80 = 超買，K < 20 = 超賣。最有用的時機是從極值回頭——從 80 回穿下確認頭部，從 20 回穿上確認底部。" },
      { name: "斐波那契", body: "在波段高低點之間畫出關鍵回撤比例。0.618（黃金口袋）是上升趨勢回檔時最容易出現買盤的位置。有效是因為看的人夠多——自我實現。進場前先確認附近有沒有斐波位。" },
    ],
    rules: [
      { t: "單筆冒 1–2% 的風險", b: "冒 2% 連虧 10 次（正常壞連），還剩 82% 的本金。冒 10% 連虧 10 次就歸零。先活下來。" },
      { t: "進場前設好停損", b: "在放錢進去之前就決定好「什麼情況代表我錯了」。進場後情緒會干擾判斷。預設的停損才是真的會被執行的停損。" },
      { t: "不要逆大週期交易", b: "日線偏空，不要在 15 分鐘圖做多單。永遠順著大週期方向，不要逆它。" },
      { t: "有匯流再有把握", b: "單一指標閃訊號沒有意義。六個以上指標同時一致才叫訊號。把匯流評分當你的進場許可。" },
      { t: "槓桿是慢慢殺你，然後突然", b: "20 倍槓桿代表 5% 逆向波動就爆倉。大多數散戶爆倉不是因為判斷錯，而是在一筆「最終是對的」交易上加了太多槓桿。" },
    ],
  },
};

/* ============================ mock data engine ============================== */
const COINS = [
  { sym: "BTC", name: "Bitcoin", base: 67250, vol: 0.012, sector: "major", cat: "crypto", def: true },
  { sym: "ETH", name: "Ethereum", base: 3520, vol: 0.018, sector: "major", cat: "crypto", def: true },
  { sym: "BNB", name: "BNB", base: 605, vol: 0.014, sector: "major", cat: "crypto", def: true },
  { sym: "SOL", name: "Solana", base: 168, vol: 0.03, sector: "major", cat: "crypto", def: true },
  { sym: "XRP", name: "Ripple", base: 0.52, vol: 0.03, sector: "major", cat: "crypto", def: true },
  { sym: "DOGE", name: "Dogecoin", base: 0.158, vol: 0.04, sector: "meme", cat: "crypto", def: true },
  { sym: "TON", name: "Toncoin", base: 5.4, vol: 0.03, sector: "layer1", cat: "crypto" },
  { sym: "ADA", name: "Cardano", base: 0.45, vol: 0.032, sector: "layer1", cat: "crypto" },
  { sym: "TRX", name: "Tron", base: 0.12, vol: 0.022, sector: "layer1", cat: "crypto" },
  { sym: "AVAX", name: "Avalanche", base: 36, vol: 0.035, sector: "layer1", cat: "crypto" },
  { sym: "LINK", name: "Chainlink", base: 14.2, vol: 0.034, sector: "defi", cat: "crypto" },
  { sym: "DOT", name: "Polkadot", base: 7.1, vol: 0.03, sector: "layer1", cat: "crypto" },
  { sym: "BCH", name: "Bitcoin Cash", base: 420, vol: 0.025, sector: "major", cat: "crypto" },
  { sym: "LTC", name: "Litecoin", base: 82, vol: 0.025, sector: "major", cat: "crypto" },
  { sym: "NEAR", name: "NEAR Protocol", base: 5.6, vol: 0.04, sector: "layer1", cat: "crypto" },
  { sym: "MATIC", name: "Polygon", base: 0.72, vol: 0.036, sector: "layer2", cat: "crypto" },
  { sym: "UNI", name: "Uniswap", base: 7.8, vol: 0.038, sector: "defi", cat: "crypto" },
  { sym: "ICP", name: "Internet Computer", base: 12.4, vol: 0.042, sector: "layer1", cat: "crypto" },
  { sym: "APT", name: "Aptos", base: 8.9, vol: 0.042, sector: "layer1", cat: "crypto" },
  { sym: "XLM", name: "Stellar", base: 0.11, vol: 0.03, sector: "layer1", cat: "crypto" },
  { sym: "ETC", name: "Ethereum Classic", base: 26, vol: 0.03, sector: "layer1", cat: "crypto" },
  { sym: "ATOM", name: "Cosmos", base: 8.3, vol: 0.034, sector: "layer1", cat: "crypto" },
  { sym: "FIL", name: "Filecoin", base: 4.7, vol: 0.04, sector: "layer1", cat: "crypto" },
  { sym: "HBAR", name: "Hedera", base: 0.085, vol: 0.038, sector: "layer1", cat: "crypto" },
  { sym: "VET", name: "VeChain", base: 0.035, vol: 0.04, sector: "layer1", cat: "crypto" },
  { sym: "ARB", name: "Arbitrum", base: 0.82, vol: 0.045, sector: "layer2", cat: "crypto" },
  { sym: "OP", name: "Optimism", base: 1.65, vol: 0.045, sector: "layer2", cat: "crypto" },
  { sym: "STRK", name: "Starknet", base: 0.45, vol: 0.05, sector: "layer2", cat: "crypto" },
  { sym: "MANTA", name: "Manta Network", base: 0.68, vol: 0.05, sector: "layer2", cat: "crypto" },
  { sym: "METIS", name: "Metis", base: 38, vol: 0.05, sector: "layer2", cat: "crypto" },
  { sym: "ZK", name: "zkSync", base: 0.16, vol: 0.055, sector: "layer2", cat: "crypto" },
  { sym: "BLAST", name: "Blast", base: 0.0085, vol: 0.06, sector: "layer2", cat: "crypto" },
  { sym: "SCROLL", name: "Scroll", base: 0.78, vol: 0.055, sector: "layer2", cat: "crypto" },
  { sym: "AAVE", name: "Aave", base: 96, vol: 0.038, sector: "defi", cat: "crypto" },
  { sym: "MKR", name: "Maker", base: 2400, vol: 0.034, sector: "defi", cat: "crypto" },
  { sym: "LDO", name: "Lido DAO", base: 1.7, vol: 0.046, sector: "defi", cat: "crypto" },
  { sym: "CRV", name: "Curve DAO", base: 0.42, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "SNX", name: "Synthetix", base: 2.1, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "COMP", name: "Compound", base: 52, vol: 0.045, sector: "defi", cat: "crypto" },
  { sym: "SUSHI", name: "SushiSwap", base: 0.95, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "1INCH", name: "1inch", base: 0.34, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "DYDX", name: "dYdX", base: 1.45, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "GMX", name: "GMX", base: 28, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "PENDLE", name: "Pendle", base: 4.8, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "RUNE", name: "THORChain", base: 4.8, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "CAKE", name: "PancakeSwap", base: 2.3, vol: 0.048, sector: "defi", cat: "crypto" },
  { sym: "JUP", name: "Jupiter", base: 0.92, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "ENA", name: "Ethena", base: 0.78, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "ONDO", name: "Ondo", base: 1.15, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "PYTH", name: "Pyth Network", base: 0.38, vol: 0.052, sector: "defi", cat: "crypto" },
  { sym: "INJ", name: "Injective", base: 22, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "FET", name: "Fetch.ai", base: 1.35, vol: 0.05, sector: "ai", cat: "crypto" },
  { sym: "RNDR", name: "Render", base: 7.4, vol: 0.046, sector: "ai", cat: "crypto" },
  { sym: "TAO", name: "Bittensor", base: 420, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "AGIX", name: "SingularityNET", base: 0.55, vol: 0.055, sector: "ai", cat: "crypto" },
  { sym: "OCEAN", name: "Ocean Protocol", base: 0.62, vol: 0.05, sector: "ai", cat: "crypto" },
  { sym: "AKT", name: "Akash Network", base: 3.4, vol: 0.055, sector: "ai", cat: "crypto" },
  { sym: "GRT", name: "The Graph", base: 0.23, vol: 0.04, sector: "ai", cat: "crypto" },
  { sym: "WLD", name: "Worldcoin", base: 2.4, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "ARKM", name: "Arkham", base: 1.8, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "AIOZ", name: "AIOZ Network", base: 0.65, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "SHIB", name: "Shiba Inu", base: 0.0000182, vol: 0.05, sector: "meme", cat: "crypto" },
  { sym: "PEPE", name: "Pepe", base: 0.0000098, vol: 0.06, sector: "meme", cat: "crypto" },
  { sym: "WIF", name: "dogwifhat", base: 2.3, vol: 0.065, sector: "meme", cat: "crypto" },
  { sym: "BONK", name: "Bonk", base: 0.0000245, vol: 0.07, sector: "meme", cat: "crypto" },
  { sym: "FLOKI", name: "Floki", base: 0.000168, vol: 0.07, sector: "meme", cat: "crypto" },
  { sym: "BOME", name: "Book of Meme", base: 0.0092, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "MEW", name: "cat in a dogs world", base: 0.0072, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "POPCAT", name: "Popcat", base: 1.15, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "MOG", name: "Mog Coin", base: 0.0000015, vol: 0.09, sector: "meme", cat: "crypto" },
  { sym: "BRETT", name: "Brett", base: 0.085, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "TURBO", name: "Turbo", base: 0.0058, vol: 0.085, sector: "meme", cat: "crypto" },
  { sym: "PNUT", name: "Peanut the Squirrel", base: 0.62, vol: 0.09, sector: "meme", cat: "crypto" },
  { sym: "SUI", name: "Sui", base: 1.1, vol: 0.048, sector: "layer1", cat: "crypto" },
  { sym: "SEI", name: "Sei", base: 0.42, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "TIA", name: "Celestia", base: 9.2, vol: 0.052, sector: "layer1", cat: "crypto" },
  { sym: "STX", name: "Stacks", base: 1.9, vol: 0.048, sector: "layer1", cat: "crypto" },
  { sym: "KAS", name: "Kaspa", base: 0.135, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "ALGO", name: "Algorand", base: 0.16, vol: 0.034, sector: "layer1", cat: "crypto" },
  { sym: "FTM", name: "Fantom", base: 0.62, vol: 0.046, sector: "layer1", cat: "crypto" },
  { sym: "EGLD", name: "MultiversX", base: 32, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "FLOW", name: "Flow", base: 0.72, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "KAVA", name: "Kava", base: 0.42, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "ROSE", name: "Oasis Network", base: 0.075, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "ZIL", name: "Zilliqa", base: 0.018, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "ONE", name: "Harmony", base: 0.014, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "IOTA", name: "IOTA", base: 0.18, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "XTZ", name: "Tezos", base: 0.85, vol: 0.04, sector: "layer1", cat: "crypto" },
  { sym: "NEO", name: "Neo", base: 11.5, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "WAVES", name: "Waves", base: 1.3, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "DASH", name: "Dash", base: 28, vol: 0.04, sector: "layer1", cat: "crypto" },
  { sym: "ZEC", name: "Zcash", base: 42, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "XMR", name: "Monero", base: 158, vol: 0.03, sector: "layer1", cat: "crypto" },
  { sym: "QTUM", name: "Qtum", base: 2.6, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "MINA", name: "Mina", base: 0.52, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "CFX", name: "Conflux", base: 0.16, vol: 0.055, sector: "layer1", cat: "crypto" },
  { sym: "KSM", name: "Kusama", base: 18, vol: 0.045, sector: "layer1", cat: "crypto" },
  { sym: "IMX", name: "Immutable", base: 1.6, vol: 0.044, sector: "gaming", cat: "crypto" },
  { sym: "SAND", name: "The Sandbox", base: 0.36, vol: 0.05, sector: "gaming", cat: "crypto" },
  { sym: "MANA", name: "Decentraland", base: 0.38, vol: 0.05, sector: "gaming", cat: "crypto" },
  { sym: "AXS", name: "Axie Infinity", base: 5.8, vol: 0.05, sector: "gaming", cat: "crypto" },
  { sym: "GALA", name: "Gala", base: 0.025, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "APE", name: "ApeCoin", base: 0.92, vol: 0.055, sector: "gaming", cat: "crypto" },
  { sym: "ENJ", name: "Enjin Coin", base: 0.16, vol: 0.05, sector: "gaming", cat: "crypto" },
  { sym: "PIXEL", name: "Pixels", base: 0.18, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "BEAM", name: "Beam", base: 0.018, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "RON", name: "Ronin", base: 1.4, vol: 0.055, sector: "gaming", cat: "crypto" },
  { sym: "CHZ", name: "Chiliz", base: 0.072, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "BAT", name: "Basic Attention", base: 0.18, vol: 0.045, sector: "defi", cat: "crypto" },
  { sym: "ZRX", name: "0x Protocol", base: 0.34, vol: 0.045, sector: "defi", cat: "crypto" },
  { sym: "YFI", name: "yearn.finance", base: 6800, vol: 0.045, sector: "defi", cat: "crypto" },
  { sym: "BAL", name: "Balancer", base: 2.4, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "UMA", name: "UMA", base: 2.2, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "REN", name: "Ren", base: 0.045, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "KNC", name: "Kyber Network", base: 0.62, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "LRC", name: "Loopring", base: 0.18, vol: 0.05, sector: "layer2", cat: "crypto" },
  { sym: "BNT", name: "Bancor", base: 0.62, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "OSMO", name: "Osmosis", base: 0.58, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "JTO", name: "Jito", base: 2.8, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "RAY", name: "Raydium", base: 3.2, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "ETHFI", name: "Ether.fi", base: 1.9, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "EIGEN", name: "EigenLayer", base: 3.4, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "W", name: "Wormhole", base: 0.28, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "ZRO", name: "LayerZero", base: 4.6, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "SAFE", name: "Safe", base: 1.1, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "MORPHO", name: "Morpho", base: 1.5, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "CETUS", name: "Cetus", base: 0.18, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "DRIFT", name: "Drift", base: 0.78, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "AERO", name: "Aerodrome", base: 1.2, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "VELO", name: "Velodrome", base: 0.085, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "SPELL", name: "Spell Token", base: 0.0006, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "FXS", name: "Frax Share", base: 2.8, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "RPL", name: "Rocket Pool", base: 9.5, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "ANKR", name: "Ankr", base: 0.028, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "API3", name: "API3", base: 1.4, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "BAND", name: "Band Protocol", base: 1.3, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "TRB", name: "Tellor", base: 58, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "RSR", name: "Reserve Rights", base: 0.0082, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "ALPHA", name: "Stella", base: 0.072, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "PERP", name: "Perpetual Protocol", base: 0.62, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "MAV", name: "Maverick", base: 0.18, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "HFT", name: "Hashflow", base: 0.22, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "VRA", name: "Verasity", base: 0.0035, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "QUICK", name: "QuickSwap", base: 0.045, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "DODO", name: "DODO", base: 0.12, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "SUN", name: "Sun Token", base: 0.018, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "AVAAVE", name: "Aavegotchi", base: 1.1, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "ILV", name: "Illuvium", base: 18, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "YGG", name: "Yield Guild Games", base: 0.42, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "MAGIC", name: "Magic", base: 0.38, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "GHST", name: "Aavegotchi GHST", base: 0.95, vol: 0.055, sector: "gaming", cat: "crypto" },
  { sym: "SLP", name: "Smooth Love Potion", base: 0.0021, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "ALICE", name: "MyNeighborAlice", base: 0.85, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "TLM", name: "Alien Worlds", base: 0.012, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "SUPER", name: "SuperVerse", base: 0.72, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "BIGTIME", name: "Big Time", base: 0.12, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "PRIME", name: "Echelon Prime", base: 8.5, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "PORTAL", name: "Portal", base: 0.32, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "NAKA", name: "Nakamoto Games", base: 1.6, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "GODS", name: "Gods Unchained", base: 0.18, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "VOXEL", name: "Voxies", base: 0.14, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "NMR", name: "Numeraire", base: 16, vol: 0.055, sector: "ai", cat: "crypto" },
  { sym: "CTXC", name: "Cortex", base: 0.22, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "PHB", name: "Phoenix", base: 1.4, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "NFP", name: "NFPrompt", base: 0.42, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "GPU", name: "NodeAI", base: 0.085, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "AI", name: "Sleepless AI", base: 0.62, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "ATH", name: "Aethir", base: 0.045, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "IO", name: "io.net", base: 1.8, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "TURBOAI", name: "TurboS", base: 0.0042, vol: 0.08, sector: "ai", cat: "crypto" },
  { sym: "CGPT", name: "ChainGPT", base: 0.18, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "VANRY", name: "Vanar Chain", base: 0.045, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "ZIG", name: "Zignaly", base: 0.12, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "DBR", name: "DeBridge", base: 0.085, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "GME", name: "GME (Solana)", base: 0.012, vol: 0.09, sector: "meme", cat: "crypto" },
  { sym: "MOODENG", name: "Moo Deng", base: 0.18, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "GOAT", name: "Goatseus Maximus", base: 0.42, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "ACT", name: "Act I The AI Prophecy", base: 0.085, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "NEIRO", name: "Neiro", base: 0.0012, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "CHILLGUY", name: "Chill Guy", base: 0.085, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "DEGEN", name: "Degen", base: 0.0072, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "SLERF", name: "Slerf", base: 0.18, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "MYRO", name: "Myro", base: 0.045, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "WEN", name: "Wen", base: 0.00008, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "BABYDOGE", name: "Baby Doge Coin", base: 0.0000000013, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "DADDY", name: "Daddy Tate", base: 0.085, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "AIDOGE", name: "ArbDoge AI", base: 0.00000000018, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "LADYS", name: "Milady Meme Coin", base: 0.00000012, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "COQ", name: "Coq Inu", base: 0.0000018, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "DOGS", name: "Dogs", base: 0.00072, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "CAT", name: "Simon's Cat", base: 0.0000045, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "HMSTR", name: "Hamster Kombat", base: 0.0035, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "CATI", name: "Catizen", base: 0.32, vol: 0.09, sector: "meme", cat: "crypto" },
  { sym: "ZRC", name: "Zircuit", base: 0.085, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "TAIKO", name: "Taiko", base: 0.62, vol: 0.06, sector: "layer2", cat: "crypto" },
  { sym: "MODE", name: "Mode", base: 0.012, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "MERL", name: "Merlin Chain", base: 0.18, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "DYM", name: "Dymension", base: 1.2, vol: 0.06, sector: "layer2", cat: "crypto" },
  { sym: "ALT", name: "AltLayer", base: 0.085, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "OMNI", name: "Omni Network", base: 4.2, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "CYBER", name: "Cyber", base: 4.8, vol: 0.06, sector: "layer2", cat: "crypto" },
  { sym: "POL", name: "Polygon Ecosystem", base: 0.45, vol: 0.04, sector: "layer2", cat: "crypto" },
  { sym: "SKL", name: "SKALE", base: 0.045, vol: 0.05, sector: "layer2", cat: "crypto" },
  { sym: "BOBA", name: "Boba Network", base: 0.18, vol: 0.06, sector: "layer2", cat: "crypto" },
  { sym: "AURORA", name: "Aurora", base: 0.12, vol: 0.06, sector: "layer2", cat: "crypto" },
  { sym: "INVZK", name: "Inverse ZK", base: 0.42, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "CORE", name: "Core", base: 0.95, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "ZETA", name: "ZetaChain", base: 0.55, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "SAGA", name: "Saga", base: 1.4, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "AXL", name: "Axelar", base: 0.62, vol: 0.055, sector: "layer1", cat: "crypto" },
  { sym: "DAG", name: "Constellation", base: 0.045, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "KDA", name: "Kadena", base: 0.62, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "CKB", name: "Nervos Network", base: 0.011, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "ELF", name: "aelf", base: 0.32, vol: 0.055, sector: "layer1", cat: "crypto" },
  { sym: "ICX", name: "ICON", base: 0.16, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "ONT", name: "Ontology", base: 0.18, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "ZEN", name: "Horizen", base: 8.5, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "SC", name: "Siacoin", base: 0.0045, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "DGB", name: "DigiByte", base: 0.0072, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "RVN", name: "Ravencoin", base: 0.018, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "HIVE", name: "Hive", base: 0.22, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "ARDR", name: "Ardor", base: 0.085, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "LSK", name: "Lisk", base: 0.85, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "WAXP", name: "WAX", base: 0.032, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "CELO", name: "Celo", base: 0.62, vol: 0.05, sector: "layer1", cat: "crypto" },
  { sym: "GLMR", name: "Moonbeam", base: 0.16, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "ASTR", name: "Astar", base: 0.052, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "TARA", name: "Taraxa", base: 0.0085, vol: 0.07, sector: "layer1", cat: "crypto" },
  { sym: "AVAIL", name: "Avail", base: 0.085, vol: 0.07, sector: "layer1", cat: "crypto" },
  { sym: "BERA", name: "Berachain", base: 6.2, vol: 0.07, sector: "layer1", cat: "crypto" },
  { sym: "MOVE", name: "Movement", base: 0.62, vol: 0.07, sector: "layer1", cat: "crypto" },
  { sym: "ME", name: "Magic Eden", base: 2.8, vol: 0.07, sector: "layer1", cat: "crypto" },
  { sym: "G", name: "Gravity", base: 0.018, vol: 0.07, sector: "layer1", cat: "crypto" },
  { sym: "GFI", name: "Goldfinch", base: 1.2, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "ACX", name: "Across Protocol", base: 0.28, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "ORCA", name: "Orca", base: 3.4, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "KMNO", name: "Kamino", base: 0.085, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "SD", name: "Stader", base: 0.62, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "META", name: "Metaplex", base: 0.085, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "MNT", name: "Mantle", base: 0.85, vol: 0.05, sector: "layer2", cat: "crypto" },
  { sym: "MASK", name: "Mask Network", base: 2.8, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "AUDIO", name: "Audius", base: 0.16, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "RLC", name: "iExec RLC", base: 1.4, vol: 0.055, sector: "ai", cat: "crypto" },
  { sym: "POWR", name: "Powerledger", base: 0.22, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "STORJ", name: "Storj", base: 0.42, vol: 0.055, sector: "ai", cat: "crypto" },
  { sym: "ARKM2", name: "Arkham", base: 1.8, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "LPT", name: "Livepeer", base: 12, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "NKN", name: "NKN", base: 0.085, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "DIA", name: "DIA", base: 0.42, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "FLUX", name: "Flux", base: 0.42, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "ORDI", name: "ORDI", base: 32, vol: 0.07, sector: "meme", cat: "crypto" },
  { sym: "SATS", name: "SATS (Ordinals)", base: 0.00000025, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "RATS", name: "Rats (Ordinals)", base: 0.00012, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "1000SATS", name: "1000SATS", base: 0.00025, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "MUBI", name: "MultiBit", base: 0.18, vol: 0.08, sector: "meme", cat: "crypto" },
  { sym: "PIPL", name: "People (ConstitutionDAO)", base: 0.045, vol: 0.07, sector: "meme", cat: "crypto" },
  { sym: "AICODE", name: "AI Code", base: 0.0085, vol: 0.09, sector: "ai", cat: "crypto" },
  { sym: "T", name: "Threshold", base: 0.032, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "QNT", name: "Quant", base: 88, vol: 0.045, sector: "defi", cat: "crypto" },
  { sym: "ROOK", name: "Rook", base: 8.2, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "TWT", name: "Trust Wallet Token", base: 1.1, vol: 0.05, sector: "defi", cat: "crypto" },
  { sym: "C98", name: "Coin98", base: 0.16, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "ID", name: "Space ID", base: 0.32, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "HOOK", name: "Hooked Protocol", base: 0.42, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "HIGH", name: "Highstreet", base: 1.4, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "DEXE", name: "DeXe", base: 8.5, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "POND", name: "Marlin", base: 0.018, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "AGLD", name: "Adventure Gold", base: 0.85, vol: 0.06, sector: "gaming", cat: "crypto" },
  { sym: "BLZ", name: "Bluzelle", base: 0.18, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "CTSI", name: "Cartesi", base: 0.16, vol: 0.055, sector: "ai", cat: "crypto" },
  { sym: "COTI", name: "COTI", base: 0.12, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "CVC", name: "Civic", base: 0.12, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "DUSK", name: "Dusk", base: 0.32, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "FORTH", name: "Ampleforth Gov", base: 3.2, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "GTC", name: "Gitcoin", base: 0.85, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "IDEX", name: "IDEX", base: 0.045, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "JASMY", name: "JasmyCoin", base: 0.022, vol: 0.06, sector: "ai", cat: "crypto" },
  { sym: "LIT", name: "Litentry", base: 0.62, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "LQTY", name: "Liquity", base: 1.1, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "MTL", name: "Metal DAO", base: 0.95, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "OGN", name: "Origin Protocol", base: 0.12, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "POLYX", name: "Polymesh", base: 0.32, vol: 0.055, sector: "layer1", cat: "crypto" },
  { sym: "PUNDIX", name: "Pundi X", base: 0.42, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "RAD", name: "Radworks", base: 1.2, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "REQ", name: "Request", base: 0.12, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "RDNT", name: "Radiant Capital", base: 0.045, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "SFP", name: "SafePal", base: 0.62, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "SLP2", name: "Smooth Love", base: 0.0021, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "SSV", name: "ssv.network", base: 18, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "STG", name: "Stargate Finance", base: 0.32, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "SXP", name: "Solar", base: 0.28, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "TRU", name: "TrueFi", base: 0.12, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "VTHO", name: "VeThor", base: 0.0025, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "WOO", name: "WOO Network", base: 0.22, vol: 0.055, sector: "defi", cat: "crypto" },
  { sym: "XVS", name: "Venus", base: 8.5, vol: 0.06, sector: "defi", cat: "crypto" },
  { sym: "YGG2", name: "YGG Play", base: 0.42, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "ZBC", name: "Zebec", base: 0.0045, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "ACE", name: "Fusionist", base: 1.8, vol: 0.07, sector: "gaming", cat: "crypto" },
  { sym: "NTRN", name: "Neutron", base: 0.42, vol: 0.06, sector: "layer1", cat: "crypto" },
  { sym: "AEVO", name: "Aevo", base: 0.42, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "VANA", name: "Vana", base: 8.5, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "GRASS", name: "Grass", base: 2.4, vol: 0.07, sector: "ai", cat: "crypto" },
  { sym: "SCR", name: "Scroll", base: 0.78, vol: 0.07, sector: "layer2", cat: "crypto" },
  { sym: "SPX", name: "SPX6900", base: 0.85, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "PONKE", name: "Ponke", base: 0.42, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "RETARDIO", name: "Retardio", base: 0.18, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "FWOG", name: "Fwog", base: 0.085, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "USUAL", name: "Usual", base: 0.62, vol: 0.07, sector: "defi", cat: "crypto" },
  { sym: "PENGU", name: "Pudgy Penguins", base: 0.032, vol: 0.1, sector: "meme", cat: "crypto" },
  { sym: "VVV", name: "Venice Token", base: 4.2, vol: 0.08, sector: "ai", cat: "crypto" },
  { sym: "AIXBT", name: "aixbt", base: 0.32, vol: 0.1, sector: "ai", cat: "crypto" },
  { sym: "GRIFFAIN", name: "Griffain", base: 0.18, vol: 0.11, sector: "ai", cat: "crypto" },
  { sym: "ZEREBRO", name: "Zerebro", base: 0.085, vol: 0.11, sector: "ai", cat: "crypto" },
  { sym: "FARTCOIN", name: "Fartcoin", base: 0.62, vol: 0.11, sector: "meme", cat: "crypto" },
  { sym: "AI16Z", name: "ai16z", base: 0.85, vol: 0.1, sector: "ai", cat: "crypto" },
  { sym: "XAU", name: "Gold (oz)", base: 2630, vol: 0.006, sector: "commodity", cat: "commodity" },
  { sym: "XAG", name: "Silver (oz)", base: 30.5, vol: 0.012, sector: "commodity", cat: "commodity" },
  { sym: "WTI", name: "Crude Oil WTI (bbl)", base: 70.5, vol: 0.015, sector: "commodity", cat: "commodity" },
  { sym: "BRENT", name: "Brent Crude (bbl)", base: 74.2, vol: 0.014, sector: "commodity", cat: "commodity" },
  { sym: "XPT", name: "Platinum (oz)", base: 965, vol: 0.01, sector: "commodity", cat: "commodity" },
  { sym: "XPD", name: "Palladium (oz)", base: 1020, vol: 0.014, sector: "commodity", cat: "commodity" },
  { sym: "NG", name: "Natural Gas (MMBtu)", base: 2.85, vol: 0.025, sector: "commodity", cat: "commodity" },
  { sym: "HG", name: "Copper (lb)", base: 4.15, vol: 0.013, sector: "commodity", cat: "commodity" },
  { sym: "ALU", name: "Aluminum (t)", base: 2380, vol: 0.012, sector: "commodity", cat: "commodity" },
  { sym: "ZNC", name: "Zinc (t)", base: 3050, vol: 0.013, sector: "commodity", cat: "commodity" },
  { sym: "WHEAT", name: "Wheat (bu)", base: 5.95, vol: 0.016, sector: "commodity", cat: "commodity" },
  { sym: "CORN", name: "Corn (bu)", base: 4.25, vol: 0.016, sector: "commodity", cat: "commodity" },
];
const DEFAULT_SYMS = COINS.filter((c) => c.def).map((c) => c.sym);
const EXCHANGES = ["Binance", "OKX", "BingX", "MEXC"];
// realistic tiny price spreads between exchanges (fraction)
const EX_OFFSET = { Binance: 0, OKX: 0.0008, BingX: -0.0011, MEXC: 0.0015 };

function seededSeries(base, vol, n = 120) {
  const out = []; let p = base * (0.97 + Math.random() * 0.06);
  for (let i = 0; i < n; i++) {
    const open = p;
    const close = p * (1 + (Math.random() - 0.5) * vol);
    const hi = Math.max(open, close) * (1 + Math.random() * vol * 0.6);
    const lo = Math.min(open, close) * (1 - Math.random() * vol * 0.6);
    out.push({ t: i, price: close, open, close, high: hi, low: lo, volume: base * (0.6 + Math.random()) * 1000, up: close >= open });
    p = close;
  }
  return out;
}
function rsi(series, period = 14) {
  const prices = series.map((d) => d.price); let g = 0, l = 0;
  for (let i = 1; i <= period; i++) { const d = prices[i] - prices[i - 1]; if (d >= 0) g += d; else l -= d; }
  let aG = g / period, aL = l / period;
  for (let i = period + 1; i < prices.length; i++) { const d = prices[i] - prices[i - 1]; aG = (aG * (period - 1) + Math.max(d, 0)) / period; aL = (aL * (period - 1) + Math.max(-d, 0)) / period; }
  const rs = aL === 0 ? 100 : aG / aL; return 100 - 100 / (1 + rs);
}
function ema(series, period) {
  const k = 2 / (period + 1); let prev = series[0].price;
  return series.map((d, i) => { prev = i === 0 ? d.price : d.price * k + prev * (1 - k); return prev; });
}
function emaArr(arr, period) {
  const k = 2 / (period + 1); let prev = arr[0];
  return arr.map((v, i) => { prev = i === 0 ? v : v * k + prev * (1 - k); return prev; });
}
function sma(prices, period, idx) {
  const start = Math.max(0, idx - period + 1); let s = 0, n = 0;
  for (let i = start; i <= idx; i++) { s += prices[i]; n++; }
  return s / n;
}
/* ---- indicator suite: each returns {state:'bull'|'bear'|'neutral', value, detail} ---- */
function calcMACD(series) {
  const prices = series.map((d) => d.price);
  const e12 = emaArr(prices, 12), e26 = emaArr(prices, 26);
  const macd = e12.map((v, i) => v - e26[i]);
  const signal = emaArr(macd, 9);
  const hist = macd[macd.length - 1] - signal[signal.length - 1];
  // divergence: price higher high but macd lower high (last 30)
  const w = prices.slice(-30), mw = macd.slice(-30);
  const pHi = Math.max(...w), mHiIdx = mw.indexOf(Math.max(...mw));
  const recentPriceHi = w[w.length - 1] >= pHi * 0.999;
  const div = recentPriceHi && mHiIdx < w.length - 5;
  return { state: hist > 0 ? "bull" : "bear", value: hist, hist, div };
}
function calcMA(series) {
  const prices = series.map((d) => d.price);
  const i = prices.length - 1;
  const ma50 = sma(prices, 50, i), ma200 = sma(prices, 200, i);
  const price = prices[i];
  const golden = ma50 > ma200;
  const state = price > ma50 && golden ? "bull" : price < ma50 && !golden ? "bear" : "neutral";
  return { state, ma50, ma200, golden, price };
}
function calcBoll(series, period = 20, mult = 2) {
  const prices = series.map((d) => d.price);
  const i = prices.length - 1;
  const mid = sma(prices, period, i);
  const start = Math.max(0, i - period + 1);
  let v = 0, n = 0;
  for (let j = start; j <= i; j++) { v += (prices[j] - mid) ** 2; n++; }
  const sd = Math.sqrt(v / n);
  const upper = mid + mult * sd, lower = mid - mult * sd;
  const price = prices[i];
  const pctB = (price - lower) / (upper - lower);
  const state = pctB > 0.95 ? "bear" : pctB < 0.05 ? "bull" : "neutral"; // band touch = mean reversion bias
  return { state, upper, lower, mid, pctB, price };
}
function calcADX(series, period = 14) {
  const h = series.map((d) => d.price * 1.004);
  const l = series.map((d) => d.price * 0.996);
  const c = series.map((d) => d.price);
  let tr = [], pDM = [], nDM = [];
  for (let i = 1; i < c.length; i++) {
    tr.push(Math.max(h[i] - l[i], Math.abs(h[i] - c[i - 1]), Math.abs(l[i] - c[i - 1])));
    const up = h[i] - h[i - 1], dn = l[i - 1] - l[i];
    pDM.push(up > dn && up > 0 ? up : 0);
    nDM.push(dn > up && dn > 0 ? dn : 0);
  }
  const atr = emaArr(tr, period), pdi = emaArr(pDM, period).map((v, i) => 100 * v / atr[i]);
  const ndi = emaArr(nDM, period).map((v, i) => 100 * v / atr[i]);
  const dx = pdi.map((v, i) => 100 * Math.abs(v - ndi[i]) / (v + ndi[i] || 1));
  const adx = emaArr(dx, period);
  const a = adx[adx.length - 1];
  const trend = a > 25;
  return { value: a, trend, state: !trend ? "neutral" : pdi[pdi.length - 1] > ndi[ndi.length - 1] ? "bull" : "bear" };
}
function calcVWAP(series) {
  let pv = 0, vv = 0;
  series.slice(-50).forEach((d) => { pv += d.price * d.volume; vv += d.volume; });
  const vwap = pv / vv;
  const price = series[series.length - 1].price;
  return { vwap, price, state: price > vwap ? "bull" : "bear" };
}
function calcStoch(series, period = 14) {
  const w = series.slice(-period).map((d) => d.price);
  const hi = Math.max(...w), lo = Math.min(...w);
  const k = ((series[series.length - 1].price - lo) / (hi - lo || 1)) * 100;
  return { value: k, state: k > 80 ? "bear" : k < 20 ? "bull" : "neutral" };
}
function calcFib(series, lookback = 80) {
  const w = series.slice(-lookback);
  const prices = w.map((d) => d.price);
  const hi = Math.max(...prices), lo = Math.min(...prices);
  const hiIdx = prices.indexOf(hi), loIdx = prices.indexOf(lo);
  const up = hiIdx > loIdx; // most recent swing direction
  const range = hi - lo;
  const ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  // in an up-swing, retracement levels measured down from the high
  const levels = ratios.map((r) => ({
    r,
    price: up ? hi - range * r : lo + range * r,
  })).sort((a, b) => b.price - a.price);
  const price = series[series.length - 1].price;
  // find nearest level above (resistance) and below (support)
  let support = null, resistance = null;
  for (const lv of levels) {
    if (lv.price <= price && (!support || lv.price > support.price)) support = lv;
    if (lv.price >= price && (!resistance || lv.price < resistance.price)) resistance = lv;
  }
  // golden pocket = between .618 and .65; bias bull if holding above .618
  const gp = levels.find((l) => l.r === 0.618);
  const state = up
    ? (price > gp.price ? "bull" : "bear")
    : (price < gp.price ? "bear" : "bull");
  return { hi, lo, up, levels, price, support, resistance, gp, state };
}
function calcVolumeProfile(series, bins = 14, lookback = 80) {
  const w = series.slice(-lookback);
  const prices = w.map((d) => d.price);
  const hi = Math.max(...prices), lo = Math.min(...prices);
  const range = hi - lo || 1;
  const buckets = Array.from({ length: bins }, (_, i) => ({
    lo: lo + (range / bins) * i, hi: lo + (range / bins) * (i + 1), vol: 0, buyVol: 0,
  }));
  w.forEach((d) => {
    let idx = Math.floor(((d.price - lo) / range) * bins);
    if (idx >= bins) idx = bins - 1; if (idx < 0) idx = 0;
    buckets[idx].vol += d.volume;
    if (d.up) buckets[idx].buyVol += d.volume;
  });
  const maxVol = Math.max(...buckets.map((b) => b.vol)) || 1;
  // POC = point of control (highest volume price level)
  const pocIdx = buckets.reduce((m, b, i, arr) => (b.vol > arr[m].vol ? i : m), 0);
  const poc = (buckets[pocIdx].lo + buckets[pocIdx].hi) / 2;
  // value area = 70% of volume around POC
  const totalVol = buckets.reduce((a, b) => a + b.vol, 0);
  let included = [pocIdx]; let acc = buckets[pocIdx].vol;
  let loP = pocIdx - 1, hiP = pocIdx + 1;
  while (acc < totalVol * 0.7 && (loP >= 0 || hiP < bins)) {
    const loV = loP >= 0 ? buckets[loP].vol : -1;
    const hiV = hiP < bins ? buckets[hiP].vol : -1;
    if (hiV >= loV) { if (hiP < bins) { included.push(hiP); acc += buckets[hiP].vol; hiP++; } else { included.push(loP); acc += buckets[loP].vol; loP--; } }
    else { if (loP >= 0) { included.push(loP); acc += buckets[loP].vol; loP--; } else { included.push(hiP); acc += buckets[hiP].vol; hiP++; } }
  }
  const vaLo = buckets[Math.min(...included)].lo;
  const vaHi = buckets[Math.max(...included)].hi;
  return { buckets, maxVol, poc, vaLo, vaHi, hi, lo, price: series[series.length - 1].price };
}
function calcStructure(series, lookback = 70) {
  const w = series.slice(-lookback);
  // detect swing highs/lows with a small fractal window
  const swings = [];
  const k = 3;
  for (let i = k; i < w.length - k; i++) {
    const p = w[i].price;
    let isHigh = true, isLow = true;
    for (let j = 1; j <= k; j++) {
      if (w[i - j].price >= p || w[i + j].price >= p) isHigh = false;
      if (w[i - j].price <= p || w[i + j].price <= p) isLow = false;
    }
    if (isHigh) swings.push({ i, price: p, type: "H" });
    if (isLow) swings.push({ i, price: p, type: "L" });
  }
  // classify last event as BOS (continuation) or CHoCH (reversal)
  const highs = swings.filter((s) => s.type === "H");
  const lows = swings.filter((s) => s.type === "L");
  const lastTwoH = highs.slice(-2), lastTwoL = lows.slice(-2);
  const hh = lastTwoH.length === 2 && lastTwoH[1].price > lastTwoH[0].price;
  const ll = lastTwoL.length === 2 && lastTwoL[1].price < lastTwoL[0].price;
  let trend = "range", event = "—";
  if (hh && !ll) { trend = "up"; event = "BOS"; }
  else if (ll && !hh) { trend = "down"; event = "BOS"; }
  else if (hh && ll) { trend = "range"; event = "CHoCH"; }
  const lastSwing = swings[swings.length - 1];
  const state = trend === "up" ? "bull" : trend === "down" ? "bear" : "neutral";
  return { swings, trend, event, state, lastSwing,
    recentHigh: highs.length ? highs[highs.length - 1].price : null,
    recentLow: lows.length ? lows[lows.length - 1].price : null };
}
const fmt = (n) => { if (n == null || isNaN(n)) return "—"; return n >= 1000 ? n.toLocaleString("en-US", { maximumFractionDigits: 0 }) : n >= 1 ? n.toFixed(2) : n.toFixed(4); };
const fmtUsd = (n) => "$" + fmt(n);
const fmtBig = (n) => { if (n == null || isNaN(n)) return "—"; return n >= 1e9 ? "$" + (n / 1e9).toFixed(2) + "B" : n >= 1e6 ? "$" + (n / 1e6).toFixed(1) + "M" : "$" + (n / 1e3).toFixed(0) + "K"; };

/* ================================ palette ================================== */
/* color rule: green = up, red = down — used consistently everywhere */
const C = {
  bg: "#0B0E14", panel: "#11151F", panel2: "#161B27", line: "#1F2735",
  text: "#E6E9EF", dim: "#7A8496", amber: "#F4B740",
  green: "#36D399", red: "#F6655A", blue: "#5B8DEF", violet: "#9b7bd4",
};

/* ============================ responsive hook ============================== */
function useIsMobile(bp = 720) {
  const [m, setM] = useState(typeof window !== "undefined" ? window.innerWidth < bp : false);
  useEffect(() => {
    const on = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", on); on();
    return () => window.removeEventListener("resize", on);
  }, [bp]);
  return m;
}

/* ============================== small widgets ============================== */
function Stat({ label, value, sub, tone }) {
  const col = tone === "up" ? C.green : tone === "down" ? C.red : C.text;
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1, color: C.dim, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 17, color: col, marginTop: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.dim, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}
function Panel({ title, icon, right, children, style }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          {icon}<span style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
function WhaleTape({ events }) {
  return (
    <div style={{ overflow: "hidden", background: "#0E1219", borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap", height: 32, display: "flex", alignItems: "center" }}>
      <div style={{ display: "inline-flex", gap: 24, paddingLeft: 16, animation: "tape 38s linear infinite" }}>
        {[...events, ...events].map((e, i) => {
          const inflow = e.dir === "in";
          return (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
              <Waves size={12} color={C.amber} /><b style={{ color: C.text }}>{e.sym}</b>
              <span style={{ color: inflow ? C.red : C.green }}>{inflow ? "→ " : "← "}{e.ex} {fmtBig(e.usd)}</span>
              <span style={{ color: C.dim }}>{e.tag}</span>
            </span>
          );
        })}
      </div>
      <style>{`@keyframes tape{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){[style*="tape "]{animation:none!important}}
        ::-webkit-scrollbar{height:0;width:0}`}</style>
    </div>
  );
}

/* ============================== candlestick chart ========================= */
function CandleChart({ data, isMobile }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const measure = () => { if (ref.current) setW(ref.current.clientWidth); };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const padR = 56, padL = 6, padT = 6, padB = 6;
  const h = isMobile ? 200 : 230;
  const plotW = Math.max(50, w - padR - padL);
  const plotH = h - padT - padB;

  // only render candles that have valid OHLC
  const candles = (data || []).filter((d) => d && d.high != null && d.low != null && d.open != null && d.close != null);
  if (candles.length === 0) {
    return <div ref={ref} style={{ width: "100%", height: h }} />;
  }

  const highs = candles.map((d) => d.high);
  const lows = candles.map((d) => d.low);
  const hi = Math.max(...highs), lo = Math.min(...lows);
  const range = hi - lo || 1;
  const pad = range * 0.05;
  const yMax = hi + pad, yMin = lo - pad;
  const yToPx = (price) => padT + (1 - (price - yMin) / (yMax - yMin)) * plotH;
  const n = candles.length;
  const slot = plotW / n;
  const bodyW = Math.max(2, Math.min(slot * 0.62, 14));

  // EMA polylines (skip points with missing ema)
  const emaPath = (key) => candles.map((d, i) => {
    if (d[key] == null || isNaN(d[key])) return "";
    const x = padL + slot * i + slot / 2;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${yToPx(d[key]).toFixed(1)}`;
  }).filter(Boolean).join(" ").replace(/^L/, "M");

  // price axis ticks
  const ticks = 5;
  const tickVals = Array.from({ length: ticks }, (_, i) => yMin + ((yMax - yMin) / (ticks - 1)) * i);

  const last = candles[n - 1];

  return (
    <div ref={ref} style={{ width: "100%", height: h, position: "relative" }}>
      <svg width={w} height={h}>
        {/* grid + axis labels */}
        {tickVals.map((tv, i) => {
          const y = yToPx(tv);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke={C.line} strokeOpacity={0.5} strokeDasharray="2 4" />
              <text x={w - padR + 4} y={y + 3} fill={C.dim} fontSize="10" fontFamily="ui-monospace">{fmt(tv)}</text>
            </g>
          );
        })}
        {/* high / low reference */}
        <line x1={padL} y1={yToPx(hi)} x2={padL + plotW} y2={yToPx(hi)} stroke={C.red} strokeOpacity={0.35} strokeDasharray="3 3" />
        <line x1={padL} y1={yToPx(lo)} x2={padL + plotW} y2={yToPx(lo)} stroke={C.green} strokeOpacity={0.35} strokeDasharray="3 3" />
        {/* candles */}
        {candles.map((d, i) => {
          const x = padL + slot * i + slot / 2;
          const up = d.close >= d.open;
          const col = up ? C.green : C.red;
          const yO = yToPx(d.open), yC = yToPx(d.close);
          const bodyTop = Math.min(yO, yC);
          const bodyH = Math.max(1.5, Math.abs(yC - yO));
          return (
            <g key={i}>
              <line x1={x} y1={yToPx(d.high)} x2={x} y2={yToPx(d.low)} stroke={col} strokeWidth={1} />
              <rect x={x - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={col} rx={1} />
            </g>
          );
        })}
        {/* EMA overlays */}
        <path d={emaPath("ema12")} fill="none" stroke={C.blue} strokeWidth={1.2} opacity={0.9} />
        <path d={emaPath("ema26")} fill="none" stroke={C.violet} strokeWidth={1.2} opacity={0.9} />
        {/* last price line */}
        <line x1={padL} y1={yToPx(last.close)} x2={padL + plotW} y2={yToPx(last.close)} stroke={C.amber} strokeWidth={0.8} strokeDasharray="2 2" opacity={0.7} />
        <rect x={w - padR} y={yToPx(last.close) - 8} width={padR} height={16} fill={C.amber} />
        <text x={w - padR + 4} y={yToPx(last.close) + 3} fill="#0B0E14" fontSize="10" fontFamily="ui-monospace" fontWeight="700">{fmt(last.close)}</text>
      </svg>
    </div>
  );
}

/* ================================== app =================================== */
export default function CryptoTerminal() {
  const isMobile = useIsMobile();
  const [lang, setLang] = useState("zh");
  const t = T[lang];
  const [tab, setTab] = useState("dash");
  const [active, setActive] = useState("BTC");
  const [watchSyms, setWatchSyms] = useState(DEFAULT_SYMS);
  const [tf, setTf] = useState("15m");
  const [exchange, setExchange] = useState("Binance");
  const [positions, setPositions] = useState([
    { id: 1, sym: "BTC", qty: 0.15, entry: 61200 },
    { id: 2, sym: "ETH", qty: 2.5, entry: 3050 },
    { id: 3, sym: "SOL", qty: 40, entry: 145 },
  ]);
  const [tick, setTick] = useState(0);
  const [journal, setJournal] = useState([
    { id: 1, sym: "BTC", side: "long", entry: 61000, exit: 66800, qty: 2000, reason: "", result: "", lang: "zh",
      reasonZh: "突破前高、OI 上升", resultZh: "達標出場，紀律執行", reasonEn: "Broke prior high, OI rising", resultEn: "Hit target, disciplined exit" },
    { id: 2, sym: "SOL", side: "long", entry: 175, exit: 158, qty: 1500, reason: "", result: "",
      reasonZh: "追高進場、無訊號共振", resultZh: "追高被套，違反紀律", reasonEn: "Chased the pump, no confluence", resultEn: "Got trapped chasing — broke my rules" },
    { id: 3, sym: "ETH", side: "long", entry: 3050, exit: null, qty: 1800, reason: "", result: "",
      reasonZh: "守住 0.618、結構轉多", resultZh: "", reasonEn: "Held 0.618, structure turned up", resultEn: "" },
  ]);
  const [alerts, setAlerts] = useState([
    { sym: "BTC", condEn: "> 68,000", condZh: "> 68,000", on: true },
    { sym: "SOL", condEn: "Whale inflow > $5M", condZh: "巨鯨流入 > $5M", on: true },
  ]);

  const dataRef = useRef(null);
  if (!dataRef.current) { dataRef.current = {}; COINS.forEach((c) => (dataRef.current[c.sym] = seededSeries(c.base, c.vol))); }

  useEffect(() => { const id = setInterval(() => setTick((x) => x + 1), 2200); return () => clearInterval(id); }, []);
  useEffect(() => {
    // only drift the coins actually on screen (active + watchlist) — keeps it smooth with 300+ assets
    const visible = new Set([active, ...watchSyms]);
    COINS.forEach((c) => {
      if (!visible.has(c.sym)) return;
      const s = dataRef.current[c.sym]; const last = s[s.length - 1];
      const open = last.price;
      const np = open * (1 + (Math.random() - 0.5) * c.vol);
      const hi = Math.max(open, np) * (1 + Math.random() * c.vol * 0.6);
      const lo = Math.min(open, np) * (1 - Math.random() * c.vol * 0.6);
      s.push({ t: last.t + 1, price: np, open, close: np, high: hi, low: lo, volume: c.base * (0.6 + Math.random()) * 1000, up: np >= open });
      if (s.length > 140) s.shift();
    });
  }, [tick]);

  const coin = COINS.find((c) => c.sym === active);
  const rawSeries = dataRef.current[active];
  const exMul = 1 + (EX_OFFSET[exchange] || 0);
  // apply exchange spread to a display copy of the series
  const series = useMemo(() => rawSeries.map((d) => ({
    ...d,
    price: d.price * exMul, open: d.open * exMul, close: d.close * exMul,
    high: d.high * exMul, low: d.low * exMul,
  })), [active, tick, exMul]);
  const price = series[series.length - 1].price;
  const prev = series[series.length - 24]?.price ?? series[0].price;
  const chg = ((price - prev) / prev) * 100;
  const ema12 = useMemo(() => ema(series, 12), [active, tick, exMul]);
  const ema26 = useMemo(() => ema(series, 26), [active, tick, exMul]);
  const chartData = series.map((d, i) => ({ t: i, price: d.price, open: d.open, close: d.close, high: d.high, low: d.low, volume: d.volume, up: d.up, ema12: ema12[i], ema26: ema26[i] }));
  const rsiVal = rsi(series);
  const high = Math.max(...series.map((d) => d.price));
  const low = Math.min(...series.map((d) => d.price));
  const macdCross = ema12[ema12.length - 1] > ema26[ema26.length - 1];
  const buyVol = series.slice(-20).filter((d) => d.up).reduce((a, d) => a + d.volume, 0);
  const sellVol = series.slice(-20).filter((d) => !d.up).reduce((a, d) => a + d.volume, 0);
  const buyPct = (buyVol / (buyVol + sellVol)) * 100;

  // multi-timeframe table: derive trend & RSI from the series sampled at different strides
  const TF_LIST = ["5m", "15m", "30m", "1H", "4H", "1D"];
  const TF_STRIDE = { "5m": 1, "15m": 2, "30m": 3, "1H": 4, "4H": 8, "1D": 16 };
  const mtfRows = TF_LIST.map((tfx) => {
    const stride = TF_STRIDE[tfx];
    // sample every `stride`-th candle to emulate a higher timeframe
    const sampled = series.filter((_, i) => i % stride === 0);
    const use = sampled.length >= 30 ? sampled : series;
    const e12 = ema(use, 12), e26 = ema(use, 26);
    const trendUp = e12[e12.length - 1] > e26[e26.length - 1];
    const r = rsi(use);
    const state = trendUp && r > 50 ? "bull" : !trendUp && r < 50 ? "bear" : "neutral";
    return { tf: tfx, trendUp, rsi: r, state };
  });
  const mtfBulls = mtfRows.filter((r) => r.state === "bull").length;
  const mtfBears = mtfRows.filter((r) => r.state === "bear").length;
  const mtfVerdict = mtfBulls === mtfRows.length || mtfBears === mtfRows.length
    ? "align" : (mtfBulls > 0 && mtfBears > 0) ? "conflict" : "mixed";

  const whaleEvents = useMemo(() => Array.from({ length: 8 }).map(() => {
    const c = COINS[Math.floor(Math.random() * COINS.length)];
    return { sym: c.sym, ex: EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)], dir: Math.random() > 0.5 ? "in" : "out", usd: (1 + Math.random() * 28) * 1e6, tag: Math.random() > 0.5 ? "smart money" : "whale" };
  }), [Math.floor(tick / 4)]);
  const netFlow = whaleEvents.reduce((a, e) => a + (e.dir === "out" ? e.usd : -e.usd), 0);

  const GROUPS = [
    { id: "market", label: t.grp_market, icon: <LayoutDashboard size={15} />, tabs: [
      { id: "dash", label: t.tab_dash, icon: <LayoutDashboard size={15} /> },
    ] },
    { id: "analysis", label: t.grp_analysis, icon: <Activity size={15} />, tabs: [
      { id: "ta", label: t.tab_ta, icon: <Activity size={15} /> },
      { id: "fut", label: t.tab_fut, icon: <Layers size={15} /> },
    ] },
    { id: "assets", label: t.grp_assets, icon: <Wallet size={15} />, tabs: [
      { id: "pf", label: t.tab_pf, icon: <Wallet size={15} /> },
      { id: "jr", label: t.tab_jr, icon: <NotebookPen size={15} /> },
    ] },
    { id: "tools", label: t.grp_tools, icon: <Shield size={15} />, tabs: [
      { id: "risk", label: t.tab_risk, icon: <Shield size={15} /> },
      { id: "info", label: t.tab_info, icon: <BookOpen size={15} /> },
    ] },
  ];
  const activeGroup = GROUPS.find((g) => g.tabs.some((tb) => tb.id === tab)) || GROUPS[0];

  const scrollRow = { display: "flex", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "ui-sans-serif, system-ui" }}>
      {/* ---- header ---- */}
      <div style={{ padding: isMobile ? "10px 12px" : "12px 18px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: C.amber, display: "grid", placeItems: "center", flexShrink: 0 }}><Activity size={16} color="#0B0E14" /></div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, letterSpacing: 1, whiteSpace: "nowrap" }}>ABYSS<span style={{ color: C.amber }}>·</span>{t.brand_sub}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => setLang(lang === "zh" ? "en" : "zh")} style={{
              display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${C.line}`,
              color: C.text, borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13, minHeight: 38,
            }}><Globe size={15} color={C.amber} />{t.lang}</button>
            {!isMobile && <Settings size={16} color={C.dim} />}
          </div>
        </div>

        {/* connection status — own line on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.green, marginTop: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          <span style={{ width: 7, height: 7, borderRadius: 9, background: C.green, boxShadow: `0 0 8px ${C.green}`, flexShrink: 0 }} />
          <span style={{ fontFamily: "ui-monospace", whiteSpace: "nowrap" }}>{EXCHANGES.join(" · ")} {t.connected}</span>
        </div>

        {/* primary group nav */}
        <div style={{ ...scrollRow, marginTop: 10 }}>
          {GROUPS.map((g) => {
            const isActive = g.id === activeGroup.id;
            return (
              <button key={g.id} onClick={() => setTab(g.tabs[0].id)} style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 9, cursor: "pointer",
                background: isActive ? C.amber : "transparent", color: isActive ? "#0B0E14" : C.dim,
                border: `1px solid ${isActive ? C.amber : C.line}`, fontSize: 14, whiteSpace: "nowrap", minHeight: 40, flexShrink: 0, fontWeight: 600,
              }}>{g.icon}{g.label}</button>
            );
          })}
        </div>
        {/* secondary sub-tabs (only when group has more than one) */}
        {activeGroup.tabs.length > 1 && (
          <div style={{ ...scrollRow, marginTop: 8 }}>
            {activeGroup.tabs.map((x) => (
              <button key={x.id} onClick={() => setTab(x.id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, cursor: "pointer",
                background: tab === x.id ? C.panel2 : "transparent", color: tab === x.id ? C.amber : C.dim,
                border: `1px solid ${tab === x.id ? C.amber + "88" : C.line}`, fontSize: 13, whiteSpace: "nowrap", minHeight: 36, flexShrink: 0,
              }}>{x.icon}{x.label}</button>
            ))}
          </div>
        )}
      </div>

      <WhaleTape events={whaleEvents} />

      {tab === "dash" && (
        <Dashboard {...{ t, lang, isMobile, active, setActive, tf, setTf, coin, price, chg, chartData, rsiVal, high, low, macdCross, buyPct, whaleEvents, netFlow, dataRef, alerts, setAlerts, scrollRow, exMul, exchange, setExchange, mtfRows, mtfVerdict, mtfBulls, mtfBears, watchSyms, setWatchSyms }} />
      )}
      {tab === "ta" && (
        <TechnicalAnalysis {...{ t, lang, isMobile, coin, series, price, buyPct }} />
      )}
      {tab === "risk" && (
        <RiskManager {...{ t, isMobile, coin, price, series }} />
      )}
      {tab === "fut" && (
        <FuturesData {...{ t, lang, isMobile, coin, price, series, buyPct }} />
      )}
      {tab === "pf" && (
        <Portfolio {...{ t, lang, isMobile, dataRef, exMul, positions, setPositions }} />
      )}
      {tab === "jr" && (
        <Journal {...{ t, lang, isMobile, journal, setJournal }} />
      )}
      {tab === "info" && (
        <GuideTab t={t} isMobile={isMobile} />
      )}

      <div style={{ textAlign: "center", fontSize: 10, color: C.dim, padding: "8px 16px 20px", fontFamily: "ui-monospace", lineHeight: 1.5 }}>{t.foot}</div>
    </div>
  );
}

/* =============================== dashboard ================================= */
function Dashboard({ t, lang, isMobile, active, setActive, tf, setTf, coin, price, chg, chartData, rsiVal, high, low, macdCross, buyPct, whaleEvents, netFlow, dataRef, alerts, setAlerts, scrollRow, exMul, exchange, setExchange, mtfRows, mtfVerdict, mtfBulls, mtfBears, watchSyms, setWatchSyms }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [manage, setManage] = useState(false);
  const cols = isMobile ? "1fr" : "minmax(0,1fr) 300px";

  const SECTORS = [
    ["all", t.cat_all], ["major", t.sec_major], ["layer1", t.sec_layer1], ["layer2", t.sec_layer2],
    ["defi", t.sec_defi], ["ai", t.sec_ai], ["meme", t.sec_meme], ["gaming", t.sec_gaming], ["commodity", t.sec_commodity],
  ];
  const SECTOR_LABEL = Object.fromEntries(SECTORS.map(([id, l]) => [id, l]));
  const SECTOR_COLOR = { major: C.amber, layer1: C.blue, layer2: "#6fa8ff", defi: C.green, ai: C.violet, meme: "#ff8fb0", gaming: "#ffb454", commodity: "#d4af37" };

  /* watchlist + search */
  const q = search.trim().toLowerCase();
  const matchCat = (c) => cat === "all" || c.sector === cat;
  const searchResults = (q || cat !== "all")
    ? COINS.filter((c) => matchCat(c) && (!q || c.sym.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))).slice(0, 12)
    : [];
  const showDrop = q || cat !== "all";
  const watchedCoins = watchSyms.map((sym) => COINS.find((c) => c.sym === sym)).filter(Boolean);

  const coinPrice = (c) => {
    const s = dataRef.current[c.sym];
    const p = s[s.length - 1].price * exMul;
    const pv = (s[s.length - 24]?.price ?? s[0].price) * exMul;
    return { p, ch: ((p - pv) / pv) * 100 };
  };

  const SectorBadge = ({ sector }) => (
    <span style={{ fontSize: 9, color: SECTOR_COLOR[sector] || C.dim, border: `1px solid ${SECTOR_COLOR[sector] || C.dim}`, borderRadius: 20, padding: "1px 6px", flexShrink: 0 }}>
      {SECTOR_LABEL[sector] || sector}
    </span>
  );

  const SearchBox = (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: "0 10px" }}>
        <Search size={15} color={C.dim} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search_ph}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text, fontSize: 14, padding: "11px 8px", minWidth: 0 }} />
        {(search || cat !== "all") && <button onClick={() => { setSearch(""); setCat("all"); }} style={{ background: "transparent", border: "none", color: C.dim, cursor: "pointer", fontSize: 18, padding: 0 }}>×</button>}
      </div>
      {/* sector chips — always visible, scrollable */}
      <div style={{ ...scrollRow, marginTop: 8, paddingBottom: 2 }}>
        {SECTORS.map(([id, label]) => (
          <button key={id} onClick={() => setCat(id)} style={{
            fontSize: 11, padding: "6px 12px", borderRadius: 20, cursor: "pointer", minHeight: 32, flexShrink: 0,
            background: cat === id ? C.amber : C.panel, color: cat === id ? "#0B0E14" : C.dim,
            border: `1px solid ${cat === id ? C.amber : C.line}`, fontWeight: 600, whiteSpace: "nowrap",
          }}>{label}</button>
        ))}
      </div>
      {showDrop && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", maxHeight: 360, overflowY: "auto" }}>
          {searchResults.length === 0 && (
            <div style={{ padding: 14, color: C.dim, fontSize: 13, textAlign: "center" }}>{t.search_none}</div>
          )}
          {searchResults.map((c) => {
            const added = watchSyms.includes(c.sym);
            const { p, ch } = coinPrice(c);
            return (
              <div key={c.sym} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${C.line}`, gap: 10 }}>
                <button onClick={() => { setActive(c.sym); if (!added) setWatchSyms((w) => [...w, c.sym]); setSearch(""); setCat("all"); }}
                  style={{ flex: 1, textAlign: "left", background: "transparent", border: "none", cursor: "pointer", color: C.text, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <b style={{ fontSize: 14 }}>{c.sym}</b>
                    <SectorBadge sector={c.sector} />
                    <span style={{ fontSize: 12, color: C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  </div>
                  <div style={{ fontFamily: "ui-monospace", fontSize: 12, color: C.dim, marginTop: 2 }}>{fmtUsd(p)} <span style={{ color: ch >= 0 ? C.green : C.red }}>{ch >= 0 ? "+" : ""}{ch.toFixed(2)}%</span></div>
                </button>
                <button onClick={() => setWatchSyms((w) => added ? w.filter((s) => s !== c.sym) : [...w, c.sym])}
                  style={{ flexShrink: 0, background: added ? "transparent" : C.amber, color: added ? C.dim : "#0B0E14",
                    border: `1px solid ${added ? C.line : C.amber}`, borderRadius: 7, fontSize: 12, padding: "7px 12px", cursor: "pointer", minHeight: 34, fontWeight: 600 }}>
                  {added ? "✓" : "+ " + t.search_add}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const Watchlist = (
    <div>
      {/* header with manage toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
        <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.dim }}>{t.wl_title}</span>
        {watchedCoins.length > 0 && (
          <button onClick={() => setManage((m) => !m)} style={{ background: "transparent", border: "none", color: manage ? C.amber : C.dim, cursor: "pointer", fontSize: 12, minHeight: 28 }}>
            {manage ? t.wl_done : t.wl_manage}
          </button>
        )}
      </div>
      <div style={isMobile
        ? { ...scrollRow, padding: "0 2px" }
        : { display: "flex", flexDirection: "column", gap: 6 }}>
        {watchedCoins.length === 0 && (
          <div style={{ padding: 12, color: C.dim, fontSize: 12, textAlign: "center", border: `1px dashed ${C.line}`, borderRadius: 10, width: "100%" }}>{t.wl_empty}</div>
        )}
        {watchedCoins.map((c) => {
          const { p, ch } = coinPrice(c);
          const sel = c.sym === active;
          return (
            <div key={c.sym} style={{ position: "relative", flexShrink: 0 }}>
              <button onClick={() => setActive(c.sym)} style={{
                width: "100%", textAlign: "left", background: sel ? C.panel2 : C.panel, border: `1px solid ${sel ? C.amber : C.line}`,
                borderRadius: 10, padding: "10px 13px", cursor: "pointer", color: C.text,
                minWidth: isMobile ? 124 : undefined, minHeight: 52,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <b style={{ fontSize: 14 }}>{c.sym}</b>
                    <SectorBadge sector={c.sector} />
                  </span>
                  <span style={{ fontSize: 12, color: ch >= 0 ? C.green : C.red, fontFamily: "ui-monospace" }}>{ch >= 0 ? "+" : ""}{ch.toFixed(2)}%</span>
                </div>
                <div style={{ fontFamily: "ui-monospace", fontSize: 12, color: C.dim, marginTop: 3 }}>{fmtUsd(p)}</div>
              </button>
              {manage && (
                <button onClick={() => setWatchSyms((w) => w.filter((s) => s !== c.sym))} style={{
                  position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: 22,
                  background: C.red, color: "#fff", border: `2px solid ${C.bg}`, cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0, zIndex: 2,
                }}>×</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const PricePanel = (
    <Panel title={`${coin.name} / ${coin.cat === "commodity" ? "USD" : "USDT"}`} icon={chg >= 0 ? <TrendingUp size={15} color={C.green} /> : <TrendingDown size={15} color={C.red} />}
      right={<select value={tf} onChange={(e) => setTf(e.target.value)} style={{
        background: C.panel2, color: C.amber, border: `1px solid ${C.line}`, borderRadius: 8,
        fontSize: 13, padding: "8px 10px", cursor: "pointer", fontFamily: "ui-monospace", minHeight: 36, outline: "none",
      }}>
        {["1m", "3m", "5m", "15m", "30m", "1H", "2H", "4H", "6H", "12H", "1D", "1W"].map((x) => (
          <option key={x} value={x} style={{ background: C.panel2, color: C.text }}>{x}</option>
        ))}
      </select>}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <select value={exchange} onChange={(e) => setExchange(e.target.value)} style={{
          background: C.panel2, color: C.text, border: `1px solid ${C.line}`, borderRadius: 8,
          fontSize: 12, padding: "6px 10px", cursor: "pointer", fontFamily: "ui-monospace", minHeight: 32, outline: "none",
        }}>
          {EXCHANGES.map((ex) => (
            <option key={ex} value={ex} style={{ background: C.panel2 }}>{ex}</option>
          ))}
        </select>
        <span style={{ fontSize: 10, color: C.dim }}>{t.ex_price_note}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "ui-monospace", fontSize: isMobile ? 26 : 30, fontWeight: 600 }}>{fmtUsd(price)}</span>
        <span style={{ fontFamily: "ui-monospace", fontSize: 14, color: chg >= 0 ? C.green : C.red }}>
          {chg >= 0 ? <ArrowUpRight size={14} style={{ display: "inline" }} /> : <ArrowDownRight size={14} style={{ display: "inline" }} />}{chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
        </span>
        <span style={{ fontSize: 11, color: C.dim, fontFamily: "ui-monospace" }}>{t.high} {fmtUsd(high)} · {t.low} {fmtUsd(low)}</span>
      </div>
      <div style={{ height: isMobile ? 200 : 230 }}>
        <CandleChart data={chartData.slice(-60)} isMobile={isMobile} />
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 10, color: C.dim, fontFamily: "ui-monospace", flexWrap: "wrap" }}>
        <span><span style={{ color: C.blue }}>━</span> EMA12</span>
        <span><span style={{ color: C.violet }}>━</span> EMA26</span>
        <span><span style={{ color: C.red }}>┅</span> {t.legend_res}</span>
        <span><span style={{ color: C.green }}>┅</span> {t.legend_sup}</span>
      </div>
    </Panel>
  );

  const VolPanel = (
    <Panel title={t.vol_title} icon={<Activity size={15} color={C.amber} />}>
      <div style={{ height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.slice(-50)} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <XAxis dataKey="t" hide />
            <YAxis orientation="right" width={56} tick={{ fill: C.dim, fontSize: 10, fontFamily: "ui-monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1e6).toFixed(0) + "M"} />
            <Tooltip cursor={{ fill: "#ffffff08" }} contentStyle={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 8, fontFamily: "ui-monospace", fontSize: 12 }} labelStyle={{ display: "none" }} formatter={(v) => [fmtBig(v), "vol"]} />
            <Bar dataKey="volume" radius={[2, 2, 0, 0]}>
              {chartData.slice(-50).map((d, i) => (<Cell key={i} fill={d.up ? C.green : C.red} fillOpacity={0.75} />))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", height: 8, borderRadius: 5, overflow: "hidden", marginTop: 10 }}>
        <div style={{ width: `${buyPct}%`, background: C.green }} /><div style={{ width: `${100 - buyPct}%`, background: C.red }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "ui-monospace", marginTop: 5 }}>
        <span style={{ color: C.green }}>{t.buy} {buyPct.toFixed(0)}%</span>
        <span style={{ color: C.red }}>{t.sell} {(100 - buyPct).toFixed(0)}%</span>
      </div>
    </Panel>
  );

  // Fear & Greed — derived from the coins that actually move (active + watchlist)
  const breadthSyms = [...new Set([active, ...watchSyms])];
  const allChg = breadthSyms.map((sym) => {
    const s = dataRef.current[sym];
    if (!s) return 0;
    const p = s[s.length - 1].price, pv = s[s.length - 24]?.price ?? s[0].price;
    return ((p - pv) / pv) * 100;
  });
  const avgChg = allChg.length ? allChg.reduce((a, b) => a + b, 0) / allChg.length : 0;
  // map avg 24h change (~ -6%..+6%) onto 0..100, blended with buy pressure
  const fng = Math.max(0, Math.min(100, Math.round(50 + avgChg * 6 + (buyPct - 50) * 0.4)));
  const fngBand = fng < 25 ? "ef" : fng < 45 ? "f" : fng < 56 ? "n" : fng < 75 ? "g" : "eg";
  const fngLabel = { ef: t.fng_ef, f: t.fng_f, n: t.fng_n, g: t.fng_g, eg: t.fng_eg }[fngBand];
  const fngColor = fng < 45 ? C.green : fng > 55 ? C.red : C.amber; // contrarian colors: fear=green(opportunity), greed=red(caution)
  const fngHint = fng < 30 ? t.fng_hint_fear : fng > 70 ? t.fng_hint_greed : t.fng_hint_neu;
  const fngHist = [
    { label: t.fng_yesterday, v: Math.max(0, Math.min(100, fng + Math.round((Math.sin(fng) * 8)))) },
    { label: t.fng_week, v: Math.max(0, Math.min(100, fng - Math.round((Math.cos(fng) * 12)))) },
  ];

  const MtfPanel = (
    <Panel title={t.mtf_title} icon={<Activity size={15} color={C.amber} />}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 0.9fr 1fr", gap: 4, fontSize: 11 }}>
        <div style={{ color: C.dim, fontFamily: "ui-monospace", paddingBottom: 6 }}>{t.mtf_tf}</div>
        <div style={{ color: C.dim, fontFamily: "ui-monospace", paddingBottom: 6 }}>{t.mtf_trend}</div>
        <div style={{ color: C.dim, fontFamily: "ui-monospace", paddingBottom: 6, textAlign: "right" }}>{t.mtf_rsi}</div>
        <div style={{ color: C.dim, fontFamily: "ui-monospace", paddingBottom: 6, textAlign: "right" }}>{t.mtf_signal}</div>
        {mtfRows.map((r, i) => {
          const col = r.state === "bull" ? C.green : r.state === "bear" ? C.red : C.dim;
          const label = r.state === "bull" ? t.bull : r.state === "bear" ? t.bear : t.neu;
          return (
            <React.Fragment key={i}>
              <div style={{ fontFamily: "ui-monospace", padding: "7px 0", borderTop: `1px solid ${C.line}`, fontWeight: 600 }}>{r.tf}</div>
              <div style={{ fontFamily: "ui-monospace", padding: "7px 0", borderTop: `1px solid ${C.line}`, color: r.trendUp ? C.green : C.red }}>
                {r.trendUp ? "▲ " : "▼ "}{r.trendUp ? "EMA↑" : "EMA↓"}
              </div>
              <div style={{ fontFamily: "ui-monospace", padding: "7px 0", borderTop: `1px solid ${C.line}`, textAlign: "right", color: r.rsi > 70 ? C.red : r.rsi < 30 ? C.green : C.text }}>{r.rsi.toFixed(0)}</div>
              <div style={{ padding: "7px 0", borderTop: `1px solid ${C.line}`, textAlign: "right" }}>
                <span style={{ fontFamily: "ui-monospace", fontSize: 10, color: col, border: `1px solid ${col}`, borderRadius: 20, padding: "2px 7px", background: col + "14" }}>{label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: C.panel2, borderRadius: 9,
        borderLeft: `2px solid ${mtfVerdict === "align" ? C.green : mtfVerdict === "conflict" ? C.red : C.amber}` }}>
        <div style={{ fontSize: 12, lineHeight: 1.5 }}>
          <b style={{ color: mtfVerdict === "align" ? C.green : mtfVerdict === "conflict" ? C.red : C.amber }}>
            ▲{mtfBulls} ▼{mtfBears} · </b>
          <span style={{ color: C.dim }}>
            {mtfVerdict === "align" ? t.mtf_align : mtfVerdict === "conflict" ? t.mtf_conflict : t.mtf_mixed}
          </span>
        </div>
      </div>
    </Panel>
  );

  const FngPanel = (
    <Panel title={t.fng_title} icon={<Activity size={15} color={C.amber} />}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* semicircle gauge */}
        <div style={{ position: "relative", width: 120, height: 72, flexShrink: 0 }}>
          <svg width="120" height="72" viewBox="0 0 120 72">
            <path d="M10 68 A50 50 0 0 1 110 68" fill="none" stroke={C.line} strokeWidth="10" strokeLinecap="round" />
            <path d="M10 68 A50 50 0 0 1 110 68" fill="none" stroke={fngColor} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(fng / 100) * 157} 157`} style={{ transition: "stroke-dasharray .4s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, top: 22, display: "grid", placeItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "ui-monospace", fontSize: 26, fontWeight: 700, color: fngColor, lineHeight: 1 }}>{fng}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "ui-monospace", fontSize: 16, color: fngColor }}>{fngLabel}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: C.dim, fontFamily: "ui-monospace" }}>
            {fngHist.map((h, i) => (
              <span key={i}>{h.label}: <b style={{ color: C.text }}>{h.v}</b></span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 12, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${fngColor}` }}>
        <div style={{ fontSize: 11, lineHeight: 1.55 }}>
          <b style={{ color: fngColor }}>{t.fng_contrarian} · </b>
          <span style={{ color: C.dim }}>{fngHint}</span>
        </div>
      </div>
    </Panel>
  );

  const WhalePanel = (
    <Panel title={t.whale_title} icon={<Waves size={15} color={C.amber} />}>
      <Stat label={t.net_flow} value={fmtBig(Math.abs(netFlow))} tone={netFlow >= 0 ? "up" : "down"} sub={netFlow >= 0 ? t.accumulation : t.distribution} />
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
        {whaleEvents.slice(0, 5).map((e, i) => {
          const inflow = e.dir === "in";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "ui-monospace", fontSize: 13 }}>
              <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
                <span style={{ width: 6, height: 6, borderRadius: 6, background: inflow ? C.red : C.green }} />
                <b>{e.sym}</b><span style={{ color: C.dim }}>{e.ex}</span>
              </span>
              <span style={{ color: inflow ? C.red : C.green }}>{inflow ? t.inflow : t.outflow} {fmtBig(e.usd)}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );

  const SigPanel = (
    <Panel title={t.sig_title} icon={<Zap size={15} color={C.amber} />}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Stat label="RSI (14)" value={rsiVal.toFixed(1)} tone={rsiVal > 70 ? "down" : rsiVal < 30 ? "up" : undefined} sub={rsiVal > 70 ? t.overbought : rsiVal < 30 ? t.oversold : t.neutral} />
        <Stat label="MACD" value={macdCross ? t.bullish : t.bearish} tone={macdCross ? "up" : "down"} sub={macdCross ? t.above : t.below} />
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ position: "relative", height: 8, borderRadius: 5, background: `linear-gradient(90deg, ${C.green}, ${C.dim}, ${C.red})` }}>
          <div style={{ position: "absolute", top: -3, left: `calc(${rsiVal}% - 7px)`, width: 14, height: 14, borderRadius: 14, background: C.text, border: `2px solid ${C.bg}` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.dim, marginTop: 4, fontFamily: "ui-monospace" }}><span>30</span><span>50</span><span>70</span></div>
      </div>
      <div style={{ marginTop: 14, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${C.amber}` }}>
        <div style={{ fontSize: 12, lineHeight: 1.55 }}>
          <b style={{ color: C.amber }}>{t.sig_read} · </b>
          <span style={{ color: C.dim }}>{macdCross && buyPct > 55 && netFlow > 0 ? t.read_bull : !macdCross && buyPct < 45 ? t.read_bear : t.read_mix}</span>
        </div>
      </div>
    </Panel>
  );

  const AlertPanel = (
    <Panel title={t.alerts_title} icon={<Bell size={15} color={C.amber} />}
      right={<button onClick={() => setAlerts((a) => [...a, { sym: active, condEn: `> ${fmt(price * 1.02)}`, condZh: `> ${fmt(price * 1.02)}`, on: true }])} style={{ background: "transparent", border: `1px solid ${C.line}`, color: C.amber, borderRadius: 7, fontSize: 12, padding: "7px 11px", cursor: "pointer", minHeight: 34 }}>{t.add}</button>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: C.panel2, borderRadius: 9, fontFamily: "ui-monospace", fontSize: 13 }}>
            <span><b>{a.sym}</b> <span style={{ color: C.dim }}>{lang === "zh" ? a.condZh : a.condEn}</span></span>
            <button onClick={() => setAlerts((arr) => arr.map((x, j) => j === i ? { ...x, on: !x.on } : x))} style={{ width: 40, height: 22, borderRadius: 12, border: "none", cursor: "pointer", background: a.on ? C.green : C.line, position: "relative", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 2, left: a.on ? 20 : 2, width: 18, height: 18, borderRadius: 18, background: "#fff", transition: "left .15s" }} />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );

  if (isMobile) {
    // single column, stacked, most important first
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12 }}>
        {SearchBox}
        {Watchlist}
        {PricePanel}
        {MtfPanel}
        {SigPanel}
        {FngPanel}
        {WhalePanel}
        {VolPanel}
        {AlertPanel}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "168px " + cols, gap: 12, padding: 12, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{SearchBox}{Watchlist}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>{PricePanel}{MtfPanel}{VolPanel}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{FngPanel}{WhalePanel}{SigPanel}{AlertPanel}</div>
    </div>
  );
}

/* ========================== technical analysis tab ======================== */
function Badge({ state, t }) {
  const map = {
    bull: { c: C.green, label: t.bull }, bear: { c: C.red, label: t.bear }, neutral: { c: C.dim, label: t.neu },
  };
  const m = map[state] || map.neutral;
  return (
    <span style={{
      fontFamily: "ui-monospace", fontSize: 11, color: m.c, border: `1px solid ${m.c}`,
      padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap", background: m.c + "14",
    }}>{m.label}</span>
  );
}

function IndicatorRow({ name, value, state, detail, t, isMobile }) {
  return (
    <div style={{
      display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 6 : 12,
      alignItems: isMobile ? "stretch" : "center", padding: "12px 0", borderBottom: `1px solid ${C.line}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, minWidth: isMobile ? "auto" : 220 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {value != null && <span style={{ fontFamily: "ui-monospace", fontSize: 12, color: C.dim }}>{value}</span>}
          <Badge state={state} t={t} />
        </div>
      </div>
      <span style={{ fontSize: 12, color: C.dim, lineHeight: 1.5, flex: 1 }}>{detail}</span>
    </div>
  );
}

function TechnicalAnalysis({ t, lang, isMobile, coin, series, price, buyPct }) {
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(false);

  const ma = calcMA(series);
  const macd = calcMACD(series);
  const rsiVal = rsi(series);
  const boll = calcBoll(series);
  const adx = calcADX(series);
  const vwap = calcVWAP(series);
  const stoch = calcStoch(series);
  const fib = calcFib(series);
  const vp = calcVolumeProfile(series);
  const struct = calcStructure(series);
  const volState = buyPct >= 55 ? "bull" : buyPct <= 45 ? "bear" : "neutral";

  const rsiState = rsiVal > 70 ? "bear" : rsiVal < 30 ? "bull" : "neutral";

  const rows = [
    { name: t.ind_ma, value: `${fmtUsd(ma.ma50)} / ${fmtUsd(ma.ma200)}`, state: ma.state,
      detail: ma.state === "bull" ? t.d_ma_bull : ma.state === "bear" ? t.d_ma_bear : t.d_ma_neu },
    { name: t.ind_macd, value: macd.hist.toFixed(2), state: macd.state,
      detail: (macd.state === "bull" ? t.d_macd_bull : t.d_macd_bear) + (macd.div ? t.d_macd_div : "") },
    { name: t.ind_rsi, value: rsiVal.toFixed(1), state: rsiState,
      detail: rsiVal > 70 ? t.d_rsi_ob : rsiVal < 30 ? t.d_rsi_os : t.d_rsi_neu },
    { name: t.ind_boll, value: `%B ${(boll.pctB * 100).toFixed(0)}`, state: boll.state,
      detail: boll.pctB > 0.95 ? t.d_boll_up : boll.pctB < 0.05 ? t.d_boll_lo : t.d_boll_neu },
    { name: t.ind_adx, value: adx.value.toFixed(1), state: adx.state,
      detail: adx.trend ? t.d_adx_trend : t.d_adx_weak },
    { name: t.ind_vwap, value: fmtUsd(vwap.vwap), state: vwap.state,
      detail: vwap.state === "bull" ? t.d_vwap_bull : t.d_vwap_bear },
    { name: t.ind_stoch, value: stoch.value.toFixed(0), state: stoch.state,
      detail: stoch.value > 80 ? t.d_stoch_ob : stoch.value < 20 ? t.d_stoch_os : t.d_stoch_neu },
    { name: t.ind_fib, value: fmtUsd(fib.gp.price), state: fib.state,
      detail: fib.state === "bull" ? t.d_fib_bull : t.d_fib_bear },
    { name: t.ind_struct, value: struct.event, state: struct.state,
      detail: struct.state === "bull" ? t.d_struct_bull : struct.state === "bear" ? t.d_struct_bear : t.d_struct_neu },
    { name: t.ind_vp, value: fmtUsd(vp.poc), state: vp.price > vp.poc ? "bull" : "bear",
      detail: vp.price > vp.poc ? t.d_vp_bull : t.d_vp_bear },
    { name: t.ind_vol, value: `${buyPct.toFixed(0)}%`, state: volState,
      detail: volState === "bull" ? t.d_vol_bull : volState === "bear" ? t.d_vol_bear : t.d_boll_neu },
  ];

  // confluence score: count bull vs bear among meaningful signals
  const bulls = rows.filter((r) => r.state === "bull").length;
  const bears = rows.filter((r) => r.state === "bear").length;
  const net = bulls - bears;
  const score = Math.max(0, Math.min(10, 5 + net)); // 0..10 centred at 5
  const bias = score >= 6 ? "long" : score <= 4 ? "short" : "wait";
  const biasColor = bias === "long" ? C.green : bias === "short" ? C.red : C.dim;
  const biasLabel = bias === "long" ? t.ta_long : bias === "short" ? t.ta_short : t.ta_wait;
  const arc = (score / 10) * 100;

  const runAI = async () => {
    setAiLoading(true); setAiErr(false); setAiText("");
    const snapshot = {
      symbol: coin.sym, price: price.toFixed(price < 1 ? 4 : 2),
      confluenceScore: score, bias,
      indicators: rows.map((r) => ({ name: r.name, value: r.value, signal: r.state })),
      bulls, bears,
    };
    const sysLang = lang === "zh"
      ? "你是一位專業的加密貨幣交易分析師。根據提供的指標數據，用繁體中文寫一段 80-120 字的白話解盤。要點出：目前整體偏多還偏空、最值得注意的 1-2 個訊號、以及操作上的提醒（例如該等待、輕倉、還是設好停損）。語氣專業但口語，不要逐條列指標，要像老手在跟朋友講重點。最後務必提醒這不是投資建議。"
      : "You are a professional crypto trading analyst. Based on the indicator data, write an 80-120 word plain-language market read in English. Cover: overall bullish or bearish lean, the 1-2 most notable signals, and a practical reminder (e.g. wait, trade light, set a stop). Professional but conversational, like a veteran giving a friend the key points — don't just list indicators. End by noting this isn't financial advice.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: `${sysLang}\n\nData:\n${JSON.stringify(snapshot, null, 2)}` }],
        }),
      });
      const data = await res.json();
      const text = (data.content || []).map((c) => (c.type === "text" ? c.text : "")).filter(Boolean).join("\n");
      if (text) setAiText(text); else setAiErr(true);
    } catch (e) {
      setAiErr(true);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, maxWidth: 920, margin: "0 auto" }}>
      {/* AI market read — headline feature */}
      <Panel title={`${coin.sym} · ${t.ai_title}`} icon={<Zap size={15} color={C.amber} />}
        right={<span style={{ fontSize: 10, color: C.dim }}>{t.ai_sub}</span>}>
        {!aiText && !aiLoading && (
          <p style={{ margin: "0 0 12px", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.ai_intro}</p>
        )}
        {aiLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", color: C.amber, fontSize: 13 }}>
            <span style={{ width: 16, height: 16, border: `2px solid ${C.line}`, borderTopColor: C.amber, borderRadius: 16, display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            {t.ai_loading}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {aiText && (
          <div style={{ padding: 13, background: C.panel2, borderRadius: 10, borderLeft: `2px solid ${C.amber}`, marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: C.text, whiteSpace: "pre-wrap" }}>{aiText}</p>
          </div>
        )}
        {aiErr && (
          <div style={{ padding: 11, background: C.red + "1a", border: `1px solid ${C.red}55`, borderRadius: 8, color: C.red, fontSize: 12, marginBottom: 12 }}>
            ⚠ {t.ai_error}
          </div>
        )}
        <button onClick={runAI} disabled={aiLoading} style={{
          width: "100%", padding: "13px", borderRadius: 10, cursor: aiLoading ? "default" : "pointer",
          background: aiLoading ? C.line : C.amber, color: aiLoading ? C.dim : "#0B0E14",
          border: "none", fontSize: 14, fontWeight: 700, minHeight: 46,
        }}>{aiText ? "↻ " : "✦ "}{t.ai_btn}</button>
        <p style={{ margin: "10px 0 0", fontSize: 10, color: C.dim, lineHeight: 1.5, textAlign: "center" }}>{t.ai_disclaimer}</p>
      </Panel>

      {/* confluence score hero */}
      <Panel title={`${coin.sym} · ${t.ta_score}`} icon={<Zap size={15} color={C.amber} />}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 18, alignItems: "center" }}>
          {/* gauge */}
          <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r="62" fill="none" stroke={C.line} strokeWidth="11" />
              <circle cx="75" cy="75" r="62" fill="none" stroke={biasColor} strokeWidth="11"
                strokeLinecap="round" strokeDasharray={`${(arc / 100) * 389.6} 389.6`}
                transform="rotate(-90 75 75)" style={{ transition: "stroke-dasharray .4s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "ui-monospace", fontSize: 40, fontWeight: 700, color: biasColor, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 11, color: C.dim }}>/ 10</div>
              </div>
            </div>
          </div>
          {/* read-out */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: 1, color: C.dim, textTransform: "uppercase" }}>{t.ta_score_sub}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "ui-monospace", fontSize: 22, color: biasColor }}>{biasLabel}</span>
              <span style={{ fontFamily: "ui-monospace", fontSize: 13, color: C.green }}>▲ {bulls}</span>
              <span style={{ fontFamily: "ui-monospace", fontSize: 13, color: C.red }}>▼ {bears}</span>
            </div>
            <div style={{ marginTop: 10, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${C.amber}`, fontSize: 12, color: C.dim, lineHeight: 1.55 }}>
              {t.ta_score_hint}
            </div>
          </div>
        </div>
      </Panel>

      {/* indicator table */}
      <Panel title={t.ta_ind} icon={<Activity size={15} color={C.amber} />}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rows.map((r, i) => <IndicatorRow key={i} {...r} t={t} isMobile={isMobile} />)}
        </div>
      </Panel>

      {/* fibonacci levels */}
      <Panel title={t.fib_title} icon={<Activity size={15} color={C.amber} />}
        right={<span style={{ fontFamily: "ui-monospace", fontSize: 11, color: C.dim }}>{t.fib_swing}: {fib.up ? t.fib_up : t.fib_down}</span>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {fib.levels.map((lv, i) => {
            const isGP = lv.r === 0.618;
            const next = fib.levels[i + 1];
            const priceInBand = next && fib.price <= lv.price && fib.price > next.price;
            return (
              <div key={i}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 10px", borderRadius: 7,
                  background: isGP ? C.amber + "1a" : "transparent",
                  border: isGP ? `1px solid ${C.amber}55` : "1px solid transparent",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ fontFamily: "ui-monospace", fontSize: 12, color: isGP ? C.amber : C.dim, width: 44 }}>
                      {lv.r.toFixed(3)}
                    </span>
                    {isGP && <span style={{ fontSize: 10, color: C.amber }}>★ {t.fib_gp}</span>}
                  </span>
                  <span style={{ fontFamily: "ui-monospace", fontSize: 13, color: isGP ? C.amber : C.text }}>{fmtUsd(lv.price)}</span>
                </div>
                {priceInBand && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 10px" }}>
                    <span style={{ flex: 1, height: 1, background: C.blue }} />
                    <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: C.blue }}>← {t.fib_here} {fmtUsd(fib.price)}</span>
                    <span style={{ flex: 1, height: 1, background: C.blue }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 130, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.fib_support}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 15, color: C.green, marginTop: 3 }}>{fib.support ? fmtUsd(fib.support.price) : "—"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 130, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.fib_resistance}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 15, color: C.red, marginTop: 3 }}>{fib.resistance ? fmtUsd(fib.resistance.price) : "—"}</div>
          </div>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.fib_note}</p>
      </Panel>

      {/* volume profile */}
      <Panel title={t.vp_title} icon={<Activity size={15} color={C.amber} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[...vp.buckets].reverse().map((b, i) => {
            const mid = (b.lo + b.hi) / 2;
            const w = (b.vol / vp.maxVol) * 100;
            const isPoc = mid >= vp.poc - (b.hi - b.lo) / 2 && mid <= vp.poc + (b.hi - b.lo) / 2;
            const inVA = mid >= vp.vaLo && mid <= vp.vaHi;
            const buyRatio = b.vol > 0 ? b.buyVol / b.vol : 0.5;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "ui-monospace", fontSize: 10, color: isPoc ? C.amber : C.dim, width: 64, textAlign: "right", flexShrink: 0 }}>{fmt(mid)}</span>
                <div style={{ flex: 1, height: 14, background: C.bg, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${w}%`, height: "100%", display: "flex" }}>
                    <div style={{ width: `${buyRatio * 100}%`, background: isPoc ? C.amber : inVA ? C.green : C.green + "66" }} />
                    <div style={{ width: `${(1 - buyRatio) * 100}%`, background: isPoc ? C.amber + "cc" : inVA ? C.red : C.red + "66" }} />
                  </div>
                  {isPoc && <span style={{ position: "absolute", right: 5, top: 0, fontSize: 9, color: "#0B0E14", fontFamily: "ui-monospace", lineHeight: "14px", fontWeight: 700 }}>POC</span>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.vp_poc}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 15, color: C.amber, marginTop: 3 }}>{fmtUsd(vp.poc)}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.vp_va}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 13, color: C.text, marginTop: 3 }}>{fmtUsd(vp.vaLo)} – {fmtUsd(vp.vaHi)}</div>
          </div>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.vp_note}</p>
      </Panel>

      {/* market structure */}
      <Panel title={t.struct_title} icon={<Activity size={15} color={C.amber} />}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${struct.state === "bull" ? C.green : struct.state === "bear" ? C.red : C.dim}` }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.struct_trend}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 16, color: struct.state === "bull" ? C.green : struct.state === "bear" ? C.red : C.dim, marginTop: 3 }}>
              {struct.state === "bull" ? "▲ " : struct.state === "bear" ? "▼ " : "→ "}
              {struct.trend === "up" ? t.bull : struct.trend === "down" ? t.bear : t.neu}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 120, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${struct.event === "CHoCH" ? C.amber : C.blue}` }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.struct_event}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 16, color: struct.event === "CHoCH" ? C.amber : C.blue, marginTop: 3 }}>{struct.event}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.struct_hi}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 14, color: C.red, marginTop: 3 }}>{struct.recentHigh ? fmtUsd(struct.recentHigh) : "—"}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.struct_lo}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 14, color: C.green, marginTop: 3 }}>{struct.recentLow ? fmtUsd(struct.recentLow) : "—"}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.5 }}>{struct.event === "CHoCH" ? "⚠ " + t.struct_choch : "✓ " + t.struct_bos}</div>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.struct_note}</p>
      </Panel>

      {/* why confluence note */}
      <Panel title={t.note_title} icon={<BookOpen size={15} color={C.amber} />}>
        <p style={{ margin: 0, fontSize: 13, color: C.dim, lineHeight: 1.65 }}>{t.note_body}</p>
        <div style={{ marginTop: 10, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${C.red}`, fontSize: 12, color: C.dim, lineHeight: 1.55 }}>
          ⚠ {t.tf_note}
        </div>
      </Panel>
    </div>
  );
}

/* ============================== risk manager tab ========================== */
function atr14(series, period = 14) {
  const n = series.length;
  let trs = [];
  for (let i = Math.max(1, n - period); i < n; i++) {
    const hi = series[i].price * 1.004, lo = series[i].price * 0.996, pc = series[i - 1].price;
    trs.push(Math.max(hi - lo, Math.abs(hi - pc), Math.abs(lo - pc)));
  }
  return trs.reduce((a, b) => a + b, 0) / (trs.length || 1);
}

function Field({ label, value, onChange, suffix }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 11, color: C.dim, letterSpacing: 0.5 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 9 }}>
        <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: C.text,
            fontFamily: "ui-monospace", fontSize: 15, padding: "11px 12px", minWidth: 0, width: "100%" }} />
        {suffix && <span style={{ color: C.dim, fontSize: 12, paddingRight: 12, fontFamily: "ui-monospace" }}>{suffix}</span>}
      </div>
    </label>
  );
}

function ResultRow({ label, value, tone }) {
  const col = tone === "up" ? C.green : tone === "down" ? C.red : C.text;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
      <span style={{ fontSize: 13, color: C.dim }}>{label}</span>
      <span style={{ fontFamily: "ui-monospace", fontSize: 15, color: col }}>{value}</span>
    </div>
  );
}

function RiskManager({ t, isMobile, coin, price, series }) {
  const [side, setSide] = useState("long");
  const [account, setAccount] = useState("10000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState(price.toFixed(price < 1 ? 4 : 2));
  const [stop, setStop] = useState((price * 0.97).toFixed(price < 1 ? 4 : 2));
  const [target, setTarget] = useState((price * 1.06).toFixed(price < 1 ? 4 : 2));
  const [lev, setLev] = useState("1");

  const N = (v) => { const x = parseFloat(v); return isFinite(x) ? x : 0; };
  const acc = N(account), rk = N(riskPct), en = N(entry), sl = N(stop), tg = N(target), lv = Math.max(1, N(lev));
  const isLong = side === "long";

  // validity: stop on losing side
  const stopValid = isLong ? sl < en : sl > en;
  const riskAmt = acc * (rk / 100);
  const perUnitRisk = Math.abs(en - sl);
  const qty = stopValid && perUnitRisk > 0 ? riskAmt / perUnitRisk : 0;
  const posValue = qty * en;
  // liquidation (simplified isolated-margin, ignoring fees): long liq = entry*(1 - 1/lev); short = entry*(1 + 1/lev)
  const liq = isLong ? en * (1 - 1 / lv) : en * (1 + 1 / lv);
  // R:R
  const reward = Math.abs(tg - en);
  const rr = perUnitRisk > 0 ? reward / perUnitRisk : 0;
  const rrTone = rr >= 2 ? "up" : rr >= 1 ? undefined : "down";
  const rrMsg = rr >= 2 ? t.r_rr_good : rr >= 1 ? t.r_rr_ok : t.r_rr_bad;
  const lossStop = qty * perUnitRisk;
  const gainTarget = qty * reward;

  const atr = atr14(series);
  const dp = price < 1 ? 4 : 2;

  const card = { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 };
  const seg = (val, cur, on, label, color) => (
    <button onClick={on} style={{
      flex: 1, padding: "10px 8px", borderRadius: 8, cursor: "pointer", fontSize: 13, minHeight: 40,
      background: cur === val ? (color || C.amber) : "transparent",
      color: cur === val ? "#0B0E14" : C.dim, border: `1px solid ${cur === val ? (color || C.amber) : C.line}`,
      fontWeight: 600,
    }}>{label}</button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, maxWidth: 920, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        {/* inputs */}
        <Panel title={`${coin.sym} · ${t.risk_calc}`} icon={<Shield size={15} color={C.amber} />}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {seg("long", side, () => setSide("long"), t.r_long, C.green)}
            {seg("short", side, () => setSide("short"), t.r_short, C.red)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label={t.r_account} value={account} onChange={setAccount} suffix="USDT" />
            <Field label={t.r_risk} value={riskPct} onChange={setRiskPct} suffix="%" />
            <Field label={t.r_entry} value={entry} onChange={setEntry} />
            <Field label={t.r_lev} value={lev} onChange={setLev} suffix="×" />
            <Field label={t.r_stop} value={stop} onChange={setStop} />
            <Field label={t.r_target} value={target} onChange={setTarget} />
          </div>
          <button onClick={() => { setEntry(price.toFixed(dp)); }} style={{
            marginTop: 12, width: "100%", padding: "10px", borderRadius: 9, cursor: "pointer",
            background: "transparent", border: `1px solid ${C.line}`, color: C.amber, fontSize: 13, minHeight: 40,
          }}>↻ {t.r_apply} ({fmtUsd(price)})</button>
        </Panel>

        {/* results */}
        <Panel title={t.r_out} icon={<Zap size={15} color={C.amber} />}>
          {!stopValid && (
            <div style={{ padding: 10, background: C.red + "1a", border: `1px solid ${C.red}55`, borderRadius: 8, color: C.red, fontSize: 12, marginBottom: 10 }}>
              ⚠ {t.r_warn_stop}
            </div>
          )}
          <ResultRow label={t.r_possize} value={fmtUsd(posValue)} />
          <ResultRow label={t.r_units} value={qty > 0 ? qty.toFixed(qty < 1 ? 4 : 3) + " " + coin.sym : "—"} />
          <ResultRow label={t.r_riskamt} value={fmtUsd(riskAmt)} tone="down" />
          <ResultRow label={t.r_liq} value={fmtUsd(liq)} tone="down" />
          <ResultRow label={t.r_loss_stop} value={"-" + fmtUsd(lossStop)} tone="down" />
          <ResultRow label={t.r_gain_target} value={"+" + fmtUsd(gainTarget)} tone="up" />
          {/* R:R highlight */}
          <div style={{ marginTop: 12, padding: 12, borderRadius: 10,
            background: (rrTone === "up" ? C.green : rrTone === "down" ? C.red : C.amber) + "14",
            border: `1px solid ${(rrTone === "up" ? C.green : rrTone === "down" ? C.red : C.amber)}55` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: C.dim }}>{t.r_rr}</span>
              <span style={{ fontFamily: "ui-monospace", fontSize: 22, color: rrTone === "up" ? C.green : rrTone === "down" ? C.red : C.amber }}>
                1 : {rr.toFixed(2)}
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>{rrMsg}</div>
          </div>
        </Panel>
      </div>

      {/* ATR stop suggestion */}
      <Panel title={t.r_atr_title} icon={<Activity size={15} color={C.amber} />}
        right={<span style={{ fontFamily: "ui-monospace", fontSize: 11, color: C.dim }}>{t.r_atr_val}: {fmtUsd(atr)}</span>}>
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 10 }}>{t.r_atr_sub}</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: t.r_atr_1, mult: 1 },
            { label: t.r_atr_2, mult: 2, hi: true },
            { label: t.r_atr_3, mult: 3 },
          ].map((o, i) => {
            const stopPrice = isLong ? price - atr * o.mult : price + atr * o.mult;
            return (
              <div key={i} style={{ padding: 12, borderRadius: 10, background: o.hi ? C.amber + "14" : C.panel2, border: `1px solid ${o.hi ? C.amber + "55" : C.line}` }}>
                <div style={{ fontSize: 11, color: o.hi ? C.amber : C.dim }}>{o.label}</div>
                <div style={{ fontFamily: "ui-monospace", fontSize: 17, marginTop: 4 }}>{fmtUsd(stopPrice)}</div>
                <button onClick={() => setStop(stopPrice.toFixed(dp))} style={{
                  marginTop: 8, width: "100%", padding: "7px", borderRadius: 7, cursor: "pointer", minHeight: 34,
                  background: "transparent", border: `1px solid ${C.line}`, color: C.dim, fontSize: 11,
                }}>→ {t.r_stop}</button>
              </div>
            );
          })}
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.r_atr_note}</p>
      </Panel>

      {/* survival rules */}
      <Panel title={t.r_rules} icon={<BookOpen size={15} color={C.amber} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {[t.r_rule1, t.r_rule2, t.r_rule3, t.r_rule4].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "ui-monospace", fontSize: 12, color: C.amber, flexShrink: 0, marginTop: 1 }}>0{i + 1}</span>
              <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ============================== guide / info tab ========================== */
function GuideTab({ t, isMobile }) {
  const [open, setOpen] = useState(null);

  const Section = ({ id, icon, title, children }) => {
    const isOpen = open === id;
    return (
      <div style={{ background: C.panel, border: `1px solid ${isOpen ? C.amber : C.line}`, borderRadius: 12, overflow: "hidden" }}>
        <button onClick={() => setOpen(isOpen ? null : id)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 16px", background: "transparent", border: "none", cursor: "pointer",
          color: C.text, gap: 10, minHeight: 52,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {icon}
            <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
          </div>
          <span style={{ color: C.amber, fontSize: 18, transition: "transform .2s", display: "inline-block", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
        </button>
        {isOpen && <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>}
      </div>
    );
  };

  const Item = ({ title, body, accent }) => (
    <div style={{ padding: 12, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${accent || C.amber}` }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.65 }}>{body}</div>
    </div>
  );

  const Tag = ({ label, color }) => (
    <span style={{ display: "inline-block", fontFamily: "ui-monospace", fontSize: 11, color: color, border: `1px solid ${color}`, borderRadius: 20, padding: "2px 8px", marginRight: 6, background: color + "14" }}>{label}</span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12, maxWidth: 860, margin: "0 auto" }}>
      {/* intro */}
      <div style={{ padding: 16, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <BookOpen size={16} color={C.amber} />
          <span style={{ fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.dim }}>ABYSS · {t.tab_info}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: C.dim, lineHeight: 1.7 }}>{t.info_intro}</p>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          <Tag label={t.info_s1} color={C.blue} />
          <Tag label={t.info_s2} color={C.violet} />
          <Tag label={t.info_s3} color={C.green} />
          <Tag label={t.info_s4} color={C.amber} />
          <Tag label={t.info_s5} color={C.red} />
        </div>
      </div>

      {/* quick start — the headline walkthrough */}
      <div style={{ padding: 16, background: C.panel, border: `1px solid ${C.amber}`, borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Zap size={16} color={C.amber} />
          <span style={{ fontSize: 16, fontWeight: 700 }}>{t.qs_title}</span>
        </div>
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 12 }}>{t.qs_sub}</div>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: C.dim, lineHeight: 1.6 }}>{t.qs_intro}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {t.qs_steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < t.qs_steps.length - 1 ? 16 : 0, position: "relative" }}>
              {/* connector line */}
              {i < t.qs_steps.length - 1 && (
                <div style={{ position: "absolute", left: 13, top: 28, bottom: 0, width: 2, background: C.line }} />
              )}
              <div style={{ width: 28, height: 28, borderRadius: 28, background: C.amber, color: "#0B0E14", display: "grid", placeItems: "center", fontFamily: "ui-monospace", fontSize: 14, fontWeight: 700, flexShrink: 0, zIndex: 1 }}>{s.n}</div>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{s.b}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 12, background: C.amber + "14", borderRadius: 9, borderLeft: `3px solid ${C.amber}` }}>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}><b style={{ color: C.amber }}>★ </b>{t.qs_takeaway}</div>
        </div>
      </div>

      {/* demo data notice */}
      <div style={{ padding: 13, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10 }}>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.6 }}>ⓘ {t.demo_note}</div>
      </div>
      <Section id="dash" icon={<LayoutDashboard size={16} color={C.blue} />} title={t.info_s1}>
        <Item title={t.info_dash1_t} body={t.info_dash1_b} accent={C.amber} />
        <Item title={t.info_dash2_t} body={t.info_dash2_b} accent={C.blue} />
        <Item title={t.info_dash3_t} body={t.info_dash3_b} accent={C.blue} />
        <Item title={t.info_dash4_t} body={t.info_dash4_b} accent={C.blue} />
        <Item title={t.info_dash5_t} body={t.info_dash5_b} accent={C.violet} />
        <Item title={t.info_dash6_t} body={t.info_dash6_b} accent={C.dim} />
      </Section>

      {/* section 2 — TA */}
      <Section id="ta" icon={<Activity size={16} color={C.violet} />} title={t.info_s2}>
        <Item title={t.info_ta1_t} body={t.info_ta1_b} accent={C.amber} />
        <Item title={t.info_ta2_t} body={t.info_ta2_b} accent={C.violet} />
        <Item title={t.info_ta3_t} body={t.info_ta3_b} accent={C.violet} />
      </Section>

      {/* section 3 — risk */}
      <Section id="risk" icon={<Shield size={16} color={C.green} />} title={t.info_s3}>
        <Item title={t.info_r1_t} body={t.info_r1_b} accent={C.green} />
        <Item title={t.info_r2_t} body={t.info_r2_b} accent={C.amber} />
        <Item title={t.info_r3_t} body={t.info_r3_b} accent={C.green} />
      </Section>

      {/* section 4 — indicators */}
      <Section id="ind" icon={<Zap size={16} color={C.amber} />} title={t.info_s4}>
        {t.ind_exp.map((ind, i) => (
          <Item key={i} title={ind.name} body={ind.body} accent={C.amber} />
        ))}
      </Section>

      {/* section 5 — golden rules */}
      <Section id="rules" icon={<Bell size={16} color={C.red} />} title={t.info_s5}>
        {t.rules.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < t.rules.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <div style={{ fontFamily: "ui-monospace", fontSize: 18, color: C.amber, lineHeight: 1, flexShrink: 0, width: 28 }}>0{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{r.t}</div>
              <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.65 }}>{r.b}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* going live — setup section */}
      <Section id="setup" icon={<Settings size={16} color={C.amber} />} title={t.setup_title}>
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 4 }}>{t.setup_sub}</div>
        <Item title={t.setup_title} body={t.setup_body} accent={C.amber} />
      </Section>

      <div style={{ textAlign: "center", fontSize: 11, color: C.dim, padding: "8px 0 4px", fontFamily: "ui-monospace" }}>
        ABYSS Terminal · {t.foot}
      </div>
    </div>
  );
}

/* ============================== futures data tab ========================== */
function FuturesData({ t, lang, isMobile, coin, price, series, buyPct }) {
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(false);

  // technical context for cross-confirmation
  const fib = calcFib(series);
  const struct = calcStructure(series);
  const rsiVal = rsi(series);
  const maInfo = calcMA(series);
  const macd = calcMACD(series);

  // derive consistent futures metrics from price action + buy pressure
  const recent = series.slice(-24);
  const mom = (recent[recent.length - 1].price - recent[0].price) / recent[0].price;
  // funding rate: positive when longs crowded (price up + buy pressure high)
  const fundingRate = (mom * 0.18 + (buyPct - 50) * 0.0009); // ~ -0.05%..+0.05%
  const fundingPct = fundingRate; // already in %
  const fundingAnnual = fundingPct * 3 * 365; // 3x daily
  const longPays = fundingPct >= 0;
  const frState = fundingPct > 0.03 ? "hot" : fundingPct < -0.01 ? "cold" : "normal";

  // open interest: base scaled by coin, drift with momentum
  const oiBase = (coin.base > 1000 ? 8.5e9 : coin.base > 10 ? 1.8e9 : 4.2e8);
  const oi = oiBase * (1 + mom * 2);
  const oiChange = mom * 100 * 1.4;
  const oiState = mom > 0.004 ? "rising" : mom < -0.004 ? "falling" : "div";

  // long/short ratio
  const longPctLS = Math.max(30, Math.min(70, 50 + (buyPct - 50) * 0.7 + mom * 200));
  const lsRatio = longPctLS / (100 - longPctLS);
  const lsState = longPctLS > 60 ? "clong" : longPctLS < 40 ? "cshort" : "bal";

  // liquidation map: clusters above (short liqs) and below (long liqs) price
  const levels = [];
  for (let i = 1; i <= 6; i++) {
    const upPx = price * (1 + i * 0.012);
    const dnPx = price * (1 - i * 0.012);
    const decay = Math.exp(-i * 0.28);
    levels.push({ side: "short", px: upPx, size: decay * (0.7 + Math.random() * 0.6) * (3 - Math.abs(i - 2) * 0.3) });
    levels.push({ side: "long", px: dnPx, size: decay * (0.7 + Math.random() * 0.6) * (3 - Math.abs(i - 2) * 0.3) });
  }
  const maxLiq = Math.max(...levels.map((l) => l.size));
  const sorted = [...levels].sort((a, b) => b.px - a.px);
  const dp = price < 1 ? 4 : 2;

  const runFutAI = async () => {
    setAiLoading(true); setAiErr(false); setAiText("");
    const snapshot = {
      symbol: coin.sym, price: price.toFixed(dp),
      futures: {
        fundingRate: fundingPct.toFixed(4) + "%",
        fundingAnnualized: fundingAnnual.toFixed(1) + "%",
        fundingMeaning: longPays ? "longs pay shorts (longs crowded)" : "shorts pay longs (shorts crowded)",
        openInterest: fmtBig(oi), oiChange24h: oiChange.toFixed(1) + "%", oiSignal: oiState,
        longShortRatio: lsRatio.toFixed(2), longPct: longPctLS.toFixed(0) + "%",
        nearestShortLiqs: sorted.filter((l) => l.side === "short").slice(-2).map((l) => fmt(l.px)),
        nearestLongLiqs: sorted.filter((l) => l.side === "long").slice(0, 2).map((l) => fmt(l.px)),
      },
      technicals: {
        trend: struct.trend, lastStructureEvent: struct.event,
        fibGoldenPocket: fmt(fib.gp.price), fibSupport: fib.support ? fmt(fib.support.price) : null,
        fibResistance: fib.resistance ? fmt(fib.resistance.price) : null,
        rsi: rsiVal.toFixed(1), macd: macd.state, ma: maInfo.state,
      },
    };
    const sys = lang === "zh"
      ? "你是一位專業的加密貨幣合約交易分析師。根據提供的合約數據（資金費率、未平倉量、多空比、清算價位）與技術面（斐波那契、市場結構、RSI、MACD、均線），用繁體中文寫一段 100-150 字的合約操作判讀。重點：(1) 綜合判斷偏多還偏空，並說明哪些訊號互相共振（例如斐波支撐 + 多單清算區重疊）；(2) 若資金費率極端或多空比擁擠，提醒反向風險；(3) 給具體的進場參考區、停損位（要在合約爆倉前）、和一個關鍵觀察價位。語氣專業像老手，不要逐條列數據。最後提醒槓桿風險、非投資建議。"
      : "You are a professional crypto futures analyst. Using the futures data (funding rate, open interest, long/short ratio, liquidation levels) and technicals (Fibonacci, market structure, RSI, MACD, MA), write a 100-150 word futures read in English. Cover: (1) overall bullish/bearish lean and which signals confluence together (e.g. Fib support overlapping a long-liquidation cluster); (2) if funding is extreme or positioning crowded, flag the contrarian/squeeze risk; (3) give a concrete entry zone, a stop (before liquidation), and one key level to watch. Professional veteran tone, don't just list numbers. End with a leverage-risk reminder and note it's not financial advice.";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{ role: "user", content: `${sys}\n\nData:\n${JSON.stringify(snapshot, null, 2)}` }] }),
      });
      const data = await res.json();
      const text = (data.content || []).map((c) => (c.type === "text" ? c.text : "")).filter(Boolean).join("\n");
      if (text) setAiText(text); else setAiErr(true);
    } catch (e) { setAiErr(true); } finally { setAiLoading(false); }
  };

  const Card = ({ children, accent }) => (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, borderLeft: accent ? `3px solid ${accent}` : undefined }}>{children}</div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, maxWidth: 920, margin: "0 auto" }}>
      {/* AI futures analysis — headline */}
      <Panel title={`${coin.sym} · ${t.fai_title}`} icon={<Zap size={15} color={C.amber} />}
        right={<span style={{ fontSize: 10, color: C.dim }}>{t.fai_sub}</span>}>
        {!aiText && !aiLoading && (
          <p style={{ margin: "0 0 12px", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.fai_intro}</p>
        )}
        {aiLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", color: C.amber, fontSize: 13 }}>
            <span style={{ width: 16, height: 16, border: `2px solid ${C.line}`, borderTopColor: C.amber, borderRadius: 16, display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            {t.fai_loading}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {aiText && (
          <div style={{ padding: 13, background: C.panel2, borderRadius: 10, borderLeft: `2px solid ${C.amber}`, marginBottom: 12 }}>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: C.text, whiteSpace: "pre-wrap" }}>{aiText}</p>
          </div>
        )}
        {aiErr && (
          <div style={{ padding: 11, background: C.red + "1a", border: `1px solid ${C.red}55`, borderRadius: 8, color: C.red, fontSize: 12, marginBottom: 12 }}>⚠ {t.fai_err}</div>
        )}
        <button onClick={runFutAI} disabled={aiLoading} style={{
          width: "100%", padding: "13px", borderRadius: 10, cursor: aiLoading ? "default" : "pointer",
          background: aiLoading ? C.line : C.amber, color: aiLoading ? C.dim : "#0B0E14",
          border: "none", fontSize: 14, fontWeight: 700, minHeight: 46,
        }}>{aiText ? "↻ " : "✦ "}{t.fai_btn}</button>
        <p style={{ margin: "10px 0 0", fontSize: 10, color: C.dim, lineHeight: 1.5, textAlign: "center" }}>{t.fai_disc}</p>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        {/* funding rate */}
        <Panel title={`${coin.sym} · ${t.fr_title}`} icon={<Zap size={15} color={C.amber} />}
          right={<span style={{ fontSize: 10, color: C.dim }}>{t.fr_sub}</span>}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "ui-monospace", fontSize: 30, fontWeight: 700, color: fundingPct >= 0 ? C.green : C.red }}>
              {fundingPct >= 0 ? "+" : ""}{fundingPct.toFixed(4)}%
            </span>
            <span style={{ fontSize: 12, color: C.dim }}>{longPays ? t.fr_long_pays : t.fr_short_pays}</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, fontFamily: "ui-monospace", color: C.dim }}>
            <span>{t.fr_annual}: <b style={{ color: fundingAnnual >= 0 ? C.green : C.red }}>{fundingAnnual >= 0 ? "+" : ""}{fundingAnnual.toFixed(1)}%</b></span>
            <span>{t.fr_next}: <b style={{ color: C.text }}>{String(Math.floor(Math.random() * 7) + 1).padStart(2, "0")}:{String(Math.floor(Math.random() * 60)).padStart(2, "0")}:00</b></span>
          </div>
          <div style={{ marginTop: 12, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${frState === "hot" ? C.red : frState === "cold" ? C.green : C.dim}` }}>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{frState === "hot" ? t.fr_hot : frState === "cold" ? t.fr_cold : t.fr_normal}</div>
          </div>
        </Panel>

        {/* open interest */}
        <Panel title={`${coin.sym} · ${t.oi_title}`} icon={<Layers size={15} color={C.amber} />}
          right={<span style={{ fontSize: 10, color: C.dim }}>{t.oi_sub}</span>}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "ui-monospace", fontSize: 28, fontWeight: 700 }}>{fmtBig(oi)}</span>
            <span style={{ fontFamily: "ui-monospace", fontSize: 13, color: oiChange >= 0 ? C.green : C.red }}>{oiChange >= 0 ? "+" : ""}{oiChange.toFixed(1)}%</span>
          </div>
          <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{t.oi_change}</div>
          <div style={{ marginTop: 12, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${oiState === "rising" ? C.green : oiState === "falling" ? C.red : C.amber}` }}>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{oiState === "rising" ? t.oi_rising : oiState === "falling" ? t.oi_falling : t.oi_div}</div>
          </div>
        </Panel>
      </div>

      {/* long short ratio */}
      <Panel title={`${coin.sym} · ${t.ls_title}`} icon={<Activity size={15} color={C.amber} />}
        right={<span style={{ fontSize: 10, color: C.dim }}>{t.ls_sub}</span>}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "ui-monospace", fontSize: 22, fontWeight: 700, color: C.amber }}>{lsRatio.toFixed(2)}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", height: 22, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: `${longPctLS}%`, background: C.green, display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 8 }}>
                <span style={{ fontSize: 11, color: "#0B0E14", fontFamily: "ui-monospace", fontWeight: 700 }}>{t.ls_long} {longPctLS.toFixed(0)}%</span>
              </div>
              <div style={{ width: `${100 - longPctLS}%`, background: C.red, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                <span style={{ fontSize: 11, color: "#fff", fontFamily: "ui-monospace", fontWeight: 700 }}>{(100 - longPctLS).toFixed(0)}% {t.ls_short}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 11, background: C.panel2, borderRadius: 9, borderLeft: `2px solid ${lsState === "clong" ? C.red : lsState === "cshort" ? C.green : C.dim}` }}>
          <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{lsState === "clong" ? t.ls_crowded_long : lsState === "cshort" ? t.ls_crowded_short : t.ls_balanced}</div>
        </div>
      </Panel>

      {/* liquidation map */}
      <Panel title={`${coin.sym} · ${t.liq_title}`} icon={<Layers size={15} color={C.amber} />}
        right={<span style={{ fontSize: 10, color: C.dim }}>{t.liq_sub}</span>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sorted.map((l, i) => {
            const w = (l.size / maxLiq) * 100;
            const isShort = l.side === "short";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "ui-monospace", fontSize: 10, color: C.dim, width: 66, textAlign: "right", flexShrink: 0 }}>{fmt(l.px)}</span>
                <div style={{ flex: 1, height: 13, background: C.bg, borderRadius: 3, overflow: "hidden", display: "flex", justifyContent: isShort ? "flex-start" : "flex-start" }}>
                  <div style={{ width: `${w}%`, height: "100%", background: isShort ? C.red : C.green, opacity: 0.7 }} />
                </div>
              </div>
            );
          })}
          {/* current price marker */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: C.amber, width: 66, textAlign: "right", flexShrink: 0, fontWeight: 700 }}>{fmt(price)}</span>
            <div style={{ flex: 1, height: 2, background: C.amber }} />
            <span style={{ fontSize: 9, color: C.amber, fontFamily: "ui-monospace" }}>← {t.liq_cur}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, fontFamily: "ui-monospace" }}>
          <span style={{ color: C.red }}>━ {t.liq_shorts}</span>
          <span style={{ color: C.green }}>━ {t.liq_longs}</span>
        </div>
        <p style={{ margin: "12px 0 0", fontSize: 12, color: C.dim, lineHeight: 1.6 }}>{t.liq_note}</p>
      </Panel>

      <p style={{ textAlign: "center", fontSize: 10, color: C.dim, lineHeight: 1.5, padding: "0 8px" }}>{t.fut_disclaimer}</p>
    </div>
  );
}

/* ============================== portfolio tab ============================= */
function Portfolio({ t, lang, isMobile, dataRef, exMul, positions, setPositions }) {
  const [adding, setAdding] = useState(false);
  const [fSym, setFSym] = useState("BTC");
  const [fQty, setFQty] = useState("");
  const [fEntry, setFEntry] = useState("");

  const curPrice = (sym) => {
    const s = dataRef.current[sym];
    if (!s) return 0;
    return s[s.length - 1].price * exMul;
  };

  const rows = positions.map((p) => {
    const now = curPrice(p.sym);
    const value = now * p.qty;
    const cost = p.entry * p.qty;
    const pnl = value - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return { ...p, now, value, cost, pnl, pnlPct };
  });

  const totalValue = rows.reduce((a, r) => a + r.value, 0);
  const totalCost = rows.reduce((a, r) => a + r.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const best = rows.length ? rows.reduce((m, r) => (r.pnlPct > m.pnlPct ? r : m)) : null;
  const worst = rows.length ? rows.reduce((m, r) => (r.pnlPct < m.pnlPct ? r : m)) : null;

  const addPosition = () => {
    const qty = parseFloat(fQty), entry = parseFloat(fEntry);
    if (!isFinite(qty) || !isFinite(entry) || qty <= 0 || entry <= 0) return;
    setPositions((ps) => [...ps, { id: Date.now(), sym: fSym, qty, entry }]);
    setFQty(""); setFEntry(""); setAdding(false);
  };

  const dpFor = (n) => (n < 1 ? 4 : 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, maxWidth: 920, margin: "0 auto" }}>
      {/* summary hero */}
      <Panel title={t.pf_total} icon={<Wallet size={15} color={C.amber} />}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "ui-monospace", fontSize: isMobile ? 28 : 34, fontWeight: 700 }}>{fmtUsd(totalValue)}</span>
          <span style={{ fontFamily: "ui-monospace", fontSize: 16, color: totalPnl >= 0 ? C.green : C.red }}>
            {totalPnl >= 0 ? "▲" : "▼"} {fmtUsd(Math.abs(totalPnl))} ({totalPnl >= 0 ? "+" : ""}{totalPnlPct.toFixed(2)}%)
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.pf_cost}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 15, marginTop: 3 }}>{fmtUsd(totalCost)}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120, padding: 10, background: C.panel2, borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.pf_pnl}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 15, marginTop: 3, color: totalPnl >= 0 ? C.green : C.red }}>{totalPnl >= 0 ? "+" : ""}{fmtUsd(totalPnl)}</div>
          </div>
        </div>
        {best && worst && rows.length > 1 && (
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, fontFamily: "ui-monospace" }}>
            <span style={{ color: C.dim }}>{t.pf_best}: <b style={{ color: C.green }}>{best.sym} +{best.pnlPct.toFixed(1)}%</b></span>
            <span style={{ color: C.dim }}>{t.pf_worst}: <b style={{ color: worst.pnlPct >= 0 ? C.green : C.red }}>{worst.sym} {worst.pnlPct >= 0 ? "+" : ""}{worst.pnlPct.toFixed(1)}%</b></span>
          </div>
        )}
      </Panel>

      {/* allocation bar */}
      {rows.length > 0 && (
        <Panel title={t.pf_alloc} icon={<Layers size={15} color={C.amber} />}>
          <div style={{ display: "flex", height: 22, borderRadius: 6, overflow: "hidden" }}>
            {rows.map((r, i) => {
              const pct = totalValue > 0 ? (r.value / totalValue) * 100 : 0;
              const palette = [C.amber, C.blue, C.green, C.violet, "#ff8fb0", "#ffb454", "#6fa8ff", "#d4af37"];
              return <div key={r.id} title={r.sym} style={{ width: `${pct}%`, background: palette[i % palette.length], minWidth: pct > 0 ? 2 : 0 }} />;
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
            {rows.map((r, i) => {
              const pct = totalValue > 0 ? (r.value / totalValue) * 100 : 0;
              const palette = [C.amber, C.blue, C.green, C.violet, "#ff8fb0", "#ffb454", "#6fa8ff", "#d4af37"];
              return (
                <span key={r.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "ui-monospace", color: C.dim }}>
                  <span style={{ width: 8, height: 8, borderRadius: 8, background: palette[i % palette.length] }} />
                  {r.sym} {pct.toFixed(0)}%
                </span>
              );
            })}
          </div>
        </Panel>
      )}

      {/* holdings */}
      <Panel title={t.pf_holdings} icon={<Wallet size={15} color={C.amber} />}
        right={<button onClick={() => setAdding((a) => !a)} style={{ background: adding ? "transparent" : C.amber, color: adding ? C.dim : "#0B0E14", border: `1px solid ${adding ? C.line : C.amber}`, borderRadius: 7, fontSize: 12, padding: "7px 12px", cursor: "pointer", minHeight: 34, fontWeight: 600 }}>{adding ? t.pf_cancel : t.pf_add}</button>}>
        {adding && (
          <div style={{ padding: 12, background: C.panel2, borderRadius: 10, marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11, color: C.dim }}>{t.pf_pick}</span>
                <select value={fSym} onChange={(e) => setFSym(e.target.value)} style={{ background: C.bg, color: C.text, border: `1px solid ${C.line}`, borderRadius: 9, padding: "11px 10px", fontSize: 14, fontFamily: "ui-monospace", outline: "none" }}>
                  {COINS.map((c) => <option key={c.sym} value={c.sym} style={{ background: C.bg }}>{c.sym} · {c.name}</option>)}
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11, color: C.dim }}>{t.pf_qty}</span>
                <input value={fQty} onChange={(e) => setFQty(e.target.value)} inputMode="decimal" placeholder="0.0"
                  style={{ background: C.bg, color: C.text, border: `1px solid ${C.line}`, borderRadius: 9, padding: "11px 12px", fontSize: 15, fontFamily: "ui-monospace", outline: "none", minWidth: 0 }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 11, color: C.dim }}>{t.pf_entry}</span>
                <input value={fEntry} onChange={(e) => setFEntry(e.target.value)} inputMode="decimal" placeholder={fmt(curPrice(fSym))}
                  style={{ background: C.bg, color: C.text, border: `1px solid ${C.line}`, borderRadius: 9, padding: "11px 12px", fontSize: 15, fontFamily: "ui-monospace", outline: "none", minWidth: 0 }} />
              </label>
            </div>
            <button onClick={addPosition} style={{ marginTop: 12, width: "100%", padding: 12, borderRadius: 9, background: C.amber, color: "#0B0E14", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 44 }}>{t.pf_save}</button>
          </div>
        )}

        {rows.length === 0 && !adding && (
          <div style={{ padding: 20, textAlign: "center", color: C.dim, fontSize: 13 }}>{t.pf_empty}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", background: C.panel2, borderRadius: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <b style={{ fontSize: 15 }}>{r.sym}</b>
                  <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: C.dim }}>{r.qty} @ {fmtUsd(r.entry)}</span>
                </div>
                <div style={{ fontFamily: "ui-monospace", fontSize: 12, color: C.dim, marginTop: 3 }}>
                  {t.pf_now} {fmtUsd(r.now)} · {t.pf_value} {fmtUsd(r.value)}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "ui-monospace", fontSize: 15, color: r.pnl >= 0 ? C.green : C.red }}>{r.pnl >= 0 ? "+" : ""}{fmtUsd(r.pnl)}</div>
                <div style={{ fontFamily: "ui-monospace", fontSize: 12, color: r.pnl >= 0 ? C.green : C.red }}>{r.pnl >= 0 ? "+" : ""}{r.pnlPct.toFixed(2)}%</div>
              </div>
              <button onClick={() => setPositions((ps) => ps.filter((x) => x.id !== r.id))} style={{ flexShrink: 0, background: "transparent", border: `1px solid ${C.line}`, color: C.dim, borderRadius: 7, width: 30, height: 30, cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
            </div>
          ))}
        </div>
      </Panel>

      <p style={{ textAlign: "center", fontSize: 10, color: C.dim, lineHeight: 1.5, padding: "0 8px" }}>{t.pf_disclaimer}</p>
    </div>
  );
}

/* =============================== journal tab ============================== */
function Journal({ t, lang, isMobile, journal, setJournal }) {
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ sym: "BTC", side: "long", entry: "", exit: "", qty: "", reason: "", result: "" });

  const calcPnl = (e) => {
    if (e.exit == null || e.exit === "") return null;
    const dir = e.side === "long" ? 1 : -1;
    const pct = ((e.exit - e.entry) / e.entry) * 100 * dir;
    const amt = (e.qty || 0) * (pct / 100);
    return { pct, amt };
  };

  const rows = journal.map((e) => ({ ...e, pnl: calcPnl(e) }));
  const closed = rows.filter((r) => r.pnl != null);
  const wins = closed.filter((r) => r.pnl.amt > 0);
  const losses = closed.filter((r) => r.pnl.amt <= 0);
  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0;
  const totalPnl = closed.reduce((a, r) => a + r.pnl.amt, 0);
  const avgWin = wins.length ? wins.reduce((a, r) => a + r.pnl.amt, 0) / wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((a, r) => a + r.pnl.amt, 0) / losses.length : 0;

  const getReason = (e) => lang === "zh" ? (e.reasonZh ?? e.reason) : (e.reasonEn ?? e.reason);
  const getResult = (e) => lang === "zh" ? (e.resultZh ?? e.result) : (e.resultEn ?? e.result);

  const save = () => {
    const entry = parseFloat(f.entry), qty = parseFloat(f.qty);
    if (!isFinite(entry) || entry <= 0) return;
    const exit = f.exit === "" ? null : parseFloat(f.exit);
    setJournal((j) => [{ id: Date.now(), sym: f.sym, side: f.side, entry, exit, qty: isFinite(qty) ? qty : 0,
      reasonEn: f.reason, reasonZh: f.reason, resultEn: f.result, resultZh: f.result }, ...j]);
    setF({ sym: "BTC", side: "long", entry: "", exit: "", qty: "", reason: "", result: "" });
    setAdding(false);
  };

  const inp = { background: C.bg, color: C.text, border: `1px solid ${C.line}`, borderRadius: 9, padding: "11px 12px", fontSize: 14, fontFamily: "ui-monospace", outline: "none", minWidth: 0, width: "100%" };
  const lbl = { display: "flex", flexDirection: "column", gap: 5 };
  const lblTxt = { fontSize: 11, color: C.dim };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, maxWidth: 920, margin: "0 auto" }}>
      {/* performance stats */}
      <Panel title={t.jr_stats} icon={<NotebookPen size={15} color={C.amber} />}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
          <div style={{ padding: 11, background: C.panel2, borderRadius: 9 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.jr_winrate}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 20, marginTop: 3, color: winRate >= 50 ? C.green : C.red }}>{winRate.toFixed(0)}%</div>
          </div>
          <div style={{ padding: 11, background: C.panel2, borderRadius: 9 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.jr_pnl}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 20, marginTop: 3, color: totalPnl >= 0 ? C.green : C.red }}>{totalPnl >= 0 ? "+" : ""}{fmtUsd(totalPnl)}</div>
          </div>
          <div style={{ padding: 11, background: C.panel2, borderRadius: 9 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.jr_wins} / {t.jr_losses}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 20, marginTop: 3 }}><span style={{ color: C.green }}>{wins.length}</span> / <span style={{ color: C.red }}>{losses.length}</span></div>
          </div>
          <div style={{ padding: 11, background: C.panel2, borderRadius: 9 }}>
            <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{t.jr_avg_win} / {t.jr_avg_loss}</div>
            <div style={{ fontFamily: "ui-monospace", fontSize: 14, marginTop: 6 }}><span style={{ color: C.green }}>+{fmtUsd(avgWin)}</span> / <span style={{ color: C.red }}>{fmtUsd(avgLoss)}</span></div>
          </div>
        </div>
      </Panel>

      {/* entries */}
      <Panel title={`${t.tab_jr} · ${closed.length + (rows.length - closed.length)} ${t.jr_trades}`} icon={<NotebookPen size={15} color={C.amber} />}
        right={<button onClick={() => setAdding((a) => !a)} style={{ background: adding ? "transparent" : C.amber, color: adding ? C.dim : "#0B0E14", border: `1px solid ${adding ? C.line : C.amber}`, borderRadius: 7, fontSize: 12, padding: "7px 12px", cursor: "pointer", minHeight: 34, fontWeight: 600 }}>{adding ? t.jr_cancel : t.jr_add}</button>}>
        {adding && (
          <div style={{ padding: 12, background: C.panel2, borderRadius: 10, marginBottom: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
              <label style={lbl}><span style={lblTxt}>{t.jr_sym}</span>
                <select value={f.sym} onChange={(e) => setF({ ...f, sym: e.target.value })} style={{ ...inp }}>
                  {COINS.map((c) => <option key={c.sym} value={c.sym} style={{ background: C.bg }}>{c.sym}</option>)}
                </select>
              </label>
              <label style={lbl}><span style={lblTxt}>{t.jr_side}</span>
                <select value={f.side} onChange={(e) => setF({ ...f, side: e.target.value })} style={{ ...inp }}>
                  <option value="long" style={{ background: C.bg }}>{t.jr_long}</option>
                  <option value="short" style={{ background: C.bg }}>{t.jr_short}</option>
                </select>
              </label>
              <label style={lbl}><span style={lblTxt}>{t.jr_entry}</span>
                <input value={f.entry} onChange={(e) => setF({ ...f, entry: e.target.value })} inputMode="decimal" style={inp} /></label>
              <label style={lbl}><span style={lblTxt}>{t.jr_qty}</span>
                <input value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })} inputMode="decimal" style={inp} /></label>
            </div>
            <label style={lbl}><span style={lblTxt}>{t.jr_exit}</span>
              <input value={f.exit} onChange={(e) => setF({ ...f, exit: e.target.value })} inputMode="decimal" style={inp} /></label>
            <label style={lbl}><span style={lblTxt}>{t.jr_reason}</span>
              <textarea value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} placeholder={t.jr_note_ph} rows={2} style={{ ...inp, resize: "vertical", fontFamily: "ui-sans-serif" }} /></label>
            <label style={lbl}><span style={lblTxt}>{t.jr_result}</span>
              <textarea value={f.result} onChange={(e) => setF({ ...f, result: e.target.value })} placeholder={t.jr_result_ph} rows={2} style={{ ...inp, resize: "vertical", fontFamily: "ui-sans-serif" }} /></label>
            <button onClick={save} style={{ width: "100%", padding: 12, borderRadius: 9, background: C.amber, color: "#0B0E14", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 44 }}>{t.jr_save}</button>
          </div>
        )}

        {rows.length === 0 && !adding && (
          <div style={{ padding: 20, textAlign: "center", color: C.dim, fontSize: 13 }}>{t.jr_empty}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((e) => {
            const isOpen = e.pnl == null;
            const win = e.pnl && e.pnl.amt > 0;
            const col = isOpen ? C.dim : win ? C.green : C.red;
            return (
              <div key={e.id} style={{ padding: 12, background: C.panel2, borderRadius: 10, borderLeft: `3px solid ${col}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <b style={{ fontSize: 15 }}>{e.sym}</b>
                    <span style={{ fontSize: 10, color: e.side === "long" ? C.green : C.red, border: `1px solid ${e.side === "long" ? C.green : C.red}`, borderRadius: 20, padding: "1px 7px" }}>
                      {e.side === "long" ? t.jr_long : t.jr_short}
                    </span>
                    <span style={{ fontFamily: "ui-monospace", fontSize: 11, color: C.dim }}>
                      {fmtUsd(e.entry)}{e.exit != null ? ` → ${fmtUsd(e.exit)}` : ""}
                    </span>
                    {isOpen && <span style={{ fontSize: 10, color: C.amber, border: `1px solid ${C.amber}`, borderRadius: 20, padding: "1px 7px" }}>{t.jr_open_label}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {e.pnl && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "ui-monospace", fontSize: 15, color: col }}>{e.pnl.amt >= 0 ? "+" : ""}{fmtUsd(e.pnl.amt)}</div>
                        <div style={{ fontFamily: "ui-monospace", fontSize: 11, color: col }}>{e.pnl.pct >= 0 ? "+" : ""}{e.pnl.pct.toFixed(2)}%</div>
                      </div>
                    )}
                    <button onClick={() => setJournal((j) => j.filter((x) => x.id !== e.id))} style={{ flexShrink: 0, background: "transparent", border: `1px solid ${C.line}`, color: C.dim, borderRadius: 7, width: 28, height: 28, cursor: "pointer", fontSize: 13, padding: 0 }}>×</button>
                  </div>
                </div>
                {getReason(e) && (
                  <div style={{ marginTop: 8, fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                    <span style={{ color: C.dim }}>▸ </span>{getReason(e)}
                  </div>
                )}
                {getResult(e) && (
                  <div style={{ marginTop: 4, fontSize: 12, color: C.dim, lineHeight: 1.5, fontStyle: "italic" }}>
                    ✓ {getResult(e)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <p style={{ textAlign: "center", fontSize: 10, color: C.dim, lineHeight: 1.5, padding: "0 8px" }}>{t.jr_disclaimer}</p>
    </div>
  );
}
