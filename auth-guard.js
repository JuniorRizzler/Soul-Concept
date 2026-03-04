(function () {
  var cfg = window.SC_AUTH_CONFIG || {};
  if (!cfg.enabled) return;

  var path = location.pathname || "/";
  var callbackPath = cfg.callbackPath || "/auth/callback.html";
  var mustProtect = Array.isArray(cfg.requireOnPaths) && cfg.requireOnPaths.indexOf(path) !== -1;
  var isCallbackPage = path === callbackPath;

  if (!mustProtect && !isCallbackPage) return;

  function isConfigured() {
    return !!cfg.domain && !!cfg.clientId && cfg.domain !== "YOUR_AUTH0_DOMAIN" && cfg.clientId !== "YOUR_AUTH0_CLIENT_ID";
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureAuthButton(client) {
    var topbar = document.querySelector(".topbar-inner");
    if (!topbar) return;
    if (topbar.querySelector("[data-auth-logout]")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary";
    btn.setAttribute("data-auth-logout", "1");
    btn.textContent = "Sign Out";
    btn.addEventListener("click", function () {
      client.logout({
        logoutParams: {
          returnTo: location.origin + (cfg.logoutReturnTo || "/index.html"),
        },
      });
    });
    var navToggle = topbar.querySelector("[data-nav-toggle]");
    if (navToggle) topbar.insertBefore(btn, navToggle);
    else topbar.appendChild(btn);
  }

  async function run() {
    // Fail open while auth is disabled or not fully configured.
    // This prevents lockout due to stale cached config files.
    if (!isConfigured()) return;

    await loadScript("https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js");

    var client = await window.auth0.createAuth0Client({
      domain: cfg.domain,
      clientId: cfg.clientId,
      authorizationParams: {
        redirect_uri: location.origin + callbackPath,
      },
      cacheLocation: "localstorage",
      useRefreshTokens: true,
    });

    var hasCode = location.search.indexOf("code=") !== -1;
    var hasState = location.search.indexOf("state=") !== -1;

    if (isCallbackPage && hasCode && hasState) {
      try {
        var res = await client.handleRedirectCallback();
        var returnTo = (res && res.appState && res.appState.returnTo) || (cfg.logoutReturnTo || "/index.html");
        location.replace(returnTo);
      } catch (err) {
        console.error("Auth callback failed:", err);
        location.replace(cfg.logoutReturnTo || "/index.html");
      }
      return;
    }

    if (isCallbackPage) {
      location.replace(cfg.logoutReturnTo || "/index.html");
      return;
    }

    var isAuthed = await client.isAuthenticated();
    if (!isAuthed) {
      await client.loginWithRedirect({
        appState: { returnTo: location.pathname + location.search + location.hash },
        authorizationParams: {
          connection: cfg.connection || "blackbaud",
          prompt: "login",
        },
      });
      return;
    }

    ensureAuthButton(client);
  }

  run().catch(function (err) {
    console.error("Auth guard failed:", err);
  });
})();
