function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
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

const SOUL_CONCEPT_SYSTEM_CONTEXT =
  'You are LYNE, Soul Concept\'s voice-first study copilot. Be accurate, warm, and conversational. ' +
  'Use simple wording suitable for Grade 9-10. ' +
  'Answer the latest question directly first, then give short clear steps and one example when useful. ' +
  'Do not use canned repeated lines.'

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
  const system = typeof source.system === 'string' ? source.system.trim() : ''
  const prompt = typeof source.prompt === 'string' ? source.prompt.trim() : ''
  const incomingMessages = Array.isArray(source.messages) ? source.messages : []

  const model = String(source.model || process.env.OPENAI_MODEL || 'gpt-4o-mini').trim()
  const maxTokens = Number(source.max_tokens || source.maxTokens || 500)
  const temperature = typeof source.temperature === 'number' ? source.temperature : 0.6

  const apiKey = String(process.env.OPENAI_API_KEY || '').trim()
  if (!apiKey) {
    json(res, 500, { error: 'Missing OPENAI_API_KEY in deployment environment.' })
    return
  }

  const baseUrl = String(process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').trim().replace(/\/$/, '')
  const endpoint = baseUrl + '/chat/completions'

  const messages = [{ role: 'system', content: SOUL_CONCEPT_SYSTEM_CONTEXT }]
  if (system) messages.push({ role: 'system', content: system })

  for (let i = 0; i < incomingMessages.length; i++) {
    const m = incomingMessages[i]
    const role = m && typeof m.role === 'string' ? m.role : 'user'
    const content = normalizeMessageContent(m ? m.content : '')
    if (!content) continue
    messages.push({ role: role, content: content })
  }

  if (prompt) messages.push({ role: 'user', content: prompt })

  if (!messages.some(function (m) { return m.role === 'user' })) {
    json(res, 400, { error: 'No user message provided.' })
    return
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: Number.isFinite(maxTokens) ? maxTokens : 500,
        temperature: temperature,
      }),
    })

    const raw = await upstream.text()
    let parsed = null
    try {
      parsed = JSON.parse(raw)
    } catch (_err) {}

    if (!upstream.ok) {
      const errorText =
        (parsed && parsed.error && (parsed.error.message || parsed.error.code)) ||
        raw ||
        'OpenAI request failed.'
      json(res, upstream.status || 502, { error: String(errorText) })
      return
    }

    const text =
      parsed && parsed.choices && parsed.choices[0] && parsed.choices[0].message
        ? normalizeMessageContent(parsed.choices[0].message.content || '')
        : ''

    if (!text) {
      json(res, 502, { error: 'OpenAI returned empty text.' })
      return
    }

    json(res, 200, {
      ok: true,
      text: text,
      provider: 'openai',
      model: model,
    })
  } catch (err) {
    json(res, 502, {
      error: err && err.message ? err.message : 'OpenAI request failed.',
    })
  }
}