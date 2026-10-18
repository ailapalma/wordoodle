// Wrap game runtime inside IIFE closure scope
(function () {
  'use strict';

  // State variables are local to this closure and completely inaccessible to window.*
  let targetWord = "";
  let maxRows = 6;
  let currentRow = 0;
  let currentTile = 0;
  let isGameOver = false;

  // Freeze the target word array to prevent memory mutation
  const TARGET_WORDS = Object.freeze([
    "CABLE", "MATCH", "SMART", "FLASH", "DRIVE", "CRANE", "SLATE", "PLANT",
    "GHOST", "BLAST", "BRAIN", "LIGHT", "DREAM", "STORM", "SHARK", "SHINE",
    "CHAIR", "POWER", "FLAME", "SWEET", "TRACK", "BOUND", "FLUID", "CROWN"
  ]);

  // Keep internal game logic secure inside this scope...
  function initGame() {
    targetWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
    currentRow = 0;
    currentTile = 0;
    isGameOver = false;
    // ... game initialization logic ...
  }

  document.addEventListener('DOMContentLoaded', initGame);
})();
