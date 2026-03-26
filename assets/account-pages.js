(function () {
  var SETTINGS_KEY = 'sc_account_settings_v1'
  var PROFILE_CACHE_KEY = 'sc_auth_profile_v1'

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

  function getProfile(detail) {
    if (detail && detail.profile) return detail.profile
    if (window.scAuthProfile) return window.scAuthProfile
    return readJson(PROFILE_CACHE_KEY, null)
  }

  function defaultSettings() {
    return {
      emailDigest: true,
      pushNotifications: false,
      largeText: false,
      highContrast: false,
      twoFactorEnabled: false,
    }
  }

  function readSettings() {
    return Object.assign(defaultSettings(), readJson(SETTINGS_KEY, {}))
  }

  function saveSettings(next) {
    writeJson(SETTINGS_KEY, next)
    applyVisualSettings(next)
  }

  function applyVisualSettings(settings) {
    document.body.classList.toggle('sc-large-text', !!settings.largeText)
    document.body.classList.toggle('sc-high-contrast', !!settings.highContrast)
    if (!document.getElementById('sc-account-page-styles')) {
      var style = document.createElement('style')
      style.id = 'sc-account-page-styles'
      style.textContent =
        'body.sc-large-text{font-size:18px}' +
        'body.sc-large-text input,body.sc-large-text textarea,body.sc-large-text button{font-size:1rem}' +
        'body.sc-high-contrast{filter:contrast(1.12) saturate(.92)}' +
        '[data-account-status]{min-height:20px}'
      document.head.appendChild(style)
    }
  }

  function setStatus(message, tone) {
    document.querySelectorAll('[data-account-status]').forEach(function (node) {
      node.textContent = message || ''
      node.dataset.tone = tone || ''
      node.style.color = tone === 'error' ? '#b91c1c' : tone === 'success' ? '#166534' : ''
    })
  }

  function applyText(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value
    })
  }

  function applyInput(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      if ('value' in node) node.value = value
    })
  }

  function applyAvatar(selector, profile) {
    document.querySelectorAll(selector).forEach(function (node) {
      if (profile && profile.avatarUrl) node.src = profile.avatarUrl
      if (profile && profile.name) node.alt = profile.name + ' avatar'
    })
  }

  function titleCase(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\b\w/g, function (c) { return c.toUpperCase() })
  }

  function applyProfile(profile) {
    var active = !!profile
    var name = active ? profile.name : 'Guest Scholar'
    var email = active ? profile.email : 'Not signed in'
    var bio = active
      ? (profile.bio || 'Using Soul Concept to turn scattered notes into focused, repeatable study sessions.')
      : 'Sign in to connect your profile, preferences, and membership.'
    var plan = active ? titleCase(profile.plan || 'Starter') : 'Starter'

    applyText('[data-auth-name]', name)
    applyText('[data-auth-email]', email)
    applyText('[data-auth-bio]', bio)
    applyText('[data-auth-plan]', plan)
    applyText('[data-auth-plan-copy]', plan)
    applyInput('[data-auth-name-input]', active ? name : '')
    applyInput('[data-auth-bio-input]', active ? bio : '')
    applyAvatar('[data-auth-avatar]', profile)

    document.querySelectorAll('[data-auth-upgrade]').forEach(function (node) {
      node.textContent = plan.toLowerCase() === 'fellow' ? 'Manage Membership' : 'Upgrade to Fellow'
    })
  }

  function reflectPlan(planValue) {
    var plan = String(planValue || 'Starter').toLowerCase()
    document.querySelectorAll('[data-plan-card]').forEach(function (node) {
      var target = String(node.getAttribute('data-plan-card') || '').toLowerCase()
      var active = target === plan
      node.dataset.active = active ? 'true' : 'false'
      node.style.outline = active ? '2px solid rgba(0,68,53,.45)' : ''
      node.style.outlineOffset = active ? '3px' : ''
    })
    document.querySelectorAll('[data-plan-action]').forEach(function (node) {
      var target = String(node.getAttribute('data-plan-action') || '').toLowerCase()
      if (target === plan) {
        node.textContent = 'Current Plan'
        if (node.tagName === 'A') node.removeAttribute('href')
      } else if (target === 'fellow') {
        node.textContent = 'Upgrade to Fellow'
      } else if (target === 'institution') {
        node.textContent = 'Contact Sales'
      } else {
        node.textContent = 'Switch to Scholar'
      }
    })
    applyText('[data-auth-plan]', titleCase(plan))
    applyText('[data-auth-plan-copy]', titleCase(plan))
  }

  async function persistPlan(plan) {
    var client = window.scGetSupabaseClient ? window.scGetSupabaseClient() : null
    var profile = getProfile()
    if (!profile) {
      setStatus('Sign in to save membership changes.', 'error')
      return false
    }

    if (client) {
      var result = await client.auth.updateUser({
        data: {
          plan: plan,
          tier: plan,
          membership: plan,
        },
      })
      if (result && result.error) {
        setStatus(result.error.message || 'Could not update membership.', 'error')
        return false
      }
    }

    var nextProfile = Object.assign({}, profile, { plan: titleCase(plan) })
    window.scAuthProfile = nextProfile
    writeJson(PROFILE_CACHE_KEY, nextProfile)
    window.dispatchEvent(new CustomEvent('sc:auth-state-changed', {
      detail: {
        session: window.scAuthSession || null,
        profile: nextProfile,
      },
    }))
    setStatus('Membership updated to ' + titleCase(plan) + '.', 'success')
    return true
  }

  function bindSettings() {
    var settings = readSettings()
    document.querySelectorAll('[data-setting-key]').forEach(function (node) {
      var key = node.getAttribute('data-setting-key')
      if (!(key in settings)) return
      node.checked = !!settings[key]
      if (node.getAttribute('data-setting-bound') === '1') return
      node.setAttribute('data-setting-bound', '1')
      node.addEventListener('change', function () {
        settings[key] = !!node.checked
        saveSettings(settings)
        if (key === 'twoFactorEnabled') {
          applyText('[data-two-factor-status]', settings[key] ? 'Status: Active' : 'Status: Inactive')
        }
      })
    })
    applyText('[data-two-factor-status]', settings.twoFactorEnabled ? 'Status: Active' : 'Status: Inactive')
    applyVisualSettings(settings)
  }

  function bindSettingsActions() {
    var saveButton = document.querySelector('[data-settings-save]')
    if (saveButton && saveButton.getAttribute('data-bound') !== '1') {
      saveButton.setAttribute('data-bound', '1')
      saveButton.addEventListener('click', function (event) {
        event.preventDefault()
        var trigger = document.querySelector('[data-auth-save-profile]')
        if (trigger) trigger.click()
        setStatus('Settings saved on this device.', 'success')
      })
    }

    var discardButton = document.querySelector('[data-settings-discard]')
    if (discardButton && discardButton.getAttribute('data-bound') !== '1') {
      discardButton.setAttribute('data-bound', '1')
      discardButton.addEventListener('click', function (event) {
        event.preventDefault()
        bindSettings()
        applyProfile(getProfile())
        setStatus('Changes reset.', 'success')
      })
    }

    var passwordButton = document.querySelector('[data-password-change]')
    if (passwordButton && passwordButton.getAttribute('data-bound') !== '1') {
      passwordButton.setAttribute('data-bound', '1')
      passwordButton.addEventListener('click', async function (event) {
        event.preventDefault()
        var client = window.scGetSupabaseClient ? window.scGetSupabaseClient() : null
        var profile = getProfile()
        if (!client || !profile || !profile.email) {
          setStatus('Sign in first to change your password.', 'error')
          return
        }
        var nextPassword = window.prompt('Enter a new password for your account:')
        if (!nextPassword) return
        var result = await client.auth.updateUser({ password: nextPassword })
        if (result && result.error) {
          setStatus(result.error.message || 'Could not update password.', 'error')
          return
        }
        setStatus('Password updated.', 'success')
      })
    }

    var twoFactorButton = document.querySelector('[data-two-factor-toggle]')
    if (twoFactorButton && twoFactorButton.getAttribute('data-bound') !== '1') {
      twoFactorButton.setAttribute('data-bound', '1')
      twoFactorButton.addEventListener('click', function (event) {
        event.preventDefault()
        var settings = readSettings()
        settings.twoFactorEnabled = !settings.twoFactorEnabled
        saveSettings(settings)
        bindSettings()
        setStatus(settings.twoFactorEnabled ? 'Two-factor mode enabled on this device.' : 'Two-factor mode disabled.', 'success')
      })
    }
  }

  function bindMembershipActions() {
    document.querySelectorAll('[data-plan-action]').forEach(function (node) {
      if (node.getAttribute('data-bound') === '1') return
      node.setAttribute('data-bound', '1')
      node.addEventListener('click', function (event) {
        event.preventDefault()
        var plan = node.getAttribute('data-plan-action')
        if (!plan) return
        persistPlan(plan).then(function (ok) {
          if (ok) reflectPlan(plan)
        })
      })
    })
  }

  function init() {
    applyProfile(getProfile())
    bindSettings()
    bindSettingsActions()
    bindMembershipActions()
    reflectPlan((getProfile() && getProfile().plan) || 'Starter')
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }

  window.addEventListener('sc:auth-state-changed', function (event) {
    applyProfile(getProfile(event.detail))
    reflectPlan((getProfile(event.detail) && getProfile(event.detail).plan) || 'Starter')
  })
})();
