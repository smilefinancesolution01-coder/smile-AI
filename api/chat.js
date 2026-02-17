export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { GROQ_API_KEY, GEMINI_API_KEY, HUGGINGFACE_TOKEN } = process.env;

  // --- STEP 1: Groq AI (Primary) ---
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "system", content: "You are Smile AI. Address as bhai." }, { role: "user", content: message }]
      })
    });
    const data = await groqRes.json();
    if (data.choices?.[0]?.message?.content) return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) { console.log("Groq skip..."); }

  // --- STEP 2: Gemini AI (Backup) ---
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `You are Smile AI. Address as bhai. Short Hindi reply: ${message}` }] }] })
    });
    const data = await geminiRes.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
  } catch (e) { console.log("Gemini skip..."); }

  // --- STEP 3: Fallback ---
  return res.status(200).json({ reply: "Bhai, teenon APIs connect nahi ho pa rahi hain. Settings check karo!" });
}
