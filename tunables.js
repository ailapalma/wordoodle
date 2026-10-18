// ==========================================
// WORDLE DEVELOPER TUNABLES ENGINE (v1.0.0)
// ==========================================

window.WordleTunables = {
  events: {
    doubleCoins: true,
    doubleXP: false,
    freePowerups: false,
    unlimitedGuesses: false
  },

  themes: {
    activeTheme: "halloween",
    customBackground: null
  },

  devKey: "dev_override_enabled",

  isDevMode() {
    return localStorage.getItem(this.devKey) === "true";
  },

  applyTheme(themeName) {
    this.themes.activeTheme = themeName;
    const body = document.body;

    body.classList.remove('theme-halloween', 'theme-christmas', 'theme-cyberpunk');

    if (themeName === 'halloween') {
      body.classList.add('theme-halloween');
      this.injectThemeCSS(`
        .theme-halloween { background-color: #0f0b15 !important; }
        .theme-halloween header h1 { background: linear-gradient(to right, #f97316, #a855f7) !important; -webkit-background-clip: text !important; }
        .theme-halloween .tile-back.bg-emerald-600 { background-color: #7e22ce !important; }
        .theme-halloween .tile-back.bg-amber-600 { background-color: #ea580c !important; }
      `);
      console.log("%c🎃 Halloween Event Active!", "color: #f97316; font-weight: bold;");
    } else if (themeName === 'christmas') {
      body.classList.add('theme-christmas');
      this.injectThemeCSS(`
        .theme-christmas { background-color: #061e14 !important; }
        .theme-christmas header h1 { background: linear-gradient(to right, #ef4444, #22c55e) !important; -webkit-background-clip: text !important; }
        .theme-christmas .tile-back.bg-emerald-600 { background-color: #15803d !important; }
        .theme-christmas .tile-back.bg-amber-600 { background-color: #b91c1c !important; }
      `);
      console.log("%c🎄 Christmas Event Active!", "color: #ef4444; font-weight: bold;");
    } else if (themeName === 'cyberpunk') {
      body.classList.add('theme-cyberpunk');
      this.injectThemeCSS(`
        .theme-cyberpunk { background-color: #050515 !important; }
        .theme-cyberpunk header h1 { background: linear-gradient(to right, #06b6d4, #ec4899) !important; -webkit-background-clip: text !important; }
      `);
    }
  },

  injectThemeCSS(cssRules) {
    let styleEl = document.getElementById('tunable-theme-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'tunable-theme-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = cssRules;
  },

  toggleEvent(eventName, state) {
    if (this.events[eventName] !== undefined) {
      this.events[eventName] = state !== undefined ? state : !this.events[eventName];
      console.log(`%c[Tunables] ${eventName} set to ${this.events[eventName]}`, "color: #3b82f6; font-weight: bold;");
      return this.events[eventName];
    } else {
      console.error(`[Tunables] Unknown event: ${eventName}`);
    }
  },

  calculateCoinReward(baseCoins = 25) {
    let finalAmount = baseCoins;
    if (this.events.doubleCoins) finalAmount *= 2;
    return finalAmount;
  }
};

window.DevTunables = {
  enableDevMode(passcode) {
    if (passcode === "dev123" || passcode === "admin") {
      localStorage.setItem(WordleTunables.devKey, "true");
      console.log("%c[Tunables] Dev permissions unlocked!", "color: #10b981; font-weight: bold;");
      return true;
    } else {
      console.error("[Tunables] Invalid passcode.");
      return false;
    }
  },

  setDoubleCoins(active = true) {
    WordleTunables.toggleEvent('doubleCoins', active);
  },

  setTheme(themeName) {
    WordleTunables.applyTheme(themeName);
  },

  status() {
    console.group("%c📊 Active Dev Tunables Status", "color: #10b981; font-weight: bold;");
    console.log("Dev Mode:", WordleTunables.isDevMode());
    console.log("Active Theme:", WordleTunables.themes.activeTheme);
    console.table(WordleTunables.events);
    console.groupEnd();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  WordleTunables.applyTheme(WordleTunables.themes.activeTheme);
  
  if (WordleTunables.events.doubleCoins) {
    const coinDisplay = document.getElementById('coin-balance');
    if (coinDisplay && coinDisplay.parentElement) {
      const badge = document.createElement('span');
      badge.className = 'text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black ml-1 animate-pulse';
      badge.innerText = '2X COINS';
      coinDisplay.parentElement.appendChild(badge);
    }
  }
});

console.log("%c[Tunables Loaded]%c Use %cDevTunables.status()%c to view active dev events.", "color: #3b82f6; font-weight: bold;", "", "color: #10b981; font-weight: bold;", "");