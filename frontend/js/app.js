// LifeLine AI — app.js
// Simple hash-router, no framework needed. State lives in `state` and each
// screen is a render function that writes into #app.

const root = document.getElementById("app");

function loadLang() {
  try {
    return localStorage.getItem("lifeline_lang") || "en";
  } catch (e) {
    return "en";
  }
}
function saveLang(lang) {
  try { localStorage.setItem("lifeline_lang", lang); } catch (e) {}
}

const state = {
  screen: "home",
  emergencyId: null,
  qIndex: 0,
  answers: {},
  checked: {},
  lang: loadLang(),
};

function t(key) { return UI_TEXT[state.lang][key]; }
function data() { return EMERGENCY_DATA[state.lang]; }

function go(screen, patch = {}) {
  Voice.stop();
  Object.assign(state, { screen }, patch);
  render();
  window.scrollTo(0, 0);
}

function setLang(lang) {
  Voice.stop();
  state.lang = lang;
  saveLang(lang);
  render();
}

// ---------- Language switcher (rendered on every screen) ----------
function langSwitcherHTML() {
  return `
    <div class="lang-switch" id="lang-switch">
      ${Object.keys(LANG_NAMES).map(l =>
        `<button class="lang-pill ${l === state.lang ? "active" : ""}" data-lang="${l}">${LANG_NAMES[l]}</button>`
      ).join("")}
    </div>
  `;
}
function bindLangSwitcher() {
  root.querySelectorAll("#lang-switch .lang-pill").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

// ---------- HOME ----------
function renderHome() {
  const e = data();
  root.innerHTML = `
    <div class="topbar">
      <div class="icon-badge" style="width:36px;height:36px;border-radius:9px;background:var(--red-dim);color:var(--red);display:flex;align-items:center;justify-content:center;">${icon("heart")}</div>
      <h1>${t("appName")}</h1>
      ${langSwitcherHTML()}
    </div>
    <div class="hero">
      <h2>${t("heroTitle")}</h2>
      <p>${t("heroSub")}</p>
    </div>
    <div class="grid">
      ${EMERGENCY_ORDER.map(id => {
        const item = e[id];
        return `<button class="emergency-card" data-id="${id}">${icon(item.icon)}<span>${item.label}</span></button>`;
      }).join("")}
    </div>
    <div class="sos-bar">
      <div>
        <div class="txt">${t("sosTitle")}</div>
        <div class="sub">${t("sosSub")}</div>
      </div>
      <a href="tel:108">${icon("phone")} ${t("call108")}</a>
    </div>
    <p class="disclaimer" style="margin:0 20px 30px;">${t("homeDisclaimer")}</p>
  `;
  bindLangSwitcher();
  root.querySelectorAll(".emergency-card").forEach(btn => {
    btn.addEventListener("click", () => go("detail", { emergencyId: btn.dataset.id, qIndex: 0, answers: {}, checked: {} }));
  });
}

// ---------- DETAIL (instant hardcoded guidance) ----------
function renderDetail() {
  const e = data()[state.emergencyId];
  root.innerHTML = `
    <div class="topbar">
      <button id="back">${icon("back")}</button>
      <h1>${e.label}</h1>
      ${langSwitcherHTML()}
    </div>
    <div class="detail-header">
      <div class="icon-badge">${icon(e.icon)}</div>
      <h2>${e.label}</h2>
    </div>
    <div class="severity-banner">${icon("alert")}<span>${e.severity}</span></div>

    <div class="voice-row">
      <button class="voice-btn" id="speak-btn">${icon("mic")}<span id="speak-label">${t("speakSteps")}</span></button>
    </div>

    <div class="section">
      <p class="section-label now">${icon("alert")} ${t("doNow")}</p>
      <ul class="step-list now" id="list-immediate"></ul>
    </div>
    <div class="section">
      <p class="section-label do">${icon("check")} ${t("then")}</p>
      <ul class="step-list do" id="list-do"></ul>
    </div>
    <div class="section">
      <p class="section-label dont">${icon("x")} ${t("avoid")}</p>
      <ul class="step-list dont" id="list-dont"></ul>
    </div>

    <div class="action-row">
      <a class="action-btn primary" href="tel:108">${icon("phone")}${t("call108")}</a>
      <a class="action-btn" id="find-hospital" href="#">${icon("hospital")}${t("findHospital")}</a>
      <button class="action-btn" id="start-triage">${icon("activity")}${t("getAiGuidance")}</button>
    </div>
    <p class="disclaimer">${t("detailDisclaimer")}</p>
  `;
  bindLangSwitcher();

  fillList("list-immediate", e.immediate, "now");
  fillList("list-do", e.do, "do");
  fillList("list-dont", e.dont, "dont");

  root.querySelector("#back").addEventListener("click", () => go("home"));
  root.querySelector("#start-triage").addEventListener("click", () => go("triage"));
  root.querySelector("#find-hospital").addEventListener("click", (ev) => {
    ev.preventDefault();
    openHospitalMap();
  });

  bindSpeakButton(document.getElementById("speak-btn"), [e.severity, ...e.immediate, ...e.do, ...e.dont]);
}

function openHospitalMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        window.open(`https://www.google.com/maps/search/hospital/@${latitude},${longitude},15z`, "_blank");
      },
      () => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")
    );
  } else {
    window.open("https://www.google.com/maps/search/hospital+near+me", "_blank");
  }
}

function fillList(elId, items, cls) {
  const ul = document.getElementById(elId);
  ul.innerHTML = items.map((txt, i) => {
    const key = `${elId}-${i}`;
    return `<li data-key="${key}"><span class="bullet">${cls === "dont" ? "✕" : "●"}</span><span>${txt}</span></li>`;
  }).join("");
  if (cls !== "dont") {
    ul.querySelectorAll("li").forEach(li => {
      li.addEventListener("click", () => li.classList.toggle("checked"));
    });
  }
}

// Wires a "speak steps" button: plays the given list of strings in sequence via TTS,
// highlighting whichever step is currently being read (when a matching <li> exists).
function bindSpeakButton(btn, steps) {
  if (!btn) return;
  if (!Voice.isSupported()) {
    btn.disabled = true;
    btn.style.opacity = "0.4";
    return;
  }
  const label = btn.querySelector("span");
  btn.addEventListener("click", () => {
    if (Voice.isSpeaking()) {
      Voice.stop();
      btn.classList.remove("playing");
      label.textContent = t("speakSteps");
      clearSpeakingHighlight();
      return;
    }
    btn.classList.add("playing");
    label.textContent = t("stopSpeaking");
    Voice.speakSequence(steps, SPEECH_LOCALE[state.lang], (idx) => {
      highlightSpeakingStep(idx);
      if (idx === -1) {
        btn.classList.remove("playing");
        label.textContent = t("speakSteps");
      }
    });
  });
}

function clearSpeakingHighlight() {
  root.querySelectorAll(".step-list li.speaking").forEach(li => li.classList.remove("speaking"));
}

// Best-effort highlight: step 0 in the spoken array is the severity banner (no li),
// remaining indices map across immediate -> do -> dont lists in order.
function highlightSpeakingStep(idx) {
  clearSpeakingHighlight();
  if (idx <= 0) return;
  const flatIdx = idx - 1; // account for severity being spoken first
  const lists = [
    root.querySelectorAll("#list-immediate li"),
    root.querySelectorAll("#list-do li"),
    root.querySelectorAll("#list-dont li"),
  ];
  let cursor = flatIdx;
  for (const list of lists) {
    if (cursor < list.length) {
      if (list[cursor]) list[cursor].classList.add("speaking");
      return;
    }
    cursor -= list.length;
  }
}

// ---------- TRIAGE (branching Q&A, question spoken aloud automatically) ----------
function renderTriage() {
  const e = data()[state.emergencyId];
  const q = e.questions[state.qIndex];

  if (!q) {
    go("guidance");
    return;
  }

  root.innerHTML = `
    <div class="topbar">
      <button id="back">${icon("back")}</button>
      <h1>${e.label}</h1>
      ${langSwitcherHTML()}
    </div>
    <div class="triage-progress">
      ${e.questions.map((_, i) => `<div class="dot ${i < state.qIndex ? "done" : ""}"></div>`).join("")}
    </div>
    <div class="triage-card">
      <div class="triage-q-row">
        <p class="triage-q">${q.text}</p>
        <button class="mic-btn" id="speak-q" title="${t('speakSteps')}">${icon("mic")}</button>
      </div>
      <div class="triage-options" id="opts"></div>
    </div>
  `;
  bindLangSwitcher();

  const optsEl = root.querySelector("#opts");
  const options = q.options;
  options.forEach(opt => {
    const b = document.createElement("button");
    b.textContent = opt;
    b.addEventListener("click", () => {
      Voice.stop();
      state.answers[q.text] = opt;
      const key = q.type === "yesno" ? opt : "*";
      const nextId = (q.next[key]) || q.next["*"] || "DONE";
      if (nextId === "DONE" || nextId === "CALL_NOW") {
        go("guidance");
      } else {
        const nextIndex = e.questions.findIndex(qq => qq.id === nextId);
        go("triage", { qIndex: nextIndex >= 0 ? nextIndex : state.qIndex + 1 });
      }
    });
    optsEl.appendChild(b);
  });

  root.querySelector("#back").addEventListener("click", () => go("detail"));

  const speakQBtn = root.querySelector("#speak-q");
  if (!Voice.isSupported()) {
    speakQBtn.style.display = "none";
  } else {
    speakQBtn.addEventListener("click", () => {
      Voice.speakSequence([q.text, ...options], SPEECH_LOCALE[state.lang]);
    });
    // Auto-speak the question as it appears — hands-free triage.
    Voice.speakSequence([q.text], SPEECH_LOCALE[state.lang]);
  }
}

// ---------- GUIDANCE (AI-personalized, with graceful fallback) ----------
async function renderGuidance() {
  const e = data()[state.emergencyId];
  root.innerHTML = `
    <div class="topbar">
      <button id="back">${icon("back")}</button>
      <h1>${e.label}</h1>
      ${langSwitcherHTML()}
    </div>
    <div class="section" style="padding-top:20px;">
      <p class="section-label now">${icon("alert")} ${t("doNow")}</p>
      <ul class="step-list now" id="list-immediate"></ul>
    </div>
    <div class="ai-panel loading" id="ai-panel">
      <div class="label">${icon("mic")} ${t("aiPanelLabel")}</div>
      <div class="body" id="ai-body">${t("aiThinking")}</div>
    </div>
    <div class="voice-row" id="ai-voice-row" style="display:none;">
      <button class="voice-btn" id="speak-ai-btn">${icon("mic")}<span id="speak-ai-label">${t("speakSteps")}</span></button>
    </div>
    <div class="action-row">
      <a class="action-btn primary" href="tel:108">${icon("phone")}${t("call108")}</a>
      <a class="action-btn" id="find-hospital2" href="#">${icon("hospital")}${t("findHospital")}</a>
    </div>
    <p class="disclaimer">${t("guidanceDisclaimer")}</p>
  `;
  bindLangSwitcher();
  fillList("list-immediate", e.immediate, "now");
  root.querySelector("#back").addEventListener("click", () => go("detail"));
  root.querySelector("#find-hospital2").addEventListener("click", (ev) => {
    ev.preventDefault();
    openHospitalMap();
  });

  const result = await getAIGuidance(e.label, state.answers, state.lang);
  const panel = document.getElementById("ai-panel");
  const body = document.getElementById("ai-body");
  panel.classList.remove("loading");

  if (result.ok) {
    body.textContent = result.text;
    const voiceRow = document.getElementById("ai-voice-row");
    voiceRow.style.display = "flex";
    document.getElementById("speak-ai-btn").addEventListener("click", () => {
    playGnaniVoice(result.text);
});
  } else {
    body.innerHTML = `${t("aiUnavailable")} <br><br><strong>${t("remember")}</strong> ${e.severity}`;
  }
}

// ---------- Router ----------
function render() {
  if (state.screen === "home") renderHome();
  else if (state.screen === "detail") renderDetail();
  else if (state.screen === "triage") renderTriage();
  else if (state.screen === "guidance") renderGuidance();
}

render();

// ---------- Service worker registration ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(err => console.warn("SW registration failed:", err));
  });
}
