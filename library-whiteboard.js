(function () {
  "use strict";

  var supportedPageSlugs = [
    "study-library",
    "geography-library",
    "grade-10-math",
    "preap-grade-10-preview"
  ];

  function normalizePath(pathname) {
    return (pathname || "")
      .toLowerCase()
      .replace(/\/+$/, "")
      .replace(/\.html$/, "");
  }

  function isSupportedRoute() {
    var currentPath = normalizePath(window.location.pathname || "");
    var title = (document.title || "").toLowerCase();
    var hasRoot = !!document.getElementById("root");

    var byPath = supportedPageSlugs.some(function (slug) {
      return (
        currentPath === "/" + slug ||
        currentPath.indexOf("/" + slug + "/") !== -1 ||
        currentPath.indexOf(slug) !== -1
      );
    });

    if (byPath) return true;
    if (!hasRoot) return false;
    return supportedPageSlugs.some(function (slug) {
      return title.indexOf(slug.replace(/-/g, " ")) !== -1;
    });
  }

  var hasBooted = false;

  function boot() {
    if (hasBooted) return;
    hasBooted = true;
    var isSupported = isSupportedRoute();
    // If this file is included on a page, initialize anyway.
    // Route detection is best-effort only.
    if (!isSupported && !document.getElementById("root")) return;

    var style = document.createElement("style");
    style.textContent = [
    ".lib-anno-toolbar{position:fixed;right:12px;bottom:12px;z-index:2147483646;display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:7px 8px;border-radius:12px;background:linear-gradient(135deg,rgba(30,24,17,.9),rgba(52,38,24,.88));backdrop-filter:blur(12px);border:1px solid rgba(228,199,160,.24);box-shadow:0 10px 24px rgba(20,12,7,.36)}",
    ".lib-anno-toolbar .lib-anno-btn,.lib-anno-toolbar input{border:1px solid rgba(207,167,118,.34);background:rgba(250,240,225,.96);color:#2d2015;border-radius:8px;padding:5px 7px;font:700 10px/1 Arial,sans-serif;cursor:pointer;transition:all .15s ease}",
    ".lib-anno-toolbar .lib-anno-btn:hover{transform:translateY(-1px)}",
    ".lib-anno-toolbar .lib-anno-btn.active{background:#f5d4a2;border-color:#d59644;color:#6b3a08}",
    ".lib-anno-toolbar .lib-anno-scope{color:#f5e7d3;font:700 10px/1 Arial,sans-serif;max-width:132px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 1px;opacity:.95}",
    ".lib-anno-color-row{display:flex;align-items:center;gap:4px}",
    ".lib-anno-swatch{width:18px;height:18px;border-radius:999px;border:2px solid rgba(255,255,255,.25);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.3)}",
    ".lib-anno-swatch.active{outline:2px solid #fff;outline-offset:1px}",
    ".lib-anno-toolbar input[type='range']{width:64px;padding:0}",
    ".lib-anno-toolbar input[type='color']{padding:0;width:28px;height:24px}",
    ".lib-anno-toolbar.minimized{padding:6px 7px;gap:5px}",
    ".lib-anno-toolbar.minimized .lib-anno-hide-when-min{display:none}",
    ".lib-anno-layer{position:absolute;left:0;top:0;z-index:2147483645;pointer-events:none;touch-action:none;cursor:crosshair}",
    ".lib-voice-layer{position:absolute;left:0;top:0;z-index:2147483644;pointer-events:none}",
    ".lib-voice-pin{position:absolute;transform:translate(-50%,-50%);pointer-events:auto;width:26px;height:26px;border-radius:999px;border:1px solid rgba(207,167,118,.7);background:linear-gradient(135deg,#f6d3a2,#d59644);color:#412307;font:700 13px/1 Arial,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(20,12,7,.28);cursor:pointer}",
    ".lib-voice-card{position:absolute;left:14px;top:-6px;min-width:220px;max-width:min(320px,72vw);background:rgba(30,24,17,.96);color:#f6ead9;border:1px solid rgba(228,199,160,.3);border-radius:10px;padding:10px;display:none;gap:8px;box-shadow:0 12px 24px rgba(20,12,7,.35);pointer-events:auto}",
    ".lib-voice-card.open{display:grid}",
    ".lib-voice-card audio{width:100%}",
    ".lib-voice-card-head{display:flex;justify-content:space-between;gap:8px;align-items:center}",
    ".lib-voice-card-title{font:700 11px/1 Arial,sans-serif;opacity:.92}",
    ".lib-voice-card-actions{display:flex;gap:6px}",
    ".lib-voice-card-btn{border:1px solid rgba(207,167,118,.4);background:rgba(250,240,225,.96);color:#2d2015;border-radius:7px;padding:4px 6px;font:700 10px/1 Arial,sans-serif;cursor:pointer}",
    ".lib-lyne-shell{position:fixed;right:12px;bottom:64px;z-index:2147483646;width:min(280px,86vw);background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,241,232,.97));border:1px solid rgba(207,167,118,.38);border-radius:14px;box-shadow:0 14px 28px rgba(20,12,7,.25);padding:10px;display:grid;gap:8px}",
    ".lib-lyne-head{display:flex;align-items:center;justify-content:space-between;gap:8px}",
    ".lib-lyne-title{font:800 12px/1 Arial,sans-serif;color:#2f2014;letter-spacing:.03em}",
    ".lib-lyne-meta{margin:0;font:700 10px/1.3 Arial,sans-serif;color:#6b543f;min-height:13px}",
    ".lib-lyne-chat{margin:0;background:#fff;border:1px solid rgba(214,181,143,.4);border-radius:10px;padding:8px;white-space:pre-wrap;min-height:52px;max-height:120px;overflow:auto;font:600 11px/1.35 Arial,sans-serif;color:#2d2015}",
    ".lib-lyne-actions{display:flex;gap:6px;flex-wrap:wrap}",
    ".lib-lyne-btn{border:1px solid rgba(207,167,118,.48);background:#fff;color:#2d2015;border-radius:8px;padding:5px 8px;font:800 10px/1 Arial,sans-serif;cursor:pointer}",
    ".lib-lyne-btn.primary{background:linear-gradient(135deg,#f6d3a2,#d59644);border-color:#cc8b3d;color:#40240d}",
    ".lib-ai-pet-shell{position:fixed;left:calc(100vw - 92px);top:112px;z-index:2147483646;display:grid;gap:6px;touch-action:none;user-select:none}",
    ".lib-ai-pet-shell.dashing .lib-ai-pet{box-shadow:0 14px 24px rgba(20,12,7,.35),0 0 0 2px rgba(228,199,160,.4)}",
    ".lib-ai-pet{width:56px;height:56px;border-radius:18px;border:1px solid rgba(229,194,151,.48);background:linear-gradient(150deg,#ffe8c9,#f2bf78 55%,#c57a27);position:relative;display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 10px 20px rgba(20,12,7,.32);overflow:visible}",
    ".lib-ai-pet:active{cursor:grabbing}",
    ".lib-ai-pet-shell.roaming .lib-ai-pet{animation:lib-pet-bob 1.35s ease-in-out infinite}",
    ".lib-ai-pet-face{width:36px;height:36px;border-radius:12px;background:linear-gradient(160deg,rgba(255,247,235,.92),rgba(255,229,194,.88));border:1px solid rgba(130,84,38,.28);position:relative}",
    ".lib-ai-pet-face:before,.lib-ai-pet-face:after{content:'';position:absolute;top:-6px;width:10px;height:10px;border-radius:3px;background:#f2d1a1;border:1px solid rgba(130,84,38,.25)}",
    ".lib-ai-pet-face:before{left:4px;transform:rotate(-20deg)}",
    ".lib-ai-pet-face:after{right:4px;transform:rotate(20deg)}",
    ".lib-ai-pet-eye{position:absolute;top:14px;width:5px;height:7px;border-radius:999px;background:#3f2a18}",
    ".lib-ai-pet-eye.left{left:9px}",
    ".lib-ai-pet-eye.right{right:9px}",
    ".lib-ai-pet-mouth{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);width:12px;height:6px;border-bottom:2px solid #5e3a1d;border-radius:0 0 8px 8px}",
    ".lib-ai-pet-tag{justify-self:center;background:rgba(30,24,17,.93);color:#f5e7d3;border:1px solid rgba(228,199,160,.34);border-radius:999px;padding:3px 9px;font:700 10px/1 Arial,sans-serif;letter-spacing:.02em}",
    ".lib-ai-pet-controls{display:flex;gap:6px;justify-content:center}",
    ".lib-ai-pet-btn{border:1px solid rgba(207,167,118,.42);background:rgba(30,24,17,.92);color:#f5e7d3;border-radius:999px;padding:3px 8px;font:700 10px/1 Arial,sans-serif;cursor:pointer;box-shadow:0 6px 14px rgba(20,12,7,.28)}",
    ".lib-ai-pet-btn.active{background:#f3c682;color:#42250c;border-color:#d89a4b}",
    ".lib-ai-pet-say{max-width:170px;background:rgba(30,24,17,.95);color:#f6ead9;border:1px solid rgba(228,199,160,.34);border-radius:10px;padding:6px 8px;font:700 10px/1.25 Arial,sans-serif;box-shadow:0 8px 18px rgba(20,12,7,.3)}",
    "@keyframes lib-pet-bob{0%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-2px) rotate(-1deg)}100%{transform:translateY(0) rotate(0deg)}}",
    "@media (max-width:760px){.lib-anno-toolbar{left:8px;right:8px;bottom:8px}.lib-anno-toolbar .lib-anno-scope{max-width:120px}}"
  ].join("");
    document.head.appendChild(style);

    var layer = document.createElement("canvas");
    layer.className = "lib-anno-layer";
    layer.id = "lib-anno-layer";
    document.body.appendChild(layer);

    var toolbar = document.createElement("div");
    toolbar.className = "lib-anno-toolbar";
    toolbar.innerHTML = [
    '<button type="button" class="lib-anno-btn" id="lib-anno-toggle">Off</button>',
    '<button type="button" class="lib-anno-btn" id="lib-anno-minimize">-</button>',
    '<button type="button" class="lib-anno-btn lib-anno-hide-when-min" id="lib-anno-eraser">Erase</button>',
    '<button type="button" class="lib-anno-btn lib-anno-hide-when-min" id="lib-anno-voice">Voice</button>',
    '<div class="lib-anno-color-row lib-anno-hide-when-min">',
      '<button type="button" class="lib-anno-swatch" data-color="#e11d48" style="background:#e11d48" aria-label="Pink pen"></button>',
      '<button type="button" class="lib-anno-swatch" data-color="#2563eb" style="background:#2563eb" aria-label="Blue pen"></button>',
      '<button type="button" class="lib-anno-swatch" data-color="#16a34a" style="background:#16a34a" aria-label="Green pen"></button>',
      '<button type="button" class="lib-anno-swatch" data-color="#1e1b4b" style="background:#1e1b4b" aria-label="Navy pen"></button>',
      '<input type="color" id="lib-anno-color" value="#e11d48" aria-label="Pen color">',
    '</div>',
    '<input class="lib-anno-hide-when-min" type="range" id="lib-anno-size" min="1" max="28" value="4" aria-label="Pen size">',
    '<button type="button" class="lib-anno-btn lib-anno-hide-when-min" id="lib-anno-clear">Clear</button>',
    '<span class="lib-anno-scope lib-anno-hide-when-min" id="lib-anno-scope">Notes</span>'
  ].join("");
    document.body.appendChild(toolbar);

    var voiceLayer = document.createElement("div");
    voiceLayer.className = "lib-voice-layer";
    voiceLayer.id = "lib-voice-layer";
    document.body.appendChild(voiceLayer);

    var ctx = layer.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    var toggleBtn = document.getElementById("lib-anno-toggle");
    var minimizeBtn = document.getElementById("lib-anno-minimize");
    var eraserBtn = document.getElementById("lib-anno-eraser");
    var voiceBtn = document.getElementById("lib-anno-voice");
    var colorInput = document.getElementById("lib-anno-color");
    var sizeInput = document.getElementById("lib-anno-size");
    var clearBtn = document.getElementById("lib-anno-clear");
    var scopeEl = document.getElementById("lib-anno-scope");
    var swatches = Array.prototype.slice.call(toolbar.querySelectorAll(".lib-anno-swatch"));

    var drawingEnabled = false;
    var erasing = false;
    var activePointerId = null;
    var lastX = 0;
    var lastY = 0;
    var saveTimer = null;
    var lastSizeW = 0;
    var lastSizeH = 0;
    var currentSectionName = "General";
    var currentStorageKey = "";
    var drawingCacheName = "soulconcept-drawings-v2";
    var prefColorKey = "lib-anno:pref:color";
    var prefMinKey = "lib-anno:pref:minimized";
    var isMinimized = false;
    var voiceNotes = [];
    var mediaRecorder = null;
    var mediaStream = null;
    var mediaChunks = [];
    var isVoiceRecording = false;
    var recordingForKey = "";
    var petState = null;

    function normalize(text) {
    return (text || "general")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "general";
  }

    function getVisibleText(el) {
    if (!el) return "";
    var text = (el.textContent || "").trim();
    if (!text) return "";
    var rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return "";
    return text;
  }

    function isGenericHeading(text) {
    var t = (text || "").toLowerCase();
    return (
      t === "grade 10 math" ||
      t === "math study library" ||
      t === "notes" ||
      t === "study tools" ||
      t === "practice" ||
      t === "general" ||
      t.indexOf("welcome") !== -1
    );
  }

    function firstVisibleText(selectors) {
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      var text = getVisibleText(el);
      if (text) return text;
    }
    return "";
  }

    function detectSectionName() {
    var overlay = document.getElementById("overlay");
    var modalTitle = document.getElementById("modal-title");
    if (overlay && overlay.classList.contains("active")) {
      var modalText = getVisibleText(modalTitle);
      if (modalText) return "overlay:" + modalText;
    }

    var crumb = document.querySelector("span.syne.text-sm.font-semibold.truncate.max-w-48, .breadcrumb .current, nav [aria-current='page']");
    var crumbText = getVisibleText(crumb);
    if (crumbText) return "crumb:" + crumbText;

    var backButtons = Array.prototype.slice.call(document.querySelectorAll("button"));
    var backLabel = "";
    var inSectionView = backButtons.some(function (btn) {
      var label = (btn.textContent || "").trim();
      if (label.indexOf("Back to ") === 0) backLabel = label;
      return label === "Back to Library" || label.indexOf("Back to ") === 0;
    });
    if (inSectionView) {
      var preferred = firstVisibleText(["#modal-title", "h1.syne", "h2.syne", "h1", "h2", "h3"]);
      if (preferred && !isGenericHeading(preferred)) {
        return "section:" + (backLabel || "Back") + "|" + preferred;
      }
      var heads = Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3"));
      for (var i = 0; i < heads.length; i++) {
        var txt = getVisibleText(heads[i]);
        if (!txt) continue;
        if (txt.length < 4 || txt.length > 120) continue;
        if (txt.toLowerCase().indexOf("ready to practice") !== -1 || isGenericHeading(txt)) continue;
        return "section:" + (backLabel || "Back") + "|" + txt;
      }
      if (backLabel) return "section:" + backLabel;
    }

    var unit = document.querySelector(".unit-title");
    var unitText = getVisibleText(unit);
    if (unitText) return "unit:" + unitText;

    var topHeads = Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3"))
      .map(getVisibleText)
      .filter(function (txt) { return txt && !isGenericHeading(txt) && txt.length <= 120; })
      .slice(0, 2);
    if (topHeads.length) return "view:" + topHeads.join("|");

    return "page:" + (document.title || "General").trim();
  }

    function storageKey(sectionName) {
    return "lib-anno:v3:" + window.location.pathname + window.location.search + ":" + normalize(sectionName);
  }

    function prettyScopeName(raw) {
    var text = String(raw || "General").trim();
    if (!text) return "General";
    text = text.replace(/^(overlay|crumb|section|unit|view|page):/i, "");
    if (text.indexOf("|") !== -1) {
      var parts = text.split("|").map(function (s) { return (s || "").trim(); }).filter(Boolean);
      if (parts.length > 1) text = parts[parts.length - 1];
      else text = parts[0] || text;
    }
    text = text.replace(/\s+/g, " ").trim();
    if (text.length > 42) text = text.slice(0, 41) + "…";
    return text || "General";
  }

    function setScopeLabel() {
    var label = prettyScopeName(currentSectionName);
    scopeEl.textContent = label;
    scopeEl.title = label;
  }

    function voiceStorageKeyFor(baseKey) {
    if (!baseKey) return "";
    return baseKey + ":voice:v1";
  }

    function saveVoiceNotesForKey(baseKey, notes) {
    var key = voiceStorageKeyFor(baseKey);
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(Array.isArray(notes) ? notes : []));
    } catch (err) {
      // ignore storage failures
    }
  }

    function loadVoiceNotesForKey(baseKey) {
    var key = voiceStorageKeyFor(baseKey);
    if (!key) return [];
    try {
      var raw = localStorage.getItem(key);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

    function clamp01(num) {
    if (num < 0) return 0;
    if (num > 1) return 1;
    return num;
  }

    function getDefaultVoiceAnchor() {
    var size = getDocSize();
    var xPx = Math.max(20, Math.min(size.width - 20, window.innerWidth - 36));
    var yPx = Math.max(70, Math.min(size.height - 40, window.scrollY + Math.min(window.innerHeight * 0.45, 260)));
    return {
      xPct: clamp01(xPx / size.width),
      yPct: clamp01(yPx / size.height)
    };
  }

    function formatVoiceTime(value) {
    if (!value) return "Voice note";
    try {
      var d = new Date(value);
      return d.toLocaleString();
    } catch (err) {
      return "Voice note";
    }
  }

    function renderVoiceNotes() {
    var size = getDocSize();
    voiceLayer.style.width = size.width + "px";
    voiceLayer.style.height = size.height + "px";
    voiceLayer.innerHTML = "";
    if (!voiceNotes.length) return;

    voiceNotes.forEach(function (note, index) {
      if (!note || !note.audio) return;
      var x = Math.round(clamp01(Number(note.xPct) || 0.5) * size.width);
      var y = Math.round(clamp01(Number(note.yPct) || 0.5) * size.height);

      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "lib-voice-pin";
      pin.style.left = x + "px";
      pin.style.top = y + "px";
      pin.textContent = "♪";
      pin.setAttribute("aria-label", "Voice note marker. Drag to move.");

      var card = document.createElement("div");
      card.className = "lib-voice-card";
      var title = document.createElement("div");
      title.className = "lib-voice-card-title";
      title.textContent = formatVoiceTime(note.createdAt);

      var closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "lib-voice-card-btn";
      closeBtn.textContent = "Close";

      var deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "lib-voice-card-btn";
      deleteBtn.textContent = "Delete";

      var actions = document.createElement("div");
      actions.className = "lib-voice-card-actions";
      actions.appendChild(deleteBtn);
      actions.appendChild(closeBtn);

      var head = document.createElement("div");
      head.className = "lib-voice-card-head";
      head.appendChild(title);
      head.appendChild(actions);

      var audio = document.createElement("audio");
      audio.controls = true;
      audio.preload = "metadata";
      audio.src = note.audio;

      card.appendChild(head);
      card.appendChild(audio);

      closeBtn.addEventListener("click", function () {
        card.classList.remove("open");
      });

      deleteBtn.addEventListener("click", function () {
        voiceNotes.splice(index, 1);
        saveVoiceNotesForKey(currentStorageKey, voiceNotes);
        renderVoiceNotes();
      });

      var drag = {
        active: false,
        moved: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        originX: x,
        originY: y
      };

      pin.addEventListener("pointerdown", function (event) {
        if (event.button !== 0) return;
        if (event.target && event.target.closest && event.target.closest(".lib-voice-card")) return;
        drag.active = true;
        drag.moved = false;
        drag.pointerId = event.pointerId;
        drag.startX = event.clientX;
        drag.startY = event.clientY;
        drag.originX = parseFloat(pin.style.left) || x;
        drag.originY = parseFloat(pin.style.top) || y;
        pin.setPointerCapture(event.pointerId);
        event.preventDefault();
      });

      pin.addEventListener("pointermove", function (event) {
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        var dx = event.clientX - drag.startX;
        var dy = event.clientY - drag.startY;
        if (!drag.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) drag.moved = true;
        if (!drag.moved) return;

        var sizeNow = getDocSize();
        var nextX = Math.max(14, Math.min(sizeNow.width - 14, drag.originX + dx));
        var nextY = Math.max(62, Math.min(sizeNow.height - 14, drag.originY + dy));
        pin.style.left = nextX + "px";
        pin.style.top = nextY + "px";
        event.preventDefault();
      });

      pin.addEventListener("pointerup", function (event) {
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        pin.releasePointerCapture(event.pointerId);
        drag.active = false;

        if (drag.moved) {
          var sizeNow = getDocSize();
          note.xPct = clamp01((parseFloat(pin.style.left) || x) / sizeNow.width);
          note.yPct = clamp01((parseFloat(pin.style.top) || y) / sizeNow.height);
          voiceNotes[index] = note;
          saveVoiceNotesForKey(currentStorageKey, voiceNotes);
          event.preventDefault();
          return;
        }

        var open = card.classList.contains("open");
        Array.prototype.slice.call(voiceLayer.querySelectorAll(".lib-voice-card.open")).forEach(function (el) {
          el.classList.remove("open");
        });
        if (!open) card.classList.add("open");
      });

      pin.addEventListener("pointercancel", function (event) {
        if (!drag.active || event.pointerId !== drag.pointerId) return;
        drag.active = false;
      });

      pin.appendChild(card);
      voiceLayer.appendChild(pin);
    });
  }

  function loadVoiceNotesForCurrentKey() {
    voiceNotes = loadVoiceNotesForKey(currentStorageKey);
    renderVoiceNotes();
  }

  function createLibraryLyneWidget() {
    if (document.getElementById("lib-lyne-widget")) return;
    var shell = document.createElement("section");
    shell.className = "lib-lyne-shell";
    shell.id = "lib-lyne-widget";
    shell.innerHTML = [
      '<div class="lib-lyne-head"><span class="lib-lyne-title">LYNE</span><span class="lib-lyne-meta" id="lib-lyne-meta">Idle.</span></div>',
      '<pre class="lib-lyne-chat" id="lib-lyne-chat">LYNE: Ready when you are.</pre>',
      '<div class="lib-lyne-actions">',
      '<button type="button" class="lib-lyne-btn primary" id="lib-lyne-start">Start</button>',
      '<button type="button" class="lib-lyne-btn" id="lib-lyne-stop">Stop</button>',
      "</div>"
    ].join("");
    document.body.appendChild(shell);

    var startBtn = document.getElementById("lib-lyne-start");
    var stopBtn = document.getElementById("lib-lyne-stop");
    var meta = document.getElementById("lib-lyne-meta");
    var chat = document.getElementById("lib-lyne-chat");
    if (!startBtn || !stopBtn || !meta || !chat) return;

    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "function") {
      startBtn.disabled = true;
      meta.textContent = "Voice unsupported.";
      return;
    }

    var recognition = null;
    var active = false;
    var listening = false;
    var waiting = false;
    var speaking = false;
    var ignoreMicUntil = 0;
    var lastSpeechEndedAt = 0;
    var lastAssistantText = "";
    var lastUserText = "";
    var lastUserAt = 0;
    var messages = [];

    function setChat(text) {
      chat.textContent = String(text || "").trim() || "LYNE: Ready when you are.";
    }

    function compactText(value) {
      return String(value || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    }

    function looksLikeEcho(text) {
      var u = compactText(text);
      var a = compactText(lastAssistantText);
      if (!u || !a) return false;
      return (
        u === a ||
        (u.length > 7 && a.indexOf(u) !== -1) ||
        (a.length > 20 && u.indexOf(a) !== -1) ||
        (Date.now() - lastSpeechEndedAt < 4500 && u.length > 5)
      );
    }

    function fallbackReply(prompt) {
      var q = String(prompt || "").toLowerCase();
      if (q.indexOf("trig") !== -1) return "Trig quick guide: identify opposite, adjacent, hypotenuse, then use SOH-CAH-TOA.";
      if (q.indexOf("where") !== -1 || q.indexOf("go") !== -1) return "I can guide you by section. Tell me your subject and topic.";
      return "Tell me the concept and I will explain it in short clear steps.";
    }

    function speak(text) {
      return new Promise(function (resolve) {
        var phrase = String(text || "").trim();
        if (!phrase || !window.speechSynthesis) return resolve();
        try {
          window.speechSynthesis.cancel();
          var u = new SpeechSynthesisUtterance(phrase);
          u.lang = "en-US";
          u.rate = 0.94;
          u.pitch = 1;
          u.onstart = function () {
            speaking = true;
            ignoreMicUntil = Date.now() + 2200;
            if (recognition && listening) {
              try { recognition.abort(); } catch (err) {}
              listening = false;
            }
            meta.textContent = "LYNE is speaking...";
          };
          u.onend = function () {
            speaking = false;
            lastSpeechEndedAt = Date.now();
            ignoreMicUntil = Date.now() + 900;
            meta.textContent = active ? "Listening..." : "Idle.";
            if (active && !waiting) window.setTimeout(startListening, 450);
            resolve();
          };
          u.onerror = function () {
            speaking = false;
            lastSpeechEndedAt = Date.now();
            ignoreMicUntil = Date.now() + 700;
            meta.textContent = active ? "Listening..." : "Idle.";
            resolve();
          };
          window.speechSynthesis.speak(u);
        } catch (err) {
          resolve();
        }
      });
    }

    function startListening() {
      if (!recognition || waiting || listening || speaking) return;
      if (Date.now() < ignoreMicUntil) {
        window.setTimeout(startListening, Math.max(120, ignoreMicUntil - Date.now()));
        return;
      }
      try { recognition.start(); } catch (err) {}
    }

    function askLyne(userText) {
      return new Promise(async function (resolve) {
        var prompt = String(userText || "").trim();
        if (!prompt || waiting || Date.now() < ignoreMicUntil || looksLikeEcho(prompt)) return resolve();
        var now = Date.now();
        if (prompt.toLowerCase() === lastUserText && now - lastUserAt < 3500) return resolve();
        lastUserText = prompt.toLowerCase();
        lastUserAt = now;
        waiting = true;
        meta.textContent = "Thinking...";
        setChat("You: " + prompt + "\n\nLYNE: ...");
        messages.push({ role: "user", content: prompt });
        try {
          var res = await fetch("/api/ai-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              request: {
                model: "Qwen/Qwen2.5-7B-Instruct",
                messages: messages.slice(-16),
                max_tokens: 320,
                temperature: 0.62
              }
            })
          });
          var data = await res.json();
          if (!res.ok) throw new Error((data && data.error) || "Request failed.");
          var reply = String((data && data.text) || "").trim() || fallbackReply(prompt);
          lastAssistantText = reply;
          messages.push({ role: "assistant", content: reply });
          setChat("You: " + prompt + "\n\nLYNE: " + reply);
          await speak(reply);
        } catch (err) {
          var fallback = fallbackReply(prompt);
          lastAssistantText = fallback;
          setChat("You: " + prompt + "\n\nLYNE: " + fallback);
          await speak(fallback);
        } finally {
          waiting = false;
          if (active) startListening();
          resolve();
        }
      });
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = function () {
      listening = true;
      meta.textContent = "Listening...";
    };
    recognition.onresult = function (event) {
      if (Date.now() < ignoreMicUntil) return;
      var transcript = "";
      for (var i = event.resultIndex; i < event.results.length; i++) {
        transcript += (event.results[i] && event.results[i][0] && event.results[i][0].transcript) || "";
      }
      transcript = String(transcript || "").trim();
      if (!transcript || looksLikeEcho(transcript)) return;
      askLyne(transcript);
    };
    recognition.onerror = function () {
      listening = false;
      if (active && !waiting) window.setTimeout(startListening, 520);
    };
    recognition.onend = function () {
      listening = false;
      if (active && !waiting) startListening();
    };

    startBtn.addEventListener("click", function () {
      active = true;
      meta.textContent = "Conversation started.";
      startListening();
    });

    stopBtn.addEventListener("click", function () {
      active = false;
      if (recognition && listening) {
        try { recognition.stop(); } catch (err) {}
      }
      try {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      } catch (err) {}
      speaking = false;
      meta.textContent = "Conversation stopped.";
    });

    window.setTimeout(function () {
      var greeting = "Hey, welcome to this library. I am LYNE. Ask me anything from this page.";
      setChat("LYNE: " + greeting);
      speak(greeting);
    }, 500);
  }

  function createPetAssistant() {
    var posKey = "lib-ai-pet:pos:v1";
    var roamKey = "lib-ai-pet:roam:v1";
    var shell = document.createElement("div");
    shell.className = "lib-ai-pet-shell";
    shell.innerHTML = [
      '<div class="lib-ai-pet" role="button" tabindex="0" aria-label="PersonaPlex assistant. Drag to move.">',
      '<div class="lib-ai-pet-face">',
      '<span class="lib-ai-pet-eye left"></span>',
      '<span class="lib-ai-pet-eye right"></span>',
      '<span class="lib-ai-pet-mouth"></span>',
      "</div>",
      "</div>",
      '<div class="lib-ai-pet-tag">PersonaPlex</div>',
      '<div class="lib-ai-pet-controls">',
      '<button type="button" class="lib-ai-pet-btn lib-ai-pet-roam active">Pause</button>',
      '<button type="button" class="lib-ai-pet-btn lib-ai-pet-talk">Chat</button>',
      "</div>",
      '<div class="lib-ai-pet-say" hidden>Need help on this section?</div>'
    ].join("");
    document.body.appendChild(shell);

    var pet = shell.querySelector(".lib-ai-pet");
    var roamBtn = shell.querySelector(".lib-ai-pet-roam");
    var talkBtn = shell.querySelector(".lib-ai-pet-talk");
    var say = shell.querySelector(".lib-ai-pet-say");
    if (!pet || !roamBtn || !talkBtn || !say) return;

    function clampPetX(x) {
      var max = Math.max(8, window.innerWidth - 64);
      return Math.max(8, Math.min(max, x));
    }
    function clampPetY(y) {
      var max = Math.max(8, window.innerHeight - 96);
      return Math.max(8, Math.min(max, y));
    }

    function loadPetPos() {
      try {
        var raw = localStorage.getItem(posKey);
        if (!raw) return null;
        var parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.x !== "number" || typeof parsed.y !== "number") return null;
        return { x: clampPetX(parsed.x), y: clampPetY(parsed.y) };
      } catch (err) {
        return null;
      }
    }

    function savePetPos() {
      try {
        localStorage.setItem(posKey, JSON.stringify({ x: petState.x, y: petState.y }));
      } catch (err) {}
    }

    function setPetPos(x, y, animated, durationMs) {
      petState.x = clampPetX(x);
      petState.y = clampPetY(y);
      var duration = Math.max(420, Number(durationMs) || 1100);
      shell.style.transition = animated
        ? "left " + duration + "ms cubic-bezier(.22,1,.36,1),top " + duration + "ms cubic-bezier(.22,1,.36,1)"
        : "none";
      shell.style.left = petState.x + "px";
      shell.style.top = petState.y + "px";
    }

    function showSpeech(text, duration) {
      say.textContent = text || "Need help?";
      say.hidden = false;
      window.clearTimeout(petState.speechTimer);
      petState.speechTimer = window.setTimeout(function () {
        say.hidden = true;
      }, duration || 2600);
    }

    function pickRandomSpeech() {
      var section = prettyScopeName(currentSectionName || "this page");
      var lines = [
        "Want me to explain " + section + "?",
        "Need a quick summary?",
        "Tap Chat to open PersonaPlex.",
        "I can guide you through this section."
      ];
      return lines[Math.floor(Math.random() * lines.length)];
    }

    function openPersonaPlexChatPanel() {
      var tooltip = Array.prototype.slice.call(document.querySelectorAll("div,span,p")).find(function (el) {
        var text = (el.textContent || "").trim();
        return text === "Chat with PersonaPlex" || text === "Chat with L.Y.N.E";
      });
      if (tooltip && tooltip.closest) {
        var host = tooltip.closest(".group");
        var hostBtn = host ? host.querySelector("button") : null;
        if (hostBtn) {
          hostBtn.click();
          return true;
        }
      }

      var candidates = Array.prototype.slice.call(document.querySelectorAll("button,[role='button']"));
      for (var i = 0; i < candidates.length; i++) {
        var node = candidates[i];
        if (!node || typeof node.click !== "function") continue;
        var label =
          (node.getAttribute && (node.getAttribute("aria-label") || node.getAttribute("title"))) ||
          "";
        var cls = node.className && typeof node.className === "string" ? node.className : "";
        var txt = (node.textContent || "").trim();
        var probe = (label + " " + cls + " " + txt).toLowerCase();
        if (
          probe.indexOf("personaplex") !== -1 ||
          probe.indexOf("ai assistant") !== -1 ||
          probe.indexOf("sparkle") !== -1 ||
          (probe.indexOf("fixed") !== -1 && probe.indexOf("bottom-6") !== -1 && probe.indexOf("right-6") !== -1)
        ) {
          node.click();
          return true;
        }
      }
      return false;
    }

    function distance(aX, aY, bX, bY) {
      var dx = aX - bX;
      var dy = aY - bY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function getMeaningfulTargets() {
      var targets = [
        { x: 14, y: 86 },
        { x: window.innerWidth - 78, y: 86 },
        { x: 14, y: window.innerHeight - 116 },
        { x: window.innerWidth - 78, y: window.innerHeight - 116 },
        { x: window.innerWidth * 0.5 - 28, y: 90 }
      ];
      var heading = document.querySelector("#modal-title, .unit-title, h1.syne, h2.syne, h1, h2");
      if (heading) {
        var r = heading.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          targets.push({ x: r.right + 16, y: r.top + 6 });
          targets.push({ x: r.left - 62, y: r.top + 6 });
        }
      }
      var toolbarEl = document.querySelector(".lib-anno-toolbar");
      if (toolbarEl) {
        var t = toolbarEl.getBoundingClientRect();
        targets.push({ x: t.left - 70, y: t.top - 12 });
      }
      return targets.map(function (p) {
        return { x: clampPetX(p.x), y: clampPetY(p.y) };
      });
    }

    function chooseNextTarget() {
      var points = getMeaningfulTargets().filter(function (p) {
        return distance(p.x, p.y, petState.x, petState.y) > 72;
      });
      if (!points.length) return { x: clampPetX(petState.x + 50), y: clampPetY(petState.y + 20) };
      if (petState.lastTarget && points.length > 1) {
        points = points.filter(function (p) {
          return distance(p.x, p.y, petState.lastTarget.x, petState.lastTarget.y) > 24;
        });
      }
      return points[Math.floor(Math.random() * points.length)];
    }

    function roamStep() {
      if (!petState.roaming || petState.dragging) return;
      if (Date.now() < petState.pauseUntil) return;
      var target = chooseNextTarget();
      petState.lastTarget = target;
      var dist = distance(target.x, target.y, petState.x, petState.y);
      var duration = Math.round(Math.max(900, Math.min(2200, dist * 7.5)));
      shell.classList.add("dashing");
      setPetPos(target.x, target.y, true, duration);
      window.setTimeout(function () {
        shell.classList.remove("dashing");
      }, Math.min(700, duration));
      savePetPos();
    }

    function scheduleRoam() {
      window.clearTimeout(petState.roamTimer);
      if (!petState.roaming) return;
      var run = function () {
        roamStep();
        if (!petState.roaming) return;
        var delay = 2600 + Math.round(Math.random() * 1800);
        petState.roamTimer = window.setTimeout(run, delay);
      };
      run();
    }

    function setRoaming(next) {
      petState.roaming = !!next;
      shell.classList.toggle("roaming", petState.roaming);
      roamBtn.classList.toggle("active", petState.roaming);
      roamBtn.textContent = petState.roaming ? "Pause" : "Wander";
      try { localStorage.setItem(roamKey, petState.roaming ? "1" : "0"); } catch (err) {}
      scheduleRoam();
      if (petState.roaming) showSpeech("Roaming smoothly.", 1400);
    }

    var stored = loadPetPos();
    petState = {
      x: stored ? stored.x : clampPetX(window.innerWidth - 92),
      y: stored ? stored.y : 112,
      roaming: true,
      dragging: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      pauseUntil: 0,
      roamTimer: null,
      lastTarget: null,
      speechTimer: null
    };
    try {
      petState.roaming = localStorage.getItem(roamKey) !== "0";
    } catch (err) {}
    setPetPos(petState.x, petState.y, false);
    setRoaming(petState.roaming);

    pet.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      petState.dragging = true;
      petState.pointerId = event.pointerId;
      petState.startX = event.clientX;
      petState.startY = event.clientY;
      petState.originX = petState.x;
      petState.originY = petState.y;
      pet.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    pet.addEventListener("pointermove", function (event) {
      if (!petState.dragging || event.pointerId !== petState.pointerId) return;
      var dx = event.clientX - petState.startX;
      var dy = event.clientY - petState.startY;
      setPetPos(petState.originX + dx, petState.originY + dy, false);
      event.preventDefault();
    });

    pet.addEventListener("pointerup", function (event) {
      if (!petState.dragging || event.pointerId !== petState.pointerId) return;
      petState.dragging = false;
      petState.pauseUntil = Date.now() + 4200;
      savePetPos();
      try { pet.releasePointerCapture(event.pointerId); } catch (err) {}
      event.preventDefault();
    });

    pet.addEventListener("pointercancel", function (event) {
      if (!petState.dragging || event.pointerId !== petState.pointerId) return;
      petState.dragging = false;
      try { pet.releasePointerCapture(event.pointerId); } catch (err) {}
    });

    roamBtn.addEventListener("click", function () {
      setRoaming(!petState.roaming);
    });

    talkBtn.addEventListener("click", function () {
      var opened = openPersonaPlexChatPanel();
      if (opened) {
        showSpeech("PersonaPlex chat opened.", 1800);
        return;
      }
      showSpeech("I could not find the chat button here.", 2400);
    });

    window.addEventListener("resize", function () {
      setPetPos(petState.x, petState.y, false);
      savePetPos();
    });
  }

    function setVoiceRecordingState(active) {
    isVoiceRecording = !!active;
    if (!voiceBtn) return;
    voiceBtn.classList.toggle("active", isVoiceRecording);
    voiceBtn.textContent = isVoiceRecording ? "Stop" : "Voice";
  }

    function stopMediaStream() {
    if (!mediaStream) return;
    try {
      mediaStream.getTracks().forEach(function (t) { t.stop(); });
    } catch (err) {}
    mediaStream = null;
  }

    function addVoiceNoteFromData(audioData, targetKey) {
    if (!audioData || !targetKey) return;
    var anchor = getDefaultVoiceAnchor();
    var notes = loadVoiceNotesForKey(targetKey);
    notes.push({
      id: "vn-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      xPct: anchor.xPct,
      yPct: anchor.yPct,
      audio: audioData,
      createdAt: new Date().toISOString()
    });
    saveVoiceNotesForKey(targetKey, notes);
    if (targetKey === currentStorageKey) {
      voiceNotes = notes;
      renderVoiceNotes();
    }
  }

    function setColor(color) {
    if (!color) return;
    colorInput.value = color;
    swatches.forEach(function (btn) {
      btn.classList.toggle("active", (btn.getAttribute("data-color") || "").toLowerCase() === color.toLowerCase());
    });
    try { localStorage.setItem(prefColorKey, color); } catch (err) {}
  }

    function setMinimized(nextState) {
    isMinimized = !!nextState;
    toolbar.classList.toggle("minimized", isMinimized);
    minimizeBtn.textContent = isMinimized ? "+" : "−";
    try { localStorage.setItem(prefMinKey, isMinimized ? "1" : "0"); } catch (err) {}
  }

    function setDrawingEnabled(enabled) {
    drawingEnabled = !!enabled;
    layer.style.pointerEvents = drawingEnabled ? "auto" : "none";
    toggleBtn.textContent = drawingEnabled ? "On" : "Off";
    toggleBtn.classList.toggle("active", drawingEnabled);
    if (!drawingEnabled) {
      activePointerId = null;
      saveSoon();
    }
  }

    function setEraseMode(enabled) {
    erasing = !!enabled;
    eraserBtn.classList.toggle("active", erasing);
  }

    function getDocSize() {
    var prevDisplay = layer.style.display;
    layer.style.display = "none";
    var prevVoiceDisplay = voiceLayer.style.display;
    voiceLayer.style.display = "none";
    var doc = document.documentElement;
    var body = document.body;
    var width = Math.max(doc.clientWidth, body ? body.clientWidth : 0, window.innerWidth || 0, doc.scrollWidth, body ? body.scrollWidth : 0);
    var height = Math.max(doc.clientHeight, body ? body.clientHeight : 0, window.innerHeight || 0);

    if (body) {
      var kids = Array.prototype.slice.call(body.children);
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el === layer || el === toolbar || el === voiceLayer) continue;
        var cs = window.getComputedStyle(el);
        if (cs.position === "fixed") continue;
        var rect = el.getBoundingClientRect();
        var bottom = rect.bottom + window.scrollY;
        if (bottom > height) height = bottom;
      }
    }

    layer.style.display = prevDisplay;
    voiceLayer.style.display = prevVoiceDisplay;
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }

    function resizeLayerIfNeeded() {
    var size = getDocSize();
    if (size.width === lastSizeW && size.height === lastSizeH) return;

    var prev = document.createElement("canvas");
    prev.width = layer.width;
    prev.height = layer.height;
    if (layer.width > 0 && layer.height > 0) {
      prev.getContext("2d").drawImage(layer, 0, 0);
    }

    layer.width = size.width;
    layer.height = size.height;
    layer.style.width = size.width + "px";
    layer.style.height = size.height + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, layer.width, layer.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (prev.width > 0 && prev.height > 0) {
      ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, layer.width, layer.height);
    }

    lastSizeW = size.width;
    lastSizeH = size.height;
  }

    function canUseCacheStorage() {
    return typeof window.caches !== "undefined";
  }

    function cacheRequestFromKey(key) {
    return new Request("/__lib_anno__/" + encodeURIComponent(key), { method: "GET" });
  }

    function putCachePayload(key, payload) {
    if (!key || !payload || !canUseCacheStorage()) return;
    window.caches
      .open(drawingCacheName)
      .then(function (cache) {
        return cache.put(
          cacheRequestFromKey(key),
          new Response(payload, {
            headers: { "content-type": "application/json" }
          })
        );
      })
      .catch(function () {
        // ignore cache failures
      });
  }

    function removeCachePayload(key) {
    if (!key || !canUseCacheStorage()) return;
    window.caches
      .open(drawingCacheName)
      .then(function (cache) {
        return cache.delete(cacheRequestFromKey(key));
      })
      .catch(function () {
        // ignore cache failures
      });
  }

    function readCachePayload(key, onDone) {
    if (!key || !canUseCacheStorage()) {
      if (onDone) onDone(null);
      return;
    }
    window.caches
      .open(drawingCacheName)
      .then(function (cache) {
        return cache.match(cacheRequestFromKey(key));
      })
      .then(function (response) {
        if (!response) return null;
        return response.text();
      })
      .then(function (text) {
        if (onDone) onDone(text || null);
      })
      .catch(function () {
        if (onDone) onDone(null);
      });
  }

    function buildPayload() {
    return JSON.stringify({
      width: layer.width,
      height: layer.height,
      data: layer.toDataURL("image/png")
    });
  }

    function saveNow() {
    if (!currentStorageKey) return;
    try {
      var payload = buildPayload();
      localStorage.setItem(currentStorageKey, payload);
      putCachePayload(currentStorageKey, payload);
    } catch (err) {
      // ignore quota/storage failures
    }
  }

    function saveSoon() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, 280);
  }

    function clearLayer() {
    ctx.clearRect(0, 0, layer.width, layer.height);
  }

    function drawFromPayload(raw) {
    if (!raw) return;
    var parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return;
    }
    if (!parsed || !parsed.data) return;

    var img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, layer.width, layer.height);
      var srcW = Number(parsed.width) || layer.width;
      var srcH = Number(parsed.height) || layer.height;
      ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, layer.width, layer.height);
    };
    img.src = parsed.data;
  }

  function loadForCurrentKey() {
    resizeLayerIfNeeded();
    clearLayer();
    if (!currentStorageKey) return;

    var keyAtLoad = currentStorageKey;
    var raw = localStorage.getItem(currentStorageKey);
    if (raw) {
      drawFromPayload(raw);
      return;
    }

    readCachePayload(currentStorageKey, function (cachedRaw) {
      if (!cachedRaw || keyAtLoad !== currentStorageKey) return;
      try {
        localStorage.setItem(keyAtLoad, cachedRaw);
      } catch (err) {
        // ignore storage failures
      }
      drawFromPayload(cachedRaw);
    });
  }

    function updateContext() {
    var nextSection = detectSectionName();
    var nextKey = storageKey(nextSection);
    if (nextKey === currentStorageKey) return;

    if (currentStorageKey) saveNow();
    currentSectionName = nextSection;
    currentStorageKey = nextKey;
    setScopeLabel();
    loadForCurrentKey();
    loadVoiceNotesForCurrentKey();
  }

    function pointFromEvent(event) {
    return { x: event.pageX, y: event.pageY };
  }

    function isOverlayUiTarget(target) {
    if (!target || !target.closest) return false;
    return !!target.closest(".lib-anno-toolbar, .lib-voice-layer, .lib-ai-pet-shell");
  }

    function canStartStroke(event) {
    if (!drawingEnabled) return false;
    if (isOverlayUiTarget(event.target)) return false;
    if (typeof event.button === "number" && event.button !== 0 && event.pointerType !== "pen") return false;
    return true;
  }

    function isStylusBackEraser(event) {
    if (!event || event.pointerType !== "pen") return false;
    return event.button === 5 || event.buttons === 32;
  }

    function isEraserInput(event) {
    return erasing || isStylusBackEraser(event);
  }

    function startStroke(event) {
    if (!canStartStroke(event)) return;
    updateContext();
    resizeLayerIfNeeded();

    activePointerId = event.pointerId;
    var pt = pointFromEvent(event);
    lastX = pt.x;
    lastY = pt.y;

    var usingEraser = isEraserInput(event);
    ctx.globalCompositeOperation = usingEraser ? "destination-out" : "source-over";
    ctx.strokeStyle = colorInput.value || "#e11d48";
    ctx.lineWidth = usingEraser
      ? Math.max(12, Number(sizeInput.value || 4) * 2.5)
      : Number(sizeInput.value || 4);

    event.preventDefault();
  }

    function moveStroke(event) {
    if (activePointerId === null || event.pointerId !== activePointerId) return;
    var pt = pointFromEvent(event);

    var usingEraser = isEraserInput(event);
    ctx.globalCompositeOperation = usingEraser ? "destination-out" : "source-over";
    ctx.lineWidth = usingEraser
      ? Math.max(12, Number(sizeInput.value || 4) * 2.5)
      : Number(sizeInput.value || 4);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    lastX = pt.x;
    lastY = pt.y;
    event.preventDefault();
  }

    function endStroke(event) {
    if (activePointerId === null || event.pointerId !== activePointerId) return;
    activePointerId = null;
    saveSoon();
    event.preventDefault();
  }

  function onGlobalPointerDown(event) {
    if (drawingEnabled) return;
    if (event.pointerType !== "pen") return;
    if (isOverlayUiTarget(event.target)) return;

    setDrawingEnabled(true);
    startStroke(event);
  }

    toggleBtn.addEventListener("click", function () {
      setDrawingEnabled(!drawingEnabled);
    });

    minimizeBtn.addEventListener("click", function () {
      setMinimized(!isMinimized);
    });

    eraserBtn.addEventListener("click", function () {
      setEraseMode(!erasing);
    });

    voiceBtn.addEventListener("click", async function () {
      if (isVoiceRecording && mediaRecorder) {
        try {
          mediaRecorder.stop();
        } catch (err) {
          setVoiceRecordingState(false);
          stopMediaStream();
        }
        return;
      }

      if (!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Voice recording is not supported in this browser.");
        return;
      }

      try {
        recordingForKey = currentStorageKey;
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaChunks = [];
        mediaRecorder.addEventListener("dataavailable", function (event) {
          if (event.data && event.data.size > 0) mediaChunks.push(event.data);
        });
        mediaRecorder.addEventListener("stop", function () {
          var blob = new Blob(mediaChunks, { type: mediaRecorder.mimeType || "audio/webm" });
          var reader = new FileReader();
          reader.onload = function () {
            addVoiceNoteFromData(String(reader.result || ""), recordingForKey || currentStorageKey);
          };
          reader.readAsDataURL(blob);
          setVoiceRecordingState(false);
          stopMediaStream();
          mediaRecorder = null;
          mediaChunks = [];
          recordingForKey = "";
        });
        mediaRecorder.start();
        setVoiceRecordingState(true);
      } catch (err) {
        setVoiceRecordingState(false);
        stopMediaStream();
      }
    });

    colorInput.addEventListener("input", function () {
      setColor(colorInput.value || "#e11d48");
    });

    swatches.forEach(function (swatch) {
      swatch.addEventListener("click", function () {
        setColor(swatch.getAttribute("data-color") || "#e11d48");
      });
    });

    clearBtn.addEventListener("click", function () {
      clearLayer();
      if (currentStorageKey) {
        localStorage.removeItem(currentStorageKey);
        removeCachePayload(currentStorageKey);
      }
    });

    layer.addEventListener("pointerdown", startStroke);
    window.addEventListener("pointermove", moveStroke, { passive: false });
    window.addEventListener("pointerup", endStroke, { passive: false });
    window.addEventListener("pointercancel", endStroke, { passive: false });
    window.addEventListener("pointerdown", onGlobalPointerDown, { capture: true, passive: false });

    var resizeTimer = null;
    function scheduleResizeAndSave() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        saveNow();
        resizeLayerIfNeeded();
        loadForCurrentKey();
        renderVoiceNotes();
      }, 220);
    }

    window.addEventListener("resize", scheduleResizeAndSave);
    window.addEventListener("beforeunload", saveNow);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) saveNow();
    });

    var mutationObs = new MutationObserver(function () {
      scheduleResizeAndSave();
      updateContext();
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });

    createLibraryLyneWidget();
    resizeLayerIfNeeded();
    updateContext();
    setScopeLabel();
    try {
      setColor(localStorage.getItem(prefColorKey) || "#e11d48");
      setMinimized(localStorage.getItem(prefMinKey) === "1");
    } catch (err) {
      setColor("#e11d48");
      setMinimized(false);
    }
    setDrawingEnabled(false);
    setEraseMode(false);
    setVoiceRecordingState(false);
    window.setInterval(updateContext, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
