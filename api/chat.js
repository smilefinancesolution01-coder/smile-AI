export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { GEMINI_API_KEY } = process.env;

  try {
    // Model ka naam badal kar 'gemini-1.5-flash-latest' kiya gaya hai
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI, a friendly finance expert for Smile Finance Solution. Always call the user 'bhai'. Help with loans and shopping (Amazon ID: smileai24-21). Reply in Hindi/English mix. User says: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Agar ye bhi fail ho toh humein pata chal jayega
      return res.status(200).json({ reply: `Bhai, Google Error: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }

    return res.status(200).json({ reply: "Bhai, connection toh ho gaya par jawab nahi aaya. Ek baar Key refresh karo!" });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, lagta hai internet slow hai, dobara try karein!" });
  }
}
