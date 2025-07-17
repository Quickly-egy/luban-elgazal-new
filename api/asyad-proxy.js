export default async function handler(req, res) {
  const ASYAD_API_BASE = "https://apix.asyadexpress.com/v2";
  const TOKEN = process.env.VITE_ASYAD_TOKEN; // من .env.production في Vercel

  const path = req.query.path;

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' query param" });
  }

  const url = `${ASYAD_API_BASE}/${path}`;

  try {
    console.log("🔄 Proxying to:", url);

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error("❌ Proxy Error:", error);
    res.status(500).json({ error: 'Proxy server error', message: error.message });
  }
}
