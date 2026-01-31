"""
OpenHeart — Python Backend

Endpoints:
  POST /api/chat    — Send messages, get chatbot reply
  POST /api/haptic  — Trigger hardware haptic heart (placeholder)
  GET  /api/health  — Health check
"""

import os
import random
import atexit
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from arduino_service import get_arduino_service, cleanup_arduino_service

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

    # Try Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your-gemini-key-here":
        from google import genai
        client = genai.Client(api_key=api_key)

        # Build conversation history for Gemini
        contents = [{"role": "user", "parts": [{"text": system_prompt}]}]
        for m in messages:
            role = "user" if m["role"] == "user" else "model"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

        # Try models in order; fall through on rate-limit or error
        for model_name in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite"]:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=contents,
                )
                return jsonify({"reply": response.text})
            except Exception as e:
                print(f"[Gemini {model_name} error] {e}")

    # Fallback — no API key or error
    return jsonify({"reply": random.choice(FALLBACK_REPLIES)})


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
    
    logger.debug(f"Received action: {action}")
    
    if action == "like" or action == "match":
        logger.debug("Calling send_like()...")
        success = arduino.send_like()
        logger.debug(f"send_like returned: {success}")
        message = "Like signal sent to Arduino LCD (Heart display)"
    elif action == "skip" or action == "dislike":
        logger.debug("Calling send_skip()...")
        success = arduino.send_skip()
        logger.debug(f"send_skip returned: {success}")
        message = "Skip signal sent to Arduino LCD (X display)"
    else:
        return jsonify({
            "success": False,
            "message": f"Invalid action: {action}. Use 'like' or 'skip'.",
            "hardware_connected": arduino.is_connected
        }), 400
    
    status = arduino.get_status()
    
    logger.info(f"Arduino action: {action}, Success: {success}, Connected: {status['connected']}")
    
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
    app.run(debug=False, port=5001)
