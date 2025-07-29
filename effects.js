// effects.js - Handles ONLY the WebGL background fire effect.

let gl, webgl;

export function initWebGL(canvas) {
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webgl = {};
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const isWebGL2 = gl instanceof WebGL2RenderingContext;
    
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }`;

    const fragmentShaderSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 st) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 6; ++i) {
                v += a * noise(st);
                st *= 2.0;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 p = gl_FragCoord.xy / u_resolution;
            float t = u_time * 0.5;
            vec2 n = p + vec2(0.0, -t * 0.5);
            float u = fbm(n * 4.0 + t * 0.1);
            float v = fbm(n * 3.0 + vec2(0.0, u * 0.2));
            float s = pow(1.0 - p.y, 1.5);
            float f = v * s;
            vec3 color = mix(vec3(0.1, 0.0, 0.0), vec3(1.0, 0.4, 0.0), smoothstep(0.1, 0.45, f));
            color = mix(color, vec3(1.0, 0.9, 0.0), smoothstep(0.45, 0.6, f));
            gl_FragColor = vec4(color, smoothstep(0.1, 0.3, f));
        }`;

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vs || !fs) return;
    webgl.program = createProgram(vs, fs);
    if (!webgl.program) return;

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
