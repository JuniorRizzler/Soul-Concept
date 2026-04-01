(function (global) {
  var SCHEDULE_KEY = 'sc_schedule_events_v2'
  var DECKS_KEY = 'sc_concept_studio_decks_v1'
  var SESSION_KEY = 'sc_concept_studio_session_v1'
  var AUTH_KEY = 'sc_auth_profile_v1'
  var DEFAULT_DECKS = [
    { id: 'math-foundations', name: 'Calculus Foundations', subject: 'Mathematics', source: 'Soul Concept Starter', cards: [{}, {}, {}] },
    { id: 'science-core', name: 'Cell Biology Core', subject: 'Sciences', source: 'Soul Concept Starter', cards: [{}, {}, {}] },
    { id: 'humanities-core', name: 'World History Recall', subject: 'Humanities', source: 'Soul Concept Starter', cards: [{}, {}] },
    { id: 'engineering-core', name: 'Circuits and Systems', subject: 'Engineering', source: 'Soul Concept Starter', cards: [{}, {}] }
  ]

  function currentScopeSuffix() {
    try {
      var raw = localStorage.getItem(AUTH_KEY)
      var profile = raw ? JSON.parse(raw) : null
      return profile && profile.id ? 'user:' + profile.id : 'guest'
    } catch (_err) {
      return 'guest'
    }
  }

  function scopedKey(baseKey) {
    return baseKey + '::' + currentScopeSuffix()
  }

  function readJson(key, fallback) {
    try {
      var raw = localStorage.getItem(scopedKey(key))
      if (raw == null) {
        raw = localStorage.getItem(key)
        if (raw != null) localStorage.setItem(scopedKey(key), raw)
      }
      return raw ? JSON.parse(raw) : fallback
    } catch (_err) {
      return fallback
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(scopedKey(key), JSON.stringify(value))
    } catch (_err) {}
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  }

  function atMidday(dateLike) {
    var date = dateLike instanceof Date ? new Date(dateLike.getTime()) : new Date(dateLike)
    date.setHours(12, 0, 0, 0)
    return date
  }

  function daysUntil(dateKey, now) {
    if (!dateKey) return Infinity
    var target = atMidday(new Date(dateKey + 'T12:00:00'))
    var base = atMidday(now || new Date())
    return Math.round((target - base) / 86400000)
  }

  function priorityWeight(priority) {
    if (priority === 'High') return 3
    if (priority === 'Low') return 1
    return 2
  }

  function typeWeight(type) {
    if (type === 'test') return 5
    if (type === 'quiz') return 4
    if (type === 'assignment') return 3
    if (type === 'study') return 2
    return 1
  }

  function recommendedProfile(daysRemaining) {
    if (daysRemaining <= 1) return 'short'
    if (daysRemaining <= 3) return 'balanced'
    if (daysRemaining <= 7) return 'long'
    return 'ultra'
  }

  function profileLabel(profile) {
    if (profile === 'short') return 'Short Term'
    if (profile === 'long') return 'Long Term'
    if (profile === 'ultra') return 'Ultra Long Term'
    return 'Balanced'
  }

  function eventUrgency(event, now) {
    var daysRemaining = daysUntil(event && event.date, now)
    var deadlineWeight = daysRemaining <= 0 ? 6 : daysRemaining <= 1 ? 5 : daysRemaining <= 3 ? 4 : daysRemaining <= 7 ? 2 : 1
    return deadlineWeight + priorityWeight(event && event.priority) + typeWeight(event && event.type)
  }

  function getDecks() {
    var stored = readJson(DECKS_KEY, [])
    return Array.isArray(stored) && stored.length ? stored : DEFAULT_DECKS
  }

  function getSession() {
    var stored = readJson(SESSION_KEY, {})
    return stored && typeof stored === 'object' ? stored : {}
  }

  function getEvents() {
    var stored = readJson(SCHEDULE_KEY, [])
    return Array.isArray(stored) ? stored : []
  }

  function matchDeckForEvent(event, decks) {
    if (!event) return null
    var linkedDeckId = event.linkedDeckId || ''
    if (linkedDeckId) {
      var direct = decks.find(function (deck) { return deck.id === linkedDeckId })
      if (direct) return direct
    }
    var eventSubject = normalizeText(event.subject)
    var eventTitle = normalizeText(event.title)
    return decks.find(function (deck) {
      var subject = normalizeText(deck.subject)
      var name = normalizeText(deck.name)
      return (eventSubject && (subject === eventSubject || name.indexOf(eventSubject) !== -1 || eventSubject.indexOf(name) !== -1)) ||
        (eventTitle && (name.indexOf(eventTitle) !== -1 || eventTitle.indexOf(name) !== -1 || subject && eventTitle.indexOf(subject) !== -1))
    }) || null
  }

  function getDeckReviewSummary(deck, session, now) {
    var reviewState = session && session.reviewState && typeof session.reviewState === 'object' ? session.reviewState : {}
    var dueCount = 0
    var lapseCount = 0
    var total = Array.isArray(deck && deck.cards) ? deck.cards.length : 0
    for (var index = 0; index < total; index += 1) {
      var key = deck.id + '::' + index
      var record = reviewState[key] || {}
      if (!record.dueAt || record.dueAt <= now.getTime()) dueCount += 1
      lapseCount += Number(record.lapses || 0)
    }
    return {
      dueCount: dueCount,
      lapseCount: lapseCount,
      totalCards: total
    }
  }

  function buildDeckInsights(now) {
    var decks = getDecks()
    var session = getSession()
    var events = getEvents().filter(function (event) { return event && event.date })
    return decks.map(function (deck) {
      var review = getDeckReviewSummary(deck, session, now)
      var linkedEvents = events
        .filter(function (event) { return matchDeckForEvent(event, [deck]) })
        .sort(function (a, b) {
          var aDays = daysUntil(a.date, now)
          var bDays = daysUntil(b.date, now)
          if (aDays !== bDays) return aDays - bDays
          return eventUrgency(b, now) - eventUrgency(a, now)
        })
      var nextEvent = linkedEvents[0] || null
      var nextDays = nextEvent ? daysUntil(nextEvent.date, now) : Infinity
      var riskScore = review.dueCount + (review.lapseCount * 2) + (nextEvent ? eventUrgency(nextEvent, now) * 2 : 0)
      return {
        deck: deck,
        review: review,
        nextEvent: nextEvent,
        daysUntil: nextDays,
        riskScore: riskScore,
        recommendedProfile: recommendedProfile(nextDays),
        recommendedProfileLabel: profileLabel(recommendedProfile(nextDays))
      }
    }).sort(function (a, b) { return b.riskScore - a.riskScore })
  }

  function buildDashboardModel(nowLike) {
    var now = nowLike ? new Date(nowLike) : new Date()
    var events = getEvents()
    var deckInsights = buildDeckInsights(now)
    var todayKey = now.toISOString().slice(0, 10)
    var dueToday = deckInsights
      .filter(function (item) { return item.review.dueCount > 0 })
      .slice(0, 3)
    var todayEvents = events
      .filter(function (event) { return event.date === todayKey })
      .sort(function (a, b) { return String(a.start || '').localeCompare(String(b.start || '')) })
    var studyNext = deckInsights[0] || null
    var atRisk = []

    deckInsights.forEach(function (item) {
      if (item.nextEvent && item.daysUntil <= 3) {
        atRisk.push({
          kind: 'deck',
          title: item.nextEvent.title || item.deck.name,
          subject: item.deck.subject || item.nextEvent.subject || 'Study',
          detail: item.review.dueCount + ' cards due before ' + (item.nextEvent.type || 'deadline'),
          actionHref: 'anki/index.html',
          date: item.nextEvent.date,
          riskScore: item.riskScore
        })
      }
      if (!item.nextEvent && item.review.lapseCount >= 2) {
        atRisk.push({
          kind: 'deck',
          title: item.deck.name,
          subject: item.deck.subject || 'Study',
          detail: item.review.lapseCount + ' repeated lapses need review',
          actionHref: 'anki/index.html',
          date: '',
          riskScore: item.riskScore
        })
      }
    })

    events.forEach(function (event) {
      if ((event.type === 'test' || event.type === 'quiz' || event.type === 'assignment') && daysUntil(event.date, now) <= 3) {
        var linkedDeck = matchDeckForEvent(event, getDecks())
        if (!linkedDeck) {
          atRisk.push({
            kind: 'event',
            title: event.title,
            subject: event.subject || 'Schedule',
            detail: 'No linked flashcard deck yet',
            actionHref: 'schedule.html',
            date: event.date,
            riskScore: eventUrgency(event, now) * 2
          })
        }
      }
    })

    atRisk.sort(function (a, b) { return b.riskScore - a.riskScore })

    return {
      now: now,
      todayKey: todayKey,
      events: events,
      deckInsights: deckInsights,
      dueToday: dueToday,
      todayEvents: todayEvents,
      studyNext: studyNext,
      atRisk: atRisk.slice(0, 3)
    }
  }

  global.StudyIntelligence = {
    keys: {
      schedule: SCHEDULE_KEY,
      decks: DECKS_KEY,
      session: SESSION_KEY
    },
    scopedKey: scopedKey,
    readJson: readJson,
    writeJson: writeJson,
    getEvents: getEvents,
    getDecks: getDecks,
    getSession: getSession,
    daysUntil: daysUntil,
    profileLabel: profileLabel,
    recommendedProfile: recommendedProfile,
    matchDeckForEvent: matchDeckForEvent,
    buildDeckInsights: buildDeckInsights,
    buildDashboardModel: buildDashboardModel
  }
})(window)
