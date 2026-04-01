function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
}

function parsePreferences(input) {
  var value = input && typeof input === 'object' ? input : {}
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
  var sample = ((entry && entry.type) || '') + ' ' + ((entry && entry.title) || '') + ' ' + ((entry && entry.subject) || '')
  var value = String(sample || '').toLowerCase()
  if (value.indexOf('test') !== -1 || value.indexOf('midterm') !== -1 || value.indexOf('final') !== -1 || value.indexOf('exam') !== -1) return 'test'
  if (value.indexOf('quiz') !== -1) return 'quiz'
  if (value.indexOf('assignment') !== -1 || value.indexOf('essay') !== -1 || value.indexOf('proposal') !== -1 || value.indexOf('due') !== -1) return 'assignment'
  if (value.indexOf('meeting') !== -1 || value.indexOf('seminar') !== -1 || value.indexOf('review') !== -1) return 'meeting'
  return 'study'
}

function sanitizeEvent(entry) {
  var item = entry && typeof entry === 'object' ? entry : {}
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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    json(res, 405, { error: 'Method Not Allowed' })
    return
  }

  var SUPABASE_URL = process.env.SUPABASE_URL
  var SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    json(res, 500, { error: 'Missing Supabase server env vars.' })
    return
  }

  var body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(req.body || '{}')
    } catch (_err) {
      json(res, 400, { error: 'Invalid JSON.' })
      return
    }
  }

  var userId = String(body.userId || '').trim().slice(0, 120)
  var endpoint = String(body.endpoint || '').trim()
  if (!userId && !endpoint) {
    json(res, 400, { error: 'Missing user or subscription target.' })
    return
  }

  var timezone = String(body.timezone || '').trim().slice(0, 80) || 'America/New_York'
  var reminderPreferences = parsePreferences(body.reminderPreferences)
  var scheduleSnapshot = Array.isArray(body.scheduleSnapshot) ? body.scheduleSnapshot.slice(0, 200).map(sanitizeEvent) : []
  var baseUrl = String(SUPABASE_URL).replace(/\/$/, '')
  var query = endpoint ? '?endpoint=eq.' + encodeURIComponent(endpoint) : '?user_id=eq.' + encodeURIComponent(userId)
  var url = baseUrl + '/rest/v1/push_subscriptions' + query
  var payload = {
    user_id: userId || null,
    timezone: timezone,
    reminder_preferences: reminderPreferences,
    schedule_snapshot: scheduleSnapshot,
    schedule_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  try {
    var response = await fetch(url, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      var text = await response.text()
      json(res, 500, { error: text || 'Failed to sync schedule reminders.' })
      return
    }

    var rows = await response.json().catch(function () { return [] })
    json(res, 200, {
      ok: true,
      updatedCount: Array.isArray(rows) ? rows.length : 0,
    })
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'Server error.' })
  }
}
