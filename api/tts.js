function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
}

function cleanSpeechText(input) {
  return String(input || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
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

  let body = req.body
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(req.body || '{}')
    } catch (_err) {
      json(res, 400, { error: 'Invalid JSON body.' })
      return
    }
  }

  const source = body.request && typeof body.request === 'object' ? body.request : body
  const text = cleanSpeechText(source.text || '')
  if (!text) {
    json(res, 400, { error: 'Missing text.' })
    return
  }

  const apiKey = String(process.env.ELEVENLABS_API_KEY || '').trim()
  if (!apiKey) {
    json(res, 501, { error: 'Missing ELEVENLABS_API_KEY env var.' })
    return
  }

  const voiceId = String(
    source.voice_id ||
      process.env.ELEVENLABS_VOICE_ID ||
      '21m00Tcm4TlvDq8ikWAM'
  ).trim()
  const modelId = String(
    source.model_id ||
      process.env.ELEVENLABS_MODEL_ID ||
      'eleven_multilingual_v2'
  ).trim()

  const endpoint = 'https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(voiceId)

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        model_id: modelId,
        output_format: String(process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128'),
        voice_settings: {
          stability: typeof source.stability === 'number' ? source.stability : 0.35,
          similarity_boost: typeof source.similarity_boost === 'number' ? source.similarity_boost : 0.9,
          style: typeof source.style === 'number' ? source.style : 0.35,
          use_speaker_boost: true,
        },
      }),
    })

    if (!upstream.ok) {
      const raw = await upstream.text()
      json(res, upstream.status, { error: raw || 'TTS upstream error.' })
      return
    }

    const arr = await upstream.arrayBuffer()
    const buffer = Buffer.from(arr)
    res.status(200)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-store')
    res.send(buffer)
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'TTS request failed.' })
  }
}
