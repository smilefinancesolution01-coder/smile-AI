export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { message } = req.body;

  // AAPKI GROQ KEY - ISKA ISTEMAL KAR RAHE HAIN
  const GROQ_KEY = "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";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        // Yahan humne sabse bada aur powerful model (70B) lagaya hai
        model: "llama3-70b-8192", 
        messages: [
          { 
            role: "system", 
            content: `You are Smile AI, a highly intelligent human-like finance expert for 'Smile Finance Solution'. 
            - Always call the user 'bhai'.
            - Your language should be very clean, natural, and friendly (Hindi-English mix).
            - Help with Business/Personal loans (Poonawalla, HDFC, ICICI, Tata Capital).
            - Suggest shopping deals using Amazon ID: smileai24-21.
            - Provide insightful advice like a real human consultant.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.8 // Isse reply bilkul insano jaisa natural aayega
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0].message.content) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      // Agar Groq ne koi technical error diya toh yahan dikhega
      return res.status(200).json({ reply: `Bhai, system update ho raha hai. Error: ${data.error?.message || "Limit Reached"}` });
    }
  } catch (error) {
    return res.status(200).json({ reply: "Bhai, connection slow hai, ek baar phir try karo!" });
  }
}
