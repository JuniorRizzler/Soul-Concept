(function () {
  var CONFIG_PATH = '/supabase-config.json'
  var SDK_SRC = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
  var readyPromise = null

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-sc-supabase-sdk="1"]')
      if (existing) {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          resolve()
          return
        }
        existing.addEventListener('load', function () { resolve() }, { once: true })
        existing.addEventListener('error', function () { reject(new Error('Failed to load Supabase SDK.')) }, { once: true })
        return
      }

      var script = document.createElement('script')
      script.src = src
      script.async = true
      script.defer = true
      script.setAttribute('data-sc-supabase-sdk', '1')
      script.onload = function () { resolve() }
      script.onerror = function () { reject(new Error('Failed to load Supabase SDK.')) }
      document.head.appendChild(script)
    })
  }

  async function loadConfig() {
    var response = await fetch(CONFIG_PATH, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Supabase config request failed (' + response.status + ').')
    }
    var config = await response.json()
    if (!config || !config.url || !config.anonKey) {
      throw new Error('Supabase config is missing url or anonKey.')
    }
    return config
  }

  async function init() {
    if (window.scSupabaseClient) return window.scSupabaseClient

    var config = await loadConfig()
    await loadScript(SDK_SRC)

    if (!(window.supabase && typeof window.supabase.createClient === 'function')) {
      throw new Error('Supabase SDK loaded without createClient.')
    }

    var client = window.supabase.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sc-supabase-auth',
      },
    })

    window.scSupabaseConfig = config
    window.scSupabaseClient = client
    window.dispatchEvent(new CustomEvent('sc:supabase-ready', { detail: { client: client, config: config } }))
    return client
  }

  function getReadyPromise() {
    if (!readyPromise) {
      readyPromise = init().catch(function (err) {
        window.dispatchEvent(new CustomEvent('sc:supabase-error', { detail: { error: err } }))
        throw err
      })
    }
    return readyPromise
  }

  window.scSupabaseReady = getReadyPromise
  window.scGetSupabaseClient = function () {
    return window.scSupabaseClient || null
  }
})()
