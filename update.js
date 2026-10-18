// ==========================================
// WORDLE GAME OFFICIAL RELEASE v1.0.0
// ==========================================

window.WORDLE_VERSION = "1.0.0";

const UPDATE_CONFIG = {
  manifestUrl: "./version.json",
  checkInterval: 1000 * 60 * 60
};

// ==========================================
// AUTO-UPDATER ENGINE (`WordleUpdater`)
// ==========================================
window.WordleUpdater = {
  async checkForUpdates(silent = true) {
    try {
      console.log(`%c[Updater] Checking for updates against v${window.WORDLE_VERSION}...`, "color: #3b82f6;");
      const response = await fetch(`${UPDATE_CONFIG.manifestUrl}?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to fetch update manifest");
      
      const remoteData = await response.json();
      
      if (remoteData.version && remoteData.version !== window.WORDLE_VERSION) {
        console.log(`%c[Updater] New build available: v${remoteData.version}`, "color: #10b981; font-weight: bold;");
        this.showUpdateBanner(remoteData.version, remoteData.changelog);
        return true;
      } else {
        if (!silent) console.log("%c[Updater] Wordle v1.0.0 is up to date!", "color: #10b981;");
        return false;
      }
    } catch (err) {
      if (!silent) console.warn("%c[Updater] Could not verify remote manifest.", "color: #f59e0b;");
      return false;
    }
  },

  showUpdateBanner(newVersion, changelog = "Bug fixes and performance upgrades.") {
    if (document.getElementById('update-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-emerald-500/50 shadow-2xl rounded-xl p-4 w-11/12 max-w-md flex flex-col gap-2';
    banner.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
          <i class="fa-solid fa-rocket"></i> Update Available (v${newVersion})
        </span>
        <button onclick="document.getElementById('update-banner').remove()" class="text-slate-400 hover:text-white text-xs">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p class="text-xs text-slate-300">${changelog}</p>
      <button onclick="location.reload(true)" class="mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
        <i class="fa-solid fa-rotate-right"></i> Restart & Update
      </button>
    `;
    document.body.appendChild(banner);
  }
};

// ==========================================
// DEVELOPER CONSOLE DEBUG MENU (`WordleDebug`)
// ==========================================
window.WordleDebug = {
  version: window.WORDLE_VERSION,
  
  help() {
    console.group("%c🛠️ Wordle v1.0.0 Official Debug Menu", "color: #10b981; font-weight: bold; font-size: 14px;");
    console.log("• WordleDebug.reveal()          -> Reveals secret target word");
    console.log("• WordleDebug.addCoins(amount)  -> Grants store currency");
    console.log("• WordleDebug.addPowerups(type, count) -> Adds powerup items");
    console.log("• WordleDebug.win()             -> Triggers victory on current row");
    console.log("• WordleDebug.checkUpdates()    -> Runs remote update check");
    console.log("• WordleDebug.resetStats()      -> Clears local cache");
    console.groupEnd();
    return `Wordle v${this.version} Official ready.`;
  },

  reveal() {
    const word = window._gameContext ? window._gameContext.getTargetWord() : "Unknown";
    console.log(`%c[DEBUG v1.0.0] Secret Word: ${word}`, "color: #f59e0b; font-weight: bold; font-size: 13px;");
    return word;
  },

  addCoins(amount = 100) {
    if (window._gameContext && window._gameContext.userData) {
      window._gameContext.userData.coins += amount;
      window._gameContext.saveUserData();
      console.log(`%c[DEBUG v1.0.0] Balance updated: ${window._gameContext.userData.coins}`, "color: #10b981;");
      return window._gameContext.userData.coins;
    }
  },

  addPowerups(type = 'reveal', count = 5) {
    if (window._gameContext && window._gameContext.userData) {
      if (window._gameContext.userData.powerups[type] !== undefined) {
        window._gameContext.userData.powerups[type] += count;
        window._gameContext.saveUserData();
        console.log(`%c[DEBUG v1.0.0] Added ${count} '${type}' items.`, "color: #10b981;");
      }
    }
  },

  win() {
    if (window._gameContext) window._gameContext.forceWin();
  },

  checkUpdates() {
    WordleUpdater.checkForUpdates(false);
  },

  resetStats() {
    localStorage.clear();
    location.reload();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const verElements = document.querySelectorAll('.app-version-tag');
  verElements.forEach(el => el.innerText = `v${window.WORDLE_VERSION}`);

  setTimeout(() => WordleUpdater.checkForUpdates(true), 3000);
});

console.log(`%c[Wordle Official v${window.WORDLE_VERSION}]%c Type %cWordleDebug.help()%c for dev commands.`, "color: #3b82f6; font-weight: bold;", "", "color: #10b981; font-weight: bold;", "");