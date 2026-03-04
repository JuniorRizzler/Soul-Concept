window.SC_AUTH_CONFIG = {
  enabled: true,
  domain: "YOUR_AUTH0_DOMAIN",
  clientId: "YOUR_AUTH0_CLIENT_ID",
  connection: "blackbaud",
  callbackPath: "/auth/callback.html",
  logoutReturnTo: "/index.html",
  requireOnPaths: [
    "/",
    "/index.html",
    "/about.html",
    "/contact.html",
    "/services.html",
    "/subjects.html",
    "/work.html",
    "/study-library.html",
    "/geography-library.html",
    "/grade-10-math.html",
    "/math-quiz-simulator.html",
    "/anki/index.html",
    "/math/index.html"
  ]
};
