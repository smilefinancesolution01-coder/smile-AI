// Force Update Version 2.0 - Loaded All Keys
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  // Code variables ko fetch kar raha hai
  const { GROQ_API_KEY, GEMINI_API_KEY, HUGGINGFACE_TOKEN } = process.env;

  try {
    // Sabse pehle Gemini try karein (Kyuki ye bahut stable hai)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are Smile AI. Address as bhai. Hindi reply: ${message}` }] }] })
    });
    const data = await geminiRes.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }
    
    throw new Error("Gemini failed");

  } catch (e) {
    // Agar Gemini fail ho toh ye message aayega - yani Variables load nahi ho rahe
    return res.status(200).json({ reply: "Bhai, Vercel Variables abhi bhi load nahi kar raha. Settings > Environment Variables ko ek baar 'Edit' karke fir se 'Save' karo." });
  }
}
