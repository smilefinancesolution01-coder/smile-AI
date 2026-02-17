export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  
  // AAPKI KEYS - DIRECT CODE MEIN
  const GROQ_KEY = "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";
  const GEMINI_KEY = "AIzaSyBVRutG9MFlE4NpH7scapxHnerfDCkoARw";
  const HF_TOKEN = "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";

  // Smile AI ka personality system
  const systemPrompt = `You are Smile AI, a financial expert for 'Smile Finance Solution'. Always call user 'bhai'. Help with business/personal loans (Poonawalla, HDFC, ICICI, Axis, Kotak, Tata Capital). Amazon ID: smileai24-21. Reply in friendly Hindi-English mix.`;

  // --- ENGINE 1: GROQ (Llama-3) - Ye sabse fast chalega ---
  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${GROQ_KEY}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const groqData = await groqResponse.json();
    if (groqData.choices && groqData.choices[0].message.content) {
      return res.status(200).json({ reply: groqData.choices[0].message.content });
    }
  } catch (e) {
    console.log("Groq Engine skipped due to error");
  }

  // --- ENGINE 2: GEMINI (Backup) ---
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt} User asks: ${message}` }] }]
      })
    });
    const geminiData = await geminiRes.json();
    if (geminiData.candidates && geminiData.candidates[0].content.parts[0].text) {
      return res.status(200).json({ reply: geminiData.candidates[0].content.parts[0].text });
    }
  } catch (e) {
    console.log("Gemini Engine skipped");
  }

  // --- ENGINE 3: HUGGING FACE (Final Fallback) ---
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: { "Authorization": `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        inputs: `<s>[INST] ${systemPrompt} \n User: ${message} [/INST]`,
        parameters: { max_new_tokens: 200 }
      })
    });
    const hfData = await hfRes.json();
    if (hfData[0]?.generated_text) {
      const cleanText = hfData[0].generated_text.split("[/INST]").pop();
      return res.status(200).json({ reply: cleanText });
    }
  } catch (e) {
    console.log("All Engines Failed");
  }

  return res.status(200).json({ reply: "Bhai, system load ho raha hai, ek baar phir se 'Hi' likho!" });
}
