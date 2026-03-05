const webpush = require('web-push')

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
  const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
  const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com'

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    res.status(500).send('Missing VAPID keys on server.')
    return
  }

  const subject = String(VAPID_SUBJECT || '').trim()
  if (!/^mailto:.+@.+\..+/i.test(subject) && !/^https?:\/\//i.test(subject)) {
    res.status(500).send('Invalid VAPID_SUBJECT. Use mailto:you@example.com or https://your-site.')
    return
  }

  try {
    webpush.setVapidDetails(subject, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
  } catch (err) {
    res.status(500).send(err.message || 'Invalid VAPID configuration.')
    return
  }

  let body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(req.body || '{}')
    } catch (err) {
      res.status(400).send('Invalid JSON.')
      return
    }
  }

  const subscription = body.subscription
  const inputPayload = body.payload || {}

  if (!subscription) {
    res.status(400).send('Missing subscription.')
    return
  }

  const payload = {
    title: String(inputPayload.title || 'Soul Concept'),
    body: String(inputPayload.body || 'You have a new update.'),
    url: String(inputPayload.url || '/'),
    type: String(inputPayload.type || 'general'),
    tag: String(inputPayload.tag || ''),
    requireInteraction: !!inputPayload.requireInteraction,
    actions: Array.isArray(inputPayload.actions) ? inputPayload.actions.slice(0, 2) : undefined,
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).send(err.message || 'Push failed.')
  }
}
