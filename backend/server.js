// LifeLine AI — backend proxy
// Keeps the Gemini API key server-side. The frontend only ever talks to this server.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const GNANI_API_KEY = process.env.GNANI_API_KEY;


const SYSTEM_PROMPT_BASE = `You are LifeLine AI, an emergency first-aid assistant for a mobile app used in real emergencies in India.
Rules you must always follow:
1. Never diagnose a medical condition. Describe possible general guidance only.
2. Always assume the reader is stressed and in a hurry — use short sentences, no jargon.
3. Never contradict standard first-aid safety practice (no home remedies, no folk medicine).
4. Always end by reminding the reader to call emergency services (108 in India) if they haven't already, when the situation is serious.
5. Keep your entire response under 120 words.
6. Do not use markdown headers or bullet symbols — write in short plain sentences/paragraphs, this will be read aloud by text-to-speech and shown directly in a mobile UI.`;

const LANG_INSTRUCTION = {
  en: "Respond in English.",
  hi: "Respond entirely in Hindi, written in Devanagari script (हिन्दी में लिखें).",
  mr: "Respond entirely in Marathi, written in Devanagari script (मराठीत लिहा).",
};

app.post("/api/guidance", async (req, res) => {
  const { emergencyType, answers, lang } = req.body || {};
  if (!emergencyType) {
    return res.status(400).json({ error: "emergencyType is required" });
  }
  if (!OPENROUTER_API_KEY) {
  return res.status(500).json({
    error: "Server is missing OPENROUTER_API_KEY."
  });
}
  

  const langKey = ["en", "hi", "mr"].includes(lang) ? lang : "en";
  const systemPrompt = `${SYSTEM_PROMPT_BASE}\n7. ${LANG_INSTRUCTION[langKey]}`;

  const answersText = Object.entries(answers || {})
    .map(([q, a]) => `${q}: ${a}`)
    .join("; ") || "No triage answers given.";

  const userPrompt = `Emergency type: ${emergencyType}\nTriage answers: ${answersText}\n\nBased on these specific answers, give short, prioritized, personalized next-step guidance (not the generic steps already shown — add nuance based on their specific situation).`;

  try {
    const response = await fetch(OPENROUTER_URL, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "openrouter/free",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: userPrompt
      }
    ],
    temperature: 0.4,
    max_tokens: 300
  }),
});

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return res.status(502).json({ error: "AI provider error" });
    }

    const data = await response.json();

const text =
  data?.choices?.[0]?.message?.content ||
  "No additional guidance available right now — follow the standard steps shown above.";
   
  res.json({ guidance: text.trim() });
  } catch (err) {
    console.error("Guidance endpoint failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const response = await fetch(
      "https://api.vachana.ai/api/v1/tts/sse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key-ID": GNANI_API_KEY,
        },
        body: JSON.stringify({
          model: "vachana-voice-v3",
          voice: "Karan",
          text,
          audio_config: {
            container: "mp3",
            sample_rate: 44100,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error(err);
      return res.status(500).send(err);
    }

    const sseText = await response.text();

    const lines = sseText.split("\n");

    let audioBase64 = "";

    for (const line of lines) {

      if (!line.startsWith("data:")) continue;

      try {

        const json = JSON.parse(line.replace("data:", "").trim());

        if (json.audio) {
          audioBase64 += json.audio;
        }

      } catch (_) {}

    }

    if (!audioBase64) {
      return res.status(500).json({
        error: "No audio received from Gnani",
      });
    }

    const audioBuffer = Buffer.from(audioBase64, "base64");

    res.setHeader("Content-Type", "audio/mpeg");

    res.send(audioBuffer);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "TTS Failed",
    });

  }
});

app.get("/test-tts", async (req, res) => {
  try {
    const response = await fetch("http://localhost:3001/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "Hello, this is a test from LifeLine AI."
      }),
    });

    const text = await response.text();
    res.send(text);

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LifeLine AI backend running on http://localhost:${PORT}`));
