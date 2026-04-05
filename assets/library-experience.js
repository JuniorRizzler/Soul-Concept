(() => {
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const gradePages = new Map([
    ["grade-9-advanced.html", { key: "grade-9", label: "Grade 9", href: "grade-9-advanced.html" }],
    ["grade-10.html", { key: "grade-10", label: "Grade 10", href: "grade-10.html" }],
    ["grade-11.html", { key: "grade-11", label: "Grade 11", href: "grade-11.html" }],
    ["grade-12.html", { key: "grade-12", label: "Grade 12", href: "grade-12.html" }],
    ["study-library.html", { key: "grade-9", label: "Grade 9", href: "grade-9-advanced.html" }],
    ["geography-library.html", { key: "grade-9", label: "Grade 9", href: "grade-9-advanced.html" }],
    ["grade-10-math.html", { key: "grade-10", label: "Grade 10", href: "grade-10.html" }]
  ]);
  const gradeRail = [
    { key: "grade-9", label: "Grade 9", href: "grade-9-advanced.html" },
    { key: "grade-10", label: "Grade 10", href: "grade-10.html" },
    { key: "grade-11", label: "Grade 11", href: "grade-11.html" },
    { key: "grade-12", label: "Grade 12", href: "grade-12.html" }
  ];
  const liveRouteCatalog = [
    { label: "All Libraries", href: "subject-library.html", keywords: ["library", "grade", "subject"] },
    { label: "Science", href: "study-library.html", keywords: ["science", "physics", "biology", "chemistry", "laboratory"] },
    { label: "Geography", href: "geography-library.html", keywords: ["geography", "map", "environment", "settlement"] },
    { label: "Math", href: "grade-10-math.html", keywords: ["math", "mathematics", "quadratic", "trigonometry", "geometry"] },
    { label: "Cards", href: "anki/index.html", keywords: ["cards", "review", "flashcards", "anki"] },
    { label: "Schedule", href: "schedule.html", keywords: ["schedule", "session", "planner", "calendar"] },
    { label: "Insights", href: "analytics.html", keywords: ["analytics", "insight", "progress"] }
  ];

  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function applyPageClass() {
    if (!document.body) return;
    if (
      page === "subject-library.html" ||
      gradePages.has(page) ||
      page === "subject-library-2.html"
    ) {
      document.body.classList.add("sc-library-page");
    }
  }

  function activateBottomNav() {
    const activeHref =
      page === "subject-library.html" ||
      page === "subject-library-2.html" ||
      gradePages.has(page)
        ? "subject-library.html"
        : "";
    if (!activeHref) return;
    document.querySelectorAll(".mobile-app-shell a, nav a").forEach((link) => {
      const href = (link.getAttribute("href") || "").trim();
      if (!href) return;
      if (href === activeHref) {
        link.setAttribute("data-active", "true");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function buildChip(label, href, isActive, muted) {
    const className = [
      "sc-library-chip",
      isActive ? "is-active" : "",
      muted ? "is-muted" : ""
    ].filter(Boolean).join(" ");
    return '<a class="' + className + '" href="' + href + '">' + label + "</a>";
  }

  function deriveLiveLinks(textBlob) {
    const normalized = normalize(textBlob);
    const matches = liveRouteCatalog.filter((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword))
    );
    if (!matches.length) {
      return liveRouteCatalog.slice(0, 4);
    }
    const unique = [];
    matches.forEach((match) => {
      if (!unique.some((item) => item.href === match.href)) {
        unique.push(match);
      }
    });
    if (!unique.some((item) => item.href === "subject-library.html")) {
      unique.unshift(liveRouteCatalog[0]);
    }
    return unique.slice(0, 4);
  }

  function insertGradeRail() {
    if (page === "study-library.html") return;
    const gradeMeta = gradePages.get(page);
    if (!gradeMeta) return;
    const main = document.querySelector("main[data-sidebar-main], main, body");
    if (!main || main.querySelector("[data-library-grade-rail]")) return;
    const anchor = main.querySelector("section, header, .hero, .unit-header, .mb-20, .mb-16, .mb-12, h1");
    if (!anchor) return;
    const summarySource = anchor.textContent || document.title || "";
    const liveLinks = deriveLiveLinks(summarySource);
    const rail = document.createElement("section");
    rail.className = "sc-library-rail";
    rail.setAttribute("data-library-grade-rail", "true");
    rail.innerHTML =
      '<div class="sc-library-rail-head">' +
        '<div class="sc-library-rail-copy">' +
          '<span class="sc-library-rail-kicker">Library System</span>' +
          '<h2 class="sc-library-rail-title">' + gradeMeta.label + ' study routes</h2>' +
          '<p class="sc-library-rail-summary">Use the same grade switcher and the same live-route shortcuts on every library page so movement between grades, subjects, cards, and planning stays predictable.</p>' +
        "</div>" +
      "</div>" +
      '<div class="sc-library-grade-row">' +
        gradeRail.map((item) => buildChip(item.label, item.href, item.key === gradeMeta.key, false)).join("") +
      "</div>" +
      '<div class="sc-library-live-row">' +
        liveLinks.map((item) => buildChip(item.label, item.href, false, item.href === "subject-library.html")).join("") +
      "</div>";
    anchor.insertAdjacentElement("afterend", rail);
  }

  function resolveLibraryRoute(text) {
    const value = normalize(text);
    if (!value) return "subject-library.html";
    if (value.includes("science") || value.includes("physics") || value.includes("chemistry") || value.includes("biology") || value.includes("laboratory")) {
      return "study-library.html";
    }
    if (value.includes("geography") || value.includes("map") || value.includes("environment")) {
      return "geography-library.html";
    }
    if (value.includes("math") || value.includes("mathematics") || value.includes("quadratic") || value.includes("trigonometry") || value.includes("geometry")) {
      return page === "grade-9-advanced.html" ? "math/index.html" : "grade-10-math.html";
    }
    if (value.includes("cards") || value.includes("review")) {
      return "anki/index.html";
    }
    if (value.includes("analytics") || value.includes("insights")) {
      return "analytics.html";
    }
    if (value.includes("schedule") || value.includes("session") || value.includes("planner")) {
      return "schedule.html";
    }
    return "subject-library.html";
  }

  function enhanceButtonsAndCards() {
    if (!(gradePages.has(page) || page === "subject-library-2.html")) return;
    const candidates = Array.from(document.querySelectorAll("button, .group.cursor-pointer, .group button, .group a, [data-rotating-link]"));
    candidates.forEach((node) => {
      if (!node || node.dataset.libraryRouteBound === "true") return;
      const isAnchor = node.tagName === "A";
      const currentHref = isAnchor ? (node.getAttribute("href") || "").trim() : "";
      if (isAnchor && currentHref && currentHref !== "#") {
        node.dataset.libraryRouteBound = "true";
        return;
      }
      const card = node.closest("section, article, div");
      const textBlob = [
        node.textContent,
        card && card.querySelector("h1, h2, h3, h4") ? card.querySelector("h1, h2, h3, h4").textContent : "",
        card && card.querySelector("p") ? card.querySelector("p").textContent : ""
      ].join(" ");
      const route = resolveLibraryRoute(textBlob);
      if (!route) return;
      node.dataset.libraryRouteBound = "true";
      if (isAnchor) {
        node.setAttribute("href", route);
        return;
      }
      node.style.cursor = "pointer";
      node.addEventListener("click", () => {
        location.href = route;
      });
    });
  }

  function initSubjectLibrary() {
    if (page !== "subject-library.html") return;
    const cards = Array.from(document.querySelectorAll("[data-subject-grid] > .group"));
    if (!cards.length) return;
    const gradeButtons = Array.from(document.querySelectorAll("[data-subject-grade-filter]"));
    const searchInput = document.querySelector("[data-subject-search]");
    const searchClearButton = document.querySelector("[data-subject-search-clear]");
    const searchResults = document.querySelector("[data-subject-search-results]");
    const emptyState = document.querySelector("[data-subject-empty-state]");
    const apDivider = document.querySelector('[data-subject-divider="ap"]');
    const STORAGE_KEY = "sc_subject_progress_v1";
    const gradeLabels = {
      "all-sections": "All Sections",
      "grade-9": "Grade 9",
      "grade-10": "Grade 10",
      "grade-11": "Grade 11",
      "grade-12": "Grade 12"
    };
    let activeGrade = "grade-9";

    function getScope() {
      try {
        const raw = localStorage.getItem("sc_auth_profile_v1");
        const profile = raw ? JSON.parse(raw) : null;
        return profile && profile.id ? "user:" + profile.id : "guest";
      } catch (_err) {
        return "guest";
      }
    }

    function loadProgressMap() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY + "::" + getScope());
        return raw ? JSON.parse(raw) : {};
      } catch (_err) {
        return {};
      }
    }

    const progressMap = loadProgressMap();

    function saveProgressMap() {
      try {
        localStorage.setItem(STORAGE_KEY + "::" + getScope(), JSON.stringify(progressMap));
      } catch (_err) {}
    }

    function setButtonState(button, isActive) {
      button.dataset.active = isActive ? "true" : "false";
      button.classList.toggle("bg-primary", isActive);
      button.classList.toggle("text-white", isActive);
      button.classList.toggle("bg-surface-container-high", !isActive);
      button.classList.toggle("text-on-surface-variant", !isActive);
      button.classList.toggle("hover:bg-surface-container-highest", !isActive);
    }

    function syncButtons() {
      gradeButtons.forEach((button) => {
        setButtonState(button, button.dataset.subjectGradeFilter === activeGrade);
      });
    }

    function getCardParts(card) {
      const body = card.querySelector(".p-8.flex.flex-col.flex-grow");
      const label = body ? body.querySelector(".font-label") : null;
      const title = body ? body.querySelector("h3") : null;
      const summary = body ? body.querySelector("p") : null;
      const footer = body ? body.querySelector(".flex.items-center.justify-between.mt-auto") : null;
      const actionLink = footer ? footer.querySelector("a") : null;
      return { body, label, title, summary, footer, actionLink };
    }

    function getCardHref(card, actionLink) {
      if (actionLink) {
        return (actionLink.getAttribute("href") || "").trim();
      }
      const onClick = card.getAttribute("onclick") || "";
      const hrefMatch = onClick.match(/window\.location\.href=['"]([^'"]+)['"]/i);
      return hrefMatch ? hrefMatch[1].trim() : "";
    }

    function getCardGradeKey(card) {
      const parts = getCardParts(card);
      const labelText = parts.label ? parts.label.textContent.trim().toLowerCase() : "";
      const match = labelText.match(/^grade\s*(9|10|11|12)/i);
      return match ? "grade-" + match[1] : "other";
    }

    function isApCard(card) {
      const parts = getCardParts(card);
      const labelText = parts.label ? parts.label.textContent.trim().toLowerCase() : "";
      return labelText.indexOf("ap exam") === 0;
    }

    function renderProgress(block, progress, hint) {
      const state = progress > 0 ? "started" : "not-started";
      block.innerHTML =
        '<div class="subject-progress-meta">' +
          '<span class="subject-progress-chip" data-state="' + state + '">' + (progress > 0 ? "Started" : "Not Started") + "</span>" +
          '<span class="subject-progress-value">' + progress + "% working</span>" +
        "</div>" +
        '<div class="subject-progress-track"><div class="subject-progress-fill" style="width:' + progress + '%"></div></div>' +
        '<div class="subject-progress-hint">' + hint + "</div>";
    }

    function buildUnavailableAction(link) {
      const replacement = document.createElement("span");
      replacement.className = "flex items-center gap-2 text-slate-400 font-bold";
      replacement.innerHTML = '<span class="font-body text-sm uppercase tracking-wider">Not Live Yet</span><span class="material-symbols-outlined text-sm">schedule</span>';
      link.replaceWith(replacement);
    }

    cards.forEach((card) => {
      const parts = getCardParts(card);
      if (!parts.body || !parts.label || !parts.title || !parts.summary || !parts.footer) return;
      const labelText = parts.label.textContent.trim();
      const titleText = parts.title.textContent.trim();
      const summaryText = parts.summary.textContent.trim();
      const href = getCardHref(card, parts.actionLink);
      const isLegacyHub = /^grade-\d/i.test(href);
      const hasLiveLibrary = !!href && href !== "#" && !isLegacyHub;
      if (isLegacyHub && parts.actionLink) {
        buildUnavailableAction(parts.actionLink);
      }
      if (isLegacyHub) {
        card.removeAttribute("onclick");
        card.style.cursor = "";
        card.addEventListener("click", (event) => {
          if (event.target && event.target.closest && event.target.closest(".subject-progress")) return;
          event.preventDefault();
          event.stopImmediatePropagation();
        }, true);
      }

      let progressBlock = parts.body.querySelector(".subject-progress");
      if (!progressBlock) {
        progressBlock = document.createElement("div");
        progressBlock.className = "subject-progress";
        progressBlock.setAttribute("role", "button");
        progressBlock.setAttribute("tabindex", "0");
        parts.footer.classList.remove("mt-auto");
        parts.body.insertBefore(progressBlock, parts.footer);
      }

      const progressKey = labelText + "::" + titleText;
      const progress = hasLiveLibrary ? Math.max(0, Math.min(100, Number(progressMap[progressKey] || 0))) : 0;
      renderProgress(progressBlock, progress, hasLiveLibrary ? "Click to update progress" : "Library not live yet");

      const updateProgress = () => {
        if (!hasLiveLibrary) return;
        const current = Number(progressMap[progressKey] || 0);
        const response = window.prompt('Enter progress for "' + titleText + '" from 0 to 100.', String(current));
        if (response == null) return;
        const next = Math.max(0, Math.min(100, Number(response)));
        if (Number.isNaN(next)) return;
        progressMap[progressKey] = next;
        saveProgressMap();
        renderProgress(progressBlock, next, "Click to update progress");
      };

      progressBlock.addEventListener("click", updateProgress);
      progressBlock.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          updateProgress();
        }
      });

      card.dataset.searchText = [labelText, titleText, summaryText, parts.footer.textContent.trim()].join(" ").toLowerCase();
      card.dataset.isApCard = isApCard(card) ? "true" : "false";

      if (hasLiveLibrary) {
        card.style.cursor = "pointer";
        card.addEventListener("click", (event) => {
          if (event.target && event.target.closest) {
            if (event.target.closest(".subject-progress") || event.target.closest("a")) return;
          }
          window.location.href = href;
        });
      }
    });

    function updateGradeView() {
      const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      const gradeLabel = gradeLabels[activeGrade] || "Selected grade";
      let visibleCount = 0;
      let hasVisibleApCards = false;
      cards.forEach((card) => {
        const matchesGrade = activeGrade === "all-sections" ? true : getCardGradeKey(card) === activeGrade;
        const matchesQuery = !query || (card.dataset.searchText || "").includes(query);
        const shouldShow = matchesGrade && matchesQuery;
        card.style.display = shouldShow ? "" : "none";
        if (shouldShow) {
          visibleCount += 1;
          if (card.dataset.isApCard === "true") hasVisibleApCards = true;
        }
      });

      if (apDivider) {
        apDivider.style.display = activeGrade === "all-sections" && hasVisibleApCards ? "" : "none";
      }
      if (searchClearButton) {
        searchClearButton.hidden = !query;
      }
      if (searchResults) {
        searchResults.textContent = query
          ? visibleCount + (visibleCount === 1 ? " subject" : " subjects") + " in " + gradeLabel + ' for "' + (searchInput ? searchInput.value.trim() : "") + '"'
          : activeGrade === "all-sections"
            ? "Showing all sections"
            : "Showing " + gradeLabel + " subjects";
      }
      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    }

    gradeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeGrade = button.dataset.subjectGradeFilter || "grade-9";
        syncButtons();
        updateGradeView();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", updateGradeView);
      searchInput.addEventListener("search", updateGradeView);
    }
    if (searchClearButton) {
      searchClearButton.addEventListener("click", () => {
        if (!searchInput) return;
        searchInput.value = "";
        updateGradeView();
        searchInput.focus();
      });
    }

    syncButtons();
    updateGradeView();
  }

  function init() {
    applyPageClass();
    activateBottomNav();
    insertGradeRail();
    enhanceButtonsAndCards();
    initSubjectLibrary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
