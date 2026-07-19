# LifeLine AI — PWA

Interactive emergency first-aid companion. Plain HTML/CSS/JS frontend (installable PWA, works offline) + a small Node/Express backend that proxies AI calls so your API key never sits in the browser.

## How it's built

- **9 emergency types** (Burns, Choking, Snakebite, Stroke, Road Accident, Poisoning, Bleeding, Heart Attack, Drowning) with hardcoded, medically-standard "Do this now / Then / Avoid" steps — these render **instantly and work fully offline**, because that's the info that matters most in the first seconds of an emergency.
- **3 languages: English, Hindi (हिन्दी), Marathi (मराठी).** All hardcoded content and UI text is fully translated — tap EN / हिं / मरा in the top bar to switch anytime, mid-flow. Choice is remembered (saved in the browser).
- **Voice guidance.** A "Read steps aloud" button uses the browser's built-in text-to-speech (Web Speech API) to read the severity note + do-now + then + avoid steps out loud, in whichever language is selected, one step at a time — with the step being spoken highlighted on screen. Triage questions are also auto-spoken so the flow can be followed hands-free. No internet or API needed for this — it runs entirely on-device.
- A short branching **triage Q&A** per emergency (matches the flow in your doc), fully translated.
- After triage, the app calls your backend, which asks **Gemini** for guidance personalized to the specific answers given, generated in the selected language. If there's no signal or the backend isn't running, the app just tells the user to rely on the steps already shown — it never blocks on the AI call. The AI response also has its own "Read aloud" button.
- **Service worker** caches the whole app shell on first load, so it's installable and usable with zero connectivity after that.
- One-tap **Call 108**, and a **Nearby Hospital** button that opens Google Maps using the phone's GPS.

## Run it locally

### 1. Backend (holds the AI key)

```bash
cd backend
npm install
cp .env.example .env
# edit .env and paste your Gemini API key (free at https://aistudio.google.com/app/apikey)
npm start
```

Runs on `http://localhost:3001`.

### 2. Frontend

Any static file server works. Simplest:

```bash
cd frontend
npx serve .
# or: python3 -m http.server 5500
```

Open the printed URL (e.g. `http://localhost:5500`) in Chrome. You should see an "Install" icon in the address bar — that's the PWA install prompt.

If your frontend runs on a different port than assumed, update `window.LIFELINE_API_BASE` in `frontend/index.html`.

## Before you deploy for real

- Deploy the backend somewhere (Render, Railway, Fly.io all have free tiers) and point `LIFELINE_API_BASE` at that URL.
- Serve the frontend over **HTTPS** — service workers and install prompts require it (localhost is exempted for dev).
- Test "Add to Home Screen" on an actual Android phone, not just desktop Chrome — that's your real target user.
- The icons are placeholder generated shapes — swap `frontend/icons/icon-192.png` / `icon-512.png` for real branded ones before shipping.

## What's stubbed / next steps (from your doc's stretch goals)

Not built yet, in rough priority order for a hackathon:
1. **Voice input (speech-to-text)** — right now voice is one-way (the app speaks to the user). Adding the Web Speech API's recognition side would let users answer triage questions by voice too, for fully hands-free use.
2. **Practice mode** — reuse the same triage flow but score the user instead of calling AI.
3. **Emergency log / shareable report** — collect `state.answers` + which steps were checked off into a shareable text/PDF summary for doctors.
4. **More languages** — `translations.js` and `emergencyData.js` are structured so adding Tamil, Telugu, Bengali etc. is just adding another key to each object; no code changes needed.

## Files

```
frontend/
  index.html          entry point
  manifest.json        PWA manifest
  sw.js                 service worker (offline caching)
  css/styles.css
  js/emergencyData.js  all 9 emergencies' hardcoded steps + triage questions, in EN/HI/MR
  js/translations.js   UI text (buttons, labels) in EN/HI/MR
  js/icons.js           inline SVG icon set (no external icon CDN)
  js/voice.js            text-to-speech playback (Web Speech API)
  js/api.js              calls the backend for AI guidance
  js/app.js               screens/router, language switching, voice wiring
  icons/                 PWA icons

backend/
  server.js              Express proxy -> Gemini API (responds in the requested language)
  package.json
  .env.example
```
