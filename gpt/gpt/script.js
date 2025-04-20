let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-container");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDZiI363FOEUvNP9W8g74X0cdSijXdk-yc";

let user = {
    data: null,
};

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let userMessage = user.data.trim().toLowerCase();

    // Handle greetings directly without calling the API
    const greetings = ["hi", "hello", "hlo", "hey", "heyy"];
    if (greetings.includes(userMessage)) {
        text.innerHTML = `🌼 Hello, and welcome to our Meditation & Relaxation Guide. <br><br>
        I'm here to help you unwind, breathe, and reconnect with your calm. 
        Feel free to ask for breathing techniques, stress relief tips, or a mindfulness exercise. 🌿`;
        return;
    }

    // If not greeting, then call the Gemini API
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            "contents": [{
                "parts": [{
                    "text": `You are a calm and peaceful AI Meditation & Relaxation Guide. Answer mindfully: ${user.data}`
                }]
            }]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();

        let apiResponse = data.candidates[0].content.parts[0].text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .trim();

        // Format it nicely
        let formatted = apiResponse
            .replace(/\n\s*\*/g, "<br><br>•")
            .replace(/\n{2,}/g, "<br><br>")
            .replace(/\n/g, "<br>");

        text.innerHTML = formatted;
    } catch (err) {
        console.error("Error generating response:", err);
        text.innerHTML = "🌿 Hmm... I wasn't able to connect just now. Try again in a moment.";
    } finally {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: "smooth"
        });
    }
}


function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.classList.add(classes);
    div.innerHTML = html;
    return div;
}

function handleChatResponse(message) {
    if (!message.trim()) return;

    user.data = message;

    let userHtml = `
        <img src="./user.png" alt="User" id="userImage" width="50">
        <div class="user-chat-area">
            ${user.data}
        </div>`;

    prompt.value = "";

    let userChatBox = createChatBox(userHtml, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });

    setTimeout(() => {
        let aiHtml = `
            <img src="./ai.png" alt="AI" id="aiImage" width="70">
            <div class="ai-chat-area">
                <img src="./loading.webp" alt="Loading" class="load" width="40px" />
            </div>`;

        let aiChatBox = createChatBox(aiHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);

        generateResponse(aiChatBox);
    }, 600);
}

prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleChatResponse(prompt.value);
    }
});
