(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  if (!window.si) {
    window.si = function () {
      window.siq = window.siq || []
      window.siq.push(arguments)
    }
  }

  var src = '/_vercel/speed-insights/script.js'
  if (document.head.querySelector('script[src*="' + src + '"]')) return

  var script = document.createElement('script')
  script.src = src
  script.defer = true
  script.dataset.sdkn = '@vercel/speed-insights'
  script.dataset.sdkv = '2.0.0'
  script.onerror = function () {
    console.log('[Vercel Speed Insights] Failed to load script from ' + src + '.')
  }
  document.head.appendChild(script)
})()
