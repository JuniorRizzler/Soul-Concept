function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
}

module.exports = async (_req, res) => {
  const vapidPublicKey = String(process.env.VAPID_PUBLIC_KEY || '').trim()

  if (!vapidPublicKey) {
    json(res, 200, {
      configured: false,
      vapidPublicKey: '',
    })
    return
  }

  json(res, 200, {
    configured: true,
    vapidPublicKey,
  })
}
