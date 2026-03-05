(function () {
  "use strict";

  var supportedPages = [
    "study-library.html",
    "geography-library.html",
    "grade-10-math.html",
    "preap-grade-10-preview.html"
  ];

  var currentPath = (window.location.pathname || "").toLowerCase();
  var isSupported = supportedPages.some(function (page) {
    return currentPath.indexOf(page) !== -1;
  });
  if (!isSupported) return;

  var style = document.createElement("style");
  style.textContent = [
    ".lib-wb-launch{position:fixed;right:16px;bottom:16px;z-index:2147483645;border:0;border-radius:999px;background:#0f172a;color:#fff;padding:10px 14px;font:700 12px/1.1 Arial,sans-serif;box-shadow:0 10px 25px rgba(2,6,23,.4);cursor:pointer}",
    ".lib-wb-panel{position:fixed;right:16px;bottom:64px;z-index:2147483646;width:min(92vw,460px);height:min(62vh,520px);background:#fff;border:1px solid #cbd5e1;border-radius:14px;box-shadow:0 20px 45px rgba(2,6,23,.35);display:none;overflow:hidden}",
    ".lib-wb-panel.open{display:flex;flex-direction:column}",
    ".lib-wb-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0}",
    ".lib-wb-title{font:700 13px/1.2 Arial,sans-serif;color:#0f172a;max-width:78%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".lib-wb-saved{font:600 11px/1 Arial,sans-serif;color:#334155}",
    ".lib-wb-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 12px;border-bottom:1px solid #e2e8f0;background:#fff}",
    ".lib-wb-tools button,.lib-wb-tools input,.lib-wb-head button{font:600 12px/1 Arial,sans-serif;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#0f172a;padding:6px 9px;cursor:pointer}",
    ".lib-wb-tools button.active{background:#e2e8f0}",
    ".lib-wb-tools input[type='range']{padding:0;width:110px}",
    ".lib-wb-tools input[type='color']{padding:0;border-radius:8px;height:30px;width:38px}",
    ".lib-wb-body{padding:10px;background:#f8fafc;flex:1;min-height:0}",
    ".lib-wb-canvas-wrap{height:100%;border:1px solid #cbd5e1;border-radius:10px;background:#fff;overflow:hidden}",
    ".lib-wb-canvas{display:block;width:100%;height:100%;touch-action:none;cursor:crosshair}",
    "@media (max-width:760px){.lib-wb-launch{right:10px;bottom:10px}.lib-wb-panel{right:10px;bottom:56px;height:min(58vh,460px)}}"
  ].join("");
  document.head.appendChild(style);

  var launchBtn = document.createElement("button");
  launchBtn.className = "lib-wb-launch";
  launchBtn.type = "button";
  launchBtn.textContent = "Section Whiteboard";

  var panel = document.createElement("div");
  panel.className = "lib-wb-panel";
  panel.innerHTML = [
    '<div class="lib-wb-head">',
    '  <div class="lib-wb-title" id="lib-wb-title">Whiteboard</div>',
    '  <div class="lib-wb-saved" id="lib-wb-saved">Ready</div>',
    '  <button type="button" id="lib-wb-close">Close</button>',
    "</div>",
    '<div class="lib-wb-tools">',
    '  <button type="button" id="lib-wb-pen" class="active">Pen</button>',
    '  <button type="button" id="lib-wb-eraser">Eraser</button>',
    '  <input type="color" id="lib-wb-color" value="#0f172a" aria-label="Pen color">',
    '  <input type="range" id="lib-wb-size" min="1" max="24" value="4" aria-label="Pen size">',
    '  <button type="button" id="lib-wb-clear">Clear</button>',
    "</div>",
    '<div class="lib-wb-body">',
    '  <div class="lib-wb-canvas-wrap">',
    '    <canvas class="lib-wb-canvas" id="lib-wb-canvas"></canvas>',
    "  </div>",
    "</div>"
  ].join("");

  document.body.appendChild(panel);
  document.body.appendChild(launchBtn);

  var titleEl = document.getElementById("lib-wb-title");
  var savedEl = document.getElementById("lib-wb-saved");
  var closeBtn = document.getElementById("lib-wb-close");
  var penBtn = document.getElementById("lib-wb-pen");
  var eraserBtn = document.getElementById("lib-wb-eraser");
  var colorInput = document.getElementById("lib-wb-color");
  var sizeInput = document.getElementById("lib-wb-size");
  var clearBtn = document.getElementById("lib-wb-clear");
  var canvas = document.getElementById("lib-wb-canvas");
  var ctx = canvas.getContext("2d", { alpha: false });

  var currentSectionKey = "";
  var currentSectionName = "";
  var isDrawing = false;
  var lastX = 0;
  var lastY = 0;
  var erasing = false;
  var saveTimer = null;

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
    if (rect.width === 0 || rect.height === 0) return "";
    return text;
  }

  function detectSectionName() {
    var overlay = document.getElementById("overlay");
    var modalTitle = document.getElementById("modal-title");
    if (overlay && overlay.classList.contains("active")) {
      var overlayTitle = getVisibleText(modalTitle);
      if (overlayTitle) return overlayTitle;
    }

    var crumb = document.querySelector("span.syne.text-sm.font-semibold.truncate.max-w-48");
    var crumbText = getVisibleText(crumb);
    if (crumbText) return crumbText;

    var backButtons = Array.prototype.slice.call(document.querySelectorAll("button"));
    var hasSectionView = backButtons.some(function (btn) {
      var label = (btn.textContent || "").trim();
      return label === "Back to Library" || label.indexOf("Back to ") === 0;
    });
    if (hasSectionView) {
      var headings = Array.prototype.slice.call(document.querySelectorAll("h1,h2"));
      for (var i = 0; i < headings.length; i++) {
        var hText = getVisibleText(headings[i]);
        if (!hText) continue;
        if (hText.length < 4 || hText.length > 120) continue;
        if (hText.toLowerCase().indexOf("ready to practice") !== -1) continue;
        return hText;
      }
    }

    var geoUnit = document.querySelector(".unit-title");
    var geoText = getVisibleText(geoUnit);
    if (geoText) return geoText;

    return document.title || "General";
  }

  function storageKey(sectionName) {
    return "lib-whiteboard:" + window.location.pathname + ":" + normalize(sectionName);
  }

  function fitCanvas() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    var width = Math.max(1, Math.floor(rect.width * dpr));
    var height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width === width && canvas.height === height) return;

    var snapshot = null;
    try {
      snapshot = canvas.toDataURL("image/png");
    } catch (err) {
      snapshot = null;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (snapshot) {
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = snapshot;
    }
  }

  function markSaved(text) {
    savedEl.textContent = text;
  }

  function saveNow() {
    if (!currentSectionKey) return;
    try {
      localStorage.setItem(currentSectionKey, canvas.toDataURL("image/png"));
      markSaved("Saved");
    } catch (err) {
      markSaved("Save failed");
    }
  }

  function scheduleSave() {
    markSaved("Saving...");
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveNow, 320);
  }

  function loadSection() {
    fitCanvas();
    if (!currentSectionKey) return;
    var dataUrl = localStorage.getItem(currentSectionKey);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!dataUrl) {
      markSaved("Ready");
      return;
    }
    var img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      markSaved("Loaded");
    };
    img.onerror = function () {
      markSaved("Ready");
    };
    img.src = dataUrl;
  }

  function updateSectionContext() {
    var sectionName = detectSectionName();
    var nextKey = storageKey(sectionName);
    if (nextKey === currentSectionKey) return;
    if (currentSectionKey && panel.classList.contains("open")) {
      saveNow();
    }
    currentSectionName = sectionName;
    currentSectionKey = nextKey;
    titleEl.textContent = "Whiteboard: " + currentSectionName;
    if (panel.classList.contains("open")) {
      loadSection();
    } else {
      markSaved("Ready");
    }
  }

  function setMode(isEraser) {
    erasing = isEraser;
    penBtn.classList.toggle("active", !erasing);
    eraserBtn.classList.toggle("active", erasing);
  }

  function getPoint(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function beginStroke(event) {
    updateSectionContext();
    isDrawing = true;
    var pt = getPoint(event);
    lastX = pt.x;
    lastY = pt.y;
    canvas.setPointerCapture(event.pointerId);
  }

  function drawStroke(event) {
    if (!isDrawing) return;
    var pt = getPoint(event);
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.strokeStyle = colorInput.value || "#0f172a";
    ctx.lineWidth = erasing ? Math.max(12, Number(sizeInput.value || 4) * 2.5) : Number(sizeInput.value || 4);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    lastX = pt.x;
    lastY = pt.y;
    markSaved("Drawing...");
  }

  function endStroke(event) {
    if (!isDrawing) return;
    isDrawing = false;
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch (err) {}
    scheduleSave();
  }

  launchBtn.addEventListener("click", function () {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) {
      updateSectionContext();
      fitCanvas();
      loadSection();
    }
  });

  closeBtn.addEventListener("click", function () {
    panel.classList.remove("open");
  });
  penBtn.addEventListener("click", function () {
    setMode(false);
  });
  eraserBtn.addEventListener("click", function () {
    setMode(true);
  });
  clearBtn.addEventListener("click", function () {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (currentSectionKey) localStorage.removeItem(currentSectionKey);
    markSaved("Cleared");
  });

  canvas.addEventListener("pointerdown", beginStroke);
  canvas.addEventListener("pointermove", drawStroke);
  canvas.addEventListener("pointerup", endStroke);
  canvas.addEventListener("pointercancel", endStroke);
  canvas.addEventListener("lostpointercapture", function () {
    isDrawing = false;
  });

  window.addEventListener("resize", function () {
    if (!panel.classList.contains("open")) return;
    var data = null;
    try {
      data = canvas.toDataURL("image/png");
    } catch (err) {}
    fitCanvas();
    if (data) {
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = data;
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) saveNow();
  });
  window.addEventListener("beforeunload", saveNow);

  updateSectionContext();
  window.setInterval(updateSectionContext, 900);
})();
