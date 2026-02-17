export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

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
          { role: "system", content: "You are Smile AI. Address user as bhai. Give smart finance and shopping advice. Reply in Hindi/English mix." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    
    // Yahan check karein ki kya data sahi aaya hai
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      // Agar API key galat hai ya limit khatam hai
      return res.status(200).json({ reply: "Bhai, API response khali hai. Ek baar Groq Key check karo." });
    }

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, connection slow hai, par main koshish kar raha hoon!" });
  }
}
