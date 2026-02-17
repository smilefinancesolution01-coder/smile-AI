export default async function handler(req, res) {
  const { message } = req.body;
  const { GROQ_API_KEY, GEMINI_API_KEY } = process.env;

  if (!GROQ_API_KEY && !GEMINI_API_KEY) {
    return res.status(200).json({ reply: "Bhai, Vercel mein API Keys load nahi hui hain!" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
    });
    const data = await response.json();
    if (data.candidates) return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    
    // Agar Gemini fail ho toh error dikhao
    return res.status(200).json({ reply: "Bhai, Gemini key mein problem hai: " + (data.error?.message || "Check Key") });
  } catch (error) {
    return res.status(200).json({ reply: "Bhai, server tak baat nahi pahunch rahi!" });
  }
}
