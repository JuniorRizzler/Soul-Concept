function json(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json').send(JSON.stringify(payload))
}

function cleanBaseUrl(value, fallback) {
  const raw = String(value || '').trim()
  if (!raw) return fallback
  return raw.replace(/\/$/, '')
}

const WORKING_HOSTED_MODEL = 'Qwen/Qwen2.5-7B-Instruct'
const DEFAULT_DEEPSEEK_MODEL = 'deepseek-chat'
const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'

function normalizeDeepSeekModelName(input) {
  const raw = String(input || '').trim().toLowerCase()
  if (!raw) return DEFAULT_DEEPSEEK_MODEL
  if (raw === 'deepseek-chat' || raw === 'deepseek-reasoner') return raw
  if (
    raw === 'deepseek-v3.2' ||
    raw === 'deepseek-v3' ||
    raw === 'deepseek-v3-2' ||
    raw.indexOf('deepseek-v3') !== -1
  ) {
    return 'deepseek-chat'
  }
  if (raw.indexOf('reason') !== -1 || raw.indexOf('r1') !== -1) {
    return 'deepseek-reasoner'
  }
  return DEFAULT_DEEPSEEK_MODEL
}
const SOUL_CONCEPT_SYSTEM_CONTEXT =
  'You are LYNE, Soul Concept\'s voice-first study copilot. Be accurate, warm, energetic, and conversational. ' +
  'Core purpose: help students study faster with structured libraries and tools instead of random browsing. ' +
  'App map: Home=index.html, Science Library=study-library.html, Geography Library=geography-library.html, ' +
  'Math 9 Library=math/index.html, Math 10 Library=grade-10-math.html, Pre-AP Grade 10 Preview=preap-grade-10-preview.html, ' +
  'Concept Cards=anki/index.html, Quiz Tool=math-quiz-simulator.html. ' +
  'You should give exact navigation directions using these page names and file routes when asked where to go. ' +
  'When explaining material, use step-by-step clarity with vivid mini-examples and avoid robotic phrasing. ' +
  'Keep replies compact but human-sounding, vary sentence rhythm, and include encouragement without fluff. ' +
  'Do not repeat stock lines across turns; respond directly to the latest user question in natural conversational English. ' +
  'Use simple wording suitable for a Grade 9-10 student. Prefer short sentences. Avoid jargon unless you define it quickly. ' +
  'Default structure: quick answer, 2-4 clear steps, one tiny example. ' +
  'Only give navigation directions when the user asks where to go; otherwise answer the academic question directly. ' +
  'If context is missing, ask one short clarifying question instead of guessing.'

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

function messagesToPrompt(messages) {
  return (Array.isArray(messages) ? messages : [])
    .map(function (m) {
      var role = String((m && m.role) || 'user').trim() || 'user'
      var content = normalizeMessageContent(m ? m.content : '')
      if (!content) return ''
      return role + ': ' + content
    })
    .filter(Boolean)
    .join('\n\n')
    .trim()
}

function latestUserMessage(messages, prompt) {
  const arr = Array.isArray(messages) ? messages : []
  for (let i = arr.length - 1; i >= 0; i--) {
    const m = arr[i]
    if (!m || String(m.role || '').toLowerCase() !== 'user') continue
    const c = normalizeMessageContent(m.content)
    if (c && String(c).trim()) return String(c).trim()
  }
  return String(prompt || '').trim()
}

function localInstantTutorReply(userText) {
  const raw = String(userText || '').trim()
  const q = raw.toLowerCase()
  if (!raw) return 'Ask a specific question and I will answer in 3 short steps.'

  if (q.includes('where') || q.includes('which page') || q.includes('go to') || q.includes('open')) {
    if (q.includes('science')) return 'Open Science at study-library.html.'
    if (q.includes('geography')) return 'Open Geography at geography-library.html.'
    if (q.includes('grade 10') || q.includes('math 10')) return 'Open Grade 10 Math at grade-10-math.html.'
    if (q.includes('grade 9') || q.includes('math 9')) return 'Open Grade 9 Math at math/index.html.'
    return 'Choose one page: Science study-library.html, Geography geography-library.html, Math 9 math/index.html, Math 10 grade-10-math.html.'
  }

  if (q.includes('slope') || q.includes('slope-intercept') || q.includes('y=mx+b') || q.includes('y = mx + b')) {
    return 'Slope-intercept form is y = mx + b. m is slope, b is y-intercept. Example: y = 2x + 3 means slope 2 and y-intercept 3.'
  }
  if (q.includes('trig') || q.includes('sin') || q.includes('cos') || q.includes('tan')) {
    return 'Use SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj. Label sides first, substitute values, then solve.'
  }
  if (q.includes('linear equation') || q.includes('solve for x') || q.includes('equation')) {
    return 'To solve a linear equation: 1) simplify both sides, 2) isolate x by inverse operations, 3) check by substitution.'
  }
  if (q.includes('quadratic')) {
    return 'For quadratics: put in standard form ax^2+bx+c=0, then factor if possible or use x = (-b +/- sqrt(b^2-4ac)) / (2a).'
  }
  if (q.includes('pythagorean') || q.includes('right triangle')) {
    return 'Use a^2 + b^2 = c^2, where c is the hypotenuse. Plug values, solve, then verify the longest side is c.'
  }

  return 'Direct answer: break this into known formula + substitution + final check. Send the exact problem and I will solve it step by step.'
}

async function tryHuggingFaceInferenceFallback(apiKey, model, messages, maxTokens, temperature) {
  const hfModel = String(model || '').trim() || 'nvidia/personaplex-7b-v1'
  const promptText = messagesToPrompt(messages)
  if (!promptText) return { ok: false, text: '', response: null, error: 'No prompt text to send.' }

  const endpoint =
    String(process.env.HF_INFERENCE_URL || '').trim() ||
    ('https://router.huggingface.co/hf-inference/models/' + encodeURIComponent(hfModel))
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: promptText,
      parameters: {
        max_new_tokens: Number.isFinite(maxTokens) ? maxTokens : 512,
        temperature: typeof temperature === 'number' ? temperature : 0.4,
        return_full_text: false,
      },
    }),
  })

  const raw = await res.text()
  let parsed = null
  try {
    parsed = JSON.parse(raw)
  } catch (_err) {}

  if (!res.ok) {
    var errText = ''
    if (parsed && typeof parsed.error === 'string') errText = parsed.error
    else if (parsed && parsed.error && typeof parsed.error.message === 'string') errText = parsed.error.message
    else errText = String(raw || 'Hugging Face inference error.')
    return { ok: false, text: '', response: parsed || raw, error: errText }
  }

  let text = ''
  if (Array.isArray(parsed) && parsed[0] && typeof parsed[0].generated_text === 'string') {
    text = parsed[0].generated_text.trim()
  } else if (parsed && typeof parsed.generated_text === 'string') {
    text = parsed.generated_text.trim()
  } else if (typeof raw === 'string') {
    text = raw.trim()
  }

  return { ok: true, text: text, response: parsed || raw, error: '' }
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
  messages.push({ role: 'system', content: SOUL_CONCEPT_SYSTEM_CONTEXT })
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
  const latestPrompt = latestUserMessage(messages, prompt)

  if (String(process.env.FORCE_LOCAL_AI || '').trim() === '1') {
    json(res, 200, {
      ok: true,
      text: localInstantTutorReply(latestPrompt),
      provider: 'local-instant',
      model: 'local-instant-v1',
    })
    return
  }

  const hasPersonaConfig = Boolean(
    String(process.env.DEEPSEEK_API_KEY || '').trim() ||
    String(process.env.SCIETLY_API_KEY || '').trim() ||
    String(process.env.DEEPSEEK_KEY || '').trim() ||
    String(process.env.DEEPSEEK_TOKEN || '').trim() ||
    String(process.env.DEEPSEEK_BASE_URL || '').trim() ||
    String(process.env.DEEPSEEK_MODEL || '').trim() ||
    String(process.env.PERSONAPLEX_API_KEY || '').trim() ||
    String(process.env.HUGGINGFACE_API_KEY || '').trim() ||
    String(process.env.PERSONAPLEX_MODEL || '').trim() ||
    String(process.env.PERSONAPLEX_BASE_URL || '').trim()
  )
  const forceFreeWebApi = String(process.env.FORCE_FREE_GPT4_WEB_API || '').trim() === '1'

  // Legacy path: self-hosted Free-GPT4-WEB-API.
  // Expected format: GET {FREE_GPT4_WEB_API_URL}/?text=...
  // PersonaPlex config takes priority unless FORCE_FREE_GPT4_WEB_API=1.
  const freeGptWebApiUrl = String(process.env.FREE_GPT4_WEB_API_URL || '').trim()
  if (freeGptWebApiUrl && (!hasPersonaConfig || forceFreeWebApi)) {
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
  const deepSeekApiKey = String(
    process.env.DEEPSEEK_API_KEY ||
      process.env.SCIETLY_API_KEY ||
      process.env.DEEPSEEK_KEY ||
      process.env.DEEPSEEK_TOKEN ||
      ''
  ).trim()
  const deepSeekEnabled =
    String(process.env.USE_DEEPSEEK || '').trim() === '1' ||
    String(process.env.AI_PROVIDER || '').trim().toLowerCase() === 'deepseek' ||
    !!deepSeekApiKey

  const apiKey =
    deepSeekApiKey ||
    process.env.PERSONAPLEX_API_KEY ||
    process.env.HUGGINGFACE_API_KEY ||
    process.env.FREE_LLM_API_KEY
  if (!apiKey) {
    json(res, 200, {
      ok: true,
      text: localInstantTutorReply(latestPrompt),
      provider: 'local-instant',
      model: 'local-instant-v1',
    })
    return
  }

  const forcedPersonaModel = String(process.env.PERSONAPLEX_MODEL || '').trim()
  const forcedDeepSeekModel = String(process.env.DEEPSEEK_MODEL || '').trim()
  const sourceModel = String(source.model || '').trim()
  const requestedModel = deepSeekEnabled
    ? normalizeDeepSeekModelName(
        sourceModel && sourceModel.toLowerCase().indexOf('deepseek') !== -1
          ? sourceModel
          : forcedDeepSeekModel || DEFAULT_DEEPSEEK_MODEL
      )
    : String(forcedPersonaModel || sourceModel || process.env.FREE_LLM_MODEL || 'nvidia/personaplex-7b-v1')
  const allowPersonaPlex = String(process.env.ALLOW_PERSONAPLEX || '').trim() === '1'
  const model =
    !allowPersonaPlex && requestedModel.toLowerCase().indexOf('nvidia/personaplex-7b-v1') !== -1
      ? WORKING_HOSTED_MODEL
      : requestedModel
  const baseUrl = cleanBaseUrl(
    deepSeekEnabled
      ? process.env.DEEPSEEK_BASE_URL || DEFAULT_DEEPSEEK_BASE_URL
      : process.env.PERSONAPLEX_BASE_URL || process.env.FREE_LLM_BASE_URL,
    deepSeekEnabled ? DEFAULT_DEEPSEEK_BASE_URL : 'https://router.huggingface.co/v1'
  )
  const chatUrl = deepSeekEnabled
    ? String(process.env.DEEPSEEK_CHAT_URL || '').trim() || baseUrl + '/chat/completions'
    : process.env.PERSONAPLEX_CHAT_URL || process.env.FREE_LLM_CHAT_URL || baseUrl + '/chat/completions'
  const completionUrl = deepSeekEnabled
    ? String(process.env.DEEPSEEK_COMPLETIONS_URL || '').trim() || baseUrl + '/completions'
    : process.env.PERSONAPLEX_COMPLETIONS_URL || process.env.FREE_LLM_COMPLETIONS_URL || baseUrl + '/completions'
  const maxTokens = Number(source.max_tokens || source.maxTokens || process.env.FREE_LLM_MAX_TOKENS || 1200)
  const temperature = typeof source.temperature === 'number' ? source.temperature : 0.68
  const useDirectHfInference =
    String(process.env.FORCE_HF_INFERENCE || '').trim() === '1' ||
    (!deepSeekEnabled && model.toLowerCase().indexOf('personaplex') !== -1)

  if (useDirectHfInference) {
    try {
      const hfDirect = await tryHuggingFaceInferenceFallback(apiKey, model, messages, maxTokens, temperature)
      if (hfDirect.ok) {
        json(res, 200, {
          ok: true,
          text: hfDirect.text || '',
          provider: 'huggingface-inference',
          model,
          mode: 'hf-direct',
          providerResponse: hfDirect.response || null,
        })
        return
      }
    } catch (_err) {
      // continue with chat/completions fallback path
    }
  }

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
      var upstreamErrorText =
        (parsed && (parsed.error && parsed.error.message ? parsed.error.message : parsed.error)) ||
        rawText ||
        'AI upstream error.'

      var canTryCompletionFallback =
        typeof upstreamErrorText === 'string' &&
        (upstreamErrorText.toLowerCase().indexOf('not a chat model') !== -1 ||
          upstreamErrorText.toLowerCase().indexOf('chat model') !== -1)

      var completionErrorText = ''
      var hfFallbackErrorText = ''
      if (canTryCompletionFallback || useDirectHfInference) {
        try {
          const promptText = messagesToPrompt(messages)
          const completionRes = await fetch(completionUrl, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + apiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              prompt: promptText,
              max_tokens: Number.isFinite(maxTokens) ? maxTokens : 1200,
              temperature,
            }),
          })

          const completionRaw = await completionRes.text()
          let completionParsed = null
          try {
            completionParsed = JSON.parse(completionRaw)
          } catch (_err) {}

          if (completionRes.ok) {
            let completionText = ''
            if (completionParsed && Array.isArray(completionParsed.choices) && completionParsed.choices[0]) {
              completionText = String(completionParsed.choices[0].text || '').trim()
            } else {
              completionText = String(completionRaw || '').trim()
            }
            json(res, 200, {
              ok: true,
              text: completionText,
              provider: 'openai-compatible',
              model,
              mode: 'completions-fallback',
              providerResponse: completionParsed || null,
            })
            return
          } else {
            completionErrorText =
              (completionParsed &&
                (completionParsed.error && completionParsed.error.message
                  ? completionParsed.error.message
                  : completionParsed.error)) ||
              completionRaw ||
              'Completions fallback failed.'
          }
        } catch (_err) {
          completionErrorText = _err && _err.message ? _err.message : 'Completions fallback failed.'
        }

        try {
          const hfFallback = await tryHuggingFaceInferenceFallback(apiKey, model, messages, maxTokens, temperature)
          if (hfFallback.ok) {
            json(res, 200, {
              ok: true,
              text: hfFallback.text || '',
              provider: 'huggingface-inference',
              model,
              mode: 'hf-inference-fallback',
              providerResponse: hfFallback.response || null,
            })
            return
          } else {
            hfFallbackErrorText = String(hfFallback.error || '')
          }
        } catch (_err) {
          hfFallbackErrorText = _err && _err.message ? _err.message : 'Hugging Face fallback failed.'
        }
      }

      var mergedError = upstreamErrorText
      if (hfFallbackErrorText) mergedError += ' | HF fallback: ' + hfFallbackErrorText
      if (completionErrorText) mergedError += ' | Completions fallback: ' + completionErrorText
      json(res, 200, {
        ok: true,
        text: localInstantTutorReply(latestPrompt),
        provider: 'local-instant',
        model: 'local-instant-v1',
        warning: mergedError,
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
    json(res, 200, {
      ok: true,
      text: localInstantTutorReply(latestPrompt),
      provider: 'local-instant',
      model: 'local-instant-v1',
      warning: err && err.message ? err.message : 'AI request failed.',
    })
  }
}
