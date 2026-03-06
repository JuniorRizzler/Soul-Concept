(function () {
  if (window.__scAIBridgeInstalled) return
  window.__scAIBridgeInstalled = true

  if (typeof window.fetch !== 'function') return

  var originalFetch = window.fetch.bind(window)
  var AI_HOST_MARKERS = [
    'api.anthropic.com',
    'api.openai.com',
    'openrouter.ai',
    'api.groq.com',
    'api.apifreellm.com',
  ]

  function resolveUrl(input) {
    try {
      if (typeof input === 'string') return input
      if (input && typeof input.url === 'string') return input.url
      return ''
    } catch (_err) {
      return ''
    }
  }

  function isAiRequest(url) {
    if (!url) return false
    var lower = String(url).toLowerCase()
    for (var i = 0; i < AI_HOST_MARKERS.length; i += 1) {
      if (lower.indexOf(AI_HOST_MARKERS[i]) !== -1) return true
    }
    return lower.indexOf('/v1/messages') !== -1 || lower.indexOf('/chat/completions') !== -1
  }

  function toProviderShape(targetUrl, text) {
    var lower = String(targetUrl || '').toLowerCase()
    if (lower.indexOf('anthropic') !== -1 || lower.indexOf('/v1/messages') !== -1) {
      return { content: [{ type: 'text', text: text || '' }] }
    }
    return { choices: [{ message: { role: 'assistant', content: text || '' } }] }
  }

  window.fetch = async function (input, init) {
    var url = resolveUrl(input)
    if (!isAiRequest(url)) return originalFetch(input, init)

    var method = (init && init.method ? init.method : 'GET').toUpperCase()
    if (method !== 'POST') return originalFetch(input, init)

    var parsedBody = {}
    try {
      if (init && typeof init.body === 'string') {
        parsedBody = JSON.parse(init.body || '{}')
      }
    } catch (_err) {}
    // Force a single assistant model across widgets unless the page overrides it.
    var forcedModel = String(window.SC_AI_MODEL || 'nvidia/personaplex-7b-v1')
    if (!parsedBody || typeof parsedBody !== 'object') parsedBody = {}
    parsedBody.model = forcedModel

    try {
      var bridgeRes = await originalFetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: url,
          request: parsedBody,
        }),
      })
      var bridgeData = await bridgeRes.json()
      if (!bridgeRes.ok) {
        return new Response(JSON.stringify(bridgeData), {
          status: bridgeRes.status,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      var shaped = toProviderShape(url, bridgeData.text || '')
      return new Response(JSON.stringify(shaped), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (_err) {
      return originalFetch(input, init)
    }
  }
})()
