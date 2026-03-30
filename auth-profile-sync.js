(function () {
  var PROFILE_CACHE_KEY = 'sc_auth_profile_v1'

  function readCachedProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_CACHE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (_err) {
      return null
    }
  }

  function getProfile(detail) {
    return (
      (detail && detail.profile) ||
      window.scAuthProfile ||
      readCachedProfile() ||
      null
    )
  }

  function getClient() {
    return window.scGetSupabaseClient ? window.scGetSupabaseClient() : null
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  function getPlanTone(plan) {
    var value = String(plan || '').toLowerCase()
    if (value.indexOf('fellow') !== -1 || value.indexOf('premium') !== -1) return 'Premium'
    if (value.indexOf('institution') !== -1) return 'Institution'
    return 'Starter'
  }

  function getPlanDisplay(plan) {
    var value = String(plan || '').trim()
    if (!value) return 'Starter'
    return value.replace(/\b\w/g, function (c) { return c.toUpperCase() })
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
      if (!profile) return
      if (profile.avatarUrl) {
        node.src = profile.avatarUrl
        node.removeAttribute('data-auth-fallback')
      } else {
        node.setAttribute('data-auth-fallback', profile.initials || 'S')
      }
      node.alt = profile.name ? profile.name + ' avatar' : node.alt
    })
  }

  function readAchievementMeta(profile) {
    var points = 0
    var count = 0

    function currentScopeSuffix() {
      var active = profile || getProfile()
      return active && active.id ? 'user:' + active.id : 'guest'
    }

    function scopedKey(baseKey) {
      return baseKey + '::' + currentScopeSuffix()
    }

    function readNumberKey(baseKey) {
      try {
        var raw = localStorage.getItem(scopedKey(baseKey))
        if (raw == null) raw = localStorage.getItem(baseKey)
        return raw != null ? Number(raw) || 0 : 0
      } catch (_errScoped) {
        return 0
      }
    }

    if (profile) {
      points = Number(
        profile.achievementPoints ||
        profile.points ||
        profile.score ||
        0
      ) || 0
      count = Number(
        profile.achievementCount ||
        profile.unlockedAchievements ||
        0
      ) || 0
    }

    var pointKeys = [
      'sc_achievement_points_v1',
      'sc_profile_points_v1',
      'sc_points_v1'
    ]
    for (var i = 0; i < pointKeys.length; i++) {
      points = Math.max(points, readNumberKey(pointKeys[i]))
    }

    var countKeys = [
      'sc_achievement_count_v1',
      'sc_unlocked_achievements_v1'
    ]
    for (var j = 0; j < countKeys.length; j++) {
      count = Math.max(count, readNumberKey(countKeys[j]))
    }

    return { points: points, count: count }
  }

  function getSidebarTier(profile) {
    var plan = String((profile && profile.plan) || '').toLowerCase()
    var achievementMeta = readAchievementMeta(profile)

    if (plan.indexOf('fellow') !== -1 || plan.indexOf('premium') !== -1) return 'Premium'
    if (plan.indexOf('institution') !== -1) return 'Institution'
    if (achievementMeta.points >= 1000 || achievementMeta.count >= 12) return 'Top Scholar'
    if (achievementMeta.points >= 300 || achievementMeta.count >= 6) return 'Achiever'
    return 'Starter'
  }

  function applyProfile(profile) {
    var active = !!profile
    applyText('[data-auth-name]', active ? profile.name : 'Guest Scholar')
    applyText('[data-auth-email]', active ? profile.email : 'Not signed in')
    applyText('[data-auth-bio]', active ? profile.bio : 'Sign in to connect your study profile, saved progress, and premium features.')
    applyText('[data-auth-plan]', active ? getPlanDisplay(profile.plan) : 'Starter')
    applyText('[data-auth-plan-copy]', active ? getSidebarTier(profile) : 'Starter')
    applyInput('[data-auth-name-input]', active ? profile.name : '')
    applyInput('[data-auth-bio-input]', active ? profile.bio : '')
    applyAvatar('[data-auth-avatar]', profile)

    document.querySelectorAll('[data-auth-upgrade]').forEach(function (node) {
      if (!active) {
        node.textContent = 'Sign In to Upgrade'
        return
      }
      var plan = String(profile.plan || '').toLowerCase()
      node.textContent = plan.indexOf('fellow') !== -1 || plan.indexOf('premium') !== -1
        ? 'Manage Membership'
        : 'Upgrade to Fellow'
    })

    document.querySelectorAll('[data-auth-save-profile]').forEach(function (node) {
      node.disabled = !active
      node.setAttribute('aria-disabled', active ? 'false' : 'true')
      if (!active) node.title = 'Sign in to save profile details'
    })
  }

  async function handleLogout(event) {
    event.preventDefault()
    var client = getClient()
    if (!client) return
    await client.auth.signOut()
    window.location.href = 'index.html'
  }

  async function saveProfile() {
    var client = getClient()
    var profile = getProfile()
    if (!client || !profile) return

    var nameInput = document.querySelector('[data-auth-name-input]')
    var bioInput = document.querySelector('[data-auth-bio-input]')
    var status = document.querySelector('[data-auth-save-status]')
    var nextName = nameInput && 'value' in nameInput ? String(nameInput.value || '').trim() : profile.name
    var nextBio = bioInput && 'value' in bioInput ? String(bioInput.value || '').trim() : profile.bio

    if (status) status.textContent = 'Saving profile...'

    var result = await client.auth.updateUser({
      data: {
        display_name: nextName || profile.name,
        full_name: nextName || profile.name,
        name: nextName || profile.name,
        study_bio: nextBio || profile.bio,
        bio: nextBio || profile.bio,
        plan: profile.plan,
      },
    })

    if (result && result.error) {
      if (status) status.textContent = result.error.message || 'Could not save profile.'
      return
    }

    if (status) status.textContent = 'Profile saved.'

    var updatedSession = window.scAuthSession
    if (updatedSession && updatedSession.user) {
      updatedSession.user.user_metadata = Object.assign({}, updatedSession.user.user_metadata || {}, {
        display_name: nextName || profile.name,
        full_name: nextName || profile.name,
        name: nextName || profile.name,
        study_bio: nextBio || profile.bio,
        bio: nextBio || profile.bio,
      })
    }

    window.dispatchEvent(new CustomEvent('sc:auth-state-changed', {
      detail: {
        session: updatedSession || null,
        profile: {
          id: profile.id,
          email: profile.email,
          name: nextName || profile.name,
          bio: nextBio || profile.bio,
          plan: profile.plan,
          avatarUrl: profile.avatarUrl,
          initials: String(nextName || profile.name || 'S').trim().charAt(0).toUpperCase(),
        },
      },
    }))
  }

  function bindActions() {
    document.querySelectorAll('[data-auth-logout-trigger]').forEach(function (node) {
      if (node.getAttribute('data-auth-bound') === '1') return
      node.setAttribute('data-auth-bound', '1')
      node.addEventListener('click', handleLogout)
    })

    document.querySelectorAll('[data-auth-save-profile]').forEach(function (node) {
      if (node.getAttribute('data-auth-save-bound') === '1') return
      node.setAttribute('data-auth-save-bound', '1')
      node.addEventListener('click', function (event) {
        event.preventDefault()
        saveProfile().catch(function (err) {
          var status = document.querySelector('[data-auth-save-status]')
          if (status) status.textContent = err && err.message ? err.message : 'Could not save profile.'
        })
      })
    })
  }

  function update(detail) {
    applyProfile(getProfile(detail))
    bindActions()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      update()
    })
  } else {
    update()
  }

  window.addEventListener('sc:auth-state-changed', function (event) {
    update(event.detail)
  })
})()
