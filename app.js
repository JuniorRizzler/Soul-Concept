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

  const STREAK_KEY = 'sc_daily_streak_v1'
  const USAGE_KEY = 'sc_usage_stats_v1'
  const PUSH_ENABLED_KEY = 'sc_push_enabled'
  const PUSH_WIDGET_DISMISSED_KEY = 'sc_push_widget_dismissed_v1'

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
      '.stats-panel{position:absolute;top:calc(100% + 10px);right:0;width:min(300px,86vw);padding:12px;border-radius:14px;border:1px solid #e2d8cb;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(250,247,241,.96));box-shadow:0 16px 36px rgba(23,21,16,.12);display:grid;gap:8px;z-index:120;opacity:0;transform:translateY(6px) scale(.98);pointer-events:none;transition:opacity .18s ease,transform .18s ease}' +
      '.stats-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
      '.stats-panel-title{font-size:.88rem;color:#1b1b1f;letter-spacing:.02em;text-transform:uppercase;border-bottom:1px dashed rgba(33,92,75,.24);padding-bottom:6px;margin-bottom:2px}' +
      '.stats-row{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#5a5863;font-size:.9rem}' +
      '.stats-row strong{color:#1b1b1f;font-size:.92rem}' +
      '.push-widget{position:fixed;bottom:18px;right:18px;z-index:110;width:min(320px,86vw);background:rgba(255,255,255,.95);border:1px solid #e2d8cb;border-radius:18px;box-shadow:0 16px 36px rgba(23,21,16,.12);padding:16px;display:grid;gap:8px}' +
      '.push-header{display:flex;align-items:center;justify-content:space-between;gap:10px}.push-title{font-size:1rem;font-weight:800;color:#1b1b1f}.push-close{appearance:none;border:0;background:transparent;color:#7a7685;font:700 1.05rem/1 system-ui,sans-serif;cursor:pointer;padding:2px 4px;border-radius:999px}.push-close:hover{background:rgba(27,27,31,.06);color:#1b1b1f}.push-close:focus-visible{outline:2px solid rgba(27,27,31,.2);outline-offset:2px}.push-text{margin:0;color:#5a5863;font-size:.9rem}.push-actions{display:flex;gap:8px;flex-wrap:wrap}.push-status{margin:0;font-size:.86rem;min-height:18px}.push-status.ok{color:#166534}.push-status.err{color:#b91c1c}' +
      '.pp-demo-card{border:1px solid #e2d8cb;border-radius:14px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(250,247,241,.96));padding:14px;display:grid;gap:10px}' +
      '.pp-demo-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}.pp-demo-chip{display:inline-flex;align-items:center;padding:4px 9px;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.03em;text-transform:uppercase;background:rgba(33,92,75,.1);border:1px solid rgba(33,92,75,.24);color:#215c4b}' +
      '.pp-demo-input{width:100%;min-height:78px;resize:vertical;border:1px solid #d9ccbc;border-radius:10px;padding:10px 11px;font:500 .93rem/1.45 Manrope,system-ui,sans-serif;color:#1b1b1f;background:#fff}' +
      '.pp-demo-meta{font-size:.82rem;color:#5a5863}.pp-demo-answer{margin:0;white-space:pre-wrap;color:#1b1b1f;background:#fff;border:1px solid #eadfce;border-radius:10px;padding:10px 11px;min-height:52px}'
    document.head.appendChild(style)
  }

  ensureGlobalUiStyles()

  function mountPersonaPlexHomeDemo() {
    if (currentPage !== 'index.html') return
    if (document.querySelector('[data-pp-demo]')) return
    if (document.getElementById('lyne-widget')) return
    if (document.getElementById('pp-home-send')) return

    const librariesSection = document.getElementById('libraries')
    if (!librariesSection || !librariesSection.parentNode) return

    const section = document.createElement('section')
    section.className = 'section-tight'
    section.setAttribute('data-pp-demo', '1')
    section.innerHTML =
      '<div class="container reveal">' +
      '<p class="eyebrow">Live AI Check</p>' +
      '<h2 class="section-title">PersonaPlex on Home Page</h2>' +
      '<p class="section-lead">Use this quick test box to verify PersonaPlex is responding before opening any library.</p>' +
      '<div class="pp-demo-card">' +
      '<div class="pp-demo-head">' +
      '<strong>Ask PersonaPlex</strong>' +
      '<span class="pp-demo-chip">Provider: Puter.js (with OpenAI fallback)</span>' +
      '</div>' +
      '<textarea class="pp-demo-input" data-pp-input spellcheck="false">Explain linear equations in 3 simple steps.</textarea>' +
      '<div class="push-actions">' +
      '<button class="btn btn-primary" type="button" data-pp-send>Test PersonaPlex</button>' +
      '<a class="btn btn-secondary" href="study-library.html">Open Science Library</a>' +
      '</div>' +
      '<div class="pp-demo-meta" data-pp-meta>Idle.</div>' +
      '<p class="pp-demo-answer" data-pp-answer>Response will appear here.</p>' +
      '</div>' +
      '</div>'

    librariesSection.parentNode.insertBefore(section, librariesSection.nextSibling)

    const input = section.querySelector('[data-pp-input]')
    const sendBtn = section.querySelector('[data-pp-send]')
    const answer = section.querySelector('[data-pp-answer]')
    const meta = section.querySelector('[data-pp-meta]')
    if (!input || !sendBtn || !answer || !meta) return

    async function runPrompt() {
      const prompt = String(input.value || '').trim()
      if (!prompt) return
      sendBtn.disabled = true
      meta.textContent = 'Contacting Puter.js...'
      answer.textContent = 'Thinking...'
      try {
        if (!(window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function')) {
          throw new Error('Puter SDK not ready.')
        }
        const data = await window.puter.ai.chat(prompt, { model: 'gpt-4o-mini', stream: false })
        const model =
          (data && data.model && String(data.model)) ||
          (data && data.message && data.message.model && String(data.message.model)) ||
          'gpt-4o-mini'
        const text =
          (typeof data === 'string' && data) ||
          (data && typeof data.text === 'string' && data.text) ||
          (data && data.message && typeof data.message.content === 'string' && data.message.content) ||
          ''
        answer.textContent = String(text || '').trim() || '(No text returned.)'
        meta.textContent = 'Connected. Provider: puter.js | Model: ' + model
      } catch (err) {
        answer.textContent = 'Error: ' + (err && err.message ? err.message : 'Request failed.')
        meta.textContent = 'Failed. Make sure Puter is loaded and you are signed in.'
      } finally {
        sendBtn.disabled = false
      }
    }

    sendBtn.addEventListener('click', runPrompt)
  }

  if (document.readyState === 'complete') {
    mountPersonaPlexHomeDemo()
  } else {
    window.addEventListener('load', mountPersonaPlexHomeDemo, { once: true })
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
    const notifsEl = wrapper.querySelector('[data-stats-notifs]')

    const usage = readUsageData()
    const sessionStartedAt = Date.now()
    let pendingVisibleMs = 0
    let activeStartedAt = document.visibilityState === 'visible' ? Date.now() : 0

    function flushActiveTime() {
      if (!activeStartedAt) return
      pendingVisibleMs += Date.now() - activeStartedAt
      activeStartedAt = 0
    }

    function persistUsage() {
      if (pendingVisibleMs <= 0) return
      usage.totalMs += pendingVisibleMs
      pendingVisibleMs = 0
      saveUsageData(usage)
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

    function updateStatsUI() {
      const streak = Math.max(0, Number((streakData && streakData.streak) || 0))
      if (streakEl) streakEl.textContent = streak + (streak === 1 ? ' day' : ' days')
      if (spentEl) spentEl.textContent = formatDuration(usage.totalMs + pendingVisibleMs + getLiveVisibleMs())
      if (sessionEl) sessionEl.textContent = formatDuration(Date.now() - sessionStartedAt)
      if (notifsEl) notifsEl.textContent = getNotificationStatus()
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
        return
      }

      if (status) {
        status.textContent = 'Thanks for the feedback. We have received it.'
        status.className = 'form-status ok'
      }
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
            setTimeout(function () {
              widget.remove()
            }, 900)
          } catch (err) {
            setStatus(err.message || 'Failed to enable notifications.', true)
          }
        })
      }
    }
  }

  const TOUR_ACTIVE_KEY = 'sc_tour_active'
  const TOUR_STEP_KEY = 'sc_tour_step'
  const TOUR_NEVER_KEY = 'sc_tour_never_v2'

  const TOUR_STEPS = [
    {
      page: 'index.html',
      selector: '[data-tour-id="home-science"]',
      title: "Hi, I'm Dean",
      text: 'Start with the Grade 9 Science library for guided notes and key terms.',
      next: 'study-library.html'
    },
    {
      page: 'study-library.html',
      selector: '[data-tour-id="science-continue"]',
      title: 'Continue First',
      text: 'Press the Continue button at the bottom first to enter the science library.',
      next: 'study-library.html',
      requireClick: true
    },
    {
      page: 'study-library.html',
      selector: '[data-tour-id="anno-toggle"]',
      title: 'Annotations Bar',
      text: 'I opened the annotations bar for you. Use On to draw notes directly on the page.',
      next: 'study-library.html',
      autoExpandAnnotations: true,
      forceDrawingOff: true
    },
    {
      page: 'study-library.html',
      selector: '[data-tour-id="anno-toggle"]',
      title: 'Turn Annotations Off',
      text: 'Turn annotation mode Off to continue interacting with buttons, sections, and cards.',
      next: 'study-library.html',
      autoExpandAnnotations: true
    },
    {
      page: 'study-library.html',
      selector: '#qs-study-notes-content',
      title: 'Study Notes And Content',
      text: 'Start in Study Notes & Content first. This is where the main science sections are organized.',
      next: 'study-library.html'
    },
    {
      page: 'study-library.html',
      selector: '#qs-practice-test-preparation',
      title: 'Practice And Test Prep',
      text: 'After notes, go to Practice & Test Preparation to review and check what you remember.',
      next: 'study-library.html'
    },
    {
      page: 'study-library.html',
      selector: '[data-tour-id="exit-home"]',
      title: 'Return To Index',
      text: 'Now tap Return to Index so the tutorial can continue from the main page.',
      next: 'index.html',
      requireClick: true
    },
    {
      page: 'index.html',
      selector: '[data-tour-id="home-geography"]',
      title: 'Geography Library',
      text: 'Open Geography for units, reviews, and concept check-ins.',
      next: 'geography-library.html'
    },
    {
      page: 'geography-library.html',
      selector: '[data-tour-id="exit-home"]',
      title: 'Return Home',
      text: 'Exit back to the main hub when you finish.',
      next: 'index.html'
    },
    {
      page: 'index.html',
      selector: '[data-tour-id="home-tools"]',
      title: 'Study Tools',
      text: 'Concept Cards use spaced repetition to lock in memory — it\'s a strategy even med students use.',
      next: 'anki/index.html'
    },
    {
      page: 'anki/index.html',
      selector: '[data-tour-id="concept-study"]',
      title: 'Concept Cards',
      text: 'Add a deck, flip cards, and rate difficulty to schedule reviews.',
      next: 'index.html',
      finish: true
    }
  ]

  function getPageName() {
    const raw = (location.pathname.split('/').pop() || 'index.html').toLowerCase()
    return raw
  }

  function setTourActive(value) {
    try {
      localStorage.setItem(TOUR_ACTIVE_KEY, value ? '1' : '0')
    } catch (err) {
      // ignore
    }
  }

  function setTourStep(value) {
    try {
      localStorage.setItem(TOUR_STEP_KEY, String(value))
    } catch (err) {
      // ignore
    }
  }

  function getTourStep() {
    try {
      const value = localStorage.getItem(TOUR_STEP_KEY)
      return value ? Number(value) : 0
    } catch (err) {
      return 0
    }
  }

  function isTourActive() {
    try {
      return localStorage.getItem(TOUR_ACTIVE_KEY) === '1'
    } catch (err) {
      return false
    }
  }

  function ensureTourStyles() {
    if (document.getElementById('tour-style-inline')) return
    const style = document.createElement('style')
    style.id = 'tour-style-inline'
    style.textContent =
      '.tour-overlay{position:fixed;inset:0;background:transparent;z-index:1200;display:none;pointer-events:none}' +
      '.tour-overlay.is-visible{display:block}' +
      '.tour-tooltip{position:fixed;top:18px;right:18px;max-width:280px;background:#fff;border:1px solid #e2d8cb;border-radius:12px;padding:12px;box-shadow:0 14px 36px rgba(23,21,16,.16);pointer-events:auto}' +
      '.tour-tooltip h4{margin:0 0 6px;font-size:1rem}' +
      '.tour-tooltip p{margin:0 0 12px;font-size:.92rem;color:#5a5863;line-height:1.4}' +
      '.tour-actions{display:flex;gap:8px}' +
      '.tour-highlight{outline:3px solid rgba(243,106,61,.7);outline-offset:4px;border-radius:999px;position:relative;z-index:1201}' +
      '.tour-highlight-pulse{box-shadow:0 0 0 0 rgba(243,106,61,.45);animation:tourPulse 1.15s ease-out infinite}' +
      '@keyframes tourPulse{0%{box-shadow:0 0 0 0 rgba(243,106,61,.5)}70%{box-shadow:0 0 0 14px rgba(243,106,61,0)}100%{box-shadow:0 0 0 0 rgba(243,106,61,0)}}' +
      '@media (max-width:680px){.tour-tooltip{top:auto;right:12px;left:12px;bottom:88px;max-width:none}}'
    document.head.appendChild(style)
  }

  function createTourOverlay() {
    let overlay = document.querySelector('.tour-overlay')
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.className = 'tour-overlay'
      overlay.innerHTML =
        '<div class="tour-tooltip" role="dialog" aria-modal="true">' +
        '<h4 class="tour-title"></h4>' +
        '<p class="tour-body"></p>' +
        '<div class="tour-actions">' +
        '<button class="btn btn-secondary" type="button" data-tour-back>Back</button>' +
        '<button class="btn btn-secondary" type="button" data-tour-skip>Skip</button>' +
        '<button class="btn btn-primary" type="button" data-tour-next>Next</button>' +
        '</div>' +
        '</div>'
      document.body.appendChild(overlay)
    }
    return overlay
  }

  function prepareTourStep(step) {
    if (!step || getPageName() !== 'study-library.html') return
    const annoApi = window.scLibraryAnnotations
    if (!annoApi) return
    if (step.autoExpandAnnotations && typeof annoApi.expandToolbar === 'function') {
      annoApi.expandToolbar()
    }
    if (step.forceDrawingOff && typeof annoApi.setDrawingEnabled === 'function') {
      annoApi.setDrawingEnabled(false)
    }
  }

  function showTourStep() {
    if (!isTourActive()) return
    const stepIndex = getTourStep()
    const step = TOUR_STEPS[stepIndex]
    if (!step) {
      setTourActive(false)
      return
    }
    if (getPageName() !== step.page) return

    ensureTourStyles()
    const overlay = createTourOverlay()
    prepareTourStep(step)
    const tooltip = overlay.querySelector('.tour-tooltip')
    const titleEl = overlay.querySelector('.tour-title')
    const bodyEl = overlay.querySelector('.tour-body')
    const backBtn = overlay.querySelector('[data-tour-back]')
    const skipBtn = overlay.querySelector('[data-tour-skip]')
    const nextBtn = overlay.querySelector('[data-tour-next]')
    const target = document.querySelector(step.selector)
    if (!target || !tooltip || !titleEl || !bodyEl || !backBtn || !skipBtn || !nextBtn) return
    const needsUserClick = !!step.requireClick || (step.next && step.next !== getPageName())

    document.querySelectorAll('.tour-highlight, .tour-highlight-pulse').forEach(function (node) {
      node.classList.remove('tour-highlight')
      node.classList.remove('tour-highlight-pulse')
    })
    if (!step.noHighlight) {
      target.classList.add('tour-highlight')
      if (needsUserClick) {
        target.classList.add('tour-highlight-pulse')
      }
    }

    titleEl.textContent = step.title
    bodyEl.textContent = needsUserClick ? step.text + ' Tap the highlighted button next.' : step.text
    backBtn.disabled = stepIndex === 0
    nextBtn.textContent = step.finish ? 'Finish' : needsUserClick ? 'Click highlighted button' : 'Next'
    nextBtn.disabled = !!step.requireClick
    if (!step.noHighlight) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }

    overlay.classList.add('is-visible')

    function cleanup() {
      overlay.classList.remove('is-visible')
      target.classList.remove('tour-highlight')
      target.classList.remove('tour-highlight-pulse')
    }

    backBtn.onclick = function () {
      if (stepIndex > 0) {
        setTourStep(stepIndex - 1)
        cleanup()
        const prev = TOUR_STEPS[stepIndex - 1]
        if (prev && prev.page && prev.page !== getPageName()) {
          location.href = prev.page
        } else {
          showTourStep()
        }
      }
    }

    skipBtn.onclick = function () {
      setTourActive(false)
      try {
        localStorage.setItem(TOUR_DECLINED_KEY, '1')
      } catch (err) {
        // ignore
      }
      cleanup()
    }

    nextBtn.onclick = function () {
      if (step.finish) {
        setTourActive(false)
        cleanup()
        return
      }
      const nextIndex = stepIndex + 1
      setTourStep(nextIndex)
      cleanup()
      showTourStep()
    }

    if (needsUserClick) {
      target.addEventListener(
        'click',
        function () {
          const nextIndex = stepIndex + 1
          setTourStep(nextIndex)
          cleanup()
          setTimeout(function () {
            showTourStep()
          }, 80)
        },
        { once: true },
      )
    }

    window.addEventListener('resize', showTourStep, { once: true })
    window.addEventListener('scroll', showTourStep, { once: true })
  }

  function showTourPrompt() {
    const page = getPageName()
    if (page !== 'index.html') return
    if (isTourActive()) return
    try {
      if (localStorage.getItem(TOUR_NEVER_KEY) === '1') return
    } catch (err) {
      // ignore
    }

    ensureTourStyles()
    const overlay = createTourOverlay()
    const tooltip = overlay.querySelector('.tour-tooltip')
    const titleEl = overlay.querySelector('.tour-title')
    const bodyEl = overlay.querySelector('.tour-body')
    const backBtn = overlay.querySelector('[data-tour-back]')
    const skipBtn = overlay.querySelector('[data-tour-skip]')
    const nextBtn = overlay.querySelector('[data-tour-next]')
    let neverBtn = overlay.querySelector('[data-tour-never]')
    if (!tooltip || !titleEl || !bodyEl || !backBtn || !skipBtn || !nextBtn) return
    if (!neverBtn) {
      neverBtn = document.createElement('button')
      neverBtn.className = 'btn btn-secondary'
      neverBtn.type = 'button'
      neverBtn.setAttribute('data-tour-never', '')
      neverBtn.textContent = 'Never again'
      const actions = overlay.querySelector('.tour-actions')
      if (actions) actions.appendChild(neverBtn)
    }

    titleEl.textContent = "Hi, I'm Dean"
    bodyEl.textContent = 'Want a quick tutorial to get started?'
    backBtn.style.display = 'none'
    skipBtn.textContent = 'Not now'
    nextBtn.textContent = 'Yes'

    tooltip.style.top = '20vh'
    tooltip.style.left = '50%'
    tooltip.style.transform = 'translateX(-50%)'
    overlay.classList.add('is-visible')

    skipBtn.onclick = function () {
      overlay.classList.remove('is-visible')
    }

    if (neverBtn) {
      neverBtn.onclick = function () {
        overlay.classList.remove('is-visible')
        try {
          localStorage.setItem(TOUR_NEVER_KEY, '1')
        } catch (err) {
          // ignore
        }
      }
    }

    nextBtn.onclick = function () {
      overlay.classList.remove('is-visible')
      setTourActive(true)
      setTourStep(0)
      showTourStep()
    }
  }

  function scheduleTour() {
    return
  }

  if (document.readyState === 'complete') {
    scheduleTour()
  } else {
    window.addEventListener('load', scheduleTour)
  }
})()
