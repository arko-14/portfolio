// assistant-widget.js (Resized for Compact Screens)
(function () {
  // ---- 1. CREATE STYLE TAG (THEME: TERMINAL/HACKER) ----
  const style = document.createElement("style");
  style.textContent = `
    .sp-ai-widget-root {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: 'Courier New', Courier, monospace;
      color: #e0e0e0;
      pointer-events: none;
    }

    .sp-ai-badge-button,
    .sp-ai-card {
      pointer-events: auto;
    }

    /* THE TERMINAL BUTTON (>_) */
    .sp-ai-badge-button {
      width: 56px; /* Slightly smaller button */
      height: 56px;
      border-radius: 50%;
      border: 1px solid #00ff41;
      background: #000;
      color: #00ff41;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation: sp-ai-pulse 3s infinite;
    }

    .sp-ai-badge-button:hover {
      transform: scale(1.1) rotate(-10deg);
      background: #00ff41;
      color: #000;
      box-shadow: 0 0 30px rgba(0, 255, 65, 0.6);
    }

    .sp-ai-badge-icon {
      font-size: 1.4rem;
      font-weight: bold;
      letter-spacing: -2px;
    }

    @keyframes sp-ai-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.4); }
      70%  { box-shadow: 0 0 0 15px rgba(0, 255, 65, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0); }
    }

    /* CARD CONTAINER (RESIZED) */
    .sp-ai-card {
      position: absolute;
      bottom: 75px;
      right: 0;
      width: 340px;       /* Reduced from 400px */
      max-height: 480px;  /* Reduced from 600px to fit screens */
      background: #050505;
      border-radius: 6px;
      border: 1px solid #222;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .sp-ai-card.sp-ai-open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* HEADER */
    .sp-ai-card-header {
      padding: 0.85rem;
      background: #0a0a0a;
      border-bottom: 1px solid #222;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sp-ai-card-title-main {
      display: flex; align-items: center; gap: 8px;
      font-weight: bold; color: #e0e0e0; font-size: 0.9rem;
    }

    .sp-ai-card-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #00ff41;
      box-shadow: 0 0 8px #00ff41;
    }

    .sp-ai-close-btn {
      background: none; border: none; color: #888; cursor: pointer; font-size: 1.1rem;
    }
    .sp-ai-close-btn:hover { color: #fff; }

    /* BODY */
    .sp-ai-card-body {
      padding: 0.85rem;
      background: #050505;
      font-size: 0.8rem;
      color: #aaa;
      border-bottom: 1px solid #1a1a1a;
    }
    
    .sp-ai-card-body strong { color: #fff; }

    .sp-ai-hint { margin-top: 6px; font-size: 0.75rem; color: #555; }

    .sp-ai-tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    
    .sp-ai-tag {
      font-size: 0.7rem;
      padding: 3px 8px;
      border: 1px solid #333;
      border-radius: 4px;
      color: #00ff41;
      background: rgba(0, 255, 65, 0.05);
      cursor: pointer;
      transition: 0.2s;
    }
    .sp-ai-tag:hover { background: #00ff41; color: #000; }

    /* CHAT LOG */
    .sp-ai-chat-log {
      flex: 1;
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      background: #050505;
      min-height: 150px;
    }

    .sp-ai-message {
      max-width: 85%;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .sp-ai-message-user {
      align-self: flex-end;
      background: #1a1a1a;
      color: #fff;
      border: 1px solid #333;
    }

    .sp-ai-message-bot {
      align-self: flex-start;
      background: rgba(0, 255, 65, 0.05);
      color: #e0e0e0;
      border-left: 2px solid #00ff41;
    }

    /* INPUT AREA */
    .sp-ai-input-row {
      padding: 0.85rem;
      display: flex; gap: 8px;
      background: #0a0a0a;
      border-top: 1px solid #222;
    }

    .sp-ai-input {
      flex: 1;
      padding: 8px;
      background: #000;
      border: 1px solid #333;
      border-radius: 4px;
      color: #fff;
      font-family: inherit;
      outline: none;
      font-size: 0.75rem;
    }
    .sp-ai-input:focus { border-color: #00ff41; }
    .sp-ai-input::placeholder { color: #444; }

    .sp-ai-send-btn {
      padding: 0 12px;
      background: #000;
      border: 1px solid #00ff41;
      color: #00ff41;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-weight: bold;
      font-size: 0.7rem;
      transition: 0.2s;
    }
    .sp-ai-send-btn:hover { background: #00ff41; color: #000; }

    @media (max-width: 480px) {
      .sp-ai-card { width: 90vw; bottom: 85px; right: 5vw; max-height: 60vh; }
    }
  `;
  document.head.appendChild(style);

  // ---- 2. CREATE WIDGET HTML ----
  const root = document.createElement("div");
  root.className = "sp-ai-widget-root";
  root.innerHTML = `
    <button class="sp-ai-badge-button" aria-label="Open assistant">
      <span class="sp-ai-badge-icon">&gt;_</span>
    </button>

    <div class="sp-ai-card" aria-label="Sandipan assistant panel">
      <div class="sp-ai-card-header">
        <div class="sp-ai-card-title-main">
            <span class="sp-ai-card-dot"></span>
            <span>SYSTEM_ASSISTANT.EXE</span>
        </div>
        <button class="sp-ai-close-btn" aria-label="Close assistant">✕</button>
      </div>

      <div class="sp-ai-card-body">
        <p><strong>System Ready:</strong> Ask about projects or stack.</p>
        <div class="sp-ai-tag-row">
          <span class="sp-ai-tag" data-question="Show me your projects">"Show projects"</span>
          <span class="sp-ai-tag" data-question="Tell me about Observa">"Observa"</span>
          <span class="sp-ai-tag" data-question="How to contact you?">"Contact"</span>
        </div>
      </div>

      <div class="sp-ai-chat-log"></div>

      <div class="sp-ai-input-row">
        <input type="text" class="sp-ai-input" placeholder="Enter command..." />
        <button class="sp-ai-send-btn">EXEC</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  const badgeBtn = root.querySelector(".sp-ai-badge-button");
  const card = root.querySelector(".sp-ai-card");
  const closeBtn = root.querySelector(".sp-ai-close-btn");
  const chatLog = root.querySelector(".sp-ai-chat-log");
  const input = root.querySelector(".sp-ai-input");
  const sendBtn = root.querySelector(".sp-ai-send-btn");
  const suggestionTags = root.querySelectorAll(".sp-ai-tag[data-question]");

  // ---- 3. OPEN/CLOSE HELPERS ----
  function openCard() { card.classList.add("sp-ai-open"); }
  function closeCard() { card.classList.remove("sp-ai-open"); }

  badgeBtn.addEventListener("click", () => {
    if (card.classList.contains("sp-ai-open")) closeCard();
    else { openCard(); input.focus(); }
  });
  closeBtn.addEventListener("click", closeCard);

  // ---- 4. CHAT RENDER HELPERS ----
  function addMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.className = "sp-ai-message " + (isUser ? "sp-ai-message-user" : "sp-ai-message-bot");
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ---- 5. BOT LOGIC ----
  function normalize(text) { return text.toLowerCase(); }

  function getBotReply(raw) {
    const q = normalize(raw);

    // 1. PROJECTS
    if (
      q.includes("show me your projects") ||
      q.includes("your projects") ||
      q.includes("projects") ||
      q.includes("project")
    ) {
      return "My main projects: Observa (NLP + MLOps), Law Vector, and AI Director. Check the Projects section for links.";
    }

    // 2. OBSERVA
    if (q.includes("observa")) {
      return "Observa is my NLP + MLOps project: DistilBERT fine-tuning, FastAPI backend, Gradio UI, MLflow tracking, DVC for data, and Prometheus/Grafana monitoring.";
    }

    // 3. PAPERDIGEST
    if (q.includes("paperdigest")) {
      return "Paperdigest summarizes research papers using Gemini. It includes TextRank fallbacks, reading time estimates, and a clean Flask UI.";
    }

    // 4. CURRENT WORK
    if (q.includes("working on") || q.includes("learning") || q.includes("now")) {
      return "Currently deep diving into LLM internals, Agentic Workflows, and reading 'Designing Data-Intensive Applications'.";
    }

    // 5. EXPERIENCE
    if (q.includes("experience") || q.includes("intern")) {
      return "I've done AI/ML work at Strydden Technologies (Python/Backend) and robotics work at Just Robotics (Embedded/ML).";
    }

    // 6. TECH STACK
    if (q.includes("skill") || q.includes("stack") || q.includes("tool")) {
      return "Stack: Python, FastAPI, Docker, SQL, AWS/GCP, PyTorch, TensorFlow, and VectorDBs.";
    }

    // 7. CONTACT
    if (q.includes("contact") || q.includes("email") || q.includes("reach")) {
      return "Email me at psandipan20@gmail.com or find me on LinkedIn via the dashboard.";
    }

    // 8. RESUME
    if (q.includes("resume") || q.includes("cv")) {
      return "You can download my resume using the link in the footer.";
    }

    // FALLBACK
    return "Command not recognized. Try asking about 'projects', 'Observa', 'skills', or 'contact'.";
  }

  // ---- 6. SEND HANDLERS ----
  function handleSend() {
    const text = (input.value || "").trim();
    if (!text) return;
    addMessage(text, true);
    input.value = "";
    
    setTimeout(() => {
        const reply = getBotReply(text);
        addMessage(reply, false);
    }, 400);
  }

  function sendSuggestion(question) {
    addMessage(question, true); // User sees the full question
    setTimeout(() => {
        const reply = getBotReply(question);
        addMessage(reply, false);
    }, 400);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const q = tag.getAttribute("data-question");
      sendSuggestion(q);
    });
  });

  // ---- 7. AUTO-OPEN ----
  try {
    const FLAG_KEY = "spAiHasGreeted";
    if (!localStorage.getItem(FLAG_KEY)) {
      setTimeout(() => { openCard(); localStorage.setItem(FLAG_KEY, "1"); }, 1500);
    }
  } catch (e) {}
})();