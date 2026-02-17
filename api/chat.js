// Final Test - Smile Finance AI 10Cr Project
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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
          { 
            role: "system", 
            content: "You are Smile AI, a finance expert for Smile Finance Solution. Address the user as 'bhai'. Help with loans (HDFC, ICICI, Poonawalla) and shopping. Reply in a friendly Hindi/English mix." 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Agar Groq se sahi jawab aaye
    if (data.choices && data.choices[0]) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      // Fallback agar API response mein dikkat ho
      return res.status(200).json({ reply: "Bhai, main sun raha hoon, batayein main aapki loan ya shopping mein kaise madad karun?" });
    }

  } catch (error) {
    // Connection error backup
    return res.status(200).json({ reply: "Bhai, server thoda busy lag raha hai, ek baar fir se likhiye!" });
  }
}
