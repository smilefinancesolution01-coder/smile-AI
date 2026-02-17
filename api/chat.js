export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { message } = req.body;

  // GOOGLE GEMINI 1.5 FLASH (Super Fast & Powerful)
  const API_KEY = "AIzaSyBVRutG9MFlE4NpH7scapxHnerfDCkoARw"; 

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `
          Role: You are Smile AI, a highly intelligent Human-like Financial Expert.
          Company: Smile Finance Solution.
          Tone: Friendly, professional, and empathetic. Call the user 'bhai'.
          Knowledge: Expert in Loans (HDFC, ICICI, Poonawalla) and Amazon Shopping (ID: smileai24-21).
          Instruction: Give clean, large, and structured replies without unnecessary symbols.
          User Message: ${message}` 
        }]}]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      // Agar ye fail ho toh Groq ko call karo (Auto-Switch)
      return res.status(200).json({ reply: "Bhai, main thoda deep thinking kar raha hoon, ek baar phir 'Hi' likho!" });
    }
  } catch (error) {
    return res.status(200).json({ reply: "Bhai, server busy hai!" });
  }
}
