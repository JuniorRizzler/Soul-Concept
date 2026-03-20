(function () {
  var FOCUS_ENABLED_KEY = 'sc_focus_mode_enabled_v1'
  var FOCUS_DISMISSED_KEY = 'sc_focus_mode_dismissed_v1'
  var APP_SOUND_KEY = 'sc_app_sound_enabled_v1'
  var ATTENTION_WARN_MS = 5000
  var ATTENTION_STRONG_MS = 14000
  var lastAttentiveAt = 0
  var warningLevel = 0
  var faceLandmarker = null
  var running = false
  var lastVideoTime = -1
  var videoEl = null
  var streamRef = null
  var frameCounter = 0
  var alertTimer = 0
  var audioCtx = null
  var audioUnlocked = false
  var latestAttention = { attentive: true, reason: 'Focus Mode is ready.' }

  function getPageName() {
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase()
  }

  function shouldMount() {
    return getPageName() !== 'offline.html'
  }

  function shouldHideForStartup() {
    return !!(document.body && document.body.classList.contains('startup-active'))
  }

  function injectStyles() {
    if (document.getElementById('sc-focus-mode-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-focus-mode-styles'
    style.textContent =
      '.focus-mode-dock{position:fixed;right:max(14px,env(safe-area-inset-right));top:calc(max(14px,env(safe-area-inset-top)) + 56px);z-index:10024;display:grid;gap:8px;width:min(298px,82vw)}' +
      '.focus-mode-dock.is-hidden{display:none}' +
      '.focus-mode-shell{display:grid;gap:8px}' +
      '.focus-mode-bar{display:grid;gap:8px;padding:11px;border-radius:26px;border:1px solid rgba(148,181,164,.28);background:linear-gradient(180deg,rgba(239,250,244,.9),rgba(214,233,223,.76));box-shadow:0 18px 38px rgba(12,18,14,.12),inset 0 1px 0 rgba(255,255,255,.56);backdrop-filter:blur(18px) saturate(150%)}' +
      '.focus-mode-topline{display:flex;align-items:center;gap:10px}' +
      '.focus-mode-close{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;border:1px solid rgba(148,181,164,.22);background:rgba(255,255,255,.58);color:#355648;font:900 .82rem/1 Manrope,system-ui,sans-serif;cursor:pointer}' +
      '.focus-mode-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}' +
      '.focus-mode-chip{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border-radius:999px;background:rgba(255,255,255,.56);border:1px solid rgba(148,181,164,.24);color:#315444;font:800 .64rem/1 Manrope,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}' +
      '.focus-mode-chip.is-on{background:rgba(34,161,93,.12);color:#175739;border-color:rgba(34,161,93,.24)}' +
      '.focus-mode-chip.is-alert{background:rgba(209,154,45,.14);color:#8a5a09;border-color:rgba(209,154,45,.24)}' +
      '.focus-mode-indicator{width:11px;height:11px;border-radius:999px;background:#c63b32;box-shadow:0 0 0 5px rgba(198,59,50,.12),0 0 18px rgba(198,59,50,.22)}' +
      '.focus-mode-indicator.is-on{background:#22a15d;box-shadow:0 0 0 5px rgba(34,161,93,.12),0 0 18px rgba(34,161,93,.24)}' +
      '.focus-mode-indicator.is-alert{background:#d19a2d;box-shadow:0 0 0 5px rgba(209,154,45,.14),0 0 18px rgba(209,154,45,.24)}' +
      '.focus-mode-summary{min-width:0;display:grid;gap:1px;flex:1}' +
      '.focus-mode-title{color:#163126;font:800 .68rem/1.1 Manrope,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}' +
      '.focus-mode-status{color:#406354;font:600 .74rem/1.22 Manrope,system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.focus-mode-toggle,.focus-mode-icon{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 11px;border-radius:999px;border:1px solid rgba(148,181,164,.24);background:rgba(255,255,255,.62);color:#163126;font:800 .7rem/1 Manrope,system-ui,sans-serif;cursor:pointer;min-height:34px;backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,.4)}' +
      '.focus-mode-toggle.is-on{background:linear-gradient(180deg,rgba(23,82,58,.92),rgba(18,63,45,.88));color:#fff;border-color:rgba(23,82,58,.72)}' +
      '.focus-mode-icon.is-active{background:rgba(17,27,22,.86);color:#fff;border-color:rgba(17,27,22,.72)}' +
      '.focus-mode-shell.is-collapsed .focus-mode-note{display:none}' +
      '.focus-mode-note{margin:0;padding:11px 12px;border-radius:18px;background:linear-gradient(180deg,rgba(248,252,249,.96),rgba(232,242,236,.92));border:1px solid rgba(175,198,186,.3);box-shadow:0 18px 34px rgba(18,24,20,.08),inset 0 1px 0 rgba(255,255,255,.48);color:#284539;font-size:.73rem;line-height:1.5;backdrop-filter:blur(18px) saturate(140%)}' +
      '.focus-mode-note strong{display:block;margin-bottom:4px;color:#163126;font-size:.76rem;letter-spacing:.04em;text-transform:uppercase}' +
      '.focus-mode-meta{display:block;margin-top:7px;color:#215c4b;font-size:.68rem;font-weight:800;letter-spacing:.01em}' +
      '.focus-mode-alert{position:fixed;right:max(14px,env(safe-area-inset-right));top:calc(max(14px,env(safe-area-inset-top)) + 150px);z-index:10025;max-width:min(320px,84vw);padding:14px 16px;border-radius:18px;background:rgba(17,20,24,.94);color:#fff;box-shadow:0 20px 46px rgba(8,10,14,.28);border:1px solid rgba(255,255,255,.08);opacity:0;transform:translateY(-10px);pointer-events:none;transition:opacity .22s ease,transform .22s ease}' +
      '.focus-mode-alert.show{opacity:1;transform:translateY(0)}' +
      '.focus-mode-alert strong{display:block;margin-bottom:5px;font-size:.95rem}' +
      '.focus-mode-alert p{margin:0;color:rgba(255,255,255,.82);font-size:.84rem;line-height:1.45}' +
      '.focus-mode-alert.is-strong{background:linear-gradient(135deg,rgba(27,27,31,.96),rgba(145,52,29,.94))}' +
      '.focus-mode-video{position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px}' +
      'body.focus-warning .site-wrap{animation:focusPulse .55s ease}' +
      '@keyframes focusPulse{0%{transform:scale(1)}35%{transform:scale(.997)}100%{transform:scale(1)}}' +
      '@media (prefers-reduced-motion:reduce){.focus-mode-alert,body.focus-warning .site-wrap{transition:none;animation:none}}' +
      '@media (max-width:680px){.focus-mode-dock{right:max(10px,env(safe-area-inset-right));top:calc(max(10px,env(safe-area-inset-top)) + 52px);width:min(246px,calc(100vw - 20px))}.focus-mode-bar{gap:7px;padding:9px}.focus-mode-title{font-size:.64rem}.focus-mode-status{font-size:.66rem}.focus-mode-chip{font-size:.6rem;padding:5px 8px}.focus-mode-actions{gap:6px}.focus-mode-toggle,.focus-mode-icon{min-height:31px;padding:7px 10px;font-size:.66rem}.focus-mode-note{font-size:.7rem;padding:9px 10px}.focus-mode-alert{left:auto;right:10px;top:calc(max(10px,env(safe-area-inset-top)) + 126px);width:min(246px,calc(100vw - 20px));max-width:none}}'
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
        '<button class="focus-mode-close" type="button" data-focus-mode-close aria-label="Close focus mode">X</button>' +
        '</div>' +
        '<div class="focus-mode-actions">' +
        '<span class="focus-mode-chip" data-focus-mode-chip>Idle</span>' +
        '<button class="focus-mode-toggle" type="button" data-focus-mode-toggle>Activate</button>' +
        '<button class="focus-mode-icon" type="button" data-focus-mode-collapse aria-label="Show focus mode details" title="Show focus mode details">Info</button>' +
        '</div>' +
        '</div>' +
        '<p class="focus-mode-note" data-focus-mode-note><strong>Anti-Procrastination Mode</strong>Use your camera on-device to detect when you look away, turn away, or leave the tab for too long and nudge you back into your study flow.<span class="focus-mode-meta" data-focus-mode-meta>Camera off. Nothing is being tracked.</span></p>' +
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

  function setDockHidden(hidden) {
    var dock = document.querySelector('[data-focus-mode-dock]')
    if (!dock) return
    dock.classList.toggle('is-hidden', !!hidden)
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
      chip.textContent = mode === 'alert' ? 'Alert' : mode === 'on' ? 'Tracking' : 'Idle'
    }
  }

  function setCollapsedState(collapsed) {
    var shell = document.querySelector('[data-focus-mode-shell]')
    var button = document.querySelector('[data-focus-mode-collapse]')
    if (!shell || !button) return
    shell.classList.toggle('is-collapsed', collapsed)
    button.textContent = collapsed ? 'Info' : 'Hide'
    button.classList.toggle('is-active', collapsed)
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
    toggle.textContent = enabled ? 'Active' : 'Activate'
    setIndicatorState(enabled ? 'on' : 'off')
    setStatusText(enabled ? 'Camera starting...' : 'Camera off. Nothing is being tracked.')
  }

  function showAlert(level) {
    var alert = document.querySelector('[data-focus-mode-alert]')
    if (!alert) return
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

  async function ensureMediapipe() {
    if (window.FilesetResolver && window.FaceLandmarker) return true
    if (document.querySelector('script[data-focus-mediapipe="1"]')) {
      return false
    }
    return new Promise(function (resolve) {
      var script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14'
      script.async = true
      script.defer = true
      script.setAttribute('data-focus-mediapipe', '1')
      script.onload = function () { resolve(true) }
      script.onerror = function () { resolve(false) }
      document.head.appendChild(script)
    })
  }

  async function ensureVideo() {
    if (videoEl) return videoEl
    videoEl = document.createElement('video')
    videoEl.className = 'focus-mode-video'
    videoEl.setAttribute('playsinline', '')
    videoEl.setAttribute('muted', '')
    videoEl.muted = true
    document.body.appendChild(videoEl)
    streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    videoEl.srcObject = streamRef
    await videoEl.play()
    return videoEl
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
      return { attentive: false, reason: 'Tab hidden.' }
    }
    if (!result || !result.faceLandmarks || !result.faceLandmarks.length) {
      return { attentive: false, reason: 'Face not visible.' }
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
      return { attentive: true, reason: 'Face found.' }
    }

    var eyeSpan = pointDistance(leftEye, rightEye)
    var faceHeight = pointDistance(forehead, chin)
    if (!eyeSpan || !faceHeight) {
      return { attentive: true, reason: 'Face found.' }
    }

    var eyeMid = averagePoints([leftEye, rightEye])
    var mouthMid = averagePoints([mouthTop, mouthBottom])
    var yaw = Math.abs((nose.x - eyeMid.x) / eyeSpan)
    var pitch = Math.abs((nose.y - ((eyeMid.y + mouthMid.y) / 2)) / faceHeight)
    var leftEAR = eyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144])
    var rightEAR = eyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380])
    var eyeOpen = (leftEAR + rightEAR) / 2

    if (yaw > 0.19) {
      return { attentive: false, reason: 'Head turned away.' }
    }
    if (pitch > 0.16) {
      return { attentive: false, reason: 'Eyes off the screen.' }
    }
    if (eyeOpen < 0.18) {
      return { attentive: false, reason: 'Eyes not clearly on-screen.' }
    }

    return { attentive: true, reason: 'Eyes on the page.' }
  }

  async function startTracking() {
    if (running) return
    if (!canUseCameraTracking()) {
      setStatusText('Camera tracking is not supported on this device.')
      showAlert(1)
      return
    }
    var loaded = await ensureMediapipe()
    if (!loaded || !(window.FilesetResolver && window.FaceLandmarker)) {
      setStatusText('Camera model failed to load.')
      showAlert(2)
      return
    }

    var vision = await window.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm')
    faceLandmarker = await window.FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
      },
      runningMode: 'VIDEO',
      numFaces: 1
    })

    await ensureVideo()
    running = true
    frameCounter = 0
    lastAttentiveAt = Date.now()
    warningLevel = 0
    latestAttention = { attentive: true, reason: 'Camera active. Checking attention...' }
    setStatusText(latestAttention.reason)
    setIndicatorState('on')
    playCue('start')
    requestAnimationFrame(trackFrame)
  }

  function stopTracking() {
    running = false
    warningLevel = 0
    latestAttention = { attentive: true, reason: 'Camera off. Nothing is being tracked.' }
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
  }

  function evaluateAttention(result) {
    latestAttention = getAttentionState(result)
    if (latestAttention.attentive) {
      lastAttentiveAt = Date.now()
      warningLevel = 0
      setIndicatorState('on')
      if (frameCounter % 24 === 0) {
        setStatusText(latestAttention.reason)
      }
      return
    }

    if (frameCounter % 24 === 0) {
      setStatusText(latestAttention.reason)
    }

    var awayFor = Date.now() - lastAttentiveAt
    if (awayFor >= ATTENTION_STRONG_MS && warningLevel < 2) {
      warningLevel = 2
      showAlert(2)
      setStatusText(latestAttention.reason + ' Strong focus reminder active.')
    } else if (awayFor >= ATTENTION_WARN_MS && warningLevel < 1) {
      warningLevel = 1
      showAlert(1)
      setStatusText(latestAttention.reason + ' Focus reminder active.')
    }
  }

  function trackFrame() {
    if (!running || !videoEl || !faceLandmarker) return
    if (videoEl.currentTime !== lastVideoTime) {
      frameCounter += 1
      lastVideoTime = videoEl.currentTime
      var result = faceLandmarker.detectForVideo(videoEl, performance.now())
      evaluateAttention(result)
    }
    requestAnimationFrame(trackFrame)
  }

  function bindUi() {
    var ui = ensureUi()
    var toggle = ui.dock.querySelector('[data-focus-mode-toggle]')
    var collapseButton = ui.dock.querySelector('[data-focus-mode-collapse]')
    var closeButton = ui.dock.querySelector('[data-focus-mode-close]')
    if (!toggle || toggle.getAttribute('data-bound') === '1') return
    toggle.setAttribute('data-bound', '1')

    if (readFlag(FOCUS_HIDDEN_KEY) || shouldHideForStartup()) {
      setDockHidden(true)
    } else {
      setDockHidden(false)
    }

    setToggleState(readFlag(FOCUS_ENABLED_KEY))
    if (readFlag(FOCUS_DISMISSED_KEY)) {
      setCollapsedState(true)
    } else {
      setCollapsedState(false)
    }

    toggle.addEventListener('click', async function () {
      unlockAudio()
      var enabled = !readFlag(FOCUS_ENABLED_KEY)
      writeFlag(FOCUS_ENABLED_KEY, enabled)
      writeFlag(FOCUS_HIDDEN_KEY, false)
      setDockHidden(false)
      setToggleState(enabled)
      writeFlag(FOCUS_DISMISSED_KEY, true)
      setCollapsedState(true)
      if (enabled) {
        await startTracking()
      } else {
        stopTracking()
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

    if (closeButton) {
      closeButton.addEventListener('click', function () {
        stopTracking()
        writeFlag(FOCUS_ENABLED_KEY, false)
        writeFlag(FOCUS_HIDDEN_KEY, true)
        setDockHidden(true)
      })
    }

    document.addEventListener('visibilitychange', function () {
      if (!readFlag(FOCUS_ENABLED_KEY)) return
      if (document.hidden) {
        showAlert(1)
        setStatusText('Tab hidden. Focus reminder active.')
      }
    })

    var startupObserver = window.setInterval(function () {
      if (shouldHideForStartup()) {
        setDockHidden(true)
        return
      }
      if (!readFlag(FOCUS_HIDDEN_KEY)) {
        setDockHidden(false)
      }
      window.clearInterval(startupObserver)
    }, 250)

    if (readFlag(FOCUS_ENABLED_KEY)) {
      unlockAudio()
      startTracking().catch(function () {
        setStatusText('Camera access failed.')
      })
    }
  }

  if (!shouldMount()) return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindUi, { once: true })
  } else {
    bindUi()
  }
})()
