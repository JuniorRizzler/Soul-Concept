(function () {
  var FOCUS_ENABLED_KEY = 'sc_focus_mode_enabled_v1'
  var FOCUS_DISMISSED_KEY = 'sc_focus_mode_dismissed_v1'
  var FOCUS_SOUND_KEY = 'sc_focus_mode_sound_v1'
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

  function injectStyles() {
    if (document.getElementById('sc-focus-mode-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-focus-mode-styles'
    style.textContent =
      '.focus-mode-dock{position:fixed;left:18px;bottom:18px;z-index:10030;display:grid;gap:10px;width:min(320px,88vw)}' +
      '.focus-mode-shell{display:grid;gap:10px}' +
      '.focus-mode-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px;border-radius:22px;border:1px solid rgba(218,208,193,.9);background:rgba(255,255,255,.94);box-shadow:0 18px 40px rgba(23,21,16,.14);backdrop-filter:blur(10px)}' +
      '.focus-mode-toggle,.focus-mode-icon{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border-radius:999px;border:1px solid rgba(33,92,75,.22);background:rgba(255,255,255,.94);box-shadow:none;color:#1b1b1f;font:800 .88rem/1 Manrope,system-ui,sans-serif;cursor:pointer;min-height:44px}' +
      '.focus-mode-icon{padding:11px 12px;min-width:44px;font-size:.95rem;font-weight:900}' +
      '.focus-mode-toggle.is-on{background:linear-gradient(135deg,rgba(33,92,75,.96),rgba(18,68,54,.96));color:#fff;border-color:transparent}' +
      '.focus-mode-icon.is-active{background:#1b1b1f;color:#fff;border-color:#1b1b1f}' +
      '.focus-mode-shell.is-collapsed .focus-mode-note{display:none}' +
      '.focus-mode-note{margin:0;padding:12px 14px;border-radius:18px;background:rgba(255,255,255,.95);border:1px solid rgba(226,216,203,.92);box-shadow:0 18px 40px rgba(23,21,16,.12);color:#5a5863;font-size:.84rem;line-height:1.45}' +
      '.focus-mode-note strong{display:block;margin-bottom:4px;color:#1b1b1f;font-size:.92rem}' +
      '.focus-mode-meta{display:block;margin-top:8px;color:#215c4b;font-size:.76rem;font-weight:800;letter-spacing:.01em}' +
      '.focus-mode-alert{position:fixed;right:18px;bottom:18px;z-index:10031;max-width:min(360px,90vw);padding:16px 18px;border-radius:22px;background:rgba(17,20,24,.94);color:#fff;box-shadow:0 20px 46px rgba(8,10,14,.28);border:1px solid rgba(255,255,255,.08);opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .22s ease,transform .22s ease}' +
      '.focus-mode-alert.show{opacity:1;transform:translateY(0)}' +
      '.focus-mode-alert strong{display:block;margin-bottom:6px;font-size:1rem}' +
      '.focus-mode-alert p{margin:0;color:rgba(255,255,255,.82);font-size:.9rem;line-height:1.45}' +
      '.focus-mode-alert.is-strong{background:linear-gradient(135deg,rgba(27,27,31,.96),rgba(145,52,29,.94))}' +
      '.focus-mode-video{position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px}' +
      'body.focus-warning .site-wrap{animation:focusPulse .55s ease}' +
      '@keyframes focusPulse{0%{transform:scale(1)}35%{transform:scale(.997)}100%{transform:scale(1)}}' +
      '@media (prefers-reduced-motion:reduce){.focus-mode-alert,body.focus-warning .site-wrap{transition:none;animation:none}}' +
      '@media (max-width:680px){.focus-mode-dock{left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom));width:auto}.focus-mode-shell{gap:8px}.focus-mode-bar{padding:8px;border-radius:18px}.focus-mode-toggle{flex:1 1 150px;font-size:.82rem;padding:10px 12px}.focus-mode-icon{flex:0 0 44px;padding:10px}.focus-mode-note{font-size:.8rem;padding:11px 12px}.focus-mode-alert{left:10px;right:10px;bottom:calc(max(10px,env(safe-area-inset-bottom)) + 72px);max-width:none}}'
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
        '<button class="focus-mode-toggle" type="button" data-focus-mode-toggle>Focus Mode Off</button>' +
        '<button class="focus-mode-icon is-active" type="button" data-focus-mode-sound aria-label="Toggle focus sounds" title="Toggle focus sounds">Sound</button>' +
        '<button class="focus-mode-icon" type="button" data-focus-mode-collapse aria-label="Collapse focus mode panel" title="Collapse focus mode panel">Hide</button>' +
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

  function setStatusText(text) {
    var status = document.querySelector('[data-focus-mode-meta]')
    if (!status) return
    status.textContent = String(text || '').trim()
  }

  function setSoundState(enabled) {
    var button = document.querySelector('[data-focus-mode-sound]')
    if (!button) return
    button.classList.toggle('is-active', enabled)
    button.textContent = enabled ? 'Sound' : 'Mute'
  }

  function setCollapsedState(collapsed) {
    var shell = document.querySelector('[data-focus-mode-shell]')
    var button = document.querySelector('[data-focus-mode-collapse]')
    if (!shell || !button) return
    shell.classList.toggle('is-collapsed', collapsed)
    button.textContent = collapsed ? 'Show' : 'Hide'
    button.classList.toggle('is-active', collapsed)
  }

  function shouldPlaySound() {
    return readFlag(FOCUS_SOUND_KEY)
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
    toggle.textContent = enabled ? 'Focus Mode On' : 'Focus Mode Off'
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
    document.body.classList.add('focus-warning')
    alertTimer = window.setTimeout(function () {
      alert.classList.remove('show')
      alert.classList.remove('is-strong')
      document.body.classList.remove('focus-warning')
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
    playCue('start')
    requestAnimationFrame(trackFrame)
  }

  function stopTracking() {
    running = false
    warningLevel = 0
    latestAttention = { attentive: true, reason: 'Camera off. Nothing is being tracked.' }
    setStatusText(latestAttention.reason)
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
    var soundButton = ui.dock.querySelector('[data-focus-mode-sound]')
    var collapseButton = ui.dock.querySelector('[data-focus-mode-collapse]')
    if (!toggle || toggle.getAttribute('data-bound') === '1') return
    toggle.setAttribute('data-bound', '1')

    setToggleState(readFlag(FOCUS_ENABLED_KEY))
    if (!hasStoredValue(FOCUS_SOUND_KEY)) {
      writeFlag(FOCUS_SOUND_KEY, true)
    }
    setSoundState(readFlag(FOCUS_SOUND_KEY))
    if (readFlag(FOCUS_DISMISSED_KEY)) {
      setCollapsedState(true)
    } else {
      setCollapsedState(false)
    }

    toggle.addEventListener('click', async function () {
      unlockAudio()
      var enabled = !readFlag(FOCUS_ENABLED_KEY)
      writeFlag(FOCUS_ENABLED_KEY, enabled)
      setToggleState(enabled)
      writeFlag(FOCUS_DISMISSED_KEY, true)
      setCollapsedState(true)
      if (enabled) {
        await startTracking()
      } else {
        stopTracking()
      }
    })

    if (soundButton) {
      soundButton.addEventListener('click', function () {
        var enabled = !readFlag(FOCUS_SOUND_KEY)
        writeFlag(FOCUS_SOUND_KEY, enabled)
        if (enabled) unlockAudio()
        setSoundState(enabled)
      })
    }

    if (collapseButton) {
      collapseButton.addEventListener('click', function () {
        var shell = document.querySelector('[data-focus-mode-shell]')
        if (!shell) return
        var collapsed = !shell.classList.contains('is-collapsed')
        setCollapsedState(collapsed)
      })
    }

    document.addEventListener('visibilitychange', function () {
      if (!readFlag(FOCUS_ENABLED_KEY)) return
      if (document.hidden) {
        showAlert(1)
        setStatusText('Tab hidden. Focus reminder active.')
      }
    })

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
