export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { GEMINI_API_KEY } = process.env;

  try {
    // Sabse stable URL aur Model 'gemini-pro' istemal kar rahe hain
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI. Address as bhai. Help with loans and shopping (ID: smileai24-21). Reply in Hindi/English mix. User: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    // Agar ab bhi Google error de, toh wo yahan dikhega
    if (data.error) {
      return res.status(200).json({ reply: `Bhai, Google Error: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }

    return res.status(200).json({ reply: "Bhai, API key connect hai par reply nahi mila. Key dobara check karein!" });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, server busy hai, thodi der mein try karein!" });
  }
}
