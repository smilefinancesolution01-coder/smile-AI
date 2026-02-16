export default async function (req, res) {
  try {
    const { message } = req.body;
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are Smile AI, a friendly friend. Always say 'bhai'." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    
    // Check if data exists
    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(200).json({ reply: "Bhai, API key check karo dashboard mein!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Bhai, server thoda ghabra gaya hai!" });
  }
}
