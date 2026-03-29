(() => {
  if (!document.getElementById("sc-shell-critical")) {
    const criticalStyle = document.createElement("style");
    criticalStyle.id = "sc-shell-critical";
    criticalStyle.textContent = `
      body:not(.sc-shell-ready) > * {
        opacity: 0;
      }

      body:not(.sc-shell-ready) {
        background: linear-gradient(180deg, #fffdfd 0%, #fef7ff 24%, #f6f0f8 100%);
      }
    `;
    document.head.appendChild(criticalStyle);
  }

  const tokenRoutes = {
    "{{DATA:SCREEN:SCREEN_5}}": "curation.html",
    "{{DATA:SCREEN:SCREEN_12}}": "membership.html",
    "{{DATA:SCREEN:SCREEN_13}}": "profile.html",
    "{{DATA:SCREEN:SCREEN_18}}": "settings.html",
    "{{DATA:SCREEN:SCREEN_21}}": "dashboard.html",
    "{{DATA:SCREEN:SCREEN_24}}": "research.html",
    "{{DATA:SCREEN:SCREEN_32}}": "discover.html",
    "{{DATA:SCREEN:SCREEN_33}}": "library.html",
    "{{DATA:SCREEN:SCREEN_37}}": "analytics.html"
  };

  const exactRoutes = new Map([
    ["home", "index.html"],
    ["discover", "discover.html"],
    ["dashboard", "dashboard.html"],
    ["overview", "dashboard.html"],
    ["library", "grade-9.html"],
    ["subjects", "grade-9.html"],
    ["subject library", "grade-9.html"],
    ["all subjects", "grade-9.html"],
    ["view libraries", "grade-9.html"],
    ["featured", "disciplines.html"],
    ["recent activity", "dashboard.html"],
    ["saved modules", "library.html"],
    ["research", "research.html"],
    ["network", "profile.html"],
    ["archive", "archive.html"],
    ["curation", "curation.html"],
    ["curations", "curation.html"],
    ["profile", "profile.html"],
    ["settings", "settings.html"],
    ["achievements", "achievements.html"],
    ["subscriptions", "membership.html"],
    ["membership", "membership.html"],
    ["insights", "analytics.html"],
    ["analytics", "analytics.html"],
    ["academic precision", "concept-academic-precision.html"],
    ["anthemis pro", "concept-anthemis-pro.html"],
    ["scholar vibrant", "concept-scholar-vibrant.html"],
    ["flashcards", "anki/index.html"],
    ["concept cards", "anki/index.html"],
    ["exam prep", "math-quiz-simulator.html"],
    ["quiz", "math-quiz-simulator.html"],
    ["open science", "study-library.html"],
    ["open geography", "geography-library.html"],
    ["open cards", "anki/index.html"],
    ["open quiz tool", "math-quiz-simulator.html"],
    ["open analytics", "analytics.html"],
    ["open math 9", "math/index.html"],
    ["open math 10", "grade-10-math.html"],
    ["support", "settings.html#support"],
    ["help center", "settings.html#support"],
    ["sign out", "dashboard.html"],
    ["sign in", "dashboard.html"],
    ["contact", "settings.html#support"],
    ["grade 8", "discover.html"],
    ["grade 9", "grade-9-advanced.html"],
    ["grade 10", "grade-10.html"],
    ["grade 11", "grade-11.html"],
    ["grade 12", "grade-12.html"],
    ["view all subjects", "grade-9.html"],
    ["start study session", "dashboard.html"],
    ["explore library", "grade-9.html"],
    ["enter library", "grade-9.html"],
    ["establish access", "dashboard.html"],
    ["view the manifesto", "discover.html"],
    ["request research assistant", "research.html"],
    ["upgrade to premium", "membership.html"],
    ["upgrade to fellow", "membership.html"],
    ["complete secure checkout", "membership.html"],
    ["deep dive", "analytics.html"],
    ["view archive", "archive.html"],
    ["clear completed", "dashboard.html"],
    ["terms of knowledge", "membership.html"],
    ["terms of research", "membership.html"],
    ["curator privacy", "settings.html"],
    ["privacy policy", "settings.html"],
    ["institutional access", "membership.html"],
    ["focus mode", "dashboard.html"],
    ["tutorial", "dashboard.html"]
  ]);

  const topLinks = [
    { href: "dashboard.html", label: "Dashboard" },
    { href: "grade-9.html", label: "Library" },
    { href: "grade-10.html", label: "Grades" },
    { href: "schedule.html", label: "Schedule" },
    { href: "analytics.html", label: "Analytics" }
  ];

  const sideLinks = [
    { href: "dashboard.html", label: "Overview", icon: "dashboard" },
    { href: "grade-9.html", label: "Subjects", icon: "library_books" },
    { href: "anki/index.html", label: "Concept Cards", icon: "style" },
    { href: "achievements.html", label: "Achievements", icon: "military_tech" },
    { href: "membership.html", label: "Subscriptions", icon: "credit_card" },
    { href: "math/auto-quiz.html", label: "Exam Simulator", icon: "quiz" },
    { href: "analytics.html", label: "Insights", icon: "insights" }
  ];

  const secondaryLinks = [
    { href: "settings.html", label: "Settings", icon: "settings" },
    { href: "settings.html#support", label: "Support", icon: "help" }
  ];

  const pageMeta = {
    "index.html": { title: "Home", kicker: "Soul Concept" },
    "discover.html": { title: "Discover", kicker: "Editorial Home" },
    "dashboard.html": { title: "Dashboard", kicker: "Scholar Workspace" },
    "library.html": { title: "Library", kicker: "Subject Collections" },
    "subjects.html": { title: "Subjects", kicker: "Library Index" },
    "subject-library-2.html": { title: "Subject Library", kicker: "Curated Disciplines" },
    "disciplines.html": { title: "Disciplines", kicker: "Academic Catalog" },
    "grade-9.html": { title: "Grade 9", kicker: "Core Modules" },
    "grade-9-alt.html": { title: "Grade 9 Studio", kicker: "Focused Library" },
    "grade-9-studio.html": { title: "Grade 9 Archive", kicker: "Subject View" },
    "grade-9-advanced.html": { title: "Advanced Library", kicker: "Flashcards" },
    "grade-10.html": { title: "Grade 10", kicker: "Expanded Curriculum" },
    "grade-11.html": { title: "Grade 11", kicker: "Upper School" },
    "grade-12.html": { title: "Grade 12", kicker: "Senior Modules" },
    "research.html": { title: "Research", kicker: "Repository" },
    "archive.html": { title: "Archive", kicker: "Manuscripts" },
    "archive-classic.html": { title: "Archive Classic", kicker: "Historical Collection" },
    "curation.html": { title: "Curation", kicker: "Editorial Console" },
    "analytics.html": { title: "Analytics", kicker: "Scholar Metrics" },
    "achievements.html": { title: "Achievements", kicker: "Scholar Profile" },
    "profile.html": { title: "Profile", kicker: "Academic Identity" },
    "settings.html": { title: "Settings", kicker: "Account Controls" },
    "membership.html": { title: "Membership", kicker: "Plans and Access" },
    "schedule.html": { title: "Planner", kicker: "Study Scheduler" },
    "curriculum.html": { title: "Curriculum", kicker: "Program Flow" },
    "concept-academic-precision.html": { title: "Academic Precision", kicker: "Design Concept" },
    "concept-anthemis-pro.html": { title: "Anthemis Pro", kicker: "Design Concept" },
    "concept-scholar-vibrant.html": { title: "Scholar Vibrant", kicker: "Design Concept" }
  };

  const pageCatalog = [
    { href: "dashboard.html", title: "Home", kicker: "Soul Concept", summary: "Open the live Soul Concept workspace instead of the legacy landing page.", keywords: ["home", "dashboard", "workspace", "knowledge"] },
    { href: "discover.html", title: "Discover", kicker: "Editorial Home", summary: "Browse featured knowledge paths and study tools.", keywords: ["discover", "featured", "manifesto"] },
    { href: "dashboard.html", title: "Dashboard", kicker: "Scholar Workspace", summary: "Track tasks, progress, and learning insights.", keywords: ["dashboard", "overview", "tasks", "flow"] },
    { href: "grade-9.html", title: "View Libraries", kicker: "Grade 9", summary: "Open the Grade 9 subject archive and library hub.", keywords: ["library", "subjects", "grade 9", "modules", "science", "geography", "math", "view libraries"] },
    { href: "grade-9.html", title: "Subject Library", kicker: "Grade 9", summary: "Open the dedicated Grade 9 subject archive page with its subject cards and links.", keywords: ["subjects", "all subjects", "subject library", "grade 9"] },
    { href: "research.html", title: "Research", kicker: "Repository", summary: "Search papers, authors, keywords, and DOI references.", keywords: ["research", "papers", "authors", "doi"] },
    { href: "analytics.html", title: "Analytics", kicker: "Scholar Metrics", summary: "Review growth, impact, mastery, and knowledge stream metrics.", keywords: ["analytics", "metrics", "impact", "growth"] },
    { href: "curation.html", title: "Curation", kicker: "Editorial Console", summary: "Manage saved artifacts and curated materials.", keywords: ["curation", "artifacts", "saved"] },
    { href: "archive.html", title: "Archive", kicker: "Manuscripts", summary: "Search archived material and references.", keywords: ["archive", "manuscripts", "history"] },
    { href: "membership.html", title: "Membership", kicker: "Plans and Access", summary: "Review access plans and institutional membership.", keywords: ["membership", "plans", "premium"] },
    { href: "settings.html", title: "Settings", kicker: "Account Controls", summary: "Update privacy, support, and notification controls.", keywords: ["settings", "privacy", "support"] },
    { href: "profile.html", title: "Profile", kicker: "Academic Identity", summary: "Manage profile and scholar identity details.", keywords: ["profile", "account", "identity"] },
    { href: "schedule.html", title: "Planner", kicker: "Study Scheduler", summary: "Plan tasks, curriculum, and focus sessions.", keywords: ["planner", "schedule", "calendar"] },
    { href: "study-library.html", title: "Science Library", kicker: "Grade 9 Science", summary: "Guided science notes, worksheets, annotation tools, and AI help.", keywords: ["grade 9", "science", "library", "annotation", "notes"] },
    { href: "geography-library.html", title: "Geography Library", kicker: "Grade 9 Geography", summary: "Geography study flow with review tools, focus support, and auth persistence.", keywords: ["geography", "library", "grade 9", "maps"] },
    { href: "grade-10-math.html", title: "Math Library", kicker: "Grade 10 Math", summary: "Structured Grade 10 math notes, practice, and quick navigation.", keywords: ["grade 10", "math", "practice"] },
    { href: "anki/index.html", title: "Concept Cards", kicker: "Flashcards", summary: "Spaced repetition flashcards for faster retention.", keywords: ["flashcards", "anki", "cards", "revision"] },
    { href: "math-quiz-simulator.html", title: "Quiz Tool", kicker: "Exam Prep", summary: "Generate timed quiz practice and exam-style checks.", keywords: ["quiz", "exam", "practice", "math"] },
    { href: "achievements.html", title: "Achievements", kicker: "Scholar Profile", summary: "Review milestones and achievement metrics.", keywords: ["achievements", "milestones", "impact"] }
  ];

  function normalize(text) {
    return (text || "")
      .replace(/\s+/g, " ")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .toLowerCase();
  }

  function ensureStylesheet() {
    if (document.querySelector('link[href="assets/site.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/site.css";
    document.head.appendChild(link);
  }

  function ensureFonts() {
    if (!document.querySelector('link[data-sc-fonts="preconnect-a"]')) {
      const preconnectA = document.createElement("link");
      preconnectA.rel = "preconnect";
      preconnectA.href = "https://fonts.googleapis.com";
      preconnectA.dataset.scFonts = "preconnect-a";
      document.head.appendChild(preconnectA);
    }

    if (!document.querySelector('link[data-sc-fonts="preconnect-b"]')) {
      const preconnectB = document.createElement("link");
      preconnectB.rel = "preconnect";
      preconnectB.href = "https://fonts.gstatic.com";
      preconnectB.crossOrigin = "anonymous";
      preconnectB.dataset.scFonts = "preconnect-b";
      document.head.appendChild(preconnectB);
    }

    if (document.querySelector('link[data-sc-fonts="main"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;700&display=swap";
    link.dataset.scFonts = "main";
    document.head.appendChild(link);
  }

  function hydrateIcons(root = document) {
    root.querySelectorAll(".material-symbols-outlined").forEach((icon) => {
      const dataIcon = icon.dataset.icon;
      if (dataIcon && !icon.textContent.trim()) {
        icon.textContent = dataIcon;
      }
      if (icon.textContent.includes("Ã¢")) {
        icon.textContent = dataIcon || "circle";
      }
    });
  }

  function routeFromKeyword(text) {
    const label = normalize(text);
    if (!label) return "";
    if (exactRoutes.has(label)) return exactRoutes.get(label);
    if (label.includes("science")) return "study-library.html";
    if (label.includes("geography")) return "geography-library.html";
    if (label.includes("mathematics") || label.includes("math 10")) return "grade-10-math.html";
    if (label.includes("math 9")) return "math/index.html";
    if (label.includes("math")) return "math/index.html";
    if (label.includes("flashcard") || label.includes("cards")) return "anki/index.html";
    if (label.includes("quiz")) return "math-quiz-simulator.html";
    if (label.includes("history")) return "curriculum.html";
    if (label.includes("research")) return "research.html";
    if (label.includes("archive")) return "archive.html";
    if (label.includes("analytics")) return "analytics.html";
    if (label.includes("profile")) return "profile.html";
    if (label.includes("settings")) return "settings.html";
    if (label.includes("membership") || label.includes("premium") || label.includes("checkout")) return "membership.html";
    if (label.includes("scheduler") || label.includes("calendar") || label.includes("plan")) return "schedule.html";
    if (label.includes("curriculum")) return "curriculum.html";
    return "";
  }

  function contextualRoute(el) {
    const ownText = el.getAttribute("aria-label") || el.textContent || "";
    let route = routeFromKeyword(ownText);
    if (route) return route;
    const card = el.closest("article, section, div");
    if (!card) return "";
    const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
    route = routeFromKeyword(heading && heading.textContent);
    return route || "";
  }

  function replaceTokens(value) {
    let next = value || "";
    Object.entries(tokenRoutes).forEach(([token, route]) => {
      next = next.split(token).join(route);
    });
    return next;
  }

  function setButtonRoute(button, route) {
    if (!route) return;
    button.dataset.route = route;
    button.addEventListener("click", () => {
      window.location.href = route;
    });
  }

  function wireRoutes() {
    const genericTargets = ["library.html", "research.html", "dashboard.html", "discover.html", "schedule.html"];

    document.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href");
      const route = contextualRoute(anchor);
      if (href && href.includes("{{DATA:SCREEN:")) {
        anchor.setAttribute("href", replaceTokens(href));
      } else if (route && genericTargets.includes(href || "")) {
        anchor.setAttribute("href", route);
      } else if (!href || href === "#" || href === "") {
        anchor.setAttribute("href", route || "dashboard.html");
      }
    });

    document.querySelectorAll("button").forEach((button) => {
      const onclick = button.getAttribute("onclick");
      const route = contextualRoute(button);
      if (onclick && onclick.includes("{{DATA:SCREEN:")) {
        button.setAttribute("onclick", replaceTokens(onclick));
      } else if (route && onclick && genericTargets.some((target) => onclick.includes(target))) {
        button.setAttribute("onclick", `window.location.href='${route}'`);
      } else if (!onclick && route) {
        setButtonRoute(button, route);
      }
    });

    document.querySelectorAll("[onclick]").forEach((node) => {
      const onclick = node.getAttribute("onclick");
      if (onclick && onclick.includes("{{DATA:SCREEN:")) {
        node.setAttribute("onclick", replaceTokens(onclick));
      }
    });
  }

  function currentPath() {
    const value = window.location.pathname.split("/").pop();
    if (!value || value === "analytics-overview.html") return "analytics.html";
    return value;
  }

  function shellHref(target) {
    const path = String(window.location.pathname || "").toLowerCase();
    if (path.includes("/anki/") || path.includes("/math/") || path.includes("/auth/")) {
      return "../" + String(target || "").replace(/^\/+/, "");
    }
    return String(target || "").replace(/^\/+/, "");
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function pageCardData(node, fallbackIndex = 0) {
    const title = (node.querySelector("h3, h4, h5, h6")?.textContent || `Item ${fallbackIndex + 1}`).trim();
    const kicker = (node.querySelector("span")?.textContent || "").trim();
    const description = (node.querySelector("p")?.textContent || "").trim();
    return {
      title,
      kicker,
      description,
      text: normalize([title, kicker, description].join(" "))
    };
  }

  function searchCatalog(query) {
    const normalized = normalize(query);
    if (!normalized) return [];
    return pageCatalog
      .map((page) => {
        const haystack = normalize([page.title, page.kicker, page.summary, ...(page.keywords || [])].join(" "));
        const exactScore = haystack.includes(normalized) ? 3 : 0;
        const tokenScore = normalized.split(" ").reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
        return { ...page, score: exactScore + tokenScore };
      })
      .filter((page) => page.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 6);
  }

  function buildSearchPanel() {
    const panel = document.createElement("div");
    panel.className = "sc-search-panel sc-is-hidden";
    panel.setAttribute("role", "listbox");
    return panel;
  }

  function findPrimarySearchInput() {
    return Array.from(document.querySelectorAll('input[type="text"]'))
      .find((input) => /search|keywords|authors|doi/i.test(input.placeholder || ""));
  }

  function activeMatch(href, pathname) {
    if (pathname === "index.html" && href === "dashboard.html") return true;
    if (href === pathname) return true;
    if (href === "grade-9.html" && ["study-library.html", "geography-library.html", "grade-9-advanced.html"].includes(pathname)) return true;
    if (href === "grade-10.html" && ["grade-10-math.html", "grade-11.html", "grade-12.html"].includes(pathname)) return true;
    if (href === "membership.html" && pathname === "settings.html") return false;
    if (href === "math/auto-quiz.html" && pathname === "auto-quiz.html") return true;
    if (href === "anki/index.html" && pathname === "index.html" && window.location.pathname.toLowerCase().includes("/anki/")) return true;
    return false;
  }

  function buildShell() {
    const pathname = currentPath();

    const topLinksHtml = topLinks
      .map((item) => `<a href="${shellHref(item.href)}"${activeMatch(item.href, pathname) ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`)
      .join("");

    const sideLinksHtml = sideLinks
      .map((item) => `<a class="sc-shell-link" href="${shellHref(item.href)}" data-active="${activeMatch(item.href, pathname)}"><span class="material-symbols-outlined">${item.icon}</span><span>${escapeHtml(item.label)}</span></a>`)
      .join("");

    const secondaryLinksHtml = secondaryLinks
      .map((item) => `<a class="sc-shell-link" href="${shellHref(item.href)}" data-active="${activeMatch(item.href, pathname)}"><span class="material-symbols-outlined">${item.icon}</span><span>${escapeHtml(item.label)}</span></a>`)
      .join("");

    const shell = document.createElement("div");
    shell.innerHTML = `
      <div class="sc-shell-scrim" data-sc-shell-close></div>
      <aside class="sc-shell-sidebar" aria-label="Primary navigation">
        <div class="sc-shell-sidebar-head">
          <span aria-hidden="true"></span>
          <button class="sc-shell-iconbtn sc-shell-close" type="button" aria-label="Close navigation" data-sc-shell-close>
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav class="sc-shell-nav">${sideLinksHtml}</nav>
        <div class="sc-shell-sidebar-foot">
          <nav class="sc-shell-nav-secondary">${secondaryLinksHtml}</nav>
        </div>
      </aside>
      <header class="sc-shell-topbar">
        <div class="sc-shell-topbar-left">
          <button class="sc-shell-iconbtn sc-shell-toggle" type="button" aria-label="Open navigation" data-sc-shell-open>
            <span class="material-symbols-outlined">menu</span>
          </button>
          <a class="sc-shell-brand sc-shell-brand-top" href="${shellHref("index.html")}">
            <span class="sc-shell-brandtext">Soul Concept</span>
          </a>
          <nav class="sc-shell-toplinks">${topLinksHtml}</nav>
        </div>
        <div class="sc-shell-actions">
          <label class="sc-shell-search" aria-label="Search knowledge">
            <span class="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search knowledge..." />
          </label>
          <button class="sc-shell-iconbtn" type="button" aria-label="Notifications">
            <span class="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <a class="sc-shell-iconbtn" href="${shellHref("profile.html")}" aria-label="Profile">
            <span class="material-symbols-outlined">account_circle</span>
          </a>
        </div>
      </header>
    `;

    document.body.prepend(shell);
    hydrateIcons(shell);

    shell.querySelectorAll("[data-sc-shell-open]").forEach((button) => {
      button.addEventListener("click", () => document.body.classList.add("sc-shell-open"));
    });
    shell.querySelectorAll("[data-sc-shell-close]").forEach((button) => {
      button.addEventListener("click", () => document.body.classList.remove("sc-shell-open"));
    });

  }

  function hideLegacyShell() {
    const legacy = new Set();
    document.querySelectorAll("body > header, body > nav, body > aside").forEach((node) => legacy.add(node));
    document.querySelectorAll("body > footer").forEach((node) => legacy.add(node));
    document.querySelectorAll("body > div").forEach((node) => {
      const hasMainChild = Array.from(node.children).some((child) => child.tagName === "MAIN");
      if (!hasMainChild) return;
      Array.from(node.children).forEach((child) => {
        if (["HEADER", "NAV", "ASIDE", "FOOTER"].includes(child.tagName)) {
          legacy.add(child);
        }
      });
    });
    legacy.forEach((node) => node.classList.add("sc-legacy-shell"));
  }

  function cleanupLayout() {
    const main = document.querySelector("main");
    if (main) {
      main.style.marginLeft = "0";
      main.style.paddingTop = "0";
    }

    const wrapper = main && main.parentElement;
    if (wrapper && wrapper !== document.body && wrapper.children.length <= 3) {
      const hasLegacyAside = Array.from(wrapper.children).some((child) => child.classList && child.classList.contains("sc-legacy-shell"));
      if (hasLegacyAside) {
        wrapper.style.paddingTop = "0";
      }
    }
  }

  function addMotionOrbs() {
    const layer = document.createElement("div");
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = `
      <div class="sc-motion-orb sc-motion-orb-a"></div>
      <div class="sc-motion-orb sc-motion-orb-b"></div>
    `;
    document.body.prepend(layer);
  }

  function setupRevealAnimations() {
    const selectors = [
      "main > section",
      "main > div",
      "section > div",
      "article",
      "[class*='card']",
      "[class*='panel']",
      "[class*='rounded-2xl']",
      "[class*='rounded-3xl']"
    ];
    const seen = new Set();
    let order = 0;

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => {
        if (seen.has(node)) return;
        if (node.closest(".sc-shell-sidebar, .sc-shell-topbar")) return;
        seen.add(node);
        node.setAttribute("data-sc-reveal", order % 3 === 0 ? "left" : order % 3 === 1 ? "right" : "zoom");
        node.style.setProperty("--sc-delay", `${Math.min(order * 45, 280)}ms`);
        order += 1;
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll("[data-sc-reveal]").forEach((node) => observer.observe(node));
  }

  function setupTiltCards() {
    const tiltTargets = [
      ...document.querySelectorAll("article"),
      ...document.querySelectorAll("[class*='rounded-2xl']"),
      ...document.querySelectorAll("[class*='rounded-3xl']")
    ];

    tiltTargets.forEach((node) => {
      if (node.closest(".sc-shell-sidebar, .sc-shell-topbar")) return;
      if (node.offsetWidth < 180 || node.offsetHeight < 100) return;
      node.setAttribute("data-sc-tilt", "");

      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * 7;
        const ry = (px - 0.5) * 9;
        node.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      node.addEventListener("pointerleave", () => {
        node.style.transform = "";
      });
    });
  }

  function setupProgressAnimations() {
    document.querySelectorAll(".h-full[class*='w-']").forEach((node) => {
      const parent = node.parentElement;
      if (!parent || !parent.className.includes("overflow-hidden")) return;
      parent.setAttribute("data-sc-progress", "");
    });
  }

  function setupHeroParallax() {
    const hero = document.querySelector("main section");
    if (!hero) return;
    hero.setAttribute("data-sc-hero", "");

    const targets = [
      ...hero.querySelectorAll("img"),
      ...hero.querySelectorAll("[class*='blur-3xl']"),
      ...hero.querySelectorAll("[class*='glass-header']"),
      ...hero.querySelectorAll("[class*='editorial-shadow']")
    ].slice(0, 4);

    targets.forEach((node) => node.setAttribute("data-sc-parallax", ""));

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targets.forEach((node, index) => {
        const depth = (index + 1) * 7;
        node.style.transform = `translate3d(${px * depth}px, ${py * depth * -1}px, 0)`;
      });
    });

    hero.addEventListener("pointerleave", () => {
      targets.forEach((node) => {
        node.style.transform = "";
      });
    });
  }

  function setupGlobalSearch() {
    const inputs = Array.from(document.querySelectorAll('input[type="text"]'))
      .filter((input) => /search|keywords|authors|doi/i.test(input.placeholder || ""));

    inputs.forEach((input) => {
      const wrapper = input.parentElement;
      if (!wrapper) return;
      wrapper.classList.add("sc-search-anchor");
      const panel = buildSearchPanel();
      wrapper.appendChild(panel);

      const renderPanel = (query) => {
        const trimmed = query.trim();
        if (!trimmed) {
          panel.innerHTML = "";
          panel.classList.add("sc-is-hidden");
          return;
        }

        const results = searchCatalog(trimmed);
        if (!results.length) {
          panel.innerHTML = `<div class="sc-search-empty">No direct page match found. Keep typing to filter this page.</div>`;
          panel.classList.remove("sc-is-hidden");
          return;
        }

        panel.innerHTML = results.map((result) => `
          <a class="sc-search-item" href="${result.href}" role="option">
            <span class="sc-search-kicker">${escapeHtml(result.kicker)}</span>
            <span class="sc-search-title">${escapeHtml(result.title)}</span>
            <span class="sc-search-meta">${escapeHtml(result.summary)}</span>
          </a>
        `).join("");
        panel.classList.remove("sc-is-hidden");
      };

      input.addEventListener("input", () => renderPanel(input.value));
      input.addEventListener("focus", () => renderPanel(input.value));
      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          panel.classList.add("sc-is-hidden");
          return;
        }
        if (event.key === "Enter") {
          const first = panel.querySelector("a");
          if (first) {
            event.preventDefault();
            window.location.href = first.getAttribute("href");
          }
        }
      });

      document.addEventListener("click", (event) => {
        if (!wrapper.contains(event.target)) {
          panel.classList.add("sc-is-hidden");
        }
      });
    });
  }

  function setupLibraryInteractions() {
    if (currentPath() !== "library.html") return;
    const searchInput = document.querySelector('input[placeholder*="disciplines"], input[placeholder*="modules"]');
    const filterButton = Array.from(document.querySelectorAll("button")).find((button) => button.textContent.includes("filter_list"));
    const sortButton = Array.from(document.querySelectorAll("button")).find((button) => button.textContent.includes("sort_by_alpha"));
    const grid = Array.from(document.querySelectorAll("main .grid")).find((node) => node.querySelector("h3"));
    if (!searchInput || !grid) return;

    const cards = Array.from(grid.children).filter((node) => node.querySelector("h3"));
    const featuredTitles = new Set(["Sciences", "Mathematics", "Humanities"]);
    const state = { query: "", filter: "all", sort: "default" };

    cards.forEach((card, index) => {
      const data = pageCardData(card, index);
      card.dataset.scIndex = String(index);
      card.dataset.scTitle = data.title;
      card.dataset.scText = data.text;
      if (featuredTitles.has(data.title)) card.dataset.scFeatured = "true";
    });

    const render = () => {
      const ordered = [...cards].sort((a, b) => {
        if (state.sort === "alpha") {
          return (a.dataset.scTitle || "").localeCompare(b.dataset.scTitle || "");
        }
        return Number(a.dataset.scIndex) - Number(b.dataset.scIndex);
      });

      ordered.forEach((card) => grid.appendChild(card));

      cards.forEach((card) => {
        const matchesQuery = !state.query || (card.dataset.scText || "").includes(state.query);
        const matchesFilter = state.filter === "all" || card.dataset.scFeatured === "true";
        card.classList.toggle("sc-is-hidden", !(matchesQuery && matchesFilter));
      });

      if (filterButton) {
        filterButton.classList.toggle("sc-ui-active", state.filter === "featured");
        filterButton.title = state.filter === "featured" ? "Showing featured disciplines" : "Showing all disciplines";
      }

      if (sortButton) {
        sortButton.classList.toggle("sc-ui-active", state.sort === "alpha");
        sortButton.title = state.sort === "alpha" ? "Sorted alphabetically" : "Sorted by curation order";
      }
    };

    searchInput.addEventListener("input", () => {
      state.query = normalize(searchInput.value);
      render();
    });

    if (filterButton) {
      filterButton.addEventListener("click", (event) => {
        event.preventDefault();
        state.filter = state.filter === "all" ? "featured" : "all";
        render();
      });
    }

    if (sortButton) {
      sortButton.addEventListener("click", (event) => {
        event.preventDefault();
        state.sort = state.sort === "default" ? "alpha" : "default";
        render();
      });
    }

    render();
  }

  function setupDashboardInteractions() {
    if (currentPath() !== "dashboard.html") return;
    const storageKey = "sc-dashboard-flow-state";
    const state = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const flowHeading = Array.from(document.querySelectorAll("h3")).find((node) => /today's flow/i.test(node.textContent || ""));
    const flowSection = flowHeading?.closest("div, section");
    const taskNodes = flowSection ? Array.from(flowSection.querySelectorAll(".space-y-4 > div")) : [];
    const clearButton = Array.from(document.querySelectorAll("button")).find((button) => /clear completed/i.test(button.textContent || ""));
    const searchInput = document.querySelector('input[placeholder*="Search archive"]');
    const persist = () => localStorage.setItem(storageKey, JSON.stringify(state));

    taskNodes.forEach((task) => {
      const titleNode = task.querySelector("p");
      const checkbox = task.querySelector(".w-6.h-6");
      const key = normalize(titleNode?.textContent || "");
      if (!checkbox || !key) return;
      task.dataset.scTask = key;

      const applyTaskState = () => {
        const taskState = state[key] || {};
        const complete = Boolean(taskState.complete);
        const archived = Boolean(taskState.archived);
        task.classList.toggle("sc-is-hidden", archived);
        task.classList.toggle("opacity-60", complete);
        const icon = checkbox.querySelector(".material-symbols-outlined");
        checkbox.classList.toggle("bg-primary", complete);
        checkbox.classList.toggle("border-primary/20", !complete);
        if (icon) {
          icon.style.opacity = complete ? "1" : "0";
          icon.style.color = complete ? "#ffffff" : "";
          icon.style.fontVariationSettings = complete ? "'FILL' 1" : "";
        }
      };

      checkbox.style.cursor = "pointer";
      checkbox.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        state[key] = { ...(state[key] || {}), complete: !state[key]?.complete, archived: false };
        persist();
        applyTaskState();
      });

      applyTaskState();
    });

    if (clearButton) {
      clearButton.addEventListener("click", (event) => {
        event.preventDefault();
        taskNodes.forEach((task) => {
          const key = task.dataset.scTask;
          if (key && state[key]?.complete) state[key].archived = true;
        });
        persist();
        taskNodes.forEach((task) => {
          task.classList.toggle("sc-is-hidden", Boolean(state[task.dataset.scTask]?.archived));
        });
      });
    }

    if (searchInput) {
      const panels = [...new Set(Array.from(document.querySelectorAll("main h3, main h4"))
        .map((node) => node.closest("div, article, section"))
        .filter(Boolean))];
      searchInput.addEventListener("input", () => {
        const query = normalize(searchInput.value);
        panels.forEach((panel) => {
          const match = !query || normalize(panel.textContent || "").includes(query);
          panel.classList.toggle("ring-2", Boolean(query) && match);
          panel.classList.toggle("ring-primary/30", Boolean(query) && match);
        });
      });
    }
  }

  function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function setupAnalyticsInteractions() {
    const pathname = currentPath();
    if (pathname !== "analytics.html") return;

    const periods = [
      { label: "Real-time", path: "M0,250 Q100,240 200,180 T400,140 T600,60 T800,20", peak: "98.4 IQV", depth: "1,240h", retention: "92%", phase: "Advanced Synthesis", citation: "4.8k", delta: "+12.4%", impact: "89", grade: "A+" },
      { label: "Monthly", path: "M0,260 Q100,220 200,210 T400,130 T600,95 T800,58", peak: "91.2 IQV", depth: "982h", retention: "88%", phase: "Pattern Consolidation", citation: "3.9k", delta: "+8.7%", impact: "84", grade: "A" },
      { label: "Quarterly", path: "M0,270 Q100,245 200,200 T400,165 T600,120 T800,92", peak: "86.7 IQV", depth: "2,860h", retention: "94%", phase: "Long-Range Integration", citation: "9.6k", delta: "+22.1%", impact: "93", grade: "A+" }
    ];

    let periodIndex = 0;
    const badge = Array.from(document.querySelectorAll("span")).find((node) => (node.textContent || "").trim() === "Real-time");
    const exportButton = Array.from(document.querySelectorAll("button")).find((node) => /export report/i.test(node.textContent || ""));
    const searchInput = document.querySelector('input[placeholder*="Search knowledge"]');
    const chartPath = document.querySelector('svg path[stroke="#004435"]');
    const chartArea = document.querySelector('svg path[fill="url(#line-gradient)"]');
    const peakValue = Array.from(document.querySelectorAll("p")).find((node) => /IQV/.test(node.textContent || ""));
    const totals = Array.from(document.querySelectorAll("p.text-lg.font-headline.font-bold"));
    const citationCard = Array.from(document.querySelectorAll("h4")).find((node) => /citation velocity/i.test(node.textContent || ""))?.closest("div.rounded-3xl");
    const citationValue = citationCard?.querySelector(".text-4xl");
    const citationDelta = citationCard?.querySelector("span");
    const impactCard = Array.from(document.querySelectorAll("h4")).find((node) => /research impact/i.test(node.textContent || ""))?.closest("div.rounded-3xl");
    const impactValue = impactCard?.querySelector(".text-5xl");
    const gradeNode = Array.from(document.querySelectorAll("span")).find((node) => /^[A-F][+]?$/.test((node.textContent || "").trim()));
    const tableRows = Array.from(document.querySelectorAll("tbody tr"));

    const applyPeriod = () => {
      const config = periods[periodIndex];
      if (badge) badge.textContent = config.label;
      if (chartPath) chartPath.setAttribute("d", config.path);
      if (chartArea) chartArea.setAttribute("d", `${config.path} L800,300 L0,300 Z`);
      if (peakValue) peakValue.textContent = config.peak;
      if (totals[0]) totals[0].textContent = config.depth;
      if (totals[1]) totals[1].textContent = config.retention;
      if (totals[2]) totals[2].textContent = config.phase;
      if (citationValue) citationValue.textContent = config.citation;
      if (citationDelta) citationDelta.textContent = config.delta;
      if (impactValue) impactValue.innerHTML = `${config.impact}<span class="text-xl text-primary-fixed">/100</span>`;
      if (gradeNode) gradeNode.textContent = config.grade;
    };

    if (badge) {
      badge.style.cursor = "pointer";
      badge.addEventListener("click", () => {
        periodIndex = (periodIndex + 1) % periods.length;
        applyPeriod();
      });
    }

    if (citationCard) {
      citationCard.addEventListener("click", () => {
        periodIndex = (periodIndex + 1) % periods.length;
        applyPeriod();
      });
    }

    if (impactCard) {
      impactCard.addEventListener("click", () => {
        periodIndex = (periodIndex + 1) % periods.length;
        applyPeriod();
      });
    }

    if (exportButton) {
      exportButton.addEventListener("click", (event) => {
        event.preventDefault();
        const config = periods[periodIndex];
        downloadTextFile(
          `soul-concept-analytics-${config.label.toLowerCase()}.json`,
          JSON.stringify({
            generatedAt: new Date().toISOString(),
            period: config.label,
            peakMomentum: config.peak,
            totalDepth: config.depth,
            retention: config.retention,
            currentPhase: config.phase,
            citationVelocity: config.citation,
            researchImpact: `${config.impact}/100`,
            subjectMastery: config.grade
          }, null, 2)
        );
      });
    }

    if (searchInput && tableRows.length) {
      searchInput.addEventListener("input", () => {
        const query = normalize(searchInput.value);
        tableRows.forEach((row) => {
          row.classList.toggle("sc-is-hidden", Boolean(query) && !normalize(row.textContent || "").includes(query));
        });
      });
    }

    applyPeriod();
  }

  function setupShellSearchTrigger() {
    const trigger = document.querySelector("[data-sc-page-search]");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const input = findPrimarySearchInput();
      if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => {
          input.focus();
          input.select?.();
          input.dispatchEvent(new Event("focus", { bubbles: true }));
        }, 180);
        return;
      }

      const query = window.prompt("Search this page");
      if (!query) return;
      const normalized = normalize(query);
      const sections = Array.from(document.querySelectorAll("main section, main article, main > div"));
      let firstMatch = null;

      sections.forEach((section) => {
        const match = normalize(section.textContent || "").includes(normalized);
        section.classList.toggle("ring-2", match);
        section.classList.toggle("ring-primary/30", match);
        if (match && !firstMatch) firstMatch = section;
      });

      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  function resolveTourSteps() {
    const pathname = currentPath();
    const configs = {
      "index.html": [
        { selectors: ['a[href="study-library.html"]', '[data-tour-id="home-science-open"]'], title: "Science Library", body: "This opens the real Grade 9 science library with annotation and AI support." },
        { selectors: ['a[href="analytics.html"]', '[data-tour-id="home-analytics-open"]'], title: "Analytics", body: "Open the live analytics dashboard to review momentum, retention, and next actions." },
        { selectors: ['button[data-focus-hero-open]'], title: "Focus Mode", body: "Start the camera-based focus monitor from anywhere in the shell." },
        { selectors: ['.sc-auth-launch', '[data-sc-open-auth]'], title: "Sign In", body: "Use the account flow here. The shell will try Puter first when available, then fall back to Soul Concept auth." }
      ],
      "dashboard.html": [
        { selectors: ['main'], title: "Workspace", body: "This dashboard is the imported NewsCC workspace layer for quick navigation and flow checks." },
        { selectors: ['a[href="study-library.html"]', 'a[href="library.html"]'], title: "Jump Back Into Study", body: "Use the shell to move from overview straight into the actual study libraries and tools." }
      ],
      "library.html": [
        { selectors: ['a[href="study-library.html"]', 'button[onclick*="study-library.html"]'], title: "Science", body: "This route goes to the live science library with annotation tools." },
        { selectors: ['a[href="geography-library.html"]', 'button[onclick*="geography-library.html"]'], title: "Geography", body: "Open the geography library from the imported shell." },
        { selectors: ['a[href="anki/index.html"]', 'a[href="math-quiz-simulator.html"]'], title: "Tools", body: "Concept cards and quiz practice stay wired to the original Soul Concept tools." }
      ],
      "analytics.html": [
        { selectors: ['[data-analytics-page]', '[data-home-analytics]'], title: "Live Analytics", body: "This is the current Soul Concept analytics dashboard with the new live metrics layout." },
        { selectors: ['button[data-focus-hero-open]'], title: "Focus Loop", body: "Use Focus Mode before returning here so the dashboard has better data." }
      ],
      "study-library.html": [
        { selectors: ['[data-tour-id="science-continue"]', '.exit-btn'], title: "Science Flow", body: "The study library keeps its original guided study flow inside the new shell." },
        { selectors: ['#lib-anno-toggle', '[data-tour-id="anno-toggle"]'], title: "Annotation", body: "Use the annotation toolbar to draw, erase, and save marked-up notes." }
      ],
      "geography-library.html": [
        { selectors: ['#lib-anno-toggle', '[data-tour-id="anno-toggle"]'], title: "Annotation", body: "The geography library keeps the same annotation and AI support tools." }
      ]
    };

    const selected = configs[pathname] || [
      { selectors: ['main'], title: "Page Overview", body: "This page is now running inside the imported NewsCC shell on top of Soul Concept." },
      { selectors: ['[data-sc-open-auth]', '.sc-auth-launch'], title: "Account", body: "Use the shell account action to sign in and keep your study state tied to your profile." }
    ];

    return selected
      .map((step) => {
        const element = step.selectors
          .map((selector) => document.querySelector(selector))
          .find(Boolean);
        return element ? { ...step, element } : null;
      })
      .filter(Boolean);
  }

  function ensureTourUi() {
    if (document.getElementById("sc-tour-ui")) return document.getElementById("sc-tour-ui");
    const style = document.createElement("style");
    style.id = "sc-tour-ui";
    style.textContent = [
      ".sc-tour-backdrop{position:fixed;inset:0;z-index:12000;background:rgba(17,22,28,.5);backdrop-filter:blur(8px);display:none}",
      ".sc-tour-backdrop.open{display:block}",
      ".sc-tour-spotlight{position:fixed;z-index:12001;border-radius:24px;border:2px solid rgba(255,255,255,.9);box-shadow:0 0 0 9999px rgba(17,22,28,.48),0 18px 40px rgba(0,0,0,.18);pointer-events:none;transition:all 180ms ease}",
      ".sc-tour-card{position:fixed;z-index:12002;width:min(320px,calc(100vw - 24px));border-radius:22px;padding:16px 16px 14px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(247,241,233,.98));border:1px solid rgba(226,216,203,.9);box-shadow:0 24px 54px rgba(23,21,16,.18)}",
      ".sc-tour-kicker{display:block;margin-bottom:6px;color:#ae3200;font:800 .68rem/1 Manrope,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase}",
      ".sc-tour-title{margin:0 0 8px;color:#1d1a22;font:700 1.15rem/1.12 Fraunces,Georgia,serif}",
      ".sc-tour-body{margin:0 0 12px;color:#5a5863;font:600 .9rem/1.5 DM Sans,Segoe UI,sans-serif}",
      ".sc-tour-actions{display:flex;align-items:center;justify-content:space-between;gap:8px}",
      ".sc-tour-progress{color:#7a746b;font:700 .75rem/1 Manrope,system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase}",
      ".sc-tour-btns{display:flex;gap:8px}",
      ".sc-tour-btn{border:1px solid rgba(226,216,203,.9);background:#fff;color:#1d1a22;border-radius:999px;padding:8px 12px;font:800 .76rem/1 Manrope,system-ui,sans-serif;cursor:pointer}",
      ".sc-tour-btn.primary{background:linear-gradient(135deg,#004435,#215c4b);color:#fff;border-color:#215c4b}",
      "@media (max-width:760px){.sc-tour-card{width:min(92vw,320px)}}"
    ].join("");
    document.head.appendChild(style);

    const backdrop = document.createElement("div");
    backdrop.className = "sc-tour-backdrop";
    backdrop.innerHTML = '<div class="sc-tour-spotlight" data-sc-tour-spotlight></div><div class="sc-tour-card" data-sc-tour-card><span class="sc-tour-kicker">Tutorial</span><h3 class="sc-tour-title" data-sc-tour-title></h3><p class="sc-tour-body" data-sc-tour-body></p><div class="sc-tour-actions"><span class="sc-tour-progress" data-sc-tour-progress></span><div class="sc-tour-btns"><button type="button" class="sc-tour-btn" data-sc-tour-skip>Close</button><button type="button" class="sc-tour-btn primary" data-sc-tour-next>Next</button></div></div></div>';
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function setupTour() {
    const trigger = document.querySelector("[data-sc-open-tour]");
    if (!trigger) return;

    const backdrop = ensureTourUi();
    const spotlight = backdrop.querySelector("[data-sc-tour-spotlight]");
    const card = backdrop.querySelector("[data-sc-tour-card]");
    const title = backdrop.querySelector("[data-sc-tour-title]");
    const body = backdrop.querySelector("[data-sc-tour-body]");
    const progress = backdrop.querySelector("[data-sc-tour-progress]");
    const nextBtn = backdrop.querySelector("[data-sc-tour-next]");
    const skipBtn = backdrop.querySelector("[data-sc-tour-skip]");
    let steps = [];
    let index = 0;

    function positionCard(rect) {
      const gap = 18;
      const cardWidth = Math.min(320, window.innerWidth - 24);
      let left = Math.min(Math.max(rect.left, 12), Math.max(12, window.innerWidth - cardWidth - 12));
      let top = rect.bottom + gap;
      if (top + 220 > window.innerHeight) {
        top = Math.max(12, rect.top - 210);
      }
      card.style.left = left + "px";
      card.style.top = top + "px";
    }

    function renderStep() {
      const step = steps[index];
      if (!step) return;
      const rect = step.element.getBoundingClientRect();
      spotlight.style.left = Math.max(8, rect.left - 8) + "px";
      spotlight.style.top = Math.max(8, rect.top - 8) + "px";
      spotlight.style.width = Math.min(window.innerWidth - 16, rect.width + 16) + "px";
      spotlight.style.height = Math.min(window.innerHeight - 16, rect.height + 16) + "px";
      title.textContent = step.title;
      body.textContent = step.body;
      progress.textContent = `${index + 1} / ${steps.length}`;
      nextBtn.textContent = index === steps.length - 1 ? "Finish" : "Next";
      positionCard(rect);
      step.element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }

    function closeTour() {
      backdrop.classList.remove("open");
      document.body.classList.remove("sc-tour-open");
    }

    function openTour() {
      steps = resolveTourSteps();
      if (!steps.length) return;
      index = 0;
      backdrop.classList.add("open");
      document.body.classList.add("sc-tour-open");
      renderStep();
    }

    trigger.addEventListener("click", openTour);
    nextBtn.addEventListener("click", () => {
      if (index >= steps.length - 1) {
        closeTour();
        return;
      }
      index += 1;
      renderStep();
    });
    skipBtn.addEventListener("click", closeTour);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeTour();
    });
    window.addEventListener("resize", () => {
      if (backdrop.classList.contains("open")) renderStep();
    });
  }

  function ensurePuterSdk() {
    if (window.puter) return Promise.resolve(window.puter);
    const existing = document.getElementById("sc-puter-shell-sdk");
    if (existing) {
      return new Promise((resolve, reject) => {
        existing.addEventListener("load", () => resolve(window.puter), { once: true });
        existing.addEventListener("error", reject, { once: true });
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = "sc-puter-shell-sdk";
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      script.onload = () => resolve(window.puter);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function setupShellAuthTrigger() {
    const trigger = document.querySelector("[data-sc-open-auth]");
    if (!trigger) return;
    trigger.addEventListener("click", async () => {
      const supabaseButton = document.querySelector(".sc-auth-launch");
      if (supabaseButton) {
        supabaseButton.click();
        return;
      }
      try {
        const puter = await ensurePuterSdk();
        if (puter && puter.auth && typeof puter.auth.signIn === "function") {
          await puter.auth.signIn();
          return;
        }
      } catch (_err) {
      }
      const lateButton = document.querySelector(".sc-auth-launch");
      if (lateButton) lateButton.click();
    });
  }

  function repairBrokenText() {
    document.querySelectorAll("*").forEach((node) => {
      if (node.children.length) return;
      const text = node.textContent;
      if (!text || !text.includes("Ã¢")) return;
      node.textContent = text
        .replaceAll("Ã¢Ë†Â«", "âˆ«")
        .replaceAll("mcÃ‚Â²", "mcÂ²")
        .replaceAll("aÃ‚Â²", "aÂ²")
        .replaceAll("Ã¢Ë†â€š", "âˆ‚")
        .replaceAll("ÃŽÂ±", "Î±")
        .replaceAll("Ã¢Ë†â€¡", "âˆ‡")
        .replaceAll("ÃŽÂ¦", "Î¦")
        .replaceAll("Ã¢Ë†Å¡", "âˆš")
        .replaceAll("ÃŽÂ£", "Î£");
    });
  }

  ensureStylesheet();
  ensureFonts();
  wireRoutes();
  addMotionOrbs();
  buildShell();
  hideLegacyShell();
  cleanupLayout();
  setupShellSearchTrigger();
  setupTour();
  setupShellAuthTrigger();
  hydrateIcons();
  repairBrokenText();
  setupGlobalSearch();
  setupLibraryInteractions();
  setupDashboardInteractions();
  setupAnalyticsInteractions();
  setupRevealAnimations();
  setupTiltCards();
  setupProgressAnimations();
  setupHeroParallax();
  document.body.classList.add("sc-shell-ready");
  document.body.classList.add("sc-page-enter");
  document.getElementById("sc-shell-critical")?.remove();
})();
