const webpush = require('web-push')

function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
}

function isUnauthorized(req) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = String(req.headers.authorization || '')
  return auth !== 'Bearer ' + secret
}

function parsePreferences(input) {
  const value = input && typeof input === 'object' ? input : {}
  return {
    enabled: value.enabled !== false,
    studyEnabled: value.studyEnabled !== false,
    studyLeadMinutes: Math.max(1, parseInt(value.studyLeadMinutes, 10) || 15),
    testEnabled: value.testEnabled !== false,
    testLeadMinutes: Math.max(1, parseInt(value.testLeadMinutes, 10) || 60),
    testDayBefore: value.testDayBefore !== false,
    dailyAgenda: value.dailyAgenda !== false,
    dailyAgendaTime: String(value.dailyAgendaTime || '07:00').slice(0, 5) || '07:00',
  }
}

function inferType(entry) {
  const sample = ((entry && entry.type) || '') + ' ' + ((entry && entry.title) || '') + ' ' + ((entry && entry.subject) || '')
  const value = String(sample || '').toLowerCase()
  if (value.indexOf('test') !== -1 || value.indexOf('midterm') !== -1 || value.indexOf('final') !== -1 || value.indexOf('exam') !== -1) return 'test'
  if (value.indexOf('quiz') !== -1) return 'quiz'
  if (value.indexOf('assignment') !== -1 || value.indexOf('essay') !== -1 || value.indexOf('proposal') !== -1 || value.indexOf('due') !== -1) return 'assignment'
  if (value.indexOf('meeting') !== -1 || value.indexOf('seminar') !== -1 || value.indexOf('review') !== -1) return 'meeting'
  return 'study'
}

function sanitizeEvent(entry) {
  const item = entry && typeof entry === 'object' ? entry : {}
  return {
    id: String(item.id || '').slice(0, 120),
    title: String(item.title || '').slice(0, 160),
    subject: String(item.subject || '').slice(0, 120),
    type: String(item.type || inferType(item)).slice(0, 40),
    date: String(item.date || '').slice(0, 10),
    start: String(item.start || '').slice(0, 5),
    end: String(item.end || '').slice(0, 5),
    location: String(item.location || '').slice(0, 160),
    priority: String(item.priority || 'Medium').slice(0, 20),
    notificationsEnabled: item.notificationsEnabled !== false,
  }
}

function parseZonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(date)
  const values = {}
  parts.forEach((part) => {
    if (part.type !== 'literal') values[part.type] = part.value
  })
  return {
    year: parseInt(values.year, 10),
    month: parseInt(values.month, 10),
    day: parseInt(values.day, 10),
    hour: parseInt(values.hour, 10),
    minute: parseInt(values.minute, 10),
  }
}

function localMs(parts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour || 0, parts.minute || 0, 0, 0)
}

function parseDateKey(dateKey) {
  const bits = String(dateKey || '').split('-')
  return {
    year: parseInt(bits[0], 10) || 1970,
    month: parseInt(bits[1], 10) || 1,
    day: parseInt(bits[2], 10) || 1,
  }
}

function parseTimeValue(value) {
  const bits = String(value || '00:00').split(':')
  return {
    hour: parseInt(bits[0], 10) || 0,
    minute: parseInt(bits[1], 10) || 0,
  }
}

function formatDateKeyUtcParts(parts) {
  return (
    parts.getUTCFullYear() +
    '-' +
    String(parts.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(parts.getUTCDate()).padStart(2, '0')
  )
}

function offsetDateKey(dateKey, days) {
  const date = parseDateKey(dateKey)
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day + days, 12, 0, 0, 0))
  return formatDateKeyUtcParts(utc)
}

function prettyTime(value) {
  const parts = parseTimeValue(value)
  const suffix = parts.hour >= 12 ? 'PM' : 'AM'
  const displayHour = parts.hour % 12 || 12
  return displayHour + ':' + String(parts.minute).padStart(2, '0') + ' ' + suffix
}

function prettyDate(dateKey, timeZone) {
  const date = parseDateKey(dateKey)
  const utc = new Date(Date.UTC(date.year, date.month - 1, date.day, 12, 0, 0, 0))
  return utc.toLocaleDateString('en-US', { timeZone, month: 'short', day: 'numeric' })
}

function buildReminderCandidates(row, now, windowMs) {
  const timeZone = String(row.timezone || 'America/New_York').trim() || 'America/New_York'
  const nowParts = parseZonedParts(now, timeZone)
  const nowMs = localMs(nowParts)
  const prefs = parsePreferences(row.reminder_preferences)
  if (!prefs.enabled) return []
  const schedule = Array.isArray(row.schedule_snapshot) ? row.schedule_snapshot.map(sanitizeEvent) : []
  const todayKey = (
    nowParts.year +
    '-' +
    String(nowParts.month).padStart(2, '0') +
    '-' +
    String(nowParts.day).padStart(2, '0')
  )
  const results = []

  schedule.forEach((entry) => {
    if (!entry.id || !entry.date || !entry.start || entry.notificationsEnabled === false) return
    const date = parseDateKey(entry.date)
    const time = parseTimeValue(entry.start)
    const eventMs = Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute, 0, 0)
    const type = inferType(entry)
    const titleBase = entry.title || entry.subject || 'Scheduled item'

    function pushCandidate(triggerMs, kind, title, body, url) {
      if (triggerMs > nowMs || nowMs - triggerMs > windowMs) return
      results.push({
        deliveryKey: [row.endpoint, kind, entry.id || todayKey, triggerMs].join('::'),
        endpoint: row.endpoint,
        userId: row.user_id || null,
        kind,
        sendAt: new Date(triggerMs).toISOString(),
        title,
        payload: {
          title,
          body,
          url: url || '/schedule.html',
          type: 'reminder',
          tag: 'sc-' + kind,
          requireInteraction: kind !== 'daily-agenda',
          actions: [
            { action: 'open', title: 'Open' },
            { action: 'dismiss', title: 'Dismiss' },
          ],
        },
      })
    }

    if (type === 'study' && prefs.studyEnabled) {
      const triggerMs = eventMs - (prefs.studyLeadMinutes * 60000)
      pushCandidate(
        triggerMs,
        'study-reminder',
        'Study block in ' + prefs.studyLeadMinutes + ' min',
        titleBase + ' starts at ' + prettyTime(entry.start) + '.',
        '/schedule.html'
      )
    }

    if ((type === 'test' || type === 'quiz' || type === 'assignment') && prefs.testEnabled) {
      const triggerMs = eventMs - (prefs.testLeadMinutes * 60000)
      pushCandidate(
        triggerMs,
        'test-reminder',
        eventTypeLabel(type) + ' coming up',
        titleBase + ' starts at ' + prettyTime(entry.start) + ' on ' + prettyDate(entry.date, timeZone) + '.',
        '/schedule.html'
      )

      if (prefs.testDayBefore) {
        const dayBefore = offsetDateKey(entry.date, -1)
        const evening = parseTimeValue('19:00')
        const dayBeforeDate = parseDateKey(dayBefore)
        const dayBeforeMs = Date.UTC(dayBeforeDate.year, dayBeforeDate.month - 1, dayBeforeDate.day, evening.hour, evening.minute, 0, 0)
        pushCandidate(
          dayBeforeMs,
          'test-day-before',
          eventTypeLabel(type) + ' tomorrow',
          titleBase + ' is scheduled for ' + prettyDate(entry.date, timeZone) + ' at ' + prettyTime(entry.start) + '.',
          '/schedule.html'
        )
      }
    }
  })

  if (prefs.dailyAgenda) {
    const todaysEvents = schedule
      .filter((entry) => entry.date === todayKey)
      .sort((a, b) => String(a.start || '').localeCompare(String(b.start || '')))
    if (todaysEvents.length) {
      const agendaTime = parseTimeValue(prefs.dailyAgendaTime)
      const agendaMs = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day, agendaTime.hour, agendaTime.minute, 0, 0)
      if (agendaMs <= nowMs && nowMs - agendaMs <= windowMs) {
        const first = todaysEvents[0]
        results.push({
          deliveryKey: [row.endpoint, 'daily-agenda', todayKey, agendaMs].join('::'),
          endpoint: row.endpoint,
          userId: row.user_id || null,
          kind: 'daily-agenda',
          sendAt: new Date(agendaMs).toISOString(),
          title: 'Today\'s study plan',
          payload: {
            title: 'Today\'s study plan',
            body: todaysEvents.length + ' item' + (todaysEvents.length === 1 ? '' : 's') + ' today. First up: ' + (first.title || first.subject || 'Study') + ' at ' + prettyTime(first.start) + '.',
            url: '/schedule.html',
            type: 'reminder',
            tag: 'sc-daily-agenda',
            requireInteraction: false,
            actions: [
              { action: 'open', title: 'Open' },
              { action: 'dismiss', title: 'Dismiss' },
            ],
          },
        })
      }
    }
  }

  return results
}

function eventTypeLabel(type) {
  if (type === 'test') return 'Test'
  if (type === 'quiz') return 'Quiz'
  if (type === 'assignment') return 'Assignment'
  if (type === 'meeting') return 'Meeting'
  if (type === 'other') return 'Reminder'
  return 'Study'
}

async function fetchJson(url, serviceKey) {
  const response = await fetch(url, {
    headers: {
      apikey: serviceKey,
      Authorization: 'Bearer ' + serviceKey,
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

async function claimDelivery(baseUrl, serviceKey, candidate) {
  const response = await fetch(baseUrl + '/rest/v1/reminder_deliveries', {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: 'Bearer ' + serviceKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({
      delivery_key: candidate.deliveryKey,
      endpoint: candidate.endpoint,
      user_id: candidate.userId,
      kind: candidate.kind,
      send_at: candidate.sendAt,
      status: 'pending',
      title: candidate.title,
    }),
  })
  if (!response.ok) throw new Error(await response.text())
  const rows = await response.json().catch(() => [])
  return Array.isArray(rows) && rows.length > 0
}

async function markDelivery(baseUrl, serviceKey, candidate, status) {
  await fetch(baseUrl + '/rest/v1/reminder_deliveries?delivery_key=eq.' + encodeURIComponent(candidate.deliveryKey), {
    method: 'PATCH',
    headers: {
      apikey: serviceKey,
      Authorization: 'Bearer ' + serviceKey,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      status,
      delivered_at: status === 'sent' ? new Date().toISOString() : null,
    }),
  }).catch(() => {})
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    json(res, 405, { error: 'Method Not Allowed' })
    return
  }

  if (isUnauthorized(req)) {
    json(res, 401, { error: 'Unauthorized' })
    return
  }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
  const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
  const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com'
  const LOOKBACK_MINUTES = Math.max(2, parseInt(process.env.SCHEDULE_REMINDER_LOOKBACK_MINUTES || '6', 10) || 6)

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    json(res, 500, { error: 'Missing Supabase server env vars.' })
    return
  }
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    json(res, 500, { error: 'Missing VAPID keys.' })
    return
  }

  const subject = String(VAPID_SUBJECT || '').trim()
  if (!/^mailto:.+@.+\..+/i.test(subject) && !/^https?:\/\//i.test(subject)) {
    json(res, 500, { error: 'Invalid VAPID_SUBJECT format.' })
    return
  }

  try {
    webpush.setVapidDetails(subject, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'Invalid VAPID configuration.' })
    return
  }

  const baseUrl = String(SUPABASE_URL).replace(/\/$/, '')
  const listUrl =
    baseUrl +
    '/rest/v1/push_subscriptions?select=endpoint,subscription,user_id,timezone,reminder_preferences,schedule_snapshot&active=is.true&limit=1000'

  let rows = []
  try {
    rows = (await fetchJson(listUrl, SUPABASE_SERVICE_ROLE_KEY)) || []
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'Failed to fetch subscriptions.' })
    return
  }

  const now = new Date()
  const windowMs = LOOKBACK_MINUTES * 60 * 1000
  const staleEndpoints = []
  let sent = 0
  let failed = 0
  let skipped = 0

  for (const row of rows) {
    const candidates = buildReminderCandidates(row, now, windowMs)
    for (const candidate of candidates) {
      let claimed = false
      try {
        claimed = await claimDelivery(baseUrl, SUPABASE_SERVICE_ROLE_KEY, candidate)
      } catch (_err) {
        failed += 1
        continue
      }
      if (!claimed) {
        skipped += 1
        continue
      }

      try {
        await webpush.sendNotification(row.subscription, JSON.stringify(candidate.payload))
        sent += 1
        await markDelivery(baseUrl, SUPABASE_SERVICE_ROLE_KEY, candidate, 'sent')
      } catch (err) {
        failed += 1
        await markDelivery(baseUrl, SUPABASE_SERVICE_ROLE_KEY, candidate, 'failed')
        const code = err && err.statusCode ? Number(err.statusCode) : 0
        if (code === 404 || code === 410) staleEndpoints.push(row.endpoint)
      }
    }
  }

  if (staleEndpoints.length) {
    for (const endpoint of staleEndpoints) {
      const staleUrl = baseUrl + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(endpoint)
      await fetch(staleUrl, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
      }).catch(() => {})
    }
  }

  json(res, 200, {
    ok: true,
    totalSubscriptions: rows.length,
    sent,
    failed,
    skipped,
    deactivated: staleEndpoints.length,
    lookbackMinutes: LOOKBACK_MINUTES,
  })
}
