(function () {
  const FORCE_CACHE_RESET_KEY = 'sc_force_cache_reset_v20260308'

  async function runForcedCacheResetOnce() {
    try {
      if (localStorage.getItem(FORCE_CACHE_RESET_KEY) === '1') return
    } catch (_err) {}

    try {
      if (
        (typeof Notification !== 'undefined' && Notification.permission === 'granted') ||
        localStorage.getItem('sc_push_enabled') === '1'
      ) {
        localStorage.setItem(FORCE_CACHE_RESET_KEY, '1')
        return
      }
    } catch (_err) {}

    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(
          (regs || []).map(function (reg) {
            return reg.unregister().catch(function () {})
          })
        )
      }
      if (typeof caches !== 'undefined' && caches.keys) {
        const keys = await caches.keys()
        await Promise.all(
          (keys || []).map(function (key) {
            return caches.delete(key).catch(function () {})
          })
        )
      }
    } catch (_err) {
      // ignore
    }

    try {
      localStorage.setItem(FORCE_CACHE_RESET_KEY, '1')
    } catch (_err) {}
  }

  runForcedCacheResetOnce()

  const navToggle = document.querySelector('[data-nav-toggle]')
  const navMenu = document.querySelector('[data-nav-menu]')

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open')
      const expanded = navMenu.classList.contains('open')
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false')
      playAppSound(expanded ? 'panel' : 'tap')
    })
  }

  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase()
  const pathName = location.pathname.toLowerCase()
  const isLibraryContext =
    pathName.includes('study-library.html') ||
    pathName.includes('geography-library.html') ||
    pathName.includes('grade-10-math.html') ||
    pathName.includes('math-quiz-simulator.html') ||
    pathName.includes('/math/')
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    const target = (link.getAttribute('href') || '').toLowerCase()
    if (target === currentPage) {
      link.classList.add('active')
    }
  })

  function mountStartupSplash() {
    if (currentPage !== 'index.html') return
    const overlay = document.querySelector('[data-startup-overlay]')
    if (!overlay) return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('startup-ready')
      overlay.remove()
      return
    }

    document.body.classList.add('startup-active')

    function finishSplash() {
      if (!overlay || overlay.classList.contains('is-leaving')) return
      overlay.classList.add('is-leaving')
      document.body.classList.add('startup-ready')
      document.body.classList.remove('startup-active')
      if (soundState.unlocked) playAppSound('startup')
      window.setTimeout(function () {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
      }, 520)
    }

    window.setTimeout(finishSplash, 1225)
    window.addEventListener('pageshow', finishSplash, { once: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountStartupSplash, { once: true })
  } else {
    mountStartupSplash()
  }

  const STREAK_KEY = 'sc_daily_streak_v1'
  const USAGE_KEY = 'sc_usage_stats_v1'
  const ANALYTICS_KEY = 'sc_study_analytics_v1'
  const FOCUS_SESSION_KEY = 'sc_focus_mode_session_v1'
  const PUSH_ENABLED_KEY = 'sc_push_enabled'
  const PUSH_WIDGET_DISMISSED_KEY = 'sc_push_widget_dismissed_v1'
  const APP_SOUND_KEY = 'sc_app_sound_enabled_v1'

  function readBooleanFlag(key, fallbackValue) {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return !!fallbackValue
      return raw === '1'
    } catch (_err) {
      return !!fallbackValue
    }
  }

  function writeBooleanFlag(key, value) {
    try {
      localStorage.setItem(key, value ? '1' : '0')
    } catch (_err) {}
  }

  const soundState = {
    enabled: readBooleanFlag(APP_SOUND_KEY, true),
    context: null,
    unlocked: false,
  }

  function ensureAudioContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioCtor) return null
    if (!soundState.context) soundState.context = new AudioCtor()
    if (soundState.context.state === 'suspended') {
      soundState.context.resume().catch(function () {})
    }
    soundState.unlocked = true
    return soundState.context
  }

  function unlockAppSound() {
    return ensureAudioContext()
  }

  function getSoundToggleLabel() {
    return soundState.enabled ? 'Sound On' : 'Sound Off'
  }

  function updateSoundToggleUi() {
    document.querySelectorAll('[data-sc-sound-toggle]').forEach(function (button) {
      button.classList.toggle('is-off', !soundState.enabled)
      button.textContent = getSoundToggleLabel()
      button.setAttribute('aria-pressed', soundState.enabled ? 'true' : 'false')
      button.setAttribute('aria-label', soundState.enabled ? 'Turn ambient sounds off' : 'Turn ambient sounds on')
      button.title = soundState.enabled ? 'Turn ambient sounds off' : 'Turn ambient sounds on'
    })
  }

  function setSoundEnabled(nextEnabled) {
    soundState.enabled = !!nextEnabled
    writeBooleanFlag(APP_SOUND_KEY, soundState.enabled)
    updateSoundToggleUi()
    document.dispatchEvent(
      new CustomEvent('sc:sound-state-changed', { detail: { enabled: soundState.enabled } }),
    )
  }

  function playSynthLayer(ctx, now, layer) {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = layer.type || 'sine'
    oscillator.frequency.setValueAtTime(layer.start, now)
    oscillator.frequency.linearRampToValueAtTime(layer.end || layer.start, now + (layer.duration || 0.18))
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(layer.volume || 0.028, now + (layer.attack || 0.02))
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (layer.duration || 0.18))
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start(now)
    oscillator.stop(now + (layer.duration || 0.18) + 0.04)
  }

  function playAppSound(name) {
    if (!soundState.enabled) return
    const ctx = ensureAudioContext()
    if (!ctx) return
    const now = ctx.currentTime
    const palette = {
      tap: [{ type: 'sine', start: 440, end: 500, duration: 0.07, volume: 0.008, attack: 0.014 }],
      panel: [],
      filter: [{ type: 'sine', start: 370, end: 470, duration: 0.09, volume: 0.009, attack: 0.014 }],
      success: [
        { type: 'sine', start: 470, end: 560, duration: 0.12, volume: 0.01, attack: 0.02 },
        { type: 'sine', start: 610, end: 700, duration: 0.16, volume: 0.007, attack: 0.028 },
      ],
      error: [
        { type: 'sine', start: 300, end: 270, duration: 0.16, volume: 0.012, attack: 0.015 },
        { type: 'sine', start: 240, end: 220, duration: 0.24, volume: 0.009, attack: 0.02 },
      ],
      startup: [
        { type: 'sine', start: 392, end: 440, duration: 0.22, volume: 0.008, attack: 0.04 },
        { type: 'sine', start: 523, end: 587, duration: 0.28, volume: 0.005, attack: 0.05 },
      ],
      toggleOn: [
        { type: 'sine', start: 430, end: 510, duration: 0.12, volume: 0.009, attack: 0.02 },
        { type: 'sine', start: 560, end: 640, duration: 0.14, volume: 0.006, attack: 0.028 },
      ],
      toggleOff: [{ type: 'sine', start: 380, end: 300, duration: 0.12, volume: 0.009, attack: 0.016 }],
      message: [
        { type: 'sine', start: 520, end: 610, duration: 0.09, volume: 0.008, attack: 0.014 },
        { type: 'sine', start: 660, end: 720, duration: 0.1, volume: 0.005, attack: 0.018 },
      ],
      alert: [
        { type: 'sine', start: 260, end: 240, duration: 0.18, volume: 0.013, attack: 0.015 },
        { type: 'sine', start: 310, end: 290, duration: 0.22, volume: 0.009, attack: 0.02 },
      ],
      alarm: [
        { type: 'sine', start: 220, end: 210, duration: 0.22, volume: 0.015, attack: 0.015 },
        { type: 'sine', start: 277, end: 262, duration: 0.24, volume: 0.011, attack: 0.02 },
        { type: 'sine', start: 220, end: 210, duration: 0.22, volume: 0.01, attack: 0.015 },
      ],
    }
    const layers = palette[name] || palette.tap
    if (!layers.length) return
    layers.forEach(function (layer, index) {
      playSynthLayer(ctx, now + index * 0.035, layer)
    })
  }

  window.SoulAudio = {
    unlock: unlockAppSound,
    play: playAppSound,
    isEnabled: function () {
      return soundState.enabled
    },
    setEnabled: setSoundEnabled,
  }

  document.addEventListener('pointerdown', unlockAppSound, { passive: true })
  document.addEventListener('keydown', unlockAppSound)

  function ensureGlobalUiStyles() {
    if (document.getElementById('sc-global-ui-styles')) return
    const style = document.createElement('style')
    style.id = 'sc-global-ui-styles'
      style.textContent =
        '.streak-pill{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;border:1px solid rgba(33,92,75,.25);background:linear-gradient(135deg,rgba(33,92,75,.1),rgba(243,106,61,.12));box-shadow:0 8px 18px rgba(23,21,16,.08);white-space:nowrap}' +
      '.streak-pill-icon{width:18px;height:18px;border-radius:6px;background:transparent url(\"icons/soulconceptflame.png\") center/contain no-repeat;box-shadow:0 3px 8px rgba(23,21,16,.15)}' +
        '.streak-pill-label{color:#5a5863;font-size:.78rem;font-weight:800;letter-spacing:.03em;text-transform:uppercase}' +
        '.streak-pill-value{color:#1b1b1f;font-size:1rem;line-height:1}' +
        '.stats-wrap{position:relative;display:inline-flex;align-items:center}' +
      '.stats-panel{position:absolute;top:calc(100% + 10px);right:0;width:min(338px,88vw);padding:12px;border-radius:14px;border:1px solid #e2d8cb;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(250,247,241,.96));box-shadow:0 16px 36px rgba(23,21,16,.12);display:grid;gap:8px;z-index:120;opacity:0;transform:translateY(6px) scale(.98);pointer-events:none;transition:opacity .18s ease,transform .18s ease}' +
      '.stats-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '.stats-panel-title{font-size:.88rem;color:#1b1b1f;letter-spacing:.02em;text-transform:uppercase;border-bottom:1px dashed rgba(33,92,75,.24);padding-bottom:6px;margin-bottom:2px}' +
      '.stats-panel-subtitle{font-size:.72rem;color:#7a746b;letter-spacing:.08em;text-transform:uppercase;font-weight:800;margin-top:4px}' +
      '.stats-row{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#5a5863;font-size:.9rem}' +
      '.stats-row strong{color:#1b1b1f;font-size:.92rem}' +
      '.push-widget{position:fixed;bottom:18px;right:18px;z-index:110;width:min(320px,86vw);background:rgba(255,255,255,.95);border:1px solid #e2d8cb;border-radius:18px;box-shadow:0 16px 36px rgba(23,21,16,.12);padding:16px;display:grid;gap:8px}' +
      '.push-header{display:flex;align-items:center;justify-content:space-between;gap:10px}.push-title{font-size:1rem;font-weight:800;color:#1b1b1f}.push-close{appearance:none;border:0;background:transparent;color:#7a7685;font:700 1.05rem/1 system-ui,sans-serif;cursor:pointer;padding:2px 4px;border-radius:999px}.push-close:hover{background:rgba(27,27,31,.06);color:#1b1b1f}.push-close:focus-visible{outline:2px solid rgba(27,27,31,.2);outline-offset:2px}.push-text{margin:0;color:#5a5863;font-size:.9rem}.push-actions{display:flex;gap:8px;flex-wrap:wrap}.push-status{margin:0;font-size:.86rem;min-height:18px}.push-status.ok{color:#166534}.push-status.err{color:#b91c1c}' +
      '.sc-sound-toggle{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:8px 12px;border-radius:999px;border:1px solid rgba(33,92,75,.2);background:rgba(255,255,255,.94);box-shadow:0 10px 22px rgba(23,21,16,.08);color:#1b1b1f;font:800 .78rem/1 Manrope,system-ui,sans-serif;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}' +
      '.sc-sound-toggle:hover,.sc-sound-toggle:focus-visible{transform:translateY(-1px);box-shadow:0 14px 26px rgba(23,21,16,.12)}' +
      '.sc-sound-toggle.is-off{background:rgba(255,255,255,.84);color:#6b7280}' +
      '.sc-sound-toggle.is-floating{position:fixed;top:92px;right:14px;z-index:2147482999}' +
      '.sc-sound-toggle.is-library-floating{top:14px;left:14px;right:auto}' +
      '.sc-corner-tag{position:fixed;right:14px;bottom:14px;z-index:2147483000;color:rgba(15,23,42,.7);text-decoration:none;font:700 .8rem/1.1 \"Courier New\",\"SFMono-Regular\",Consolas,monospace;letter-spacing:.06em;opacity:.88;text-shadow:0 1px 2px rgba(255,255,255,.72);transition:opacity .18s ease,transform .18s ease}' +
      '.sc-corner-tag:hover,.sc-corner-tag:focus-visible{opacity:1;transform:translateY(-1px)}' +
      '.sc-corner-tag:focus-visible{outline:2px solid rgba(15,23,42,.18);outline-offset:3px;border-radius:999px}' +
      '@media (max-width:680px){.sc-sound-toggle.is-floating{top:82px;right:10px;min-height:36px;padding:7px 10px;font-size:.72rem}.sc-sound-toggle.is-library-floating{top:10px;left:10px;right:auto}.sc-corner-tag{right:10px;bottom:10px;font-size:.72rem}}'
    document.head.appendChild(style)
  }

  ensureGlobalUiStyles()

  function mountSoundToggle() {
    if (!document.body) return
    let toggle = document.querySelector('[data-sc-sound-toggle]')
    if (!toggle) {
      toggle = document.createElement('button')
      toggle.type = 'button'
      toggle.className = 'sc-sound-toggle'
      toggle.setAttribute('data-sc-sound-toggle', '1')
      const topbarInner = document.querySelector('.topbar-inner')
      if (topbarInner && !isLibraryContext) {
        const navToggleButton = topbarInner.querySelector('[data-nav-toggle]')
        if (navToggleButton) {
          topbarInner.insertBefore(toggle, navToggleButton)
        } else {
          topbarInner.appendChild(toggle)
        }
      } else {
        toggle.classList.add('is-floating')
        if (isLibraryContext) toggle.classList.add('is-library-floating')
        document.body.appendChild(toggle)
      }
      toggle.addEventListener('click', function () {
        unlockAppSound()
        const nextEnabled = !soundState.enabled
        if (nextEnabled) {
          setSoundEnabled(true)
          playAppSound('toggleOn')
        } else {
          playAppSound('toggleOff')
          setSoundEnabled(false)
        }
      })
    }
    toggle.classList.toggle('is-floating', !document.querySelector('.topbar-inner') || isLibraryContext)
    toggle.classList.toggle('is-library-floating', !!isLibraryContext)
    updateSoundToggleUi()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSoundToggle, { once: true })
  } else {
    mountSoundToggle()
  }

  function mountCornerTag() {
    if (!document.body) return
    const existingTag =
      document.querySelector('[data-sc-corner-tag]') || document.querySelector('.deanacious-tag')
    if (existingTag) return

    const tag = document.createElement('a')
    tag.className = 'sc-corner-tag'
    tag.href = 'https://www.instagram.com/deanacious/'
    tag.target = '_blank'
    tag.rel = 'noopener noreferrer'
    tag.textContent = '@deanacious'
    tag.setAttribute('aria-label', 'Visit deanacious on Instagram')
    tag.setAttribute('data-sc-corner-tag', '1')
    document.body.appendChild(tag)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCornerTag, { once: true })
  } else {
    mountCornerTag()
  }

  function getLocalDateStamp(date) {
    const d = date instanceof Date ? date : new Date()
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 10)
  }

  function getYesterdayStamp() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - 1)
    return getLocalDateStamp(d)
  }

  function readStreakData() {
    try {
      const raw = localStorage.getItem(STREAK_KEY)
      if (!raw) return { streak: 0, bestStreak: 0, lastCheckIn: '' }
      const parsed = JSON.parse(raw)
      return {
        streak: Number(parsed.streak || 0),
        bestStreak: Number(parsed.bestStreak || 0),
        lastCheckIn: String(parsed.lastCheckIn || ''),
      }
    } catch (err) {
      return { streak: 0, bestStreak: 0, lastCheckIn: '' }
    }
  }

  function saveStreakData(data) {
    try {
      localStorage.setItem(STREAK_KEY, JSON.stringify(data))
    } catch (err) {
      // ignore storage errors
    }
  }

  function updateDailyStreak() {
    const today = getLocalDateStamp(new Date())
    const yesterday = getYesterdayStamp()
    const data = readStreakData()

    if (data.lastCheckIn === today) {
      return data
    }

    if (data.lastCheckIn === yesterday) {
      data.streak = Math.max(1, data.streak + 1)
    } else {
      data.streak = 1
    }

    data.lastCheckIn = today
    data.bestStreak = Math.max(Number(data.bestStreak || 0), data.streak)
    saveStreakData(data)
    return data
  }

  function mountStreakPill(streakData) {
    const topbarInner = document.querySelector('.topbar-inner')
    if (!topbarInner) return null

    let pill = topbarInner.querySelector('[data-streak-pill]')
    if (!pill) {
      pill = document.createElement('div')
      pill.className = 'streak-pill'
      pill.setAttribute('data-streak-pill', '1')
      pill.innerHTML =
        '<span class="streak-pill-icon" aria-hidden="true"></span>' +
        '<span class="streak-pill-label">Streak</span>' +
        '<strong class="streak-pill-value" data-streak-value>0</strong>'
      const navToggle = topbarInner.querySelector('[data-nav-toggle]')
      if (navToggle) {
        topbarInner.insertBefore(pill, navToggle)
      } else {
        topbarInner.appendChild(pill)
      }
    }

    const valueEl = pill.querySelector('[data-streak-value]')
    const data = streakData || readStreakData()
    if (valueEl) valueEl.textContent = String(Math.max(0, Number(data.streak || 0)))
    pill.title = 'Best streak: ' + String(Math.max(0, Number(data.bestStreak || 0))) + ' days'
    return pill
  }

  function readUsageData() {
    try {
      const raw = localStorage.getItem(USAGE_KEY)
      if (!raw) return { totalMs: 0 }
      const parsed = JSON.parse(raw)
      return { totalMs: Math.max(0, Number(parsed.totalMs || 0)) }
    } catch (err) {
      return { totalMs: 0 }
    }
  }

  function cleanPageName(name) {
    const value = String(name || currentPage || 'index.html').toLowerCase()
    if (value === 'index.html') return 'Home'
    if (value === 'study-library.html') return 'Science'
    if (value === 'geography-library.html') return 'Geography'
    if (value === 'grade-10-math.html') return 'Math 10'
    if (value === 'math-quiz-simulator.html') return 'Quiz Tool'
    if (value === 'services.html') return 'Tools'
    if (value === 'subjects.html') return 'Subjects'
    if (value === 'work.html') return 'Library'
    if (value === 'about.html') return 'About'
    if (value === 'contact.html') return 'Feedback'
    if (value === 'index.html') return 'Home'
    if (value.indexOf('/math/') !== -1 || value === 'math/index.html') return 'Math 9'
    if (value.indexOf('anki') !== -1) return 'Concept Cards'
    return value.replace('.html', '').replace(/[-_/]+/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase() })
  }

  function readAnalyticsData() {
    try {
      const raw = localStorage.getItem(ANALYTICS_KEY)
      if (!raw) return { pageVisits: {}, pageMs: {}, focusMs: 0, focusBreaks: 0, focusWarnings: 0, sessionsCompleted: 0 }
      const parsed = JSON.parse(raw)
      return {
        pageVisits: parsed && parsed.pageVisits ? parsed.pageVisits : {},
        pageMs: parsed && parsed.pageMs ? parsed.pageMs : {},
        focusMs: Math.max(0, Number((parsed && parsed.focusMs) || 0)),
        focusBreaks: Math.max(0, Number((parsed && parsed.focusBreaks) || 0)),
        focusWarnings: Math.max(0, Number((parsed && parsed.focusWarnings) || 0)),
        sessionsCompleted: Math.max(0, Number((parsed && parsed.sessionsCompleted) || 0)),
      }
    } catch (_err) {
      return { pageVisits: {}, pageMs: {}, focusMs: 0, focusBreaks: 0, focusWarnings: 0, sessionsCompleted: 0 }
    }
  }

  function saveAnalyticsData(data) {
    try {
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data))
    } catch (_err) {
      // ignore storage errors
    }
  }

  function readFocusSessionSnapshot() {
    try {
      const raw = localStorage.getItem(FOCUS_SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (_err) {
      return null
    }
  }

  function applyFocusSessionAnalytics(analytics) {
    const session = readFocusSessionSnapshot()
    if (!session || !session.completedAt) return
    const marker = String(session.completedAt)
    if (analytics.lastFocusSessionMarker === marker) return
    analytics.focusMs += Math.max(0, Number(session.focusedMs || 0))
    analytics.focusBreaks += Math.max(0, Number(session.breakCount || 0))
    analytics.focusWarnings += Math.max(0, Number(session.warningCount || 0))
    analytics.sessionsCompleted += session.completed ? 1 : 0
    analytics.lastFocusSessionMarker = marker
  }

  function getLiveFocusStats(analytics) {
    const session = readFocusSessionSnapshot()
    const base = {
      focusedMs: Math.max(0, Number((analytics && analytics.focusMs) || 0)),
      breakCount: Math.max(0, Number((analytics && analytics.focusBreaks) || 0)),
      warningCount: Math.max(0, Number((analytics && analytics.focusWarnings) || 0)),
    }
    if (!session) return base
    if (session.completed && session.completedAt) return base
    base.focusedMs += Math.max(0, Number(session.focusedMs || 0))
    base.breakCount += Math.max(0, Number(session.breakCount || 0))
    base.warningCount += Math.max(0, Number(session.warningCount || 0))
    return base
  }

  function saveUsageData(data) {
    try {
      localStorage.setItem(USAGE_KEY, JSON.stringify(data))
    } catch (err) {
      // ignore storage errors
    }
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    if (hours > 0) return hours + 'h ' + minutes + 'm'
    if (minutes > 0) return minutes + 'm ' + seconds + 's'
    return seconds + 's'
  }

  function mountStatsButton(streakData) {
    const topbarInner = document.querySelector('.topbar-inner')
    if (!topbarInner) return

    let wrapper = topbarInner.querySelector('[data-stats-wrap]')
    if (!wrapper) {
      wrapper = document.createElement('div')
      wrapper.className = 'stats-wrap'
      wrapper.setAttribute('data-stats-wrap', '1')
      wrapper.innerHTML =
        '<button class="btn btn-secondary stats-btn" type="button" data-stats-toggle aria-expanded="false">Statistics</button>' +
        '<div class="stats-panel" data-stats-panel>' +
        '<div class="stats-panel-title">Your stats</div>' +
        '<div class="stats-row"><span>Streak</span><strong data-stats-streak>0 days</strong></div>' +
        '<div class="stats-row"><span>Time spent</span><strong data-stats-spent>0s</strong></div>' +
        '<div class="stats-row"><span>Time logged in</span><strong data-stats-session>0s</strong></div>' +
        '<div class="stats-panel-subtitle">Study analytics</div>' +
        '<div class="stats-row"><span>Focused time</span><strong data-stats-focus>0m</strong></div>' +
        '<div class="stats-row"><span>Breaks caught</span><strong data-stats-breaks>0</strong></div>' +
        '<div class="stats-row"><span>Warnings sent</span><strong data-stats-warnings>0</strong></div>' +
        '<div class="stats-row"><span>Top page</span><strong data-stats-top-page>Home</strong></div>' +
        '<div class="stats-row"><span>Page visits</span><strong data-stats-visits>0</strong></div>' +
        '<div class="stats-row"><span>Notifications</span><strong data-stats-notifs>Unavailable</strong></div>' +
        '</div>'
      const navToggleBtn = topbarInner.querySelector('[data-nav-toggle]')
      if (navToggleBtn) {
        topbarInner.insertBefore(wrapper, navToggleBtn)
      } else {
        topbarInner.appendChild(wrapper)
      }
    }

    const toggleBtn = wrapper.querySelector('[data-stats-toggle]')
    const panel = wrapper.querySelector('[data-stats-panel]')
    const streakEl = wrapper.querySelector('[data-stats-streak]')
    const spentEl = wrapper.querySelector('[data-stats-spent]')
    const sessionEl = wrapper.querySelector('[data-stats-session]')
    const focusEl = wrapper.querySelector('[data-stats-focus]')
    const breaksEl = wrapper.querySelector('[data-stats-breaks]')
    const warningsEl = wrapper.querySelector('[data-stats-warnings]')
    const topPageEl = wrapper.querySelector('[data-stats-top-page]')
    const visitsEl = wrapper.querySelector('[data-stats-visits]')
    const notifsEl = wrapper.querySelector('[data-stats-notifs]')

    const usage = readUsageData()
    const analytics = readAnalyticsData()
    const sessionStartedAt = Date.now()
    let pendingVisibleMs = 0
    let activeStartedAt = document.visibilityState === 'visible' ? Date.now() : 0
    const analyticsPageKey = currentPage || 'index.html'
    analytics.pageVisits[analyticsPageKey] = Math.max(0, Number(analytics.pageVisits[analyticsPageKey] || 0)) + 1
    applyFocusSessionAnalytics(analytics)
    saveAnalyticsData(analytics)

    function flushActiveTime() {
      if (!activeStartedAt) return
      pendingVisibleMs += Date.now() - activeStartedAt
      activeStartedAt = 0
    }

    function persistUsage() {
      if (pendingVisibleMs <= 0) return
      usage.totalMs += pendingVisibleMs
      analytics.pageMs[analyticsPageKey] = Math.max(0, Number(analytics.pageMs[analyticsPageKey] || 0)) + pendingVisibleMs
      pendingVisibleMs = 0
      saveUsageData(usage)
      saveAnalyticsData(analytics)
    }

    function getLiveVisibleMs() {
      return activeStartedAt ? Date.now() - activeStartedAt : 0
    }

    function getNotificationStatus() {
      const pushSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
      if (!pushSupported) return 'Not supported'
      if (Notification.permission === 'granted') return 'Enabled'
      if (Notification.permission === 'denied') return 'Blocked'
      return 'Available'
    }

    function getTopPageLabel() {
      let winner = analyticsPageKey
      let winnerMs = -1
      Object.keys(analytics.pageMs || {}).forEach(function (page) {
        const ms = Math.max(0, Number(analytics.pageMs[page] || 0))
        if (ms > winnerMs) {
          winner = page
          winnerMs = ms
        }
      })
      return cleanPageName(winner)
    }

    function updateStatsUI() {
      const streak = Math.max(0, Number((streakData && streakData.streak) || 0))
      applyFocusSessionAnalytics(analytics)
      const liveFocus = getLiveFocusStats(analytics)
      if (streakEl) streakEl.textContent = streak + (streak === 1 ? ' day' : ' days')
      if (spentEl) spentEl.textContent = formatDuration(usage.totalMs + pendingVisibleMs + getLiveVisibleMs())
      if (sessionEl) sessionEl.textContent = formatDuration(Date.now() - sessionStartedAt)
      if (focusEl) focusEl.textContent = formatDuration(liveFocus.focusedMs || 0)
      if (breaksEl) breaksEl.textContent = String(Math.max(0, Number(liveFocus.breakCount || 0)))
      if (warningsEl) warningsEl.textContent = String(Math.max(0, Number(liveFocus.warningCount || 0)))
      if (topPageEl) topPageEl.textContent = getTopPageLabel()
      if (visitsEl) visitsEl.textContent = String(Math.max(0, Number(analytics.pageVisits[analyticsPageKey] || 0)))
      if (notifsEl) notifsEl.textContent = getNotificationStatus()
      saveAnalyticsData(analytics)
    }

    function setPanelOpen(open) {
      if (!panel || !toggleBtn) return
      panel.classList.toggle('open', !!open)
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', function () {
        const isOpen = panel.classList.contains('open')
        setPanelOpen(!isOpen)
        playAppSound(isOpen ? 'tap' : 'panel')
        if (!isOpen) updateStatsUI()
      })
    }

    if (window.matchMedia('(hover: hover)').matches && panel) {
      wrapper.addEventListener('mouseenter', function () {
        setPanelOpen(true)
        updateStatsUI()
      })
      wrapper.addEventListener('mouseleave', function () {
        setPanelOpen(false)
      })
    }

    document.addEventListener('click', function (event) {
      if (!panel || !panel.classList.contains('open')) return
      if (wrapper.contains(event.target)) return
      setPanelOpen(false)
    })

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !panel || !panel.classList.contains('open')) return
      setPanelOpen(false)
    })

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        flushActiveTime()
        persistUsage()
      } else if (!activeStartedAt) {
        activeStartedAt = Date.now()
      }
      updateStatsUI()
    })

    window.addEventListener('pagehide', function () {
      flushActiveTime()
      persistUsage()
    })

    document.addEventListener('sc:push-state-changed', updateStatsUI)
    setInterval(updateStatsUI, 1000)
    updateStatsUI()
  }

  const streakData = updateDailyStreak()
  mountStreakPill(streakData)
  mountStatsButton(streakData)

  // Sign-in feature removed by request.

  const reveals = Array.from(document.querySelectorAll('.reveal'))
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.15 },
    )
    reveals.forEach(function (el) {
      revealObserver.observe(el)
    })
  }

  const counters = Array.from(document.querySelectorAll('[data-counter]'))
  if (counters.length) {
    const animateCounter = function (el) {
      const target = Number(el.getAttribute('data-counter') || 0)
      const duration = 1100
      const start = performance.now()

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1)
        const value = Math.floor(target * progress)
        el.textContent = String(value)
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }

    const counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          const el = entry.target
          if (el.dataset.done === '1') return
          el.dataset.done = '1'
          animateCounter(el)
          obs.unobserve(el)
        })
      },
      { threshold: 0.55 },
    )

    counters.forEach(function (el) {
      counterObserver.observe(el)
    })
  }

  const faqItems = Array.from(document.querySelectorAll('.faq-item'))
  faqItems.forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger')
    const content = item.querySelector('.faq-content')
    if (!trigger || !content) return

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open')
      faqItems.forEach(function (other) {
        other.classList.remove('open')
        const panel = other.querySelector('.faq-content')
        if (panel) panel.style.maxHeight = '0px'
      })

      if (!isOpen) {
        item.classList.add('open')
        content.style.maxHeight = content.scrollHeight + 'px'
      }
      playAppSound(isOpen ? 'tap' : 'panel')
    })
  })

  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'))
  const filterCards = Array.from(document.querySelectorAll('[data-category]'))
  if (filterButtons.length && filterCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter') || 'all'
        filterButtons.forEach(function (node) {
          node.classList.remove('active')
        })
        btn.classList.add('active')
        playAppSound('filter')

        filterCards.forEach(function (card) {
          const category = card.getAttribute('data-category') || ''
          const show = filter === 'all' || filter === category
          card.style.display = show ? 'block' : 'none'
        })
      })
    })
  }

  const roadmap = document.querySelector('[data-roadmap]')
  if (roadmap) {
    const tabs = Array.from(roadmap.querySelectorAll('[data-roadmap-tab]'))
    const panels = Array.from(roadmap.querySelectorAll('[data-roadmap-panel]'))
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-roadmap-tab')
        tabs.forEach(function (btn) {
          btn.classList.remove('active')
          btn.setAttribute('aria-selected', 'false')
        })
        panels.forEach(function (panel) {
          panel.classList.remove('active')
        })

        tab.classList.add('active')
        tab.setAttribute('aria-selected', 'true')
        playAppSound('panel')
        const panel = roadmap.querySelector('[data-roadmap-panel="' + target + '"]')
        if (panel) panel.classList.add('active')
      })
    })
  }

  const switchers = Array.from(document.querySelectorAll('[data-switcher]'))
  switchers.forEach(function (switcher) {
    const buttons = Array.from(switcher.querySelectorAll('[data-switch]'))
    const panels = Array.from(switcher.querySelectorAll('[data-switch-panel]'))
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-switch')
        buttons.forEach(function (node) {
          node.classList.remove('active')
          node.setAttribute('aria-selected', 'false')
        })
        panels.forEach(function (panel) {
          panel.classList.remove('active')
        })
        btn.classList.add('active')
        btn.setAttribute('aria-selected', 'true')
        playAppSound('panel')
        const panel = switcher.querySelector('[data-switch-panel="' + target + '"]')
        if (panel) panel.classList.add('active')
      })
    })
  })

  const feedbackChoice = document.querySelector('[data-feedback-choice]')
  if (feedbackChoice) {
    const buttons = Array.from(feedbackChoice.querySelectorAll('[data-feedback-type]'))
    const hidden = document.querySelector('input[name="feedback_type"]')
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (node) {
          node.classList.remove('active')
        })
        btn.classList.add('active')
        playAppSound('tap')
        if (hidden) hidden.value = btn.getAttribute('data-feedback-type') || 'feedback'
      })
    })
  }

  const contactForm = document.querySelector('[data-contact-form]')
  if (contactForm) {
    const status = contactForm.querySelector('[data-form-status]')
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault()

      const name = (contactForm.querySelector('[name="name"]') || {}).value || ''
      const email = (contactForm.querySelector('[name="email"]') || {}).value || ''
      const message = (contactForm.querySelector('[name="message"]') || {}).value || ''
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      if (!name.trim() || !emailOk || message.trim().length < 20) {
        if (status) {
          status.textContent = 'Please provide a valid name, email, and a message with at least 20 characters.'
          status.className = 'form-status err'
        }
        playAppSound('error')
        return
      }

      if (status) {
        status.textContent = 'Thanks for the feedback. We have received it.'
        status.className = 'form-status ok'
      }
      playAppSound('success')
      contactForm.reset()
    })
  }

  let deferredPrompt = null
  const installBtn = document.querySelector('[data-install-btn]')
  const installHint = document.querySelector('[data-install-hint]')
  const isIos =
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios|opr\//i.test(navigator.userAgent)
  const standaloneMql = window.matchMedia('(display-mode: standalone)')
  const INSTALL_STATE_KEY = 'sc_app_installed'

  function isStandaloneMode() {
    return standaloneMql.matches || !!navigator.standalone
  }

  function isAppInstalled() {
    if (isStandaloneMode()) return true
    try {
      return localStorage.getItem(INSTALL_STATE_KEY) === '1'
    } catch (err) {
      return false
    }
  }

  function setInstalledState(value) {
    try {
      localStorage.setItem(INSTALL_STATE_KEY, value ? '1' : '0')
    } catch (err) {
      // ignore storage errors
    }
  }

  function updateInstallUiVisibility() {
    const installed = isAppInstalled()
    if (installBtn) {
      installBtn.style.display = installed ? 'none' : ''
      installBtn.setAttribute('aria-hidden', installed ? 'true' : 'false')
    }
    if (installHint) {
      installHint.classList.toggle('is-visible', !installed && isIos && !isStandaloneMode())
      installHint.style.display = installed ? 'none' : ''
    }
  }

  function ensureIosInstallStyles() {
    if (document.getElementById('ios-install-style')) return
    const style = document.createElement('style')
    style.id = 'ios-install-style'
    style.textContent =
      '.ios-install-overlay{position:fixed;inset:0;background:rgba(2,6,23,.7);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:16px}' +
      '.ios-install-card{width:min(520px,100%);background:#fff;border-radius:16px;padding:16px 16px 14px;box-shadow:0 20px 40px rgba(0,0,0,.24);font-family:Inter,system-ui,sans-serif}' +
      '.ios-install-card h3{margin:0 0 8px;font-size:1.05rem;color:#0f172a}' +
      '.ios-install-card p{margin:0 0 8px;color:#334155;font-size:.95rem}' +
      '.ios-install-card ol{margin:8px 0 12px 20px;padding:0;color:#1e293b;font-size:.92rem;line-height:1.45}' +
      '.ios-install-actions{display:flex;gap:8px;justify-content:flex-end}' +
      '.ios-install-actions button{border:0;border-radius:999px;padding:8px 12px;font-weight:700;cursor:pointer}' +
      '.ios-install-actions .secondary{background:#e2e8f0;color:#0f172a}' +
      '.ios-install-actions .primary{background:#0f172a;color:#fff}'
    document.head.appendChild(style)
  }

  function showIosInstallGuide() {
    ensureIosInstallStyles()
    const existing = document.querySelector('.ios-install-overlay')
    if (existing) existing.remove()

    const overlay = document.createElement('div')
    overlay.className = 'ios-install-overlay'
    overlay.innerHTML =
      '<div class="ios-install-card" role="dialog" aria-modal="true" aria-label="Install app on iPhone">' +
      '<h3>Install on iPhone/iPad</h3>' +
      '<p>Apple does not allow automatic Home Screen install. Use these quick steps in Safari:</p>' +
      '<ol>' +
      '<li>Tap the Share icon in Safari.</li>' +
      '<li>Tap <strong>Add to Home Screen</strong>.</li>' +
      '<li>Tap <strong>Add</strong>.</li>' +
      '</ol>' +
      (isSafari
        ? ''
        : '<p><strong>Note:</strong> You are not in Safari. Open this page in Safari first.</p>') +
      '<div class="ios-install-actions">' +
      '<button type="button" class="secondary" data-ios-close>Close</button>' +
      '<button type="button" class="primary" data-ios-share>Try Share Sheet</button>' +
      '</div>' +
      '</div>'

    function closeGuide() {
      overlay.remove()
    }

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeGuide()
    })

    overlay.querySelector('[data-ios-close]').addEventListener('click', closeGuide)
    overlay.querySelector('[data-ios-share]').addEventListener('click', function () {
      if (navigator.share) {
        navigator
          .share({
            title: document.title || 'Soul Concept',
            text: 'Install Soul Concept on your Home Screen',
            url: location.href,
          })
          .catch(function () {
            // keep the guide open if share is cancelled/blocked
          })
      } else {
        try {
          navigator.clipboard.writeText(location.href).catch(function () {
            // ignore clipboard errors
          })
        } catch (err) {
          // ignore clipboard errors
        }
      }
    })

    document.body.appendChild(overlay)
  }

  if (installBtn) {
    installBtn.addEventListener('click', function () {
      playAppSound('panel')
      if (isAppInstalled()) {
        updateInstallUiVisibility()
        return
      }

      if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice
          .then(function (choice) {
            if (choice && choice.outcome === 'accepted') {
              setInstalledState(true)
            }
          })
          .finally(function () {
            deferredPrompt = null
            updateInstallUiVisibility()
          })
        return
      }

      if (isIos && !isStandaloneMode()) {
        if (installHint) installHint.classList.add('is-visible')
        showIosInstallGuide()
        return
      }

      alert('To install, use your browser menu and choose “Install app” or “Add to Home Screen”.')
    })
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault()
    deferredPrompt = event
    updateInstallUiVisibility()
  })

  window.addEventListener('appinstalled', function () {
    setInstalledState(true)
    deferredPrompt = null
    updateInstallUiVisibility()
    playAppSound('success')
  })

  if (isStandaloneMode()) {
    setInstalledState(true)
  }
  updateInstallUiVisibility()

  if (standaloneMql && standaloneMql.addEventListener) {
    standaloneMql.addEventListener('change', function (event) {
      if (event.matches) setInstalledState(true)
      updateInstallUiVisibility()
    })
  }

  let serviceWorkerRegistrationPromise = null
  function ensureServiceWorkerRegistration() {
    if (!('serviceWorker' in navigator)) {
      return Promise.reject(new Error('Service workers are not supported in this browser.'))
    }
    if (!serviceWorkerRegistrationPromise) {
      serviceWorkerRegistrationPromise = navigator.serviceWorker
        .register('/sw.js')
        .catch(function (err) {
          serviceWorkerRegistrationPromise = null
          console.warn('Service worker registration failed:', err)
          throw err
        })
    }
    return serviceWorkerRegistrationPromise
  }
  if ('serviceWorker' in navigator) {
    ensureServiceWorkerRegistration().catch(function () {
      // handled when notifications are enabled explicitly
    })
  }

  {
    const canUsePush = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
    const FALLBACK_VAPID_PUBLIC_KEY = 'BIptAgkzTLTyM-5j3k1cfGKC0OQ6UXfvoZ84LcKErhV2_pxosPHfkze4O7utCrLPXJcjTKwbmaUz1i2YcPnSrrw'
    let vapidPublicKeyPromise = null
    const pushAlreadyEnabled = Notification.permission === 'granted'
    if (Notification.permission !== 'granted') {
      try {
        localStorage.removeItem(PUSH_ENABLED_KEY)
      } catch (err) {
        // ignore storage errors
      }
    }
    if (pushAlreadyEnabled) {
      try {
        localStorage.setItem(PUSH_ENABLED_KEY, '1')
        localStorage.removeItem(PUSH_WIDGET_DISMISSED_KEY)
      } catch (err) {
        // ignore storage errors
      }
      document.dispatchEvent(new Event('sc:push-state-changed'))
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }
    async function getVapidPublicKey() {
      if (vapidPublicKeyPromise) return vapidPublicKeyPromise
      vapidPublicKeyPromise = fetch('/api/push-config', {
        headers: { Accept: 'application/json' }
      })
        .then(async function (res) {
          if (!res.ok) {
            throw new Error('Push config request failed (' + res.status + ').')
          }
          const data = await res.json().catch(function () {
            return {}
          })
          const key = data && typeof data.vapidPublicKey === 'string' ? data.vapidPublicKey.trim() : ''
          if (!key) throw new Error('Missing VAPID public key.')
          return key
        })
        .catch(function () {
          return FALLBACK_VAPID_PUBLIC_KEY
        })
      return vapidPublicKeyPromise
    }

    async function ensurePushRegistration() {
      if (!canUsePush || Notification.permission !== 'granted') return
      try {
        await ensureServiceWorkerRegistration()
        const registration = await navigator.serviceWorker.ready
        let subscription = await registration.pushManager.getSubscription()
        if (!subscription) {
          const vapidPublicKey = await getVapidPublicKey()
          const key = urlBase64ToUint8Array(vapidPublicKey)
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
          })
        }
        await fetch('/api/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            userAgent: navigator.userAgent || ''
          })
        }).catch(function () {
          // best-effort sync only
        })
      } catch (err) {
        // keep app usable even if push sync fails
      }
    }

    if (pushAlreadyEnabled) {
      ensurePushRegistration()
    }

    let pushWidgetDismissed = false
    try {
      pushWidgetDismissed = localStorage.getItem(PUSH_WIDGET_DISMISSED_KEY) === '1'
    } catch (err) {
      // ignore storage errors
    }
    const shouldShowWidget = !pushAlreadyEnabled && !pushWidgetDismissed
    if (!shouldShowWidget) {
      // do not show repeated widget once push has already been enabled
    } else {
      const widget = document.createElement('div')
      widget.className = 'push-widget'
      if (document.getElementById('lyne-widget')) {
        widget.style.bottom = '176px'
      }
      widget.innerHTML =
        '<div class="push-header">' +
        '<div class="push-title">Sign up for notifications</div>' +
        '<button class="push-close" type="button" aria-label="Dismiss notifications prompt" data-push-close>&times;</button>' +
        '</div>' +
        '<p class="push-text">Get study reminders and update alerts.</p>' +
        '<div class="push-actions">' +
        '<button class="btn btn-secondary" type="button" data-push-enable>Enable</button>' +
        '</div>' +
        '<p class="push-status" data-push-status></p>'
      document.body.appendChild(widget)

      const statusEl = widget.querySelector('[data-push-status]')
      const enableBtn = widget.querySelector('[data-push-enable]')
      const closeBtn = widget.querySelector('[data-push-close]')

      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          try {
            localStorage.setItem(PUSH_WIDGET_DISMISSED_KEY, '1')
          } catch (err) {
            // ignore storage errors
          }
          playAppSound('tap')
          widget.remove()
        })
      }

      function setStatus(message, isError) {
        if (!statusEl) return
        statusEl.textContent = message
        statusEl.className = isError ? 'push-status err' : 'push-status ok'
      }

      async function getSubscription() {
        await ensureServiceWorkerRegistration()
        const registration = await navigator.serviceWorker.ready
        let subscription = await registration.pushManager.getSubscription()
        if (!subscription) {
          const vapidPublicKey = await getVapidPublicKey()
          const key = urlBase64ToUint8Array(vapidPublicKey)
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: key
          })
        }
        localStorage.setItem('sc_push_subscription', JSON.stringify(subscription))
        return subscription
      }

      async function saveSubscription(subscription) {
        let res
        try {
          res = await fetch('/api/push-subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subscription,
              userAgent: navigator.userAgent || ''
            })
          })
        } catch (err) {
          return { persisted: false, reason: 'network_unavailable' }
        }
        if (!res.ok) {
          const text = await res.text()
          // Allow local/device notifications to work even if server persistence is unavailable.
          if ((text || '').indexOf('Missing Supabase server env vars') !== -1) {
            return { persisted: false, reason: 'supabase_not_configured' }
          }
          return { persisted: false, reason: 'server_rejected' }
        }
        return { persisted: true }
      }

      async function sendPushPayload(subscription, payload) {
      const endpoints = ['/api/send-push', '/api/send-push.js', '/.netlify/functions/send-push']
      let lastError = 'Failed to send notification.'
      for (let i = 0; i < endpoints.length; i += 1) {
        const endpoint = endpoints[i]
        let res
        try {
          res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription, payload })
          })
        } catch (err) {
          lastError = err && err.message ? err.message : lastError
          continue
        }
        if (res.ok) return
        const text = await res.text()
        if (res.status !== 404) {
          throw new Error(text || ('Push request failed (' + res.status + ').'))
        }
        if (text) lastError = text
      }
      throw new Error(lastError)
      }

      async function sendTemplate(templateKey) {
      const templates = {
        test: {
          title: 'Soul Concept',
          body: 'Test notification received.',
          url: '/',
          type: 'general',
          tag: 'sc-test',
          requireInteraction: false
        },
        update: {
          title: 'New in Grade 10 Math',
          body: 'Fresh UI updates are live. Tap to explore the newest library.',
          url: '/grade-10-math.html',
          type: 'update',
          tag: 'sc-update',
          requireInteraction: false
        },
        reminder: {
          title: 'Study Reminder',
          body: 'Quick 15-minute review now can save you hours later.',
          url: '/study-library.html',
          type: 'reminder',
          tag: 'sc-reminder',
          requireInteraction: true
        },
        streak: {
          title: 'Keep Your Streak',
          body: 'You are one focused session away from extending your streak.',
          url: '/work.html',
          type: 'streak',
          tag: 'sc-streak',
          requireInteraction: true
        }
      }
      const payload = templates[templateKey] || templates.test
      const subscription = await getSubscription()
      await sendPushPayload(subscription, payload)
      }

      async function showInstantLocalNotification(templateKey) {
        const templates = {
          test: {
            title: 'Soul Concept',
            body: 'Test notification received.',
            url: '/',
            type: 'general',
            tag: 'sc-test',
            requireInteraction: false
          },
          update: {
            title: 'New in Grade 10 Math',
            body: 'Fresh UI updates are live. Tap to explore the newest library.',
            url: '/grade-10-math.html',
            type: 'update',
            tag: 'sc-update',
            requireInteraction: false
          },
          reminder: {
            title: 'Study Reminder',
            body: 'Quick 15-minute review now can save you hours later.',
            url: '/study-library.html',
            type: 'reminder',
            tag: 'sc-reminder',
            requireInteraction: true
          },
          streak: {
            title: 'Keep Your Streak',
            body: 'You are one focused session away from extending your streak.',
            url: '/work.html',
            type: 'streak',
            tag: 'sc-streak',
            requireInteraction: true
          }
        }
        const payload = templates[templateKey] || templates.test
        try {
          await ensureServiceWorkerRegistration()
          const registration = await navigator.serviceWorker.ready
          await registration.showNotification(payload.title, {
            body: payload.body,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            tag: payload.tag || ('sc-' + (payload.type || 'general')),
            renotify: true,
            requireInteraction: !!payload.requireInteraction,
            actions: [
              { action: 'open', title: 'Open' },
              { action: 'dismiss', title: 'Dismiss' }
            ],
            data: { url: payload.url || '/', type: payload.type || 'general' }
          })
          return
        } catch (err) {
          // fallback for browsers that do not expose SW notifications reliably
        }
        try {
          if (Notification.permission === 'granted') {
            new Notification(payload.title, {
              body: payload.body,
              icon: '/icons/icon-192.png',
              tag: payload.tag || ('sc-' + (payload.type || 'general'))
            })
          }
        } catch (err) {
          // ignore fallback errors
        }
      }

      if (!canUsePush) {
        if (enableBtn) enableBtn.disabled = true
        setStatus('Push notifications are not supported in this browser.', true)
      } else {
        if (Notification.permission === 'denied') {
          setStatus('Notifications are blocked in browser settings. Enable them in site permissions first.', true)
        }
        enableBtn.addEventListener('click', async function () {
          try {
            if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !window.matchMedia('(display-mode: standalone)').matches) {
              setStatus('On iPhone/iPad, add this site to Home Screen first, then enable notifications from the installed app.', true)
              return
            }
            const permission = await Notification.requestPermission()
            if (permission !== 'granted') {
              try {
                localStorage.removeItem(PUSH_ENABLED_KEY)
              } catch (err) {
                // ignore storage errors
              }
              document.dispatchEvent(new Event('sc:push-state-changed'))
              playAppSound('error')
              setStatus('Permission denied.', true)
              return
            }
            try {
              localStorage.setItem(PUSH_ENABLED_KEY, '1')
              localStorage.removeItem(PUSH_WIDGET_DISMISSED_KEY)
            } catch (err) {
              // ignore storage errors
            }
            document.dispatchEvent(new Event('sc:push-state-changed'))
            const subscription = await getSubscription()
            const saveResult = await saveSubscription(subscription)
            await showInstantLocalNotification('streak')
            await sendTemplate('streak').catch(function () {
              // server push trigger is best-effort only
            })
            if (saveResult && saveResult.persisted === false) {
              setStatus('Enabled on this device. Server reminders need Supabase env vars.', false)
            } else {
              setStatus('Notifications enabled.', false)
            }
            playAppSound('success')
            setTimeout(function () {
              widget.remove()
            }, 900)
          } catch (err) {
            playAppSound('error')
            setStatus(err.message || 'Failed to enable notifications.', true)
          }
        })
      }
    }
  }
})()
