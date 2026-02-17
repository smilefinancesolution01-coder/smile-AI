const fetch = require('node-fetch'); // Purana style jo Vercel ko pasand hai

module.exports = async (req, res) => {
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
        messages: [{ role: "user", content: `Address as bhai. Friendly reply: ${message}` }]
      })
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Bhai, ek baar fir try karo!";
    
    res.status(200).json({ reply: aiReply });
  } catch (error) {
    res.status(200).json({ reply: "Bhai, connection slow hai, par main yahi hoon!" });
  }
};
