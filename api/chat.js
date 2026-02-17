export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { message } = req.body;

  const GROQ_KEY = "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";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        // UPDATED MODEL: Ye Groq ka sabse naya aur fast model hai
        model: "llama-3.3-70b-versatile", 
        messages: [
          { 
            role: "system", 
            content: `You are Smile AI, a world-class finance expert for 'Smile Finance Solution'. 
            - Always call the user 'bhai'.
            - Help with Business/Personal loans (Poonawalla, HDFC, ICICI, Tata Capital).
            - Suggest shopping deals using Amazon ID: smileai24-21.
            - Talk like a supportive friend, analyze their trouble, and suggest products.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0].message.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(200).json({ reply: `Bhai, error hai: ${data.error?.message}` });
    }
  } catch (error) {
    return res.status(200).json({ reply: "Bhai, connection check karo!" });
  }
}
