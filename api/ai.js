// Vercel Serverless Function — proxies AI analysis requests to Google Gemini.
// The Gemini API key is stored in the Vercel env var GEMINI_API_KEY (never in the frontend).
// Frontend POSTs { prompt: "..." } to /api/ai and gets back { text: "..." }.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  const key = process.env.GEMINI_API_KEY;
  if (!key) { res.status(200).json({ text: "", error: "no key" }); return; }

  try {
    // body may arrive parsed or as a string depending on runtime
    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
    const prompt = (body && body.prompt) ? String(body.prompt) : "";
    if (!prompt) { res.status(400).json({ error: "no prompt" }); return; }

    const model = "gemini-2.5-flash";
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(200).json({ text: "", error: (data.error && data.error.message) || ("status " + r.status) });
      return;
    }
    const text = (((data.candidates || [])[0] || {}).content || {}).parts?.map((p) => p.text || "").join("") || "";
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ text });
  } catch (e) {
    res.status(200).json({ text: "", error: String(e) });
  }
}
