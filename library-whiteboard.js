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
    ".lib-anno-toolbar{position:fixed;right:12px;bottom:12px;z-index:2147483646;display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px;border-radius:14px;background:linear-gradient(135deg,rgba(15,23,42,.9),rgba(30,41,59,.86));backdrop-filter:blur(14px);border:1px solid rgba(148,163,184,.24);box-shadow:0 14px 30px rgba(2,6,23,.42)}",
    ".lib-anno-toolbar .lib-anno-btn,.lib-anno-toolbar input{border:1px solid rgba(148,163,184,.3);background:rgba(255,255,255,.95);color:#0f172a;border-radius:9px;padding:6px 8px;font:700 11px/1 Arial,sans-serif;cursor:pointer;transition:all .15s ease}",
    ".lib-anno-toolbar .lib-anno-btn:hover{transform:translateY(-1px)}",
    ".lib-anno-toolbar .lib-anno-btn.active{background:#dbeafe;border-color:#93c5fd;color:#1d4ed8}",
    ".lib-anno-toolbar .lib-anno-scope{color:#e2e8f0;font:700 10px/1 Arial,sans-serif;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 2px}",
    ".lib-anno-color-row{display:flex;align-items:center;gap:4px}",
    ".lib-anno-swatch{width:18px;height:18px;border-radius:999px;border:2px solid rgba(255,255,255,.25);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.3)}",
    ".lib-anno-swatch.active{outline:2px solid #fff;outline-offset:1px}",
    ".lib-anno-toolbar input[type='range']{width:76px;padding:0}",
    ".lib-anno-toolbar input[type='color']{padding:0;width:28px;height:24px}",
    ".lib-anno-toolbar.minimized{padding:7px 8px;gap:6px}",
    ".lib-anno-toolbar.minimized .lib-anno-hide-when-min{display:none}",
    ".lib-anno-layer{position:absolute;left:0;top:0;z-index:2147483645;pointer-events:none;touch-action:none;cursor:crosshair}",
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
    '<button type="button" class="lib-anno-btn" id="lib-anno-toggle">Notes Off</button>',
    '<button type="button" class="lib-anno-btn" id="lib-anno-minimize">Hide</button>',
    '<button type="button" class="lib-anno-btn lib-anno-hide-when-min" id="lib-anno-eraser">Erase</button>',
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

    var ctx = layer.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    var toggleBtn = document.getElementById("lib-anno-toggle");
    var minimizeBtn = document.getElementById("lib-anno-minimize");
    var eraserBtn = document.getElementById("lib-anno-eraser");
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
    var drawingCacheName = "soulconcept-drawings-v1";
    var prefColorKey = "lib-anno:pref:color";
    var prefMinKey = "lib-anno:pref:minimized";
    var isMinimized = false;

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
    return "lib-anno:v2:" + window.location.pathname + window.location.search + ":" + normalize(sectionName);
  }

    function setScopeLabel() {
    scopeEl.textContent = currentSectionName || "General";
    scopeEl.title = currentSectionName || "General";
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
    minimizeBtn.textContent = isMinimized ? "Show" : "Hide";
    try { localStorage.setItem(prefMinKey, isMinimized ? "1" : "0"); } catch (err) {}
  }

    function setDrawingEnabled(enabled) {
    drawingEnabled = !!enabled;
    layer.style.pointerEvents = drawingEnabled ? "auto" : "none";
    toggleBtn.textContent = drawingEnabled ? "Notes On" : "Notes Off";
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
    var doc = document.documentElement;
    var body = document.body;
    var width = Math.max(doc.clientWidth, body ? body.clientWidth : 0, window.innerWidth || 0, doc.scrollWidth, body ? body.scrollWidth : 0);
    var height = Math.max(doc.clientHeight, body ? body.clientHeight : 0, window.innerHeight || 0);

    if (body) {
      var kids = Array.prototype.slice.call(body.children);
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el === layer || el === toolbar) continue;
        var cs = window.getComputedStyle(el);
        if (cs.position === "fixed") continue;
        var rect = el.getBoundingClientRect();
        var bottom = rect.bottom + window.scrollY;
        if (bottom > height) height = bottom;
      }
    }

    layer.style.display = prevDisplay;
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
  }

    function pointFromEvent(event) {
    return { x: event.pageX, y: event.pageY };
  }

    function canStartStroke(event) {
    if (!drawingEnabled) return false;
    if (event.target && event.target.closest && event.target.closest(".lib-anno-toolbar")) return false;
    if (typeof event.button === "number" && event.button !== 0 && event.pointerType !== "pen") return false;
    return true;
  }

    function startStroke(event) {
    if (!canStartStroke(event)) return;
    updateContext();
    resizeLayerIfNeeded();

    activePointerId = event.pointerId;
    var pt = pointFromEvent(event);
    lastX = pt.x;
    lastY = pt.y;

    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.strokeStyle = colorInput.value || "#e11d48";
    ctx.lineWidth = erasing
      ? Math.max(12, Number(sizeInput.value || 4) * 2.5)
      : Number(sizeInput.value || 4);

    event.preventDefault();
  }

    function moveStroke(event) {
    if (activePointerId === null || event.pointerId !== activePointerId) return;
    var pt = pointFromEvent(event);

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
    if (event.target && event.target.closest && event.target.closest(".lib-anno-toolbar")) return;

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
    window.setInterval(updateContext, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
