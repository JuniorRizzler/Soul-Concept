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

  function showConfigError() {
    document.body.innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#0b0d10;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">' +
      '<div style="max-width:640px;background:#151922;border:1px solid #2a3142;border-radius:14px;padding:20px 22px;">' +
      "<h2 style='margin:0 0 10px;font-size:1.2rem;'>Auth Setup Required</h2>" +
      "<p style='margin:0 0 10px;line-height:1.5;color:#c6cfdd;'>Set <code>domain</code> and <code>clientId</code> in <code>auth-config.js</code> to enable Blackbaud sign in.</p>" +
      "<p style='margin:0;line-height:1.5;color:#8ea0bd;'>Then redeploy and refresh this page.</p>" +
      "</div></div>";
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
    if (!isConfigured()) {
      showConfigError();
      return;
    }

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
