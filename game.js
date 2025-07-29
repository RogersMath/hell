// game.js - Main game controller with corrected module imports.

import { DOM_ELEMENTS, resizeAll } from './utils.js';
import { initInput } from './input.js';
import { startOpening, updateOpening } from './intro.js';
// CORRECTED: Importing ONLY visual effects from effects.js
import { initWebGL, renderWebGL } from './effects.js'; 
// CORRECTED: Importing ALL audio functions from audio.js
import { initAudio, playBackgroundMusic, playTone } from './audio.js';
import { updateEnemies, spawnBoss, updateBoss, drawEnemies, fireProjectile, updateProjectiles, drawProjectiles } from './enemies.js';

class Game {
    constructor() {
        this.config = {
            MAX_ENEMIES: 3, BOSS_TRIGGER_SCORE: 1500, BOSS_HP: 6, BOSS_APPROACH_DURATION: 15000,
            ENEMY_SPAWN_INTERVAL_BASE: 1000, ENEMY_SPAWN_LEVEL_SCALAR: 0.95, ENEMY_BASE_SPEED: 0.00005,
            ENEMY_TOUGH_SPEED_MODIFIER: 0.6, ENEMY_LEVEL_SPEED_SCALAR: 1.08, ENEMY_BASE_HP: 1,
            ENEMY_TOUGH_HP_BONUS: 3, ENEMY_LEVEL_HP_SCALAR: 0.5, TOUGH_ENEMY_CHANCE_BASE: 0.1,
            TOUGH_ENEMY_CHANCE_LEVEL_SCALAR: 0.02, PROJECTILE_SPEED: 0.04, SCORE_PER_CORRECT_ANSWER: 10,
            SCORE_PER_KILL: 50, SCORE_PER_TOUGH_KILL: 250, SCORE_TO_LEVEL_UP: 500
        };

        this.elements = DOM_ELEMENTS;
        this.ctx = this.elements.gameCanvas.getContext('2d');
        this.gameLoop = this.gameLoop.bind(this);
        this.audioInitialized = false;
    }

    init() {
        this.state = { phase: 'menu', animationFrameId: null };
        initWebGL(this.elements.fireCanvas);
        resizeAll();
        window.addEventListener('resize', resizeAll);
        initInput(this); // Pass the game instance to the input handler
        
        this.state.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
    
    initializeAudio() {
        if (this.audioInitialized) return;
        initAudio();
        playBackgroundMusic();
        this.audioInitialized = true;
    }

    startOpening() {
        this.initializeAudio();
        startOpening(this);
    }

    startGame() {
        this.initializeAudio();
        this.elements.startScreen.style.display = 'none';
        this.elements.gameOverScreen.style.display = 'none';
        this.elements.narratorContainer.style.display = 'none';
        this.elements.voiceoverText.style.display = 'none';
        this.elements.bossContainer.style.display = 'none';
        this.elements.bossContainer.style.animation = '';
        this.elements.gameOverScreen.querySelector('.modal-title').textContent = "You Have Perished";
        this.elements.fireCanvas.style.opacity = 1;
        this.elements.uiOverlay.style.visibility = 'visible';
        this.elements.bottomUi.style.visibility = 'visible';
        this.state = {
            ...this.state,
            phase: 'playing', paused: false, gameOver: false, score: 0, level: 1, currentAnswer: null,
            enemies: [], projectiles: [], lastSpawnTime: performance.now(), lastTime: performance.now(),
            bossActive: false, bossObject: null
        };
        this.updateUI();
        fireProjectile(this, true); // Generate the first problem
    }

    gameLoop(time) {
        // Always render the background
        renderWebGL(time);
        
        // Stop the loop if we are in a terminal state
        if (this.state.phase === 'gameOver' || this.state.phase === 'menu') {
            requestAnimationFrame(this.gameLoop);
            return;
        }

        const deltaTime = time - (this.state.lastTime || time);
        
        if (this.state.phase === 'opening') {
            updateOpening(this, time);
        } else if (this.state.phase === 'playing' && !this.state.paused) {
            this.updatePlaying(time, deltaTime);
            this.draw();
        }
        
        this.state.lastTime = time;
        requestAnimationFrame(this.gameLoop);
    }
    
    updatePlaying(time, deltaTime) {
        if (!this.state.bossActive && this.state.score >= this.config.BOSS_TRIGGER_SCORE) {
            spawnBoss(this);
            playTone(100, 1.5, 'sawtooth');
        }

        if (this.state.bossActive) {
            updateBoss(this, time);
        } else {
            updateEnemies(this, deltaTime);
        }
        updateProjectiles(this);
        this.updateUI();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.elements.gameCanvas.width, this.elements.gameCanvas.height);
        drawEnemies(this);
        drawProjectiles(this);
    }
    
    triggerGameOver() { 
        if (this.state.gameOver) return; 
        this.state.phase = 'gameOver'; 
        this.state.gameOver = true; 
        this.elements.finalScore.textContent = this.state.score; 
        this.elements.gameOverScreen.style.display = 'flex'; 
        playTone(150, 2, 'sawtooth');
    }
    
    triggerGameWin() { 
        if (this.state.gameOver) return; 
        this.state.phase = 'gameOver'; 
        this.state.gameOver = true; 
        this.elements.finalScore.textContent = this.state.score; 
        this.elements.gameOverScreen.querySelector('.modal-title').textContent = "HELL IS CONQUERED"; 
        this.elements.gameOverScreen.style.display = 'flex'; 
        this.elements.bossContainer.style.transition = 'opacity .5s, transform .5s'; 
        this.elements.bossContainer.style.opacity = 0; 
        this.elements.bossContainer.style.transform = 'translate(-50%,-50%) scale(0)'; 
        playTone(880, 2, 'sine');
    }
    
    updateUI() { 
        this.elements.scoreDisplay.textContent = `Score: ${this.state.score}`; 
        const newLevel = Math.floor(this.state.score / this.config.SCORE_TO_LEVEL_UP) + 1; 
        if (newLevel > this.state.level) { 
            this.state.level = newLevel; 
            this.elements.levelDisplay.textContent = `Level: ${this.state.level}`; 
            playTone(440, 0.5, 'triangle');
        } 
    }
}

// Entry point for the application
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
