(function () {
  function initSidebar() {
    var sidebarMount = document.querySelector('[data-sc-app-sidebar]')
    if (!sidebarMount) return false

    var PROFILE_CACHE_KEY = 'sc_auth_profile_v1'
    var SCHEDULE_KEY = 'sc_schedule_events_v2'
    var sidebarStorageKey = 'sc-sidebar-optional'
    var page = (document.body && document.body.dataset.scSidebarPage) || ''
    var currentPath = String((window.location && window.location.pathname) || '').replace(/\\/g, '/')
    var pathPrefix = /\/(anki|math|auth)\//.test(currentPath) ? '../' : ''
    var DEFAULT_EVENTS = [
    { id: 'evt-1', title: 'Neuroscience Lab', subject: 'Biology 302', date: '2026-03-30', start: '09:00', end: '10:30', starred: true },
    { id: 'evt-2', title: 'Deep Work: Thesis', subject: 'Focus Block', date: '2026-03-30', start: '14:30', end: '16:00', starred: false },
    { id: 'evt-3', title: 'Stochastic Models', subject: 'Mathematics', date: '2026-03-31', start: '10:30', end: '12:00', starred: false },
    { id: 'evt-4', title: 'Seminar: Modern Ethics', subject: 'Philosophy', date: '2026-04-01', start: '13:00', end: '14:30', starred: true },
    { id: 'evt-5', title: 'Physics Recitation', subject: 'Physics', date: '2026-04-02', start: '09:00', end: '10:30', starred: false },
    { id: 'evt-6', title: 'Weekly Peer Review', subject: 'English', date: '2026-04-03', start: '16:30', end: '17:30', starred: false }
  ]
  var badgeDefs = [
    { target: 5, progressKey: 'subjectCount' },
    { target: 10, progressKey: 'starredCount' },
    { target: 4, progressKey: 'scienceCount' },
    { target: 16, progressKey: 'sessionCount' },
    { target: 5, progressKey: 'focusCount' },
    { target: 7, progressKey: 'dayCount' },
    { target: 8, progressKey: 'sessionCount' },
    { target: 28, progressKey: 'sessionCount' },
    { target: 12, progressKey: 'focusCount' },
    { target: 16, progressKey: 'starredCount' },
    { target: 8, progressKey: 'scienceCount' },
    { target: 14, progressKey: 'dayCount' },
    { target: 10, progressKey: 'subjectCount' },
    { target: 1200, progressKey: 'minutesTotal' },
    { target: 2100, progressKey: 'minutesTotal' }
  ]
  var levelDefs = [
    { title: 'Starter', minPoints: 0 },
    { title: 'Scholar', minPoints: 1800 },
    { title: 'Curator', minPoints: 4200 },
    { title: 'Architect', minPoints: 7600 },
    { title: 'Strategist', minPoints: 11800 },
    { title: 'Luminary', minPoints: 17000 }
  ]

    function route(href) {
      return pathPrefix + href
    }

    function readCachedProfile() {
    try {
      var raw = localStorage.getItem(PROFILE_CACHE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (_err) {
      return null
    }
  }

    function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

    function getProfileName(profile) {
    return (profile && profile.name) || 'Guest Scholar'
  }

    function getProfilePlan(profile) {
    var value = String((profile && profile.plan) || '').trim()
    return value ? value.replace(/\b\w/g, function (char) { return char.toUpperCase() }) : 'Starter'
  }

    function currentScopeSuffix(profile) {
    var active = profile || readCachedProfile()
    return active && active.id ? 'user:' + active.id : 'guest'
  }

    function scopedKey(baseKey, profile) {
    return baseKey + '::' + currentScopeSuffix(profile)
  }

    function readJson(baseKey, fallback, profile) {
    try {
      var raw = localStorage.getItem(scopedKey(baseKey, profile))
      if (raw == null) {
        raw = localStorage.getItem(baseKey)
        if (raw != null) localStorage.setItem(scopedKey(baseKey, profile), raw)
      }
      return raw ? JSON.parse(raw) : fallback
    } catch (_err) {
      return fallback
    }
  }

    function readNumber(baseKey, profile) {
    try {
      var scoped = localStorage.getItem(scopedKey(baseKey, profile))
      if (scoped != null) return Number(scoped) || 0
      var raw = localStorage.getItem(baseKey)
      return raw != null ? Number(raw) || 0 : 0
    } catch (_err) {
      return 0
    }
  }

    function readEvents(profile) {
    if (window.StudyIntelligence && window.StudyIntelligence.getEvents) {
      var liveEvents = window.StudyIntelligence.getEvents()
      if (Array.isArray(liveEvents) && liveEvents.length) return liveEvents
    }
    var stored = readJson(SCHEDULE_KEY, null, profile)
    return Array.isArray(stored) && stored.length ? stored : DEFAULT_EVENTS
  }

    function normalizeSubject(value) {
    return String(value || '').trim().toLowerCase()
  }

    function toMinutes(value) {
    var parts = String(value || '00:00').split(':')
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0)
  }

    function minutesBetween(start, end) {
    return Math.max(0, toMinutes(end) - toMinutes(start))
  }

    function computePoints(stats) {
    return (stats.sessionCount * 65) + (stats.subjectCount * 90) + (stats.dayCount * 55) + (stats.focusCount * 40) + (stats.starredCount * 25)
  }

    function buildStats(events) {
    var uniqueSubjects = {}
    var uniqueDates = {}
    var minutesTotal = 0
    var starredCount = 0
    var scienceCount = 0
    var focusCount = 0

    events.forEach(function (event) {
      var subject = normalizeSubject(event.subject || event.title)
      if (subject) uniqueSubjects[subject] = true
      if (event.date) uniqueDates[event.date] = true
      minutesTotal += minutesBetween(event.start, event.end)
      if (event.starred) starredCount += 1
      if (/science|biology|physics|chemistry/.test(subject)) scienceCount += 1
      if (/focus|deep work/.test(subject) || /focus|deep work/.test(normalizeSubject(event.title))) focusCount += 1
    })

    return {
      sessionCount: events.length,
      subjectCount: Object.keys(uniqueSubjects).length,
      dayCount: Object.keys(uniqueDates).length,
      starredCount: starredCount,
      scienceCount: scienceCount,
      focusCount: focusCount,
      minutesTotal: minutesTotal
    }
  }

    function computeUnlockedBadges(stats, profile) {
    var unlocked = badgeDefs.reduce(function (count, badge) {
      return count + ((stats[badge.progressKey] || 0) >= badge.target ? 1 : 0)
    }, 0)
    var storedCount = Math.max(
      readNumber('sc_achievement_count_v1', profile),
      readNumber('sc_unlocked_achievements_v1', profile),
      Number((profile && (profile.achievementCount || profile.unlockedAchievements)) || 0) || 0
    )
    return Math.max(unlocked, storedCount)
  }

    function computeLevel(points) {
    var current = levelDefs[0]
    levelDefs.forEach(function (level) {
      if (points >= level.minPoints) current = level
    })
    return current.title
  }

    function getTier(profile, points, badgeCount) {
    var plan = String((profile && profile.plan) || '').toLowerCase()
    if (plan.indexOf('fellow') !== -1 || plan.indexOf('premium') !== -1) return 'Premium Member'
    if (plan.indexOf('institution') !== -1) return 'Institution Plan'
    if (points >= 1000 || badgeCount >= 12) return 'Top Scholar'
    if (points >= 300 || badgeCount >= 6) return 'Achiever'
    return 'Starter'
  }

    function isActive(key) {
    if (key === 'dashboard') return page === 'dashboard' || page === 'home'
    if (key === 'settings') return page === 'settings' || page === 'profile'
    return page === key
  }

    function linkClass(key) {
    return 'sc-app-sidebar-link' + (isActive(key) ? ' is-active' : '')
  }

    function footerLinkClass(key) {
    return 'sc-app-sidebar-footer-link' + (isActive(key) ? ' is-active' : '')
  }

    function renderLink(key, href, icon, label, note) {
    return (
      '<a class="' + linkClass(key) + '" href="' + href + '">' +
        '<span class="sc-app-sidebar-icon"><span class="material-symbols-outlined">' + icon + '</span></span>' +
        '<span class="sc-app-sidebar-link-copy">' +
          '<span class="sc-app-sidebar-label">' + label + '</span>' +
          (note ? '<span class="sc-app-sidebar-link-note">' + note + '</span>' : '') +
        '</span>' +
      '</a>'
    )
  }

    function renderFooterLink(key, href, icon, label) {
    return (
      '<a class="' + footerLinkClass(key) + '" href="' + href + '">' +
        '<span class="sc-app-sidebar-icon"><span class="material-symbols-outlined">' + icon + '</span></span>' +
        '<span class="sc-app-sidebar-link-copy">' +
          '<span class="sc-app-sidebar-label">' + label + '</span>' +
        '</span>' +
      '</a>'
    )
  }

    function renderSectionHeader(title, chip) {
    return (
      '<div class="sc-app-sidebar-section-row">' +
        '<div class="sc-app-sidebar-section-title">' + escapeHtml(title) + '</div>' +
        (chip ? '<div class="sc-app-sidebar-section-chip">' + escapeHtml(chip) + '</div>' : '') +
      '</div>'
    )
  }

    function renderStat(label, value) {
    return (
      '<div class="sc-app-sidebar-profile-stat">' +
        '<span class="sc-app-sidebar-profile-stat-value">' + escapeHtml(value) + '</span>' +
        '<span class="sc-app-sidebar-profile-stat-label">' + escapeHtml(label) + '</span>' +
      '</div>'
    )
  }

    function buildSidebar() {
    var profile = readCachedProfile()
    var events = readEvents(profile)
    var stats = buildStats(events)
    var points = Math.max(computePoints(stats), readNumber('sc_achievement_points_v1', profile), readNumber('sc_profile_points_v1', profile), readNumber('sc_points_v1', profile), Number((profile && (profile.achievementPoints || profile.points || profile.score)) || 0) || 0)
    var badgeCount = computeUnlockedBadges(stats, profile)
    var tier = getTier(profile, points, badgeCount)
    var level = computeLevel(points)
    var progressNote = badgeCount > 0
      ? badgeCount + ' badges unlocked across ' + stats.dayCount + ' study days.'
      : 'Start logging study sessions to unlock badges and build your profile.'

    sidebarMount.innerHTML =
      '<div class="sc-app-sidebar-brand">' +
        '<button aria-label="Hide sidebar" class="sc-app-sidebar-toggle" data-sc-sidebar-toggle type="button">' +
          '<span class="material-symbols-outlined sc-app-sidebar-toggle-icon" aria-hidden="true">chevron_left</span>' +
        '</button>' +
      '</div>' +
      '<div class="sc-app-sidebar-profile">' +
        '<div class="sc-app-sidebar-profile-row">' +
          '<div class="sc-app-sidebar-avatar">' +
            '<img alt="' + escapeHtml(getProfileName(profile)) + ' avatar" data-auth-avatar src="' + escapeHtml((profile && profile.avatarUrl) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJHF1E2P5oWrVzJuja7lpIOv66tsw9qZCZqgXbOS1I9Z7GuKDXdyUA75BIjg2YUsfLGvtjwAtuT-sIB7Y-0XLTb_bRz3zHIBrAKD05qGgpdAtd_j8GbILYKOlveYkQ-IZVa8Q-DsFGT53P2jo-n_Eys8sr8RW7oUtVPkUYSjt1zhnPJzcQX_oS3iEoEIQH5atgN8Sl3K6Igyyep29rKtli1yPC94cR7636T1OMGj38T3l4KlX69YfB7IDhnHRFWTh3wF24umvWoSr7') + '">' +
          '</div>' +
          '<div class="sc-app-sidebar-profile-copy">' +
            '<p class="sc-app-sidebar-profile-name" data-auth-name>' + escapeHtml(getProfileName(profile)) + '</p>' +
            '<p class="sc-app-sidebar-profile-meta"><span data-auth-plan-copy>' + escapeHtml(tier) + '</span> <span class="sc-app-sidebar-profile-separator">/</span> <span>' + escapeHtml(level) + '</span></p>' +
            '<p class="sc-app-sidebar-profile-plan">' + escapeHtml(getProfilePlan(profile)) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="sc-app-sidebar-profile-kicker">Live profile snapshot</div>' +
        '<div class="sc-app-sidebar-profile-stats">' +
          renderStat('Points', points.toLocaleString()) +
          renderStat('Streak', stats.dayCount + 'd') +
          renderStat('Badges', badgeCount) +
        '</div>' +
        '<p class="sc-app-sidebar-profile-note">' + escapeHtml(progressNote) + '</p>' +
      '</div>' +
      '<div class="sc-app-sidebar-group sc-app-sidebar-panel">' +
        renderSectionHeader('Main', 'Studio') +
        '<nav class="sc-app-sidebar-stack">' +
          renderLink('dashboard', route('dashboard.html'), 'grid_view', 'Overview', 'Dashboard and quick actions') +
          renderLink('subjects', route('subject-library.html'), 'auto_stories', 'Subjects', 'Grades and study routes') +
          renderLink('concepts', route('anki/index.html'), 'style', 'Concept Cards', 'Review decks and memory sets') +
          renderLink('schedule', route('schedule.html'), 'calendar_month', 'Schedule', 'Sessions and planning') +
          renderLink('analytics', route('analytics.html'), 'insights', 'Insights', 'Progress and study patterns') +
          renderLink('achievements', route('achievements.html'), 'emoji_events', 'Achievements', 'Milestones and streaks') +
        '</nav>' +
      '</div>' +
      '<div class="sc-app-sidebar-footer sc-app-sidebar-panel">' +
        renderSectionHeader('Account', 'Control') +
        '<nav class="sc-app-sidebar-stack">' +
          renderFooterLink('membership', route('membership.html'), 'subscriptions', 'Membership') +
          renderFooterLink('settings', route('settings.html'), 'settings', 'Settings') +
        '</nav>' +
        '<div class="sc-app-sidebar-footnote">Membership, privacy, and study preferences live here.</div>' +
      '</div>'

    attachSidebarControls()
  }

    function attachSidebarControls() {
    var toggleButton = sidebarMount.querySelector('[data-sc-sidebar-toggle]')
    var toggleIcon = sidebarMount.querySelector('.sc-app-sidebar-toggle-icon')

    function syncSidebar(closed) {
      document.body.classList.toggle('sc-sidebar-closed', closed)
      if (toggleIcon) {
        toggleIcon.textContent = closed ? 'chevron_right' : 'chevron_left'
      }
      if (toggleButton) {
        toggleButton.setAttribute('aria-label', closed ? 'Open sidebar' : 'Hide sidebar')
        toggleButton.title = closed ? 'Open sidebar' : 'Hide sidebar'
      }
    }

    syncSidebar(localStorage.getItem(sidebarStorageKey) === 'closed')

    if (toggleButton) {
      toggleButton.addEventListener('click', function () {
        var nextClosed = !document.body.classList.contains('sc-sidebar-closed')
        localStorage.setItem(sidebarStorageKey, nextClosed ? 'closed' : 'open')
        syncSidebar(nextClosed)
      })
    }
  }

    buildSidebar()
    window.addEventListener('sc:auth-state-changed', buildSidebar)
    return true
  }

  if (!initSidebar()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSidebar, { once: true })
    } else {
      window.setTimeout(initSidebar, 0)
    }
  }
})()
