// Version 1.1 - Smile Finance AI Final Logic
export default async function handler(req, res) {
  const { message } = req.body;
  const groqKey = process.env.GROQ_API_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${groqKey}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are Smile AI. Address user as bhai. Give expert finance advice. Use Hindi/English mix." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    // Agar API se sahi jawab aaye toh wo dikhao, varna default text
    if (data.choices && data.choices[0]) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    }
    return res.status(200).json({ reply: "Bhai, main sun raha hoon, API response check karo!" });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, server busy hai, thodi der mein try karein!" });
  }
}
