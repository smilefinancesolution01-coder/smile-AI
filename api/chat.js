export default async function handler(req, res) {
  const { message } = req.body;
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const hfToken = process.env.HUGGINGFACE_TOKEN;

  // 1. Sabse pehle Gemini try karo (Best Quality)
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${geminiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: `You are Smile AI, a friendly finance expert. Reply in Hindi/English mix. Always address user as 'bhai'. User: ${message}` }] }] 
      })
    });
    const data = await geminiRes.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }
  } catch (e) { console.log("Gemini failed"); }

  // 2. Agar Gemini fail ho, toh Groq try karo (Super Fast Speed)
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: `Reply as Smile AI (finance friend) in Hindi/English mix: ${message}` }]
      })
    });
    const data = await groqRes.json();
    if (data.choices?.[0]?.message?.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
  } catch (e) { console.log("Groq failed"); }

  // 3. Agar dono fail ho, toh Zephyr (Hugging Face) - Sabse majboot backup
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ inputs: `<|system|>\nYou are Smile AI, a finance expert. Address user as bhai.\n<|user|>\n${message}\n<|assistant|>\n` })
    });
    const data = await hfRes.json();
    // Clean reply logic
    let reply = data[0]?.generated_text?.split("<|assistant|>")[1] || "Bhai, server thoda busy hai, 10 second baad dobara message karo!";
    return res.status(200).json({ reply: reply.trim() });
  } catch (e) {
    res.status(200).json({ reply: "Bhai, thoda network issue hai, par main aapki madad ke liye taiyar hoon!" });
  }
}
