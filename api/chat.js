export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { GEMINI_API_KEY } = process.env;

  try {
    // API URL ko 'v1beta' se 'v1' par switch kiya gaya hai for stability
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI, a finance expert for Smile Finance Solution. Call the user 'bhai'. Help with loans and shopping (Amazon ID: smileai24-21). Reply in friendly Hindi/English mix. User: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    // Agar model nahi mil raha toh ye specific check karega
    if (data.error) {
      return res.status(200).json({ reply: `Bhai, Google Error: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }

    return res.status(200).json({ reply: "Bhai, API connect toh hui par response khali hai. Key check karo!" });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, connection error hai, thodi der baad try karein!" });
  }
}
