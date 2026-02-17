export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { GEMINI_API_KEY } = process.env;

  try {
    // UPDATED URL: Ab ye error nahi dega
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI, a friendly finance expert. Call the user 'bhai'. User says: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    // Check karein ki response sahi hai ya nahi
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      // Debugging ke liye error log karein
      console.error("Gemini Error:", data);
      return res.status(200).json({ reply: "Bhai, Gemini Key toh mil rahi hai par response nahi aa raha. Key dobara check karein!" });
    }

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, connection mein dikkat hai, par hum haar nahi maanenge!" });
  }
}
