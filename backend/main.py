from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import requests

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "nutrition_data.db"


# -----------------------------
# DATABASE CONNECTION
# -----------------------------
def get_connection():
    return sqlite3.connect(DB_PATH)


# -----------------------------
# GET DISEASE DATA
# -----------------------------
def get_disease_data(issue):

    if not issue:
        return None

    issue = str(issue).strip().lower()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT
        "Health Issue Detected",
        "Primary Nutrient Needed",
        "Recommended Traditional Crop",
        "Type of Soil Needed",
        "Organic Farming Advisory",
        "Small Space/Home Gardening Concept",
        "Basic Procedure",
        "Expected Harvest Time",
        "Budgeting & Space Cost",
        "Possible Dishes & Recipes"

    FROM tn_soil_to_soul_1000_dataset

    WHERE LOWER("Health Issue Detected") LIKE ?
    """, (f"%{issue}%",))

    row = cursor.fetchone()

    conn.close()

    if row:
        return {
            "health": row[0],
            "nutrient": row[1],
            "crop": row[2],
            "soil": row[3],
            "organic": row[4],
            "home": row[5],
            "procedure": row[6],
            "harvest": row[7],
            "budget": row[8],
            "recipes": row[9]
        }

    return None


# -----------------------------
# SAVE CHAT HISTORY
# -----------------------------
def save_history(user, bot):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_history(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        bot TEXT
    )
    """)

    cursor.execute(
        "INSERT INTO chat_history(user,bot) VALUES (?,?)",
        (user, bot)
    )

    conn.commit()
    conn.close()


# -----------------------------
# OLLAMA FALLBACK
# -----------------------------
def ask_ollama(question):

    try:

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "phi3",
                "prompt": question,
                "stream": False
            }
        )

        data = response.json()

        return data.get("response", "No AI response available.")

    except Exception:
        return "AI model not available right now."


# -----------------------------
# CHAT API
# -----------------------------
@app.post("/chat")
async def chat(data: dict):

    question = data.get("message", "")

    greetings = ["hi", "hello", "hey", "good morning", "good evening"]

    if question.lower() in greetings:
        return {
            "reply": "Hello! 👋 Tell me your disease or nutrient deficiency and I will suggest traditional crops and natural farming methods."
        }

    result = get_disease_data(question)

    if result:

        reply = f"""
Health Issue: {result['health']}

Required Nutrient:
{result['nutrient']}

Recommended Traditional Crop:
{result['crop']}

Soil Needed:
{result['soil']}

Organic Farming Method:
{result['organic']}

Home Gardening:
{result['home']}

Basic Growing Procedure:
{result['procedure']}

Harvest Time:
{result['harvest']}

Estimated Budget:
{result['budget']}

Healthy Recipes:
{result['recipes']}
"""

        save_history(question, reply)

        return {"reply": reply}

    else:

        ai_reply = ask_ollama(question)

        save_history(question, ai_reply)

        return {"reply": ai_reply}


# -----------------------------
# HISTORY API
# -----------------------------
@app.get("/history")
def history():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT user, bot
    FROM chat_history
    ORDER BY id DESC
    LIMIT 20
    """)

    rows = cursor.fetchall()

    conn.close()

    history = []

    for r in rows:
        history.append({
            "user": r[0],
            "bot": r[1]
        })

    return {"history": history}