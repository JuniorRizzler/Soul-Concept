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

function shapeNaturalPacing(input) {
  var text = String(input || '').trim()
  if (!text) return ''

  // Add phrase pauses after sentence boundaries.
  text = text.replace(/([.!?])\s+/g, '$1\n')

  // Light pause before common contrast/conclusion connectors.
  text = text.replace(/\s+(however|therefore|so|but|because|for example|in short)\s+/gi, ', $1, ')

  // Keep speech payload bounded for stable latency/quality.
  if (text.length > 1800) text = text.slice(0, 1797) + '...'
  return text
}

function parseVoiceCandidates(source) {
  var candidates = []
  var primary = String(source.voice_id || process.env.ELEVENLABS_VOICE_ID || '').trim()
  if (primary) candidates.push(primary)

  var envList = String(process.env.ELEVENLABS_VOICE_IDS || '').trim()
  if (envList) {
    envList.split(',').forEach(function (id) {
      var v = String(id || '').trim()
      if (v) candidates.push(v)
    })
  }

  // High-quality fallback voices commonly available in ElevenLabs.
  candidates.push('21m00Tcm4TlvDq8ikWAM') // Rachel
  candidates.push('EXAVITQu4vr4xnSDxMaL') // Bella
  candidates.push('pNInz6obpgDQGcFmaJgB') // Adam

  var seen = {}
  return candidates.filter(function (id) {
    if (seen[id]) return false
    seen[id] = true
    return true
  })
}

async function tryKokoroTts(source, text) {
  const kokoroUrl = String(process.env.KOKORO_TTS_URL || '').trim()
  if (!kokoroUrl) return { ok: false, status: 0, error: '', buffer: null, contentType: '' }

  const endpoint = kokoroUrl.replace(/\/$/, '')
  const payload = {
    text: text,
    voice: String(source.kokoro_voice || process.env.KOKORO_VOICE || 'af_sarah').trim(),
    format: String(source.kokoro_format || process.env.KOKORO_FORMAT || 'mp3').trim(),
    speed: typeof source.kokoro_speed === 'number' ? source.kokoro_speed : Number(process.env.KOKORO_SPEED || 1.0),
  }

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'audio/mpeg, audio/wav, application/octet-stream',
  }

  const kokoroKey = String(process.env.KOKORO_API_KEY || '').trim()
  if (kokoroKey) headers.Authorization = 'Bearer ' + kokoroKey

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const raw = await res.text()
    return { ok: false, status: res.status, error: raw || 'Kokoro TTS upstream error.', buffer: null, contentType: '' }
  }

  const arr = await res.arrayBuffer()
  const contentType = String(res.headers.get('content-type') || '').trim() || 'audio/mpeg'
  return { ok: true, status: 200, error: '', buffer: Buffer.from(arr), contentType: contentType }
}

async function tryReplicateKokoro(source, text) {
  const token = String(process.env.REPLICATE_API_TOKEN || '').trim()
  if (!token) return { ok: false, status: 0, error: '', buffer: null, contentType: '' }

  const modelRef = String(
    source.replicate_model ||
      process.env.KOKORO_REPLICATE_MODEL ||
      'jaaari/kokoro-82m'
  ).trim()
  const voice = String(source.kokoro_voice || process.env.KOKORO_VOICE || 'af_sarah').trim()
  const speed = typeof source.kokoro_speed === 'number' ? source.kokoro_speed : Number(process.env.KOKORO_SPEED || 1.0)

  var body = {
    input: {
      text: text,
      voice: voice,
      speed: speed,
    },
  }
  if (modelRef.indexOf('/') !== -1 && modelRef.indexOf(':') === -1) body.model = modelRef
  else body.version = modelRef

  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Prefer: 'wait=40',
    },
    body: JSON.stringify(body),
  })

  const createRaw = await createRes.text()
  let createParsed = null
  try {
    createParsed = JSON.parse(createRaw)
  } catch (_err) {}

  if (!createRes.ok) {
    return { ok: false, status: createRes.status, error: createRaw || 'Replicate create prediction failed.', buffer: null, contentType: '' }
  }

  var output = createParsed && createParsed.output
  var url = ''
  if (typeof output === 'string') url = output
  else if (Array.isArray(output) && output[0] && typeof output[0] === 'string') url = output[0]
  if (!url && createParsed && createParsed.urls && createParsed.urls.get) {
    const pollRes = await fetch(String(createParsed.urls.get), {
      headers: { Authorization: 'Bearer ' + token },
    })
    const pollRaw = await pollRes.text()
    let pollParsed = null
    try { pollParsed = JSON.parse(pollRaw) } catch (_err) {}
    if (!pollRes.ok) {
      return { ok: false, status: pollRes.status, error: pollRaw || 'Replicate polling failed.', buffer: null, contentType: '' }
    }
    output = pollParsed && pollParsed.output
    if (typeof output === 'string') url = output
    else if (Array.isArray(output) && output[0] && typeof output[0] === 'string') url = output[0]
  }

  if (!url) {
    return { ok: false, status: 502, error: 'Replicate returned no audio output URL.', buffer: null, contentType: '' }
  }

  const fileRes = await fetch(url)
  if (!fileRes.ok) {
    const fileRaw = await fileRes.text()
    return { ok: false, status: fileRes.status, error: fileRaw || 'Replicate audio download failed.', buffer: null, contentType: '' }
  }
  const arr = await fileRes.arrayBuffer()
  const contentType = String(fileRes.headers.get('content-type') || '').trim() || 'audio/mpeg'
  return { ok: true, status: 200, error: '', buffer: Buffer.from(arr), contentType: contentType }
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
  const text = shapeNaturalPacing(cleanSpeechText(source.text || ''))
  if (!text) {
    json(res, 400, { error: 'Missing text.' })
    return
  }

  // Preferred path: self-hosted Kokoro endpoint (free/near-limitless if you run your own server).
  try {
    const kokoro = await tryKokoroTts(source, text)
    if (kokoro.ok && kokoro.buffer) {
      res.status(200)
      res.setHeader('Content-Type', kokoro.contentType || 'audio/mpeg')
      res.setHeader('Cache-Control', 'no-store')
      res.send(kokoro.buffer)
      return
    }
  } catch (_err) {
    // fall through to ElevenLabs path
  }

  // Secondary path: hosted Kokoro on Replicate (no self-hosted server required).
  try {
    const rep = await tryReplicateKokoro(source, text)
    if (rep.ok && rep.buffer) {
      res.status(200)
      res.setHeader('Content-Type', rep.contentType || 'audio/mpeg')
      res.setHeader('Cache-Control', 'no-store')
      res.send(rep.buffer)
      return
    }
  } catch (_err) {
    // fall through to ElevenLabs path
  }

  const apiKey = String(process.env.ELEVENLABS_API_KEY || '').trim()
  if (!apiKey) {
    json(res, 501, { error: 'Missing KOKORO_TTS_URL, REPLICATE_API_TOKEN, and ELEVENLABS_API_KEY env vars.' })
    return
  }

  const voiceCandidates = parseVoiceCandidates(source)
  const modelId = String(
    source.model_id ||
      process.env.ELEVENLABS_MODEL_ID ||
      'eleven_multilingual_v2'
  ).trim()

  try {
    var lastError = ''
    for (var i = 0; i < voiceCandidates.length; i++) {
      var voiceId = voiceCandidates[i]
      var endpoint = 'https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(voiceId)
      var upstream = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: text,
          model_id: modelId,
          output_format: String(process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_192'),
          voice_settings: {
            stability: typeof source.stability === 'number' ? source.stability : 0.22,
            similarity_boost: typeof source.similarity_boost === 'number' ? source.similarity_boost : 0.82,
            style: typeof source.style === 'number' ? source.style : 0.62,
            use_speaker_boost: true,
          },
        }),
      })

      if (!upstream.ok) {
        lastError = await upstream.text()
        continue
      }

      const arr = await upstream.arrayBuffer()
      const buffer = Buffer.from(arr)
      res.status(200)
      res.setHeader('Content-Type', 'audio/mpeg')
      res.setHeader('Cache-Control', 'no-store')
      res.send(buffer)
      return
    }
    json(res, 502, { error: lastError || 'TTS upstream error.' })
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'TTS request failed.' })
  }
}
