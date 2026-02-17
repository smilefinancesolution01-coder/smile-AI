export default async function handler(req, res) {
  const { message } = req.body;
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const hfToken = process.env.HUGGINGFACE_TOKEN;

  // 1. FASTEST: GROQ CHECK
  if (groqKey) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [{ role: "user", content: `You are Smile AI, reply in Hindi/English mix: ${message}` }]
        })
      });
      const data = await groqRes.json();
      if (data.choices?.[0]?.message?.content) {
        return res.status(200).json({ reply: data.choices[0].message.content });
      }
    } catch (e) { console.error("Groq Failed"); }
  }

  // 2. BACKUP: GEMINI CHECK
  if (geminiKey) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${geminiKey}`;
      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
      });
      const data = await geminiRes.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
      }
    } catch (e) { console.error("Gemini Failed"); }
  }

  // AGAR SAB FAIL HO JAYE
  res.status(200).json({ reply: "Bhai, API keys check karo, connection nahi ban raha!" });
}
