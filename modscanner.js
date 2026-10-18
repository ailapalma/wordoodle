// ==========================================
// WORDLE MOD SCANNER & SHIELD ENGINE (v1.0.1)
// ==========================================

(function () {
  'use strict';

  // Blacklisted DOM IDs commonly used by client-side panels
  const FORBIDDEN_ELEMENT_IDS = ['jake1337-panel', 'cheat-menu', 'hack-overlay'];

  const ModScannerShield = {
    init() {
      console.log("%c[Shield] Active DOM Guard and Integrity Protection Initialized.", "color: #10b981; font-weight: bold;");
      
      // 1. Monitor DOM for unauthorized element injections
      this.startDOMObserver();

      // 2. Continuous sweep for known panel IDs
      setInterval(() => this.sweepUnauthorizedElements(), 1000);

      // 3. Prevent overriding global function properties
      this.protectGlobals();
    },

    startDOMObserver() {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              if (FORBIDDEN_ELEMENT_IDS.includes(node.id) || node.id.includes('jake1337')) {
                console.warn(`%c[Shield] Blocked unauthorized overlay injection: #${node.id}`, "color: #ef4444; font-weight: bold;");
                node.remove();
              }
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    },

    sweepUnauthorizedElements() {
      FORBIDDEN_ELEMENT_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          console.warn(`%c[Shield] Removed unauthorized panel: #${id}`, "color: #ef4444;");
          el.remove();
        }
      });
    },

    protectGlobals() {
      // Freeze sensitive global namespaces so external scripts cannot rewrite function definitions
      if (window.WordleTunables) Object.freeze(window.WordleTunables);
      if (window.WordleModScanner) Object.freeze(window.WordleModScanner);
    }
  };

  // Run Shield immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ModScannerShield.init());
  } else {
    ModScannerShield.init();
  }
})();
