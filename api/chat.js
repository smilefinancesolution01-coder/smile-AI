// ... कोड के अंदर ...
const data = await response.json();
console.log("Groq Full Response:", JSON.stringify(data)); // Ye Vercel Logs mein dikhega

if (data.error) {
  return res.status(200).json({ reply: `Bhai, Groq ne error diya hai: ${data.error.message}` });
}
// ... बाकी कोड ...
