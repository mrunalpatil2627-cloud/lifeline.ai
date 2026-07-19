// Talks to our own backend, which holds the Gemini/OpenAI key server-side.
// Never call the AI provider directly from the browser — that would expose your API key.

const API_BASE = window.LIFELINE_API_BASE || "http://localhost:3001";

async function getAIGuidance(emergencyType, answers, lang = "en") {
  try {
    const res = await fetch(`${API_BASE}/api/guidance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emergencyType, answers, lang }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const data = await res.json();
    return { ok: true, text: data.guidance };
  } catch (err) {
    // Offline or backend unreachable — the hardcoded steps already shown are enough
    // to act on right now. We just surface this quietly.
    console.warn("AI guidance unavailable, falling back to hardcoded steps only:", err.message);
    return { ok: false, error: err.message };
  }
}
async function playGnaniVoice(text) {

    const response = await fetch(
        `${API_BASE}/api/tts`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        }
    );

    const blob = await response.blob();

    const audio = new Audio(URL.createObjectURL(blob));

    audio.play();
}