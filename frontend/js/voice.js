// LifeLine AI — voice.js
// Text-to-speech using the browser's built-in Web Speech API (no external service,
// works offline once voices are downloaded by the OS/browser).

const Voice = (() => {
  let queue = [];
  let speaking = false;
  let cachedVoices = [];
  let onStepChange = null;

  if ("speechSynthesis" in window) {
    // Voices load asynchronously on some browsers/OSes.
    speechSynthesis.onvoiceschanged = () => {
      cachedVoices = speechSynthesis.getVoices();
    };
    cachedVoices = speechSynthesis.getVoices();
  }

  function pickVoice(langCode) {
    if (!cachedVoices.length) cachedVoices = speechSynthesis.getVoices();
    // Prefer an exact match (e.g. hi-IN), fall back to the language prefix (hi-*),
    // fall back to nothing (browser default voice will still speak the text).
    return (
      cachedVoices.find((v) => v.lang === langCode) ||
      cachedVoices.find((v) => v.lang && v.lang.startsWith(langCode.split("-")[0])) ||
      null
    );
  }

  function isSupported() {
    return "speechSynthesis" in window;
  }

  function stop() {
    queue = [];
    speaking = false;
    if (isSupported()) speechSynthesis.cancel();
    if (onStepChange) onStepChange(-1);
  }

  function speakOne(text, langCode) {
    return new Promise((resolve) => {
      if (!isSupported()) return resolve();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = langCode;
      const voice = pickVoice(langCode);
      if (voice) utter.voice = voice;
      utter.rate = 0.95;
      utter.onend = resolve;
      utter.onerror = resolve;
      speechSynthesis.speak(utter);
    });
  }

  // Speaks a list of step strings in sequence, calling onStep(index) before each one.
  async function speakSequence(steps, langCode, onStep) {
    stop();
    speaking = true;
    onStepChange = onStep || null;
    for (let i = 0; i < steps.length; i++) {
      if (!speaking) break; // stopped mid-way
      if (onStepChange) onStepChange(i);
      await speakOne(steps[i], langCode);
    }
    speaking = false;
    if (onStepChange) onStepChange(-1);
  }

  function isSpeaking() {
    return speaking;
  }

  return { isSupported, speakSequence, stop, isSpeaking };
})();
