// assistant-widget.js
(function () {
  // ---- 1. CREATE STYLE TAG ----
  const style = document.createElement("style");
  style.textContent = `
    .sp-ai-widget-root {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #e6f1ff;
      pointer-events: none;
    }

    .sp-ai-badge-button,
    .sp-ai-card {
      pointer-events: auto;
    }

    /* Floating icon */
    .sp-ai-badge-button {
      width: 56px;
      height: 56px;
      border-radius: 999px;
      border: 1px solid rgba(100, 255, 218, 0.7);
      background: radial-gradient(circle at 30% 20%, #64ffda, #020617);
      color: #0b192f;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 35px rgba(2, 12, 27, 0.9);
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
      animation: sp-ai-pulse 2.4s infinite;
    }

    .sp-ai-badge-button:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 16px 45px rgba(2, 12, 27, 1);
      background: radial-gradient(circle at 30% 20%, #a5ffe9, #020617);
    }

    .sp-ai-badge-icon {
      font-size: 1.8rem;
    }

    @keyframes sp-ai-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.5); }
      70%  { box-shadow: 0 0 0 16px rgba(100, 255, 218, 0); }
      100% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0); }
    }

    /* Card container */
    .sp-ai-card {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 500px;        /* increased from 320px */
      max-height: 580px;   /* increased from 420px */
      background: #020617;
      border-radius: 16px;
      border: 1px solid rgba(148, 163, 184, 0.4);
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.9);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }

    .sp-ai-card.sp-ai-open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .sp-ai-card-header {
      padding: 0.9rem 1rem 0.5rem;
      background: radial-gradient(circle at 0 0, rgba(22, 163, 74, 0.25), transparent 55%);
      border-bottom: 1px solid rgba(51, 65, 85, 0.9);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .sp-ai-card-title {
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .sp-ai-card-title-main {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .sp-ai-card-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 12px rgba(34, 197, 94, 0.9);
    }

    .sp-ai-card-subtitle {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .sp-ai-close-btn {
      border: none;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      width: 24px;
      height: 24px;
      transition: background 0.15s ease, color 0.15s ease;
      flex-shrink: 0;
    }

    .sp-ai-close-btn:hover {
      background: rgba(51, 65, 85, 0.8);
      color: #e5e7eb;
    }

    .sp-ai-card-body {
      padding: 0.75rem 1rem 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.83rem;
      color: #e5e7eb;
      border-bottom: 1px solid rgba(30, 64, 175, 0.6);
      background: radial-gradient(circle at 100% 0, rgba(59, 130, 246, 0.22), transparent 55%);
    }

    .sp-ai-card-body p {
      margin: 0;
    }

    .sp-ai-card-body strong {
      color: #a5b4fc;
      font-weight: 500;
    }

    .sp-ai-hint {
      font-size: 0.78rem;
      color: #9ca3af;
    }

    .sp-ai-card-body .sp-ai-tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.25rem;
    }

    .sp-ai-tag {
      font-size: 0.72rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      border: 1px solid rgba(148, 163, 184, 0.6);
      color: #cbd5f5;
      background: rgba(15, 23, 42, 0.85);
      cursor: pointer;
    }

    .sp-ai-chat-log {
      flex: 1;
      padding: 0.6rem 1rem 0.8rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      overflow-y: auto;
      background: radial-gradient(circle at 0 100%, rgba(15, 118, 110, 0.22), transparent 60%);
    }

    .sp-ai-message {
      max-width: 90%;
      padding: 0.45rem 0.7rem;
      border-radius: 0.9rem;
      font-size: 0.8rem;
      line-height: 1.3;
      word-wrap: break-word;
    }

    .sp-ai-message-user {
      align-self: flex-end;
      background: #22c55e;
      color: #022c22;
      border-bottom-right-radius: 0.25rem;
    }

    .sp-ai-message-bot {
      align-self: flex-start;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(51, 65, 85, 0.9);
      border-bottom-left-radius: 0.25rem;
    }

    .sp-ai-input-row {
      padding: 0.55rem 0.6rem 0.6rem;
      display: flex;
      gap: 0.4rem;
      align-items: center;
      background: #020617;
    }

    .sp-ai-input {
      flex: 1;
      padding: 0.45rem 0.65rem;
      background: #020617;
      border-radius: 0.7rem;
      border: 1px solid rgba(51, 65, 85, 0.9);
      color: #e5e7eb;
      font-size: 0.78rem;
      outline: none;
    }

    .sp-ai-input::placeholder {
      color: #6b7280;
    }

    .sp-ai-send-btn {
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      border: 1px solid rgba(96, 165, 250, 0.9);
      background: linear-gradient(135deg, #1d4ed8, #22c55e);
      color: white;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
      white-space: nowrap;
    }

    .sp-ai-send-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.7);
      filter: brightness(1.05);
    }

    .sp-ai-send-btn:active {
      transform: translateY(0);
      box-shadow: none;
      filter: brightness(0.96);
    }

    /* Small screens: shrink a bit */
    @media (max-width: 480px) {
      .sp-ai-card {
        width: 90vw;
        max-width: 360px;
        bottom: 80px;
        right: 12px;
      }

      .sp-ai-badge-button {
        bottom: 12px;
        right: 12px;
      }

      .sp-ai-widget-root {
        bottom: 16px;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // ---- 2. CREATE WIDGET ROOT + HTML ----
  const root = document.createElement("div");
  root.className = "sp-ai-widget-root";
  root.innerHTML = `
    <button class="sp-ai-badge-button" aria-label="Open assistant">
      <span class="sp-ai-badge-icon">🤖</span>
    </button>

    <div class="sp-ai-card" aria-label="Sandipan assistant panel">
      <div class="sp-ai-card-header">
        <div class="sp-ai-card-title">
          <div class="sp-ai-card-title-main">
            <span class="sp-ai-card-dot"></span>
            <span>Hello.exe</span>
          </div>
          <span class="sp-ai-card-subtitle">Ask about projects, ML, or experience</span>
        </div>
        <button class="sp-ai-close-btn" aria-label="Close assistant">✕</button>
      </div>

      <div class="sp-ai-card-body">
        <p><strong>Quick intro:</strong> My virtual bot, answering questions about my projects and what I’m learning.</p>
        <p class="sp-ai-hint">
          Try things like:
        </p>
        <div class="sp-ai-tag-row">
          <span class="sp-ai-tag" data-question="Show me your projects">"Show me your projects"</span>
          <span class="sp-ai-tag" data-question="Tell me about Observa">"Tell me about Observa"</span>
          <span class="sp-ai-tag" data-question="Contact me">"How to contact you?"</span>
           <span class="sp-ai-tag" data-question="Contact me">"Tell me about yourself"</span>
        </div>
      </div>

      <div class="sp-ai-chat-log"></div>

      <div class="sp-ai-input-row">
        <input
          type="text"
          class="sp-ai-input"
          placeholder="Ask something about my work or projects..."
        />
        <button class="sp-ai-send-btn">Send</button>
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
  function openCard() {
    card.classList.add("sp-ai-open");
  }

  function closeCard() {
    card.classList.remove("sp-ai-open");
  }

  badgeBtn.addEventListener("click", () => {
    if (card.classList.contains("sp-ai-open")) {
      closeCard();
    } else {
      openCard();
      input.focus();
    }
  });

  closeBtn.addEventListener("click", () => {
    closeCard();
  });

  // ---- 4. CHAT RENDER HELPERS ----
  function addMessage(text, isUser = false) {
    const msg = document.createElement("div");
    msg.className =
      "sp-ai-message " + (isUser ? "sp-ai-message-user" : "sp-ai-message-bot");
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  // ---- 5. RESPONSE LOGIC (SHORT + HUMAN) ----
  function normalize(text) {
    return text.toLowerCase();
  }

  function getBotReply(raw) {
    const q = normalize(raw);

    // ---- PROJECTS / SHOW ME YOUR PROJECTS (HIGH PRIORITY) ----
    if (
      q.includes("show me your projects") ||
      q.includes("your projects") ||
      q.includes("projects you have done") ||
      q.includes("projects have you done") ||
      q.includes("featured projects") ||
      q.includes("portfolio projects") ||
      q.includes("project list") ||
      q.includes("list of projects") ||
      q.includes("main projects") ||
      q.includes("top projects") ||
      q.includes("project") ||
      q.includes("projects")
    ) {
      return "My main projects: Observa (NLP + MLOps pipeline with FastAPI, Gradio, MLflow, Prometheus, Grafana), Paperdigest (AI research-paper summarizer with Gemini + classic summarizers), and several CNN/Transformer re-implementations. You’ll see more in the Projects section and on my GitHub.";
    }

    // who is / about the assistant
    if (
      q.includes("who are you") ||
      q.includes("what are you") ||
      q.includes("assistant") ||
      q.includes("who is this bot")
    ) {
      return "I’m a small custom assistant for this portfolio. I only know about my projects, internships, skills, and what I’m currently learning.";
    }

    // current work / what are you working on
    if (
      q.includes("working on now") ||
      q.includes("currently working") ||
      q.includes("these days") ||
      q.includes("right now") ||
      q.includes("what are you learning these days") ||
      q.includes("what are you focusing these days")
    ) {
      return "Right now I’m deep into LLMs and ML systems: Raschka’s LLM book, stats & probability revision, and getting more hands-on with PyTorch and applied LLM workflows.";
    }

    // Observa
    if (q.includes("observa")) {
      return "Observa is my NLP + MLOps project: DistilBERT fine-tuning, FastAPI backend, Gradio UI, MLflow tracking, DVC for data/pipelines, and Prometheus + Grafana for live monitoring — all Dockerized.";
    }

    // Paperdigest
    if (q.includes("paperdigest")) {
      return "Paperdigest is my research-paper summarizer. It uses Gemini for the main summaries, falls back to TextRank/Gensim, shows reading time, supports TTS, and lets you download or share summaries via a clean Flask web UI.";
    }

    // other projects
    if (q.includes("other projects") || q.includes("other work")) {
      return "Apart from Observa and Paperdigest, I’ve built CNN and Transformer implementations from scratch, a law-focused chatbot, and various smaller ML/AI experiments that live in my GitHub repos.";
    }

    // learning / what are you learning
    if (
      q.includes("learning") ||
      q.includes("studying") ||
      q.includes("what is he learning")
    ) {
      return "I’m focusing on LLM internals, MoE, RAG, fine-tuning strategies, and solid ML math like stats, probability, and optimization. In parallel, I’m brushing up SQL/DBMS for ML-oriented interviews.";
    }

    // experience / internships
    if (
      q.includes("experience") ||
      q.includes("intern") ||
      q.includes("internship") ||
      q.includes("work history") ||
      q.includes("work experience")
    ) {
      return "I’ve done AI/ML work at Strydden Technologies and a robotics internship at Just Robotics, combining Python/Flask/FastAPI with hardware (ESP32, microcontrollers) and ML/NLP-style projects.";
    }

    // resume / cv
    if (q.includes("resume") || q.includes("cv")) {
      return "You can view my resume using the Resume link in the navbar — that’s the best single-page overview of my skills, projects, and experience.";
    }

    // skills / tech stack
    if (
      q.includes("skills") ||
      q.includes("stack") ||
      q.includes("tech stack") ||
      q.includes("technologies") ||
      q.includes("what do you use") ||
      q.includes("what tools do you use")
    ) {
      return "My main stack: Python, Flask/FastAPI, Docker, SQL/PostgreSQL, some AWS/GCP, plus ML/DL with PyTorch, TensorFlow/Keras, and NLP tooling. I also have embedded/robotics experience from my Just Robotics work.";
    }

    // blog / writing
    if (q.includes("blog") || q.includes("writing") || q.includes("medium")) {
      return "I write practical breakdowns of my projects on Medium — especially around Observa, Paperdigest, and ML experiments. You can jump there from the Blog section of this site.";
    }

    // college / academics
    if (q.includes("college") || q.includes("university") || q.includes("degree") || q.includes("branch")) {
      return "I’m pursuing a B.E. in Electrical and Electronics Engineering, with a strong tilt towards AI for power systems and applied ML projects alongside my coursework.";
    }

    // why EEE -> ML
    if (
      q.includes("why ml") ||
      q.includes("why machine learning") ||
      q.includes("eee and ml") ||
      q.includes("electrical and ml") ||
      q.includes("why shift to ml")
    ) {
      return "EEE gave me a good base in maths and systems thinking. ML clicked for me during projects and hackathons, so I started using that same problem-solving mindset to build end-to-end ML and LLM systems.";
    }

    // about you / who is sandipan
    if (
      q.includes("about you") ||
      q.includes("about sandipan") ||
      q.includes("who are you sandipan") ||
      q.includes("who is sandipan")
    ) {
      return "I’m an ML-leaning backend engineer from EEE, who likes building complete pipelines: data → models → APIs → monitoring, with a big interest in LLM/applied-ML roles.";
    }

    // contact / email / how to reach you
    if (
      q.includes("contact") ||
      q.includes("reach you") ||
      q.includes("email") ||
      q.includes("how do i contact you") ||
      q.includes("how can i contact you")
    ) {
      return "Easiest way to reach me is email (psandipan20@gmail.com) or via LinkedIn — both are linked in the Contact section of this site.";
    }

    // github
    if (q.includes("github")) {
      return "You can find my code on GitHub (link in the footer and Projects section). That’s where my active repos like Observa, Paperdigest, and ML experiments live.";
    }

    // linkedin
    if (q.includes("linkedin")) {
      return "My LinkedIn is linked in the Contact section and footer. It has a quick overview of my experience, internships, and updates.";
    }

    // kaggle
    if (q.includes("kaggle")) {
      return "I have a Kaggle profile too — linked in the footer — where I explore datasets, experiments, and some ML notebooks.";
    }

    // roles / hiring / opportunities / collab
    if (
      q.includes("hire you") ||
      q.includes("hiring") ||
      q.includes("open to work") ||
      q.includes("job") ||
      q.includes("role") ||
      q.includes("opportunity") ||
      q.includes("collab") ||
      q.includes("collaborate") ||
      q.includes("work with you")
    ) {
      return "I’m mainly looking for roles around ML/LLM engineering or ML-heavy backend. If you’re hiring or want to collaborate, you can mail me or ping me on LinkedIn/email or even X too";
    }

    // strengths / what are you good at
    if (
      q.includes("strengths") ||
      q.includes("what are you good at") ||
      q.includes("what are your strengths")
    ) {
      return "I’m good at taking things from idea to working system: clear problem breakdown, building robust backends around ML, and making sure stuff is observable and debuggable, not just ‘a model in a notebook’.";
    }

    // hobbies / outside of work
    if (
      q.includes("hobbies") ||
      q.includes("outside of work") ||
      q.includes("outside work")
    ) {
      return "Outside pure coding, I like tinkering with hardware/robots, reading about AI/LLMs, and occasionally writing about what I build so it’s easier for future me (and others) to follow.";
    }

    // greetings (kept late so it doesn’t override specific questions)
    if (/(^|\s)(hi|hello|hey|sup)\b/.test(q)) {
      return "Hey! I’m a small assistant for this portfolio. Ask me about my projects, skills, internships, or what I’m learning right now.";
    }

    // fallback – short + helpful
    return "I might not fully get that, but I’m best at questions about my projects, skills, internships, current focus, and learning path.";
  }

  // ---- 6. SEND HANDLERS ----
  function handleSend() {
    const text = (input.value || "").trim();
    if (!text) return;
    addMessage(text, true);
    input.value = "";

    const reply = getBotReply(text);
    setTimeout(() => addMessage(reply, false), 220);
  }

  function sendSuggestion(question) {
    const text = (question || "").trim();
    if (!text) return;
    addMessage(text, true);
    const reply = getBotReply(text);
    setTimeout(() => addMessage(reply, false), 220);
  }

  sendBtn.addEventListener("click", handleSend);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // click handlers for suggestion tags
  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      const q = tag.getAttribute("data-question") || tag.textContent || "";
      sendSuggestion(q);
    });
  });

  // ---- 7. AUTO-OPEN ON FIRST VISIT ----
  try {
    const FLAG_KEY = "spAiHasGreeted";
    const already = window.localStorage.getItem(FLAG_KEY);
    if (!already) {
      setTimeout(() => {
        openCard();
        window.localStorage.setItem(FLAG_KEY, "1");
      }, 1200);
    }
  } catch (e) {
    // ignore if localStorage not available
  }
})();
