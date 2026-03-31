(function () {
  var CONFIG = window.SC_GOOGLE_CALENDAR_CONFIG || {};
  var CONNECT_KEY = 'sc_google_calendar_connection_v1';
  var SCHEDULE_KEY = 'sc_schedule_events_v2';
  var syncButton = document.querySelector('[data-google-calendar-sync]');
  var disconnectButton = document.querySelector('[data-google-calendar-disconnect]');
  var statusNode = document.querySelector('[data-google-calendar-status]');

  if (!syncButton || !statusNode) return;

  var tokenClient = null;
  var accessToken = '';
  var syncMode = 'connect';

  function readProfile() {
    if (window.scAuthProfile) return window.scAuthProfile;
    try {
      var raw = localStorage.getItem('sc_auth_profile_v1');
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function scopeSuffix() {
    var profile = readProfile();
    return profile && profile.id ? 'user:' + profile.id : 'guest';
  }

  function scopedKey(baseKey) {
    return baseKey + '::' + scopeSuffix();
  }

  function readJson(baseKey, fallback) {
    try {
      var scoped = scopedKey(baseKey);
      var raw = localStorage.getItem(scoped);
      if (raw == null) {
        raw = localStorage.getItem(baseKey);
        if (raw != null) localStorage.setItem(scoped, raw);
      }
      return raw ? JSON.parse(raw) : fallback;
    } catch (_err) {
      return fallback;
    }
  }

  function writeJson(baseKey, value) {
    try {
      localStorage.setItem(scopedKey(baseKey), JSON.stringify(value));
    } catch (_err) {}
  }

  function setStatus(message, tone) {
    statusNode.textContent = message;
    statusNode.classList.remove('text-outline', 'text-secondary', 'text-primary', 'text-emerald-700', 'text-red-600');
    statusNode.classList.add(
      tone === 'error'
        ? 'text-red-600'
        : tone === 'success'
          ? 'text-emerald-700'
          : tone === 'active'
            ? 'text-primary'
            : 'text-outline'
    );
  }

  function readConnectionState() {
    return readJson(CONNECT_KEY, { connected: false, lastSync: '', email: '' });
  }

  function writeConnectionState(value) {
    writeJson(CONNECT_KEY, value || { connected: false, lastSync: '', email: '' });
  }

  function formatSyncTime(value) {
    if (!value) return '';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function updateChrome() {
    var profile = readProfile();
    var connection = readConnectionState();
    var signedIn = !!(profile && profile.id);
    var syncLabel = connection.connected ? 'Sync Google Calendar' : 'Connect Google Calendar';
    syncButton.innerHTML = '<span class="material-symbols-outlined text-lg" data-icon="sync" style="font-variation-settings: \'FILL\' 0;">sync</span>' + syncLabel;
    if (!signedIn) {
      if (disconnectButton) disconnectButton.classList.add('hidden');
      setStatus('Sign in first to connect Google Calendar to your Soul Concept schedule.', 'default');
      return;
    }

    if (disconnectButton) disconnectButton.classList.toggle('hidden', !connection.connected);
    if (connection.connected) {
      var syncTime = formatSyncTime(connection.lastSync);
      setStatus(syncTime ? 'Google Calendar connected. Last sync: ' + syncTime : 'Google Calendar connected and ready to sync.', 'success');
    } else {
      setStatus('Signed in. Connect your Google Calendar to import events into Soul Concept.', 'active');
    }
  }

  function redirectToLogin() {
    var url = 'auth/verification.html?returnTo=%2Fschedule.html&mode=returning&source=google-calendar';
    window.location.href = url;
  }

  function configReady() {
    return !!(CONFIG && CONFIG.clientId && String(CONFIG.clientId).trim());
  }

  function ensureTokenClient() {
    if (tokenClient) return tokenClient;
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) return null;
    if (!configReady()) return null;
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CONFIG.clientId,
      scope: CONFIG.scope || 'https://www.googleapis.com/auth/calendar.readonly',
      callback: function (response) {
        if (!response || response.error || !response.access_token) {
          setStatus('Google Calendar authorization did not complete.', 'error');
          syncButton.disabled = false;
          return;
        }
        accessToken = response.access_token;
        importGoogleCalendarEvents().catch(function (err) {
          setStatus(err && err.message ? err.message : 'Could not import Google Calendar events.', 'error');
          syncButton.disabled = false;
        });
      }
    });
    return tokenClient;
  }

  function toIsoDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function toTimeValue(date) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  }

  function buildRange() {
    var now = new Date();
    var min = new Date(now);
    min.setDate(min.getDate() + Number(CONFIG.timeMinOffsetDays || -30));
    min.setHours(0, 0, 0, 0);
    var max = new Date(now);
    max.setDate(max.getDate() + Number(CONFIG.timeMaxOffsetDays || 120));
    max.setHours(23, 59, 59, 999);
    return { min: min.toISOString(), max: max.toISOString() };
  }

  function mapGoogleEvent(item) {
    var startRaw = item.start && (item.start.dateTime || item.start.date);
    var endRaw = item.end && (item.end.dateTime || item.end.date);
    if (!startRaw || !endRaw) return null;

    var allDay = !!(item.start && item.start.date && !item.start.dateTime);
    var startDate = new Date(allDay ? startRaw + 'T09:00:00' : startRaw);
    var endDate = new Date(allDay ? endRaw + 'T10:00:00' : endRaw);
    if (allDay && item.end && item.end.date) {
      endDate = new Date(item.start.date + 'T10:00:00');
    }
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;
    if (endDate <= startDate) endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    return {
      id: 'gcal:' + String(item.id || Date.now()),
      title: item.summary || 'Google Calendar Event',
      subject: item.organizer && (item.organizer.displayName || item.organizer.email) ? (item.organizer.displayName || item.organizer.email) : 'Google Calendar',
      date: toIsoDate(startDate),
      start: toTimeValue(startDate),
      end: toTimeValue(endDate),
      location: item.location || 'Google Calendar',
      priority: item.colorId ? 'High' : 'Medium',
      color: item.colorId ? 'secondary' : 'primary',
      starred: false,
      source: 'google',
      googleCalendarId: item.id || '',
      googleEventUrl: item.htmlLink || '',
      notes: item.description || '',
      allDay: allDay
    };
  }

  async function fetchGoogleEvents() {
    var range = buildRange();
    var calendarId = encodeURIComponent(CONFIG.calendarId || 'primary');
    var url =
      'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events' +
      '?singleEvents=true&orderBy=startTime&maxResults=2500' +
      '&timeMin=' + encodeURIComponent(range.min) +
      '&timeMax=' + encodeURIComponent(range.max);
    var response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    if (!response.ok) {
      var text = await response.text().catch(function () { return ''; });
      throw new Error(text || 'Google Calendar sync request failed.');
    }
    var payload = await response.json();
    return Array.isArray(payload.items) ? payload.items : [];
  }

  function mergeIntoSchedule(importedItems) {
    var current = readJson(SCHEDULE_KEY, []);
    current = Array.isArray(current) ? current : [];
    var manual = current.filter(function (entry) { return entry && entry.source !== 'google'; });
    var next = manual.concat(importedItems);
    next.sort(function (a, b) {
      if (a.date !== b.date) return String(a.date || '').localeCompare(String(b.date || ''));
      return String(a.start || '').localeCompare(String(b.start || ''));
    });
    writeJson(SCHEDULE_KEY, next);
    window.dispatchEvent(new CustomEvent('sc:schedule-events-updated', {
      detail: { source: 'google-calendar', count: importedItems.length }
    }));
  }

  async function importGoogleCalendarEvents() {
    setStatus('Importing events from Google Calendar...', 'active');
    var items = await fetchGoogleEvents();
    var mapped = items.map(mapGoogleEvent).filter(Boolean);
    mergeIntoSchedule(mapped);
    var profile = readProfile();
    writeConnectionState({
      connected: true,
      lastSync: new Date().toISOString(),
      email: profile && profile.email ? profile.email : ''
    });
    updateChrome();
    setStatus('Imported ' + mapped.length + ' Google Calendar event' + (mapped.length === 1 ? '' : 's') + ' into Soul Concept.', 'success');
    syncButton.disabled = false;
  }

  function startConnectFlow() {
    var profile = readProfile();
    if (!(profile && profile.id)) {
      redirectToLogin();
      return;
    }
    if (!configReady()) {
      setStatus('Add your Google OAuth client ID in google-calendar-config.js before connecting Google Calendar.', 'error');
      return;
    }
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      setStatus('Google sign-in library is still loading. Try again in a moment.', 'error');
      return;
    }
    var client = ensureTokenClient();
    if (!client) {
      setStatus('Google Calendar setup is incomplete. Check the client ID configuration.', 'error');
      return;
    }
    syncButton.disabled = true;
    client.requestAccessToken({ prompt: syncMode === 'connect' ? 'consent' : '' });
  }

  function disconnectGoogleCalendar() {
    accessToken = '';
    writeConnectionState({ connected: false, lastSync: '', email: '' });
    var current = readJson(SCHEDULE_KEY, []);
    if (Array.isArray(current)) {
      writeJson(SCHEDULE_KEY, current.filter(function (entry) { return entry && entry.source !== 'google'; }));
    }
    window.dispatchEvent(new CustomEvent('sc:schedule-events-updated', {
      detail: { source: 'google-calendar', count: 0 }
    }));
    updateChrome();
    setStatus('Google Calendar disconnected. Imported Google events were removed from this schedule.', 'default');
  }

  syncButton.addEventListener('click', function () {
    var connection = readConnectionState();
    syncMode = connection.connected ? 'sync' : 'connect';
    startConnectFlow();
  });

  if (disconnectButton) {
    disconnectButton.addEventListener('click', function () {
      disconnectGoogleCalendar();
    });
  }

  window.addEventListener('sc:auth-state-changed', function () {
    accessToken = '';
    updateChrome();
  });

  updateChrome();
})();
