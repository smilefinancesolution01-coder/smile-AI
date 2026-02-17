export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  
  // Is line mein apni API Key double quotes ke andar paste kar do
  const MY_API_KEY =("AIzaSyA16LSDaJ0Y5A_7RLzwo5VjLEYa3NGdz9U")

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${MY_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI, a financial expert. Call the user 'bhai'. My Amazon ID is smileai24-21. Help with loans. Reply in Hindi/English. User: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      return res.status(200).json({ reply: "Bhai, API Key toh mil gayi par Google ne mana kar diya. Shayaad Key galat hai!" });
    }
  } catch (error) {
    return res.status(200).json({ reply: "Bhai, engine start nahi ho raha!" });
  }
}
