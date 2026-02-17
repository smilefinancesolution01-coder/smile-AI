export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  
  // Aapki di hui API Key humne yahan fix kar di hai
  const MY_API_KEY = "AIzaSyBVRutG9MFlE4NpH7scapxHnerfDCkoARw"; 

  try {
    // UPDATED: v1 version ke saath sabse stable model use kiya hai
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${MY_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI, a friendly and professional finance expert for 'Smile Finance Solution'. 
          - Always call the user 'bhai'. 
          - Help with business and personal loans from Poonawalla, HDFC, ICICI, Axis, Kotak, and Tata Capital. 
          - Suggest products using Amazon ID: smileai24-21 when asked for shopping.
          - Reply in a clean, human-like Hindi-English mix. 
          User Message: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    // Check karein ki Google ne sahi response diya ya nahi
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiReply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: aiReply });
    } else if (data.error) {
      // Agar Google abhi bhi mana kare toh yahan wajah dikhegi
      return res.status(200).json({ reply: `Bhai, Google keh raha hai: ${data.error.message}` });
    } else {
      return res.status(200).json({ reply: "Bhai, Key toh mil gayi par reply blank hai. Ek baar AI Studio mein Model check karo!" });
    }

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, connection mein thoda issue hai, par hum haar nahi maanenge! Dobara try karo." });
  }
}
