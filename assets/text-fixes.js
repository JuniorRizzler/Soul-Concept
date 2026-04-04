(function () {
  function sanitizeString(value) {
    if (typeof value !== "string" || !value) return value;

    return value
      .replace(/ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢/g, "•")
      .replace(/ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢/g, "•")
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢/g, "•")
      .replace(/â€¢/g, "•")
      .replace(/ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â|Ã¢â‚¬â€|â€”|â€“|Ã¢â‚¬â€œ/g, "-")
      .replace(/â€œ|Ã¢â‚¬Å“/g, "\"")
      .replace(/â€|Ã¢â‚¬Â/g, "\"")
      .replace(/â€™|Ã¢â‚¬â„¢/g, "'")
      .replace(/Ãƒâ€šÃ‚Â©|Ã‚Â©|Â©/g, "©")
      .replace(/Â/g, "")
      .replace(/\s+•\s+/g, " • ");
  }

  function sanitizeTextNodes(root) {
    if (!root || !root.ownerDocument) return;

    var walker = root.ownerDocument.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node || !node.parentNode) return NodeFilter.FILTER_REJECT;
          var parentName = node.parentNode.nodeName;
          if (parentName === "SCRIPT" || parentName === "STYLE" || parentName === "NOSCRIPT") {
            return NodeFilter.FILTER_REJECT;
          }
          return /Ã|â€™|â€œ|â€|Â|Ã‚/.test(node.nodeValue || "")
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    var current;
    while ((current = walker.nextNode())) {
      current.nodeValue = sanitizeString(current.nodeValue);
    }
  }

  function sanitizeAttributes(root) {
    if (!root || !root.querySelectorAll) return;

    var selectors = [
      "[title]",
      "[aria-label]",
      "[placeholder]",
      "[alt]",
      "[data-search-text]"
    ];

    root.querySelectorAll(selectors.join(",")).forEach(function (node) {
      ["title", "aria-label", "placeholder", "alt", "data-search-text"].forEach(function (attr) {
        if (node.hasAttribute(attr)) {
          node.setAttribute(attr, sanitizeString(node.getAttribute(attr)));
        }
      });
    });
  }

  function run() {
    var root = document.body || document.documentElement;
    if (!root) return;
    document.title = sanitizeString(document.title);
    sanitizeTextNodes(root);
    sanitizeAttributes(root);
  }

  run();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  }

  window.addEventListener("load", run, { once: true });
})();
