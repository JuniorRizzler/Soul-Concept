const webpush = require('web-push')

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    res.status(500).send('Missing VAPID keys on server.')
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
  const payload = body.payload || {}

  if (!subscription) {
    res.status(400).send('Missing subscription.')
    return
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    res.status(200).send('OK')
  } catch (err) {
    res.status(500).send(err.message || 'Push failed.')
  }
}
