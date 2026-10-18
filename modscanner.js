// ==========================================
// WORDLE MOD SCANNER & ANTI-CHEAT ENGINE (v1.0.0)
// ==========================================

window.WordleModScanner = {
  scanInterval: null,
  isCompromised: false,
  baselineCoins: null,

  init() {
    console.log("%c[ModScanner] Security scanner initialized. Monitoring runtime integrity...", "color: #3b82f6;");
    
    setTimeout(() => {
      if (window._gameContext && window._gameContext.userData) {
        this.baselineCoins = window._gameContext.userData.coins;
      }
    }, 1000);

    this.scanInterval = setInterval(() => this.runIntegrityCheck(), 3000);
    this.detectDebugger();
  },

  runIntegrityCheck() {
    if (this.isCompromised) return;

    try {
      if (window._gameContext && window._gameContext.userData) {
        const currentCoins = window._gameContext.userData.coins;
        if (this.baselineCoins !== null && currentCoins - this.baselineCoins > 500) {
          this.flagMod("Abnormal currency injection detected (Coin delta too high).");
        }
        this.baselineCoins = currentCoins;
      }
    } catch (err) {
      this.flagMod("Exception caught during integrity verification: " + err.message);
    }
  },

  detectDebugger() {
    const threshold = 160;
    setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > threshold) {
        // Dev tools active
      }
    }, 5000);
  },

  flagMod(reason) {
    if (this.isCompromised) return;
    this.isCompromised = true;
    
    console.warn(`%c[SECURITY ALERT] Tamper Attempt Blocked: ${reason}`, "color: #ef4444; font-weight: bold; font-size: 13px;");
    this.showSecurityWarning(reason);
  },

  showSecurityWarning(reason) {
    const banner = document.createElement('div');
    banner.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-950/90 border border-rose-500 text-rose-200 shadow-2xl rounded-xl p-4 w-11/12 max-w-md flex flex-col gap-2 backdrop-blur-md';
    banner.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-sm flex items-center gap-1.5 text-rose-400">
          <i class="fa-solid fa-triangle-exclamation"></i> Security Warning
        </span>
        <span class="text-[10px] bg-rose-900 text-rose-200 px-2 py-0.5 rounded font-mono">MOD_DETECTED</span>
      </div>
      <p class="text-xs text-slate-300">Anomaly detected: <strong>${reason}</strong>. Unverified modifications may result in score resets.</p>
      <button onclick="localStorage.clear(); location.reload();" class="mt-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-lg transition-colors">
        Reset Session & Clear Data
      </button>
    `;
    document.body.appendChild(banner);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.WordleModScanner.init(), 1500);
});