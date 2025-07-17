export default async function handler(req, res) {
  const ASYAD_API_BASE = "https://apix.asyadexpress.com";
  const TOKEN = "Bearer 6TslV_sodBqqOIY4f3WNx1fGMq2u-f7n"; // يفضل استخدام process.env هنا

  const url = `${ASYAD_API_BASE}${req.query.path ? `/${req.query.path}` : ''}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': TOKEN
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : null
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy server error', message: error.message });
  }
}
