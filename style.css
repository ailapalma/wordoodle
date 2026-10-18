const TARGET_WORDS = [
  "CABLE", "MATCH", "SMART", "FLASH", "DRIVE", "CRANE", "SLATE", "PLANT",
  "GHOST", "BLAST", "BRAIN", "LIGHT", "DREAM", "STORM", "SHARK", "SHINE",
  "CHAIR", "POWER", "FLAME", "SWEET", "TRACK", "BOUND", "FLUID", "CROWN"
];

class SoundEffects {
  constructor() { this.ctx = null; this.muted = false; }
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  playTone(freq, type, duration) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }
  keyPress() { this.playTone(400, 'sine', 0.05); }
  deleteKey() { this.playTone(280, 'sine', 0.08); }
  flip() { this.playTone(600, 'triangle', 0.12); }
  invalid() { this.playTone(150, 'sawtooth', 0.25); }
  victory() {
    if (this.muted) return;
    this.init();
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.3), i * 120));
  }
}

const sfx = new SoundEffects();

async function hashSHA256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

let userData = JSON.parse(localStorage.getItem('wordle_user_data')) || {
  usernameHash: "", pinHash: "", rawUsername: "", coins: 100, powerups: { reveal: 1, eliminate: 1, row: 0 }
};

let stats = JSON.parse(localStorage.getItem('wordle_stats')) || {
  played: 0, wins: 0, streak: 0, maxStreak: 0
};

let targetWord = "";
let maxRows = 6;
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;
let boardState = [];

const KB_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
];

function saveUserData() {
  localStorage.setItem('wordle_user_data', JSON.stringify(userData));
  localStorage.setItem('wordle_stats', JSON.stringify(stats));
  updateUIBalances();
}

function updateUIBalances() {
  document.getElementById('coin-balance').innerText = userData.coins;
  document.getElementById('count-reveal').innerText = userData.powerups.reveal;
  document.getElementById('count-eliminate').innerText = userData.powerups.eliminate;
  document.getElementById('count-row').innerText = userData.powerups.row;

  const enableBtn = (id, count) => {
    const btn = document.getElementById(id);
    if (count > 0 && !isGameOver) {
      btn.removeAttribute('disabled');
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      btn.setAttribute('disabled', 'true');
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  };

  enableBtn('powerup-reveal', userData.powerups.reveal);
  enableBtn('powerup-eliminate', userData.powerups.eliminate);
  enableBtn('powerup-row', userData.powerups.row);
}

function initGame() {
  targetWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
  maxRows = 6;
  currentRow = 0;
  currentTile = 0;
  isGameOver = false;
  boardState = Array(maxRows).fill("").map(() => Array(5).fill(""));

  renderBoard();
  renderKeyboard();
  updateUIBalances();
  updateStatsDisplay();
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  boardEl.className = `grid grid-rows-${maxRows} gap-1.5 p-2 w-full max-w-[350px] aspect-[5/${maxRows}]`;

  for (let r = 0; r < maxRows; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = `grid grid-cols-5 gap-1.5 w-full row-${r}`;
    for (let c = 0; c < 5; c++) {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile-perspective w-full h-full';
      tileDiv.innerHTML = `
        <div class="tile-inner" id="tile-${r}-${c}">
          <div class="tile-front border-2 border-slate-700 bg-slate-900/90 text-white"></div>
          <div class="tile-back text-white"></div>
        </div>
      `;
      rowDiv.appendChild(tileDiv);
    }
    boardEl.appendChild(rowDiv);
  }
}

function renderKeyboard() {
  KB_LAYOUT.forEach((row, idx) => {
    const rowEl = document.getElementById(`kb-row-${idx + 1}`);
    rowEl.innerHTML = '';
    row.forEach(key => {
      const btn = document.createElement('button');
      let wideClass = key === 'ENTER' || key === 'DELETE' ? 'px-3 text-xs font-bold bg-slate-700' : 'w-8 sm:w-10 text-sm font-semibold bg-slate-700';
      btn.className = `${wideClass} h-12 rounded flex items-center justify-center text-slate-100 hover:bg-slate-600 active:scale-95 transition-all select-none key-${key}`;
      btn.innerHTML = key === 'DELETE' ? '<i class="fa-solid fa-backspace"></i>' : key;
      btn.addEventListener('click', () => handleKeyPress(key));
      rowEl.appendChild(btn);
    });
  });
}

function handleKeyPress(key) {
  if (isGameOver) return;
  if (key === 'ENTER') submitGuess();
  else if (key === 'DELETE' || key === 'BACKSPACE') deleteLetter();
  else if (/^[A-Z]$/.test(key) && currentTile < 5) addLetter(key);
}

function addLetter(letter) {
  sfx.keyPress();
  boardState[currentRow][currentTile] = letter;
  const front = document.getElementById(`tile-${currentRow}-${currentTile}`).querySelector('.tile-front');
  front.innerText = letter;
  front.classList.remove('border-slate-700');
  front.classList.add('border-slate-500', 'pop');
  setTimeout(() => front.classList.remove('pop'), 120);
  currentTile++;
}

function deleteLetter() {
  if (currentTile === 0) return;
  sfx.deleteKey();
  currentTile--;
  boardState[currentRow][currentTile] = "";
  const front = document.getElementById(`tile-${currentRow}-${currentTile}`).querySelector('.tile-front');
  front.innerText = "";
  front.classList.remove('border-slate-500');
  front.classList.add('border-slate-700');
}

function submitGuess() {
  if (currentTile < 5) {
    sfx.invalid();
    showToast("Not enough letters");
    const rowEl = document.querySelector(`.row-${currentRow}`);
    rowEl.classList.add('shake');
    setTimeout(() => rowEl.classList.remove('shake'), 400);
    return;
  }

  const guess = boardState[currentRow].join("");
  const targetArr = targetWord.split("");
  const guessArr = guess.split("");
  const statuses = Array(5).fill("absent");
  const letterCounts = {};

  targetArr.forEach(l => letterCounts[l] = (letterCounts[l] || 0) + 1);

  guessArr.forEach((l, idx) => {
    if (l === targetArr[idx]) { statuses[idx] = "correct"; letterCounts[l]--; }
  });

  guessArr.forEach((l, idx) => {
    if (statuses[idx] !== "correct" && letterCounts[l] > 0) { statuses[idx] = "present"; letterCounts[l]--; }
  });

  guessArr.forEach((letter, i) => {
    setTimeout(() => {
      sfx.flip();
      const tileInner = document.getElementById(`tile-${currentRow}-${i}`);
      const back = tileInner.querySelector('.tile-back');
      let bgClass = "bg-slate-600";
      if (statuses[i] === "correct") bgClass = "bg-emerald-600";
      else if (statuses[i] === "present") bgClass = "bg-amber-600";

      back.className = `tile-back text-white ${bgClass}`;
      back.innerText = letter;
      tileInner.classList.add('flip');

      updateKeyboardKey(letter, statuses[i]);
      if (i === 4) checkGameEnd(guess);
    }, i * 250);
  });
}

function updateKeyboardKey(letter, status) {
  const btn = document.querySelector(`.key-${letter}`);
  if (!btn) return;
  if (status === 'correct') btn.className = btn.className.replace(/bg-\w+-\d+/, '') + ' bg-emerald-600 text-white';
  else if (status === 'present' && !btn.classList.contains('bg-emerald-600')) btn.className = btn.className.replace(/bg-\w+-\d+/, '') + ' bg-amber-600 text-white';
  else if (status === 'absent' && !btn.classList.contains('bg-emerald-600') && !btn.classList.contains('bg-amber-600')) btn.className = btn.className.replace(/bg-\w+-\d+/, '') + ' bg-slate-800 text-slate-500';
}

function checkGameEnd(guess) {
  if (guess === targetWord) {
    isGameOver = true;
    sfx.victory();
    const coinReward = window.WordleTunables ? window.WordleTunables.calculateCoinReward(25) : 25;
    userData.coins += coinReward;
    saveUserData();
    triggerConfetti();
    saveStats(true);
    setTimeout(() => { showToast(`Splendid! +${coinReward} Coins`); openModal('stats-modal'); }, 1200);
  } else if (currentRow === maxRows - 1) {
    isGameOver = true;
    saveStats(false);
    setTimeout(() => { showToast(`Word was: ${targetWord}`); openModal('stats-modal'); }, 1200);
  } else {
    currentRow++;
    currentTile = 0;
  }
}

function buyPowerUp(type, cost) {
  if (userData.coins < cost) { showToast("Not enough coins!"); return; }
  userData.coins -= cost;
  userData.powerups[type]++;
  saveUserData();
  showToast(`Purchased ${type.toUpperCase()}!`);
}

document.getElementById('powerup-reveal').addEventListener('click', () => {
  if (userData.powerups.reveal <= 0 || isGameOver) return;
  const unrevealedIdx = targetWord.split("").findIndex((l, idx) => boardState[currentRow][idx] !== l);
  if (unrevealedIdx !== -1) {
    userData.powerups.reveal--;
    saveUserData();
    showToast(`Revealed: Index ${unrevealedIdx + 1} is '${targetWord[unrevealedIdx]}'`);
  }
});

document.getElementById('powerup-eliminate').addEventListener('click', () => {
  if (userData.powerups.eliminate <= 0 || isGameOver) return;
  const unusedKeys = KB_LAYOUT.flat().filter(k => k.length === 1 && !targetWord.includes(k));
  let removed = 0;
  unusedKeys.forEach(k => {
    const btn = document.querySelector(`.key-${k}`);
    if (btn && !btn.classList.contains('opacity-20') && removed < 3) {
      btn.classList.add('opacity-20', 'pointer-events-none');
      removed++;
    }
  });
  if (removed > 0) {
    userData.powerups.eliminate--;
    saveUserData();
    showToast("Eliminated 3 wrong keys!");
  }
});

document.getElementById('powerup-row').addEventListener('click', () => {
  if (userData.powerups.row <= 0 || isGameOver) return;
  userData.powerups.row--;
  maxRows++;
  boardState.push(Array(5).fill(""));
  renderBoard();
  saveUserData();
  showToast("+1 Extra Guess Row Added!");
});

document.getElementById('auth-save-btn').addEventListener('click', async () => {
  const username = document.getElementById('auth-username').value.trim();
  const pin = document.getElementById('auth-pin').value.trim();
  if (!username || !pin) { showToast("Enter username and PIN"); return; }
  userData.usernameHash = await hashSHA256(username.toLowerCase());
  userData.pinHash = await hashSHA256(pin);
  userData.rawUsername = username;
  saveUserData();
  updateAuthUI();
  showToast("Profile Hashed & Saved!");
});

document.getElementById('auth-logout-btn').addEventListener('click', () => {
  userData.usernameHash = ""; userData.pinHash = ""; userData.rawUsername = "";
  saveUserData();
  updateAuthUI();
  showToast("Profile Cleared");
});

function updateAuthUI() {
  if (userData.usernameHash) {
    document.getElementById('auth-form').classList.add('hidden');
    document.getElementById('auth-status').classList.remove('hidden');
    document.getElementById('user-display-name').innerText = userData.rawUsername;
    document.getElementById('user-hash-display').innerText = `SHA-256: ${userData.usernameHash.substring(0, 24)}...`;
  } else {
    document.getElementById('auth-form').classList.remove('hidden');
    document.getElementById('auth-status').classList.add('hidden');
  }
}

// Left Drawer Controls
const drawerOverlay = document.getElementById('drawer-overlay');
const leftDrawer = document.getElementById('left-drawer');
function openDrawer() { drawerOverlay.classList.remove('hidden'); setTimeout(() => leftDrawer.classList.remove('-translate-x-full'), 10); }
function closeDrawer() { leftDrawer.classList.add('-translate-x-full'); setTimeout(() => drawerOverlay.classList.add('hidden'), 300); }
document.getElementById('hamburger-btn').addEventListener('click', openDrawer);
document.getElementById('close-drawer-btn').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', (e) => { if (e.target === drawerOverlay) closeDrawer(); });

document.getElementById('drawer-sound-toggle').addEventListener('click', (e) => {
  sfx.muted = !sfx.muted;
  e.target.innerText = sfx.muted ? "OFF" : "ON";
  e.target.className = sfx.muted ? "text-rose-400 font-bold text-xs bg-slate-700 px-2.5 py-1 rounded" : "text-emerald-400 font-bold text-xs bg-slate-700 px-2.5 py-1 rounded";
});

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xl opacity-0 transition-opacity duration-300';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.remove('opacity-0'), 10);
  setTimeout(() => { toast.classList.add('opacity-0'); setTimeout(() => toast.remove(), 300); }, 2000);
}

function triggerConfetti() { if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); }
function saveStats(won) {
  stats.played++;
  if (won) { stats.wins++; stats.streak++; stats.maxStreak = Math.max(stats.streak, stats.maxStreak); }
  else { stats.streak = 0; }
  saveUserData();
  updateStatsDisplay();
}

function updateStatsDisplay() {
  document.getElementById('stat-played').innerText = stats.played;
  document.getElementById('stat-winpct').innerText = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  document.getElementById('stat-streak').innerText = stats.streak;
  document.getElementById('stat-maxstreak').innerText = stats.maxStreak;
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// Expose context for update.js
window._gameContext = {
  get userData() { return userData; },
  getTargetWord: () => targetWord,
  saveUserData: () => saveUserData(),
  forceWin: () => {
    boardState[currentRow] = targetWord.split("");
    for(let i=0; i<5; i++) {
      const front = document.getElementById(`tile-${currentRow}-${i}`).querySelector('.tile-front');
      front.innerText = targetWord[i];
    }
    submitGuess();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initGame();
  updateAuthUI();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleKeyPress('ENTER');
    else if (e.key === 'Backspace') handleKeyPress('DELETE');
    else { const key = e.key.toUpperCase(); if (/^[A-Z]$/.test(key)) handleKeyPress(key); }
  });

  document.getElementById('help-btn').addEventListener('click', () => openModal('help-modal'));
  document.getElementById('stats-btn').addEventListener('click', () => openModal('stats-modal'));
  document.getElementById('store-btn').addEventListener('click', () => openModal('store-modal'));
  document.getElementById('profile-btn').addEventListener('click', () => openModal('user-modal'));

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal('help-modal'); closeModal('stats-modal'); closeModal('store-modal'); closeModal('user-modal');
    });
  });

  document.getElementById('play-again-btn').addEventListener('click', () => { closeModal('stats-modal'); initGame(); });
});