export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Bina kisi API ke direct response
  return res.status(200).json({ 
    reply: "Bhai, Smile AI ka engine start ho gaya hai! Agar aapko ye message dikh raha hai, toh iska matlab hai connection clear hai. Ab hum real AI connect kar sakte hain." 
  });
}
