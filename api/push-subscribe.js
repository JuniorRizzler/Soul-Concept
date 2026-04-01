function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
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

function sanitizeEvent(entry) {
  const item = entry && typeof entry === 'object' ? entry : {}
  return {
    id: String(item.id || '').slice(0, 120),
    title: String(item.title || '').slice(0, 160),
    subject: String(item.subject || '').slice(0, 120),
    type: String(item.type || 'study').slice(0, 40),
    date: String(item.date || '').slice(0, 10),
    start: String(item.start || '').slice(0, 5),
    end: String(item.end || '').slice(0, 5),
    location: String(item.location || '').slice(0, 160),
    priority: String(item.priority || 'Medium').slice(0, 20),
    notificationsEnabled: item.notificationsEnabled !== false,
  }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method Not Allowed' })
    return
  }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    json(res, 500, { error: 'Missing Supabase server env vars.' })
    return
  }

  let body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(req.body || '{}')
    } catch (_err) {
      json(res, 400, { error: 'Invalid JSON.' })
      return
    }
  }

  const subscription = body.subscription
  const userAgent = String(body.userAgent || '').slice(0, 400)
  const userId = String(body.userId || '').trim().slice(0, 120) || null
  const timezone = String(body.timezone || '').trim().slice(0, 80) || null
  const hasReminderPreferences = body.reminderPreferences && typeof body.reminderPreferences === 'object'
  const hasScheduleSnapshot = Array.isArray(body.scheduleSnapshot)
  const reminderPreferences = hasReminderPreferences ? parsePreferences(body.reminderPreferences) : null
  const scheduleSnapshot = hasScheduleSnapshot ? body.scheduleSnapshot.slice(0, 200).map(sanitizeEvent) : null
  const endpoint = subscription && subscription.endpoint ? String(subscription.endpoint) : ''
  if (!endpoint) {
    json(res, 400, { error: 'Missing push subscription endpoint.' })
    return
  }

  const row = {
    endpoint,
    subscription,
    user_id: userId,
    user_agent: userAgent,
    timezone: timezone,
    active: true,
    updated_at: new Date().toISOString(),
  }
  if (reminderPreferences) row.reminder_preferences = reminderPreferences
  if (scheduleSnapshot) {
    row.schedule_snapshot = scheduleSnapshot
    row.schedule_updated_at = new Date().toISOString()
  }

  const url =
    String(SUPABASE_URL).replace(/\/$/, '') +
    '/rest/v1/push_subscriptions?on_conflict=endpoint'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    })

    if (!response.ok) {
      const text = await response.text()
      json(res, 500, { error: text || 'Failed to save subscription.' })
      return
    }

    json(res, 200, { ok: true })
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'Server error.' })
  }
}
