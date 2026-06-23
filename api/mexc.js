// Vercel Serverless Function — proxies MEXC public market-data API to bypass browser CORS.
// Lives at /api/mexc and forwards to https://api.mexc.com/api/v3/...
// Only allows public market-data paths (no trading, no keys).

const ALLOWED = new Set([
  "ticker/24hr",
  "ticker/price",
  "klines",
  "depth",
  "exchangeInfo",
]);

export default async function handler(req, res) {
  // CORS headers so the browser is happy
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }

  try {
    const { path = "", ...rest } = req.query;

    // commodity spot prices via gold-api.com (free, no key): /api/mexc?path=metal&symbol=XAU
    if (path === "metal") {
      const sym = (rest.symbol || "XAU").toUpperCase();
      const mr = await fetch("https://api.gold-api.com/price/" + sym);
      const mtext = await mr.text();
      res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
      res.status(mr.status).setHeader("Content-Type", "application/json").send(mtext);
      return;
    }

    // crude oil via API Ninjas (key stored in Vercel env var OIL_API_KEY): /api/mexc?path=oil&symbol=crude_oil
    if (path === "oil") {
      const name = (rest.symbol || "crude_oil"); // crude_oil = WTI, brent_crude_oil = Brent
      const key = process.env.OIL_API_KEY;
      if (!key) { res.status(200).json({ price: null, error: "no key" }); return; }
      const or = await fetch("https://api.api-ninjas.com/v1/commodityprice?name=" + encodeURIComponent(name), {
        headers: { "X-Api-Key": key },
      });
      const otext = await or.text();
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
      res.status(or.status).setHeader("Content-Type", "application/json").send(otext);
      return;
    }

    // MEXC futures/contract ticker (one call gives fundingRate + holdVol[OI] + lastPrice + riseFallRate)
    // /api/mexc?path=futticker&symbol=BTC_USDT
    if (path === "futticker") {
      const sym = (rest.symbol || "BTC_USDT").toUpperCase();
      const fr = await fetch("https://contract.mexc.com/api/v1/contract/ticker?symbol=" + sym, {
        headers: { "Content-Type": "application/json" },
      });
      const ftext = await fr.text();
      res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
      res.status(fr.status).setHeader("Content-Type", "application/json").send(ftext);
      return;
    }

    if (!ALLOWED.has(path)) {
      res.status(400).json({ error: "path not allowed", path });
      return;
    }
    const qs = new URLSearchParams(rest).toString();
    const url = `https://api.mexc.com/api/v3/${path}${qs ? "?" + qs : ""}`;

    const r = await fetch(url, { headers: { "Content-Type": "application/json" } });
    const text = await r.text();

    // cache lightly at the edge to ease rate limits (5s)
    res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=15");
    res.status(r.status).setHeader("Content-Type", "application/json").send(text);
  } catch (e) {
    res.status(502).json({ error: "proxy failed", detail: String(e) });
  }
}
