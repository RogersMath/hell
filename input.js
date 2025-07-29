// input.js - Manages all user input and event handling.

import { playTone } from './audio.js';
import { fireProjectile } from './enemies.js';

let lastAnswerTime = 0;

export function initInput(game) {
    game.elements.startBtn.addEventListener('click', () => game.startOpening());
    game.elements.skipBtn.addEventListener('click', () => game.startGame());
    game.elements.resetBtn.addEventListener('click', () => game.startGame());
    game.elements.settingsBtn.addEventListener('click', () => togglePause(game));
    game.elements.resumeBtn.addEventListener('click', () => togglePause(game));

    game.elements.keypadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleAnswer(game, parseInt(btn.dataset.value));
        });
    });

    document.addEventListener('keydown', e => { 
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
        
        if (e.key >= '1' && e.key <= '9') {
            e.preventDefault();
            handleAnswer(game, parseInt(e.key));
        }
        
        const numpadMap = {
            'Numpad7': 7, 'Numpad8': 8, 'Numpad9': 9, 
            'Numpad4': 4, 'Numpad5': 5, 'Numpad6': 6, 
            'Numpad1': 1, 'Numpad2': 2, 'Numpad3': 3
        };
        if (numpadMap[e.code]) {
            e.preventDefault();
            handleAnswer(game, numpadMap[e.code]);
        }
    });
}

function handleAnswer(game, answer) {
    if (game.state.phase !== 'playing' || game.state.paused || !game.state.currentAnswer) return; 

    const now = performance.now();
    if (now - lastAnswerTime < 200) return; // Debounce input
    lastAnswerTime = now;
    
    const button = Array.from(game.elements.keypadButtons).find(b => parseInt(b.dataset.value) === answer); 
    
    if (answer === game.state.currentAnswer) { 
        game.state.score += game.config.SCORE_PER_CORRECT_ANSWER; 
        fireProjectile(game, false); 
        if (button) {
            button.classList.add('correct'); 
            setTimeout(() => button.classList.remove('correct'), 300); 
        }
        playTone(660, 0.1, 'square'); // Correct answer sound
    } else { 
        document.body.style.animation = "shake 0.3s ease-in-out"; 
        setTimeout(() => document.body.style.animation = "", 300); 
        if (button) {
            button.classList.add('incorrect'); 
            setTimeout(() => button.classList.remove('incorrect'), 400); 
        }
        playTone(220, 0.2, 'sawtooth'); // Incorrect answer sound
    } 
}

function togglePause(game) { 
    if (game.state.phase !== 'playing' || game.state.gameOver) return; 
    game.initializeAudio(); // Ensure audio context is active
    game.state.paused = !game.state.paused; 
    game.elements.pauseScreen.style.display = game.state.paused ? 'flex' : 'none'; 
    if (!game.state.paused) {
        game.state.lastTime = performance.now(); 
    }
}
