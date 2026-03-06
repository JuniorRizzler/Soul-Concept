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

  const apiKey = String(process.env.ELEVENLABS_API_KEY || '').trim()
  if (!apiKey) {
    json(res, 501, { error: 'Missing ELEVENLABS_API_KEY env var.' })
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
