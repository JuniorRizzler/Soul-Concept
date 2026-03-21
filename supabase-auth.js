(function () {
  var CALLBACK_PATH = '/auth/callback.html'
  var CALLBACK_CLEAN_PATH = '/auth/callback'
  var RETURN_TO_KEY = 'sc_auth_return_to'
  var DISMISS_KEY = 'sc_auth_prompt_dismissed_v1'
  var REQUIRE_AUTH = true

  function injectStyles() {
    if (document.getElementById('sc-supabase-auth-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-supabase-auth-styles'
      style.textContent =
        '.sc-auth-launch{white-space:nowrap;border-color:rgba(226,216,203,.88);background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(244,236,226,.84));box-shadow:inset 0 1px 0 rgba(255,255,255,.82),0 8px 18px rgba(23,21,16,.08)}' +
        '.sc-auth-inline{display:inline-flex;align-items:center;flex:0 0 auto;margin-left:auto}' +
        '.nav-more{position:relative;display:none;align-items:center}' +
        '.nav-more.is-active{display:inline-flex}' +
        '.nav-more-toggle{appearance:none;border:0;text-decoration:none;color:#5a5863;padding:8px 14px;border-radius:999px;font-weight:800;font-size:.86rem;letter-spacing:-.012em;background:transparent;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,0);transition:background .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease}' +
        '.nav-more-toggle:hover,.nav-more-toggle[aria-expanded="true"]{color:#1b1b1f;background:linear-gradient(180deg,rgba(255,255,255,.82),rgba(33,92,75,.12));box-shadow:inset 0 1px 0 rgba(255,255,255,.78),0 6px 14px rgba(23,21,16,.06);transform:translateY(-1px)}' +
        '.nav-more-menu{position:absolute;top:calc(100% + 10px);right:0;min-width:198px;padding:8px;border-radius:18px;border:1px solid rgba(226,216,203,.88);background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,241,233,.96));box-shadow:0 20px 42px rgba(23,21,16,.14);display:none;gap:6px;z-index:45}' +
        '.nav-more.open .nav-more-menu{display:grid}' +
        '.nav-more-menu > *{width:100%;margin:0 !important;justify-content:flex-start !important}' +
        '.nav-more-menu .install-hint{display:none !important}' +
        '.sc-auth-shell{position:relative;display:inline-flex;align-items:center;gap:6px}' +
        '.sc-auth-user{display:inline-flex;align-items:center;gap:6px;padding:6px 8px;border-radius:999px;border:1px solid rgba(226,216,203,.88);background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(244,236,226,.84));color:#1b1b1f;font-weight:800;font-size:.77rem;max-width:112px;overflow:hidden;min-width:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.82),0 8px 18px rgba(23,21,16,.08)}' +
        '.sc-auth-user strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:800;font-size:.74rem;line-height:1.05}' +
        '.sc-auth-user small{display:block;font-weight:700;color:#5a5863;font-size:.64rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.02}' +
        '.sc-auth-avatar{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:999px;background:rgba(33,92,75,.12);color:#215c4b;font-size:.68rem;font-weight:900;flex:0 0 auto}' +
        '.sc-auth-copywrap{display:block;min-width:0;overflow:hidden}' +
        '.sc-auth-signout{border:1px solid rgba(226,216,203,.88);background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(244,236,226,.84));color:#1b1b1f;border-radius:999px;padding:6px 8px;font-weight:800;cursor:pointer;font-size:.74rem;line-height:1;white-space:nowrap;box-shadow:inset 0 1px 0 rgba(255,255,255,.82),0 8px 18px rgba(23,21,16,.08)}' +
        '.sc-auth-float{position:fixed;top:14px;right:14px;z-index:10002;display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.9);border:1px solid rgba(226,216,203,.92);box-shadow:0 12px 30px rgba(23,21,16,.12);backdrop-filter:blur(12px)}' +
        '.sc-auth-float .sc-auth-launch,.sc-auth-float .sc-auth-signout{box-shadow:none}' +
        '.sc-auth-modal-backdrop{position:fixed;inset:0;background:rgba(10,14,20,.48);backdrop-filter:blur(8px);z-index:10020;display:none;align-items:center;justify-content:center;padding:18px}' +
        '.sc-auth-modal-backdrop.open{display:flex}' +
        '.sc-auth-modal-backdrop.locked{background:rgba(10,14,20,.72)}' +
      '.sc-auth-modal{width:min(460px,92vw);border-radius:24px;border:1px solid rgba(226,216,203,.9);background:linear-gradient(180deg,#fffefb 0%,#f7f1e9 100%);box-shadow:0 24px 60px rgba(23,21,16,.18);padding:22px;position:relative}' +
      '.sc-auth-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:999px;border:1px solid #e2d8cb;background:#fff;cursor:pointer;font-size:1rem;font-weight:800}' +
      '.sc-auth-title{margin:0 0 8px;font-family:Sora,Segoe UI,sans-serif;font-size:1.55rem;line-height:1.05;color:#1b1b1f}' +
      '.sc-auth-copy{margin:0 0 16px;color:#5a5863;line-height:1.5;font-size:.95rem}' +
      '.sc-auth-stack{display:grid;gap:10px}' +
      '.sc-auth-google{width:100%;justify-content:center}' +
      '.sc-auth-divider{display:flex;align-items:center;gap:10px;color:#7b746b;font-size:.78rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin:4px 0}' +
      '.sc-auth-divider:before,.sc-auth-divider:after{content:"";flex:1;height:1px;background:rgba(123,116,107,.28)}' +
      '.sc-auth-field{display:grid;gap:6px}' +
      '.sc-auth-field label{font-size:.83rem;font-weight:800;color:#3d3b46}' +
      '.sc-auth-field input{width:100%;border:1px solid #d8cdbf;border-radius:14px;padding:12px 13px;font:600 .95rem/1.3 Manrope,system-ui,sans-serif;background:#fff;color:#1b1b1f}' +
      '.sc-auth-submit{width:100%;justify-content:center}' +
      '.sc-auth-status{min-height:20px;margin:0;color:#5a5863;font-size:.88rem}' +
      '.sc-auth-status.ok{color:#166534}' +
      '.sc-auth-status.err{color:#b91c1c}' +
        '@media (max-width:840px){.sc-auth-inline{order:3;margin-left:0}.nav-more{display:none !important}.sc-auth-launch{width:auto;padding:8px 10px;font-size:.82rem}.sc-auth-shell{gap:5px}.sc-auth-user{max-width:96px;padding:6px 8px;gap:6px}.sc-auth-avatar{width:22px;height:22px;font-size:.68rem}.sc-auth-signout{padding:7px 8px;font-size:.72rem}.sc-auth-float{top:10px;right:10px;padding:7px 8px;max-width:calc(100vw - 20px)}}'
    document.head.appendChild(style)
  }

  var navMoreBound = false

  function ensureNavMoreMenu(navMenu) {
    if (!navMenu) return null
    var more = navMenu.querySelector('[data-nav-more]')
    if (!more) {
      more = document.createElement('div')
      more.className = 'nav-more'
      more.setAttribute('data-nav-more', '1')
      more.innerHTML =
        '<button class="nav-more-toggle" type="button" data-nav-more-toggle aria-expanded="false">More</button>' +
        '<div class="nav-more-menu" data-nav-more-menu></div>'
      navMenu.appendChild(more)
    }
    if (!navMoreBound) {
      navMoreBound = true
      document.addEventListener('click', function (event) {
        var openMore = document.querySelector('[data-nav-more].open')
        if (!openMore) return
        if (openMore.contains(event.target)) return
        openMore.classList.remove('open')
        var toggle = openMore.querySelector('[data-nav-more-toggle]')
        if (toggle) toggle.setAttribute('aria-expanded', 'false')
      })
    }
    var toggleButton = more.querySelector('[data-nav-more-toggle]')
    if (toggleButton && toggleButton.getAttribute('data-bound') !== '1') {
      toggleButton.setAttribute('data-bound', '1')
      toggleButton.addEventListener('click', function () {
        var next = !more.classList.contains('open')
        more.classList.toggle('open', next)
        toggleButton.setAttribute('aria-expanded', next ? 'true' : 'false')
      })
    }
    return more
  }

  function syncNavMoreMenu() {
    var navMenu = document.querySelector('[data-nav-menu]')
    if (!navMenu) return
    var more = ensureNavMoreMenu(navMenu)
    if (!more) return
    var moreMenu = more.querySelector('[data-nav-more-menu]')
    if (!moreMenu) return
    var desktop = window.matchMedia ? window.matchMedia('(min-width: 841px)').matches : window.innerWidth > 840
    var authMounted = !!document.querySelector('.sc-auth-shell')
    var selectors = [
      'a[href="about.html"]',
      'a[href="contact.html"]',
      '[data-install-btn]',
      '[data-install-hint]'
    ]

    selectors.forEach(function (selector) {
      var node = moreMenu.querySelector(selector)
      if (node) navMenu.insertBefore(node, more)
    })

    if (desktop && authMounted) {
      selectors.forEach(function (selector) {
        var node = navMenu.querySelector(selector)
        if (node && node.parentNode === navMenu) moreMenu.appendChild(node)
      })
      more.classList.add('is-active')
    } else {
      more.classList.remove('is-active')
      more.classList.remove('open')
      var toggle = more.querySelector('[data-nav-more-toggle]')
      if (toggle) toggle.setAttribute('aria-expanded', 'false')
    }
  }

  function isCallbackPage() {
    var path = String(location.pathname || '').toLowerCase()
    return path === CALLBACK_PATH || path === CALLBACK_CLEAN_PATH
  }

  function currentReturnPath() {
    return location.pathname + location.search + location.hash
  }

  function saveReturnPath(path) {
    try {
      localStorage.setItem(RETURN_TO_KEY, path)
    } catch (_err) {}
  }

  function readReturnPath() {
    try {
      return localStorage.getItem(RETURN_TO_KEY) || '/index.html'
    } catch (_err) {
      return '/index.html'
    }
  }

  function clearReturnPath() {
    try {
      localStorage.removeItem(RETURN_TO_KEY)
    } catch (_err) {}
  }

  function isPromptDismissed() {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1'
    } catch (_err) {
      return false
    }
  }

  function setPromptDismissed(value) {
    try {
      localStorage.setItem(DISMISS_KEY, value ? '1' : '0')
    } catch (_err) {}
  }

  function normalizeReturnPath(path) {
    var value = String(path || '').trim()
    if (!value) return '/index.html'
    if (value.indexOf('http://') === 0 || value.indexOf('https://') === 0) {
      try {
        value = new URL(value).pathname || '/index.html'
      } catch (_err) {
        return '/index.html'
      }
    }
    if (value === '/' || value === '') return '/index.html'
    var lower = value.toLowerCase()
    if (lower.indexOf(CALLBACK_PATH) !== -1 || lower.indexOf(CALLBACK_CLEAN_PATH) !== -1) return '/index.html'
    return value
  }

  function createButton(label, className) {
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = className
    btn.textContent = label
    return btn
  }

  function isStandaloneMode() {
    try {
      return (
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true
      )
    } catch (_err) {
      return false
    }
  }

  function isEmbeddedBrowser() {
    var ua = String(navigator.userAgent || '').toLowerCase()
    return (
      ua.indexOf('wv') !== -1 ||
      ua.indexOf('instagram') !== -1 ||
      ua.indexOf('fbav') !== -1 ||
      ua.indexOf('fban') !== -1 ||
      ua.indexOf('tiktok') !== -1 ||
      ua.indexOf('snapchat') !== -1 ||
      ua.indexOf('line/') !== -1
    )
  }

  function shouldAvoidGoogleOAuth() {
    return isStandaloneMode() || isEmbeddedBrowser()
  }

  function getBrowserPolicyMessage() {
    return 'Google sign-in can be blocked by secure browser policy in PWAs, in-app browsers, or school-managed browsers. Use the magic link below or open Soul Concept in Safari or Chrome.'
  }

  function ensureModal() {
    var existing = document.getElementById('sc-auth-modal-backdrop')
    if (existing) return existing

    var backdrop = document.createElement('div')
    backdrop.id = 'sc-auth-modal-backdrop'
    backdrop.className = 'sc-auth-modal-backdrop'
    backdrop.innerHTML =
      '<div class="sc-auth-modal" role="dialog" aria-modal="true" aria-labelledby="sc-auth-title">' +
      '<button class="sc-auth-close" type="button" aria-label="Close sign in">&times;</button>' +
      '<h2 class="sc-auth-title" id="sc-auth-title">Sign in to Soul Concept</h2>' +
      '<p class="sc-auth-copy">Use Google or a magic link sent to your email. This keeps your progress and premium access tied to your account.</p>' +
      '<p class="sc-auth-status" data-auth-policy></p>' +
      '<div class="sc-auth-stack">' +
      '<button class="btn btn-primary sc-auth-google" type="button" data-auth-google>Continue with Google</button>' +
      '<div class="sc-auth-divider">or</div>' +
      '<form data-auth-email-form class="sc-auth-stack">' +
      '<div class="sc-auth-field">' +
      '<label for="sc-auth-email">Email address</label>' +
      '<input id="sc-auth-email" name="email" type="email" autocomplete="email" placeholder="you@school.com" required />' +
      '</div>' +
      '<button class="btn btn-secondary sc-auth-submit" type="submit">Send magic link</button>' +
      '</form>' +
      '<p class="sc-auth-status" data-auth-status></p>' +
      '</div>' +
      '</div>'
    document.body.appendChild(backdrop)
    return backdrop
  }

  function setStatus(backdrop, message, kind) {
    var status = backdrop.querySelector('[data-auth-status]')
    if (!status) return
    status.textContent = message || ''
    status.className = 'sc-auth-status' + (kind ? ' ' + kind : '')
  }

  function setPolicyMessage(backdrop, message, kind) {
    var status = backdrop.querySelector('[data-auth-policy]')
    if (!status) return
    status.textContent = message || ''
    status.className = 'sc-auth-status' + (kind ? ' ' + kind : '')
  }

  function openModal() {
      var backdrop = ensureModal()
      setPromptDismissed(false)
      backdrop.classList.add('open')
      if (document.body) document.body.classList.add('auth-modal-open')
      var input = backdrop.querySelector('#sc-auth-email')
      if (input) setTimeout(function () { input.focus() }, 10)
    }

  function closeModal() {
      var backdrop = ensureModal()
      setPromptDismissed(true)
      backdrop.classList.remove('open')
      backdrop.classList.remove('locked')
      if (document.body) document.body.classList.remove('auth-modal-open')
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      setStatus(backdrop, '', '')
  }

  function bindModal(client) {
    var backdrop = ensureModal()
    if (backdrop.getAttribute('data-auth-bound') === '1') return
    backdrop.setAttribute('data-auth-bound', '1')

    var closeBtn = backdrop.querySelector('.sc-auth-close')
    var googleBtn = backdrop.querySelector('[data-auth-google]')
    var emailForm = backdrop.querySelector('[data-auth-email-form]')
    var avoidGoogleOAuth = shouldAvoidGoogleOAuth()

    if (avoidGoogleOAuth) {
      googleBtn.textContent = 'Use magic link instead'
      setPolicyMessage(backdrop, getBrowserPolicyMessage(), 'err')
    }

    closeBtn.addEventListener('click', closeModal)
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) closeModal()
    })

    googleBtn.addEventListener('click', async function () {
      if (avoidGoogleOAuth) {
        setStatus(backdrop, getBrowserPolicyMessage(), 'err')
        return
      }
      setStatus(backdrop, 'Redirecting to Google...', '')
      saveReturnPath(currentReturnPath())
      var result = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: location.origin + CALLBACK_PATH,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      })
      if (result && result.error) {
        setStatus(backdrop, result.error.message || 'Google sign-in failed.', 'err')
      }
    })

    emailForm.addEventListener('submit', async function (event) {
      event.preventDefault()
      var formData = new FormData(emailForm)
      var email = String(formData.get('email') || '').trim()
      if (!email) {
        setStatus(backdrop, 'Enter your email first.', 'err')
        return
      }
      setStatus(backdrop, 'Sending magic link...', '')
      saveReturnPath(currentReturnPath())
      var result = await client.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: location.origin + CALLBACK_PATH,
        },
      })
      if (result && result.error) {
        setStatus(backdrop, result.error.message || 'Could not send magic link.', 'err')
        return
      }
      setStatus(backdrop, 'Magic link sent. Check your email.', 'ok')
    })
  }

  function buildSignedInUi(client, session) {
    var shell = document.createElement('div')
    shell.className = 'sc-auth-shell'

    var user = session && session.user ? session.user : null
    var email = user && user.email ? user.email : 'Signed in'
    var metadata = (user && user.user_metadata) || {}
    var displayName =
      metadata.display_name ||
      metadata.full_name ||
      metadata.name ||
      email.split('@')[0] ||
      'Account'
    var shortName = displayName.length > 14 ? displayName.slice(0, 12) + '...' : displayName
    var shortEmail = email.length > 18 ? email.slice(0, 15) + '...' : email
    var initial = shortName.charAt(0).toUpperCase()

    var badge = document.createElement('div')
    badge.className = 'sc-auth-user'
    badge.innerHTML =
      '<span class="sc-auth-avatar">' + initial + '</span>' +
      '<span class="sc-auth-copywrap"><strong>' + shortName + '</strong><small>' + shortEmail + '</small></span>'
    badge.title = displayName + ' • ' + email

    var signOut = document.createElement('button')
    signOut.type = 'button'
    signOut.className = 'sc-auth-signout'
    signOut.textContent = 'Sign out'
    signOut.addEventListener('click', async function () {
      await client.auth.signOut()
      location.reload()
    })

    shell.appendChild(badge)
    shell.appendChild(signOut)
    return shell
  }

  function mountAuthUi(client, session) {
      var topbarInner = document.querySelector('.topbar-inner')
      var existing = document.querySelector('[data-sc-auth-mount]')
      if (existing) existing.remove()

      var mount = document.createElement('div')
      mount.setAttribute('data-sc-auth-mount', '1')
      mount.className = 'sc-auth-inline'

    if (session && session.user) {
      mount.appendChild(buildSignedInUi(client, session))
    } else {
      var btn = createButton('Sign In', 'btn btn-secondary sc-auth-launch')
      btn.addEventListener('click', openModal)
      mount.appendChild(btn)
    }

      if (topbarInner) {
        topbarInner.appendChild(mount)
        syncNavMoreMenu()
        return
      }

      mount.className = 'sc-auth-float'
      mount.setAttribute('data-sc-auth-floating', '1')
      document.body.appendChild(mount)
      syncNavMoreMenu()
    }

    function setGateMode(locked) {
      var backdrop = ensureModal()
      var shouldLock = !!locked && !isPromptDismissed()
      backdrop.classList.toggle('locked', shouldLock)
      if (shouldLock) {
        openModal()
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'
      } else {
        backdrop.classList.remove('locked')
        if (document.body) document.body.classList.remove('auth-modal-open')
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }
    }

  function hasHashTokens() {
    return /access_token=|refresh_token=|token_hash=/.test(location.hash || '')
  }

  function getHashParams() {
    var hash = String(location.hash || '')
    if (hash.charAt(0) === '#') hash = hash.slice(1)
    return new URLSearchParams(hash)
  }

  async function handleCallback(client) {
    var bodyBox = document.querySelector('.box')
    if (bodyBox) bodyBox.textContent = 'Completing sign in...'
    var params = new URLSearchParams(location.search || '')
    var hashParams = getHashParams()

    try {
      if (params.get('code')) {
        var exchange = await client.auth.exchangeCodeForSession(params.get('code'))
        if (exchange && exchange.error) {
          if (bodyBox) bodyBox.textContent = exchange.error.message || 'Sign in failed.'
          return
        }
      } else if (params.get('token_hash') && params.get('type')) {
        var verify = await client.auth.verifyOtp({
          token_hash: params.get('token_hash'),
          type: params.get('type'),
        })
        if (verify && verify.error) {
          if (bodyBox) bodyBox.textContent = verify.error.message || 'Sign in failed.'
          return
        }
      } else if (hashParams.get('access_token') && hashParams.get('refresh_token')) {
        var setResult = await client.auth.setSession({
          access_token: hashParams.get('access_token'),
          refresh_token: hashParams.get('refresh_token'),
        })
        if (setResult && setResult.error) {
          if (bodyBox) bodyBox.textContent = setResult.error.message || 'Sign in failed.'
          return
        }
      } else if (params.get('error_description') || hashParams.get('error_description')) {
        if (bodyBox) {
          bodyBox.textContent =
            params.get('error_description') ||
            hashParams.get('error_description') ||
            'Sign in failed.'
        }
        return
      } else if (hasHashTokens()) {
        await new Promise(function (resolve) { setTimeout(resolve, 350) })
      }
    } catch (err) {
      if (bodyBox) bodyBox.textContent = err && err.message ? err.message : 'Sign in failed.'
      return
    }

    var result = await client.auth.getSession()
    if (result.error || !(result.data && result.data.session)) {
      var fallbackTarget = readReturnPath()
      if (fallbackTarget && fallbackTarget !== CALLBACK_PATH) {
        location.replace(fallbackTarget)
        return
      }
      if (bodyBox) bodyBox.textContent = (result.error && result.error.message) || 'Sign in failed.'
      return
    }

    var target = normalizeReturnPath(readReturnPath())
    clearReturnPath()
    location.replace(target || '/index.html')
  }

  async function run() {
    injectStyles()
    if (typeof window.scSupabaseReady !== 'function') return
    var client = await window.scSupabaseReady()
    bindModal(client)

    if (isCallbackPage()) {
      await handleCallback(client)
      return
    }

    var sessionResult = await client.auth.getSession()
    var session = sessionResult && sessionResult.data ? sessionResult.data.session : null
    mountAuthUi(client, session)
    setGateMode(REQUIRE_AUTH && !session)
    syncNavMoreMenu()
    window.addEventListener('resize', syncNavMoreMenu)

    client.auth.onAuthStateChange(function (_event, session) {
      mountAuthUi(client, session || null)
      setGateMode(REQUIRE_AUTH && !session)
      syncNavMoreMenu()
      if (isCallbackPage() && session) {
        var target = normalizeReturnPath(readReturnPath())
        clearReturnPath()
        location.replace(target || '/index.html')
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      run().catch(function (err) { console.error('Supabase auth init failed:', err) })
    })
  } else {
    run().catch(function (err) { console.error('Supabase auth init failed:', err) })
  }
})()
