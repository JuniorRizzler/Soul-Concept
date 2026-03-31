(function () {
  var CONFIG = window.SC_BBK12_CONFIG || {};
  var CONNECT_KEY = 'sc_bbk12_connection_v1';
  var SCHEDULE_KEY = 'sc_schedule_events_v2';
  var syncButton = document.querySelector('[data-bbk12-sync]');
  var disconnectButton = document.querySelector('[data-bbk12-disconnect]');
  var statusNode = document.querySelector('[data-bbk12-status]');

  if (!syncButton || !statusNode) return;

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
    var signedIn = !!(profile && profile.id);
    var state = readConnectionState();
    syncButton.innerHTML = '<span class="material-symbols-outlined text-lg" data-icon="cloud_sync" style="font-variation-settings: \'FILL\' 0;">cloud_sync</span>' + (state.connected ? 'Sync BBK12' : 'Connect BBK12');
    if (!signedIn) {
      if (disconnectButton) disconnectButton.classList.add('hidden');
      setStatus('Sign in first to connect BBK12 to your Soul Concept schedule.', 'default');
      return;
    }
    if (disconnectButton) disconnectButton.classList.toggle('hidden', !state.connected);
    if (state.connected) {
      var syncTime = formatSyncTime(state.lastSync);
      setStatus(syncTime ? 'BBK12 connected. Last sync: ' + syncTime : 'BBK12 connected and ready to sync.', 'success');
    } else {
      setStatus('Signed in. Connect BBK12 to import your school schedule into Soul Concept.', 'active');
    }
  }

  function toIsoDate(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function toTimeValue(date) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  }

  function parseDateValue(value) {
    if (!value) return null;
    if (/^\d{8}T\d{6}Z?$/.test(value)) {
      var year = Number(value.slice(0, 4));
      var month = Number(value.slice(4, 6)) - 1;
      var day = Number(value.slice(6, 8));
      var hour = Number(value.slice(9, 11));
      var minute = Number(value.slice(11, 13));
      var second = Number(value.slice(13, 15));
      return value.endsWith('Z')
        ? new Date(Date.UTC(year, month, day, hour, minute, second))
        : new Date(year, month, day, hour, minute, second);
    }
    if (/^\d{8}$/.test(value)) {
      return new Date(Number(value.slice(0, 4)), Number(value.slice(4, 6)) - 1, Number(value.slice(6, 8)), 9, 0, 0);
    }
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function parseIcs(ics) {
    var events = [];
    var blocks = String(ics || '').split('BEGIN:VEVENT').slice(1);
    blocks.forEach(function (block, index) {
      var body = block.split('END:VEVENT')[0] || '';
      function matchField(name) {
        var regex = new RegExp('(?:^|\\n)' + name + '(?:;[^:\\n]*)?:(.+)', 'i');
        var match = body.match(regex);
        return match ? String(match[1]).trim() : '';
      }
      var start = parseDateValue(matchField('DTSTART'));
      var end = parseDateValue(matchField('DTEND'));
      if (!start) return;
      if (!end || end <= start) end = new Date(start.getTime() + 60 * 60 * 1000);
      events.push({
        id: 'bbk12:' + (matchField('UID') || ('ics-' + index)),
        title: matchField('SUMMARY') || 'BBK12 Event',
        subject: 'BBK12',
        date: toIsoDate(start),
        start: toTimeValue(start),
        end: toTimeValue(end),
        location: matchField('LOCATION') || 'BBK12',
        priority: 'Medium',
        color: 'secondary-container',
        starred: false,
        source: 'bbk12',
        notes: matchField('DESCRIPTION') || ''
      });
    });
    return events;
  }

  function parseJson(payload) {
    var items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload && payload.events)
        ? payload.events
        : Array.isArray(payload && payload.value)
          ? payload.value
          : [];
    return items.map(function (item, index) {
      var start = parseDateValue(item.start || item.startDate || item.start_time || item.startTime || (item.start && item.start.dateTime));
      var end = parseDateValue(item.end || item.endDate || item.end_time || item.endTime || (item.end && item.end.dateTime));
      if (!start) return null;
      if (!end || end <= start) end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: 'bbk12:' + String(item.id || item.uid || index),
        title: item.title || item.summary || item.name || 'BBK12 Event',
        subject: item.subject || item.course || item.section || 'BBK12',
        date: toIsoDate(start),
        start: toTimeValue(start),
        end: toTimeValue(end),
        location: item.location || item.room || 'BBK12',
        priority: item.priority || 'Medium',
        color: 'secondary-container',
        starred: false,
        source: 'bbk12',
        notes: item.description || item.notes || ''
      };
    }).filter(Boolean);
  }

  async function fetchFeedText(url) {
    var response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      var text = await response.text().catch(function () { return ''; });
      throw new Error(text || 'BBK12 sync request failed.');
    }
    return response.text();
  }

  async function fetchFeedJson(url) {
    var response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      var text = await response.text().catch(function () { return ''; });
      throw new Error(text || 'BBK12 sync request failed.');
    }
    return response.json();
  }

  function mergeIntoSchedule(importedItems) {
    var current = readJson(SCHEDULE_KEY, []);
    current = Array.isArray(current) ? current : [];
    var manual = current.filter(function (entry) { return entry && entry.source !== 'bbk12'; });
    var next = manual.concat(importedItems);
    next.sort(function (a, b) {
      if (a.date !== b.date) return String(a.date || '').localeCompare(String(b.date || ''));
      return String(a.start || '').localeCompare(String(b.start || ''));
    });
    writeJson(SCHEDULE_KEY, next);
    window.dispatchEvent(new CustomEvent('sc:schedule-events-updated', {
      detail: { source: 'bbk12', count: importedItems.length }
    }));
  }

  async function importBbk12Events() {
    var feedUrl = String(CONFIG.proxyUrl || CONFIG.feedUrl || '').trim();
    if (!feedUrl) {
      throw new Error('Add a BBK12 feed URL or proxy URL in bbk12-config.js before connecting.');
    }

    setStatus('Importing events from BBK12...', 'active');
    var format = String(CONFIG.feedFormat || 'auto').toLowerCase();
    var imported = [];

    if (format === 'ics' || (format === 'auto' && /\.ics(\?|$)/i.test(feedUrl))) {
      imported = parseIcs(await fetchFeedText(feedUrl));
    } else {
      try {
        imported = parseJson(await fetchFeedJson(feedUrl));
      } catch (jsonErr) {
        if (format === 'json') throw jsonErr;
        imported = parseIcs(await fetchFeedText(feedUrl));
      }
    }

    mergeIntoSchedule(imported);
    var profile = readProfile();
    writeConnectionState({
      connected: true,
      lastSync: new Date().toISOString(),
      email: profile && profile.email ? profile.email : ''
    });
    updateChrome();
    setStatus('Imported ' + imported.length + ' BBK12 event' + (imported.length === 1 ? '' : 's') + ' into Soul Concept.', 'success');
  }

  function disconnectBbk12() {
    writeConnectionState({ connected: false, lastSync: '', email: '' });
    var current = readJson(SCHEDULE_KEY, []);
    if (Array.isArray(current)) {
      writeJson(SCHEDULE_KEY, current.filter(function (entry) { return entry && entry.source !== 'bbk12'; }));
    }
    window.dispatchEvent(new CustomEvent('sc:schedule-events-updated', {
      detail: { source: 'bbk12', count: 0 }
    }));
    updateChrome();
    setStatus('BBK12 disconnected. Imported BBK12 events were removed from this schedule.', 'default');
  }

  syncButton.addEventListener('click', function () {
    var profile = readProfile();
    if (!(profile && profile.id)) {
      window.location.href = 'auth/verification.html?returnTo=%2Fschedule.html&mode=returning&source=bbk12';
      return;
    }
    syncButton.disabled = true;
    importBbk12Events()
      .catch(function (err) {
        setStatus(err && err.message ? err.message : 'Could not import BBK12 events.', 'error');
      })
      .finally(function () {
        syncButton.disabled = false;
      });
  });

  if (disconnectButton) {
    disconnectButton.addEventListener('click', function () {
      disconnectBbk12();
    });
  }

  window.addEventListener('sc:auth-state-changed', function () {
    updateChrome();
  });

  updateChrome();
})();
