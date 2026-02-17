export default async function handler(req, res) {
  const { message } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const hfToken = process.env.HUGGINGFACE_TOKEN;

  // 1. Sabse pehle Gemini try karo
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${geminiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Address user as 'bhai'. You are Smile AI finance expert. User: ${message}` }] }] })
    });
    const data = await geminiRes.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }
  } catch (e) { console.log("Gemini failed, switching..."); }

  // 2. Agar Gemini fail ho, toh Groq try karo
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: `Reply in Hindi/English mix as a friend: ${message}` }]
      })
    });
    const data = await groqRes.json();
    if (data.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
  } catch (e) { console.log("Groq failed, switching..."); }

  // 3. Agar dono fail ho, toh Hugging Face (Final Backup)
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ inputs: `User: ${message}\nAssistant: ` })
    });
    const data = await hfRes.json();
    const reply = data[0]?.generated_text?.split("Assistant:")[1] || "Bhai, thodi der mein try karo, system update ho raha hai!";
    return res.status(200).json({ reply: reply.trim() });
  } catch (e) {
    res.status(200).json({ reply: "Bhai, connection error hai, par main hamesha yahan hoon!" });
  }
}
