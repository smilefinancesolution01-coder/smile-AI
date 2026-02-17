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
        messages: [{ role: "user", content: `You are Smile AI. Address user as bhai. Give a friendly reply in Hindi/English: ${message}` }]
      })
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Bhai, main sun raha hoon, batayein!";
    return res.status(200).json({ reply: aiReply });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, server busy hai, thodi der mein try karein!" });
  }
}
