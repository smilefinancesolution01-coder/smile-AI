const API_KEY = "APNI_API_KEY_YAHAN_DALO"; // अपनी API Key यहाँ लिखें
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

// सिस्टम इंस्ट्रक्शन: यह कोड मुझे बताएगा कि मैं 'Smile AI' हूँ
const systemInstruction = "तुम 'Smile Finance Solution' के Official AI हो। एक भाई की तरह बात करो। HDFC, ICICI, Tata Capital से लोन की बात करो। Amazon ID smileai24-21 इस्तेमाल करो। पेमेंट के बाद 5 दोस्तों को शेयर करने पर 99 रुपये का डिस्काउंट बताओ।"; [cite: 2026-02-11, 2026-02-12, 2026-02-15, 2026-02-18]

async function getChatResponse(userMessage) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemInstruction + "\nUser: " + userMessage }]
                }]
            })
        });

        const data = await response.json();
        // अगर रिप्लाई मिल गया तो उसे स्क्रीन पर दिखाओ
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error connecting to Smile AI:", error);
        return "भाई, थोड़ा नेटवर्क इशू है, एक बार फिर से कोशिश करो!";
    }
}

// बाकी का कोड जो बटन क्लिक पर काम करेगा...
