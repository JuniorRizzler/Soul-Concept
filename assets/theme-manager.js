(function () {
  var STORAGE_KEY = 'sc_theme_preference_v1'
  var STYLE_ID = 'sc-theme-manager-styles'
  var mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null

  function readPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (_error) {
      return null
    }
  }

  function writePreference(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch (_error) {
      // Ignore storage failures.
    }
  }

  function resolveTheme(preference) {
    if (preference === 'dark' || preference === 'light') return preference
    return mediaQuery && mediaQuery.matches ? 'dark' : 'light'
  }

  function isDark() {
    return document.documentElement.classList.contains('dark')
  }

  function applyTheme(preference) {
    var resolved = resolveTheme(preference)
    var root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    root.setAttribute('data-sc-theme', resolved)
    root.style.colorScheme = resolved
    if (document.body) document.body.setAttribute('data-sc-theme', resolved)
    updateThemeButtons()
  }

  function setTheme(preference) {
    writePreference(preference)
    applyTheme(preference)
  }

  function toggleTheme() {
    setTheme(isDark() ? 'light' : 'dark')
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return

    var style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent =
      '.sc-theme-toggle{' +
        'width:2.35rem;height:2.35rem;border-radius:.9rem;border:1px solid rgba(191,201,195,.22);' +
        'display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;' +
        'background:rgba(255,255,255,.82);color:#004435;box-shadow:0 1px 2px rgba(6,78,59,.06);' +
        'transition:transform .18s ease,background-color .18s ease,border-color .18s ease,color .18s ease}' +
      '.sc-theme-toggle:hover{transform:translateY(-1px);background:rgba(255,255,255,.96);border-color:rgba(0,68,53,.2)}' +
      '.sc-theme-toggle .material-symbols-outlined{font-size:1.18rem;line-height:1;font-variation-settings:"FILL" 1,"wght" 500,"GRAD" 0,"opsz" 24}' +
      '.sc-theme-toggle.is-sidebar{width:2.3rem;height:2.3rem;border-radius:.9rem}' +
      '.sc-theme-toggle.is-sidebar + .sc-theme-toggle{margin-left:.35rem}' +
      'html.dark body{background:#09111d !important;color:#eef2f7 !important}' +
      'html.dark [class*="bg-surface"]{background-color:#0b1522 !important}' +
      'html.dark [class*="bg-surface-container-lowest"]{background-color:#0f1a28 !important}' +
      'html.dark [class*="bg-surface-container-low "],html.dark [class~="bg-surface-container-low"]{background-color:#132032 !important}' +
      'html.dark [class*="bg-surface-container-highest"]{background-color:#1c3147 !important}' +
      'html.dark [class*="bg-surface-container-high"]{background-color:#17293d !important}' +
      'html.dark [class*="bg-surface-container "],html.dark [class~="bg-surface-container"]{background-color:#152436 !important}' +
      'html.dark [class*="bg-surface-variant"]{background-color:#1b3044 !important}' +
      'html.dark [class*="bg-background"]{background-color:#09111d !important}' +
      'html.dark [class*="bg-white"]{background-color:#101b2a !important}' +
      'html.dark [class*="bg-slate-900"]{background-color:#0c1623 !important}' +
      'html.dark [class*="text-on-surface"],html.dark [class*="text-on-background"]{color:#eef2f7 !important}' +
      'html.dark [class*="text-on-surface-variant"],html.dark [class*="text-outline"],html.dark [class*="text-slate-600"],html.dark [class*="text-slate-500"],html.dark [class*="text-slate-400"]{color:#9fb0c4 !important}' +
      'html.dark [class*="text-primary"],html.dark [class*="text-emerald-950"],html.dark [class*="text-emerald-900"],html.dark [class*="text-[#004435]"]{color:#c9f7e8 !important}' +
      'html.dark [class*="text-secondary"]{color:#ffb391 !important}' +
      'html.dark [class*="text-white"],html.dark [class*="text-on-primary"],html.dark [class*="text-slate-900"]{color:#f8fafc !important}' +
      'html.dark [class*="border-outline-variant"],html.dark [class*="border-slate-700"],html.dark [class*="border-slate-800"],html.dark [class*="border-white/10"],html.dark [class*="border-white/5"]{border-color:rgba(148,163,184,.22) !important}' +
      'html.dark [class*="shadow-sm"],html.dark [class*="shadow-md"],html.dark [class*="shadow-xl"],html.dark [class*="shadow-2xl"]{box-shadow:0 16px 36px rgba(2,6,23,.34) !important}' +
      'html.dark input,html.dark textarea,html.dark select{' +
        'background:#0f1b2a !important;color:#eef2f7 !important;border-color:rgba(148,163,184,.24) !important}' +
      'html.dark input::placeholder,html.dark textarea::placeholder{color:#7f91a6 !important}' +
      'html.dark .glass-dropdown,html.dark .home-notifications-panel{' +
        'background:rgba(10,19,31,.92) !important;border-color:rgba(148,163,184,.18) !important;color:#eef2f7 !important}' +
      'html.dark .mobile-app-shell{' +
        'background:rgba(9,17,29,.9) !important;border-top-color:rgba(148,163,184,.16) !important}' +
      'html.dark .mobile-app-item{color:#8ea0b4 !important}' +
      'html.dark .mobile-app-item[data-active="true"]{color:#d4fff3 !important}' +
      'html.dark{' +
        '--sc-sidebar-bg:rgba(10,19,31,.84);' +
        '--sc-sidebar-surface:rgba(15,27,40,.86);' +
        '--sc-sidebar-surface-strong:rgba(18,32,48,.94);' +
        '--sc-sidebar-surface-soft:rgba(17,29,43,.88);' +
        '--sc-sidebar-border:rgba(148,163,184,.2);' +
        '--sc-sidebar-border-soft:rgba(148,163,184,.14);' +
        '--sc-sidebar-shadow:0 18px 34px rgba(2,6,23,.32);' +
        '--sc-sidebar-primary:#c9f7e8;' +
        '--sc-sidebar-primary-soft:rgba(98,214,176,.14);' +
        '--sc-sidebar-accent:#ffad87;' +
        '--sc-sidebar-accent-soft:rgba(255,173,135,.12);' +
        '--sc-sidebar-text:#eef2f7;' +
        '--sc-sidebar-muted:#a8b7c8;' +
        '--sc-sidebar-faint:#7d8da0}' +
      'html.dark .sc-theme-toggle{' +
        'background:rgba(15,27,40,.92);color:#d3fff1;border-color:rgba(148,163,184,.2);box-shadow:0 12px 24px rgba(2,6,23,.22)}' +
      'html.dark .sc-theme-toggle:hover{background:rgba(20,35,52,.96);border-color:rgba(98,214,176,.22)}' +
      'html.dark #lyne-hint{' +
        'background:linear-gradient(145deg,rgba(6,30,25,.98),rgba(12,49,41,.96) 52%,rgba(96,36,14,.9)) !important}' +
      'html.dark #lyne-panel{' +
        'background:linear-gradient(180deg,rgba(10,19,31,.98),rgba(14,26,40,.96)) !important;' +
        'border-color:rgba(148,163,184,.18) !important;box-shadow:0 28px 52px rgba(2,6,23,.34) !important}' +
      'html.dark .lyne-panel-kicker,html.dark .lyne-status-chip,html.dark .lyne-prompt-chip{' +
        'background:rgba(20,34,49,.9) !important;border-color:rgba(148,163,184,.16) !important;color:#d9e5f2 !important}' +
      'html.dark .lyne-prompt-chip.is-primary{' +
        'background:rgba(44,111,90,.18) !important;color:#c9f7e8 !important;border-color:rgba(98,214,176,.18) !important}' +
      'html.dark #lyne-chat{' +
        'background:rgba(11,20,31,.92) !important;border-color:rgba(148,163,184,.16) !important;color:#eef2f7 !important}' +
      'html.dark .lyne-msg-lyne .lyne-msg-bubble{' +
        'background:rgba(18,31,46,.96) !important;border-color:rgba(148,163,184,.14) !important;color:#eef2f7 !important}' +
      'html.dark .lyne-msg-user .lyne-msg-bubble{' +
        'background:linear-gradient(135deg,#0d5f4d,#18705b) !important;color:#f8fafc !important}' +
      'html.dark .lyne-input{' +
        'background:rgba(13,25,38,.96) !important;border-color:rgba(148,163,184,.18) !important;color:#eef2f7 !important}'
    document.head.appendChild(style)
  }

  function buildButton(extraClass) {
    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'sc-theme-toggle' + (extraClass ? ' ' + extraClass : '')
    button.setAttribute('data-sc-theme-toggle', 'true')
    button.setAttribute('aria-label', 'Toggle color theme')
    button.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">dark_mode</span>'
    button.addEventListener('click', toggleTheme)
    return button
  }

  function updateThemeButtons() {
    var dark = isDark()
    var buttons = document.querySelectorAll('[data-sc-theme-toggle]')
    for (var i = 0; i < buttons.length; i += 1) {
      var button = buttons[i]
      var icon = button.querySelector('.material-symbols-outlined')
      var label = dark ? 'Switch to light mode' : 'Switch to dark mode'
      if (icon) icon.textContent = dark ? 'light_mode' : 'dark_mode'
      button.setAttribute('aria-label', label)
      button.title = label
    }
  }

  function mountTopbarToggle() {
    if (document.querySelector('[data-sc-theme-toggle-root="topbar"]')) return
    var topbar = document.querySelector('.topbar-inner')
    if (!topbar) return
    var actionRow = topbar.lastElementChild
    if (!actionRow) return

    var anchor = actionRow.querySelector('a[href$="settings.html"],a[href$="../settings.html"]')
    var button = buildButton('')
    button.setAttribute('data-sc-theme-toggle-root', 'topbar')

    if (anchor && anchor.parentNode === actionRow) {
      actionRow.insertBefore(button, anchor)
    } else {
      actionRow.appendChild(button)
    }
  }

  function mountSidebarToggle() {
    if (document.querySelector('[data-sc-theme-toggle-root="sidebar"]')) return
    var brand = document.querySelector('.sc-app-sidebar-brand')
    if (!brand) return
    var collapseButton = brand.querySelector('[data-sc-sidebar-toggle]')
    var button = buildButton('is-sidebar')
    button.setAttribute('data-sc-theme-toggle-root', 'sidebar')

    if (collapseButton && collapseButton.parentNode === brand) {
      brand.insertBefore(button, collapseButton)
    } else {
      brand.appendChild(button)
    }
  }

  function mountThemeControls() {
    mountTopbarToggle()
    mountSidebarToggle()
    updateThemeButtons()
  }

  function handleMediaChange() {
    if (readPreference()) return
    applyTheme('system')
  }

  function init() {
    ensureStyles()
    applyTheme(readPreference() || 'system')
    mountThemeControls()

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleMediaChange)
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleMediaChange)
      }
    }

    window.addEventListener('storage', function (event) {
      if (event.key !== STORAGE_KEY) return
      applyTheme(readPreference() || 'system')
    })

    setTimeout(mountThemeControls, 150)
    setTimeout(mountThemeControls, 600)
    setTimeout(mountThemeControls, 1400)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
}())
