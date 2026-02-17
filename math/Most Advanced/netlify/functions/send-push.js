const webpush = require('web-push')

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return { statusCode: 500, body: 'Missing VAPID keys on server.' }
  }

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON.' }
  }

  const subscription = body.subscription
  const payload = body.payload || {}

  if (!subscription) {
    return { statusCode: 400, body: 'Missing subscription.' }
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    return { statusCode: 200, body: 'OK' }
  } catch (err) {
    return { statusCode: 500, body: err.message || 'Push failed.' }
  }
}
