🌱 Nalam-AI Chatbot
📌 Overview

Nalam-AI is an AI-powered chatbot that connects human health with traditional agriculture.

The system recommends nutrient-rich traditional crops and natural farming methods based on a user's health condition or nutrient deficiency.

The chatbot promotes the concept:

Healthy Soil → Healthy Crops → Healthy People

Users can ask about a health issue, and the chatbot will suggest:

Required nutrients

Traditional crops that contain those nutrients

Organic farming methods

Home gardening techniques

Harvest time and cost estimation

Possible healthy recipes

If the information is not available in the database, the chatbot uses Ollama AI to generate a response.

🚀 Features

✔ Health-condition based crop recommendations
✔ Nutrient guidance for common diseases
✔ Traditional crop suggestions
✔ Organic farming methods (chemical-free)
✔ Home gardening / terrace gardening guidance
✔ Voice-to-text input using Web Speech API
✔ Optional text-to-speech response
✔ Chat history storage using SQLite
✔ AI fallback using Ollama when database data is unavailable

🛠 Technologies Used
Frontend

HTML

CSS

JavaScript

Backend

Python

FastAPI

Database

SQLite

AI Integration

Ollama API (phi3 model)

Voice Features

Web Speech API (Voice Input)

SpeechSynthesis API (Text-to-Speech)

▶️ How to Run the Project
1️⃣ Install required libraries
pip install -r requirements.txt
2️⃣ Start the backend server
uvicorn backend.main:app --reload

Server runs at:

http://127.0.0.1:8000
3️⃣ Run the frontend

Navigate to the frontend folder:

cd frontend

Start a simple server:

python -m http.server 5500

Open in browser:

http://localhost:5500
💬 Example Queries

You can try asking:

diabetes
hypertension
anemia
iron deficiency

The chatbot will recommend traditional crops and natural farming methods.

🌍 Purpose

The goal of Nalam-AI is to promote:

🌾 Nutritional awareness

🌱 Traditional crops

🌍 Sustainable agriculture

🍃 Organic farming practices

👨‍💻 Developed For

AI + Agriculture Hackathon
