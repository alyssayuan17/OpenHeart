import os
import requests
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

ELEVEN_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")
ELEVEN_VOICE_ID = os.getenv("ELEVEN_VOICE_ID")  # may be empty
ELEVEN_MODEL = os.getenv("ELEVEN_LABS_MODEL", "eleven_monolingual_v1")

# Fallback voice when ELEVEN_VOICE_ID is not provided
DEFAULT_VOICE = "alloy"

OUTPUT_DIR = "static"
OUTPUT_FILE = "tts_output.mp3"
OUTPUT_PATH = os.path.join(OUTPUT_DIR, OUTPUT_FILE)


def synthesize_text(text: str, voice_id: str = None, output_path: str = OUTPUT_PATH) -> Tuple[bool, str]:
    """
    Synthesize text with Eleven Labs and write MP3 to output_path.
    Returns (success, path_or_error_message).
    If no voice is configured, uses DEFAULT_VOICE.
    """
    if not ELEVEN_API_KEY:
        logger.error("ELEVEN_LABS_API_KEY not set")
        return False, "ELEVEN_LABS_API_KEY not set in environment"

    # choose voice: explicit param > env var > default
    voice = voice_id or ELEVEN_VOICE_ID or DEFAULT_VOICE
    if voice_id is None and not ELEVEN_VOICE_ID:
        logger.warning("No ELEVEN_VOICE_ID set; falling back to default voice '%s'", DEFAULT_VOICE)

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/stream"

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    payload = {
        "text": text,
        "model": ELEVEN_MODEL
    }

    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        r = requests.post(url, json=payload, headers=headers, stream=True, timeout=60)
        if r.status_code != 200:
            logger.error("ElevenLabs API error: status=%s body=%s", r.status_code, r.text)
            return False, f"ElevenLabs API error: {r.status_code} - {r.text}"
        with open(output_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=4096):
                if chunk:
                    f.write(chunk)
        logger.info("Wrote TTS to %s (voice=%s)", output_path, voice)
        return True, output_path
    except requests.RequestException as e:
        logger.exception("RequestException when calling ElevenLabs")
        return False, f"Request error: {e}"
    except Exception as e:
        logger.exception("Unexpected error in synthesize_text")
        return False, f"Unexpected error: {e}"
