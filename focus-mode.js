(function () {
  var FOCUS_ENABLED_KEY = 'sc_focus_mode_enabled_v1'
  var FOCUS_DISMISSED_KEY = 'sc_focus_mode_dismissed_v1'
  var APP_SOUND_KEY = 'sc_app_sound_enabled_v1'
  var FOCUS_SESSION_KEY = 'sc_focus_mode_session_v1'
  var MEDIAPIPE_SCRIPT_URLS = [
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14',
    'https://unpkg.com/@mediapipe/tasks-vision@0.10.14'
  ]
  var MEDIAPIPE_WASM_URLS = [
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm',
    'https://unpkg.com/@mediapipe/tasks-vision@0.10.14/wasm'
  ]
  var MEDIAPIPE_MODEL_URLS = [
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
  ]
  var ATTENTION_WARN_MS = 9000
  var ATTENTION_STRONG_MS = 22000
  var FALLBACK_IDLE_WARN_MS = 12000
  var FACE_MISSING_CONFIRM_FRAMES = 4
  var STARTUP_GRACE_MS = 8000
  var ATTENTIVE_CONFIRM_FRAMES = 6
  var AWAY_CONFIRM_FRAMES = 12
  var FACE_LOCK_CONFIRM_FRAMES = 12
  var DEFAULT_SESSION_MS = 25 * 60 * 1000
  var lastAttentiveAt = 0
  var warningLevel = 0
  var faceLandmarker = null
  var running = false
  var lastVideoTime = -1
  var lastFrameAt = 0
  var videoEl = null
  var streamRef = null
  var frameCounter = 0
  var alertTimer = 0
  var sessionTimer = 0
  var audioCtx = null
  var audioUnlocked = false
  var latestAttention = { attentive: true, reason: 'Focus Mode is ready.' }
  var focusSession = null
  var trackingGraceUntil = 0
  var hasFaceLock = false
  var attentionState = 'idle'
  var attentiveFrameStreak = 0
  var awayFrameStreak = 0
  var previewOpen = false
  var trackingArmed = false
  var trackingArmStartedAt = 0
  var postArmGraceUntil = 0
  var faceLockFrameStreak = 0
  var warningEligibleAt = 0
  var recoveryInFlight = false
  var previewStarting = false
  var modelReady = false
  var modelStatus = 'idle'
  var lastInteractionAt = Date.now()
  var fallbackProbeCanvas = null
  var fallbackProbeCtx = null
  var fallbackDarkFrameStreak = 0
  var SCRIPT_BASE_URL =
    document.currentScript && document.currentScript.src
      ? new URL('.', document.currentScript.src).href
      : new URL('.', location.href).href
  var LOCAL_MEDIAPIPE_BUNDLE_URLS = [
    new URL('vendor/mediapipe/vision_bundle.js', SCRIPT_BASE_URL).href,
    new URL('vendor/mediapipe/vision_bundle.mjs', SCRIPT_BASE_URL).href
  ]
  var LOCAL_MEDIAPIPE_WASM_URL = new URL('vendor/mediapipe', SCRIPT_BASE_URL).href.replace(/\/$/, '')
  var LOCAL_MEDIAPIPE_MODEL_URL = new URL('vendor/mediapipe/face_landmarker.task', SCRIPT_BASE_URL).href

  function getPageName() {
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase()
  }

  function shouldMount() {
    return getPageName() !== 'offline.html'
  }

  function isStartupBlocking() {
    var overlay = document.querySelector('[data-startup-overlay]')
    if (!overlay) return false
    if (document.body && document.body.classList.contains('startup-ready')) return false
    return !overlay.classList.contains('is-leaving')
  }

  function injectStyles() {
    if (document.getElementById('sc-focus-mode-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-focus-mode-styles'
    style.textContent =
      '.focus-mode-dock{position:fixed;right:max(14px,env(safe-area-inset-right));top:max(88px,calc(env(safe-area-inset-top) + 72px));z-index:10030;display:grid;gap:8px;width:min(268px,78vw);transition:width .22s ease}' +
      '.focus-mode-shell{display:grid;gap:8px;justify-items:end}' +
      '.focus-mode-bar{position:relative;display:grid;gap:7px;padding:9px 34px 9px 10px;border-radius:22px;border:1px solid rgba(255,255,255,.42);background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.16));box-shadow:0 18px 38px rgba(12,18,14,.12),inset 0 1px 0 rgba(255,255,255,.45);backdrop-filter:blur(18px) saturate(150%)}' +
      '.focus-mode-topline{display:flex;align-items:center;gap:8px}' +
      '.focus-mode-actions{display:flex;align-items:center;gap:6px;flex-wrap:wrap}' +
      '.focus-mode-session{display:flex;align-items:center;gap:6px;flex-wrap:wrap}' +
      '.focus-mode-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border-radius:999px;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.26);color:rgba(15,29,23,.74);font:800 .61rem/1 Manrope,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}' +
      '.focus-mode-chip.is-on{background:rgba(34,161,93,.12);color:#175739;border-color:rgba(34,161,93,.24)}' +
      '.focus-mode-chip.is-alert{background:rgba(209,154,45,.14);color:#8a5a09;border-color:rgba(209,154,45,.24)}' +
      '.focus-mode-chip.is-complete{background:rgba(41,121,255,.12);color:#184a9d;border-color:rgba(41,121,255,.2)}' +
      '.focus-mode-timer{display:inline-flex;align-items:center;justify-content:center;padding:6px 10px;border-radius:999px;background:rgba(17,27,22,.84);color:#fff;border:1px solid rgba(17,27,22,.72);font:900 .7rem/1 Manrope,system-ui,sans-serif;letter-spacing:.06em;min-width:78px}' +
      '.focus-mode-indicator{width:10px;height:10px;border-radius:999px;background:#c63b32;box-shadow:0 0 0 4px rgba(198,59,50,.12),0 0 16px rgba(198,59,50,.22)}' +
      '.focus-mode-indicator.is-on{background:#22a15d;box-shadow:0 0 0 4px rgba(34,161,93,.12),0 0 16px rgba(34,161,93,.24)}' +
      '.focus-mode-indicator.is-alert{background:#d19a2d;box-shadow:0 0 0 4px rgba(209,154,45,.14),0 0 16px rgba(209,154,45,.24)}' +
      '.focus-mode-summary{min-width:0;display:grid;gap:1px;flex:1}' +
      '.focus-mode-title{color:#112019;font:800 .64rem/1.1 Manrope,system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase}' +
      '.focus-mode-status{color:rgba(17,32,25,.62);font:600 .69rem/1.2 Manrope,system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.focus-mode-toggle,.focus-mode-icon{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:7px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.42);background:rgba(255,255,255,.24);color:#0f1d17;font:800 .65rem/1 Manrope,system-ui,sans-serif;cursor:pointer;min-height:31px;backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,.34)}' +
      '.focus-mode-toggle.is-on{background:linear-gradient(180deg,rgba(23,82,58,.92),rgba(18,63,45,.88));color:#fff;border-color:rgba(23,82,58,.72)}' +
      '.focus-mode-icon.is-active{background:rgba(17,27,22,.86);color:#fff;border-color:rgba(17,27,22,.72)}' +
      '.focus-mode-collapse-side{position:absolute;top:8px;right:8px;padding:0;width:22px;min-width:22px;min-height:22px;height:22px;border-radius:999px;font-size:.82rem;line-height:1;background:rgba(17,27,22,.74);color:#fff;border:1px solid rgba(17,27,22,.38)}' +
      '.focus-mode-shell:not(.is-info-open) .focus-mode-note{display:none}' +
      '.focus-mode-shell.is-collapsed .focus-mode-note,.focus-mode-shell.is-collapsed .focus-mode-summary,.focus-mode-shell.is-collapsed .focus-mode-chip,.focus-mode-shell.is-collapsed .focus-mode-info,.focus-mode-shell.is-collapsed .focus-mode-timer,.focus-mode-shell.is-collapsed .focus-mode-session{display:none}' +
      '.focus-mode-shell.is-collapsed .focus-mode-bar{width:58px;min-height:108px;padding:8px 6px;border-radius:18px;gap:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(255,255,255,.38),rgba(239,247,243,.22));box-shadow:0 14px 28px rgba(12,18,14,.12),inset 0 1px 0 rgba(255,255,255,.45)}' +
      '.focus-mode-shell.is-collapsed .focus-mode-topline{width:100%;justify-content:center;align-items:center}' +
      '.focus-mode-shell.is-collapsed .focus-mode-actions{width:100%;justify-content:center;align-items:center}' +
      '.focus-mode-shell.is-collapsed [data-focus-mode-toggle]{display:inline-flex;width:42px;min-width:42px;min-height:24px;height:24px;padding:0;border-radius:999px;font-size:.52rem;letter-spacing:.05em;justify-content:center}' +
      '.focus-mode-shell.is-collapsed [data-focus-mode-preview-toggle]{display:none}' +
      '.focus-mode-shell.is-collapsed .focus-mode-collapse-side{position:static;padding:0;width:22px;min-width:22px;min-height:22px;height:22px;border-radius:999px;font-size:.82rem;line-height:1;background:rgba(17,27,22,.74);color:#fff;border-color:rgba(17,27,22,.38)}' +
      '.focus-mode-note{margin:0;padding:10px 11px;border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.18));border:1px solid rgba(255,255,255,.34);box-shadow:0 18px 34px rgba(18,24,20,.1),inset 0 1px 0 rgba(255,255,255,.35);color:rgba(19,28,22,.78);font-size:.69rem;line-height:1.45;backdrop-filter:blur(18px) saturate(140%)}' +
      '.focus-mode-note strong{display:block;margin-bottom:4px;color:#0f1d17;font-size:.72rem;letter-spacing:.04em;text-transform:uppercase}' +
      '.focus-mode-meta{display:block;margin-top:6px;color:#215c4b;font-size:.64rem;font-weight:800;letter-spacing:.01em}' +
      '.focus-mode-stats{display:block;margin-top:4px;color:rgba(17,32,25,.68);font-size:.62rem;font-weight:700;letter-spacing:.01em}' +
      '.focus-mode-preview{display:none;margin-top:8px;border-radius:14px;overflow:hidden;border:1px solid rgba(17,27,22,.12);background:rgba(255,255,255,.72)}' +
      '.focus-mode-preview.is-open{display:block}' +
      '.focus-mode-preview video{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;transform:scaleX(-1);background:#0f172a}' +
      '.focus-mode-debug{display:block;padding:8px 10px;color:#183227;font:700 .63rem/1.4 Manrope,system-ui,sans-serif}' +
      '.focus-mode-alert{position:fixed;right:max(14px,env(safe-area-inset-right));top:calc(max(88px,calc(env(safe-area-inset-top) + 72px)) + 72px);z-index:10031;max-width:min(248px,74vw);padding:10px 12px;border-radius:16px;background:linear-gradient(180deg,rgba(18,21,25,.94),rgba(25,29,34,.9));color:#fff;box-shadow:0 16px 32px rgba(8,10,14,.22);border:1px solid rgba(255,255,255,.08);opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .22s ease,transform .22s ease;backdrop-filter:blur(14px) saturate(140%)}' +
      '.focus-mode-alert.show{opacity:1;transform:translateY(0)}' +
      '.focus-mode-alert strong{display:block;margin-bottom:4px;font-size:.78rem;letter-spacing:.04em;text-transform:uppercase}' +
      '.focus-mode-alert p{margin:0;color:rgba(255,255,255,.82);font-size:.72rem;line-height:1.38}' +
      '.focus-mode-alert.is-strong{background:linear-gradient(135deg,rgba(27,27,31,.96),rgba(145,52,29,.94))}' +
        'body.startup-active .focus-mode-dock,body.startup-active .focus-mode-alert,body.auth-modal-open .focus-mode-dock,body.auth-modal-open .focus-mode-alert{opacity:0;pointer-events:none}' +
      '.focus-mode-video{position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px}' +
      'body.focus-warning .site-wrap{animation:focusPulse .55s ease}' +
      '@keyframes focusPulse{0%{transform:scale(1)}35%{transform:scale(.997)}100%{transform:scale(1)}}' +
      '@media (prefers-reduced-motion:reduce){.focus-mode-alert,body.focus-warning .site-wrap{transition:none;animation:none}}' +
      '@media (max-width:680px){.focus-mode-dock{right:max(10px,env(safe-area-inset-right));top:max(74px,calc(env(safe-area-inset-top) + 58px));width:min(234px,calc(100vw - 20px))}.focus-mode-bar{gap:6px;padding:8px 30px 8px 8px}.focus-mode-title{font-size:.61rem}.focus-mode-status{font-size:.63rem}.focus-mode-chip{font-size:.58rem;padding:5px 7px}.focus-mode-actions,.focus-mode-session{gap:5px}.focus-mode-toggle,.focus-mode-icon{min-height:29px;padding:6px 9px;font-size:.62rem}.focus-mode-timer{min-width:70px;font-size:.65rem;padding:6px 8px}.focus-mode-note{font-size:.66rem;padding:8px 9px}.focus-mode-debug{font-size:.6rem;padding:7px 8px}.focus-mode-alert{right:10px;left:auto;top:calc(max(74px,calc(env(safe-area-inset-top) + 58px)) + 58px);max-width:min(220px,calc(100vw - 20px));padding:9px 11px}.focus-mode-collapse-side{top:7px;right:7px;width:20px;min-width:20px;height:20px;min-height:20px;font-size:.76rem}.focus-mode-shell.is-collapsed .focus-mode-bar{width:48px;min-height:94px;padding:7px 5px;align-items:center;justify-content:center}.focus-mode-shell.is-collapsed [data-focus-mode-toggle]{width:34px;min-width:34px;min-height:22px;height:22px;font-size:.5rem}}'
    document.head.appendChild(style)
  }

  function readFlag(key) {
    try {
      return localStorage.getItem(key) === '1'
    } catch (_err) {
      return false
    }
  }

  function writeFlag(key, value) {
    try {
      localStorage.setItem(key, value ? '1' : '0')
    } catch (_err) {}
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

  function hasStoredValue(key) {
    try {
      return localStorage.getItem(key) !== null
    } catch (_err) {
      return false
    }
  }

  function ensureUi() {
    injectStyles()
    var dock = document.querySelector('[data-focus-mode-dock]')
    if (!dock) {
      dock = document.createElement('div')
      dock.className = 'focus-mode-dock'
      dock.setAttribute('data-focus-mode-dock', '1')
      dock.innerHTML =
        '<div class="focus-mode-shell" data-focus-mode-shell>' +
        '<div class="focus-mode-bar">' +
        '<div class="focus-mode-topline">' +
        '<span class="focus-mode-indicator" data-focus-mode-indicator aria-hidden="true"></span>' +
        '<span class="focus-mode-summary"><strong class="focus-mode-title">Focus Mode</strong><span class="focus-mode-status" data-focus-mode-status>Camera idle.</span></span>' +
        '</div>' +
        '<div class="focus-mode-actions">' +
        '<span class="focus-mode-chip" data-focus-mode-chip>Idle</span>' +
        '<button class="focus-mode-toggle" type="button" data-focus-mode-toggle>Activate</button>' +
        '<button class="focus-mode-icon focus-mode-info" type="button" data-focus-mode-info aria-expanded="false" aria-controls="focus-mode-note">Info</button>' +
        '<button class="focus-mode-icon" type="button" data-focus-mode-preview-toggle aria-expanded="false">Test</button>' +
        '</div>' +
        '<div class="focus-mode-session">' +
        '<span class="focus-mode-timer" data-focus-mode-timer>25:00</span>' +
        '</div>' +
        '<button class="focus-mode-icon focus-mode-collapse-side" type="button" data-focus-mode-collapse aria-label="Collapse focus mode" title="Collapse focus mode" aria-expanded="true">&lsaquo;</button>' +
        '</div>' +
        '<p class="focus-mode-note" id="focus-mode-note" data-focus-mode-note><strong>Anti-Procrastination Mode</strong>Use your camera on-device to detect when you look away, turn away, or leave the tab for too long and nudge you back into your study flow.<span class="focus-mode-meta" data-focus-mode-meta>Camera off. Nothing is being tracked.</span><span class="focus-mode-stats" data-focus-mode-stats>No active session.</span><span class="focus-mode-preview" data-focus-mode-preview><video data-focus-mode-preview-video playsinline muted></video><span class="focus-mode-debug" data-focus-mode-debug>Camera preview off.</span></span></p>' +
        '</div>'
      document.body.appendChild(dock)
    }

    var alert = document.querySelector('[data-focus-mode-alert]')
    if (!alert) {
      alert = document.createElement('div')
      alert.className = 'focus-mode-alert'
      alert.setAttribute('data-focus-mode-alert', '1')
      alert.innerHTML = '<strong>Focus check</strong><p>Bring your attention back to the page.</p>'
      document.body.appendChild(alert)
    }

    return { dock: dock, alert: alert }
  }

  function setStatusText(text) {
    var status = document.querySelector('[data-focus-mode-meta]')
    var compact = document.querySelector('[data-focus-mode-status]')
    if (!status) return
    var message = String(text || '').trim()
    status.textContent = message
    if (compact) compact.textContent = message
  }

  function setIndicatorState(mode) {
    var indicator = document.querySelector('[data-focus-mode-indicator]')
    var chip = document.querySelector('[data-focus-mode-chip]')
    if (!indicator) return
    indicator.classList.toggle('is-on', mode === 'on')
    indicator.classList.toggle('is-alert', mode === 'alert')
    if (chip) {
      chip.classList.toggle('is-on', mode === 'on')
      chip.classList.toggle('is-alert', mode === 'alert')
      chip.classList.toggle('is-complete', mode === 'complete')
      chip.textContent = mode === 'complete' ? 'Complete' : mode === 'alert' ? 'Alert' : mode === 'on' ? 'Tracking' : 'Idle'
    }
  }

  function setCollapsedState(collapsed) {
    var shell = document.querySelector('[data-focus-mode-shell]')
    var button = document.querySelector('[data-focus-mode-collapse]')
    var toggleButton = document.querySelector('[data-focus-mode-toggle]')
    var previewButton = document.querySelector('[data-focus-mode-preview-toggle]')
    if (!shell || !button) return
    shell.classList.toggle('is-collapsed', collapsed)
    if (toggleButton) {
      toggleButton.textContent = collapsed ? 'Open' : readFlag(FOCUS_ENABLED_KEY) ? 'End' : 'Activate'
      toggleButton.setAttribute('aria-label', collapsed ? 'Open focus mode' : toggleButton.textContent + ' focus mode')
      toggleButton.setAttribute('title', collapsed ? 'Open focus mode' : toggleButton.textContent + ' focus mode')
    }
    if (previewButton) {
      previewButton.textContent = 'Test'
      previewButton.setAttribute('aria-label', 'Test camera preview')
      previewButton.setAttribute('title', 'Test camera preview')
    }
    if (collapsed) {
      shell.classList.remove('is-info-open')
      var infoButton = document.querySelector('[data-focus-mode-info]')
      if (infoButton) {
        infoButton.textContent = 'Info'
        infoButton.setAttribute('aria-expanded', 'false')
        infoButton.classList.remove('is-active')
      }
    }
    button.innerHTML = collapsed ? '&rsaquo;' : '&lsaquo;'
    button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
    button.setAttribute('aria-label', collapsed ? 'Expand focus mode' : 'Collapse focus mode')
    button.setAttribute('title', collapsed ? 'Expand focus mode' : 'Collapse focus mode')
    button.classList.toggle('is-active', collapsed)
    syncPreview()
  }

  function setStatsText(text) {
    var stats = document.querySelector('[data-focus-mode-stats]')
    if (!stats) return
    stats.textContent = String(text || '').trim()
  }

  function setTimerText(text) {
    var timer = document.querySelector('[data-focus-mode-timer]')
    if (!timer) return
    timer.textContent = String(text || '25:00')
  }

  function setDebugText(text) {
    var debug = document.querySelector('[data-focus-mode-debug]')
    if (!debug) return
    debug.textContent = String(text || '').trim()
  }

  function isStreamLive() {
    return !!(
      streamRef &&
      typeof streamRef.getVideoTracks === 'function' &&
      streamRef.getVideoTracks().some(function (track) {
        return track && track.readyState === 'live' && track.enabled !== false
      })
    )
  }

  async function recoverCameraStream() {
    if (recoveryInFlight || !running) return false
    recoveryInFlight = true
    try {
      if (streamRef) {
        try {
          streamRef.getTracks().forEach(function (track) { track.stop() })
        } catch (_errStop) {}
        streamRef = null
      }
      if (!videoEl) {
        videoEl = document.createElement('video')
        videoEl.className = 'focus-mode-video'
        videoEl.setAttribute('playsinline', '')
        videoEl.setAttribute('muted', '')
        videoEl.muted = true
        document.body.appendChild(videoEl)
      }
      streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      videoEl.srcObject = streamRef
      await videoEl.play()
      resetTrackingState()
      latestAttention.reason = 'Camera recovered. Recalibrating focus...'
      setStatusText(latestAttention.reason)
      setDebugText(getDebugSummary('Current: recovering stream'))
      syncPreview()
      return true
    } catch (_err) {
      setStatusText('Camera stream dropped. Re-open focus mode to retry.')
      setDebugText(getDebugSummary('Current: recovery failed'))
      return false
    } finally {
      recoveryInFlight = false
    }
  }

  function getDebugSummary(extra) {
    var streamState = isStreamLive() ? 'live' : streamRef ? 'inactive' : 'none'
    var videoState = videoEl ? (videoEl.readyState || 0) + '/' + String(Number(videoEl.currentTime || 0).toFixed(2)) : 'none'
    return (
      'State: ' +
      attentionState +
      ' | Face lock: ' +
      (hasFaceLock ? 'yes' : 'no') +
      ' | Armed: ' +
      (trackingArmed ? 'yes' : 'no') +
      ' | Grace: ' +
      (postArmGraceUntil > Date.now() ? 'yes' : 'no') +
      ' | Model: ' +
      modelStatus +
      ' | Stream: ' +
      streamState +
      ' | Video: ' +
      videoState +
      (extra ? ' | ' + extra : '')
    )
  }

  function syncPreview() {
    var shell = document.querySelector('[data-focus-mode-shell]')
    var preview = document.querySelector('[data-focus-mode-preview]')
    var toggleButton = document.querySelector('[data-focus-mode-toggle]')
    var toggle = document.querySelector('[data-focus-mode-preview-toggle]')
    var previewVideo = document.querySelector('[data-focus-mode-preview-video]')
    if (!preview || !toggle || !shell) return
    var open = !!previewOpen && shell && !shell.classList.contains('is-collapsed')
    preview.classList.toggle('is-open', open)
    toggle.classList.toggle('is-active', open)
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    toggle.textContent = 'Test'
    toggle.setAttribute('aria-label', 'Test camera preview')
    toggle.setAttribute('title', 'Test camera preview')
    if (toggleButton) {
      if (shell.classList.contains('is-collapsed')) {
        toggleButton.textContent = 'Open'
        toggleButton.setAttribute('aria-label', 'Open focus mode')
        toggleButton.setAttribute('title', 'Open focus mode')
      } else {
        toggleButton.textContent = readFlag(FOCUS_ENABLED_KEY) ? 'End' : 'Activate'
        toggleButton.setAttribute('aria-label', toggleButton.textContent + ' focus mode')
        toggleButton.setAttribute('title', toggleButton.textContent + ' focus mode')
      }
    }
    if (previewVideo) {
      previewVideo.srcObject = open && videoEl && streamRef ? streamRef : null
      if (open && previewVideo.srcObject) {
        previewVideo.muted = true
        var playResult = previewVideo.play()
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {})
        }
      } else {
        try { previewVideo.pause() } catch (_err) {}
      }
    }
  }

  function resetTrackingState() {
    lastVideoTime = -1
    frameCounter = 0
    lastFrameAt = performance.now()
    lastAttentiveAt = Date.now()
    lastInteractionAt = Date.now()
    trackingGraceUntil = Date.now() + STARTUP_GRACE_MS
    hasFaceLock = false
    attentionState = 'idle'
    attentiveFrameStreak = 0
    awayFrameStreak = 0
    trackingArmed = false
    trackingArmStartedAt = 0
    postArmGraceUntil = 0
    faceLockFrameStreak = 0
    warningEligibleAt = 0
    recoveryInFlight = false
    fallbackDarkFrameStreak = 0
    warningLevel = 0
    latestAttention = { attentive: true, faceVisible: false, faceReliable: false, reason: 'Camera active. Checking attention...' }
    clearLyneReturnPrompt()
    setIndicatorState('on')
    setStatusText(latestAttention.reason)
    setDebugText(getDebugSummary('Current: preview live'))
  }

  function markInteraction() {
    lastInteractionAt = Date.now()
  }

  function getFallbackFrameState() {
    if (!videoEl || videoEl.readyState < 2 || !videoEl.videoWidth || !videoEl.videoHeight) {
      return null
    }
    if (!fallbackProbeCanvas) {
      fallbackProbeCanvas = document.createElement('canvas')
      fallbackProbeCanvas.width = 24
      fallbackProbeCanvas.height = 18
      fallbackProbeCtx = fallbackProbeCanvas.getContext('2d', { willReadFrequently: true })
    }
    if (!fallbackProbeCtx) return null
    fallbackProbeCtx.drawImage(videoEl, 0, 0, fallbackProbeCanvas.width, fallbackProbeCanvas.height)
    var pixels = fallbackProbeCtx.getImageData(0, 0, fallbackProbeCanvas.width, fallbackProbeCanvas.height).data
    var brightnessTotal = 0
    var minBrightness = 255
    var maxBrightness = 0
    for (var i = 0; i < pixels.length; i += 4) {
      var pixelBrightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
      brightnessTotal += pixelBrightness
      if (pixelBrightness < minBrightness) minBrightness = pixelBrightness
      if (pixelBrightness > maxBrightness) maxBrightness = pixelBrightness
    }
    var averageBrightness = brightnessTotal / (pixels.length / 4)
    var brightnessRange = maxBrightness - minBrightness
    var looksCovered = averageBrightness < 42 || brightnessRange < 18
    if (looksCovered) {
      fallbackDarkFrameStreak += 1
    } else {
      fallbackDarkFrameStreak = 0
    }
    return {
      averageBrightness: averageBrightness,
      brightnessRange: brightnessRange,
      covered: fallbackDarkFrameStreak >= 4
    }
  }

  function getFallbackAttentionState(frameState) {
    if (document.hidden) {
      return { attentive: false, faceVisible: true, faceReliable: false, reason: 'Tab hidden.' }
    }
    if (frameState && frameState.covered) {
      return { attentive: false, faceVisible: false, faceReliable: false, reason: 'Camera covered or very dark.' }
    }
    var idleFor = Date.now() - lastInteractionAt
    if (idleFor >= FALLBACK_IDLE_WARN_MS) {
      return { attentive: false, faceVisible: true, faceReliable: false, reason: 'No study activity detected.' }
    }
    return { attentive: true, faceVisible: true, faceReliable: false, reason: 'Camera-only focus mode active.' }
  }

  function enterFallbackTrackingMode(reason) {
    running = true
    modelReady = false
    modelStatus = 'fallback'
    resetTrackingState()
    hasFaceLock = true
    trackingArmed = true
    trackingGraceUntil = Date.now() + 2000
    postArmGraceUntil = Date.now() + 4000
    warningEligibleAt = Date.now() + 6000
    latestAttention = {
      attentive: true,
      faceVisible: true,
      faceReliable: false,
      reason: reason || 'Camera-only focus mode active.'
    }
    setIndicatorState('on')
    setStatusText(latestAttention.reason)
    setDebugText(getDebugSummary('Current: camera-only fallback'))
    playCue('start')
    startSession()
    requestAnimationFrame(trackFrame)
    return true
  }

  function formatClock(ms) {
    var totalSeconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000))
    var minutes = Math.floor(totalSeconds / 60)
    var seconds = totalSeconds % 60
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0')
  }

  function formatMinutes(ms) {
    var minutes = Math.max(0, Math.round((Number(ms) || 0) / 60000))
    return minutes + 'm'
  }

  function createSession() {
    return {
      active: false,
      targetMs: DEFAULT_SESSION_MS,
      focusedMs: 0,
      breakCount: 0,
      warningCount: 0,
      lastAttentionState: 'attentive',
      completed: false,
      page: getPageName(),
      startedAt: 0,
      endsAt: 0,
      completedAt: 0,
    }
  }

  function ensureSessionState() {
    if (!focusSession) {
      focusSession = readJson(FOCUS_SESSION_KEY, null) || createSession()
    }
    return focusSession
  }

  function persistSession() {
    writeJson(FOCUS_SESSION_KEY, ensureSessionState())
  }

  function updateSessionUi() {
    var session = ensureSessionState()
    var remaining = session.active && session.endsAt ? Math.max(0, session.endsAt - Date.now()) : Math.max(0, session.targetMs - session.focusedMs)
    setTimerText(formatClock(remaining))
    if (session.completed) {
      setStatsText('Completed ' + formatMinutes(session.focusedMs) + ' focused. Breaks: ' + session.breakCount + '.')
      return
    }
    if (session.active) {
      setStatsText('Focused ' + formatMinutes(session.focusedMs) + ' of ' + formatMinutes(session.targetMs) + '. Breaks: ' + session.breakCount + '.')
      return
    }
    setStatsText('Ready for a ' + formatMinutes(session.targetMs) + ' session.')
  }

  function stopSessionTimer() {
    if (sessionTimer) {
      window.clearInterval(sessionTimer)
      sessionTimer = 0
    }
  }

  function startSessionTimer() {
    stopSessionTimer()
    sessionTimer = window.setInterval(function () {
      var session = ensureSessionState()
      if (session.active && session.endsAt && Date.now() >= session.endsAt) {
        session.focusedMs = Math.min(session.targetMs, Math.max(session.focusedMs, session.targetMs))
        persistSession()
        completeSession()
        return
      }
      updateSessionUi()
    }, 1000)
  }

  function completeSession() {
    var session = ensureSessionState()
    session.active = false
    session.completed = true
    session.completedAt = Date.now()
    persistSession()
    stopSessionTimer()
    writeFlag(FOCUS_ENABLED_KEY, false)
    running = false
    if (streamRef) {
      streamRef.getTracks().forEach(function (track) { track.stop() })
      streamRef = null
    }
    if (videoEl) {
      videoEl.remove()
      videoEl = null
    }
    if (faceLandmarker && typeof faceLandmarker.close === 'function') {
      faceLandmarker.close()
      faceLandmarker = null
    }
    setToggleState(false)
    setIndicatorState('complete')
    setStatsText('Session complete. Focused ' + formatMinutes(session.focusedMs) + '. Breaks: ' + session.breakCount + '.')
    setStatusText('Session complete. Camera off.')
    showAlert(2)
  }

  function startSession() {
    focusSession = createSession()
    var session = focusSession
    session.active = true
    session.completed = false
    session.page = getPageName()
    session.startedAt = Date.now()
    session.endsAt = Date.now() + session.targetMs
    session.lastAttentionState = 'attentive'
    persistSession()
    startSessionTimer()
    updateSessionUi()
  }

  function stopSession(reset) {
    var session = ensureSessionState()
    session.active = false
    if (reset) {
      focusSession = createSession()
      session = focusSession
    }
    session.endsAt = 0
    persistSession()
    stopSessionTimer()
    updateSessionUi()
  }

  function setInfoOpenState(open) {
    var shell = document.querySelector('[data-focus-mode-shell]')
    var button = document.querySelector('[data-focus-mode-info]')
    if (!shell || !button) return
    var next = !!open
    if (shell.classList.contains('is-collapsed') && next) {
      shell.classList.remove('is-collapsed')
      var collapseButton = document.querySelector('[data-focus-mode-collapse]')
      if (collapseButton) {
        collapseButton.innerHTML = '&lsaquo;'
        collapseButton.setAttribute('aria-expanded', 'true')
        collapseButton.setAttribute('aria-label', 'Collapse focus mode')
        collapseButton.setAttribute('title', 'Collapse focus mode')
        collapseButton.classList.remove('is-active')
      }
    }
    shell.classList.toggle('is-info-open', next)
    button.textContent = next ? 'Hide' : 'Info'
    button.setAttribute('aria-expanded', next ? 'true' : 'false')
    button.classList.toggle('is-active', next)
    syncPreview()
  }

  function shouldPlaySound() {
    if (window.SoulAudio && typeof window.SoulAudio.isEnabled === 'function') {
      return window.SoulAudio.isEnabled()
    }
    if (readFlag(APP_SOUND_KEY) === false && hasStoredValue(APP_SOUND_KEY)) {
      return false
    }
    return readFlag(APP_SOUND_KEY) || !hasStoredValue(APP_SOUND_KEY)
  }

  function unlockAudio() {
    var AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) return null
    if (!audioCtx) audioCtx = new AudioCtor()
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {})
    }
    audioUnlocked = true
    return audioCtx
  }

  function playTone(config) {
    if (!shouldPlaySound()) return
    var ctx = unlockAudio()
    if (!ctx) return
    var now = ctx.currentTime
    var oscillator = ctx.createOscillator()
    var gain = ctx.createGain()
    oscillator.type = config.type || 'sine'
    oscillator.frequency.setValueAtTime(config.start, now)
    oscillator.frequency.linearRampToValueAtTime(config.end || config.start, now + (config.duration || 0.18))
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(config.volume || 0.035, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (config.duration || 0.18))
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(now)
    oscillator.stop(now + (config.duration || 0.18) + 0.03)
  }

  function playCue(kind) {
    if (window.SoulAudio && typeof window.SoulAudio.play === 'function') {
      if (kind === 'start') {
        window.SoulAudio.play('startup')
        return
      }
      if (kind === 'stop') {
        window.SoulAudio.play('toggleOff')
        return
      }
      if (kind === 'warn') {
        window.SoulAudio.play('alert')
        return
      }
      if (kind === 'strong') {
        window.SoulAudio.play('alarm')
        return
      }
    }
    if (kind === 'start') {
      playTone({ type: 'sine', start: 520, end: 700, duration: 0.16, volume: 0.028 })
      return
    }
    if (kind === 'stop') {
      playTone({ type: 'sine', start: 420, end: 260, duration: 0.14, volume: 0.022 })
      return
    }
    if (kind === 'warn') {
      playTone({ type: 'triangle', start: 360, end: 300, duration: 0.22, volume: 0.032 })
      return
    }
    if (kind === 'strong') {
      playTone({ type: 'square', start: 280, end: 220, duration: 0.28, volume: 0.04 })
    }
  }

  function setToggleState(enabled) {
    var toggle = document.querySelector('[data-focus-mode-toggle]')
    if (!toggle) return
    toggle.classList.toggle('is-on', enabled)
    toggle.textContent = enabled ? 'End' : 'Activate'
    setIndicatorState(enabled ? 'on' : 'off')
    if (enabled) {
      setStatusText('Camera starting...')
    } else if (videoEl && isStreamLive()) {
      setStatusText('Camera preview live. Tracking is off.')
    } else {
      setStatusText('Camera off. Nothing is being tracked.')
    }
    updateSessionUi()
  }

  function showAlert(level) {
    var alert = document.querySelector('[data-focus-mode-alert]')
    if (!alert) return
    if (isStartupBlocking()) return
    if (alertTimer) {
      window.clearTimeout(alertTimer)
      alertTimer = 0
    }
    alert.classList.add('show')
    alert.classList.toggle('is-strong', level > 1)
    alert.innerHTML =
      level > 1
        ? '<strong>Come back to Soul Concept</strong><p>You have been away for a while. Re-focus and keep your study streak moving.</p>'
        : '<strong>Focus check</strong><p>Eyes back on the page. Stay with this study block.</p>'
    playCue(level > 1 ? 'strong' : 'warn')
    setIndicatorState('alert')
    document.body.classList.add('focus-warning')
    alertTimer = window.setTimeout(function () {
      alert.classList.remove('show')
      alert.classList.remove('is-strong')
      document.body.classList.remove('focus-warning')
      setIndicatorState(readFlag(FOCUS_ENABLED_KEY) ? 'on' : 'off')
      alertTimer = 0
    }, level > 1 ? 3200 : 2200)
  }

  function notifyLyneReturnPrompt(level, reason) {
    try {
      document.dispatchEvent(
        new CustomEvent('sc:lyne-return-prompt', {
          detail: {
            level: level,
            reason: String(reason || '').trim(),
          },
        })
      )
    } catch (_err) {}
  }

  function clearLyneReturnPrompt() {
    try {
      document.dispatchEvent(new CustomEvent('sc:lyne-return-clear'))
    } catch (_err) {}
  }

  async function ensureMediapipe() {
    if (window.FilesetResolver && window.FaceLandmarker) return true
    for (var localIndex = 0; localIndex < LOCAL_MEDIAPIPE_BUNDLE_URLS.length; localIndex++) {
      try {
        var localModule = await import(LOCAL_MEDIAPIPE_BUNDLE_URLS[localIndex])
        if (localModule && localModule.FilesetResolver && localModule.FaceLandmarker) {
          window.FilesetResolver = localModule.FilesetResolver
          window.FaceLandmarker = localModule.FaceLandmarker
          return true
        }
      } catch (_errImport) {}
    }
    for (var blobIndex = 0; blobIndex < LOCAL_MEDIAPIPE_BUNDLE_URLS.length; blobIndex++) {
      try {
        var response = await fetch(LOCAL_MEDIAPIPE_BUNDLE_URLS[blobIndex], { cache: 'no-store' })
        if (!response.ok) continue
        var source = await response.text()
        var blobUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
        try {
          var blobModule = await import(blobUrl)
          if (blobModule && blobModule.FilesetResolver && blobModule.FaceLandmarker) {
            window.FilesetResolver = blobModule.FilesetResolver
            window.FaceLandmarker = blobModule.FaceLandmarker
            return true
          }
        } finally {
          try { URL.revokeObjectURL(blobUrl) } catch (_errRevoke) {}
        }
      } catch (_errBlobImport) {}
    }
    try {
      if (window.FocusVisionBundle && window.FocusVisionBundle.FilesetResolver && window.FocusVisionBundle.FaceLandmarker) {
        window.FilesetResolver = window.FocusVisionBundle.FilesetResolver
        window.FaceLandmarker = window.FocusVisionBundle.FaceLandmarker
        return true
      }
    } catch (_errBundle) {}
    var existing = document.querySelector('script[data-focus-mediapipe="1"]')
    if (existing) {
      return new Promise(function (resolve) {
        if (window.FilesetResolver && window.FaceLandmarker) {
          resolve(true)
          return
        }
        if (existing.getAttribute('data-load-state') === 'error') {
          resolve(false)
          return
        }
        var settled = false
        var timeout = window.setTimeout(function () {
          if (settled) return
          settled = true
          cleanup()
          resolve(!!(window.FilesetResolver && window.FaceLandmarker))
        }, 12000)
        function cleanup() {
          window.clearTimeout(timeout)
          existing.removeEventListener('load', onLoad)
          existing.removeEventListener('error', onError)
        }
        function onLoad() {
          if (settled) return
          settled = true
          cleanup()
          resolve(!!(window.FilesetResolver && window.FaceLandmarker))
        }
        function onError() {
          if (settled) return
          settled = true
          existing.setAttribute('data-load-state', 'error')
          cleanup()
          resolve(false)
        }
        existing.addEventListener('load', onLoad)
        existing.addEventListener('error', onError)
      })
    }
    return new Promise(function (resolve) {
      var index = 0
      function tryNext() {
        if (index >= MEDIAPIPE_SCRIPT_URLS.length) {
          resolve(false)
          return
        }
        var script = document.createElement('script')
        script.src = MEDIAPIPE_SCRIPT_URLS[index]
        index += 1
        script.async = true
        script.defer = true
        script.setAttribute('data-focus-mediapipe', '1')
        script.setAttribute('data-load-state', 'loading')
        script.onload = function () {
          script.setAttribute('data-load-state', 'ready')
          resolve(!!(window.FilesetResolver && window.FaceLandmarker))
        }
        script.onerror = function () {
          script.setAttribute('data-load-state', 'error')
          try { script.remove() } catch (_errRemove) {}
          tryNext()
        }
        document.head.appendChild(script)
      }
      tryNext()
    })
  }

  async function ensureVideo() {
    if (videoEl && isStreamLive()) return videoEl
    if (!videoEl) {
      videoEl = document.createElement('video')
      videoEl.className = 'focus-mode-video'
      videoEl.setAttribute('playsinline', '')
      videoEl.setAttribute('muted', '')
      videoEl.muted = true
      document.body.appendChild(videoEl)
    }
    if (streamRef && !isStreamLive()) {
      try {
        streamRef.getTracks().forEach(function (track) { track.stop() })
      } catch (_errStop) {}
      streamRef = null
    }
    streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    videoEl.srcObject = streamRef
    await videoEl.play()
    syncPreview()
    return videoEl
  }

  async function startPreview() {
    if (previewStarting) return !!(videoEl && isStreamLive())
    if (!canUseCameraTracking()) {
      setStatusText('Camera tracking is not supported on this device.')
      setDebugText(getDebugSummary('Current: camera unsupported'))
      return false
    }
    previewStarting = true
    try {
      await ensureVideo()
      resetTrackingState()
      setStatusText('Camera preview live. Use Activate to begin focus tracking.')
      setDebugText(getDebugSummary('Current: preview ready'))
      return true
    } catch (_errVideo) {
      setStatusText('Camera permission failed or device camera is unavailable.')
      setDebugText(getDebugSummary('Current: preview failed'))
      return false
    } finally {
      previewStarting = false
      syncPreview()
    }
  }

  function stopPreview() {
    if (streamRef) {
      try {
        streamRef.getTracks().forEach(function (track) { track.stop() })
      } catch (_err) {}
      streamRef = null
    }
    if (videoEl) {
      try { videoEl.pause() } catch (_errPause) {}
      try { videoEl.remove() } catch (_errRemove) {}
      videoEl = null
    }
    syncPreview()
  }

  async function createLandmarkerFromCandidates() {
    var lastError = null
    if (window.FilesetResolver && window.FaceLandmarker) {
      try {
        var localVision = await window.FilesetResolver.forVisionTasks(LOCAL_MEDIAPIPE_WASM_URL)
        return await window.FaceLandmarker.createFromOptions(localVision, {
          baseOptions: {
            modelAssetPath: LOCAL_MEDIAPIPE_MODEL_URL
          },
          runningMode: 'VIDEO',
          numFaces: 1
        })
      } catch (errLocal) {
        lastError = errLocal
      }
    }
    for (var i = 0; i < MEDIAPIPE_WASM_URLS.length; i++) {
      try {
        var vision = await window.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URLS[i])
        for (var j = 0; j < MEDIAPIPE_MODEL_URLS.length; j++) {
          try {
            return await window.FaceLandmarker.createFromOptions(vision, {
              baseOptions: {
                modelAssetPath: MEDIAPIPE_MODEL_URLS[j]
              },
              runningMode: 'VIDEO',
              numFaces: 1
            })
          } catch (errModel) {
            lastError = errModel
          }
        }
      } catch (errWasm) {
        lastError = errWasm
      }
    }
    throw lastError || new Error('Unable to load MediaPipe model assets.')
  }

  async function ensureTrackerModel() {
    if (modelReady && faceLandmarker) return true
    modelStatus = 'loading'
    var loaded = await ensureMediapipe()
    if (!loaded || !(window.FilesetResolver && window.FaceLandmarker)) {
      modelStatus = 'load-failed'
      setStatusText('Focus model download failed. Camera preview is still live.')
      setDebugText(getDebugSummary('Current: model load failed'))
      return false
    }

    try {
      faceLandmarker = await createLandmarkerFromCandidates()
      modelReady = true
      modelStatus = 'ready'
      return true
    } catch (_err) {
      modelStatus = 'init-failed'
      setStatusText('Focus model could not initialize. Camera preview is still live.')
      setDebugText(getDebugSummary('Current: model init failed'))
      return false
    }
  }

  function canUseCameraTracking() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  }

  function getLandmark(landmarks, index) {
    return landmarks && landmarks[index] ? landmarks[index] : null
  }

  function averagePoints(points) {
    var valid = (points || []).filter(Boolean)
    if (!valid.length) return null
    var out = { x: 0, y: 0, z: 0 }
    for (var i = 0; i < valid.length; i++) {
      out.x += valid[i].x || 0
      out.y += valid[i].y || 0
      out.z += valid[i].z || 0
    }
    out.x /= valid.length
    out.y /= valid.length
    out.z /= valid.length
    return out
  }

  function pointDistance(a, b) {
    if (!a || !b) return 0
    var dx = (a.x || 0) - (b.x || 0)
    var dy = (a.y || 0) - (b.y || 0)
    return Math.sqrt(dx * dx + dy * dy)
  }

  function eyeAspectRatio(landmarks, indices) {
    var p1 = getLandmark(landmarks, indices[0])
    var p2 = getLandmark(landmarks, indices[1])
    var p3 = getLandmark(landmarks, indices[2])
    var p4 = getLandmark(landmarks, indices[3])
    var p5 = getLandmark(landmarks, indices[4])
    var p6 = getLandmark(landmarks, indices[5])
    var horizontal = pointDistance(p1, p4)
    if (!horizontal) return 0
    return (pointDistance(p2, p6) + pointDistance(p3, p5)) / (2 * horizontal)
  }

  function getAttentionState(result) {
    if (document.hidden) {
      return { attentive: false, faceVisible: false, faceReliable: false, reason: 'Tab hidden.' }
    }
    var frameState = getFallbackFrameState()
    if (frameState && frameState.covered) {
      return { attentive: false, faceVisible: false, faceReliable: false, reason: 'Camera covered or very dark.' }
    }
    if (!result || !result.faceLandmarks || !result.faceLandmarks.length) {
      return { attentive: false, faceVisible: false, faceReliable: false, reason: 'Face not visible.' }
    }

    var landmarks = result.faceLandmarks[0]
    var leftEye = averagePoints([
      getLandmark(landmarks, 33),
      getLandmark(landmarks, 133),
      getLandmark(landmarks, 159),
      getLandmark(landmarks, 145),
    ])
    var rightEye = averagePoints([
      getLandmark(landmarks, 362),
      getLandmark(landmarks, 263),
      getLandmark(landmarks, 386),
      getLandmark(landmarks, 374),
    ])
    var nose = getLandmark(landmarks, 1)
    var forehead = getLandmark(landmarks, 10)
    var chin = getLandmark(landmarks, 152)
    var mouthTop = getLandmark(landmarks, 13)
    var mouthBottom = getLandmark(landmarks, 14)
    if (!leftEye || !rightEye || !nose || !forehead || !chin || !mouthTop || !mouthBottom) {
      return { attentive: false, faceVisible: true, faceReliable: false, reason: 'Face found. Hold centered for calibration.' }
    }

    var eyeSpan = pointDistance(leftEye, rightEye)
    var faceHeight = pointDistance(forehead, chin)
    if (!eyeSpan || !faceHeight) {
      return { attentive: false, faceVisible: true, faceReliable: false, reason: 'Face found. Hold centered for calibration.' }
    }

    var eyeMid = averagePoints([leftEye, rightEye])
    var mouthMid = averagePoints([mouthTop, mouthBottom])
    var yaw = Math.abs((nose.x - eyeMid.x) / eyeSpan)
    var pitch = Math.abs((nose.y - ((eyeMid.y + mouthMid.y) / 2)) / faceHeight)
    var leftEAR = eyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144])
    var rightEAR = eyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380])
    var eyeOpen = (leftEAR + rightEAR) / 2
    var faceCenterX = nose.x
    var faceCenterY = ((forehead.y || 0) + (chin.y || 0)) / 2
    var faceSize = faceHeight
    var base = {
      faceVisible: true,
      faceReliable: true,
      yaw: yaw,
      pitch: pitch,
      eyeOpen: eyeOpen,
      faceCenterX: faceCenterX,
      faceCenterY: faceCenterY,
      faceSize: faceSize,
    }

    if (faceSize < 0.14) {
      base.attentive = false
      base.faceReliable = false
      base.reason = 'Face too far from the camera.'
      return base
    }
    if (faceCenterX < 0.18 || faceCenterX > 0.82 || faceCenterY < 0.18 || faceCenterY > 0.84) {
      base.attentive = false
      base.faceReliable = false
      base.reason = 'Face leaving the frame.'
      return base
    }

    if (yaw > 0.3) {
      base.attentive = false
      base.reason = 'Head turned away.'
      return base
    }
    if (pitch > 0.24) {
      base.attentive = false
      base.reason = 'Eyes off the screen.'
      return base
    }
    if (eyeOpen > 0 && eyeOpen < 0.12) {
      base.attentive = false
      base.reason = 'Eyes not clearly on-screen.'
      return base
    }

    base.attentive = true
    base.reason = 'Eyes on the page.'
    return base
  }

  async function startTracking() {
    if (running) return true
    var previewReady = await startPreview()
    if (!previewReady) {
      return false
    }
    setStatusText('Camera active. Loading focus model...')
    var trackerReady = await ensureTrackerModel()
    if (!trackerReady) {
      return enterFallbackTrackingMode('Camera-only focus mode active. Tracker model unavailable.')
    }

    running = true
    resetTrackingState()
    playCue('start')
    startSession()
    requestAnimationFrame(trackFrame)
    return true
  }

  function stopTracking() {
    running = false
    lastFrameAt = 0
    trackingGraceUntil = 0
    hasFaceLock = false
    attentionState = 'idle'
    attentiveFrameStreak = 0
    awayFrameStreak = 0
    trackingArmed = false
    trackingArmStartedAt = 0
    postArmGraceUntil = 0
    faceLockFrameStreak = 0
    warningEligibleAt = 0
    recoveryInFlight = false
    modelStatus = 'idle'
    warningLevel = 0
    latestAttention = { attentive: true, reason: 'Camera off. Nothing is being tracked.' }
    clearLyneReturnPrompt()
    stopSession(false)
    setStatusText(latestAttention.reason)
    setIndicatorState('off')
    playCue('stop')
    if (streamRef) {
      streamRef.getTracks().forEach(function (track) { track.stop() })
      streamRef = null
    }
    if (videoEl) {
      videoEl.remove()
      videoEl = null
    }
    if (faceLandmarker && typeof faceLandmarker.close === 'function') {
      faceLandmarker.close()
      faceLandmarker = null
    }
    modelReady = false
    previewStarting = false
    stopPreview()
    setDebugText('Camera preview off.')
  }

  function evaluateAttention(result) {
    var session = ensureSessionState()
    var now = performance.now()
    var frameDelta = lastFrameAt ? Math.max(0, Math.min(1500, now - lastFrameAt)) : 0
    lastFrameAt = now
    latestAttention = getAttentionState(result)
    setDebugText(getDebugSummary('Current: ' + latestAttention.reason))

    if (Date.now() < trackingGraceUntil) {
      if (latestAttention.faceReliable) {
        faceLockFrameStreak += 1
        if (faceLockFrameStreak >= FACE_LOCK_CONFIRM_FRAMES) {
          hasFaceLock = true
          attentionState = latestAttention.attentive ? 'attentive' : 'idle'
          attentiveFrameStreak = latestAttention.attentive ? ATTENTIVE_CONFIRM_FRAMES : 0
          awayFrameStreak = 0
          if (latestAttention.attentive) {
            lastAttentiveAt = Date.now()
            if (session.active && !session.completed) {
              session.lastAttentionState = 'attentive'
              persistSession()
            }
            setIndicatorState('on')
          }
        }
      } else {
        faceLockFrameStreak = 0
      }
      if (frameCounter % 24 === 0) {
        setStatusText(hasFaceLock ? 'Camera active. Calibrating focus...' : 'Camera active. Looking for your face...')
      }
      return
    }

    if (!hasFaceLock) {
      if (latestAttention.faceReliable) {
        faceLockFrameStreak += 1
        if (faceLockFrameStreak >= FACE_LOCK_CONFIRM_FRAMES) {
          hasFaceLock = true
          attentionState = latestAttention.attentive ? 'attentive' : 'idle'
          attentiveFrameStreak = latestAttention.attentive ? ATTENTIVE_CONFIRM_FRAMES : 0
          awayFrameStreak = 0
          if (latestAttention.attentive) {
            lastAttentiveAt = Date.now()
            if (session.active && !session.completed) {
              session.lastAttentionState = 'attentive'
              persistSession()
            }
            setIndicatorState('on')
          }
          setStatusText('Face locked. Focus session active.')
        }
      } else if (frameCounter % 24 === 0) {
        faceLockFrameStreak = 0
        setStatusText('Align your face with the camera to begin focus tracking.')
      }
      return
    }

    if (!trackingArmed) {
      if (latestAttention.faceReliable && latestAttention.attentive) {
        if (!trackingArmStartedAt) trackingArmStartedAt = Date.now()
        if (Date.now() - trackingArmStartedAt >= 3000) {
          trackingArmed = true
          lastAttentiveAt = Date.now()
          postArmGraceUntil = Date.now() + 10000
          warningEligibleAt = postArmGraceUntil + 6000
          warningLevel = 0
          setIndicatorState('on')
          setStatusText('Focus tracking armed.')
        } else if (frameCounter % 24 === 0) {
          setStatusText('Hold still for a moment to arm focus tracking...')
        }
      } else {
        trackingArmStartedAt = 0
        if (frameCounter % 24 === 0) {
          setStatusText('Face lock found. Hold steady to arm tracking.')
        }
      }
      return
    }

    if (Date.now() < postArmGraceUntil) {
      if (latestAttention.attentive) {
        lastAttentiveAt = Date.now()
        warningLevel = 0
        setIndicatorState('on')
      }
      if (frameCounter % 24 === 0) {
        setStatusText('Focus tracking armed. Keep your face in view.')
      }
      return
    }

    if (Date.now() < warningEligibleAt) {
      if (latestAttention.attentive) {
        lastAttentiveAt = Date.now()
        warningLevel = 0
        setIndicatorState('on')
      }
      if (frameCounter % 24 === 0) {
        setStatusText('Focus tracking live. Building a stable baseline...')
      }
      return
    }

    if (latestAttention.attentive) {
      attentiveFrameStreak += 1
      awayFrameStreak = 0
      if (attentionState !== 'attentive' && attentiveFrameStreak >= ATTENTIVE_CONFIRM_FRAMES) {
        attentionState = 'attentive'
        lastAttentiveAt = Date.now()
        if (session.active && !session.completed) {
          session.lastAttentionState = 'attentive'
          persistSession()
        }
      }
      if (session.active && !session.completed) {
        session.focusedMs += frameDelta
        persistSession()
      }
      if (warningLevel > 0) {
        clearLyneReturnPrompt()
        setStatusText('Focus recovered. Session active.')
      }
      if (attentionState === 'attentive') {
        lastAttentiveAt = Date.now()
      }
      warningLevel = 0
      setIndicatorState('on')
      if (frameCounter % 24 === 0) {
        setStatusText(latestAttention.reason)
      }
      return
    }

    attentiveFrameStreak = 0
    awayFrameStreak += 1

    if (frameCounter % 24 === 0) {
      setStatusText(latestAttention.reason)
    }

    if (attentionState !== 'away' && awayFrameStreak >= AWAY_CONFIRM_FRAMES) {
      attentionState = 'away'
    }

    if (attentionState === 'away' && session.active && !session.completed && session.lastAttentionState === 'attentive') {
      session.breakCount += 1
      session.lastAttentionState = 'away'
      persistSession()
    }

    if (
      (
        (latestAttention.reason === 'Face not visible.' ||
          latestAttention.reason === 'Face leaving the frame.' ||
          latestAttention.reason === 'Face too far from the camera.') &&
        awayFrameStreak >= FACE_MISSING_CONFIRM_FRAMES
      ) ||
      latestAttention.reason === 'Camera covered or very dark.'
    ) {
      if (warningLevel < 2) {
        warningLevel = 2
        if (session.active && !session.completed) {
          session.warningCount += 1
          persistSession()
        }
        notifyLyneReturnPrompt(2, latestAttention.reason)
        showAlert(2)
      }
      setStatusText(latestAttention.reason + ' Strong focus reminder active.')
      return
    }

    var awayFor = Date.now() - lastAttentiveAt
    if (awayFor >= ATTENTION_STRONG_MS && warningLevel < 2) {
      warningLevel = 2
      if (session.active && !session.completed) {
        session.warningCount += 1
        persistSession()
      }
      notifyLyneReturnPrompt(2, latestAttention.reason)
      showAlert(2)
      setStatusText(latestAttention.reason + ' Strong focus reminder active.')
    } else if (awayFor >= ATTENTION_WARN_MS && warningLevel < 1) {
      warningLevel = 1
      if (session.active && !session.completed) {
        session.warningCount += 1
        persistSession()
      }
      notifyLyneReturnPrompt(1, latestAttention.reason)
      showAlert(1)
      setStatusText(latestAttention.reason + ' Focus reminder active.')
    }
  }

  function trackFrame() {
    if (!running) return
    if (!videoEl) {
      requestAnimationFrame(trackFrame)
      return
    }
    if (!isStreamLive()) {
      setStatusText('Camera stream paused. Recovering...')
      setDebugText(getDebugSummary('Current: stream lost'))
      recoverCameraStream().finally(function () {
        requestAnimationFrame(trackFrame)
      })
      return
    }
    if (!faceLandmarker || modelStatus === 'fallback') {
      if (videoEl.currentTime !== lastVideoTime) {
        frameCounter += 1
        lastVideoTime = videoEl.currentTime
        var fallbackFrameState = getFallbackFrameState()
        latestAttention = getFallbackAttentionState(fallbackFrameState)
        if (latestAttention.attentive) {
          lastAttentiveAt = Date.now()
          warningLevel = 0
          setIndicatorState('on')
          if (frameCounter % 24 === 0) {
            setStatusText(latestAttention.reason === 'Camera-only focus mode active.' ? 'Camera-only focus mode active. Tracker model unavailable.' : latestAttention.reason)
          }
          clearLyneReturnPrompt()
        } else {
          var fallbackAwayFor = Date.now() - lastAttentiveAt
          setIndicatorState('alert')
          if (frameCounter % 24 === 0) {
            setStatusText(latestAttention.reason + ' Focus reminder active.')
          }
          if (latestAttention.reason === 'Camera covered or very dark.') {
            if (warningLevel < 2) {
              warningLevel = 2
              notifyLyneReturnPrompt(2, latestAttention.reason)
              showAlert(2)
            }
          } else if (Date.now() >= warningEligibleAt) {
            if (fallbackAwayFor >= ATTENTION_STRONG_MS && warningLevel < 2) {
              warningLevel = 2
              notifyLyneReturnPrompt(2, latestAttention.reason)
              showAlert(2)
            } else if (fallbackAwayFor >= ATTENTION_WARN_MS && warningLevel < 1) {
              warningLevel = 1
              notifyLyneReturnPrompt(1, latestAttention.reason)
              showAlert(1)
            }
          }
        }
        setDebugText(
          getDebugSummary(
            'Current: ' +
              latestAttention.reason +
              (fallbackFrameState
                ? ' | Brightness: ' +
                  Math.round(fallbackFrameState.averageBrightness) +
                  ' | Range: ' +
                  Math.round(fallbackFrameState.brightnessRange)
                : '')
          )
        )
      }
      requestAnimationFrame(trackFrame)
      return
    }
    try {
      if (videoEl.currentTime !== lastVideoTime) {
        frameCounter += 1
        lastVideoTime = videoEl.currentTime
        var result = faceLandmarker.detectForVideo(videoEl, performance.now())
        evaluateAttention(result)
      } else if (frameCounter % 30 === 0) {
        setDebugText(getDebugSummary('Current: waiting for video frame'))
      }
    } catch (_err) {
      setStatusText('Focus tracker is recovering. Keep the camera pointed at you.')
      setDebugText(getDebugSummary('Current: detector frame error'))
    }
    requestAnimationFrame(trackFrame)
  }

  function bindUi() {
    var ui = ensureUi()
    var toggle = ui.dock.querySelector('[data-focus-mode-toggle]')
    var collapseButton = ui.dock.querySelector('[data-focus-mode-collapse]')
    var infoButton = ui.dock.querySelector('[data-focus-mode-info]')
    var previewButton = ui.dock.querySelector('[data-focus-mode-preview-toggle]')
    if (!toggle || toggle.getAttribute('data-bound') === '1') return
    toggle.setAttribute('data-bound', '1')

    setToggleState(readFlag(FOCUS_ENABLED_KEY))
    ensureSessionState()
    setInfoOpenState(false)
    syncPreview()
    if (readFlag(FOCUS_DISMISSED_KEY)) {
      setCollapsedState(true)
    } else {
      setCollapsedState(false)
    }

    toggle.addEventListener('click', async function () {
      var shell = document.querySelector('[data-focus-mode-shell]')
      if (shell && shell.classList.contains('is-collapsed')) {
        setCollapsedState(false)
        return
      }
      unlockAudio()
      var enabled = !readFlag(FOCUS_ENABLED_KEY)
      writeFlag(FOCUS_ENABLED_KEY, enabled)
      setToggleState(enabled)
      writeFlag(FOCUS_DISMISSED_KEY, true)
      if (enabled) {
        if (previewOpen) {
          setInfoOpenState(true)
        }
        var started = await startTracking()
        if (!started) {
          writeFlag(FOCUS_ENABLED_KEY, false)
          setToggleState(false)
        }
      } else {
        setInfoOpenState(false)
        stopTracking()
        stopSession(true)
      }
    })

    if (collapseButton) {
      collapseButton.addEventListener('click', function () {
        var shell = document.querySelector('[data-focus-mode-shell]')
        if (!shell) return
        var collapsed = !shell.classList.contains('is-collapsed')
        setCollapsedState(collapsed)
      })
    }

    if (infoButton) {
      infoButton.addEventListener('click', function () {
        var shell = document.querySelector('[data-focus-mode-shell]')
        if (!shell) return
        var next = !shell.classList.contains('is-info-open')
        setInfoOpenState(next)
      })
    }

    if (previewButton) {
      previewButton.addEventListener('click', async function () {
        previewOpen = !previewOpen
        if (previewOpen) {
          setInfoOpenState(true)
          syncPreview()
          await startPreview()
        } else {
          syncPreview()
        }
      })
    }

    ;['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'].forEach(function (eventName) {
      document.addEventListener(eventName, markInteraction, { passive: true })
    })

    document.addEventListener('visibilitychange', function () {
      markInteraction()
      if (!readFlag(FOCUS_ENABLED_KEY)) return
      if (document.hidden) {
        warningLevel = Math.max(warningLevel, 2)
        notifyLyneReturnPrompt(2, 'Tab hidden.')
        showAlert(2)
        setStatusText('Tab hidden. Strong focus reminder active.')
      } else {
        clearLyneReturnPrompt()
        warningLevel = 0
        setIndicatorState(readFlag(FOCUS_ENABLED_KEY) ? 'on' : 'off')
        setStatusText(running ? 'Focus session active.' : 'Camera preview live. Tracking is off.')
      }
    })

    document.addEventListener('sc:focus-open', function () {
      setCollapsedState(false)
      setInfoOpenState(true)
    })

    document.addEventListener('click', function (event) {
      var trigger = event.target && event.target.closest ? event.target.closest('[data-focus-hero-open]') : null
      if (!trigger) return
      event.preventDefault()
      setCollapsedState(false)
      setInfoOpenState(true)
    })

    if (readFlag(FOCUS_ENABLED_KEY)) {
      unlockAudio()
      previewOpen = true
      setInfoOpenState(true)
      syncPreview()
      startTracking().catch(function () {
        setStatusText('Camera access failed.')
      })
    }
    updateSessionUi()
  }

  if (!shouldMount()) return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindUi, { once: true })
  } else {
    bindUi()
  }
})()
