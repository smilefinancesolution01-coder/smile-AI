export default async function handler(req, res) {
  // Vercel Environment Variable se key le raha hai
  const key = process.env.GROQ_API_KEY; 
  
  // Agar key nahi mili to ye message dikhayega
  if (!key) {
    return res.status(200).json({ 
      reply: "Bhai, Vercel Dashboard mein 'GROQ_API_KEY' naam ka variable nahi mil raha. Use check karo aur Redeploy karo!" 
    });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { 
            role: "system", 
            content: "You are a friendly Indian AI friend named Smile AI. Always address the user as 'bhai'. Talk about finance, loans, and shopping naturally." 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(200).json({ reply: "Bhai, Groq API se response nahi aaya. Key expire toh nahi ho gayi?" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Bhai, server side par kuch fat gaya hai. Connection check karo!" });
  }
}
