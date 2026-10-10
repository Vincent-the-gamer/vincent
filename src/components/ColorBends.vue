<script setup lang="ts">
// Vue Bits' "Color Bends" background, ported to raw WebGL2/WebGL1.
//
// The original ships a three.js wrapper (~600 kB) around a single fullscreen
// fragment shader. We only need the shader, so this keeps the exact GLSL and
// drives it with a plain WebGL context — no extra dependency.
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from "vue";

interface ColorBendsProps {
    rotation?: number;
    speed?: number;
    colors?: string[];
    transparent?: boolean;
    autoRotate?: number;
    scale?: number;
    frequency?: number;
    warpStrength?: number;
    mouseInfluence?: number;
    parallax?: number;
    noise?: number;
    iterations?: number;
    intensity?: number;
    bandWidth?: number;
    /** Strength (0..1) of a page-background veil fading down from the top. */
    fadeTop?: number;
    /** Freeze the animation (used for `prefers-reduced-motion`). */
    paused?: boolean;
}

const props = withDefaults(defineProps<ColorBendsProps>(), {
    rotation: 90,
    speed: 0.2,
    colors: () => [],
    transparent: true,
    autoRotate: 0,
    scale: 1,
    frequency: 1,
    warpStrength: 1,
    mouseInfluence: 1,
    parallax: 0.5,
    noise: 0.15,
    iterations: 1,
    intensity: 1.5,
    bandWidth: 6,
    fadeTop: 0,
    paused: false,
});

const MAX_COLORS = 8;

const VERT = `
precision highp float;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`;

interface Uniforms {
    uCanvas: WebGLUniformLocation | null;
    uTime: WebGLUniformLocation | null;
    uSpeed: WebGLUniformLocation | null;
    uRot: WebGLUniformLocation | null;
    uColorCount: WebGLUniformLocation | null;
    uColors: WebGLUniformLocation | null;
    uTransparent: WebGLUniformLocation | null;
    uScale: WebGLUniformLocation | null;
    uFrequency: WebGLUniformLocation | null;
    uWarpStrength: WebGLUniformLocation | null;
    uPointer: WebGLUniformLocation | null;
    uMouseInfluence: WebGLUniformLocation | null;
    uParallax: WebGLUniformLocation | null;
    uNoise: WebGLUniformLocation | null;
    uIterations: WebGLUniformLocation | null;
    uIntensity: WebGLUniformLocation | null;
    uBandWidth: WebGLUniformLocation | null;
}

const containerRef = useTemplateRef<HTMLDivElement>("containerRef");

let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let uniforms: Uniforms | null = null;
let colorData = new Float32Array(MAX_COLORS * 3);
let colorCount = 0;
let rafId = 0;
let startTime = 0;
let lastFrame = 0;
let resizeObserver: ResizeObserver | null = null;

const pointerTarget = { x: 0, y: 0 };
const pointerCurrent = { x: 0, y: 0 };

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "").trim();
    const v =
        h.length === 3
            ? [
                  parseInt(h[0] + h[0], 16),
                  parseInt(h[1] + h[1], 16),
                  parseInt(h[2] + h[2], 16),
              ]
            : [
                  parseInt(h.slice(0, 2), 16),
                  parseInt(h.slice(2, 4), 16),
                  parseInt(h.slice(4, 6), 16),
              ];
    return [v[0] / 255, v[1] / 255, v[2] / 255];
}

function writeColors() {
    colorData = new Float32Array(MAX_COLORS * 3);
    const list = (props.colors || []).filter(Boolean).slice(0, MAX_COLORS);
    list.forEach((hex, i) => {
        const [r, g, b] = hexToRgb(hex);
        colorData[i * 3] = r;
        colorData[i * 3 + 1] = g;
        colorData[i * 3 + 2] = b;
    });
    colorCount = list.length;
}

function applyUniforms() {
    if (!gl || !uniforms) return;
    gl.uniform2f(
        uniforms.uCanvas,
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
    );
    gl.uniform1f(uniforms.uSpeed, props.speed);
    gl.uniform1f(uniforms.uScale, props.scale);
    gl.uniform1f(uniforms.uFrequency, props.frequency);
    gl.uniform1f(uniforms.uWarpStrength, props.warpStrength);
    gl.uniform1f(uniforms.uMouseInfluence, props.mouseInfluence);
    gl.uniform1f(uniforms.uParallax, props.parallax);
    gl.uniform1f(uniforms.uNoise, props.noise);
    gl.uniform1i(uniforms.uIterations, props.iterations);
    gl.uniform1f(uniforms.uIntensity, props.intensity);
    gl.uniform1f(uniforms.uBandWidth, props.bandWidth);
    gl.uniform1i(uniforms.uTransparent, props.transparent ? 1 : 0);
    gl.uniform1i(uniforms.uColorCount, colorCount);
    gl.uniform3fv(uniforms.uColors, colorData);
}

function resize() {
    const container = containerRef.value;
    const canvas = gl?.canvas as HTMLCanvasElement | undefined;
    if (!container || !gl || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (uniforms) {
        gl.uniform2f(uniforms.uCanvas, canvas.width, canvas.height);
    }
}

function renderFrame() {
    if (!gl || !uniforms || !program) return;
    const now = performance.now();
    if (!startTime) startTime = now;
    const elapsed = (now - startTime) / 1000;
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;

    gl.uniform1f(uniforms.uTime, elapsed);

    const deg = (props.rotation % 360) + props.autoRotate * elapsed;
    const rad = (deg * Math.PI) / 180;
    gl.uniform2f(uniforms.uRot, Math.cos(rad), Math.sin(rad));

    const amt = Math.min(1, dt * 8);
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * amt;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * amt;
    gl.uniform2f(uniforms.uPointer, pointerCurrent.x, pointerCurrent.y);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function loop() {
    renderFrame();
    rafId = requestAnimationFrame(loop);
}

function onPointerMove(e: PointerEvent) {
    const container = containerRef.value;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    pointerTarget.x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    pointerTarget.y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
}

function compile(type: number, source: string) {
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
    }
    return shader;
}

function setup() {
    const container = containerRef.value;
    if (!container) return;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    container.appendChild(canvas);

    gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        premultipliedAlpha: true,
        powerPreference: "high-performance",
    }) as WebGLRenderingContext | null;
    if (!gl) {
        container.removeChild(canvas);
        return;
    }

    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
    );
    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    uniforms = {
        uCanvas: gl.getUniformLocation(program, "uCanvas"),
        uTime: gl.getUniformLocation(program, "uTime"),
        uSpeed: gl.getUniformLocation(program, "uSpeed"),
        uRot: gl.getUniformLocation(program, "uRot"),
        uColorCount: gl.getUniformLocation(program, "uColorCount"),
        uColors: gl.getUniformLocation(program, "uColors[0]"),
        uTransparent: gl.getUniformLocation(program, "uTransparent"),
        uScale: gl.getUniformLocation(program, "uScale"),
        uFrequency: gl.getUniformLocation(program, "uFrequency"),
        uWarpStrength: gl.getUniformLocation(program, "uWarpStrength"),
        uPointer: gl.getUniformLocation(program, "uPointer"),
        uMouseInfluence: gl.getUniformLocation(program, "uMouseInfluence"),
        uParallax: gl.getUniformLocation(program, "uParallax"),
        uNoise: gl.getUniformLocation(program, "uNoise"),
        uIterations: gl.getUniformLocation(program, "uIterations"),
        uIntensity: gl.getUniformLocation(program, "uIntensity"),
        uBandWidth: gl.getUniformLocation(program, "uBandWidth"),
    };

    writeColors();
    applyUniforms();
    resize();

    if ("ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
    } else {
        useEventListener(window, "resize", resize);
    }

    useEventListener(window, "pointermove", onPointerMove, { passive: true });

    if (props.paused) {
        renderFrame();
    } else {
        rafId = requestAnimationFrame(loop);
    }
}

function teardown() {
    cancelAnimationFrame(rafId);
    rafId = 0;
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (gl) {
        const ext = gl.getExtension("WEBGL_lose_context");
        ext?.loseContext();
    }
    const container = containerRef.value;
    const canvas = gl?.canvas as HTMLCanvasElement | undefined;
    if (container && canvas && canvas.parentElement === container) {
        container.removeChild(canvas);
    }
    gl = null;
    program = null;
    uniforms = null;
    startTime = 0;
    lastFrame = 0;
}

onMounted(() => setup());
onBeforeUnmount(() => teardown());

watch(
    () => [props.paused, props.colors],
    () => {
        if (!gl) return;
        writeColors();
        applyUniforms();
        cancelAnimationFrame(rafId);
        if (props.paused) {
            renderFrame();
        } else {
            startTime = 0;
            lastFrame = 0;
            rafId = requestAnimationFrame(loop);
        }
    },
);

watch(
    () => [
        props.speed,
        props.scale,
        props.frequency,
        props.warpStrength,
        props.mouseInfluence,
        props.parallax,
        props.noise,
        props.iterations,
        props.intensity,
        props.bandWidth,
        props.transparent,
        props.rotation,
        props.autoRotate,
    ],
    () => {
        applyUniforms();
        if (props.paused) renderFrame();
    },
);
</script>

<template>
    <div ref="containerRef" class="color-bends">
        <div
            v-if="fadeTop > 0"
            class="color-bends__fade"
            :style="{ opacity: fadeTop }"
        />
    </div>
</template>

<style scoped>
.color-bends {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

/* Veil of the page background fading down from the top, so the header area
   stays legible over the shader. */
.color-bends__fade {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 38%;
    pointer-events: none;
    background: linear-gradient(
        to bottom,
        var(--c-bg, #000) 0%,
        transparent 100%
    );
}
</style>
