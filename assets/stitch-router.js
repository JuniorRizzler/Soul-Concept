(function () {
  const gradeLinks = [
    { label: "Grade 9", href: "grade-9-advanced.html" },
    { label: "Grade 10", href: "grade-10.html" },
    { label: "Grade 11", href: "grade-11.html" },
    { label: "Grade 12", href: "grade-12.html" }
  ];

  const routeMap = new Map([
    ["dashboard", "dashboard.html"],
    ["overview", "dashboard.html"],
    ["home", "index.html"],
    ["library", "grade-9.html"],
    ["subjects", "grade-9.html"],
    ["subjects library", "grade-9.html"],
    ["subject library", "grade-9.html"],
    ["grades", "grade-9-advanced.html"],
    ["grade 9", "grade-9-advanced.html"],
    ["grade 10", "grade-10.html"],
    ["grade 11", "grade-11.html"],
    ["grade 12", "grade-12.html"],
    ["schedule", "schedule.html"],
    ["study scheduler", "schedule.html"],
    ["analytics", "analytics.html"],
    ["profile", "profile.html"],
    ["membership", "membership.html"],
    ["subscriptions", "membership.html"],
    ["settings", "settings.html"],
    ["concept cards", "anki/index.html"],
    ["view all", "grade-9.html"],
    ["view archive", "grade-9.html"],
    ["archives", "grade-9.html"],
    ["support", "settings.html#support"],
    ["help", "settings.html#support"],
    ["exam simulator", "math-quiz-simulator.html"],
    ["upgrade to fellow", "membership.html"],
    ["complete secure checkout", "membership.html"],
    ["read now", "study-library.html"]
  ]);

  const iconRouteMap = new Map([
    ["home", "index.html"],
    ["grid_view", "dashboard.html"],
    ["dashboard", "dashboard.html"],
    ["auto_stories", "grade-9.html"],
    ["subject", "grade-9.html"],
    ["book", "grade-9.html"],
    ["library_books", "grade-9.html"],
    ["import_contacts", "grade-9.html"],
    ["style", "grade-9.html"],
    ["analytics", "analytics.html"],
    ["insights", "analytics.html"],
    ["biotech", "research.html"],
    ["school", "curriculum.html"],
    ["event_note", "schedule.html"],
    ["calendar_today", "schedule.html"],
    ["schedule", "schedule.html"],
    ["timer", "schedule.html"],
    ["military_tech", "achievements.html"],
    ["trophy", "achievements.html"],
    ["workspace_premium", "membership.html"],
    ["subscriptions", "membership.html"],
    ["card_membership", "membership.html"],
    ["payments", "membership.html"],
    ["grade", "grade-9-advanced.html"],
    ["account_circle", "profile.html"],
    ["person", "profile.html"],
    ["settings", "settings.html"],
    ["quiz", "math-quiz-simulator.html"],
    ["model_training", "math-quiz-simulator.html"],
    ["help_outline", "settings.html#support"]
  ]);

  function normalize(text) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findTarget(label) {
    const normalized = normalize(label || "");
    for (const [key, target] of routeMap.entries()) {
      if (normalized.includes(key)) return target;
    }
    return "";
  }

  function setHref(anchor) {
    const href = anchor.getAttribute("href") || "";
    if (href === "library.html" || href === "/library.html") {
      anchor.setAttribute("href", "grade-9.html");
      return;
    }
    if (!href || href === "#" || href.includes("{{DATA:SCREEN:")) {
      const iconNode = anchor.querySelector(".material-symbols-outlined, [data-icon]");
      const target = findTarget(anchor.textContent || "") || getInteractiveTarget(iconNode || anchor);
      if (target) anchor.setAttribute("href", target);
    }
  }

  function getInteractiveTarget(node) {
    const text = normalize(node.textContent || "");
    if (text === "grades") return "grades";
    if (text) {
      const mapped = findTarget(text);
      if (mapped) return mapped;
    }
    const icon = normalize(node.getAttribute("data-icon") || "");
    if (iconRouteMap.has(icon)) return iconRouteMap.get(icon);
    const symbolIcon = normalize(node.textContent || "");
    if (iconRouteMap.has(symbolIcon)) return iconRouteMap.get(symbolIcon);
    return "";
  }

  function bindNavigationTarget(node, target) {
    if (!node || !target) return;
    if (node.dataset.stitchRouteBound === "true") return;
    node.dataset.stitchRouteBound = "true";
    node.style.cursor = "pointer";

    if (node.tagName === "A") {
      node.setAttribute("href", target);
      return;
    }

    node.addEventListener("click", () => {
      location.href = target;
    });
  }

  function wireShellNavigation() {
    document.querySelectorAll(".sc-shell-link, .sc-shell-iconbtn, .material-symbols-outlined, [data-icon]").forEach((node) => {
      const directTarget = getInteractiveTarget(node);
      if (directTarget) {
        bindNavigationTarget(node, directTarget);
        return;
      }

      const parentButton = node.closest("button, a");
      if (!parentButton || parentButton === node) return;
      const parentTarget = getInteractiveTarget(parentButton);
      if (parentTarget) bindNavigationTarget(parentButton, parentTarget);
    });
  }

  function resolveSubjectCardTarget(card) {
    const gradeText = normalize((card.querySelector(".font-label") || {}).textContent || "");
    const titleText = normalize((card.querySelector("h3") || {}).textContent || "");

    if (gradeText.includes("grade 9") && titleText.includes("mathematics")) return "math/index.html";
    if (gradeText.includes("grade 9") && titleText.includes("science")) return "study-library.html";
    if (gradeText.includes("grade 10") && titleText.includes("mathematics")) return "grade-10-math.html";
    if (gradeText.includes("grade 10") && titleText.includes("geography")) return "geography-library.html";
    if (gradeText.includes("grade 10")) return "grade-10.html";
    if (gradeText.includes("grade 11") && titleText.includes("geography")) return "geography-library.html";
    if (gradeText.includes("grade 11")) return "grade-11.html";
    if (gradeText.includes("grade 12")) return "grade-12.html";
    if (gradeText.includes("grade 9")) return "grade-9.html";
    return "";
  }

  function wireSubjectSections() {
    const page = (location.pathname.split("/").pop() || "").toLowerCase();

    if (page === "grade-9.html") {
      document.querySelectorAll("a.group\\/link, a[href='#']").forEach((anchor) => {
        const card = anchor.closest(".group.relative.flex.flex-col");
        if (!card) return;
        const target = resolveSubjectCardTarget(card);
        if (target) anchor.setAttribute("href", target);
      });
    }

    if (page === "dashboard.html") {
      const viewAll = Array.from(document.querySelectorAll("a")).find((anchor) => normalize(anchor.textContent || "").startsWith("view all"));
      if (viewAll) viewAll.setAttribute("href", "grade-9.html");

      const galleries = Array.from(document.querySelectorAll(".relative.h-48.rounded-3xl.overflow-hidden.group.cursor-pointer"));
      if (galleries[0]) galleries[0].addEventListener("click", () => { location.href = "grade-11.html"; });
      if (galleries[1]) galleries[1].addEventListener("click", () => { location.href = "study-library.html"; });
    }
  }

  function wireHomeLogo() {
    document.querySelectorAll("a, button, span, div, p").forEach((node) => {
      if (node.dataset.stitchHomeBound === "true") return;
      const text = normalize(node.textContent || "");
      if (text !== "soul concept") return;
      if (node.closest("main")) return;
      node.dataset.stitchHomeBound = "true";
      node.style.cursor = "pointer";
      node.addEventListener("click", () => {
        location.href = "index.html";
      });
    });
  }

  function buildGradesDropdown(anchor) {
    if (anchor.dataset.gradesDropdown === "true") return;

    const wrapper = document.createElement("span");
    wrapper.className = "stitch-grades-menu";
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";

    anchor.dataset.gradesDropdown = "true";
    anchor.setAttribute("href", "#");
    anchor.setAttribute("aria-haspopup", "true");
    anchor.setAttribute("aria-expanded", "false");

    const menu = document.createElement("div");
    menu.className = "stitch-grades-dropdown";
    menu.style.position = "absolute";
    menu.style.top = "calc(100% + 10px)";
    menu.style.left = "0";
    menu.style.minWidth = "160px";
    menu.style.padding = "8px";
    menu.style.border = "1px solid rgba(25, 20, 15, 0.12)";
    menu.style.background = "rgba(255,255,255,0.96)";
    menu.style.boxShadow = "0 18px 40px rgba(0,0,0,0.10)";
    menu.style.display = "none";
    menu.style.zIndex = "200";

    gradeLinks.forEach((grade) => {
      const item = document.createElement("a");
      item.href = grade.href;
      item.textContent = grade.label;
      item.style.display = "block";
      item.style.padding = "10px 12px";
      item.style.fontSize = "0.92rem";
      item.style.textDecoration = "none";
      item.style.color = "inherit";
      menu.appendChild(item);
    });

    const parent = anchor.parentNode;
    parent.insertBefore(wrapper, anchor);
    wrapper.appendChild(anchor);
    wrapper.appendChild(menu);

    let closeTimer = null;

    function clearCloseTimer() {
      if (!closeTimer) return;
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }

    function openMenu() {
      clearCloseTimer();
      menu.style.display = "block";
      anchor.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      menu.style.display = "none";
      anchor.setAttribute("aria-expanded", "false");
    }

    function scheduleCloseMenu() {
      clearCloseTimer();
      closeTimer = window.setTimeout(closeMenu, 220);
    }

    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      if (menu.style.display === "block") closeMenu();
      else openMenu();
    });

    wrapper.addEventListener("mouseenter", openMenu);
    wrapper.addEventListener("mouseleave", scheduleCloseMenu);
    menu.addEventListener("mouseenter", openMenu);
    menu.addEventListener("mouseleave", scheduleCloseMenu);
    document.addEventListener("click", (event) => {
      if (!wrapper.contains(event.target)) closeMenu();
    });
  }

  function readNotificationProfile() {
    if (window.scAuthProfile) return window.scAuthProfile;
    try {
      const raw = window.localStorage.getItem("sc_auth_profile_v1");
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  }

  function buildNotificationItems() {
    const profile = readNotificationProfile();
    const items = [
      {
        icon: "timer",
        tone: "primary",
        title: "Time for a zen break",
        body: "90 mins of deep focus reached. Stretch and hydrate.",
        meta: "Just now",
        actionLabel: "",
        actionHref: ""
      }
    ];

    if (profile && profile.email) {
      items.push({
        icon: "verified_user",
        tone: "primary",
        title: "Account synced",
        body: "Signed in as " + String(profile.email || ""),
        meta: "Account ready",
        actionLabel: "Open profile",
        actionHref: "settings.html"
      });
    } else {
      items.push({
        icon: "person",
        tone: "secondary",
        title: "Sync your progress",
        body: "Sign into your account to back up your curator stack.",
        meta: "Sign-in reminder",
        actionLabel: "Sign In Now",
        actionHref: "auth/verification.html?returnTo=%2Findex.html"
      });
    }

    items.push({
      icon: "workspace_premium",
      tone: "primary",
      title: "Research Badge Earned",
      body: "Top-tier analysis on Quantum Mechanics.",
      meta: "2 mins ago",
      actionLabel: "",
      actionHref: ""
    });

    return items;
  }

  function notificationItemMarkup(item) {
    const toneClass = item.tone === "secondary" ? "text-secondary/60 bg-secondary/5" : "text-primary/60 bg-primary/5";
    const actionMarkup = item.actionLabel && item.actionHref
      ? `<a class="mt-2.5 inline-flex text-[9px] font-black text-secondary uppercase tracking-widest hover:underline" href="${item.actionHref}">${item.actionLabel}</a>`
      : `<span class="mt-2.5 block font-label text-[9px] text-outline/60 uppercase tracking-wider">${item.meta}</span>`;

    return `
      <div class="border-b border-outline-variant/5 p-5 transition-colors hover:bg-white/60">
        <div class="flex gap-4">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClass}">
            <span class="material-symbols-outlined text-xl">${item.icon}</span>
          </div>
          <div class="flex-grow min-w-0">
            <p class="font-headline font-bold text-primary text-xs">${item.title}</p>
            <p class="mt-1 text-[10px] font-medium leading-relaxed text-on-surface-variant">${item.body}</p>
            ${actionMarkup}
          </div>
        </div>
      </div>
    `;
  }

  function buildNotificationPanel(items) {
    const panel = document.createElement("div");
    panel.className = "stitch-notification-panel";
    panel.style.position = "fixed";
    panel.style.left = "12px";
    panel.style.top = "72px";
    panel.style.width = "320px";
    panel.style.maxWidth = "min(92vw, 320px)";
    panel.style.background = "rgba(255, 255, 255, 0.85)";
    panel.style.backdropFilter = "blur(20px)";
    panel.style.border = "1px solid rgba(191, 201, 195, 0.2)";
    panel.style.borderRadius = "24px";
    panel.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.1)";
    panel.style.zIndex = "80";
    panel.style.overflow = "hidden";
    panel.style.display = "none";
    panel.innerHTML = `
      <div class="flex items-center justify-between border-b border-outline-variant/10 bg-white/50 p-5">
        <h4 class="font-headline text-[11px] font-bold uppercase tracking-widest text-primary/80">Recent Activity</h4>
        <button class="font-label text-[10px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary" type="button" data-stitch-notification-clear>Clear</button>
      </div>
      <div class="max-h-[440px] overflow-y-auto" data-stitch-notification-list>${items.map(notificationItemMarkup).join("")}</div>
    `;
    return panel;
  }

  function updateNotificationWidget(widget) {
    if (!widget) return;
    const items = buildNotificationItems();
    const list = widget.querySelector("[data-stitch-notification-list]");
    const badge = widget.querySelector("[data-stitch-notification-badge]");
    if (list) list.innerHTML = items.map(notificationItemMarkup).join("");
    if (badge) badge.textContent = String(items.length);
  }

  function initNotificationWidgets() {
    const selectors = [
      'button:has([data-icon="notifications"])',
      'a:has([data-icon="notifications"])',
      'button:has(.material-symbols-outlined)',
      'a:has(.material-symbols-outlined)'
    ];

    let candidates = [];
    try {
      candidates = Array.from(document.querySelectorAll(selectors.join(","))).filter((node) => {
        if (node.closest("[data-home-notifications]")) return false;
        const icon = node.querySelector('[data-icon="notifications"], .material-symbols-outlined');
        return icon && normalize(icon.textContent || icon.getAttribute("data-icon") || "") === "notifications";
      });
    } catch (_err) {
      candidates = Array.from(document.querySelectorAll('[data-icon="notifications"], .material-symbols-outlined')).map((node) => node.closest("button, a") || node).filter((node, index, arr) => {
        if (!node || arr.indexOf(node) !== index) return false;
        if (node.closest("[data-home-notifications]")) return false;
        const text = normalize(node.textContent || node.getAttribute("data-icon") || "");
        return text.includes("notifications");
      });
    }

    candidates.forEach((control) => {
      if (!control || control.dataset.stitchNotificationBound === "true") return;
      control.dataset.stitchNotificationBound = "true";
      control.removeAttribute("onclick");
      if (control.tagName === "A") control.setAttribute("href", "#");

      const wrapper = document.createElement("span");
      wrapper.className = "stitch-notification-wrap";
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-flex";
      wrapper.style.alignItems = "center";

      const badge = document.createElement("span");
      badge.className = "stitch-notification-badge";
      badge.setAttribute("data-stitch-notification-badge", "1");
      badge.textContent = String(buildNotificationItems().length);
      badge.style.position = "absolute";
      badge.style.top = "6px";
      badge.style.right = "6px";
      badge.style.minWidth = "16px";
      badge.style.height = "16px";
      badge.style.padding = "0 4px";
      badge.style.borderRadius = "999px";
      badge.style.background = "#ae3200";
      badge.style.color = "#ffffff";
      badge.style.fontSize = "10px";
      badge.style.fontWeight = "800";
      badge.style.lineHeight = "16px";
      badge.style.textAlign = "center";
      badge.style.border = "1px solid #ffffff";

      const panel = buildNotificationPanel(buildNotificationItems());

      const parent = control.parentNode;
      if (!parent) return;
      parent.insertBefore(wrapper, control);
      wrapper.appendChild(control);
      wrapper.appendChild(badge);
      document.body.appendChild(panel);

      function positionPanel() {
        const rect = control.getBoundingClientRect();
        const panelWidth = Math.min(320, Math.max(280, window.innerWidth - 24));
        panel.style.width = panelWidth + "px";
        panel.style.left = Math.max(12, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 12)) + "px";
        panel.style.top = Math.min(rect.bottom + 12, window.innerHeight - panel.offsetHeight - 12) + "px";
      }

      const clear = panel.querySelector("[data-stitch-notification-clear]");
      if (clear) {
        clear.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const list = panel.querySelector("[data-stitch-notification-list]");
          if (list) list.innerHTML = "";
          badge.style.display = "none";
        });
      }

      control.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = panel.style.display !== "block";
        if (next) {
          panel.style.display = "block";
          positionPanel();
        } else {
          panel.style.display = "none";
        }
        control.setAttribute("aria-expanded", next ? "true" : "false");
        if (next) badge.style.display = "none";
      });

      document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
          panel.style.display = "none";
          control.setAttribute("aria-expanded", "false");
        }
      });

      window.addEventListener("resize", () => {
        if (panel.style.display === "block") positionPanel();
      });
    });

    window.addEventListener("sc:auth-state-changed", () => {
      document.querySelectorAll(".stitch-notification-wrap").forEach(updateNotificationWidget);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a").forEach((anchor) => {
      setHref(anchor);
      if (normalize(anchor.textContent || "") === "grades") {
        buildGradesDropdown(anchor);
      }
    });

    document.querySelectorAll("button").forEach((button) => {
      const target = getInteractiveTarget(button);
      if (!target) return;
      if (target === "grades") {
        if (button.dataset.stitchRouteBound === "true") return;
        button.dataset.stitchRouteBound = "true";
        button.style.cursor = "pointer";
        button.addEventListener("click", () => {
          location.href = "grade-9-advanced.html";
        });
        return;
      }
      bindNavigationTarget(button, target);
    });

    document.querySelectorAll('[data-icon="account_circle"], [data-icon="settings"], [data-icon="person"], [data-icon="home"], [data-icon="grid_view"], [data-icon="style"], [data-icon="analytics"], [data-icon="insights"], [data-icon="timer"], [data-icon="school"], [data-icon="event_note"], [data-icon="calendar_today"], [data-icon="schedule"], [data-icon="military_tech"], [data-icon="workspace_premium"], [data-icon="library_books"], [data-icon="import_contacts"], [data-icon="grade"]').forEach((node) => {
      const button = node.closest("button");
      if (button) return;
      const target = getInteractiveTarget(node);
      if (!target) return;
      bindNavigationTarget(node, target);
    });

    wireShellNavigation();
    wireSubjectSections();
    wireHomeLogo();
    initNotificationWidgets();
  });
})();
