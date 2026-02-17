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
          { role: "system", content: "You are Smile AI, a financial expert for Smile Finance Solution. Address the user as 'bhai'. Help with loans and shopping deals. Use Hindi/English mix." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    // Agar Groq se asli jawab aaye toh wo dikhao
    const aiReply = data.choices?.[0]?.message?.content || "Bhai, main sun raha hoon, batayein kya madad karun?";
    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, thoda connection check karo, main reply nahi de pa raha!" });
  }
}
