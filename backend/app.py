"""
OpenHeart — Python Backend

Endpoints:
  POST /api/chat    — Send messages, get chatbot reply
  POST /api/haptic  — Trigger hardware haptic heart (placeholder)
  GET  /api/health  — Health check
"""

import os
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


# ---------- Chatbot ----------

FALLBACK_REPLIES = [
    "That's so interesting! Tell me more about yourself.",
    "I love that! What do you do for fun?",
    "Haha, you seem really cool! What's your favourite thing to do on weekends?",
    "That's awesome! I feel like we have a lot in common.",
    "Oh nice! I'd love to hear more about that.",
    "No way, me too! What are the odds?",
    "You sound like someone I'd get along with. What's your ideal date?",
    "That's a great fun fact! Here's mine: I once tried to learn the ukulele in a day.",
]


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    messages = data.get("messages", [])
    match_profile = data.get("matchProfile", {})

    system_prompt = (
        f"You are {match_profile.get('name', 'Alex')}, a person on a dating app called OpenHeart. "
        f"Here's your profile: Age {match_profile.get('age', 25)}, "
        f"{match_profile.get('zodiac', 'Leo')}, {match_profile.get('orientation', '')}, "
        f"loves {', '.join(match_profile.get('interests', ['chatting']))}. "
        f"Fun fact: {match_profile.get('funFact', 'I love trying new things')}. "
        "Be friendly, flirty, and engaging. Keep responses short (1-3 sentences). "
        "Ask questions back to keep the conversation going."
    )

    # Try Gemini first
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your-gemini-key-here":
        try:
            from google import genai

            client = genai.Client(api_key=api_key)

            # Build conversation history for Gemini
            contents = [{"role": "user", "parts": [{"text": system_prompt}]}]
            for m in messages:
                role = "user" if m["role"] == "user" else "model"
                contents.append({"role": role, "parts": [{"text": m["content"]}]})

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=contents,
            )
            return jsonify({"reply": response.text})
        except Exception as e:
            print(f"[Gemini error] {e}")

    # Fallback — no API key or error
    return jsonify({"reply": random.choice(FALLBACK_REPLIES)})


# ---------- Hardware Haptic Heart (placeholder) ----------

@app.route("/api/haptic", methods=["POST"])
def haptic_notify():
    data = request.get_json()
    action = data.get("action", "match")

    # TODO: Replace with actual hardware communication
    # For Arduino/ESP32 over serial:
    #   import serial
    #   ser = serial.Serial('/dev/ttyUSB0', 9600)
    #   ser.write(b'MATCH\n')
    #
    # For BLE:
    #   Use bleak library to send notification to heart device

    print(f"[HARDWARE] Haptic notification triggered: {action}")

    return jsonify({
        "message": f"Haptic notification: {action}",
        "hardware_connected": False,
    })


# ---------- Health check ----------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "app": "OpenHeart"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
