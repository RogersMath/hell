// audio.js - Handles Web Audio API initialization, music playback, and sound effects.

import { generateSong } from './sonantx.js';

let audioContext;
let masterGain;
let musicBufferSource = null;

export function initAudio() {
    if (audioContext) {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return;
    } 
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.3; // Default volume
        masterGain.connect(audioContext.destination);

        document.getElementById('volumeSlider').addEventListener('input', e => {
            if (masterGain) {
                masterGain.gain.value = e.target.value / 100;
            }
        });
        
        console.log("Audio Context Initialized.");

    } catch (e) {
        console.error('Web Audio API initialization failed:', e);
    }
}

export async function playBackgroundMusic() {
    if (!audioContext || musicBufferSource) {
        return;
    }
    
    try {
        const response = await fetch('music.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch music.json: ${response.statusText}`);
        }
        const songData = await response.json();
        
        const buffer = await generateSong(songData, audioContext.sampleRate);
        
        musicBufferSource = audioContext.createBufferSource();
        musicBufferSource.buffer = buffer;
        musicBufferSource.loop = true;
        musicBufferSource.connect(masterGain);
        musicBufferSource.start();
        console.log("Background music started.");

    } catch (e) {
        console.error('Background music failed to load:', e);
    }
}

export function playTone(freq, dur, type) {
    if (!audioContext || !masterGain) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + dur);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + dur + 0.1);
}
