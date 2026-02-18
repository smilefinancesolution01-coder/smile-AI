// Vercel Environment Variable से API Key लेगा
const API_KEY = window.process?.env?.GEMINI_API_KEY || "YAHAN_APNI_KEY_BHI_DAL_SAKTE_HAIN"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const systemPrompt = `तुम 'Smile AI' हो, 'Smile Finance Solution' के पार्टनर। तुम Gemini की तरह बुद्धिमान हो। 
नियम: 1. भाई की तरह बात करो। 2. सीधे बैंक का नाम या नंबर न दो, पहले एक-एक करके सवाल पूछो। 
3. Amazon ID smileai24-21 का लैंडिंग पेज दिखाओ। 4. PDF मांगो और उसे एनालाइज करो। 
5. पेमेंट के बाद 99 रुपये का डिस्काउंट और 5 दोस्तों को शेयर करने का बोलो। 6. बिना किसी फालतू सिंबल के साफ जवाब दो।`;

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const message = inputField.value.trim();
    if (!message) return;

    appendMessage(message, 'user');
    inputField.value = '';

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\nUser: " + message }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        appendMessage(aiResponse, 'ai');
        
        // स्पिकर फंक्शन (Voice Response)
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        window.speechSynthesis.speak(utterance);

    } catch (error) {
        appendMessage("भाई, नेटवर्क में कुछ दिक्कत है। फिर से पूछो।", 'ai');
    }
}

function appendMessage(text, sender) {
    const container = document.getElementById('chat-container');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
