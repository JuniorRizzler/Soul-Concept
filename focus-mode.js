(function () {
  var FOCUS_ENABLED_KEY = 'sc_focus_mode_enabled_v1'
  var FOCUS_DISMISSED_KEY = 'sc_focus_mode_dismissed_v1'
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
      '.focus-mode-toggle{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border-radius:999px;border:1px solid rgba(33,92,75,.22);background:rgba(255,255,255,.94);box-shadow:0 14px 34px rgba(23,21,16,.12);color:#1b1b1f;font:800 .88rem/1 Manrope,system-ui,sans-serif;cursor:pointer}' +
      '.focus-mode-toggle.is-on{background:linear-gradient(135deg,rgba(33,92,75,.96),rgba(18,68,54,.96));color:#fff;border-color:transparent}' +
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
      '@media (max-width:680px){.focus-mode-dock{left:10px;bottom:10px}.focus-mode-alert{right:10px;bottom:10px}}'
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

  function ensureUi() {
    injectStyles()
    var dock = document.querySelector('[data-focus-mode-dock]')
    if (!dock) {
      dock = document.createElement('div')
      dock.className = 'focus-mode-dock'
      dock.setAttribute('data-focus-mode-dock', '1')
      dock.innerHTML =
        '<button class="focus-mode-toggle" type="button" data-focus-mode-toggle>Focus Mode Off</button>' +
        '<p class="focus-mode-note" data-focus-mode-note><strong>Anti-Procrastination Mode</strong>Use your camera on-device to detect when you look away, turn away, or leave the tab for too long and nudge you back into your study flow.<span class="focus-mode-meta" data-focus-mode-meta>Camera off. Nothing is being tracked.</span></p>'
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
    alert.classList.add('show')
    alert.classList.toggle('is-strong', level > 1)
    alert.innerHTML =
      level > 1
        ? '<strong>Come back to Soul Concept</strong><p>You have been away for a while. Re-focus and keep your study streak moving.</p>'
        : '<strong>Focus check</strong><p>Eyes back on the page. Stay with this study block.</p>'
    document.body.classList.add('focus-warning')
    window.setTimeout(function () {
      alert.classList.remove('show')
      alert.classList.remove('is-strong')
      document.body.classList.remove('focus-warning')
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
    requestAnimationFrame(trackFrame)
  }

  function stopTracking() {
    running = false
    warningLevel = 0
    latestAttention = { attentive: true, reason: 'Camera off. Nothing is being tracked.' }
    setStatusText(latestAttention.reason)
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
    if (!toggle || toggle.getAttribute('data-bound') === '1') return
    toggle.setAttribute('data-bound', '1')

    setToggleState(readFlag(FOCUS_ENABLED_KEY))
    if (readFlag(FOCUS_DISMISSED_KEY)) {
      var note = ui.dock.querySelector('[data-focus-mode-note]')
      if (note) note.style.display = 'none'
    }

    toggle.addEventListener('click', async function () {
      var enabled = !readFlag(FOCUS_ENABLED_KEY)
      writeFlag(FOCUS_ENABLED_KEY, enabled)
      setToggleState(enabled)
      writeFlag(FOCUS_DISMISSED_KEY, true)
      var note = ui.dock.querySelector('[data-focus-mode-note]')
      if (note) note.style.display = 'none'
      if (enabled) {
        await startTracking()
      } else {
        stopTracking()
      }
    })

    document.addEventListener('visibilitychange', function () {
      if (!readFlag(FOCUS_ENABLED_KEY)) return
      if (document.hidden) {
        showAlert(1)
        setStatusText('Tab hidden. Focus reminder active.')
      }
    })

    if (readFlag(FOCUS_ENABLED_KEY)) {
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
