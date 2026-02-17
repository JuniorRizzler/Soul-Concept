(function () {
  const navToggle = document.querySelector('[data-nav-toggle]')
  const navMenu = document.querySelector('[data-nav-menu]')

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open')
      const expanded = navMenu.classList.contains('open')
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false')
    })
  }

  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase()
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    const target = (link.getAttribute('href') || '').toLowerCase()
    if (target === currentPage) {
      link.classList.add('active')
    }
  })

  const reveals = Array.from(document.querySelectorAll('.reveal'))
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.15 },
    )
    reveals.forEach(function (el) {
      revealObserver.observe(el)
    })
  }

  const counters = Array.from(document.querySelectorAll('[data-counter]'))
  if (counters.length) {
    const animateCounter = function (el) {
      const target = Number(el.getAttribute('data-counter') || 0)
      const duration = 1100
      const start = performance.now()

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1)
        const value = Math.floor(target * progress)
        el.textContent = String(value)
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }

    const counterObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return
          const el = entry.target
          if (el.dataset.done === '1') return
          el.dataset.done = '1'
          animateCounter(el)
          obs.unobserve(el)
        })
      },
      { threshold: 0.55 },
    )

    counters.forEach(function (el) {
      counterObserver.observe(el)
    })
  }

  const faqItems = Array.from(document.querySelectorAll('.faq-item'))
  faqItems.forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger')
    const content = item.querySelector('.faq-content')
    if (!trigger || !content) return

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open')
      faqItems.forEach(function (other) {
        other.classList.remove('open')
        const panel = other.querySelector('.faq-content')
        if (panel) panel.style.maxHeight = '0px'
      })

      if (!isOpen) {
        item.classList.add('open')
        content.style.maxHeight = content.scrollHeight + 'px'
      }
    })
  })

  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'))
  const filterCards = Array.from(document.querySelectorAll('[data-category]'))
  if (filterButtons.length && filterCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter') || 'all'
        filterButtons.forEach(function (node) {
          node.classList.remove('active')
        })
        btn.classList.add('active')

        filterCards.forEach(function (card) {
          const category = card.getAttribute('data-category') || ''
          const show = filter === 'all' || filter === category
          card.style.display = show ? 'block' : 'none'
        })
      })
    })
  }

  const roadmap = document.querySelector('[data-roadmap]')
  if (roadmap) {
    const tabs = Array.from(roadmap.querySelectorAll('[data-roadmap-tab]'))
    const panels = Array.from(roadmap.querySelectorAll('[data-roadmap-panel]'))
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-roadmap-tab')
        tabs.forEach(function (btn) {
          btn.classList.remove('active')
          btn.setAttribute('aria-selected', 'false')
        })
        panels.forEach(function (panel) {
          panel.classList.remove('active')
        })

        tab.classList.add('active')
        tab.setAttribute('aria-selected', 'true')
        const panel = roadmap.querySelector('[data-roadmap-panel="' + target + '"]')
        if (panel) panel.classList.add('active')
      })
    })
  }

  const switchers = Array.from(document.querySelectorAll('[data-switcher]'))
  switchers.forEach(function (switcher) {
    const buttons = Array.from(switcher.querySelectorAll('[data-switch]'))
    const panels = Array.from(switcher.querySelectorAll('[data-switch-panel]'))
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = btn.getAttribute('data-switch')
        buttons.forEach(function (node) {
          node.classList.remove('active')
          node.setAttribute('aria-selected', 'false')
        })
        panels.forEach(function (panel) {
          panel.classList.remove('active')
        })
        btn.classList.add('active')
        btn.setAttribute('aria-selected', 'true')
        const panel = switcher.querySelector('[data-switch-panel="' + target + '"]')
        if (panel) panel.classList.add('active')
      })
    })
  })

  const feedbackChoice = document.querySelector('[data-feedback-choice]')
  if (feedbackChoice) {
    const buttons = Array.from(feedbackChoice.querySelectorAll('[data-feedback-type]'))
    const hidden = document.querySelector('input[name="feedback_type"]')
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (node) {
          node.classList.remove('active')
        })
        btn.classList.add('active')
        if (hidden) hidden.value = btn.getAttribute('data-feedback-type') || 'feedback'
      })
    })
  }

  const contactForm = document.querySelector('[data-contact-form]')
  if (contactForm) {
    const status = contactForm.querySelector('[data-form-status]')
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault()

      const name = (contactForm.querySelector('[name="name"]') || {}).value || ''
      const email = (contactForm.querySelector('[name="email"]') || {}).value || ''
      const message = (contactForm.querySelector('[name="message"]') || {}).value || ''
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      if (!name.trim() || !emailOk || message.trim().length < 20) {
        if (status) {
          status.textContent = 'Please provide a valid name, email, and a message with at least 20 characters.'
          status.className = 'form-status err'
        }
        return
      }

      if (status) {
        status.textContent = 'Thanks for the feedback. We have received it.'
        status.className = 'form-status ok'
      }
      contactForm.reset()
    })
  }

  let deferredPrompt = null
  const installBtn = document.querySelector('[data-install-btn]')
  const installHint = document.querySelector('[data-install-hint]')
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone

  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null
        })
        return
      }

      if (isIos && !isStandalone) {
        if (installHint) installHint.classList.add('is-visible')
        return
      }

      alert('To install, use your browser menu and choose “Install app” or “Add to Home Screen”.')
    })
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault()
    deferredPrompt = event
  })

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null
  })

  if (installHint && isIos && !isStandalone) {
    installHint.classList.add('is-visible')
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (err) {
        console.warn('Service worker registration failed:', err)
      })
    })
  }

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    let pushWidgetDismissed = false
    try {
      pushWidgetDismissed = localStorage.getItem('sc_push_widget_dismissed') === '1'
    } catch (err) {
      pushWidgetDismissed = false
    }
    if (pushWidgetDismissed) return

    const VAPID_PUBLIC_KEY = 'BO94JvzECtxvt1c7RrNferA88Uh-4NX8W-vaY2Tw5O6UiejKE-oaHAZCbpmfjcLqajG_1fDWxnEpRwbXaVWi2_c'
    const widget = document.createElement('div')
    widget.className = 'push-widget'
    widget.innerHTML =
      '<div class="push-header">' +
      '<div class="push-title">Notifications</div>' +
      '<button class="push-close" type="button" aria-label="Close notifications panel" data-push-close>x</button>' +
      '</div>' +
      '<p class="push-text">Enable push notifications for updates.</p>' +
      '<div class="push-actions">' +
      '<button class="btn btn-secondary" type="button" data-push-enable>Enable</button>' +
      '<button class="btn btn-primary" type="button" data-push-test>Send test</button>' +
      '</div>' +
      '<p class="push-status" data-push-status></p>'
    document.body.appendChild(widget)

    const statusEl = widget.querySelector('[data-push-status]')
    const enableBtn = widget.querySelector('[data-push-enable]')
    const testBtn = widget.querySelector('[data-push-test]')
    const closeBtn = widget.querySelector('[data-push-close]')
    const pushEndpoint =
      window.PUSH_ENDPOINT ||
      (location.hostname.includes('vercel.app') || location.hostname.includes('vercel')
        ? '/api/send-push'
        : '/.netlify/functions/send-push')

    function setStatus(message, isError) {
      if (!statusEl) return
      statusEl.textContent = message
      statusEl.className = isError ? 'push-status err' : 'push-status ok'
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    }

    async function getSubscription() {
      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: key
        })
      }
      localStorage.setItem('sc_push_subscription', JSON.stringify(subscription))
      return subscription
    }

    async function sendTest(subscription) {
      const payload = {
        title: 'Soul Concept',
        body: 'Test notification received.',
        url: '/'
      }
      const res = await fetch(pushEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, payload })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to send notification.')
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        try {
          localStorage.setItem('sc_push_widget_dismissed', '1')
        } catch (err) {
          // ignore storage errors
        }
        widget.remove()
      })
    }

    enableBtn.addEventListener('click', async function () {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          setStatus('Permission denied.', true)
          return
        }
        await getSubscription()
        setStatus('Notifications enabled.', false)
      } catch (err) {
        setStatus(err.message || 'Failed to enable notifications.', true)
      }
    })

    testBtn.addEventListener('click', async function () {
      try {
        const subscription = await getSubscription()
        await sendTest(subscription)
        setStatus('Test sent. Check your notifications.', false)
      } catch (err) {
        setStatus(err.message || 'Failed to send test.', true)
      }
    })
  }
})()
