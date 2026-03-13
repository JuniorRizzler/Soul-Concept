(function () {
  var POSITION_KEY = 'sc_lyne_widget_position_v1'
  var PANEL_OPEN_KEY = 'sc_lyne_widget_panel_open_v1'
  var CHAT_KEY = 'sc_lyne_widget_chat_v1'
  var GUIDE_KEY = 'sc_lyne_widget_guide_v1'
  var ONBOARDING_ACTIVE_KEY = 'sc_lyne_onboarding_active_v1'
  var ONBOARDING_STEP_KEY = 'sc_lyne_onboarding_step_v1'
  var ONBOARDING_DISMISSED_KEY = 'sc_lyne_onboarding_dismissed_v1'
  var ONBOARDING_VOICE_KEY = 'sc_lyne_onboarding_voice_v1'
  var DEFAULT_CHAT = 'LYNE: Ready when you are.'
  var DEFAULT_STILL_HERE = 'I am still here. Ask me where to go in the app, what to study next, or what concept you want explained.'
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

  function ensureStyles() {
    if (document.getElementById('sc-lyne-widget-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-lyne-widget-styles'
    style.textContent =
      '#lyne-widget{position:fixed;left:calc(100vw - 66px);top:calc(100vh - 66px);z-index:140;touch-action:none;user-select:none;transition:left .46s ease,top .46s ease,transform .24s ease}' +
      '#lyne-widget *{box-sizing:border-box}' +
      '#lyne-widget.lyne-dragging{transition:none}' +
      '#lyne-widget button,#lyne-widget textarea,#lyne-widget pre{user-select:text}' +
      '.lyne-shell{position:relative;display:flex;flex-direction:column;align-items:flex-end;gap:8px}' +
      '#lyne-hint{position:absolute;right:66px;bottom:10px;max-width:196px;padding:8px 10px;border-radius:12px;background:linear-gradient(135deg,rgba(27,86,177,.92),rgba(197,37,37,.92));color:#fff;border:1px solid rgba(255,255,255,.28);box-shadow:0 10px 20px rgba(18,18,28,.25);font:700 11px/1.25 Manrope,system-ui,sans-serif;letter-spacing:.01em;opacity:.95;transform:translateY(0) scale(1);transform-origin:100% 100%;animation:lyneHintFloat 2.6s ease-in-out infinite;pointer-events:auto}' +
      '#lyne-hint:after{content:"";position:absolute;right:-6px;bottom:10px;width:12px;height:12px;background:linear-gradient(135deg,rgba(114,61,168,.95),rgba(197,37,37,.95));transform:rotate(45deg);border-right:1px solid rgba(255,255,255,.25);border-top:1px solid rgba(255,255,255,.25)}' +
      '.lyne-hint-text{display:block;padding-right:18px}' +
      '.lyne-hint-close{position:absolute;top:6px;right:6px;appearance:none;border:0;background:transparent;color:#fff;font:800 12px/1 Manrope,system-ui,sans-serif;cursor:pointer;opacity:.88;padding:2px 3px;border-radius:999px}' +
      '.lyne-hint-close:hover{background:rgba(255,255,255,.14);opacity:1}' +
      '.lyne-hint-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}' +
      '.lyne-hint-btn{appearance:none;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.16);color:#fff;border-radius:999px;padding:4px 8px;font:700 10px/1 Manrope,system-ui,sans-serif;cursor:pointer}' +
      '.lyne-hint-btn.is-primary{background:rgba(255,255,255,.92);color:#19315c;border-color:transparent}' +
      '#lyne-widget[data-panel-open="true"] #lyne-hint{display:none}' +
      '#lyne-orb-toggle{width:54px;height:54px;border-radius:999px;border:0;cursor:pointer;position:relative;overflow:hidden;background:radial-gradient(circle at 30% 30%,#fff0d8 0%,#ffb453 45%,#8a410d 100%);box-shadow:0 14px 22px rgba(23,21,16,.35),inset -8px -10px 12px rgba(0,0,0,.22),inset 5px 7px 9px rgba(255,255,255,.35)}' +
      '#lyne-orb-toggle .flame-core{position:absolute;left:16px;top:11px;width:22px;height:28px;border-radius:52% 48% 58% 42%/52% 40% 60% 48%;background:radial-gradient(circle at 40% 30%,#fff6ea 0%,#ffd58f 32%,#ff8b2b 68%,#bb4b0f 100%);animation:lyneFlame 1.9s ease-in-out infinite;transform-origin:50% 75%}' +
      '#lyne-orb-toggle .flame-inner{position:absolute;left:22px;top:18px;width:9px;height:12px;border-radius:50% 50% 55% 45%;background:radial-gradient(circle at 50% 24%,#fff8ef 0%,#ffe4ae 55%,rgba(255,228,174,.25) 100%);animation:lyneFlameInner 1.1s ease-in-out infinite}' +
      '#lyne-orb-toggle .flame-glow{position:absolute;inset:6px;border-radius:999px;box-shadow:0 0 22px rgba(255,147,53,.6);animation:lyneGlow 2.1s ease-in-out infinite}' +
      '#lyne-widget.lyne-speaking #lyne-orb-toggle .flame-core{animation-duration:.85s}' +
      '#lyne-widget.lyne-speaking #lyne-orb-toggle .flame-glow{box-shadow:0 0 30px rgba(255,137,40,.85)}' +
      '#lyne-panel{position:absolute;right:0;bottom:62px;width:min(286px,88vw);border:1px solid rgba(229,221,210,.78);background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(244,238,230,.96));backdrop-filter:blur(14px);border-radius:20px;padding:10px;box-shadow:0 20px 40px rgba(23,21,16,.18);opacity:0;transform:translateY(12px) scale(.96);pointer-events:none;transition:opacity .24s ease,transform .24s ease}' +
      '#lyne-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '.lyne-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;cursor:grab;user-select:none}' +
      '.lyne-panel-head:active{cursor:grabbing}' +
      '.lyne-panel-title{margin:0;font-size:.84rem;font-weight:800;letter-spacing:.08em;color:#2b2218}' +
      '.lyne-panel-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}' +
      '.lyne-mini-btn{padding:6px 9px;font-size:.73rem;border-radius:999px;border:1px solid rgba(70,57,44,.09);background:rgba(255,255,255,.72)}' +
      '#lyne-panel .btn.btn-primary.lyne-mini-btn{background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border-color:transparent}' +
      '#lyne-panel .btn.btn-secondary.lyne-mini-btn{background:rgba(255,255,255,.84);color:#382d23}' +
      '#lyne-meta{margin:7px 0 0;color:#6d6256;font-size:.74rem;font-weight:700}' +
      '#lyne-chat{margin:8px 0 0;white-space:pre-wrap;background:linear-gradient(180deg,#fbfcfe,#f2f5f8);border:1px solid rgba(191,202,214,.65);border-radius:14px;padding:10px;min-height:42px;max-height:108px;overflow:auto;font-size:.75rem;line-height:1.4;color:#18212b;user-select:text}' +
      '.lyne-compose{display:flex;align-items:center;gap:6px;margin-top:8px}' +
      '.lyne-input{flex:1;min-width:0;border:1px solid rgba(181,188,198,.8);background:rgba(255,255,255,.92);border-radius:999px;padding:9px 12px;font:600 12px/1.2 Manrope,system-ui,sans-serif;color:#18212b;outline:none;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}' +
      '.lyne-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}' +
      '.lyne-send{min-width:38px;height:38px;border:0;border-radius:999px;background:linear-gradient(135deg,#f59e0b,#ea580c);color:#fff;font:800 15px/1 Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 20px rgba(234,88,12,.22)}' +
      '.lyne-send:disabled{opacity:.45;cursor:default;box-shadow:none}' +
      '.sc-lyne-guide-target{position:relative;z-index:141 !important;outline:3px solid #ff8a1c !important;outline-offset:4px;border-radius:14px;box-shadow:0 0 0 8px rgba(255,138,28,.18),0 16px 28px rgba(20,20,28,.22);animation:scLyneGuidePulse 1.15s ease-in-out infinite}' +
      '.sc-lyne-guide-bubble{position:fixed;z-index:142;max-width:min(260px,80vw);padding:10px 12px;border-radius:14px;background:rgba(14,23,38,.96);color:#fff;font:700 12px/1.35 Manrope,system-ui,sans-serif;box-shadow:0 16px 30px rgba(0,0,0,.28)}' +
      '.sc-lyne-guide-bubble strong{display:block;margin-bottom:4px;font-size:12px;letter-spacing:.01em;color:#ffd39c}' +
      '.sc-lyne-tour-pop{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:145;width:min(360px,calc(100vw - 28px));padding:18px 18px 16px;border-radius:20px;background:rgba(20,24,33,.97);color:#fff;box-shadow:0 28px 50px rgba(0,0,0,.34)}' +
      '.sc-lyne-tour-pop strong{display:block;font:800 12px/1 Manrope,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#ffd39c;margin-bottom:10px}' +
      '.sc-lyne-tour-pop p{margin:0;color:#f4f4f7;font:700 14px/1.5 Manrope,system-ui,sans-serif}' +
      '.sc-lyne-tour-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}' +
      '.sc-lyne-tour-btn{appearance:none;border:0;border-radius:999px;padding:9px 12px;font:800 12px/1 Manrope,system-ui,sans-serif;cursor:pointer}' +
      '.sc-lyne-tour-btn.primary{background:#fff;color:#18212b}' +
      '.sc-lyne-tour-btn.secondary{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.18)}' +
      '@media (max-width:760px){#lyne-widget{transform:scale(.82);transform-origin:100% 100%}#lyne-hint{right:50px;bottom:6px;max-width:148px;padding:6px 8px;font-size:9px;border-radius:10px}#lyne-hint:after{right:-5px;bottom:8px;width:10px;height:10px}.lyne-hint-text{padding-right:16px}.lyne-hint-close{top:5px;right:5px;font-size:10px}.lyne-hint-actions{gap:4px;margin-top:6px}.lyne-hint-btn{padding:4px 7px;font-size:9px}#lyne-orb-toggle{width:44px;height:44px}#lyne-orb-toggle .flame-core{left:13px;top:9px;width:18px;height:22px}#lyne-orb-toggle .flame-inner{left:18px;top:15px;width:7px;height:10px}#lyne-orb-toggle .flame-glow{inset:5px}#lyne-panel{bottom:52px;width:min(236px,72vw);padding:8px;border-radius:16px}#lyne-chat{padding:8px;min-height:34px;max-height:82px;font-size:.68rem}#lyne-meta{font-size:.66rem;margin-top:5px}.lyne-panel-actions{gap:4px;margin-top:6px}.lyne-mini-btn{padding:5px 8px;font-size:.66rem}.lyne-compose{gap:5px;margin-top:6px}.lyne-input{padding:7px 10px;font-size:11px}.lyne-send{min-width:32px;height:32px;font-size:13px}}' +
      '@keyframes lyneFlame{0%{transform:translateY(0) rotate(-2deg) scale(1)}50%{transform:translateY(-2px) rotate(2deg) scale(1.05)}100%{transform:translateY(0) rotate(-1deg) scale(1)}}' +
      '@keyframes lyneFlameInner{0%,100%{opacity:.85;transform:translateY(0)}50%{opacity:1;transform:translateY(-1px)}}' +
      '@keyframes lyneGlow{0%,100%{opacity:.5}50%{opacity:1}}' +
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
      '<div id="lyne-hint"><span class="lyne-hint-text">Hey, need help? Ask me.</span></div>' +
      '<button id="lyne-orb-toggle" type="button" aria-label="Open LYNE" aria-expanded="false">' +
      '<span class="flame-glow" aria-hidden="true"></span>' +
      '<span class="flame-core" aria-hidden="true"></span>' +
      '<span class="flame-inner" aria-hidden="true"></span>' +
      '</button>' +
      '<section id="lyne-panel" aria-hidden="true">' +
      '<div class="lyne-panel-head" data-lyne-drag-handle>' +
      '<h3 class="lyne-panel-title">LYNE</h3>' +
      '<button id="lyne-panel-close" type="button" class="btn btn-secondary lyne-mini-btn">Hide</button>' +
      '</div>' +
      '<div class="lyne-panel-actions">' +
      '<button id="lyne-start" class="btn btn-primary lyne-mini-btn" type="button">Start</button>' +
      '<button id="lyne-tutorial" class="btn btn-secondary lyne-mini-btn" type="button">Tutorial</button>' +
      '<button id="lyne-stop" class="btn btn-secondary lyne-mini-btn" type="button">Stop</button>' +
      '</div>' +
      '<p id="lyne-meta">Idle.</p>' +
      '<pre id="lyne-chat">' + DEFAULT_CHAT + '</pre>' +
      '<div class="lyne-compose">' +
      '<input id="lyne-input" class="lyne-input" type="text" placeholder="Ask LYNE..." maxlength="240" />' +
      '<button id="lyne-send" class="lyne-send" type="button" aria-label="Send">↑</button>' +
      '</div>' +
      '</section>' +
      '</div>'
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
    var onboardingPopup = null

    function setHintContent(text, actions) {
      var html =
        '<button class="lyne-hint-close" type="button" aria-label="Close LYNE prompt" data-lyne-hint-dismiss>&times;</button>' +
        '<span class="lyne-hint-text">' + String(text || 'Hey, need help? Ask me.') + '</span>'
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
    }

    function setDefaultHint() {
      setHintContent('Hey, need help? Ask me.')
    }

    function setPanelOpen(next) {
      var open = !!next
      panel.classList.toggle('open', open)
      panel.setAttribute('aria-hidden', open ? 'false' : 'true')
      orbToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      widget.setAttribute('data-panel-open', open ? 'true' : 'false')
      writeText(PANEL_OPEN_KEY, open ? '1' : '0')
      if (open) {
        scheduleAutoArm()
      } else if (autoArmTimer) {
        clearTimeout(autoArmTimer)
        autoArmTimer = null
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
      setChat(chat, 'LYNE: You are set. Ask me where to go, what to study next, or what concept you want explained.')
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
      if (onboardingPopup && onboardingPopup.parentNode) {
        onboardingPopup.parentNode.removeChild(onboardingPopup)
      }
      onboardingPopup = null
    }

    function showOnboardingPopup(step, target, stepIndex) {
      if (onboardingPopup && onboardingPopup.parentNode) onboardingPopup.parentNode.removeChild(onboardingPopup)
      var popup = document.createElement('div')
      popup.className = 'sc-lyne-tour-pop'
      popup.innerHTML =
        '<strong>LYNE Tour</strong>' +
        '<p>' + String(step.message || 'Follow this step.') + '</p>' +
        '<div class="sc-lyne-tour-actions">' +
        '<button class="sc-lyne-tour-btn primary" type="button" data-lyne-tour-next>' + String(step.hint || 'Continue') + '</button>' +
        '<button class="sc-lyne-tour-btn secondary" type="button" data-lyne-tour-skip>Skip tour</button>' +
        '</div>'
      document.body.appendChild(popup)
      onboardingPopup = popup

      popup.addEventListener('click', function (event) {
        var skip = event.target && event.target.getAttribute ? event.target.getAttribute('data-lyne-tour-skip') : null
        var next = event.target && event.target.getAttribute ? event.target.getAttribute('data-lyne-tour-next') : null
        if (skip != null) {
          finishOnboarding()
          return
        }
        if (next == null) return
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
        if (!step.next || normalizeRoute(step.next) === currentPath()) {
          setTimeout(showOnboardingStep, 450)
        }
      })
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
        meta.textContent = 'LYNE guide'
        if (onboardingRetryCount > 14) {
          setChat(chat, 'LYNE: I am still lining up this step. If the page is loaded, tap the highlighted section or wait a second.')
          setHintContent(step.hint || 'Follow LYNE across the app.')
        }
        setTimeout(function () {
          if (isOnboardingActive()) showOnboardingStep()
        }, onboardingRetryCount > 8 ? 420 : 700)
        return false
      }

      onboardingRetryCount = 0

      clearGuide()
      guideTargetNode = target
      target.classList.add('sc-lyne-guide-target')
      try {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      } catch (_err) {
        target.scrollIntoView()
      }
      moveWidgetNearTarget(target)
      setTimeout(function () {
        if (!guideTargetNode || guideTargetNode !== target || !guideBubble) return
        moveWidgetNearTarget(target)
        positionGuideBubble(target, guideBubble)
      }, 280)
      setPanelOpen(true)
      meta.textContent = 'LYNE guide'
      setChat(chat, 'LYNE: ' + step.message)
      setHintContent(step.hint || 'Follow LYNE across the app.')
      showOnboardingPopup(step, target, stepIndex)
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

      var bubble = document.createElement('div')
      bubble.className = 'sc-lyne-guide-bubble'
      bubble.innerHTML = '<strong>LYNE</strong>' + String(step.hint || 'Tap here to continue')
      document.body.appendChild(bubble)
      guideBubble = bubble
      positionGuideBubble(target, bubble)

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

      target.addEventListener('click', advance, { once: true })
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
        setHintContent('Want LYNE to guide you through the app?', [
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
      setChat(chat, 'You: ' + question + '\n\nLYNE: ...')
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
        setChat(chat, 'You: ' + question + '\n\nLYNE: ' + reply)
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
        setChat(chat, 'You: ' + question + '\n\nLYNE: ' + fallback)
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
      if (startEvent.button != null && startEvent.button !== 0) return
      var startX = startEvent.clientX
      var startY = startEvent.clientY
      var rect = widget.getBoundingClientRect()
      var originX = rect.left
      var originY = rect.top
      didDrag = false
      widget.classList.add('lyne-dragging')

      function move(moveEvent) {
        var deltaX = moveEvent.clientX - startX
        var deltaY = moveEvent.clientY - startY
        if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
          didDrag = true
        }
        applyPosition(widget, { x: originX + deltaX, y: originY + deltaY })
      }

      function end() {
        widget.classList.remove('lyne-dragging')
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', end)
      }

      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', end)
    }

    orbToggle.addEventListener('pointerdown', beginDrag)
    dragHandle.addEventListener('pointerdown', beginDrag)
    orbToggle.addEventListener('click', function () {
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
      if (panel.classList.contains('open')) {
        scheduleAutoArm()
      } else {
        input.blur()
      }
    })
    panelClose.addEventListener('click', function () {
      setPanelOpen(false)
    })
    hint.addEventListener('click', function (event) {
      var actionId = event.target && event.target.getAttribute ? event.target.getAttribute('data-lyne-hint-action') : ''
      var dismissHint = event.target && event.target.getAttribute ? event.target.getAttribute('data-lyne-hint-dismiss') : ''
      if (dismissHint != null) {
        clearGuide()
        setOnboardingDismissed(true)
        setOnboardingActive(false)
        setOnboardingVoiceEnabled(false)
        setDefaultHint()
        return
      }
      if (actionId === 'guide-yes') {
        beginOnboarding(true)
        return
      }
      if (actionId === 'guide-no') {
        setOnboardingDismissed(true)
        setOnboardingActive(false)
        setOnboardingVoiceEnabled(false)
        setDefaultHint()
        return
      }
      setPanelOpen(true)
    })

    startBtn.addEventListener('click', function () {
      if (!canListen) {
        meta.textContent = 'Voice not supported in this browser.'
        return
      }
      active = true
      setPanelOpen(true)
      meta.textContent = 'Conversation started.'
      startListening()
    })

    tutorialBtn.addEventListener('click', function () {
      clearGuide()
      setOnboardingDismissed(false)
      setPanelOpen(true)
      beginOnboarding(true)
    })

    stopBtn.addEventListener('click', function () {
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
    })

    function submitManualPrompt() {
      var value = String(input.value || '').trim()
      if (!value) return
      input.value = ''
      setPanelOpen(true)
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
        setPanelOpen(false)
      }
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
          scheduleFlush(event.results[i].isFinal ? 260 : 850)
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
    setChat(chat, readText(CHAT_KEY, DEFAULT_CHAT))
    setPanelOpen(false)
    applyPosition(widget, readJson(POSITION_KEY, { x: window.innerWidth - 66, y: window.innerHeight - 66 }))
    window.addEventListener('resize', function () {
      applyPosition(widget, readJson(POSITION_KEY, { x: window.innerWidth - 66, y: window.innerHeight - 66 }))
    })
    resumePendingGuide()
    resumeOnboarding()
    maybeStartOnboarding()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
