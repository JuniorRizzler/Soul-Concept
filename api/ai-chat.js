function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
}

function cleanBaseUrl(value, fallback) {
  const raw = String(value || '').trim()
  if (!raw) return fallback
  return raw.replace(/\/$/, '')
}

function normalizeMessageContent(content) {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map(function (part) {
        if (!part) return ''
        if (typeof part === 'string') return part
        if (typeof part.text === 'string') return part.text
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }
  if (content && typeof content.text === 'string') return content.text
  return ''
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
  const system = typeof source.system === 'string' ? source.system : ''
  const prompt = typeof source.prompt === 'string' ? source.prompt : ''
  const incomingMessages = Array.isArray(source.messages) ? source.messages : []

  const messages = []
  if (system.trim()) messages.push({ role: 'system', content: system.trim() })
  for (const msg of incomingMessages) {
    const role = msg && typeof msg.role === 'string' ? msg.role : 'user'
    const content = normalizeMessageContent(msg ? msg.content : '')
    if (!content) continue
    messages.push({ role, content })
  }
  if (!messages.length && prompt.trim()) {
    messages.push({ role: 'user', content: prompt.trim() })
  }
  if (!messages.length) {
    json(res, 400, { error: 'No messages provided.' })
    return
  }

  // Preferred path: self-hosted Free-GPT4-WEB-API.
  // Expected format: GET {FREE_GPT4_WEB_API_URL}/?text=...
  const freeGptWebApiUrl = String(process.env.FREE_GPT4_WEB_API_URL || '').trim()
  if (freeGptWebApiUrl) {
    const keyword = String(process.env.FREE_GPT4_WEB_API_KEYWORD || 'text')
    const mergedPrompt = messages
      .map(function (m) {
        return String(m.role || 'user') + ': ' + String(m.content || '')
      })
      .join('\n')
      .trim()
    const base = freeGptWebApiUrl.replace(/\/$/, '')
    const target = new URL(base + '/')
    target.searchParams.set(keyword, mergedPrompt)

    try {
      const upstreamRes = await fetch(target.toString(), { method: 'GET' })
      const rawText = await upstreamRes.text()
      if (!upstreamRes.ok) {
        json(res, upstreamRes.status, { error: rawText || 'Self-hosted AI upstream error.' })
        return
      }
      json(res, 200, {
        ok: true,
        text: String(rawText || '').trim(),
        provider: 'free-gpt4-web-api',
      })
      return
    } catch (err) {
      json(res, 500, { error: err && err.message ? err.message : 'Self-hosted AI request failed.' })
      return
    }
  }

  // Fallback path: OpenAI-compatible chat endpoint (PersonaPlex supported).
  const apiKey =
    process.env.PERSONAPLEX_API_KEY ||
    process.env.HUGGINGFACE_API_KEY ||
    process.env.FREE_LLM_API_KEY
  if (!apiKey) {
    json(res, 500, {
      error:
        'Missing AI key. Set PERSONAPLEX_API_KEY (or HUGGINGFACE_API_KEY / FREE_LLM_API_KEY).',
    })
    return
  }

  const forcedPersonaModel = String(process.env.PERSONAPLEX_MODEL || '').trim()
  const model = String(
    forcedPersonaModel ||
      source.model ||
      process.env.FREE_LLM_MODEL ||
      'nvidia/personaplex-7b-v1'
  )
  const baseUrl = cleanBaseUrl(
    process.env.PERSONAPLEX_BASE_URL || process.env.FREE_LLM_BASE_URL,
    'https://router.huggingface.co/v1'
  )
  const chatUrl = process.env.PERSONAPLEX_CHAT_URL || process.env.FREE_LLM_CHAT_URL || baseUrl + '/chat/completions'
  const maxTokens = Number(source.max_tokens || source.maxTokens || process.env.FREE_LLM_MAX_TOKENS || 1200)
  const temperature = typeof source.temperature === 'number' ? source.temperature : 0.4

  try {
    const upstreamRes = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: Number.isFinite(maxTokens) ? maxTokens : 1200,
        temperature,
      }),
    })

    const rawText = await upstreamRes.text()
    let parsed = null
    try {
      parsed = JSON.parse(rawText)
    } catch (_err) {}

    if (!upstreamRes.ok) {
      json(res, upstreamRes.status, {
        error:
          (parsed && (parsed.error && parsed.error.message ? parsed.error.message : parsed.error)) ||
          rawText ||
          'AI upstream error.',
      })
      return
    }

    let text = ''
    if (parsed && Array.isArray(parsed.choices) && parsed.choices[0] && parsed.choices[0].message) {
      text = normalizeMessageContent(parsed.choices[0].message.content || '')
    } else if (parsed && Array.isArray(parsed.content)) {
      text = normalizeMessageContent(parsed.content)
    } else if (parsed && typeof parsed.output_text === 'string') {
      text = parsed.output_text
    } else if (typeof rawText === 'string') {
      text = rawText
    }

    json(res, 200, {
      ok: true,
      text: text || '',
      provider: 'openai-compatible',
      model,
      providerResponse: parsed || null,
    })
  } catch (err) {
    json(res, 500, { error: err && err.message ? err.message : 'AI request failed.' })
  }
}
