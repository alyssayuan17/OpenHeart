# OpenHeart

A dating app that's inclusive of people with disabilities. Built for **ElleHacks**.

OpenHeart focuses on accessible communication — text, voice, and assistive hardware — so everyone can express themselves comfortably.

---

## Quick Start

### Frontend (React + Vite)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Opens at **[http://localhost:3000](http://localhost:3000)**

---

### Backend (Python + Flask)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # then fill in your API keys
python app.py
```

Runs at **[http://localhost:5001](http://localhost:5001)**

---

## Environment Variables

The backend relies on external APIs for conversational AI and text-to-speech.

Required variables in `backend/.env`:

```env
# ElevenLabs (Text-to-Speech)
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
ELEVEN_VOICE_ID=your_voice_id

# (Optional / future expansion)
# OPENAI_API_KEY=your_key_here
```

> **Note:** `.env` is gitignored and should never be committed.

---

## ElevenLabs Integration (Text-to-Speech)

OpenHeart uses **ElevenLabs** to convert chatbot responses and messages into natural-sounding speech.

### How it works

* Frontend sends text → `/api/tts`
* Flask backend calls the ElevenLabs API
* An MP3 file is generated and returned as a playable URL

### Example Request

```bash
curl -X POST http://localhost:5001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from OpenHeart"}'
```

### Example Response

```json
{
  "success": true,
  "url": "/static/tts_output.mp3"
}
```

You can play the audio directly at:

```
http://localhost:5001/static/tts_output.mp3
```

---

## Project Structure

```
frontend/
  src/
    components/       UI components (TopNav, BodySelector, SwipeCard, AccessibilityMenu, HeadTiltOverlay)
    hooks/            Custom hooks (useHeadTilt — MediaPipe face tracking)
    context/          React contexts (AppContext, AccessibilityContext)
    pages/            App screens (Login, Onboarding, JourneyAnimation, Swiping, Chat)
    data/             Dummy profiles for swiping
    index.css         All styles + theme variables (edit to restyle)

backend/
  app.py              Flask API (chat, TTS, Arduino, health)
  .env.example        API key template
  static/             Generated audio files (TTS output)
```

---

## Features

* **Login** — dummy auth (email/password)
* **Onboarding** — inclusive profile builder (gender identity, pronouns, sexual orientation, communication preferences)
* **Body Selector** — pick a cartoon body, upload/take photo for the head
* **Swiping** — Tinder-style card swiping, instant match on right swipe, hands-free head tilt control
* **Chat** — messaging with chatbot, voice messages (auto-transcribed), text-to-speech (ElevenLabs)
* **Accessibility** — high-contrast, colorblind-safe, dyslexia-friendly, reduced-motion, large-text themes
* **Computer Vision** — head tilt detection for hands-free swiping (MediaPipe), automatic face-based photo cropping (browser FaceDetector API)
* **Hardware Integration** — Arduino LCD displays ❤️ on like, ❌ on skip

---

## Accessibility Modes

Toggle from the gear icon (top-right corner, always visible):

* **High Contrast** — black background, yellow accents, white text
* **Colorblind Safe** — deuteranopia-friendly palette
* **Dyslexia Friendly** — OpenDyslexic font, warm background, wider spacing
* **Reduced Motion** — disables all animations and transitions
* **Large Text** — scales all font sizes up
* **Head Tilt Control** — hands-free swiping using your webcam (toggle on the swiping page)

---

## Computer Vision

OpenHeart uses lightweight, browser-based computer vision — no OpenCV or heavy ML frameworks needed. Everything runs client-side with no extra server setup.

### Head Tilt Swiping (MediaPipe)

Tilt your head left to pass, right to match — completely hands-free. Uses Google's **MediaPipe Face Landmarker** to track face landmarks through the webcam in real-time. The app grabs two eye points, calculates the tilt angle between them, applies smoothing to reduce jitter, and triggers a swipe when the angle is large enough. A short cooldown prevents accidental double-swipes.

* Toggle it with the **Head Tilt** button on the swiping page (between the thumbs up/down buttons)
* Webcam preview appears below the cards with live angle readout
* Directional arrows show "Pass" or "Match" feedback on tilt

### Face-Based Photo Cropping (Browser FaceDetector API)

During onboarding, when you upload or take a profile photo, the app uses the **browser's built-in FaceDetector API** to find your face and automatically crop around it. If the browser doesn't support it (non-Chromium), it falls back to a simple center crop.

---

## API Endpoints

| Method | Endpoint              | Description                            |
| ------ | --------------------- | -------------------------------------- |
| POST   | `/api/chat`           | Send messages, get chatbot reply       |
| POST   | `/api/tts`            | Text-to-speech using ElevenLabs        |
| POST   | `/api/arduino`        | Send like/skip signal to Arduino LCD   |
| GET    | `/api/arduino/status` | Check Arduino connection status        |
| POST   | `/api/haptic`         | Trigger haptic heart hardware (legacy) |
| GET    | `/api/health`         | Health check                           |

---

## Built For

* **ElleHacks**
* Accessibility-first design
* Inclusive communication
* Rapid prototyping with real hardware + AI

❤️ OpenHeart — connection without barriers.
