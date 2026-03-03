(function () {
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

  function loadScript(src, id) {
    return new Promise(function (resolve, reject) {
      if (id) {
        const existing = document.getElementById(id)
        if (existing) {
          resolve()
          return
        }
      }
      const script = document.createElement('script')
      script.src = src
      script.async = true
      if (id) script.id = id
      script.onload = function () {
        resolve()
      }
      script.onerror = function () {
        reject(new Error('Failed to load script: ' + src))
      }
      document.head.appendChild(script)
    })
  }

  function createAuthModal() {
    const modal = document.createElement('div')
    modal.className = 'auth-modal'
    modal.setAttribute('aria-hidden', 'true')
    modal.innerHTML =
      '<div class="auth-modal-card" role="dialog" aria-modal="true" aria-label="Sign in">' +
      '<button type="button" class="auth-close" data-auth-close aria-label="Close">x</button>' +
      '<h3>Sign in</h3>' +
      '<p class="auth-sub">Use Google or email to continue.</p>' +
      '<button type="button" class="btn btn-primary auth-google" data-auth-google>Continue with Google</button>' +
      '<div class="auth-divider"><span>or</span></div>' +
      '<label class="auth-label" for="auth-email">Email</label>' +
      '<input id="auth-email" class="auth-input" type="email" placeholder="you@example.com" />' +
      '<label class="auth-label" for="auth-password">Password (optional)</label>' +
      '<input id="auth-password" class="auth-input" type="password" placeholder="For password sign-in / sign-up" />' +
      '<div class="auth-actions">' +
      '<button type="button" class="btn btn-secondary" data-auth-magic>Send Magic Link</button>' +
      '<button type="button" class="btn btn-secondary" data-auth-password>Sign in with Password</button>' +
      '<button type="button" class="btn btn-secondary" data-auth-signup>Create Account</button>' +
      '</div>' +
      '<div class="auth-user" data-auth-user hidden></div>' +
      '<button type="button" class="btn btn-secondary auth-signout" data-auth-signout hidden>Sign out</button>' +
      '<p class="auth-status" data-auth-status></p>' +
      '</div>'
    document.body.appendChild(modal)
    return modal
  }

  function openAuthModal(modal) {
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
  }

  function closeAuthModal(modal) {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
  }

  async function loadSupabaseConfig() {
    try {
      const res = await fetch('/supabase-config.json?ts=' + Date.now(), { cache: 'no-store' })
      if (!res.ok) return null
      const cfg = await res.json()
      if (!cfg || !cfg.url || !cfg.anonKey) return null
      return cfg
    } catch (err) {
      return null
    }
  }

  function isConfigured(cfg) {
    if (!cfg) return false
    if (!cfg.url || !cfg.anonKey) return false
    if (String(cfg.url).indexOf('YOUR-') !== -1) return false
    if (String(cfg.anonKey).indexOf('YOUR-') !== -1) return false
    return true
  }

  function setupAuthUI(navMenu) {
    if (!navMenu) return

    const authWrap = document.createElement('div')
    authWrap.className = 'auth-wrap'
    authWrap.innerHTML =
      '<button type="button" class="btn btn-secondary auth-open" data-auth-open>Sign in</button>'
    navMenu.appendChild(authWrap)

    const authBtn = authWrap.querySelector('[data-auth-open]')
    const modal = createAuthModal()
    const closeBtn = modal.querySelector('[data-auth-close]')
    const googleBtn = modal.querySelector('[data-auth-google]')
    const magicBtn = modal.querySelector('[data-auth-magic]')
    const passwordBtn = modal.querySelector('[data-auth-password]')
    const signupBtn = modal.querySelector('[data-auth-signup]')
    const signoutBtn = modal.querySelector('[data-auth-signout]')
    const statusEl = modal.querySelector('[data-auth-status]')
    const userEl = modal.querySelector('[data-auth-user]')
    const emailEl = modal.querySelector('#auth-email')
    const passwordEl = modal.querySelector('#auth-password')

    let supabaseClient = null
    let ready = false

    function setStatus(msg, isError) {
      if (!statusEl) return
      statusEl.textContent = msg || ''
      statusEl.className = isError ? 'auth-status err' : 'auth-status ok'
    }

    function setUser(user) {
      if (!authBtn || !signoutBtn || !userEl) return
      if (user && user.email) {
        authBtn.textContent = user.email
        userEl.hidden = false
        userEl.textContent = 'Signed in as ' + user.email
        signoutBtn.hidden = false
      } else {
        authBtn.textContent = 'Sign in'
        userEl.hidden = true
        userEl.textContent = ''
        signoutBtn.hidden = true
      }
    }

    authBtn.addEventListener('click', function () {
      openAuthModal(modal)
    })

    closeBtn.addEventListener('click', function () {
      closeAuthModal(modal)
    })

    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeAuthModal(modal)
    })

    function requireReady() {
      if (!ready || !supabaseClient) {
        setStatus(
          'Supabase not configured yet. Add project values in /supabase-config.json.',
          true,
        )
        return false
      }
      return true
    }

    googleBtn.addEventListener('click', async function () {
      if (!requireReady()) return
      setStatus('Redirecting to Google...', false)
      const result = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: location.origin + location.pathname,
        },
      })
      if (result.error) setStatus(result.error.message || 'Google sign-in failed.', true)
    })

    magicBtn.addEventListener('click', async function () {
      if (!requireReady()) return
      const email = (emailEl.value || '').trim()
      if (!email) {
        setStatus('Enter your email first.', true)
        return
      }
      const result = await supabaseClient.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: location.origin + location.pathname },
      })
      if (result.error) {
        setStatus(result.error.message || 'Failed to send magic link.', true)
      } else {
        setStatus('Magic link sent. Check your email.', false)
      }
    })

    passwordBtn.addEventListener('click', async function () {
      if (!requireReady()) return
      const email = (emailEl.value || '').trim()
      const password = passwordEl.value || ''
      if (!email || !password) {
        setStatus('Enter email and password.', true)
        return
      }
      const result = await supabaseClient.auth.signInWithPassword({ email, password })
      if (result.error) {
        setStatus(result.error.message || 'Email sign-in failed.', true)
      } else {
        setStatus('Signed in successfully.', false)
      }
    })

    signupBtn.addEventListener('click', async function () {
      if (!requireReady()) return
      const email = (emailEl.value || '').trim()
      const password = passwordEl.value || ''
      if (!email || !password) {
        setStatus('Enter email and password to create account.', true)
        return
      }
      const result = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: location.origin + location.pathname },
      })
      if (result.error) {
        setStatus(result.error.message || 'Account creation failed.', true)
      } else {
        setStatus('Account created. Confirm your email if prompted.', false)
      }
    })

    signoutBtn.addEventListener('click', async function () {
      if (!requireReady()) return
      const result = await supabaseClient.auth.signOut()
      if (result.error) {
        setStatus(result.error.message || 'Sign out failed.', true)
      } else {
        setStatus('Signed out.', false)
      }
    })

    ;(async function initAuth() {
      const cfg = await loadSupabaseConfig()
      if (!isConfigured(cfg)) {
        setStatus(
          'Supabase not configured yet. Add project values in /supabase-config.json.',
          true,
        )
        setUser(null)
        return
      }

      try {
        await loadScript(
          'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js',
          'supabase-js-cdn',
        )
      } catch (err) {
        setStatus('Failed to load auth library.', true)
        return
      }

      try {
        supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        })
        ready = true

        const sessionData = await supabaseClient.auth.getSession()
        setUser(sessionData.data && sessionData.data.session ? sessionData.data.session.user : null)

        supabaseClient.auth.onAuthStateChange(function (_event, session) {
          setUser(session ? session.user : null)
        })

        setStatus('', false)
      } catch (err) {
        setStatus('Failed to initialize Supabase auth.', true)
      }
    })()
  }

  if (!isLibraryContext && navMenu) {
    setupAuthUI(navMenu)
  }

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
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios|opr\//i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone

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
      '<p>Apple does not allow automatic Home Screen install. Use these quick steps:</p>' +
      '<ol>' +
      '<li>Tap the Share icon in Safari.</li>' +
      '<li>Tap <strong>Add to Home Screen</strong>.</li>' +
      '<li>Tap <strong>Add</strong>.</li>' +
      '</ol>' +
      '<div class="ios-install-actions">' +
      '<button type="button" class="secondary" data-ios-close>Close</button>' +
      '<button type="button" class="primary" data-ios-share>Open Share</button>' +
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
          .finally(closeGuide)
      } else {
        closeGuide()
      }
    })

    document.body.appendChild(overlay)
  }

  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null
        })
        return
      }

      if (isIos && !isStandalone) {
        if (installHint) installHint.classList.add('is-visible')
        if (!isSafari) {
          alert('For iPhone/iPad install, open this page in Safari, then use Share -> Add to Home Screen.')
          return
        }
        if (navigator.share) {
          navigator
            .share({
              title: document.title || 'Soul Concept',
              text: 'Install Soul Concept on your Home Screen',
              url: location.href,
            })
            .catch(function () {
              showIosInstallGuide()
            })
          return
        }
        showIosInstallGuide()
        return
      }

      alert('To install, use your browser menu and choose “Install app” or “Add to Home Screen”.')
    })
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault()
    deferredPrompt = event
  })

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null
  })

  if (installHint && isIos && !isStandalone) {
    installHint.classList.add('is-visible')
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (err) {
        console.warn('Service worker registration failed:', err)
      })
    })
  }

  if ('serviceWorker' in navigator && 'PushManager' in window && !isLibraryContext) {
    let pushWidgetDismissed = false
    try {
      pushWidgetDismissed = localStorage.getItem('sc_push_widget_dismissed') === '1'
    } catch (err) {
      pushWidgetDismissed = false
    }
    if (pushWidgetDismissed) {
      // continue with the rest of the app script
    } else {

    const VAPID_PUBLIC_KEY = 'BO94JvzECtxvt1c7RrNferA88Uh-4NX8W-vaY2Tw5O6UiejKE-oaHAZCbpmfjcLqajG_1fDWxnEpRwbXaVWi2_c'
    const widget = document.createElement('div')
    widget.className = 'push-widget'
    widget.innerHTML =
      '<div class="push-header">' +
      '<div class="push-title">Notifications</div>' +
      '<button class="push-close" type="button" aria-label="Close notifications panel" data-push-close>x</button>' +
      '</div>' +
      '<p class="push-text">Enable push notifications for updates.</p>' +
      '<div class="push-actions">' +
      '<button class="btn btn-secondary" type="button" data-push-enable>Enable</button>' +
      '<button class="btn btn-primary" type="button" data-push-test>Send test</button>' +
      '</div>' +
      '<p class="push-status" data-push-status></p>'
    document.body.appendChild(widget)

    const statusEl = widget.querySelector('[data-push-status]')
    const enableBtn = widget.querySelector('[data-push-enable]')
    const testBtn = widget.querySelector('[data-push-test]')
    const closeBtn = widget.querySelector('[data-push-close]')

    function setStatus(message, isError) {
      if (!statusEl) return
      statusEl.textContent = message
      statusEl.className = isError ? 'push-status err' : 'push-status ok'
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

    async function getSubscription() {
      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key
        })
      }
      localStorage.setItem('sc_push_subscription', JSON.stringify(subscription))
      return subscription
    }

    async function sendTest(subscription) {
      const payload = {
        title: 'Soul Concept',
        body: 'Test notification received.',
        url: '/'
      }
      const res = await fetch('/.netlify/functions/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, payload })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to send notification.')
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        try {
          localStorage.setItem('sc_push_widget_dismissed', '1')
        } catch (err) {
          // ignore storage errors
        }
        widget.remove()
      })
    }

    enableBtn.addEventListener('click', async function () {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          setStatus('Permission denied.', true)
          return
        }
        await getSubscription()
        setStatus('Notifications enabled.', false)
      } catch (err) {
        setStatus(err.message || 'Failed to enable notifications.', true)
      }
    })

    testBtn.addEventListener('click', async function () {
      try {
        const subscription = await getSubscription()
        await sendTest(subscription)
        setStatus('Test sent. Check your notifications.', false)
      } catch (err) {
        setStatus(err.message || 'Failed to send test.', true)
      }
    })
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
      selector: '[data-tour-id="exit-home"]',
      title: 'Quick Tip',
      text: 'Use Exit to return home anytime.',
      next: 'index.html'
    },
    {
      page: 'study-library.html',
      selector: 'body',
      title: 'Split Screen',
      text: 'Use split screen to keep questions and notes side by side.',
      next: 'study-library.html',
      noHighlight: true
    },
    {
      page: 'study-library.html',
      selector: 'body',
      title: 'Chemistry Notes',
      text: 'Open the Chemistry section to review key definitions and examples fast.',
      next: 'index.html',
      noHighlight: true
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
      '.tour-tooltip{position:absolute;max-width:260px;background:#fff;border:1px solid #e2d8cb;border-radius:12px;padding:12px;box-shadow:0 10px 24px rgba(23,21,16,.1);pointer-events:auto}' +
      '.tour-tooltip h4{margin:0 0 6px;font-size:1rem}' +
      '.tour-tooltip p{margin:0 0 12px;font-size:.92rem;color:#5a5863;line-height:1.4}' +
      '.tour-actions{display:flex;gap:8px}' +
      '.tour-highlight{outline:3px solid rgba(243,106,61,.6);outline-offset:4px;border-radius:999px;position:relative;z-index:1201}'
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
    const tooltip = overlay.querySelector('.tour-tooltip')
    const titleEl = overlay.querySelector('.tour-title')
    const bodyEl = overlay.querySelector('.tour-body')
    const backBtn = overlay.querySelector('[data-tour-back]')
    const skipBtn = overlay.querySelector('[data-tour-skip]')
    const nextBtn = overlay.querySelector('[data-tour-next]')
    const target = document.querySelector(step.selector)
    if (!target || !tooltip || !titleEl || !bodyEl || !backBtn || !skipBtn || !nextBtn) return

    document.querySelectorAll('.tour-highlight').forEach(function (node) {
      node.classList.remove('tour-highlight')
    })
    if (!step.noHighlight) {
      target.classList.add('tour-highlight')
    }

    titleEl.textContent = step.title
    bodyEl.textContent = step.text
    backBtn.disabled = stepIndex === 0
    const needsUserClick = step.next && step.next !== getPageName()
    nextBtn.textContent = step.finish ? 'Finish' : needsUserClick ? 'Click highlighted button' : 'Next'
    nextBtn.disabled = false

    const rect = target.getBoundingClientRect()
    const top = rect.bottom + window.scrollY + 12
    const left = Math.min(window.innerWidth - 360, rect.left + window.scrollX)
    tooltip.style.top = Math.max(16, top) + 'px'
    tooltip.style.left = Math.max(16, left) + 'px'

    overlay.classList.add('is-visible')

    function cleanup() {
      overlay.classList.remove('is-visible')
      target.classList.remove('tour-highlight')
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

    if (step.next && step.next !== getPageName()) {
      target.addEventListener(
        'click',
        function () {
          const nextIndex = stepIndex + 1
          setTourStep(nextIndex)
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
    if (isLibraryContext) return
    setTimeout(function () {
      try {
        showTourPrompt()
        showTourStep()
      } catch (err) {
        // ignore tour errors
      }
    }, 700)
  }

  if (document.readyState === 'complete') {
    scheduleTour()
  } else {
    window.addEventListener('load', scheduleTour)
  }
})()
