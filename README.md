# OpenHeart

A dating app that's inclusive of people with disabilities. Built for ElleHacks.

## Quick Start

### Frontend (React + Vite)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Opens at **http://localhost:3000**

### Backend (Python + Flask)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # then fill in your API keys
python app.py
```

Runs at **http://localhost:5000**

## Project Structure

```
frontend/
  src/
    components/       UI components (TopNav, BodySelector, SwipeCard, AccessibilityMenu)
    context/          React contexts (AppContext, AccessibilityContext)
    pages/            App screens (Login, Onboarding, JourneyAnimation, Swiping, Chat)
    data/             Dummy profiles for swiping
    index.css         All styles + theme variables (edit to restyle)

backend/
  app.py              Flask API (chat, TTS, haptic endpoints)
  .env.example        API key template
```

## How to Customize the Design

Everything is designed to be easy to swap:

| What to change | Where |
|---|---|
| Colors & fonts | `frontend/src/index.css` — CSS variables in `:root` |
| Logo | Search `REPLACE` comments in `TopNav.jsx` and `LoginPage.jsx` |
| Body illustrations | `BodySelector.jsx` — replace the SVG functions |
| Profile card design | `SwipeCard.jsx` + `.swipe-card` styles in CSS |
| Dummy profiles | `frontend/src/data/dummyProfiles.js` |
| Chatbot personality | `backend/app.py` — edit the system prompt |

## Features

- **Login** — dummy auth (email/password)
- **Onboarding** — inclusive profile builder (gender identity, pronouns, sexual orientation, communication preferences)
- **Body Selector** — pick a cartoon body, upload/take photo for the head
- **Swiping** — Tinder-style card swiping, instant match on right swipe
- **Chat** — messaging with chatbot, voice messages (auto-transcribed), text-to-speech
- **Accessibility** — high-contrast, colorblind-safe, dyslexia-friendly, reduced-motion, large-text themes
- **Hardware** — Arduino LCD display shows hearts ❤️ on like, X ❌ on skip (see [ARDUINO_SETUP.md](./ARDUINO_SETUP.md))

## Accessibility Modes

Toggle from the gear icon (top-right corner, always visible):

- **High Contrast** — black background, yellow accents, white text
- **Colorblind Safe** — deuteranopia-friendly palette
- **Dyslexia Friendly** — OpenDyslexic font, warm background, wider spacing
- **Reduced Motion** — disables all animations and transitions
- **Large Text** — scales all font sizes up

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send messages, get chatbot reply |
| POST | `/api/tts` | Text-to-speech (ElevenLabs) |
| POST | `/api/arduino` | Send like/skip signal to Arduino LCD |
| GET | `/api/arduino/status` | Check Arduino connection status |
| POST | `/api/haptic` | Trigger haptic heart hardware (legacy, redirects to `/api/arduino`) |
| GET | `/api/health` | Health check |

## Team

- **Alyssa** — Full-stack app development
- **Renee** — Hardware, characters, frontend polish
- **Michelle** — Character illustrations, logo, UI design
- **Inshal** — Chatbot, AI model integration
