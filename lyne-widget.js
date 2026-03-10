(function () {
  var POSITION_KEY = 'sc_lyne_widget_position_v1'
  var PANEL_OPEN_KEY = 'sc_lyne_widget_panel_open_v1'
  var CHAT_KEY = 'sc_lyne_widget_chat_v1'
  var GUIDE_KEY = 'sc_lyne_widget_guide_v1'
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
      reply: 'I will show you. Scroll to the Libraries section, then click Open Science.',
      hint: 'Click Open Science'
    },
    geography: {
      path: '/index.html',
      selector: '[data-tour-id="home-geography"]',
      reply: 'I will show you. Scroll to the Libraries section, then click Open Geography.',
      hint: 'Click Open Geography'
    },
    math9: {
      path: '/index.html',
      selector: '[data-tour-id="home-math9-open"]',
      reply: 'I will show you. Scroll to the Libraries section, then click Open Math 9.',
      hint: 'Click Open Math 9'
    },
    math10: {
      path: '/index.html',
      selector: '[data-tour-id="home-math10-open"]',
      reply: 'I will show you. Scroll to the Libraries section, then click Open Math 10.',
      hint: 'Click Open Math 10'
    },
    cards: {
      path: '/index.html',
      selector: '[data-tour-id="home-cards-open"]',
      reply: 'I will show you. Scroll to the Libraries section, then click Open Cards.',
      hint: 'Click Open Cards'
    },
    quiz: {
      path: '/index.html',
      selector: '[data-tour-id="home-quiz-open"]',
      reply: 'I will show you. Scroll to the Libraries section, then click Open Quiz Tool.',
      hint: 'Click Open Quiz Tool'
    },
    home: {
      path: '/index.html',
      selector: '[data-tour-id="exit-home"]',
      reply: 'I will show you the way back home.',
      hint: 'Click Return Home'
    }
  }

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
      '#lyne-widget{position:fixed;left:calc(100vw - 66px);top:calc(100vh - 66px);z-index:140;touch-action:none;user-select:none}' +
      '#lyne-widget *{box-sizing:border-box}' +
      '#lyne-widget.lyne-dragging{transition:none}' +
      '#lyne-widget button,#lyne-widget textarea,#lyne-widget pre{user-select:text}' +
      '.lyne-shell{position:relative;display:flex;flex-direction:column;align-items:flex-end;gap:8px}' +
      '#lyne-hint{position:absolute;right:66px;bottom:10px;max-width:180px;padding:8px 10px;border-radius:12px;background:linear-gradient(135deg,rgba(27,86,177,.92),rgba(197,37,37,.92));color:#fff;border:1px solid rgba(255,255,255,.28);box-shadow:0 10px 20px rgba(18,18,28,.25);font:700 11px/1.25 Manrope,system-ui,sans-serif;letter-spacing:.01em;opacity:.95;transform:translateY(0) scale(1);transform-origin:100% 100%;animation:lyneHintFloat 2.6s ease-in-out infinite;pointer-events:none}' +
      '#lyne-hint:after{content:"";position:absolute;right:-6px;bottom:10px;width:12px;height:12px;background:linear-gradient(135deg,rgba(114,61,168,.95),rgba(197,37,37,.95));transform:rotate(45deg);border-right:1px solid rgba(255,255,255,.25);border-top:1px solid rgba(255,255,255,.25)}' +
      '#lyne-widget[data-panel-open="true"] #lyne-hint{display:none}' +
      '#lyne-orb-toggle{width:54px;height:54px;border-radius:999px;border:0;cursor:pointer;position:relative;overflow:hidden;background:radial-gradient(circle at 30% 30%,#fff0d8 0%,#ffb453 45%,#8a410d 100%);box-shadow:0 14px 22px rgba(23,21,16,.35),inset -8px -10px 12px rgba(0,0,0,.22),inset 5px 7px 9px rgba(255,255,255,.35)}' +
      '#lyne-orb-toggle .flame-core{position:absolute;left:16px;top:11px;width:22px;height:28px;border-radius:52% 48% 58% 42%/52% 40% 60% 48%;background:radial-gradient(circle at 40% 30%,#fff6ea 0%,#ffd58f 32%,#ff8b2b 68%,#bb4b0f 100%);animation:lyneFlame 1.9s ease-in-out infinite;transform-origin:50% 75%}' +
      '#lyne-orb-toggle .flame-inner{position:absolute;left:22px;top:18px;width:9px;height:12px;border-radius:50% 50% 55% 45%;background:radial-gradient(circle at 50% 24%,#fff8ef 0%,#ffe4ae 55%,rgba(255,228,174,.25) 100%);animation:lyneFlameInner 1.1s ease-in-out infinite}' +
      '#lyne-orb-toggle .flame-glow{position:absolute;inset:6px;border-radius:999px;box-shadow:0 0 22px rgba(255,147,53,.6);animation:lyneGlow 2.1s ease-in-out infinite}' +
      '#lyne-widget.lyne-speaking #lyne-orb-toggle .flame-core{animation-duration:.85s}' +
      '#lyne-widget.lyne-speaking #lyne-orb-toggle .flame-glow{box-shadow:0 0 30px rgba(255,137,40,.85)}' +
      '#lyne-panel{position:absolute;right:0;bottom:62px;width:min(310px,90vw);border:1px solid rgba(226,216,203,.76);background:linear-gradient(170deg,rgba(255,255,255,.96),rgba(247,241,233,.94));border-radius:16px;padding:10px;box-shadow:0 18px 34px rgba(23,21,16,.24);opacity:0;transform:translateY(12px) scale(.96);pointer-events:none;transition:opacity .24s ease,transform .24s ease}' +
      '#lyne-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '.lyne-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;cursor:grab;user-select:none}' +
      '.lyne-panel-head:active{cursor:grabbing}' +
      '.lyne-panel-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}' +
      '.lyne-mini-btn{padding:7px 10px;font-size:.78rem}' +
      '#lyne-meta{margin:7px 0 0;color:#5a5863;font-size:.8rem}' +
      '#lyne-chat{margin:7px 0 0;white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:8px;min-height:46px;max-height:132px;overflow:auto;font-size:.78rem;user-select:text}' +
      '.sc-lyne-guide-target{position:relative;z-index:141 !important;outline:3px solid #ff8a1c !important;outline-offset:4px;border-radius:14px;box-shadow:0 0 0 8px rgba(255,138,28,.18),0 16px 28px rgba(20,20,28,.22);animation:scLyneGuidePulse 1.15s ease-in-out infinite}' +
      '.sc-lyne-guide-bubble{position:fixed;z-index:142;max-width:min(260px,80vw);padding:10px 12px;border-radius:14px;background:rgba(14,23,38,.96);color:#fff;font:700 12px/1.35 Manrope,system-ui,sans-serif;box-shadow:0 16px 30px rgba(0,0,0,.28)}' +
      '.sc-lyne-guide-bubble strong{display:block;margin-bottom:4px;font-size:12px;letter-spacing:.01em;color:#ffd39c}' +
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
      '<div id="lyne-hint">Hey, need help? Ask me.</div>' +
      '<button id="lyne-orb-toggle" type="button" aria-label="Open LYNE" aria-expanded="false">' +
      '<span class="flame-glow" aria-hidden="true"></span>' +
      '<span class="flame-core" aria-hidden="true"></span>' +
      '<span class="flame-inner" aria-hidden="true"></span>' +
      '</button>' +
      '<section id="lyne-panel" aria-hidden="true">' +
      '<div class="lyne-panel-head" data-lyne-drag-handle>' +
      '<h3 style="margin:0;font-size:.95rem">LYNE</h3>' +
      '<button id="lyne-panel-close" type="button" class="btn btn-secondary lyne-mini-btn">Hide</button>' +
      '</div>' +
      '<div class="lyne-panel-actions">' +
      '<button id="lyne-start" class="btn btn-primary lyne-mini-btn" type="button">Start</button>' +
      '<button id="lyne-stop" class="btn btn-secondary lyne-mini-btn" type="button">Stop</button>' +
      '</div>' +
      '<p id="lyne-meta">Idle.</p>' +
      '<pre id="lyne-chat">' + DEFAULT_CHAT + '</pre>' +
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
      return 'Open the Science Library at study-library.html.'
    }
    if (q.indexOf('geography') !== -1 && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Open the Geography Library at geography-library.html.'
    }
    if ((q.indexOf('grade 10') !== -1 || q.indexOf('math 10') !== -1) && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Open Grade 10 Math at grade-10-math.html.'
    }
    if ((q.indexOf('grade 9') !== -1 || q.indexOf('math 9') !== -1) && (q.indexOf('where') !== -1 || q.indexOf('open') !== -1 || q.indexOf('go') !== -1)) {
      return 'Open Grade 9 Math at math/index.html.'
    }
    if (q.indexOf('anki') !== -1 || q.indexOf('cards') !== -1 || q.indexOf('flashcards') !== -1) {
      return 'Open concept cards at anki/index.html.'
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

  function init() {
    ensureStyles()
    var widget = ensureWidgetMarkup()
    var orbToggle = document.getElementById('lyne-orb-toggle')
    var panel = document.getElementById('lyne-panel')
    var panelClose = document.getElementById('lyne-panel-close')
    var startBtn = document.getElementById('lyne-start')
    var stopBtn = document.getElementById('lyne-stop')
    var meta = document.getElementById('lyne-meta')
    var chat = document.getElementById('lyne-chat')
    var dragHandle = panel.querySelector('[data-lyne-drag-handle]')
    if (!widget || !orbToggle || !panel || !panelClose || !startBtn || !stopBtn || !meta || !chat) return

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    var canListen = typeof SpeechRecognition === 'function'
    var canSpeak = !!window.speechSynthesis
    var recognition = null
    var active = false
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
    var preferredVoice = null
    var didDrag = false

    function setPanelOpen(next) {
      var open = !!next
      panel.classList.toggle('open', open)
      panel.setAttribute('aria-hidden', open ? 'false' : 'true')
      orbToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      widget.setAttribute('data-panel-open', open ? 'true' : 'false')
      writeText(PANEL_OPEN_KEY, open ? '1' : '0')
    }

    function setSpeakingVisual(next) {
      widget.classList.toggle('lyne-speaking', !!next)
    }

    function currentPath() {
      var path = String(location.pathname || '/index.html')
      return path === '/' ? '/index.html' : path
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
      if (currentPath() !== spec.path) {
        location.href = spec.path + '#lyne-guide'
        return true
      }
      return activateGuideTarget(targetId)
    }

    function resumePendingGuide() {
      var pending = readJson(GUIDE_KEY, null)
      if (!pending || !pending.id) return
      if (pending.at && Date.now() - Number(pending.at) > 180000) {
        clearGuide()
        return
      }
      var spec = GUIDE_TARGETS[pending.id]
      if (!spec || currentPath() !== spec.path) return
      setTimeout(function () {
        activateGuideTarget(pending.id)
      }, 450)
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
          ignoreMicUntil = Date.now() + 1800
          await new Promise(function (resolve) {
            audio.onended = function () {
              try { URL.revokeObjectURL(url) } catch (_err3) {}
              speaking = false
              lyneAudio = null
              setSpeakingVisual(false)
              meta.textContent = active ? 'Listening...' : 'Idle.'
              resolve()
            }
            audio.onerror = function () {
              try { URL.revokeObjectURL(url) } catch (_err4) {}
              speaking = false
              lyneAudio = null
              setSpeakingVisual(false)
              resolve()
            }
            audio.play().catch(function () {
              try { URL.revokeObjectURL(url) } catch (_err5) {}
              speaking = false
              lyneAudio = null
              setSpeakingVisual(false)
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
      ignoreMicUntil = Date.now() + 1800
      await new Promise(function (resolve) {
        utterance.onend = function () {
          speaking = false
          setSpeakingVisual(false)
          meta.textContent = active ? 'Listening...' : 'Idle.'
          resolve()
        }
        utterance.onerror = function () {
          speaking = false
          setSpeakingVisual(false)
          meta.textContent = active ? 'Listening...' : 'Idle.'
          resolve()
        }
        window.speechSynthesis.speak(utterance)
      })
    }

    async function askLyne(prompt) {
      var question = String(prompt || '').trim()
      if (!question || waiting) return
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
        if (guideTarget) {
          meta.textContent = 'Starting guide...'
          setTimeout(function () {
            startGuide(guideTarget)
          }, 180)
        }
        await speak(reply)
      } catch (_err) {
        var fallback = localFallbackReply(question)
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
      setPanelOpen(!panel.classList.contains('open'))
    })
    panelClose.addEventListener('click', function () {
      setPanelOpen(false)
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

    stopBtn.addEventListener('click', function () {
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
      meta.textContent = 'Conversation stopped.'
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
        }
      }
    } else {
      startBtn.disabled = true
      meta.textContent = 'Voice not supported in this browser.'
    }

    setChat(chat, readText(CHAT_KEY, DEFAULT_CHAT))
    setPanelOpen(readText(PANEL_OPEN_KEY, '0') === '1')
    applyPosition(widget, readJson(POSITION_KEY, { x: window.innerWidth - 66, y: window.innerHeight - 66 }))
    window.addEventListener('resize', function () {
      applyPosition(widget, readJson(POSITION_KEY, { x: window.innerWidth - 66, y: window.innerHeight - 66 }))
    })
    resumePendingGuide()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
