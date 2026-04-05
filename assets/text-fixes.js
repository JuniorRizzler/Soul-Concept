(function () {
  var PATTERNS = [
    {
      pattern: /ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢/g,
      replacement: ' - '
    },
    {
      pattern: /ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·|ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢|Ã¢â‚¬Â¢|â€¢|Â·|Ã‚Â·/g,
      replacement: ' - '
    },
    {
      pattern: /ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â|ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â|Ã¢â‚¬â€|Ã¢â‚¬â€œ|â€”|â€“/g,
      replacement: '-'
    },
    {
      pattern: /Ã¢â‚¬Å“|ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ|â€œ|â€/g,
      replacement: '"'
    },
    {
      pattern: /Ã¢â‚¬Â|ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â|â€|”/g,
      replacement: '"'
    },
    {
      pattern: /Ã¢â‚¬â„¢|ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢|â€™|’/g,
      replacement: "'"
    },
    {
      pattern: /Ã¢â‚¬Â¦|â€¦/g,
      replacement: '...'
    },
    {
      pattern: /Ã‚Â©|Ãƒâ€šÃ‚Â©|ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©/g,
      replacement: '(c)'
    },
    {
      pattern: /Ã‚|Â/g,
      replacement: ''
    }
  ];

  function shouldSanitize(value) {
    return typeof value === 'string' && /Ã|Â|â€™|â€œ|â€|â€¢|â€“|â€”|Ã¢|�/.test(value);
  }

  function sanitizeString(value) {
    if (typeof value !== 'string' || !value) return value;

    var output = value;
    PATTERNS.forEach(function (entry) {
      output = output.replace(entry.pattern, entry.replacement);
    });

    return output
      .replace(/\s+-\s+-\s+/g, ' - ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([,.;!?])/g, '$1')
      .trim();
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
          if (parentName === 'SCRIPT' || parentName === 'STYLE' || parentName === 'NOSCRIPT') {
            return NodeFilter.FILTER_REJECT;
          }
          return shouldSanitize(node.nodeValue || '')
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
      '[title]',
      '[aria-label]',
      '[placeholder]',
      '[alt]',
      '[data-search-text]'
    ];

    root.querySelectorAll(selectors.join(',')).forEach(function (node) {
      ['title', 'aria-label', 'placeholder', 'alt', 'data-search-text'].forEach(function (attr) {
        if (!node.hasAttribute(attr)) return;
        var value = node.getAttribute(attr);
        if (shouldSanitize(value)) {
          node.setAttribute(attr, sanitizeString(value));
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

  var scheduled = false;

  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      run();
    });
  }

  run();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  }

  window.addEventListener('load', run, { once: true });

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i += 1) {
      var mutation = mutations[i];

      if (mutation.type === 'characterData' && shouldSanitize(mutation.target.nodeValue || '')) {
        scheduleRun();
        return;
      }

      if (mutation.type === 'attributes') {
        var attributeValue = mutation.target.getAttribute(mutation.attributeName);
        if (shouldSanitize(attributeValue || '')) {
          scheduleRun();
          return;
        }
      }

      if (mutation.type === 'childList') {
        for (var j = 0; j < mutation.addedNodes.length; j += 1) {
          var node = mutation.addedNodes[j];
          if (node.nodeType === Node.TEXT_NODE && shouldSanitize(node.nodeValue || '')) {
            scheduleRun();
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE && shouldSanitize(node.textContent || '')) {
            scheduleRun();
            return;
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['title', 'aria-label', 'placeholder', 'alt', 'data-search-text']
  });
})();