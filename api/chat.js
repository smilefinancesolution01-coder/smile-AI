export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { message } = req.body;
  const { HUGGINGFACE_TOKEN, GROQ_API_KEY } = process.env;

  // --- STEP 1: Pehle Groq Try Karte hain ---
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "system", content: "You are Smile AI. Address as bhai. Help with finance." }, { role: "user", content: message }]
      })
    });
    const data = await groqRes.json();
    if (data.choices?.[0]?.message?.content) return res.status(200).json({ reply: data.choices[0].message.content });
  } catch (e) { console.log("Groq Fail"); }

  // --- STEP 2: Backup - Hugging Face (Mistral Model) ---
  try {
    const hfRes = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
      method: "POST",
      headers: { "Authorization": `Bearer ${HUGGINGFACE_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: `User: ${message}\nAI:`, parameters: { max_new_tokens: 100 } })
    });
    const data = await hfRes.json();
    if (data[0]?.generated_text) return res.status(200).json({ reply: data[0].generated_text.split("AI:")[1] || data[0].generated_text });
  } catch (e) { console.log("HF Fail"); }

  return res.status(200).json({ reply: "Bhai, teenon API system abhi block hain. Ek baar Groq Key refresh karke dekho!" });
}
