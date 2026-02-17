export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { GEMINI_API_KEY } = process.env;

  try {
    // Ye wala URL aur Model version bilkul perfect hai
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Smile AI, a financial expert. Call the user 'bhai'. My Amazon ID is smileai24-21. Help with loans. Reply in Hindi/English. User says: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    // Agar error aata hai toh wo yahan dikhega
    if (data.error) {
      return res.status(200).json({ reply: `Bhai, Google keh raha hai: ${data.error.message}` });
    }

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
    }

    return res.status(200).json({ reply: "Bhai, API Key load toh hui par output nahi aaya. Key refresh karo!" });

  } catch (error) {
    return res.status(200).json({ reply: "Bhai, server thoda slow hai, dobara likho!" });
  }
}
