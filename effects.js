// This file combines WebGL rendering, SonantX music generation, and audio playback.

// --- MUSIC DATA (from music.json) ---
const songData = {
    "rowLen": 5513, "endPattern": 16, "songData": [
        {"osc1_oct": 7, "osc1_det": 0, "osc1_detune": 0, "osc1_xenv": 1, "osc1_vol": 255, "osc1_waveform": 0, "osc2_oct": 7, "osc2_det": 0, "osc2_detune": 0, "osc2_xenv": 1, "osc2_vol": 255, "osc2_waveform": 0, "noise_fader": 0, "env_attack": 50, "env_sustain": 150, "env_release": 4800, "env_master": 200, "fx_filter": 2, "fx_freq": 600, "fx_resonance": 254, "fx_delay_time": 0, "fx_delay_amt": 0, "fx_pan_freq": 0, "fx_pan_amt": 0, "lfo_osc1_freq": 0, "lfo_fx_freq": 0, "lfo_freq": 0, "lfo_amt": 0, "lfo_waveform": 0, "p": [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], "c": [{"n": [122,0,0,122,0,0,0,0,0,0,0,0,0,0,0,122,0,0,122,0,0,0,0,0,0,0,0,0,0,0,0,0]}]},
        {"osc1_oct": 8, "osc1_det": 0, "osc1_detune": 0, "osc1_xenv": 0, "osc1_vol": 0, "osc1_waveform": 0, "osc2_oct": 8, "osc2_det": 0, "osc2_detune": 0, "osc2_xenv": 0, "osc2_vol": 0, "osc2_waveform": 0, "noise_fader": 75, "env_attack": 100000, "env_sustain": 100000, "env_release": 100000, "env_master": 192, "fx_filter": 4, "fx_freq": 2500, "fx_resonance": 16, "fx_delay_time": 2, "fx_delay_amt": 157, "fx_pan_freq": 1, "fx_pan_amt": 88, "lfo_osc1_freq": 0, "lfo_fx_freq": 1, "lfo_freq": 2, "lfo_amt": 51, "lfo_waveform": 0, "p": [2,2,2,2,2,2,2,2,2,2,2,2,2,2], "c": [{"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]},
        {"osc1_oct": 7, "osc1_det": 0, "osc1_detune": 0, "osc1_xenv": 0, "osc1_vol": 255, "osc1_waveform": 2, "osc2_oct": 8, "osc2_det": 0, "osc2_detune": 18, "osc2_xenv": 0, "osc2_vol": 255, "osc2_waveform": 2, "noise_fader": 0, "env_attack": 100000, "env_sustain": 56363, "env_release": 100000, "env_master": 199, "fx_filter": 2, "fx_freq": 200, "fx_resonance": 254, "fx_delay_time": 8, "fx_delay_amt": 24, "fx_pan_freq": 0, "fx_pan_amt": 0, "lfo_osc1_freq": 0, "lfo_fx_freq": 0, "lfo_freq": 0, "lfo_amt": 0, "lfo_waveform": 0, "p": [0,3,0,4,0,3,0,4,0,3,0,4,0,3], "c": [{"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [116,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]},
        {"osc1_oct": 9, "osc1_det": 0, "osc1_detune": 0, "osc1_xenv": 0, "osc1_vol": 255, "osc1_waveform": 0, "osc2_oct": 9, "osc2_det": 0, "osc2_detune": 12, "osc2_xenv": 0, "osc2_vol": 255, "osc2_waveform": 0, "noise_fader": 0, "env_attack": 100, "env_sustain": 0, "env_release": 14545, "env_master": 70, "fx_filter": 0, "fx_freq": 0, "fx_resonance": 240, "fx_delay_time": 2, "fx_delay_amt": 157, "fx_pan_freq": 3, "fx_pan_amt": 47, "lfo_osc1_freq": 0, "lfo_fx_freq": 0, "lfo_freq": 0, "lfo_amt": 0, "lfo_waveform": 0, "p": [0,0,0,0,0,0,0,5,0,0,0,5], "c": [{"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}, {"n": [147,0,0,0,147,0,0,0,147,0,0,0,147,0,0,0,143,0,0,0,143,0,0,0,143,0,0,0,0,0,0,0]}]}
    ], "songLen": 65
};


// --- AUDIO ---
let audioContext;
let masterGain;

export function initAudio() {
    if (audioContext) return;
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.3;
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
    if (!audioContext) {
        console.error("Audio not initialized. Cannot play music.");
        return;
    }
    try {
        const buffer = await generateSong(songData, audioContext.sampleRate);
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.loop = true;
        bufferSource.connect(masterGain);
        bufferSource.start();
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

// --- SONANTX ---
// ... (The entire SonantX library code from your example goes here)
function osc_sin(value){return Math.sin(value*6.283184)}function osc_square(value){return osc_sin(value)<0?-1:1}function osc_saw(value){return(value%1)-.5}function osc_tri(value){var v2=(value%1)*4;return v2<2?v2-1:3-v2}
const oscillators=[osc_sin,osc_square,osc_saw,osc_tri];function getnotefreq(c,n){return .00390625*Math.pow(1.059463094,n-128)*c.sampleRate/44100}
class SoundWriter{constructor(c,i,n,b){this.audioCtx=c;this.instr=i;this.n=n;this.bpm=b;this.c1=0;this.c2=0;this.low=0;this.band=0;this.j=0}
write(l,r,f){for(var i=this.instr,n=this.n,c=f,t=oscillators[i.lfo_waveform],h=oscillators[i.osc1_waveform],s=oscillators[i.osc2_waveform],o=Math.pow(2,i.fx_pan_freq-8)/(60*this.audioCtx.sampleRate/4/this.bpm),d=Math.pow(2,i.lfo_freq-8)/(60*this.audioCtx.sampleRate/4/this.bpm),u=i.env_attack/44100*this.audioCtx.sampleRate,v=i.env_release/44100*this.audioCtx.sampleRate,p=i.env_sustain/44100*this.audioCtx.sampleRate,x=getnotefreq(this.audioCtx,n+(i.osc1_oct-8)*12+i.osc1_det)*(1+.0008*i.osc1_detune),g=getnotefreq(this.audioCtx,n+(i.osc2_oct-8)*12+i.osc2_det)*(1+.0008*i.osc2_detune),m=i.fx_resonance/255;this.j<u+p+v&&c<l.length;){var w=t(this.j*d)*i.lfo_amt/512+.5,e=1;this.j<u?e=this.j/u:this.j>=u+p&&(e-=(this.j-u-p)/v);var a=x;i.lfo_osc1_freq&&(a+=w),i.osc1_xenv&&(a*=e*e),this.c1+=a;var b=h(this.c1)*i.osc1_vol;a=g,i.osc2_xenv&&(a*=e*e),this.c2+=a,b+=s(this.c2)*i.osc2_vol,i.noise_fader&&(b+=(2*Math.random()-1)*i.noise_fader*e),b*=e/255;var k=i.fx_freq;i.lfo_fx_freq&&(k*=w),k=1.5*Math.sin(k*3.141592/this.audioCtx.sampleRate),this.low+=k*this.band;var y=m*(b-this.band)-this.low;switch(this.band+=k*y,i.fx_filter){case 1:b=y;break;case 2:b=this.low;break;case 3:b=this.band;break;case 4:b=this.low+y}a=osc_sin(this.j*o)*i.fx_pan_amt/512+.5,b*=39*i.env_master;var z=32768+b*(1-a),A=z&255,B=(z>>8)&255,C=4*(A+(B<<8)-32768);l[c]+=((C=C<-32768?-32768:C>32767?32767:C)/32768);var z=32768+b*a,A=z&255,B=(z>>8)&255,C=4*(A+(B<<8)-32768);r[c]+=((C=C<-32768?-32768:C>32767?32767:C)/32768),this.j++,c++}return c<l.length?!0:!1}}
class MusicGenerator{constructor(c,s){this.audioCtx=c,this.song=s;var t=c.createGain();t.gain.value=1,this.tracks=[],this.song.songData.forEach(e=>{var i=new class{constructor(c,i,n,t){n=n||118,t=t||i.p.length-1,this.audioCtx=c,this.instr=i,this.bpm=n,this.endPattern=t;var h=c.createOscillator(),s=c.createGain();s.gain.value=0,h.connect(s);var o=c.createScriptProcessor(512,2,2);s.connect(o);let d=0,u=0,v=[];o.onaudioprocess=c=>{for(var t=c.inputBuffer,h=c.outputBuffer,s=h.getChannelData(0),p=h.getChannelData(1),x=s.set(t.getChannelData(0)),g=p.set(t.getChannelData(1)),m=v.slice(),w=0;w<m.length;w++)m[w].write(s,p,0)&&(v=v.filter(c=>c!==m[w]));let e=u*(60*this.audioCtx.sampleRate/4/this.bpm);for(;e>=d&&e<d+t.length;){var a=i.p[Math.floor(u/32)%(this.endPattern+1)]||0,b=0==a?0:i.c[a-1].n[u%32]||0;if(0!=b){var k=new SoundWriter(this.audioCtx,i,b,this.bpm);k.write(s,p,e-d),v.push(k)}u++,e=u*(60*this.audioCtx.sampleRate/4/this.bpm)}d+=t.length};var p=i.fx_delay_time*this.bpm/60/8,x=i.fx_delay_amt/255,g=c.createGain();g.gain.value=x,o.connect(g);var m=c.createDelay();m.delayTime.value=p,g.connect(m),m.connect(g);var w=c.createGain();w.gain.value=1,o.connect(w),m.connect(w),this.chain=[h,s,o,g,m,w]}start(c){this.chain[0].start(c)}stop(c){this.chain[0].stop(c),this.chain[this.chain.length-1].disconnect()}connect(c){this.chain[this.chain.length-1].connect(c)}}(this.audioCtx,e,this.bpm,this.song.endPattern);track.connect(t),this.tracks.push(track)}),this.chain=[this.tracks,t]}get bpm(){return 60*44100/4/this.song.rowLen}start(c){c=c||this.audioCtx.currentTime,this.tracks.forEach(t=>t.start(c))}stop(c){c=c||this.audioCtx.currentTime,this.tracks.forEach(t=>t.stop(c)),this.chain[this.chain.length-1].disconnect()}connect(c){this.chain[this.chain.length-1].connect(c)}}
async function generateSong(s,r){var t=s.songLen,c=new OfflineAudioContext(2,t*r,r),i=new MusicGenerator(c,s);return i.connect(c.destination),i.start(),await c.startRendering()}


// --- WEBGL ---
let gl, webgl;

export function initWebGL(canvas) {
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webgl = {};
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const isWebGL2 = gl instanceof WebGL2RenderingContext;
    const vertexShaderSource = isWebGL2 ? `#version 300 es
in vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }` : `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

    const fragmentShaderSource = isWebGL2 ? `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 u_resolution;
uniform float u_time;
float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float noise(vec2 st){vec2 i=floor(st);vec2 f=fract(st);float a=random(i);float b=random(i+vec2(1.,0.));float c=random(i+vec2(0.,1.));float d=random(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float fbm(vec2 st){float v=0.;float a=.5;for(int i=0;i<6;++i){v+=a*noise(st);st*=2.;a*=.5;}return v;}
void main(){vec2 p=gl_FragCoord.xy/u_resolution;float t=u_time*.5;vec2 n=p+vec2(0.,-t*.5);float u=fbm(n*4.+t*.1);float v=fbm(n*3.+vec2(0.,u*.2));float s=pow(1.-p.y,1.5);float f=v*s;vec3 c=mix(vec3(.1,0.,0.),vec3(1.,.4,0.),smoothstep(.1,.45,f));c=mix(c,vec3(1.,.9,0.),smoothstep(.45,.6,f));outColor=vec4(c,smoothstep(.1,.3,f));}` : `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float noise(vec2 st){vec2 i=floor(st);vec2 f=fract(st);float a=random(i);float b=random(i+vec2(1.,0.));float c=random(i+vec2(0.,1.));float d=random(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}
float fbm(vec2 st){float v=0.;float a=.5;for(int i=0;i<6;++i){v+=a*noise(st);st*=2.;a*=.5;}return v;}
void main(){vec2 p=gl_FragCoord.xy/u_resolution;float t=u_time*.5;vec2 n=p+vec2(0.,-t*.5);float u=fbm(n*4.+t*.1);float v=fbm(n*3.+vec2(0.,u*.2));float s=pow(1.-p.y,1.5);float f=v*s;vec3 c=mix(vec3(.1,0.,0.),vec3(1.,.4,0.),smoothstep(.1,.45,f));c=mix(c,vec3(1.,.9,0.),smoothstep(.45,.6,f));gl_FragColor=vec4(c,smoothstep(.1,.3,f));}`;

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    webgl.program = createProgram(vs, fs);
    webgl.resUni = gl.getUniformLocation(webgl.program, 'u_resolution');
    webgl.timeUni = gl.getUniformLocation(webgl.program, 'u_time');
    
    const posAttr = gl.getAttribLocation(webgl.program, 'a_position');
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    
    if (isWebGL2) {
        webgl.vao = gl.createVertexArray();
        gl.bindVertexArray(webgl.vao);
    }
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    webgl.isWebGL2 = isWebGL2;
}

export function renderWebGL(time) {
    if (!gl || !webgl.program) return;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(webgl.program);
    if (webgl.isWebGL2) {
        gl.bindVertexArray(webgl.vao);
    }
    gl.uniform2f(webgl.resUni, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(webgl.timeUni, time * 0.001);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createShader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
    console.error(`Shader Error: ${gl.getShaderInfoLog(s)}`);
    gl.deleteShader(s);
    return null;
}

function createProgram(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (gl.getProgramParameter(p, gl.LINK_STATUS)) return p;
    console.error(`Program Error: ${gl.getProgramInfoLog(p)}`);
    gl.deleteProgram(p);
    return null;
}
