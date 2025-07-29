// intro.js - Manages the opening cinematic sequence.

export function startOpening(game) {
    game.elements.startScreen.style.display = 'none';
    game.state.phase = 'opening';
    game.openingState = {
        startTime: performance.now(), phase: 'approach', phaseStartTime: performance.now(), lineIndex: 0,
        dialogueLines: ["Math. Math never changes.", "It has been said that God is a mathematician.", "True, and He noticed your skills!", "But you didn't do enough sucking up.", "Now you pay!"]
    };
    game.elements.narratorContainer.style.display = 'block';
    game.elements.narratorContainer.style.transform = `translate(-50%, -50%) scale(0.03)`;
    game.elements.narratorContainer.style.opacity = 0;
}

export function updateOpening(game, time) {
    const os = game.openingState;
    const phaseElapsed = time - os.phaseStartTime;

    if (os.phase === 'approach') {
        const progress = Math.min(phaseElapsed / 6000, 1);
        const scale = 0.03 + (1 - 0.03) * progress;
        game.elements.narratorContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
        game.elements.narratorContainer.style.opacity = Math.min(progress * 2, 1);
        if (progress >= 1) { 
            os.phase = 'dialogue'; 
            os.phaseStartTime = time; 
            showNextLine(game); 
        }
    } else if (os.phase === 'dialogue') {
        if (phaseElapsed >= 8000) { 
            os.phase = 'transform'; 
            os.phaseStartTime = time; 
            transformToEvil(game); 
        }
    } else if (os.phase === 'transform') {
        if (phaseElapsed >= 2000) { 
            os.phase = 'complete'; 
            game.startGame(); 
        }
    }
}

function showNextLine(game) {
    const os = game.openingState;
    if (os.lineIndex < os.dialogueLines.length) {
        game.elements.voiceoverText.textContent = os.dialogueLines[os.lineIndex++];
        game.elements.voiceoverText.style.opacity = 1;
        game.elements.voiceoverText.style.display = 'block';
        if (os.lineIndex < os.dialogueLines.length) {
            setTimeout(() => { if (os.phase === 'dialogue') showNextLine(game); }, 1500);
        }
    }
}

function transformToEvil(game) {
    game.elements.narratorContainer.style.animation = 'shake 0.5s ease-in-out 3';
    game.elements.voiceoverText.style.opacity = 0;
    game.elements.fireCanvas.style.opacity = 1;
    setTimeout(() => { 
        game.elements.narratorFace.style.transition = 'none';
        game.elements.narratorThumbs.style.transition = 'none';
        game.elements.narratorFace.textContent = '😠'; 
        game.elements.narratorThumbs.textContent = '👎';
        // Force a reflow to apply style changes immediately before re-enabling transitions
        void game.elements.narratorFace.offsetWidth;
        void game.elements.narratorThumbs.offsetWidth;
    }, 500);
}
