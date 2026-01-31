"""
OpenHeart — Python Backend

Endpoints:
  POST /api/chat    — Send messages, get chatbot reply
  POST /api/tts     — Text-to-speech (ElevenLabs placeholder)
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

    # Try OpenAI first
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key and api_key != "sk-your-key-here":
        try:
            import openai
            client = openai.OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *[{"role": m["role"], "content": m["content"]} for m in messages],
                ],
                max_tokens=150,
            )
            return jsonify({"reply": response.choices[0].message.content})
        except Exception as e:
            print(f"[OpenAI error] {e}")

    # Fallback — no API key or error
    return jsonify({"reply": random.choice(FALLBACK_REPLIES)})


# ---------- Text-to-Speech (ElevenLabs placeholder) ----------

@app.route("/api/tts", methods=["POST"])
def text_to_speech():
    data = request.get_json()
    text = data.get("text", "")

    api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    if api_key and api_key != "your-key-here":
        try:
            import requests as req
            response = req.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={
                    "xi-api-key": api_key,
                    "Content-Type": "application/json",
                },
                json={"text": text, "model_id": "eleven_monolingual_v1"},
            )
            if response.ok:
                audio_path = os.path.join("static", "tts_output.mp3")
                os.makedirs("static", exist_ok=True)
                with open(audio_path, "wb") as f:
                    f.write(response.content)
                return jsonify({"audio_url": f"/static/tts_output.mp3"})
        except Exception as e:
            print(f"[ElevenLabs error] {e}")

    # Fallback — tell frontend to use browser TTS
    return jsonify({"audio_url": None, "fallback": "browser", "text": text})


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
