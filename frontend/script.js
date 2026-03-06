// ==============================
// ELEMENT REFERENCES
// ==============================

const chatbox = document.getElementById("chatbox")
const input = document.getElementById("messageInput")
const voiceBtn = document.getElementById("voiceBtn")

const historyPanel = document.getElementById("historyPanel")
const historyContent = document.getElementById("historyContent")

let listening = false


// ==============================
// SEND MESSAGE
// ==============================

async function sendMessage() {

    const msg = input.value.trim()

    if (!msg) return

    addMessage(msg, "user")

    input.value = ""

    try {

        const response = await fetch("http://127.0.0.1:8000/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: msg
            })

        })

        const data = await response.json()

        console.log("API Response:", data)

        if (data.reply) {

            addMessage(data.reply, "bot")

        } else {

            addMessage("No response received.", "bot")

        }

    } catch (err) {

        console.error("Server error:", err)

        addMessage("Server connection failed.", "bot")

    }

}


// ==============================
// ADD MESSAGE TO CHAT
// ==============================

function addMessage(text, type) {

    const div = document.createElement("div")

    div.className = type

    const msg = document.createElement("span")

    msg.innerText = text

    div.appendChild(msg)

    // Add READ button only for bot messages
    if (type === "bot") {

        const readBtn = document.createElement("button")

        readBtn.innerText = "🔊"

        readBtn.className = "readBtn"

        readBtn.onclick = () => speak(text)

        div.appendChild(readBtn)

    }

    chatbox.appendChild(div)

    chatbox.scrollTop = chatbox.scrollHeight

}

function showGreeting() {

    const greeting = `Hello! 🌱 Welcome to Nalam-AI.

Tell me your health condition or nutrient deficiency,
and I will recommend traditional crops along with organic
farming and home gardening methods.`;

    addMessage(greeting, "bot");

}


// ==============================
// TEXT TO SPEECH
// ==============================

function speak(text) {

    if (window.speechSynthesis.speaking) {

        window.speechSynthesis.cancel()

        return
    }

    const speech = new SpeechSynthesisUtterance(text)

    speech.lang = "en-US"

    window.speechSynthesis.speak(speech)

}


// ==============================
// RESET CHAT
// ==============================

function resetChat() {

    chatbox.innerHTML = ""

    addMessage("Hello 👋 Tell me your disease or nutrient deficiency.", "bot")

}


// ==============================
// HISTORY TOGGLE
// ==============================

function toggleHistory() {

    if (!historyPanel) return

    historyPanel.classList.toggle("open")

    if (historyPanel.classList.contains("open")) {

        loadHistory()

    }

}


// ==============================
// LOAD HISTORY
// ==============================

async function loadHistory() {

    try {

        const res = await fetch("http://127.0.0.1:8000/history")

        const data = await res.json()

        historyContent.innerHTML = ""

        if (data.history && data.history.length > 0) {

            data.history.forEach(item => {

                const div = document.createElement("div")

                div.className = "historyItem"

                div.innerHTML = `
                <b>You:</b> ${item.user}<br>
                <b>Bot:</b> ${item.bot}
                `

                historyContent.appendChild(div)

            })

        } else {

            historyContent.innerHTML = "No chat history found."

        }

    } catch (err) {

        console.error(err)

        historyContent.innerHTML = "Unable to load history."

    }

}


// ==============================
// VOICE INPUT
// ==============================

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

let recognition = null

if (SpeechRecognition) {

    recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false

    voiceBtn.onclick = () => {

        if (listening) {

            recognition.stop()

            listening = false

            voiceBtn.innerText = "🎤"

            return

        }

        recognition.lang = "en-US"

        recognition.start()

        listening = true

        voiceBtn.innerText = "🔴"

    }

    recognition.onresult = (event) => {

        const transcript = event.results[0][0].transcript

        input.value = transcript

        listening = false

        voiceBtn.innerText = "🎤"

        sendMessage()

    }

    recognition.onend = () => {

        listening = false

        voiceBtn.innerText = "🎤"

    }

}


// ==============================
// ENTER KEY SUPPORT
// ==============================

input.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        sendMessage()

    }

})

window.onload = function () {

    showGreeting();

};