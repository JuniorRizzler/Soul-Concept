(function () {
  const gradeLinks = [
    { label: "Grade 9", href: "grade-9-advanced.html" },
    { label: "Grade 10", href: "grade-10.html" },
    { label: "Grade 11", href: "grade-11.html" },
    { label: "Grade 12", href: "grade-12.html" }
  ];

  const blockedRoutes = new Set(["math-quiz-simulator.html"]);

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
    ["achievements", "achievements.html"],
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
    ["emoji_events", "achievements.html"],
    ["workspace_premium", "membership.html"],
    ["subscriptions", "membership.html"],
    ["card_membership", "membership.html"],
    ["payments", "membership.html"],
    ["grade", "grade-9-advanced.html"],
    ["account_circle", "settings.html"],
    ["person", "profile.html"],
    ["settings", "settings.html"],
    ["help_outline", "settings.html#support"]
  ]);

  const searchResources = [
    { title: "Dashboard Overview", type: "Section", description: "Your main overview, points, and study momentum.", href: "dashboard.html#overview", keywords: ["dashboard", "overview", "home", "main", "summary"] },
    { title: "Today's Flow", type: "Section", description: "Current study tasks and completed flow items.", href: "dashboard.html#todays-flow", keywords: ["today", "flow", "tasks", "checklist", "daily"] },
    { title: "Subject Galleries", type: "Section", description: "Browse active subject resources from the dashboard.", href: "dashboard.html#subject-galleries", keywords: ["subjects", "galleries", "subject galleries", "resources"] },
    { title: "Learning Insights", type: "Section", description: "See focus, retention, and learning metrics.", href: "dashboard.html#learning-insights", keywords: ["insights", "learning", "retention", "focus", "metrics"] },
    { title: "Upcoming Sessions", type: "Section", description: "Your next scheduled sessions and deadlines.", href: "dashboard.html#upcoming", keywords: ["upcoming", "sessions", "deadlines", "next"] },
    { title: "Study Scheduler", type: "Tool", description: "Plan, edit, and organize study sessions.", href: "schedule.html#overview", keywords: ["schedule", "scheduler", "calendar", "planner", "study schedule"] },
    { title: "Schedule Calendar", type: "Section", description: "Weekly calendar for adding and editing sessions.", href: "schedule.html#schedule-grid", keywords: ["calendar", "week", "weekly", "grid"] },
    { title: "Task Feed", type: "Section", description: "See your current BBK12 and study task feed.", href: "schedule.html#task-feed", keywords: ["task feed", "assignments", "bbk12", "feed"] },
    { title: "Grade 9 Library", type: "Library", description: "Browse the main Grade 9 subject libraries.", href: "grade-9.html", keywords: ["grade 9", "library", "subjects", "grade nine"] },
    { title: "Grade 9 Advanced", type: "Library", description: "Advanced Grade 9 subject showcase and reading.", href: "grade-9-advanced.html", keywords: ["grade 9 advanced", "advanced", "reading"] },
    { title: "Grade 10 Resources", type: "Library", description: "Grade 10 subject libraries and rotating features.", href: "grade-10.html", keywords: ["grade 10", "grade ten"] },
    { title: "Grade 11 Resources", type: "Library", description: "Grade 11 subjects and higher-level study routes.", href: "grade-11.html", keywords: ["grade 11", "grade eleven"] },
    { title: "Grade 12 Resources", type: "Library", description: "Grade 12 libraries and senior-level study tools.", href: "grade-12.html", keywords: ["grade 12", "grade twelve"] },
    { title: "Science Library", type: "Library", description: "Open the curated science study library.", href: "study-library.html", keywords: ["science", "biology", "chemistry", "physics", "laboratory"] },
    { title: "Geography Library", type: "Library", description: "Open geography and mapping resources.", href: "geography-library.html", keywords: ["geography", "maps", "environment", "geo"] },
    { title: "Grade 10 Math Library", type: "Library", description: "Open the Grade 10 mathematics library.", href: "grade-10-math.html", keywords: ["math", "mathematics", "grade 10 math", "algebra", "geometry", "functions"] },
    { title: "Grade 9 Math Library", type: "Library", description: "Open the Grade 9 mathematics route.", href: "math/index.html", keywords: ["math 9", "grade 9 math", "mathematics 9"] },
    { title: "Concept Cards", type: "Tool", description: "Study with concept cards and active recall.", href: "anki/index.html", keywords: ["cards", "concept cards", "flashcards", "anki", "review"] },
    { title: "Achievements", type: "Page", description: "Track points, badges, and progress milestones.", href: "achievements.html#badge-gallery", keywords: ["achievements", "badges", "points", "progress"] },
    { title: "Badge Gallery", type: "Section", description: "See unlocked and locked Soul Concept badges.", href: "achievements.html#badge-gallery", keywords: ["badges", "gallery", "achievement gallery"] },
    { title: "Analytics", type: "Page", description: "View your study analytics and insights.", href: "analytics.html", keywords: ["analytics", "analysis", "insights", "stats"] },
    { title: "Membership", type: "Page", description: "Manage your Soul Concept subscription.", href: "membership.html", keywords: ["membership", "subscription", "premium", "fellow"] },
    { title: "Settings", type: "Page", description: "Profile, support, and account settings.", href: "settings.html", keywords: ["settings", "profile", "account", "preferences"] },
    { title: "Support", type: "Section", description: "Get help and support inside settings.", href: "settings.html#support", keywords: ["support", "help", "contact"] }
  ];

  const searchSectionSelectors = {
    "dashboard.html": {
      overview: "main > .max-w-7xl, section",
      "todays-flow": "[data-dashboard-flow]",
      "subject-galleries": "[data-dashboard-subjects]",
      "learning-insights": "[data-dashboard-cognitive]",
      upcoming: "[data-dashboard-upcoming]"
    },
    "schedule.html": {
      overview: "main .px-8.pb-12",
      "schedule-grid": "[data-schedule-grid]",
      "task-feed": "[data-schedule-feed]"
    },
    "achievements.html": {
      "badge-gallery": "[data-achievements-grid]"
    }
  };

  function normalize(text) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }

  function isExamSimulatorNode(node) {
    if (!node) return false;
    const text = normalize(node.textContent || "");
    const href = normalize(node.getAttribute?.("href") || "");
    return text.includes("exam simulator") || href.includes("math-quiz-simulator.html");
  }

  function applySearchSectionAnchors() {
    const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const map = searchSectionSelectors[page];
    if (!map) return;
    Object.entries(map).forEach(([id, selector]) => {
      const node = document.querySelector(selector);
      if (node && !node.id) node.id = id;
    });
  }

  function findTarget(label) {
    const normalized = normalize(label || "");
    for (const [key, target] of routeMap.entries()) {
      if (normalized.includes(key)) return target;
    }
    return "";
  }

  function setHref(anchor) {
    if (isExamSimulatorNode(anchor)) {
      anchor.setAttribute("href", "#");
      return;
    }
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
    if (isExamSimulatorNode(node)) return "";
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
    if (!node || !target || blockedRoutes.has(target) || isExamSimulatorNode(node)) return;
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

  function blockExamSimulatorLinks() {
    document.querySelectorAll("a, button, [role='button'], .sc-shell-link, .sc-shell-iconbtn").forEach((node) => {
      if (!isExamSimulatorNode(node)) return;

      node.dataset.stitchExamBlocked = "true";
      node.setAttribute("aria-disabled", "true");
      if (node.tagName === "A") node.setAttribute("href", "#");
      node.style.pointerEvents = "none";
      node.style.cursor = "not-allowed";
      node.style.opacity = "0.5";
      node.style.filter = "grayscale(0.25)";
      node.style.position = "relative";

      const existingBadge = node.querySelector("[data-stitch-blocked-badge]");
      if (existingBadge && existingBadge.parentNode) {
        existingBadge.parentNode.removeChild(existingBadge);
      }
    });
  }

  function scoreSearchResource(query, resource) {
    const q = normalize(query || "");
    if (!q) return 0;
    const title = normalize(resource.title || "");
    const description = normalize(resource.description || "");
    const keywords = (resource.keywords || []).map(normalize);
    let score = 0;

    if (title === q) score += 160;
    if (keywords.includes(q)) score += 140;
    if (title.startsWith(q)) score += 90;
    if (title.includes(q)) score += 70;
    if (description.includes(q)) score += 24;
    keywords.forEach((keyword) => {
      if (keyword.startsWith(q)) score += 50;
      else if (keyword.includes(q)) score += 32;
    });

    const parts = q.split(" ").filter(Boolean);
    parts.forEach((part) => {
      if (title.includes(part)) score += 18;
      if (description.includes(part)) score += 6;
      keywords.forEach((keyword) => {
        if (keyword.includes(part)) score += 10;
      });
    });

    return score;
  }

  function isHeaderSearchInput(input) {
    if (!input || input.dataset.stitchSearchIgnore === "true") return false;
    const placeholder = normalize(input.getAttribute("placeholder") || "");
    const type = normalize(input.getAttribute("type") || "");
    const icon = input.parentElement?.querySelector(".material-symbols-outlined, [data-icon]");
    const iconToken = normalize(icon?.textContent || icon?.getAttribute("data-icon") || "");
    const inHeader = Boolean(input.closest("header, nav")) || input.getBoundingClientRect().top < 180;
    if (!inHeader) return false;
    if (placeholder.includes("search")) return true;
    if (type === "search") return true;
    return iconToken === "search";
  }

  function isNotificationIconToken(token) {
    const normalized = normalize(token || "");
    return normalized === "notifications" || normalized === "notifications active" || normalized === "notifications_active";
  }

  function buildSearchResultMarkup(resource, active) {
    return `
      <a class="stitch-search-result block rounded-[22px] px-4 py-3.5 transition-all ${active ? "bg-[linear-gradient(135deg,#004435,#215c4b)] text-white shadow-[0_18px_36px_rgba(0,68,53,0.2)]" : "border border-transparent bg-white/55 text-primary hover:border-[rgba(0,68,53,0.08)] hover:bg-white/88 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"}" href="${resource.href}" data-stitch-search-result="${resource.href}">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-2xl ${active ? "bg-white/12 text-white" : "bg-primary/6 text-primary"}">
                <span class="material-symbols-outlined text-[18px]">${resource.type === "Library" ? "library_books" : resource.type === "Section" ? "splitscreen" : "arrow_outward"}</span>
              </span>
              <p class="font-headline text-sm font-bold ${active ? "text-white" : "text-primary"}">${resource.title}</p>
            </div>
            <p class="mt-2 pl-10 text-xs leading-relaxed ${active ? "text-white/80" : "text-on-surface-variant"}">${resource.description}</p>
          </div>
          <span class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${active ? "bg-white/14 text-white" : "bg-primary/5 text-primary/70"}">${resource.type}</span>
        </div>
      </a>
    `;
  }

  function initHeaderSearches() {
    const inputs = Array.from(document.querySelectorAll("input")).filter(isHeaderSearchInput);
    if (!inputs.length) return;

    inputs.forEach((input) => {
      if (!input || input.dataset.stitchSearchBound === "true") return;
      input.dataset.stitchSearchBound = "true";

      const host = input.parentElement;
      if (!host) return;

      const panel = document.createElement("div");
      panel.className = "stitch-search-panel";
      panel.style.position = "fixed";
      panel.style.top = "0";
      panel.style.left = "0";
      panel.style.width = "min(460px, 90vw)";
      panel.style.maxHeight = "460px";
      panel.style.overflowY = "auto";
      panel.style.padding = "12px";
      panel.style.borderRadius = "28px";
      panel.style.border = "1px solid rgba(191, 201, 195, 0.22)";
      panel.style.background = "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,244,240,0.92))";
      panel.style.backdropFilter = "blur(22px)";
      panel.style.boxShadow = "0 24px 65px rgba(10,14,20,0.12)";
      panel.style.zIndex = "85";
      panel.style.display = "none";
      document.body.appendChild(panel);

      let results = [];
      let activeIndex = -1;

      function positionPanel() {
        const rect = input.getBoundingClientRect();
        const width = Math.min(Math.max(rect.width, 320), Math.min(460, window.innerWidth - 24));
        panel.style.width = width + "px";
        panel.style.left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + "px";
        panel.style.top = Math.min(rect.bottom + 12, window.innerHeight - panel.offsetHeight - 12) + "px";
      }

      function defaultResources() {
        return searchResources.slice(0, 7);
      }

      function computeResults() {
        const query = input.value || "";
        if (!normalize(query)) return defaultResources();
        return searchResources
          .map((resource) => ({ resource, score: scoreSearchResource(query, resource) }))
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title))
          .slice(0, 7)
          .map((entry) => entry.resource);
      }

      function renderPanel() {
        results = computeResults();
        if (activeIndex >= results.length) activeIndex = results.length - 1;
        if (activeIndex < -1) activeIndex = -1;
        if (!results.length) {
          panel.innerHTML = `
            <div class="rounded-[22px] border border-[rgba(0,68,53,0.08)] bg-white/65 px-5 py-5">
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-outline">Search</p>
              <p class="mt-2 font-headline text-base font-bold text-primary">No related resources found.</p>
              <p class="mt-1 text-sm leading-relaxed text-on-surface-variant">Try a library or section name like <span class="font-semibold text-primary">science</span>, <span class="font-semibold text-primary">schedule</span>, or <span class="font-semibold text-primary">concept cards</span>.</p>
            </div>
          `;
          return;
        }
        var heading = normalize(input.value || "")
          ? '<div class="flex items-center justify-between px-2 pb-2 pt-1"><p class="text-[10px] font-bold uppercase tracking-[0.24em] text-outline">Most Related Resources</p><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/60">' + results.length + ' Results</p></div>'
          : '<div class="flex items-center justify-between px-2 pb-2 pt-1"><p class="text-[10px] font-bold uppercase tracking-[0.24em] text-outline">Suggested Resources</p><p class="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/60">Quick Access</p></div>';
        panel.innerHTML = heading + '<div class="space-y-2">' + results.map((resource, index) => buildSearchResultMarkup(resource, index === activeIndex)).join("") + '</div>';
      }

      function setOpen(next) {
        panel.style.display = next ? "block" : "none";
        if (next) positionPanel();
      }

      input.addEventListener("focus", () => {
        activeIndex = -1;
        renderPanel();
        setOpen(true);
      });

      input.addEventListener("input", () => {
        activeIndex = -1;
        renderPanel();
        setOpen(true);
      });

      input.addEventListener("keydown", (event) => {
        if (panel.style.display !== "block" && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
          renderPanel();
          setOpen(true);
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          if (!results.length) return;
          activeIndex = Math.min(results.length - 1, activeIndex + 1);
          renderPanel();
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          if (!results.length) return;
          activeIndex = activeIndex <= 0 ? 0 : activeIndex - 1;
          renderPanel();
          return;
        }

        if (event.key === "Enter") {
          if (!results.length) return;
          event.preventDefault();
          const selected = results[activeIndex >= 0 ? activeIndex : 0];
          if (selected && selected.href) location.href = selected.href;
          return;
        }

        if (event.key === "Escape") {
          setOpen(false);
        }
      });

      panel.addEventListener("click", (event) => {
        const target = event.target.closest("[data-stitch-search-result]");
        if (!target) return;
        setOpen(false);
      });

      document.addEventListener("click", (event) => {
        if (!host.contains(event.target) && !panel.contains(event.target)) setOpen(false);
      });

      window.addEventListener("resize", () => {
        if (panel.style.display === "block") positionPanel();
      });

      window.addEventListener("scroll", () => {
        if (panel.style.display === "block") positionPanel();
      }, true);
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

  function currentStorageScope() {
    const profile = readNotificationProfile();
    return profile && profile.id ? "user:" + profile.id : "guest";
  }

  function scopedStorageKey(baseKey) {
    return baseKey + "::" + currentStorageScope();
  }

  function readScopedJson(baseKey, fallback) {
    try {
      const scopedKey = scopedStorageKey(baseKey);
      let raw = window.localStorage.getItem(scopedKey);
      if (raw == null) {
        raw = window.localStorage.getItem(baseKey);
        if (raw != null) window.localStorage.setItem(scopedKey, raw);
      }
      return raw ? JSON.parse(raw) : fallback;
    } catch (_err) {
      return fallback;
    }
  }

  function writeScopedJson(baseKey, value) {
    try {
      window.localStorage.setItem(scopedStorageKey(baseKey), JSON.stringify(value));
    } catch (_err) {}
  }

  function readScheduleEvents() {
    const parsed = readScopedJson("sc_schedule_events_v2", []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function readNotificationSeen() {
    return readScopedJson("sc_notifications_seen_v2", {});
  }

  function writeNotificationSeen(value) {
    writeScopedJson("sc_notifications_seen_v2", value || {});
  }

  function readNotificationDismissed() {
    return readScopedJson("sc_notifications_dismissed_v1", {});
  }

  function writeNotificationDismissed(value) {
    writeScopedJson("sc_notifications_dismissed_v1", value || {});
  }

  function minutesFromTime(value) {
    const parts = String(value || "00:00").split(":");
    return Number(parts[0] || 0) * 60 + Number(parts[1] || 0);
  }

  function buildEventDate(event) {
    if (!event || !event.date) return null;
    const base = new Date(event.date + "T00:00:00");
    if (Number.isNaN(base.getTime())) return null;
    const minutes = minutesFromTime(event.start);
    base.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    return base;
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function formatRelative(date) {
    const diffMinutes = Math.round((date.getTime() - Date.now()) / 60000);
    if (Math.abs(diffMinutes) < 1) return "Just now";
    if (diffMinutes > 0 && diffMinutes < 60) return "In " + diffMinutes + " mins";
    if (diffMinutes < 0 && diffMinutes > -60) return Math.abs(diffMinutes) + " mins ago";
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours > 0 && diffHours < 24) return "In " + diffHours + " hrs";
    if (diffHours < 0 && diffHours > -24) return Math.abs(diffHours) + " hrs ago";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  function deriveProgressStats() {
    const events = readScheduleEvents();
    const subjects = new Set();
    const activeDays = new Set();
    let focusCount = 0;
    let starredCount = 0;
    let points = 0;
    events.forEach((event) => {
      const subject = normalize((event.subject || event.title || ""));
      if (subject) subjects.add(subject);
      if (event.date) activeDays.add(event.date);
      if (event.starred) starredCount += 1;
      if (subject.includes("focus") || normalize(event.title || "").includes("deep work")) focusCount += 1;
    });
    points += events.length * 65;
    points += subjects.size * 90;
    points += activeDays.size * 55;
    points += focusCount * 40;
    points += starredCount * 25;
    return {
      sessionCount: events.length,
      subjectCount: subjects.size,
      activeDayCount: activeDays.size,
      focusCount: focusCount,
      starredCount: starredCount,
      points: points
    };
  }

  function buildNotificationItems() {
    const profile = readNotificationProfile();
    const events = readScheduleEvents()
      .map((event) => ({ event: event, date: buildEventDate(event) }))
      .filter((entry) => entry.date)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    const stats = deriveProgressStats();
    const now = new Date();
    const items = [];

    const activeSession = events.find((entry) => {
      const end = new Date(entry.date.getTime() + Math.max(30, minutesFromTime(entry.event.end) - minutesFromTime(entry.event.start)) * 60000);
      return entry.date <= now && end >= now;
    });
    const nextSession = events.find((entry) => entry.date > now);

    if (activeSession) {
      items.push({
        id: "active-session-" + activeSession.event.id,
        icon: "calendar_today",
        tone: "primary",
        title: "Current session in progress",
        body: activeSession.event.title + " is active now" + (activeSession.event.location ? " in " + activeSession.event.location : "") + ".",
        meta: "Live now",
        actionLabel: "Open schedule",
        actionHref: "schedule.html"
      });
    } else if (nextSession && (nextSession.date.getTime() - now.getTime()) <= 24 * 60 * 60 * 1000) {
      items.push({
        id: "next-session-" + nextSession.event.id,
        icon: "event_note",
        tone: "primary",
        title: "Upcoming study session",
        body: nextSession.event.title + " starts at " + formatTime(nextSession.date) + ".",
        meta: formatRelative(nextSession.date),
        actionLabel: "Open schedule",
        actionHref: "schedule.html"
      });
    }

    if (stats.focusCount > 0) {
      items.push({
        id: "focus-break-" + stats.focusCount + "-" + stats.activeDayCount,
        icon: "timer",
        tone: "primary",
        title: "Time for a reset",
        body: "You have logged " + stats.focusCount + " focus block" + (stats.focusCount === 1 ? "" : "s") + ". Take a short break and come back fresh.",
        meta: stats.focusCount > 1 ? "Focus streak active" : "Keep momentum steady",
        actionLabel: "Open focus schedule",
        actionHref: "schedule.html"
      });
    }

    if (profile && profile.email) {
      items.push({
        id: "account-ready-" + String(profile.email),
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
        id: "signin-reminder",
        icon: "person",
        tone: "secondary",
        title: "Sync your progress",
        body: "Sign into your account to back up your curator stack.",
        meta: "Sign-in reminder",
        actionLabel: "Sign In Now",
        actionHref: "auth/verification.html?returnTo=%2Findex.html&mode=returning&source=notification"
      });
    }

    if (stats.points >= 500) {
      const threshold = stats.points >= 2000 ? 2000 : stats.points >= 1000 ? 1000 : 500;
      items.push({
        id: "points-milestone-" + threshold,
        icon: "workspace_premium",
        tone: "primary",
        title: "Points milestone reached",
        body: "You have crossed " + threshold.toLocaleString() + " Soul Concept points.",
        meta: stats.points.toLocaleString() + " total points",
        actionLabel: "View achievements",
        actionHref: "achievements.html"
      });
    }

    if (!activeSession && !nextSession && now.getHours() >= 17) {
      items.push({
        id: "evening-reminder-" + now.toISOString().slice(0, 10),
        icon: "notifications_active",
        tone: "secondary",
        title: "No study block scheduled",
        body: "You do not have another session lined up today. Add one to keep your streak moving.",
        meta: "Evening reminder",
        actionLabel: "Add session",
        actionHref: "schedule.html"
      });
    }

    const dismissedMap = readNotificationDismissed();
    return items.filter((item) => !dismissedMap[item.id]).slice(0, 5);
  }

  function notificationItemMarkup(item) {
    const toneClass = item.tone === "secondary" ? "text-secondary/60 bg-secondary/5" : "text-primary/60 bg-primary/5";
    const actionMarkup = item.actionLabel && item.actionHref
      ? `<a class="mt-2.5 inline-flex text-[9px] font-black text-secondary uppercase tracking-widest hover:underline" href="${item.actionHref}">${item.actionLabel}</a>`
      : `<span class="mt-2.5 block font-label text-[9px] text-outline/60 uppercase tracking-wider">${item.meta}</span>`;

    return `
      <div class="border-b border-outline-variant/5 p-5 transition-colors hover:bg-white/60" data-stitch-notification-item="${item.id}">
        <div class="flex gap-4">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClass}">
            <span class="material-symbols-outlined text-xl">${item.icon}</span>
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex items-start justify-between gap-3">
              <p class="font-headline font-bold text-primary text-xs">${item.title}</p>
              <button class="text-outline/70 hover:text-primary transition-colors" data-stitch-notification-dismiss="${item.id}" type="button" aria-label="Dismiss notification">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
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
    const panel = widget._stitchNotificationPanel || document.getElementById(widget.getAttribute("data-stitch-notification-panel-id") || "");
    const list = panel ? panel.querySelector("[data-stitch-notification-list]") : widget.querySelector("[data-stitch-notification-list]");
    const badge = widget.querySelector("[data-stitch-notification-badge]");
    const seenMap = readNotificationSeen();
    const unreadCount = items.filter((item) => !seenMap[item.id]).length;
    if (list) list.innerHTML = items.map(notificationItemMarkup).join("");
    if (badge) {
      badge.textContent = String(unreadCount);
      badge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }
  }

  function updateEmbeddedNotificationShell(shell) {
    if (!shell) return;
    const items = buildNotificationItems();
    const list = shell.querySelector("[data-home-notifications-list]");
    const badge = shell.querySelector("[data-home-notifications-badge]");
    const count = shell.querySelector("[data-home-notifications-count]");
    const toggle = shell.querySelector("[data-home-notifications-toggle]");
    const clear = shell.querySelector("[data-stitch-notification-clear]") || Array.from(shell.querySelectorAll('button[type="button"]')).find((button) => normalize(button.textContent || "") === "clear");
    const seenMap = readNotificationSeen();
    const unreadCount = items.filter((item) => !seenMap[item.id]).length;

    if (list) list.innerHTML = items.map(notificationItemMarkup).join("");
    if (count) count.textContent = String(items.length);
    if (badge) {
      badge.textContent = String(unreadCount);
      badge.classList.toggle("hidden", unreadCount < 1);
      badge.style.display = unreadCount > 0 ? "" : "none";
    }
    if (toggle) toggle.setAttribute("aria-expanded", shell.querySelector("[data-home-notifications-panel]")?.style.display === "block" ? "true" : "false");
    if (clear && clear.dataset.stitchNotificationClearBound !== "true") {
      clear.dataset.stitchNotificationClearBound = "true";
      clear.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const nextSeen = readNotificationSeen();
        const nextDismissed = readNotificationDismissed();
        items.forEach((item) => { nextSeen[item.id] = Date.now(); });
        items.forEach((item) => { nextDismissed[item.id] = Date.now(); });
        writeNotificationSeen(nextSeen);
        writeNotificationDismissed(nextDismissed);
        updateEmbeddedNotificationShell(shell);
      });
    }
    if (list && list.dataset.stitchDismissBound !== "true") {
      list.dataset.stitchDismissBound = "true";
      list.addEventListener("click", (event) => {
        const dismiss = event.target.closest("[data-stitch-notification-dismiss]");
        if (!dismiss) return;
        event.preventDefault();
        event.stopPropagation();
        dismissNotificationById(dismiss.getAttribute("data-stitch-notification-dismiss"));
      });
    }
  }

  function dismissNotificationById(id) {
    if (!id) return;
    const seenMap = readNotificationSeen();
    const dismissedMap = readNotificationDismissed();
    seenMap[id] = Date.now();
    dismissedMap[id] = Date.now();
    writeNotificationSeen(seenMap);
    writeNotificationDismissed(dismissedMap);
    document.querySelectorAll(".stitch-notification-wrap").forEach(updateNotificationWidget);
    document.querySelectorAll("[data-home-notifications]").forEach(updateEmbeddedNotificationShell);
  }

  function initEmbeddedNotificationShells() {
    const shells = Array.from(document.querySelectorAll("[data-home-notifications]"));
    if (!shells.length) return;

    shells.forEach((shell) => {
      if (shell.dataset.stitchNotificationBound === "true") {
        updateEmbeddedNotificationShell(shell);
        return;
      }
      shell.dataset.stitchNotificationBound = "true";
      updateEmbeddedNotificationShell(shell);

      const toggle = shell.querySelector("[data-home-notifications-toggle]");
      const panel = shell.querySelector("[data-home-notifications-panel]");
      if (!toggle || !panel) return;
      toggle.removeAttribute("onclick");
      if (toggle.tagName === "A") toggle.setAttribute("href", "#");

      function setPanelOpen(next) {
        panel.style.display = next ? "block" : "none";
        panel.hidden = !next;
        panel.classList.toggle("hidden", !next);
        toggle.setAttribute("aria-expanded", next ? "true" : "false");
      }

      setPanelOpen(false);

      panel.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const isOpen = panel.style.display === "block";
        const next = !isOpen;
        setPanelOpen(next);
        if (next) {
          const seenMap = readNotificationSeen();
          buildNotificationItems().forEach((item) => { seenMap[item.id] = Date.now(); });
          writeNotificationSeen(seenMap);
        }
        window.setTimeout(() => updateEmbeddedNotificationShell(shell), 0);
      });

      document.addEventListener("click", (event) => {
        if (!shell.contains(event.target)) {
          setPanelOpen(false);
          window.setTimeout(() => updateEmbeddedNotificationShell(shell), 0);
        }
      });
    });
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
        return icon && isNotificationIconToken(icon.textContent || icon.getAttribute("data-icon") || "");
      });
    } catch (_err) {
      candidates = Array.from(document.querySelectorAll('[data-icon="notifications"], .material-symbols-outlined')).map((node) => node.closest("button, a") || node).filter((node, index, arr) => {
        if (!node || arr.indexOf(node) !== index) return false;
        if (node.closest("[data-home-notifications]")) return false;
        const text = normalize(node.textContent || node.getAttribute("data-icon") || "");
        return isNotificationIconToken(text) || text.includes("notifications");
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
      wrapper._stitchNotificationPanel = panel;
      const panelId = "stitch-notification-panel-" + Math.random().toString(36).slice(2, 10);
      panel.id = panelId;
      wrapper.setAttribute("data-stitch-notification-panel-id", panelId);
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
          const nextSeen = readNotificationSeen();
          const nextDismissed = readNotificationDismissed();
          buildNotificationItems().forEach((item) => { nextSeen[item.id] = Date.now(); });
          buildNotificationItems().forEach((item) => { nextDismissed[item.id] = Date.now(); });
          writeNotificationSeen(nextSeen);
          writeNotificationDismissed(nextDismissed);
          updateNotificationWidget(wrapper);
        });
      }

      panel.addEventListener("click", (event) => {
        const dismiss = event.target.closest("[data-stitch-notification-dismiss]");
        if (!dismiss) return;
        event.preventDefault();
        event.stopPropagation();
        dismissNotificationById(dismiss.getAttribute("data-stitch-notification-dismiss"));
        panel.style.display = "block";
        control.setAttribute("aria-expanded", "true");
        positionPanel();
      });

      control.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = panel.style.display !== "block";
        if (next) {
          panel.style.display = "block";
          positionPanel();
          const nextSeen = readNotificationSeen();
          buildNotificationItems().forEach((item) => { nextSeen[item.id] = Date.now(); });
          writeNotificationSeen(nextSeen);
          updateNotificationWidget(wrapper);
        } else {
          panel.style.display = "none";
        }
        control.setAttribute("aria-expanded", next ? "true" : "false");
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
      document.querySelectorAll("[data-home-notifications]").forEach(updateEmbeddedNotificationShell);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    blockExamSimulatorLinks();

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
    applySearchSectionAnchors();
    initHeaderSearches();
    initEmbeddedNotificationShells();
    initNotificationWidgets();
  });
})();
