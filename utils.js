// utils.js - Shared constants and helper functions.

// --- DOM Element Cache ---
export const DOM_ELEMENTS = {
    fireCanvas: document.getElementById('fireCanvas'), 
    gameCanvas: document.getElementById('gameCanvas'),
    uiOverlay: document.getElementById('ui-overlay'), 
    bottomUi: document.getElementById('bottom-ui'),
    problemDisplay: document.getElementById('problem-display'), 
    keypadButtons: document.querySelectorAll('.keypad-btn'),
    scoreDisplay: document.getElementById('score-display'), 
    levelDisplay: document.getElementById('level-display'),
    startScreen: document.getElementById('startScreen'), 
    pauseScreen: document.getElementById('pauseScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'), 
    finalScore: document.getElementById('finalScore'),
    startBtn: document.getElementById('start-btn'), 
    skipBtn: document.getElementById('skip-btn'),
    resetBtn: document.getElementById('reset-btn'), 
    settingsBtn: document.getElementById('settings-btn'),
    resumeBtn: document.getElementById('resume-btn'), 
    bossContainer: document.getElementById('boss-container'),
    narratorContainer: document.getElementById('narrator-container'), 
    voiceoverText: document.getElementById('voiceover-text'),
    narratorFace: document.getElementById('narrator-face'), 
    narratorThumbs: document.getElementById('narrator-thumbs')
};

// --- Helper Functions ---
export function resizeAll() { 
    const dpr = window.devicePixelRatio || 1; 
    const rect = DOM_ELEMENTS.gameCanvas.getBoundingClientRect(); 
    [DOM_ELEMENTS.gameCanvas, DOM_ELEMENTS.fireCanvas].forEach(c => { 
        c.width = rect.width * dpr; 
        c.height = rect.height * dpr; 
    }); 
}

export function lerp(a, b, t) {
    return a + (b - a) * t;
}
