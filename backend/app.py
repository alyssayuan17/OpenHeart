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
import atexit
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from arduino_service import get_arduino_service, cleanup_arduino_service

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Arduino LCD Service
arduino = get_arduino_service()

# Clean up Arduino connection on app shutdown
atexit.register(cleanup_arduino_service)


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


# ---------- Hardware Arduino LCD Display ----------

@app.route("/api/arduino", methods=["POST"])
def arduino_notify():
    """
    Send like/skip signals to Arduino LCD display.
    
    Expected JSON:
    {
        "action": "like" or "skip"
    }
    """
    data = request.get_json()
    action = data.get("action", "").lower()
    
    success = False
    message = ""
    
    print(f"[API DEBUG] Received action: {action}")
    import sys
    sys.stdout.flush()
    
    if action == "like" or action == "match":
        print("[API DEBUG] Calling send_like()...")
        success = arduino.send_like()
        print(f"[API DEBUG] send_like returned: {success}")
        message = "Like signal sent to Arduino LCD (Heart display)"
    elif action == "skip" or action == "dislike":
        print("[API DEBUG] Calling send_skip()...")
        success = arduino.send_skip()
        print(f"[API DEBUG] send_skip returned: {success}")
        message = "Skip signal sent to Arduino LCD (X display)"
    else:
        return jsonify({
            "success": False,
            "message": f"Invalid action: {action}. Use 'like' or 'skip'.",
            "hardware_connected": arduino.is_connected
        }), 400
    
    status = arduino.get_status()
    
    print(f"[ARDUINO] Action: {action}, Success: {success}, Connected: {status['connected']}")
    
    return jsonify({
        "success": success,
        "message": message,
        "hardware_connected": status['connected'],
        "port": status['port'],
        "action": action
    })


@app.route("/api/arduino/status", methods=["GET"])
def arduino_status():
    """Get Arduino connection status."""
    status = arduino.get_status()
    return jsonify(status)


# ---------- Legacy Haptic Endpoint (kept for backwards compatibility) ----------

@app.route("/api/haptic", methods=["POST"])
def haptic_notify():
    """Legacy endpoint - redirects to /api/arduino"""
    data = request.get_json()
    action = data.get("action", "match")
    
    # Map legacy actions to new format
    if action == "match":
        action = "like"
    
    # Forward to arduino endpoint
    return arduino_notify()


# ---------- Health check ----------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "app": "OpenHeart"})


if __name__ == "__main__":
    # Debug mode disabled for Arduino compatibility
    # (Flask's auto-reloader conflicts with Arduino serial connection)
    app.run(debug=False, port=5000)
