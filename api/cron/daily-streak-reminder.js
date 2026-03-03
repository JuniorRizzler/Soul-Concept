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
    baseUrl + '/rest/v1/push_subscriptions?select=endpoint,subscription&active=is.true&limit=1000'
  const payload = JSON.stringify({
    title: 'Keep Your Streak',
    body: 'Do a quick study session today to extend your streak.',
    url: '/work.html',
  })

  let rows = []
  try {
    const response = await fetch(listUrl, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
      },
    })
    if (!response.ok) {
      const text = await response.text()
      json(res, 500, { error: text || 'Failed to fetch subscriptions.' })
      return
    }
    rows = (await response.json()) || []
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'Failed to fetch subscriptions.' })
    return
  }

  let sent = 0
  let failed = 0
  const staleEndpoints = []

  for (const row of rows) {
    try {
      await webpush.sendNotification(row.subscription, payload)
      sent += 1
    } catch (err) {
      failed += 1
      const code = err && err.statusCode ? Number(err.statusCode) : 0
      if (code === 404 || code === 410) staleEndpoints.push(row.endpoint)
    }
  }

  if (staleEndpoints.length) {
    for (const endpoint of staleEndpoints) {
      const staleUrl =
        baseUrl + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(endpoint)
      try {
        await fetch(staleUrl, {
          method: 'PATCH',
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: 'Bearer ' + SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }),
        })
      } catch (_err) {}
    }
  }

  json(res, 200, {
    ok: true,
    total: rows.length,
    sent,
    failed,
    deactivated: staleEndpoints.length,
  })
}
