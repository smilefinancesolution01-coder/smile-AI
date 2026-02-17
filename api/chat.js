export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY; 
  
  if (!key) {
    return res.status(200).json({ reply: "Bhai, Vercel Dashboard mein 'GEMINI_API_KEY' check karo!" });
  }

  try {
    const { message } = req.body;
    // YAHAN BADLAV KIYA HAI: gemini-1.5-flash-8b istemal ho raha hai
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${key}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are Smile AI, a friendly finance expert. Always address user as 'bhai'. User: ${message}` }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reply: "Bhai, Gemini key sahi hai par quota check karo!" });
    }
  } catch (error) {
    res.status(500).json({ reply: "Bhai, Gemini connect nahi ho raha!" });
  }
}
