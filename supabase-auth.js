(function () {
  var CALLBACK_PATH = '/auth/callback.html'
  var RETURN_TO_KEY = 'sc_auth_return_to'
  var REQUIRE_AUTH = true

  function injectStyles() {
    if (document.getElementById('sc-supabase-auth-styles')) return
    var style = document.createElement('style')
    style.id = 'sc-supabase-auth-styles'
    style.textContent =
      '.sc-auth-launch{white-space:nowrap}' +
      '.sc-auth-shell{position:relative;display:inline-flex;align-items:center;gap:8px}' +
      '.sc-auth-user{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;border:1px solid rgba(33,92,75,.18);background:rgba(255,255,255,.92);color:#1b1b1f;font-weight:800;font-size:.82rem;max-width:172px;overflow:hidden}' +
      '.sc-auth-user small{display:block;font-weight:700;color:#5a5863;font-size:.72rem}' +
      '.sc-auth-signout{border:1px solid #e2d8cb;background:#fff;color:#1b1b1f;border-radius:999px;padding:8px 10px;font-weight:800;cursor:pointer;font-size:.82rem}' +
      '.sc-auth-float{position:fixed;top:14px;right:14px;z-index:10002;display:flex;gap:8px;align-items:center}' +
      '.sc-auth-modal-backdrop{position:fixed;inset:0;background:rgba(10,14,20,.48);backdrop-filter:blur(8px);z-index:10020;display:none;align-items:center;justify-content:center;padding:18px}' +
      '.sc-auth-modal-backdrop.open{display:flex}' +
      '.sc-auth-modal-backdrop.locked{background:rgba(10,14,20,.72)}' +
      '.sc-auth-modal-backdrop.locked .sc-auth-close{display:none}' +
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
      '.sc-auth-foot{margin-top:8px;color:#7b746b;font-size:.78rem;line-height:1.45}' +
      '@media (max-width:840px){.sc-auth-launch{width:auto;padding:8px 10px;font-size:.82rem}.sc-auth-shell{gap:6px}.sc-auth-user{max-width:132px;padding:7px 9px}.sc-auth-signout{padding:7px 9px}.sc-auth-float{top:10px;right:10px}}'
    document.head.appendChild(style)
  }

  function isCallbackPage() {
    return (location.pathname || '').toLowerCase() === CALLBACK_PATH
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

  function createButton(label, className) {
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.className = className
    btn.textContent = label
    return btn
  }

  function ensureModal() {
    var existing = document.getElementById('sc-auth-modal-backdrop')
    if (existing) return existing

    var backdrop = document.createElement('div')
    backdrop.id = 'sc-auth-modal-backdrop'
    backdrop.className = 'sc-auth-modal-backdrop'
    backdrop.innerHTML =
      '<div class="sc-auth-modal" role="dialog" aria-modal="true" aria-labelledby="sc-auth-title">' +
      '<button class="sc-auth-close" type="button" aria-label="Close sign in">x</button>' +
      '<h2 class="sc-auth-title" id="sc-auth-title">Sign in to Soul Concept</h2>' +
      '<p class="sc-auth-copy">Use Google or a magic link sent to your email. This keeps your progress and premium access tied to your account.</p>' +
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
      '<p class="sc-auth-foot">Google sign-in must be enabled in Supabase Auth Providers, and email sign-in must allow magic links.</p>' +
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

  function openModal() {
    var backdrop = ensureModal()
    backdrop.classList.add('open')
    var input = backdrop.querySelector('#sc-auth-email')
    if (input) setTimeout(function () { input.focus() }, 10)
  }

  function closeModal() {
    var backdrop = ensureModal()
    if (backdrop.classList.contains('locked')) return
    backdrop.classList.remove('open')
    setStatus(backdrop, '', '')
  }

  function bindModal(client) {
    var backdrop = ensureModal()
    if (backdrop.getAttribute('data-auth-bound') === '1') return
    backdrop.setAttribute('data-auth-bound', '1')

    var closeBtn = backdrop.querySelector('.sc-auth-close')
    var googleBtn = backdrop.querySelector('[data-auth-google]')
    var emailForm = backdrop.querySelector('[data-auth-email-form]')

    closeBtn.addEventListener('click', closeModal)
    backdrop.addEventListener('click', function (event) {
      if (event.target === backdrop) closeModal()
    })

    googleBtn.addEventListener('click', async function () {
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
    var shortEmail = email.length > 24 ? email.slice(0, 21) + '...' : email

    var badge = document.createElement('div')
    badge.className = 'sc-auth-user'
    badge.innerHTML = '<span>Account</span><small>' + shortEmail + '</small>'
    badge.title = email

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
    var host = document.querySelector('[data-nav-menu]')
    var existing = document.querySelector('[data-sc-auth-mount]')
    if (existing) existing.remove()

    var mount = document.createElement('div')
    mount.setAttribute('data-sc-auth-mount', '1')

    if (session && session.user) {
      mount.appendChild(buildSignedInUi(client, session))
    } else {
      var btn = createButton('Sign In', 'btn btn-secondary sc-auth-launch')
      btn.addEventListener('click', openModal)
      mount.appendChild(btn)
    }

    if (host) {
      host.appendChild(mount)
      return
    }

    mount.className = 'sc-auth-float'
    document.body.appendChild(mount)
  }

  function setGateMode(locked) {
    var backdrop = ensureModal()
    backdrop.classList.toggle('locked', !!locked)
    if (locked) {
      openModal()
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      backdrop.classList.remove('locked')
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }

  function hasHashTokens() {
    return /access_token=|refresh_token=|token_hash=/.test(location.hash || '')
  }

  async function handleCallback(client) {
    var bodyBox = document.querySelector('.box')
    if (bodyBox) bodyBox.textContent = 'Completing sign in...'
    var params = new URLSearchParams(location.search || '')

    if (params.get('code')) {
      var exchange = await client.auth.exchangeCodeForSession(params.get('code'))
      if (exchange.error) {
        if (bodyBox) bodyBox.textContent = exchange.error.message || 'Sign in failed.'
        return
      }
    } else if (hasHashTokens()) {
      await new Promise(function (resolve) { setTimeout(resolve, 250) })
    }

    var result = await client.auth.getSession()
    if (result.error || !(result.data && result.data.session)) {
      if (bodyBox) bodyBox.textContent = (result.error && result.error.message) || 'Sign in failed.'
      return
    }

    var target = readReturnPath()
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

    client.auth.onAuthStateChange(function (_event, session) {
      mountAuthUi(client, session || null)
      setGateMode(REQUIRE_AUTH && !session)
      if (isCallbackPage() && session) {
        var target = readReturnPath()
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
