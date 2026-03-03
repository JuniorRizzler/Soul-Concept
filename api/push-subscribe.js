function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
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
  const endpoint = subscription && subscription.endpoint ? String(subscription.endpoint) : ''
  if (!endpoint) {
    json(res, 400, { error: 'Missing push subscription endpoint.' })
    return
  }

  const row = {
    endpoint,
    subscription,
    user_agent: userAgent,
    active: true,
    updated_at: new Date().toISOString(),
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
