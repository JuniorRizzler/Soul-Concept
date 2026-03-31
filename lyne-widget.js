(function () {
  var POSITION_KEY = 'sc_lyne_widget_position_v1'
  var PANEL_OPEN_KEY = 'sc_lyne_widget_panel_open_v1'
  var CHAT_KEY = 'sc_lyne_widget_chat_v1'
  var STABLE_CHAT_KEY = 'sc_lyne_widget_chat_stable_v1'
  var GUIDE_KEY = 'sc_lyne_widget_guide_v1'
  var HINT_DISMISSED_KEY = 'sc_lyne_widget_hint_dismissed_v1'
  var ONBOARDING_ACTIVE_KEY = 'sc_lyne_onboarding_active_v1'
  var ONBOARDING_STEP_KEY = 'sc_lyne_onboarding_step_v1'
  var ONBOARDING_DISMISSED_KEY = 'sc_lyne_onboarding_dismissed_v1'
  var ONBOARDING_VOICE_KEY = 'sc_lyne_onboarding_voice_v1'
  var FINAL_SPEECH_PAUSE_MS = 720
  var INTERIM_SPEECH_PAUSE_MS = 1450
  var DEFAULT_CHAT = 'LYNE AI: I am your Soul Concept study assistant. Open me and talk to me anytime.'
  var DEFAULT_STILL_HERE = 'I am LYNE, the Soul Concept AI. Ask me where to go in the app, what to study next, or what concept you want explained.'
  var LYNE_APP_CONTEXT =
    'You are LYNE, the in-app guide for Soul Concept. ' +
    'App purpose: help Grade 9-10 students study faster with structured libraries and focused tools. ' +
    'Navigation map: Home=index.html, Science Library=study-library.html, Geography Library=geography-library.html, ' +
    'Math 9 Library=math/index.html, Math 10 Library=grade-10-math.html, Pre-AP Preview=preap-grade-10-preview.html, ' +
    'Concept Cards=anki/index.html, Quiz Tool=math-quiz-simulator.html. ' +
    'When asked where to go, give exact file names from this map. ' +
    'When asked what the app was made for, answer directly using the purpose above. ' +
    'For learning questions, answer clearly in short steps with one quick example. ' +
    'Avoid generic repeated lines.'
  var GUIDE_TARGETS = {
    science: {
      path: '/index.html',
      selector: '[data-tour-id="home-science-open"]',
      reply: 'Click Jump to Libraries, then choose Open Science.',
      hint: 'Click Open Science'
    },
    geography: {
      path: '/index.html',
      selector: '[data-tour-id="home-geography"]',
      reply: 'Click Jump to Libraries, then choose Open Geography.',
      hint: 'Click Open Geography'
    },
    math9: {
      path: '/index.html',
      selector: '[data-tour-id="home-math9-open"]',
      reply: 'Click Jump to Libraries, then browse the cards and choose Open Math 9.',
      hint: 'Click Open Math 9'
    },
    math10: {
      path: '/index.html',
      selector: '[data-tour-id="home-math10-open"]',
      reply: 'Click Jump to Libraries, then browse the cards and choose Open Math 10.',
      hint: 'Click Open Math 10'
    },
    cards: {
      path: '/index.html',
      selector: '[data-tour-id="home-cards-open"]',
      reply: 'Click Jump to Libraries, then choose Open Cards.',
      hint: 'Click Open Cards'
    },
    quiz: {
      path: '/index.html',
      selector: '[data-tour-id="home-quiz-open"]',
      reply: 'Click Jump to Libraries, then choose Open Quiz Tool.',
      hint: 'Click Open Quiz Tool'
    },
    home: {
      path: '/index.html',
      selector: '[data-tour-id="exit-home"]',
      reply: 'I will show you the way back home.',
      hint: 'Click Return Home'
    }
  }
  var ONBOARDING_STEPS = [
    {
      page: '/index.html',
      selector: '[data-tour-id="home-science-open"]',
      message: 'I will show you the main flow. Start here and open the Science library.',
      hint: 'Tap Open Science',
      next: '/study-library.html',
    },
    {
      page: '/study-library.html',
      selector: '#qs-study-notes-content',
      targetText: 'Study Notes & Content',
      message: 'Science is organized by sections, so you can explore the notes in a cleaner split flow instead of scrolling through one huge page. Start with Study Notes and Content for the main explanations and topic breakdowns.',
      hint: 'Study Notes and Content',
      next: '/study-library.html',
    },
    {
      page: '/study-library.html',
      selector: '#lib-anno-toggle',
      message: 'This annotation toggle lets you draw directly over the library while you study, so you can mark diagrams, write reminders, and work through ideas on the page.',
      hint: 'Annotation toggle',
      next: '/study-library.html',
    },
    {
      page: '/study-library.html',
      selector: '#lib-anno-scope',
      message: 'The annotation scope follows the section you are in, which keeps your notes attached to the right topic instead of mixing everything together.',
      hint: 'Section-aware notes',
      next: '/study-library.html',
    },
    {
      page: '/study-library.html',
      selector: '#lib-anno-minimize',
      message: 'You can minimize the annotation bar when you want more space, then bring it back when you need it again.',
      hint: 'Minimize the toolbar',
      next: '/study-library.html',
    },
    {
      page: '/study-library.html',
      selector: '#qs-practice-test-preparation',
      targetText: 'Practice & Test Preparation',
      message: 'After learning the content, move here for practice and test prep so you can check understanding instead of just rereading.',
      hint: 'Practice and test prep',
      next: '/study-library.html',
    },
    {
      page: '/study-library.html',
      selector: '[data-tour-id="exit-home"]',
      message: 'When you are done in Science, use Return to Index to jump back to the main hub and switch subjects quickly.',
      hint: 'Return to Index',
      next: '/index.html',
    },
    {
      page: '/index.html',
      selector: '[data-tour-id="home-math10-open"]',
      message: 'Now open Grade 10 Math. This library is built around topic cards, notes, practice, and the same annotation tools.',
      hint: 'Tap Open Math 10',
      next: '/grade-10-math.html',
    },
    {
      page: '/grade-10-math.html',
      targetText: 'Grade 10 Math',
      message: 'This is the main Grade 10 Math banner. It gives you a quick overview of the library and keeps the whole course in one place.',
      hint: 'Grade 10 Math overview',
      next: '/grade-10-math.html',
    },
    {
      page: '/grade-10-math.html',
      targetText: 'Browse topics',
      message: 'Math is organized into topic paths like Linear Systems, Quadratics, Trigonometry, and Analytic Geometry, so you can jump straight into the unit you need.',
      hint: 'Browse topics',
      next: '/grade-10-math.html',
    },
    {
      page: '/grade-10-math.html',
      selector: '#lib-anno-toggle',
      message: 'The same annotation system works here too, so you can write through solutions and break down worked examples directly on the page.',
      hint: 'Math annotation tools',
      next: '/grade-10-math.html',
    },
    {
      page: '/grade-10-math.html',
      selector: '.exit-btn',
      message: 'Use Return to Index when you want to leave Math and switch to a different study mode.',
      hint: 'Back to the main hub',
      next: '/index.html',
    },
    {
      page: '/index.html',
      selector: '[data-tour-id="home-cards-open"]',
      message: 'Last stop: Concept Cards. This is where the app shifts from learning and notes into faster recall practice.',
      hint: 'Tap Open Cards',
      next: '/anki/index.html',
    },
    {
      page: '/anki/index.html',
      selector: '[data-tour-id="concept-study"]',
      message: 'This study area is built for quick review and memory practice. Use it after your notes and practice sections when you want to lock ideas in faster.',
      hint: 'Concept card study area',
      autoFinish: true,
    },
  ]

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch (_err) {
      return fallback
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (_err) {}
  }

  function readText(key, fallback) {
    try {
      var raw = localStorage.getItem(key)
      return raw == null ? fallback : raw
    } catch (_err) {
      return fallback
    }
  }

  function writeText(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (_err) {}
  }

  function setHintDismissed(value) {
    writeText(HINT_DISMISSED_KEY, value ? '1' : '0')
  }

  function isHintDismissed() {
    return readText(HINT_DISMISSED_KEY, '0') === '1'
  }

  function ensureStyles() {
    if (document.getElementById('sc-lyne-widget-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-lyne-widget-styles'
    style.textContent =
      '#lyne-widget{position:fixed;left:calc(100vw - 66px);top:calc(100vh - 66px);z-index:140;touch-action:none;user-select:none;transition:left .46s ease,top .46s ease,transform .24s ease}' +
      '#lyne-widget *{box-sizing:border-box}' +
      '#lyne-widget.lyne-dragging{transition:none}' +
      '#lyne-widget button,#lyne-widget textarea,#lyne-widget pre{user-select:text}' +
      '.lyne-shell{position:relative;display:flex;flex-direction:column;align-items:flex-end;gap:12px}' +
      '#lyne-hint{position:absolute;right:78px;bottom:6px;width:min(280px,80vw);max-width:min(280px,80vw);padding:14px 16px 12px;border-radius:22px;background:linear-gradient(155deg,rgba(15,23,42,.94),rgba(29,78,216,.84) 56%,rgba(13,148,136,.78));color:#f8fafc;border:1px solid rgba(255,255,255,.14);box-shadow:0 22px 44px rgba(15,23,42,.28);font:700 11px/1.45 Manrope,system-ui,sans-serif;letter-spacing:.01em;opacity:.98;transform:translateY(0) scale(1);transform-origin:100% 100%;animation:lyneHintFloat 3.1s ease-in-out infinite;pointer-events:auto;backdrop-filter:blur(18px) saturate(145%)}' +
      '#lyne-hint:before{content:"AI · LYNE";display:inline-flex;align-items:center;gap:6px;margin:0 28px 8px 0;padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.12);font:800 9px/1 Manrope,system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.82)}' +
      '#lyne-hint:after{content:"";position:absolute;right:-6px;bottom:18px;width:12px;height:12px;background:linear-gradient(135deg,rgba(37,99,235,.9),rgba(13,148,136,.88));transform:rotate(45deg);border-right:1px solid rgba(255,255,255,.14);border-top:1px solid rgba(255,255,255,.14)}' +
      '.lyne-hint-text{display:block;padding-right:20px;color:#f8fafc}' +
      '.lyne-hint-close{position:absolute;top:8px;right:8px;appearance:none;border:0;background:rgba(255,255,255,.12);color:#fff;font:800 12px/1 Manrope,system-ui,sans-serif;cursor:pointer;opacity:.92;padding:4px 6px;border-radius:999px}' +
      '.lyne-hint-close:hover{background:rgba(255,255,255,.2);opacity:1}' +
      '.lyne-hint-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}' +
      '.lyne-hint-btn{appearance:none;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.1);color:#fff;border-radius:999px;padding:7px 11px;font:800 10px/1 Manrope,system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(10px)}' +
      '.lyne-hint-btn.is-primary{background:#f8fafc;color:#10203d;border-color:transparent;box-shadow:0 8px 18px rgba(15,23,42,.16)}' +
      '#lyne-widget[data-panel-open="true"] #lyne-hint{display:none}' +
      '#lyne-orb-toggle{width:58px;height:58px;border-radius:18px;border:1px solid rgba(255,255,255,.24);cursor:grab;position:relative;overflow:hidden;touch-action:none;background:linear-gradient(155deg,#ffffff 0%,#eff6ff 35%,#dbeafe 100%);box-shadow:0 18px 32px rgba(15,23,42,.18),inset 0 1px 0 rgba(255,255,255,.92)}' +
      '#lyne-orb-toggle:active{cursor:grabbing}' +
      '#lyne-orb-toggle:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 26% 20%,rgba(255,255,255,.92),transparent 34%),linear-gradient(180deg,rgba(29,78,216,.05),rgba(13,148,136,.08))}' +
      '#lyne-orb-toggle .flame-core{position:absolute;left:17px;top:16px;width:24px;height:24px;border-radius:8px;background:linear-gradient(145deg,#1d4ed8,#0d9488);box-shadow:0 10px 18px rgba(29,78,216,.28);transform:rotate(8deg);animation:lyneFloatCore 2.8s ease-in-out infinite}' +
      '#lyne-orb-toggle .flame-core:before{content:"";position:absolute;left:6px;top:6px;width:12px;height:12px;border-radius:4px;background:rgba(255,255,255,.92)}' +
      '#lyne-orb-toggle .flame-inner{position:absolute;right:13px;top:13px;width:11px;height:11px;border-radius:999px;background:linear-gradient(135deg,#38bdf8,#14b8a6);box-shadow:0 0 0 5px rgba(20,184,166,.12);animation:lyneFloatDot 2.2s ease-in-out infinite}' +
      '#lyne-orb-toggle .flame-glow{position:absolute;inset:10px;border-radius:14px;box-shadow:0 0 0 1px rgba(29,78,216,.08),0 0 28px rgba(56,189,248,.16)}' +
      '#lyne-widget.lyne-speaking #lyne-orb-toggle .flame-core{animation-duration:1.2s}' +
      '#lyne-widget.lyne-speaking #lyne-orb-toggle .flame-inner{animation-duration:.9s}' +
      '#lyne-panel{position:absolute;right:0;bottom:72px;width:min(360px,92vw);border:1px solid rgba(255,255,255,.46);background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(248,250,252,.9));backdrop-filter:blur(24px) saturate(155%);border-radius:28px;padding:14px;box-shadow:0 30px 64px rgba(15,23,42,.18),inset 0 1px 0 rgba(255,255,255,.92);opacity:0;transform:translateY(14px) scale(.96);pointer-events:none;transition:opacity .24s ease,transform .24s ease}' +
      '#lyne-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '.lyne-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:nowrap;cursor:grab;user-select:none;touch-action:none;padding:2px 2px 10px}' +
      '.lyne-panel-head:active{cursor:grabbing}' +
      '.lyne-panel-id{display:grid;gap:4px;min-width:0}' +
      '.lyne-panel-kicker{display:inline-flex;align-items:center;gap:6px;width:max-content;padding:6px 9px;border-radius:999px;background:rgba(15,23,42,.05);border:1px solid rgba(148,163,184,.16);font:800 10px/1 Manrope,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1d4ed8}' +
      '.lyne-panel-kicker:before{content:"";width:7px;height:7px;border-radius:999px;background:linear-gradient(135deg,#2563eb,#0d9488);box-shadow:0 0 0 4px rgba(37,99,235,.08)}' +
      '.lyne-panel-title{margin:0;font-size:1.06rem;font-weight:900;letter-spacing:-.04em;color:#0f172a}' +
      '.lyne-panel-subtitle{margin:0;color:#64748b;font-size:.74rem;font-weight:700;letter-spacing:.01em}' +
      '.lyne-panel-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}' +
      '.lyne-mini-btn{padding:10px 11px;font-size:.72rem;border-radius:16px;border:1px solid rgba(148,163,184,.16);background:rgba(255,255,255,.72);color:#0f172a;font-weight:800;box-shadow:inset 0 1px 0 rgba(255,255,255,.72)}' +
      '#lyne-panel .btn.btn-primary.lyne-mini-btn{background:linear-gradient(135deg,#1d4ed8,#0f766e);color:#fff;border-color:transparent;box-shadow:0 16px 28px rgba(37,99,235,.18)}' +
      '#lyne-panel .btn.btn-secondary.lyne-mini-btn{background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(241,245,249,.94));color:#1e293b}' +
      '#lyne-meta{margin:4px 2px 0;color:#64748b;font-size:.72rem;font-weight:800;letter-spacing:.03em;text-transform:uppercase}' +
      '#lyne-chat{margin:12px 0 0;white-space:pre-wrap;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(248,250,252,.92));border:1px solid rgba(191,202,214,.42);border-radius:20px;padding:14px 15px;min-height:64px;max-height:148px;overflow:auto;font-size:.8rem;line-height:1.58;color:#0f172a;user-select:text;box-shadow:inset 0 1px 0 rgba(255,255,255,.92)}' +
      '.lyne-compose{display:flex;align-items:center;gap:10px;margin-top:12px;padding-top:2px}' +
      '.lyne-input{flex:1;min-width:0;border:1px solid rgba(148,163,184,.2);background:rgba(255,255,255,.9);border-radius:18px;padding:12px 14px;font:700 12px/1.25 Manrope,system-ui,sans-serif;color:#0f172a;outline:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.82)}' +
      '.lyne-input:focus{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.08)}' +
      '.lyne-send{min-width:44px;height:44px;border:0;border-radius:18px;background:linear-gradient(135deg,#1d4ed8,#0d9488);color:#fff;font:900 14px/1 Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:0 16px 28px rgba(29,78,216,.2)}' +
      '.lyne-send:disabled{opacity:.45;cursor:default;box-shadow:none}' +
      '.sc-lyne-guide-target{position:relative;z-index:141 !important;outline:3px solid #ff8a1c !important;outline-offset:4px;border-radius:14px;box-shadow:0 0 0 8px rgba(255,138,28,.18),0 16px 28px rgba(20,20,28,.22);animation:scLyneGuidePulse 1.15s ease-in-out infinite}' +
      '.sc-lyne-guide-bubble{position:fixed;z-index:142;max-width:min(260px,80vw);padding:10px 12px;border-radius:14px;background:rgba(14,23,38,.96);color:#fff;font:700 12px/1.35 Manrope,system-ui,sans-serif;box-shadow:0 16px 30px rgba(0,0,0,.28)}' +
      '.sc-lyne-guide-bubble strong{display:block;margin-bottom:4px;font-size:12px;letter-spacing:.01em;color:#ffd39c}' +
      '#lyne-widget.lyne-return-mode{left:50% !important;top:50% !important;transform:translate(-50%,-50%) scale(1.02);z-index:10060}' +
      '#lyne-widget.lyne-return-mode #lyne-hint{display:none !important}' +
      '#lyne-widget.lyne-return-mode .lyne-shell{align-items:center}' +
      '#lyne-widget.lyne-return-mode .lyne-shell:before{content:"";position:fixed;inset:0;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.18),rgba(15,23,42,.34) 42%,rgba(15,23,42,.5) 100%);backdrop-filter:blur(8px);pointer-events:none;z-index:-1}' +
      '#lyne-widget.lyne-return-mode #lyne-orb-toggle{width:72px;height:72px;box-shadow:0 22px 40px rgba(23,21,16,.28),inset -9px -12px 14px rgba(0,0,0,.22),inset 7px 9px 10px rgba(255,255,255,.36)}' +
      '#lyne-widget.lyne-return-mode #lyne-orb-toggle .flame-core{left:22px;top:15px;width:28px;height:34px}' +
      '#lyne-widget.lyne-return-mode #lyne-orb-toggle .flame-inner{left:30px;top:25px;width:11px;height:15px}' +
      '#lyne-widget.lyne-return-mode #lyne-panel{right:auto;left:50%;bottom:90px;transform:translate(-50%,12px) scale(.96);width:min(520px,92vw);padding:18px 20px;border-radius:30px;border:1px solid rgba(255,255,255,.5);background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(246,250,252,.96));box-shadow:0 30px 72px rgba(15,23,42,.24),inset 0 1px 0 rgba(255,255,255,.84)}' +
      '#lyne-widget.lyne-return-mode #lyne-panel.open{transform:translate(-50%,0) scale(1)}' +
      '#lyne-widget.lyne-return-mode .lyne-panel-title{font-size:1.18rem}' +
      '#lyne-widget.lyne-return-mode #lyne-meta{font-size:.8rem;color:#8b3e1d;font-weight:900;letter-spacing:.04em;text-transform:uppercase}' +
      '#lyne-widget.lyne-return-mode #lyne-chat{min-height:82px;max-height:180px;padding:16px 18px;font-size:.96rem;line-height:1.55;border-radius:22px;background:linear-gradient(180deg,#fff8f4,#fff);border:1px solid rgba(234,88,12,.16)}' +
      '#lyne-widget.lyne-return-mode.lyne-return-strong #lyne-panel{box-shadow:0 34px 86px rgba(15,23,42,.28),0 0 0 1px rgba(234,88,12,.18),inset 0 1px 0 rgba(255,255,255,.84)}' +
      '#lyne-widget.lyne-return-mode.lyne-return-strong #lyne-chat{border-color:rgba(234,88,12,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.82)}' +
      '#lyne-widget.lyne-return-mode .lyne-compose{display:none}' +
      '#lyne-widget.lyne-return-mode .lyne-panel-actions{display:none}' +
      '@media (max-width:760px){#lyne-widget{transform:scale(.84);transform-origin:100% 100%}#lyne-hint{right:56px;bottom:6px;width:min(210px,76vw);max-width:min(210px,76vw);padding:10px 11px 9px;font-size:9px;border-radius:16px}#lyne-hint:before{margin-bottom:5px;font-size:8px}#lyne-hint:after{right:-5px;bottom:12px;width:10px;height:10px}.lyne-hint-text{padding-right:18px}.lyne-hint-close{top:6px;right:6px;font-size:10px;padding:3px 5px}.lyne-hint-actions{gap:5px;margin-top:8px}.lyne-hint-btn{padding:5px 8px;font-size:8px}#lyne-orb-toggle{width:48px;height:48px;border-radius:16px}#lyne-orb-toggle .flame-core{left:14px;top:13px;width:20px;height:20px;border-radius:7px}#lyne-orb-toggle .flame-core:before{left:5px;top:5px;width:10px;height:10px;border-radius:3px}#lyne-orb-toggle .flame-inner{right:10px;top:10px;width:9px;height:9px}#lyne-orb-toggle .flame-glow{inset:8px;border-radius:12px}#lyne-panel{bottom:58px;width:min(270px,78vw);padding:10px;border-radius:20px}.lyne-panel-head{padding-bottom:6px}.lyne-panel-kicker{padding:4px 7px;font-size:8px}.lyne-panel-title{font-size:.94rem}.lyne-panel-subtitle{font-size:.66rem}.lyne-panel-actions{gap:6px;margin-top:8px}.lyne-mini-btn{padding:8px 8px;font-size:.62rem;border-radius:12px}#lyne-chat{padding:10px 11px;min-height:42px;max-height:92px;font-size:.7rem}#lyne-meta{font-size:.62rem}.lyne-compose{gap:6px;margin-top:8px}.lyne-input{padding:9px 10px;font-size:11px;border-radius:14px}.lyne-send{min-width:38px;height:38px;border-radius:14px;font-size:13px}#lyne-widget.lyne-return-mode{transform:translate(-50%,-50%) scale(1)}#lyne-widget.lyne-return-mode #lyne-panel{bottom:84px;width:min(92vw,360px);padding:13px 14px;border-radius:24px}#lyne-widget.lyne-return-mode #lyne-chat{min-height:68px;max-height:156px;padding:13px 14px;font-size:.86rem}#lyne-widget.lyne-return-mode .lyne-panel-title{font-size:1rem}#lyne-widget.lyne-return-mode #lyne-orb-toggle{width:60px;height:60px;border-radius:20px}#lyne-widget.lyne-return-mode #lyne-orb-toggle .flame-core{left:18px;top:16px;width:23px;height:23px}#lyne-widget.lyne-return-mode #lyne-orb-toggle .flame-core:before{left:6px;top:6px;width:11px;height:11px}#lyne-widget.lyne-return-mode #lyne-orb-toggle .flame-inner{right:12px;top:12px;width:10px;height:10px}}' +
      '@keyframes lyneFlame{0%{transform:translateY(0) rotate(-2deg) scale(1)}50%{transform:translateY(-2px) rotate(2deg) scale(1.05)}100%{transform:translateY(0) rotate(-1deg) scale(1)}}' +
      '@keyframes lyneFlameInner{0%,100%{opacity:.85;transform:translateY(0)}50%{opacity:1;transform:translateY(-1px)}}' +
      '@keyframes lyneGlow{0%,100%{opacity:.5}50%{opacity:1}}' +
      '@keyframes lyneFloatCore{0%,100%{transform:rotate(8deg) translateY(0)}50%{transform:rotate(8deg) translateY(-2px)}}' +
      '@keyframes lyneFloatDot{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.06)}}' +
      '@keyframes lyneHintFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.02)}}' +
      '@keyframes scLyneGuidePulse{0%,100%{box-shadow:0 0 0 8px rgba(255,138,28,.18),0 16px 28px rgba(20,20,28,.22)}50%{box-shadow:0 0 0 14px rgba(255,138,28,.1),0 20px 36px rgba(20,20,28,.28)}}'
    document.head.appendChild(style)
  }

  function ensureWidgetMarkup() {
    if (document.getElementById('lyne-widget')) return document.getElementById('lyne-widget')
    var widget = document.createElement('div')
    widget.id = 'lyne-widget'
    widget.setAttribute('data-panel-open', 'false')
    widget.innerHTML =
      '<div class="lyne-shell">' +
      '<div id="lyne-hint"><span class="lyne-hint-text">Talk to the LYNE AI.</span></div>' +
      '<button id="lyne-orb-toggle" type="button" aria-label="Open LYNE AI chat" aria-expanded="false">' +
      '<span class="flame-glow" aria-hidden="true"></span>' +
      '<span class="flame-core" aria-hidden="true"></span>' +
      '<span class="flame-inner" aria-hidden="true"></span>' +
      '</button>' +
      '<section id="lyne-panel" aria-hidden="true">' +
      '<div class="lyne-panel-head" data-lyne-drag-handle>' +
      '<div class="lyne-panel-id">' +
      '<span class="lyne-panel-kicker">AI Guide</span>' +
      '<h3 class="lyne-panel-title">LYNE AI</h3>' +
      '<p class="lyne-panel-subtitle">Talk to the Soul Concept AI for study help, routes, and quick answers.</p>' +
      '</div>' +
      '<button id="lyne-panel-close" type="button" class="btn btn-secondary lyne-mini-btn">Hide</button>' +
      '</div>' +
      '<div class="lyne-panel-actions">' +
      '<button id="lyne-start" class="btn btn-primary lyne-mini-btn" type="button">Talk to AI</button>' +
      '<button id="lyne-tutorial" class="btn btn-secondary lyne-mini-btn" type="button">AI Tour</button>' +
      '<button id="lyne-stop" class="btn btn-secondary lyne-mini-btn" type="button">Stop</button>' +
      '</div>' +
      '<p id="lyne-meta">Idle.</p>' +
      '<pre id="lyne-chat">' + DEFAULT_CHAT + '</pre>' +
      '<div class="lyne-compose">' +
      '<input id="lyne-input" class="lyne-input" type="text" placeholder="Message the AI..." maxlength="240" />' +
      '<button id="lyne-send" class="lyne-send" type="button" aria-label="Send">↑</button>' +
      '</div>' +
      '</section>' +
      '</div>'
    var send = widget.querySelector('#lyne-send')
    if (send) send.innerHTML = '&#8594;'
    document.body.appendChild(widget)
    return widget
  }

  function clampPosition(pos, widget) {
    var width = widget.offsetWidth || 56
    var height = widget.offsetHeight || 56
    var maxX = Math.max(8, window.innerWidth - width - 8)
    var maxY = Math.max(8, window.innerHeight - height - 8)
    return {
      x: Math.min(Math.max(8, Number(pos && pos.x) || maxX), maxX),
      y: Math.min(Math.max(8, Number(pos && pos.y) || maxY), maxY),
    }
  }

  function applyPosition(widget, pos) {
    var next = clampPosition(pos, widget)
    widget.style.left = next.x + 'px'
    widget.style.top = next.y + 'px'
    writeJson(POSITION_KEY, next)
  }

  function setChat(chatNode, text) {
    var value = String(text || '').trim() || DEFAULT_CHAT
    chatNode.textContent = value
    writeText(CHAT_KEY, value)
    var hintNode = document.getElementById('lyne-hint')
    var panelNode = document.getElementById('lyne-panel')
    if (hintNode && panelNode && !panelNode.classList.contains('open')) {
      var preview = escapeHtml(latestLyneMessage(value))
      var actionMarkup = '<div class="lyne-hint-actions"><button class="lyne-hint-btn is-primary" type="button" data-lyne-hint-action="spotlight-open">Open LYNE</button></div>'
      hintNode.innerHTML =
        '<button class="lyne-hint-close" type="button" aria-label="Close LYNE prompt" data-lyne-hint-dismiss>&times;</button>' +
        '<span class="lyne-hint-text">' + preview + '</span>' +
        actionMarkup
      hintNode.style.display = ''
    }
  }

  function setStableChat(chatNode, text) {
    var value = String(text || '').trim() || DEFAULT_CHAT
    writeText(STABLE_CHAT_KEY, value)
    setChat(chatNode, value)
  }

  function setTemporaryChat(chatNode, text) {
    var value = String(text || '').trim() || DEFAULT_CHAT
    chatNode.textContent = value
  }

  function readStableChat() {
    return readText(STABLE_CHAT_KEY, readText(CHAT_KEY, DEFAULT_CHAT)) || DEFAULT_CHAT
  }

  function latestLyneMessage(text) {
    var raw = String(text || '').trim()
    if (!raw) return 'LYNE AI is ready. Open me and ask what to study next.'
    var match = raw.match(/LYNE:\s*([\s\S]*)$/i)
    var body = match ? match[1] : raw
    body = body.replace(/\s+/g, ' ').trim()
    if (!body) body = 'LYNE AI is ready. Open me and ask what to study next.'
    if (body.length > 132) body = body.slice(0, 129).trim() + '...'
    return body
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function normalizeAssistantText(text, fallbackPrompt) {
    var raw = String(text || '').trim()
    if (!raw) return localFallbackReply(fallbackPrompt)
    var lower = raw.toLowerCase()
    if (
      lower.indexOf('sorry, we have had an error') !== -1 ||
      lower.indexOf('an error occurred') !== -1 ||
      lower.indexOf('something went wrong') !== -1 ||
      lower.indexOf('i hit an error') !== -1 ||
      lower.indexOf('i cannot reach puter right now') !== -1
    ) {
      return localFallbackReply(fallbackPrompt)
    }
    if (
      lower.indexOf('ask me any topic and i will explain') !== -1 ||
      lower.indexOf('go to science at study-library') !== -1 ||
      lower.indexOf('tell me your subject and i will pick one') !== -1 ||
      lower.indexOf('direct answer: break this into known formula + substitution + final check') !== -1
    ) {
      return localFallbackReply(fallbackPrompt)
    }
    if (compactText(raw) === compactText(DEFAULT_STILL_HERE)) {
      return localFallbackReply(fallbackPrompt)
    }
    return raw
  }

  function compactText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function buildLynePrompt(userText) {
    return (
      LYNE_APP_CONTEXT +
      '\n\nUser question: ' +
      String(userText || '').trim() +
      '\n\nImportant: This is an in-app navigation assistant, not real-world location guidance. ' +
      'Never ask for physical location, school name, or campus map. ' +
      'If user asks where to go, always respond with the exact Soul Concept page route.' +
      '\n\nAnswer as LYNE.'
    )
  }

  function extractPuterText(payload) {
    if (!payload) return ''
    if (typeof payload === 'string') return payload.trim()
    if (typeof payload.text === 'string') return payload.text.trim()
    if (payload.message && typeof payload.message.content === 'string') return payload.message.content.trim()
    if (Array.isArray(payload.messages) && payload.messages[0] && typeof payload.messages[0].content === 'string') {
      return payload.messages[0].content.trim()
    }
    if (Array.isArray(payload.parts)) {
      return payload.parts
        .map(function (part) { return part && typeof part.text === 'string' ? part.text : '' })
        .filter(Boolean)
        .join('\n')
        .trim()
    }
    return ''
  }

  function ensurePuterReady(timeoutMs) {
    return new Promise(function (resolve, reject) {
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') return resolve()
      var scriptId = 'sc-puter-sdk'
      var existing = document.getElementById(scriptId)
      if (!existing) {
        var script = document.createElement('script')
        script.id = scriptId
        script.src = 'https://js.puter.com/v2/'
        script.async = true
        document.head.appendChild(script)
      }
      var started = Date.now()
      var timer = window.setInterval(function () {
        if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
          window.clearInterval(timer)
          resolve()
          return
        }
        if (Date.now() - started > (timeoutMs || 8000)) {
          window.clearInterval(timer)
          reject(new Error('Puter SDK load timeout.'))
        }
      }, 120)
    })
  }

  function localAppIntentReply(prompt) {
    var q = String(prompt || '').toLowerCase()
    if (q.indexOf('science') !== -1 && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Click Jump to Libraries, then choose Open Science.'
    }
    if (q.indexOf('geography') !== -1 && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Click Jump to Libraries, then choose Open Geography.'
    }
    if ((q.indexOf('grade 10') !== -1 || q.indexOf('math 10') !== -1) && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Click Jump to Libraries, then browse the cards and choose Open Math 10.'
    }
    if ((q.indexOf('grade 9') !== -1 || q.indexOf('math 9') !== -1) && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Click Jump to Libraries, then browse the cards and choose Open Math 9.'
    }
    if (q.indexOf('anki') !== -1 || q.indexOf('cards') !== -1 || q.indexOf('flashcards') !== -1) {
      return 'Click Jump to Libraries, then choose Open Cards.'
    }
    return ''
  }

  function detectGuideTarget(prompt) {
    var q = String(prompt || '').toLowerCase().trim()
    if (!q) return ''
    var wantsGuide =
      q.indexOf('where') !== -1 ||
      q.indexOf('open') !== -1 ||
      q.indexOf('go') !== -1 ||
      q.indexOf('visit') !== -1 ||
      q.indexOf('head to') !== -1 ||
      q.indexOf('take me') !== -1 ||
      q.indexOf('show me') !== -1 ||
      q.indexOf('how do i get') !== -1 ||
      q.indexOf('bring me') !== -1
    if (!wantsGuide) return ''
    if ((q.indexOf('grade 9') !== -1 || q.indexOf('math 9') !== -1) && q.indexOf('math') !== -1) return 'math9'
    if (q.indexOf('science') !== -1) return 'science'
    if (q.indexOf('geography') !== -1) return 'geography'
    if (q.indexOf('grade 10') !== -1 || q.indexOf('math 10') !== -1) return 'math10'
    if (q.indexOf('cards') !== -1 || q.indexOf('anki') !== -1 || q.indexOf('flashcards') !== -1) return 'cards'
    if (q.indexOf('quiz') !== -1) return 'quiz'
    if ((q.indexOf('home') !== -1 || q.indexOf('back') !== -1) && q.indexOf('math') === -1) return 'home'
    return ''
  }

  function localFallbackReply(prompt) {
    var raw = String(prompt || '').trim()
    var q = raw.toLowerCase()
    if (!raw) return 'Ask any study question and I will answer clearly.'
    var m = raw.match(/^\s*(-?\d+(?:\.\d+)?)\s*([\+\-\*xX\/])\s*(-?\d+(?:\.\d+)?)\s*\??\s*$/)
    if (m) {
      var a = Number(m[1])
      var op = String(m[2])
      var b = Number(m[3])
      if (op === '+') return String(a + b)
      if (op === '-') return String(a - b)
      if (op === '*' || op === 'x' || op === 'X') return String(a * b)
      if (op === '/') return b === 0 ? 'Division by zero is undefined.' : String(a / b)
    }
    if (q.indexOf('slope') !== -1 || q.indexOf('y=mx+b') !== -1 || q.indexOf('y = mx + b') !== -1) {
      return 'Slope-intercept form is y = mx + b. m is slope and b is the y-intercept. Example: y = 2x + 3 has slope 2 and y-intercept 3.'
    }
    if (q.indexOf('linear equation') !== -1) {
      return 'Linear equations: collect like terms, isolate the variable, then check the answer.'
    }
    if (q.indexOf('trig') !== -1 || q.indexOf('trigonometry') !== -1) {
      return 'Use SOH-CAH-TOA. Match the side names first, then choose sin, cos, or tan.'
    }
    if (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1) {
      return localAppIntentReply(raw) || 'Ask for Science, Geography, Math 9, Math 10, or Cards and I will point you there.'
    }
    return 'Tell me the exact concept and grade, and I will explain it simply.'
  }

  function normalizeRoute(value) {
    var path = String(value || '/').trim()
    if (!path || path === '/') return '/index'
    path = path.split('#')[0].split('?')[0]
    path = path.replace(/\/+$/, '')
    if (!path) return '/index'
    path = path.replace(/\.html$/i, '')
    return path === '/index' ? '/index' : path
  }

  function init() {
    ensureStyles()
    var widget = ensureWidgetMarkup()
    var orbToggle = document.getElementById('lyne-orb-toggle')
    var panel = document.getElementById('lyne-panel')
    var panelClose = document.getElementById('lyne-panel-close')
    var startBtn = document.getElementById('lyne-start')
    var tutorialBtn = document.getElementById('lyne-tutorial')
    var stopBtn = document.getElementById('lyne-stop')
    var sendBtn = document.getElementById('lyne-send')
    var input = document.getElementById('lyne-input')
    var meta = document.getElementById('lyne-meta')
    var chat = document.getElementById('lyne-chat')
    var hint = document.getElementById('lyne-hint')
    var dragHandle = panel.querySelector('[data-lyne-drag-handle]')
    if (!widget || !orbToggle || !panel || !panelClose || !startBtn || !tutorialBtn || !stopBtn || !sendBtn || !input || !meta || !chat || !hint) return

    function playUiSound(name) {
      try {
        if (window.SoulAudio && typeof window.SoulAudio.play === 'function') {
          window.SoulAudio.play(name)
        }
      } catch (_err) {}
    }

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    var canListen = typeof SpeechRecognition === 'function'
    var canSpeak = !!window.speechSynthesis
    var recognition = null
    var active = false
    var autoArmTimer = null
    var listening = false
    var waiting = false
    var speaking = false
    var lyneAudio = null
    var guideBubble = null
    var guideTargetNode = null
    var guideCleanupTimer = null
    var captureTimer = null
    var captureText = ''
    var ignoreMicUntil = 0
    var lastSpeechEndedAt = 0
    var lastAssistantText = ''
    var lastUserText = ''
    var lastUserAt = 0
    var preferredVoice = null
    var didDrag = false
    var lastOrbTapAt = 0
      var onboardingRetryToken = ''
      var onboardingRetryCount = 0
      var returnPromptActive = false
      var returnPromptState = null
      var returnPromptSpoken = false
      var tutorSpotlightTimers = []

    function setHintContent(text, actions) {
      var html =
        '<button class="lyne-hint-close" type="button" aria-label="Close LYNE prompt" data-lyne-hint-dismiss>&times;</button>' +
        '<span class="lyne-hint-text">' + escapeHtml(String(text || 'Talk to the LYNE AI.')) + '</span>'
      if (Array.isArray(actions) && actions.length) {
        html += '<div class="lyne-hint-actions">'
        for (var i = 0; i < actions.length; i++) {
          var action = actions[i] || {}
          html +=
            '<button class="lyne-hint-btn' +
            (action.primary ? ' is-primary' : '') +
            '" type="button" data-lyne-hint-action="' +
            String(action.id || '') +
            '">' +
            String(action.label || 'Continue') +
            '</button>'
        }
        html += '</div>'
      }
      hint.innerHTML = html
      hint.style.display = isHintDismissed() ? 'none' : ''
    }

      function setDefaultHint() {
        var preview = latestLyneMessage(readText(CHAT_KEY, DEFAULT_CHAT))
        setHintContent(preview, [{ id: 'spotlight-open', label: 'Talk to AI', primary: true }])
      }

      function clearTutorSpotlightTimers() {
        while (tutorSpotlightTimers.length) {
          clearTimeout(tutorSpotlightTimers.pop())
        }
      }

      function spotlightTutorAssistant() {
        clearTutorSpotlightTimers()
      clearReturnPrompt()
      clearGuide()
      setHintDismissed(false)
      setPanelOpen(false)
        var x = Math.max(88, Math.min(window.innerWidth - 88, Math.round(window.innerWidth * 0.72)))
        var y = Math.max(156, Math.min(window.innerHeight - 88, Math.round(window.innerHeight * 0.56)))
        applyPosition(widget, { x: x, y: y })
        meta.textContent = 'Tutor AI'
        setTemporaryChat(chat, DEFAULT_STILL_HERE)
        setHintContent('Tap to open the LYNE AI chat.', [{ id: 'spotlight-open', label: 'Talk to AI', primary: true }])
        syncHintVisibility()
        tutorSpotlightTimers.push(
          setTimeout(function () {
            if (panel.classList.contains('open') || isHintDismissed()) return
            setHintContent('Move the LYNE AI widget anywhere on the screen.', [{ id: 'spotlight-open', label: 'Talk to AI', primary: true }])
          }, 1900)
        )
        tutorSpotlightTimers.push(
          setTimeout(function () {
            if (panel.classList.contains('open') || isHintDismissed()) return
            setHintContent('Ask the AI what to study next.', [{ id: 'spotlight-open', label: 'Talk to AI', primary: true }])
          }, 4100)
        )
      }

    function syncHintVisibility() {
      if (!hint) return
      if (isHintDismissed() || panel.classList.contains('open')) {
        hint.style.display = 'none'
      } else {
        hint.style.display = ''
      }
    }

    function isLibraryPage() {
      var path = currentPath()
      return (
        path === '/study-library' ||
        path === '/geography-library' ||
        path === '/grade-10-math' ||
        path === '/math/index'
      )
    }

    function showReturnPrompt(detail) {
      if (!isLibraryPage()) return
      var info = detail || {}
      var level = Number(info.level || 1)
      var reason = String(info.reason || '').trim()
      var strong = level > 1
      var firmLine = strong ? 'Return to the library now.' : 'Bring your attention back to the library.'
      var reasonLine = reason ? ' Focus lost: ' + reason : ''
      var message =
        'LYNE: ' +
        firmLine +
        ' Continue this study block before switching away.' +
        reasonLine
      var firstShow = !returnPromptActive
      if (!returnPromptActive) {
        returnPromptState = {
          panelOpen: panel.classList.contains('open'),
          meta: meta.textContent,
          chat: readStableChat(),
        }
      }
      returnPromptActive = true
      widget.classList.add('lyne-return-mode')
      widget.classList.toggle('lyne-return-strong', strong)
      setPanelOpen(true)
      meta.textContent = strong ? 'Firm focus warning' : 'Focus reminder'
      setTemporaryChat(chat, message)
      returnPromptSpoken = false
      if (firstShow && !document.hidden) {
        lastAssistantText = firmLine
        returnPromptSpoken = true
        speak(firmLine).catch(function () {})
      }
    }

    function clearReturnPrompt() {
      if (!returnPromptActive) return
      returnPromptActive = false
      widget.classList.remove('lyne-return-mode')
      widget.classList.remove('lyne-return-strong')
      if (returnPromptState) {
        setPanelOpen(!!returnPromptState.panelOpen)
        meta.textContent = returnPromptState.meta || 'Idle.'
        setChat(chat, returnPromptState.chat || readStableChat())
      }
      returnPromptState = null
      returnPromptSpoken = false
    }

    function setPanelOpen(next) {
      var open = !!next
      panel.classList.toggle('open', open)
      panel.setAttribute('aria-hidden', open ? 'false' : 'true')
      orbToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      widget.setAttribute('data-panel-open', open ? 'true' : 'false')
      writeText(PANEL_OPEN_KEY, open ? '1' : '0')
      if (open) clearTutorSpotlightTimers()
      syncHintVisibility()
      if (open) {
        scheduleAutoArm()
      } else if (autoArmTimer) {
        clearTimeout(autoArmTimer)
        autoArmTimer = null
      }
      if (!open && !returnPromptActive) {
        if (isOnboardingActive()) {
          var step = ONBOARDING_STEPS[getOnboardingStep()]
          if (step) {
            setHintContent(step.hint || 'Follow the LYNE AI guide.', [
              { id: 'guide-next', label: step.hint || 'Continue', primary: true },
              { id: 'guide-skip', label: 'Skip tour' },
            ])
          } else {
            setDefaultHint()
          }
        } else {
          setDefaultHint()
        }
      }
    }

    function setSpeakingVisual(next) {
      widget.classList.toggle('lyne-speaking', !!next)
    }

    function currentPath() {
      return normalizeRoute(location.pathname || '/index.html')
    }

    function promoteGuideTarget(node) {
      if (!node || !node.closest) return node
      return (
        node.closest('button, a, [role="button"], [onclick], .cursor-pointer, .deck-item, summary') ||
        node
      )
    }

    function findNodeByText(text) {
      if (!text) return null
      var targetText = String(text).trim()
      var candidates = document.querySelectorAll('button, a, h1, h2, h3, h4, div, span, p')
      var containsMatch = null
      for (var i = 0; i < candidates.length; i++) {
        var content = String(candidates[i].textContent || '').replace(/\s+/g, ' ').trim()
        if (!content) continue
        if (content === targetText) return promoteGuideTarget(candidates[i])
        if (!containsMatch && content.indexOf(targetText) !== -1) {
          containsMatch = promoteGuideTarget(candidates[i])
        }
      }
      return containsMatch
    }

    function resolveGuideNode(step) {
      if (step.selector) {
        var selectorTarget = document.querySelector(step.selector)
        if (selectorTarget) return selectorTarget
      }
      if (step.targetText) {
        return findNodeByText(step.targetText)
      }
      return null
    }

    function isOnboardingDismissed() {
      return readText(ONBOARDING_DISMISSED_KEY, '0') === '1'
    }

    function setOnboardingDismissed(value) {
      writeText(ONBOARDING_DISMISSED_KEY, value ? '1' : '0')
    }

    function isOnboardingActive() {
      return readText(ONBOARDING_ACTIVE_KEY, '0') === '1'
    }

    function setOnboardingActive(value) {
      writeText(ONBOARDING_ACTIVE_KEY, value ? '1' : '0')
    }

    function getOnboardingStep() {
      var raw = Number(readText(ONBOARDING_STEP_KEY, '0'))
      return isFinite(raw) && raw >= 0 ? raw : 0
    }

    function setOnboardingStep(value) {
      writeText(ONBOARDING_STEP_KEY, String(Math.max(0, Number(value) || 0)))
    }

    function isOnboardingVoiceEnabled() {
      return readText(ONBOARDING_VOICE_KEY, '0') === '1'
    }

    function setOnboardingVoiceEnabled(value) {
      writeText(ONBOARDING_VOICE_KEY, value ? '1' : '0')
    }

    function finishOnboarding() {
      clearGuide()
      setOnboardingActive(false)
      setOnboardingDismissed(true)
      setOnboardingVoiceEnabled(false)
      setPanelOpen(true)
      meta.textContent = 'Guide complete.'
      setStableChat(chat, 'LYNE: You are set. Ask me where to go, what to study next, or what concept you want explained.')
      setDefaultHint()
    }

    function clearGuide() {
      if (guideCleanupTimer) {
        clearTimeout(guideCleanupTimer)
        guideCleanupTimer = null
      }
      if (guideTargetNode) {
        guideTargetNode.classList.remove('sc-lyne-guide-target')
        guideTargetNode = null
      }
      if (guideBubble && guideBubble.parentNode) {
        guideBubble.parentNode.removeChild(guideBubble)
      }
      guideBubble = null
      try {
        localStorage.removeItem(GUIDE_KEY)
      } catch (_err) {}
    }

    function continueOnboardingStep(stepIndex, step, target) {
      if (!isOnboardingActive()) return
      if (step.autoFinish) {
        finishOnboarding()
        return
      }
      setOnboardingStep(stepIndex + 1)
      if (step.next && normalizeRoute(step.next) !== currentPath()) {
        location.href = step.next
        return
      }
      if (target && typeof target.click === 'function') {
        try { target.click() } catch (_err) {}
      }
      setTimeout(showOnboardingStep, 450)
    }

    function scheduleAutoArm() {
      if (!canListen) return
      if (autoArmTimer) clearTimeout(autoArmTimer)
      autoArmTimer = setTimeout(function () {
        autoArmTimer = null
        if (!panel.classList.contains('open')) return
        if (active || listening || waiting || speaking) return
        active = true
        meta.textContent = 'Listening...'
        startListening()
      }, 1100)
    }

    function moveWidgetNearTarget(target) {
      var rect = target.getBoundingClientRect()
      var preferredX = rect.right + 14
      var preferredY = rect.top + Math.max(0, Math.min(80, rect.height * 0.5))
      if (preferredX + 72 > window.innerWidth) {
        preferredX = rect.left - 72
      }
      if (preferredY + 72 > window.innerHeight) {
        preferredY = window.innerHeight - 86
      }
      if (preferredX < 12) preferredX = 12
      if (preferredY < 12) preferredY = 12
      applyPosition(widget, {
        x: preferredX,
        y: preferredY,
      })
    }

    function positionGuideBubble(target, bubble) {
      var rect = target.getBoundingClientRect()
      var top = rect.top - bubble.offsetHeight - 14
      if (top < 12) top = rect.bottom + 14
      var left = rect.left
      if (left + bubble.offsetWidth > window.innerWidth - 12) {
        left = window.innerWidth - bubble.offsetWidth - 12
      }
      if (left < 12) left = 12
      bubble.style.top = top + 'px'
      bubble.style.left = left + 'px'
    }

    function fallbackGuideTarget() {
      return (
        document.getElementById('root') ||
        document.querySelector('main') ||
        document.querySelector('.exit-btn') ||
        document.body
      )
    }

    function activateGuideTarget(targetId) {
      var spec = GUIDE_TARGETS[targetId]
      if (!spec) return false
      var target = document.querySelector(spec.selector)
      if (!target) {
        meta.textContent = 'Guide target not found on this page.'
        return false
      }
      clearGuide()
      guideTargetNode = target
      target.classList.add('sc-lyne-guide-target')
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      } catch (_err) {
        target.scrollIntoView()
      }
      moveWidgetNearTarget(target)
      var bubble = document.createElement('div')
      bubble.className = 'sc-lyne-guide-bubble'
      bubble.innerHTML = '<strong>LYNE Guide</strong>' + String(spec.hint || 'Click here')
      document.body.appendChild(bubble)
      guideBubble = bubble
      positionGuideBubble(target, bubble)
      var onResize = function () {
        if (guideTargetNode && guideBubble) {
          positionGuideBubble(guideTargetNode, guideBubble)
        }
      }
      window.addEventListener('resize', onResize, { once: true })
      target.addEventListener('click', clearGuide, { once: true })
      guideCleanupTimer = setTimeout(clearGuide, 12000)
      meta.textContent = 'Guide active.'
      return true
    }

    function startGuide(targetId) {
      var spec = GUIDE_TARGETS[targetId]
      if (!spec) return false
      try {
        localStorage.setItem(GUIDE_KEY, JSON.stringify({ id: targetId, at: Date.now() }))
      } catch (_err) {}
      if (currentPath() !== normalizeRoute(spec.path)) {
        location.href = spec.path + '#lyne-guide'
        return true
      }
      return activateGuideTarget(targetId)
    }

    function showOnboardingStep() {
      if (!isOnboardingActive()) return false
      var stepIndex = getOnboardingStep()
      var step = ONBOARDING_STEPS[stepIndex]
      if (!step) {
        finishOnboarding()
        return false
      }
      if (currentPath() !== normalizeRoute(step.page)) return false

      var retryToken = String(stepIndex) + '|' + currentPath()
      if (onboardingRetryToken !== retryToken) {
        onboardingRetryToken = retryToken
        onboardingRetryCount = 0
      }

      var target = resolveGuideNode(step)
      if (!target) {
        onboardingRetryCount += 1
        target = fallbackGuideTarget()
      } else {
        onboardingRetryCount = 0
      }

      clearGuide()
      guideTargetNode = target
      if (target && target.classList && target !== document.body && target !== document.documentElement) {
        target.classList.add('sc-lyne-guide-target')
      }
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      } catch (_err) {
        if (target && target.scrollIntoView) target.scrollIntoView()
      }
      moveWidgetNearTarget(target)
      setTimeout(function () {
        if (!guideTargetNode || guideTargetNode !== target || !guideBubble) return
        moveWidgetNearTarget(target)
        positionGuideBubble(target, guideBubble)
      }, 280)
      setPanelOpen(true)
      meta.textContent = 'LYNE guide'
      setStableChat(chat, 'LYNE: ' + step.message)
      setHintContent(step.hint || 'Follow LYNE across the app.', [
        { id: 'guide-next', label: step.hint || 'Continue', primary: true },
        { id: 'guide-skip', label: 'Skip tour' },
      ])
      if (isOnboardingVoiceEnabled()) {
        setTimeout(function () {
          speak(step.message)
            .then(function () {
              if (active && canListen) {
                setTimeout(startListening, 220)
              }
            })
            .catch(function () {})
        }, 140)
      }

      if (target && target !== document.body && target !== document.documentElement) {
        var bubble = document.createElement('div')
        bubble.className = 'sc-lyne-guide-bubble'
        bubble.innerHTML = '<strong>LYNE</strong>' + String(step.hint || 'Tap here to continue')
        document.body.appendChild(bubble)
        guideBubble = bubble
        positionGuideBubble(target, bubble)
      }

      var refreshGuide = function () {
        if (guideTargetNode && guideBubble) {
          moveWidgetNearTarget(guideTargetNode)
          positionGuideBubble(guideTargetNode, guideBubble)
        }
      }
      window.addEventListener('resize', refreshGuide, { once: true })
      window.addEventListener('scroll', refreshGuide, { once: true, passive: true })

      var advance = function () {
        if (!isOnboardingActive()) return
        if (step.autoFinish) {
          finishOnboarding()
          return
        }
        setOnboardingStep(stepIndex + 1)
        if (!step.next || normalizeRoute(step.next) === currentPath()) {
          setTimeout(showOnboardingStep, 420)
        }
      }

      if (target && target.addEventListener && target !== document.body && target !== document.documentElement) {
        target.addEventListener('click', advance, { once: true })
      }
      if (step.autoFinish) {
        guideCleanupTimer = setTimeout(function () {
          finishOnboarding()
        }, 5200)
      } else {
        guideCleanupTimer = setTimeout(function () {
          if (isOnboardingActive()) showOnboardingStep()
        }, 14000)
      }
      return true
    }

    function beginOnboarding(withVoice) {
      setOnboardingDismissed(false)
      setOnboardingActive(true)
      setOnboardingStep(0)
      setOnboardingVoiceEnabled(!!withVoice)
      active = false
      showOnboardingStep()
    }

    function maybeStartOnboarding() {
      if (currentPath() !== '/index') return
      if (isOnboardingDismissed()) return
      if (isOnboardingActive()) return
      setTimeout(function () {
        if (isOnboardingDismissed() || isOnboardingActive()) return
        setHintContent('Want the LYNE AI to guide you through the app?', [
          { id: 'guide-yes', label: 'Guide me', primary: true },
          { id: 'guide-no', label: 'Not now' },
        ])
      }, 1200)
    }

    function resetOnboardingForDebug() {
      clearGuide()
      setOnboardingActive(false)
      setOnboardingStep(0)
      setOnboardingDismissed(false)
      setOnboardingVoiceEnabled(false)
      active = false
      captureText = ''
      if (captureTimer) clearTimeout(captureTimer)
      stopListening()
      try {
        if (lyneAudio) lyneAudio.pause()
      } catch (_err) {}
      lyneAudio = null
      try {
        window.speechSynthesis.cancel()
      } catch (_err2) {}
      speaking = false
      setSpeakingVisual(false)
      setPanelOpen(false)
      meta.textContent = 'Guide reset. Double-click worked.'
      setDefaultHint()
      maybeStartOnboarding()
    }

    function resumePendingGuide() {
      var pending = readJson(GUIDE_KEY, null)
      if (!pending || !pending.id) return
      if (pending.at && Date.now() - Number(pending.at) > 180000) {
        clearGuide()
        return
      }
      var spec = GUIDE_TARGETS[pending.id]
      if (!spec || currentPath() !== normalizeRoute(spec.path)) return
      setTimeout(function () {
        activateGuideTarget(pending.id)
      }, 450)
    }

    function resumeOnboarding() {
      if (!isOnboardingActive()) return
      var step = ONBOARDING_STEPS[getOnboardingStep()]
      if (!step) {
        finishOnboarding()
        return
      }
      if (currentPath() !== normalizeRoute(step.page)) return
      setTimeout(function () {
        showOnboardingStep()
      }, 520)
    }

    function flushCapturedText() {
      if (!captureText || waiting) return
      var prompt = captureText.trim()
      captureText = ''
      if (prompt) askLyne(prompt)
    }

    function scheduleFlush(delay) {
      if (captureTimer) clearTimeout(captureTimer)
      captureTimer = setTimeout(flushCapturedText, delay)
    }

    function looksLikeEcho(value) {
      var heard = compactText(value)
      var spoken = compactText(lastAssistantText)
      if (!heard || !spoken) return false
      if (heard === spoken) return true
      if (heard.length > 8 && spoken.indexOf(heard) !== -1) return true
      if (spoken.length > 18 && heard.indexOf(spoken) !== -1) return true
      if (Date.now() - lastSpeechEndedAt < 4200) return true
      return false
    }

    function extractResponseText(payload) {
      if (!payload) return ''
      if (typeof payload.text === 'string') return payload.text
      if (typeof payload.content === 'string') return payload.content
      if (payload.choices && payload.choices[0] && payload.choices[0].message) {
        return String(payload.choices[0].message.content || '')
      }
      return ''
    }

    async function askAssistant(prompt) {
      var response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: {
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4o-mini',
          },
        }),
      })
      if (!response.ok) {
        var errorText = await response.text()
        throw new Error(errorText || ('AI request failed (' + response.status + ')'))
      }
      var data = await response.json()
      return normalizeAssistantText(extractResponseText(data), prompt)
    }

    async function askViaPuter(prompt) {
      await ensurePuterReady(9000)
      var response = await window.puter.ai.chat(buildLynePrompt(prompt), {
        model: 'gpt-4o-mini',
        stream: false,
      })
      var text = normalizeAssistantText(extractPuterText(response), prompt)
      if (!text) {
        throw new Error('Puter returned empty text.')
      }
      return text
    }

    function pickPreferredVoice() {
      if (!canSpeak || !window.speechSynthesis || !window.speechSynthesis.getVoices) return null
      var voices = window.speechSynthesis.getVoices() || []
      if (!voices.length) return null
      var preferredNames = ['microsoft aria online', 'microsoft jenny online', 'google us english', 'samantha', 'microsoft aria', 'microsoft jenny']
      for (var p = 0; p < preferredNames.length; p++) {
        for (var i = 0; i < voices.length; i++) {
          var name = String(voices[i].name || '').toLowerCase()
          var lang = String(voices[i].lang || '').toLowerCase()
          if (name.indexOf('multilingual') !== -1) continue
          if (name.indexOf(preferredNames[p]) !== -1 && (lang === 'en-us' || lang.indexOf('en-us') === 0)) {
            return voices[i]
          }
        }
      }
      for (var j = 0; j < voices.length; j++) {
        var fallbackLang = String(voices[j].lang || '').toLowerCase()
        var fallbackName = String(voices[j].name || '').toLowerCase()
        if (fallbackName.indexOf('multilingual') !== -1) continue
        if (fallbackLang === 'en-us' || fallbackLang.indexOf('en-us') === 0) return voices[j]
      }
      return voices[0] || null
    }

    async function speak(text) {
      var phrase = String(text || '').trim()
      if (!phrase) return
      try {
        if (lyneAudio) {
          lyneAudio.pause()
          lyneAudio = null
        }
      } catch (_err) {}
      try {
        window.speechSynthesis.cancel()
      } catch (_err2) {}
      if (recognition && listening) {
        try { recognition.abort() } catch (_errAbort) {}
        listening = false
      }

      try {
        var ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            request: {
              text: phrase,
              openai_model: 'gpt-4o-mini-tts',
              openai_voice: 'alloy',
              openai_format: 'mp3',
            },
          }),
        })
        if (ttsRes.ok) {
          var blob = await ttsRes.blob()
          var url = URL.createObjectURL(blob)
          var audio = new Audio(url)
          lyneAudio = audio
          speaking = true
          setSpeakingVisual(true)
          meta.textContent = 'LYNE is speaking...'
          ignoreMicUntil = Date.now() + 2600
          await new Promise(function (resolve) {
            audio.onended = function () {
              try { URL.revokeObjectURL(url) } catch (_err3) {}
              speaking = false
              lyneAudio = null
              setSpeakingVisual(false)
              lastSpeechEndedAt = Date.now()
              meta.textContent = active ? 'Listening...' : 'Idle.'
              resolve()
            }
            audio.onerror = function () {
              try { URL.revokeObjectURL(url) } catch (_err4) {}
              speaking = false
              lyneAudio = null
              setSpeakingVisual(false)
              lastSpeechEndedAt = Date.now()
              resolve()
            }
            audio.play().catch(function () {
              try { URL.revokeObjectURL(url) } catch (_err5) {}
              speaking = false
              lyneAudio = null
              setSpeakingVisual(false)
              lastSpeechEndedAt = Date.now()
              resolve()
            })
          })
          return
        }
      } catch (_err6) {}

      if (!canSpeak) return
      preferredVoice = preferredVoice || pickPreferredVoice()
      var utterance = new SpeechSynthesisUtterance(phrase)
      if (preferredVoice) utterance.voice = preferredVoice
      utterance.lang = preferredVoice && preferredVoice.lang ? preferredVoice.lang : 'en-US'
      utterance.rate = 0.93
      utterance.pitch = 1
      speaking = true
      setSpeakingVisual(true)
      meta.textContent = 'LYNE is speaking...'
      ignoreMicUntil = Date.now() + 2600
      await new Promise(function (resolve) {
        utterance.onend = function () {
          speaking = false
          setSpeakingVisual(false)
          lastSpeechEndedAt = Date.now()
          meta.textContent = active ? 'Listening...' : 'Idle.'
          resolve()
        }
        utterance.onerror = function () {
          speaking = false
          setSpeakingVisual(false)
          lastSpeechEndedAt = Date.now()
          meta.textContent = active ? 'Listening...' : 'Idle.'
          resolve()
        }
        window.speechSynthesis.speak(utterance)
      })
    }

    async function askLyne(prompt) {
      var question = String(prompt || '').trim()
      if (!question || waiting) return
      if (question.length < 2) return
      if (looksLikeEcho(question)) {
        meta.textContent = active ? 'Listening...' : 'Idle.'
        return
      }
      var now = Date.now()
      if (lastUserText && compactText(question) === lastUserText && now - lastUserAt < 4000) {
        meta.textContent = active ? 'Listening...' : 'Idle.'
        return
      }
      lastUserText = compactText(question)
      lastUserAt = now
      waiting = true
      meta.textContent = 'Thinking...'
      setTemporaryChat(chat, 'You: ' + question + '\n\nLYNE: ...')
      try {
        var intentReply = localAppIntentReply(question)
        var guideTarget = detectGuideTarget(question)
        var reply = guideTarget && GUIDE_TARGETS[guideTarget] ? GUIDE_TARGETS[guideTarget].reply : intentReply
        if (!reply) {
          try {
            reply = await askViaPuter(question)
            meta.textContent = 'Connected (Puter.js).'
          } catch (_puterErr) {
            reply = await askAssistant(question)
            meta.textContent = 'Connected.'
          }
        }
        reply = normalizeAssistantText(reply, question)
        setStableChat(chat, 'You: ' + question + '\n\nLYNE: ' + reply)
        lastAssistantText = reply
        await speak(reply)
        if (guideTarget) {
          meta.textContent = 'Starting guide...'
          setTimeout(function () {
            startGuide(guideTarget)
          }, 220)
        }
      } catch (_err) {
        var fallback = localFallbackReply(question)
        lastAssistantText = fallback
        setStableChat(chat, 'You: ' + question + '\n\nLYNE: ' + fallback)
        await speak(fallback)
        meta.textContent = 'Using fallback reply.'
      } finally {
        waiting = false
        if (active && canListen) {
          setTimeout(startListening, 250)
        }
      }
    }

    function startListening() {
      if (!recognition || !active || waiting || listening || speaking) return
      if (Date.now() < ignoreMicUntil) {
        setTimeout(startListening, 200)
        return
      }
      try { recognition.start() } catch (_err) {}
    }

    function stopListening() {
      if (recognition && listening) {
        try { recognition.stop() } catch (_err) {}
      }
    }

    function beginDrag(startEvent) {
      if (!startEvent) return
      if (startEvent.button != null && startEvent.button !== 0) return
      if (returnPromptActive) return
      var touch = startEvent.touches && startEvent.touches[0] ? startEvent.touches[0] : null
      var startX = touch ? touch.clientX : startEvent.clientX
      var startY = touch ? touch.clientY : startEvent.clientY
      if (startX == null || startY == null) return
      var rect = widget.getBoundingClientRect()
      var originX = rect.left
      var originY = rect.top
      didDrag = false
      widget.classList.add('lyne-dragging')
      var pointerOwner = startEvent.currentTarget && typeof startEvent.currentTarget.setPointerCapture === 'function'
        ? startEvent.currentTarget
        : null
      if (pointerOwner && startEvent.pointerId != null) {
        try { pointerOwner.setPointerCapture(startEvent.pointerId) } catch (_err) {}
      }

      function move(moveEvent) {
        var moveTouch = moveEvent.touches && moveEvent.touches[0] ? moveEvent.touches[0] : null
        if (moveEvent.pointerId != null && startEvent.pointerId != null && moveEvent.pointerId !== startEvent.pointerId) return
        var clientX = moveTouch ? moveTouch.clientX : moveEvent.clientX
        var clientY = moveTouch ? moveTouch.clientY : moveEvent.clientY
        if (clientX == null || clientY == null) return
        if (typeof moveEvent.preventDefault === 'function') moveEvent.preventDefault()
        var deltaX = clientX - startX
        var deltaY = clientY - startY
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
          didDrag = true
        }
        applyPosition(widget, { x: originX + deltaX, y: originY + deltaY })
      }

      function end() {
        widget.classList.remove('lyne-dragging')
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', end)
        window.removeEventListener('pointercancel', end)
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', end)
        window.removeEventListener('touchmove', move)
        window.removeEventListener('touchend', end)
        window.removeEventListener('touchcancel', end)
        if (pointerOwner && startEvent.pointerId != null && typeof pointerOwner.releasePointerCapture === 'function') {
          try { pointerOwner.releasePointerCapture(startEvent.pointerId) } catch (_err) {}
        }
      }

      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', end)
      window.addEventListener('pointercancel', end)
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', end)
      window.addEventListener('touchmove', move, { passive: false })
      window.addEventListener('touchend', end)
      window.addEventListener('touchcancel', end)
    }

    orbToggle.addEventListener('pointerdown', beginDrag)
    dragHandle.addEventListener('pointerdown', beginDrag)
    orbToggle.addEventListener('mousedown', beginDrag)
    dragHandle.addEventListener('mousedown', beginDrag)
    orbToggle.addEventListener('touchstart', beginDrag, { passive: false })
    dragHandle.addEventListener('touchstart', beginDrag, { passive: false })
    panelClose.addEventListener('pointerdown', function (event) {
      event.stopPropagation()
    })
    orbToggle.addEventListener('click', function () {
      if (returnPromptActive) {
        clearReturnPrompt()
        return
      }
      if (didDrag) {
        didDrag = false
        return
      }
      var now = Date.now()
      if (now - lastOrbTapAt < 420) {
        lastOrbTapAt = 0
        resetOnboardingForDebug()
        return
      }
      lastOrbTapAt = now
      setPanelOpen(!panel.classList.contains('open'))
      playUiSound(panel.classList.contains('open') ? 'panel' : 'tap')
      if (panel.classList.contains('open')) {
        scheduleAutoArm()
      } else {
        input.blur()
      }
    })
    panelClose.addEventListener('click', function (event) {
      if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
      clearReturnPrompt()
      setPanelOpen(false)
      playUiSound('tap')
    })
    hint.addEventListener('click', function (event) {
      clearReturnPrompt()
      var actionId = event.target && event.target.getAttribute ? event.target.getAttribute('data-lyne-hint-action') : ''
      var dismissHint = event.target && event.target.getAttribute ? event.target.getAttribute('data-lyne-hint-dismiss') : ''
      if (dismissHint != null) {
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
        clearTutorSpotlightTimers()
        clearGuide()
        setHintDismissed(true)
        setOnboardingDismissed(true)
        setOnboardingActive(false)
        setOnboardingVoiceEnabled(false)
        syncHintVisibility()
        return
      }
      if (actionId === 'guide-yes') {
        clearTutorSpotlightTimers()
        beginOnboarding(true)
        return
      }
      if (actionId === 'spotlight-open') {
        clearTutorSpotlightTimers()
        setPanelOpen(true)
        return
      }
      if (actionId === 'guide-next') {
        clearTutorSpotlightTimers()
        var currentIndex = getOnboardingStep()
        var currentStep = ONBOARDING_STEPS[currentIndex]
        if (!currentStep) {
          finishOnboarding()
          return
        }
        continueOnboardingStep(currentIndex, currentStep, guideTargetNode)
        return
      }
      if (actionId === 'guide-skip') {
        clearTutorSpotlightTimers()
        finishOnboarding()
        return
      }
      if (actionId === 'guide-no') {
        clearTutorSpotlightTimers()
        setOnboardingDismissed(true)
        setOnboardingActive(false)
        setOnboardingVoiceEnabled(false)
        setDefaultHint()
        return
      }
      clearTutorSpotlightTimers()
      setPanelOpen(true)
    })

    startBtn.addEventListener('click', function () {
      clearReturnPrompt()
      if (!canListen) {
        meta.textContent = 'Voice not supported in this browser.'
        return
      }
      active = true
      setPanelOpen(true)
      meta.textContent = 'Conversation started.'
      playUiSound('success')
      startListening()
    })

    tutorialBtn.addEventListener('click', function () {
      clearReturnPrompt()
      clearGuide()
      setOnboardingDismissed(false)
      setPanelOpen(true)
      playUiSound('panel')
      beginOnboarding(true)
    })

    stopBtn.addEventListener('click', function () {
      clearReturnPrompt()
      active = false
      setOnboardingVoiceEnabled(false)
      captureText = ''
      if (captureTimer) clearTimeout(captureTimer)
      stopListening()
      try {
        if (lyneAudio) lyneAudio.pause()
      } catch (_err) {}
      lyneAudio = null
      try {
        window.speechSynthesis.cancel()
      } catch (_err2) {}
      speaking = false
      setSpeakingVisual(false)
      meta.textContent = 'Conversation stopped.'
      playUiSound('tap')
    })

    function submitManualPrompt() {
      clearReturnPrompt()
      var value = String(input.value || '').trim()
      if (!value) return
      input.value = ''
      setPanelOpen(true)
      playUiSound('message')
      askLyne(value)
    }

    sendBtn.addEventListener('click', submitManualPrompt)
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault()
        submitManualPrompt()
      }
    })

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('open')) {
        clearReturnPrompt()
        setPanelOpen(false)
      }
    })

    document.addEventListener('visibilitychange', function () {
      if (!returnPromptActive || returnPromptSpoken || document.hidden) return
      lastAssistantText = 'Return to the library now.'
      returnPromptSpoken = true
      speak('Return to the library now.').catch(function () {})
    })

    document.addEventListener('sc:lyne-return-prompt', function (event) {
      showReturnPrompt(event && event.detail ? event.detail : null)
    })

    document.addEventListener('sc:lyne-return-clear', function () {
      clearReturnPrompt()
    })

    document.addEventListener('click', function (event) {
      var trigger = event.target && event.target.closest ? event.target.closest('[data-lyne-spotlight]') : null
      if (!trigger) return
      event.preventDefault()
      playUiSound('panel')
      spotlightTutorAssistant()
    })

    document.addEventListener('click', function (event) {
      var trigger = event.target && event.target.closest ? event.target.closest('[data-lyne-start-tutorial]') : null
      if (!trigger) return
      event.preventDefault()
      clearReturnPrompt()
      clearGuide()
      clearTutorSpotlightTimers()
      setOnboardingDismissed(false)
      setPanelOpen(true)
      playUiSound('panel')
      beginOnboarding(true)
    })

    if (canListen) {
      preferredVoice = pickPreferredVoice()
      if (window.speechSynthesis && 'onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = function () {
          preferredVoice = pickPreferredVoice()
        }
      }
      recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognition.interimResults = true
      recognition.continuous = true
      recognition.maxAlternatives = 1
      recognition.onstart = function () {
        listening = true
        meta.textContent = speaking ? 'Waiting...' : 'Listening...'
      }
      recognition.onresult = function (event) {
        if (Date.now() < ignoreMicUntil) return
        var transcript = ''
        for (var i = event.resultIndex; i < event.results.length; i++) {
          transcript = String((event.results[i] && event.results[i][0] && event.results[i][0].transcript) || '').trim()
          if (!transcript) continue
          if (looksLikeEcho(transcript)) {
            meta.textContent = active ? 'Listening...' : 'Idle.'
            continue
          }
          captureText = transcript
          meta.textContent = event.results[i].isFinal ? 'Heard: ' + transcript : 'Hearing: ' + transcript
          scheduleFlush(event.results[i].isFinal ? FINAL_SPEECH_PAUSE_MS : INTERIM_SPEECH_PAUSE_MS)
        }
      }
      recognition.onerror = function (event) {
        listening = false
        var code = String((event && event.error) || '')
        meta.textContent = code === 'not-allowed' ? 'Microphone permission blocked.' : (active ? 'Listening...' : 'Idle.')
      }
      recognition.onend = function () {
        listening = false
        if (active && !waiting) {
          setTimeout(startListening, 350)
        } else if (panel.classList.contains('open')) {
          scheduleAutoArm()
        }
      }
    } else {
      startBtn.disabled = true
      meta.textContent = 'Voice not supported in this browser.'
    }

    setDefaultHint()
    setStableChat(chat, readStableChat())
    setPanelOpen(false)
    syncHintVisibility()
    applyPosition(widget, readJson(POSITION_KEY, { x: window.innerWidth - 66, y: window.innerHeight - 66 }))
    window.addEventListener('resize', function () {
      applyPosition(widget, readJson(POSITION_KEY, { x: window.innerWidth - 66, y: window.innerHeight - 66 }))
    })
    resumePendingGuide()
    resumeOnboarding()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
