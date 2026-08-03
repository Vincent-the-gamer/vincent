<script setup lang="ts">
// ==================== Color State ====================
const hue = ref(0); // 0-360
const saturation = ref(100); // 0-100
const lightness = ref(50); // 0-100
const alpha = ref(1); // 0-1

// ==================== Canvas Refs ====================
const paletteCanvas = ref<HTMLCanvasElement>();
const hueCanvas = ref<HTMLCanvasElement>();
const alphaCanvas = ref<HTMLCanvasElement>();

// ==================== Dragging State ====================
const draggingPalette = ref(false);
const draggingHue = ref(false);
const draggingAlpha = ref(false);

// ==================== Copy State ====================
const copiedLabel = ref<string | null>(null);

function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    copiedLabel.value = label;
    setTimeout(() => {
        copiedLabel.value = null;
    }, 1500);
}

// ==================== Utility: HSL → RGB ====================
function hslToRgb(
    h: number,
    s: number,
    l: number,
): { r: number; g: number; b: number } {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}

// ==================== Utility: RGB → HEX ====================
function rgbToHex(r: number, g: number, b: number): string {
    return [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// ==================== Computed Color Strings ====================
const rgbaValues = computed(() => {
    const { r, g, b } = hslToRgb(hue.value, saturation.value, lightness.value);
    return { r, g, b, a: alpha.value };
});

const displayColor = computed(() => {
    const { r, g, b, a } = rgbaValues.value;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
});

const rgbaString = computed(() => {
    const { r, g, b, a } = rgbaValues.value;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
});

const hslaString = computed(() => {
    return `hsla(${Math.round(hue.value)}, ${Math.round(saturation.value)}%, ${Math.round(lightness.value)}%, ${alpha.value.toFixed(2)})`;
});

const hexString = computed(() => {
    const { r, g, b, a } = rgbaValues.value;
    const hex = rgbToHex(r, g, b);
    if (a < 1) {
        const aHex = Math.round(a * 255)
            .toString(16)
            .padStart(2, "0");
        return `#${hex}${aHex}`;
    }
    return `#${hex}`;
});

const cssHsl = computed(
    () => `hsl(${hue.value}, ${saturation.value}%, ${lightness.value}%)`,
);

// ==================== Drawing ====================
function drawPalette() {
    const canvas = paletteCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Step 1: Horizontal gradient — white (S=0) → pure hue (S=100, L=50)
    const satGrad = ctx.createLinearGradient(0, 0, w, 0);
    satGrad.addColorStop(0, "white");
    satGrad.addColorStop(1, `hsl(${hue.value}, 100%, 50%)`);
    ctx.fillStyle = satGrad;
    ctx.fillRect(0, 0, w, h);

    // Step 2: Vertical gradient — white (top, L=100) → transparent (mid, L=50) → black (bottom, L=0)
    const lightGrad = ctx.createLinearGradient(0, 0, 0, h);
    lightGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    lightGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    lightGrad.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    lightGrad.addColorStop(1, "rgba(0, 0, 0, 1)");
    ctx.fillStyle = lightGrad;
    ctx.fillRect(0, 0, w, h);

    // Step 3: Draw indicator circle
    const ix = (saturation.value / 100) * w;
    const iy = ((100 - lightness.value) / 100) * h;
    drawIndicator(ctx, ix, iy, lightness.value > 50 ? "#000" : "#fff");
}

function drawHueBar() {
    const canvas = hueCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw rainbow gradient
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    const segments = [
        [0, "hsl(0, 100%, 50%)"],
        [1 / 6, "hsl(60, 100%, 50%)"],
        [2 / 6, "hsl(120, 100%, 50%)"],
        [3 / 6, "hsl(180, 100%, 50%)"],
        [4 / 6, "hsl(240, 100%, 50%)"],
        [5 / 6, "hsl(300, 100%, 50%)"],
        [1, "hsl(360, 100%, 50%)"],
    ];
    for (const [pos, color] of segments)
        grad.addColorStop(pos as number, color as string);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw indicator
    const ix = (hue.value / 360) * w;
    drawIndicator(ctx, ix, h / 2, "#fff");
}

function drawAlphaBar() {
    const canvas = alphaCanvas.value;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw checkerboard for transparency
    const size = 6;
    for (let y = 0; y < h; y += size) {
        for (let x = 0; x < w; x += size) {
            ctx.fillStyle = (x / size + y / size) % 2 === 0 ? "#ccc" : "#fff";
            ctx.fillRect(x, y, size, size);
        }
    }

    // Draw alpha gradient
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    const { r, g, b } = hslToRgb(hue.value, saturation.value, lightness.value);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw indicator
    const ix = alpha.value * w;
    drawIndicator(ctx, ix, h / 2, alpha.value > 0.5 ? "#fff" : "#000");
}

function drawIndicator(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
) {
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = color === "#fff" ? "#333" : "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

// ==================== Pointer Event Helpers ====================
function getPosFromEvent(
    e: PointerEvent | MouseEvent,
    el: HTMLElement,
): { x: number; y: number } {
    const rect = el.getBoundingClientRect();
    return {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
}

// ==================== Event Handlers ====================
function onPaletteDown(e: PointerEvent) {
    draggingPalette.value = true;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    updatePalette(e, el);
}

function onPaletteMove(e: PointerEvent) {
    if (!draggingPalette.value) return;
    updatePalette(e, e.currentTarget as HTMLElement);
}

function onPaletteUp() {
    draggingPalette.value = false;
}

function updatePalette(e: PointerEvent, el: HTMLElement) {
    const { x, y } = getPosFromEvent(e, el);
    saturation.value = Math.round(x * 100);
    lightness.value = Math.round((1 - y) * 100);
    drawPalette();
    drawAlphaBar();
}

function onHueDown(e: PointerEvent) {
    draggingHue.value = true;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    updateHue(e, el);
}

function onHueMove(e: PointerEvent) {
    if (!draggingHue.value) return;
    updateHue(e, e.currentTarget as HTMLElement);
}

function onHueUp() {
    draggingHue.value = false;
}

function updateHue(e: PointerEvent, el: HTMLElement) {
    const { x } = getPosFromEvent(e, el);
    hue.value = Math.round(x * 360);
    drawHueBar();
    drawPalette();
    drawAlphaBar();
}

function onAlphaDown(e: PointerEvent) {
    draggingAlpha.value = true;
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    updateAlpha(e, el);
}

function onAlphaMove(e: PointerEvent) {
    if (!draggingAlpha.value) return;
    updateAlpha(e, e.currentTarget as HTMLElement);
}

function onAlphaUp() {
    draggingAlpha.value = false;
}

function updateAlpha(e: PointerEvent, el: HTMLElement) {
    const { x } = getPosFromEvent(e, el);
    alpha.value = Math.round(x * 100) / 100;
    drawAlphaBar();
}

// ==================== Lifecycle ====================
onMounted(() => {
    drawPalette();
    drawHueBar();
    drawAlphaBar();
});

watch([hue, saturation, lightness], () => {
    drawPalette();
    drawAlphaBar();
});
</script>

<template>
    <div class="palette-wrapper">
        <div class="palette-main">
            <!-- Color pick area -->
            <canvas
                ref="paletteCanvas"
                class="palette-area"
                width="240"
                height="240"
                touch-action="none"
                @pointerdown="onPaletteDown"
                @pointermove="onPaletteMove"
                @pointerup="onPaletteUp"
                @pointerleave="onPaletteUp"
            />

            <!-- Sliders -->
            <div class="palette-sliders">
                <!-- Hue slider -->
                <canvas
                    ref="hueCanvas"
                    class="palette-slider"
                    width="240"
                    height="18"
                    touch-action="none"
                    @pointerdown="onHueDown"
                    @pointermove="onHueMove"
                    @pointerup="onHueUp"
                    @pointerleave="onHueUp"
                />

                <!-- Alpha slider -->
                <canvas
                    ref="alphaCanvas"
                    class="palette-slider"
                    width="240"
                    height="18"
                    touch-action="none"
                    @pointerdown="onAlphaDown"
                    @pointermove="onAlphaMove"
                    @pointerup="onAlphaUp"
                    @pointerleave="onAlphaUp"
                />
            </div>
        </div>

        <!-- Color preview & values -->
        <div class="palette-info">
            <div
                class="palette-preview"
                :style="{ background: displayColor }"
            />

            <div class="palette-values">
                <div class="value-row">
                    <span class="value-label">RGBA</span>
                    <code class="value-code">{{ rgbaString }}</code>
                    <button
                        class="copy-btn"
                        :class="{ copied: copiedLabel === 'RGBA' }"
                        @click="copyToClipboard(rgbaString, 'RGBA')"
                        :title="copiedLabel === 'RGBA' ? '已复制' : '复制'"
                    >
                        <svg
                            v-if="copiedLabel !== 'RGBA'"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                            />
                            <path
                                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                            />
                        </svg>
                        <svg
                            v-else
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </button>
                </div>
                <div class="value-row">
                    <span class="value-label">HSLA</span>
                    <code class="value-code">{{ hslaString }}</code>
                    <button
                        class="copy-btn"
                        :class="{ copied: copiedLabel === 'HSLA' }"
                        @click="copyToClipboard(hslaString, 'HSLA')"
                        :title="copiedLabel === 'HSLA' ? '已复制' : '复制'"
                    >
                        <svg
                            v-if="copiedLabel !== 'HSLA'"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                            />
                            <path
                                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                            />
                        </svg>
                        <svg
                            v-else
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </button>
                </div>
                <div class="value-row">
                    <span class="value-label">HEX</span>
                    <code class="value-code">{{ hexString }}</code>
                    <button
                        class="copy-btn"
                        :class="{ copied: copiedLabel === 'HEX' }"
                        @click="copyToClipboard(hexString, 'HEX')"
                        :title="copiedLabel === 'HEX' ? '已复制' : '复制'"
                    >
                        <svg
                            v-if="copiedLabel !== 'HEX'"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                            />
                            <path
                                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                            />
                        </svg>
                        <svg
                            v-else
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Numeric inputs for precise control -->
            <div class="palette-inputs">
                <div class="input-group">
                    <label>H</label>
                    <input
                        type="number"
                        min="0"
                        max="360"
                        :value="Math.round(hue)"
                        @input="
                            hue = Math.max(
                                0,
                                Math.min(
                                    360,
                                    Number(
                                        ($event.target as HTMLInputElement)
                                            .value,
                                    ) || 0,
                                ),
                            )
                        "
                    />
                </div>
                <div class="input-group">
                    <label>S</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        :value="Math.round(saturation)"
                        @input="
                            saturation = Math.max(
                                0,
                                Math.min(
                                    100,
                                    Number(
                                        ($event.target as HTMLInputElement)
                                            .value,
                                    ) || 0,
                                ),
                            )
                        "
                    />
                </div>
                <div class="input-group">
                    <label>L</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        :value="Math.round(lightness)"
                        @input="
                            lightness = Math.max(
                                0,
                                Math.min(
                                    100,
                                    Number(
                                        ($event.target as HTMLInputElement)
                                            .value,
                                    ) || 0,
                                ),
                            )
                        "
                    />
                </div>
                <div class="input-group">
                    <label>A</label>
                    <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        :value="alpha"
                        @input="
                            alpha = Math.max(
                                0,
                                Math.min(
                                    1,
                                    Number(
                                        ($event.target as HTMLInputElement)
                                            .value,
                                    ) || 0,
                                ),
                            )
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.palette-wrapper {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
    flex-wrap: wrap;
    user-select: none;
}

.palette-main {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.palette-area {
    border-radius: 8px;
    cursor: crosshair;
}

.palette-sliders {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.palette-slider {
    border-radius: 4px;
    cursor: pointer;
}

.palette-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 220px;
}

.palette-preview {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    border: 1px solid #8884;
    background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 12px 12px;
    background-position:
        0 0,
        0 6px,
        6px -6px,
        -6px 0px;
    position: relative;
    overflow: hidden;
}

.palette-preview::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 8px;
}

.palette-values {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.value-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.value-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #888;
    min-width: 42px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.value-code {
    font-family: "DM Mono", "Fira Code", monospace;
    font-size: 0.82rem;
    background: #8881;
    padding: 2px 6px;
    border-radius: 3px;
    word-break: break-all;
}

.copy-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border: none;
    background: transparent;
    color: #aaa;
    cursor: pointer;
    border-radius: 3px;
    flex-shrink: 0;
    transition:
        color 0.15s,
        background 0.15s;
}

.copy-btn:hover {
    color: #666;
    background: #8882;
}

.copy-btn.copied {
    color: #22c55e;
}

.palette-inputs {
    display: flex;
    gap: 0.5rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.input-group label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #999;
    text-transform: uppercase;
}

.input-group input {
    width: 48px;
    padding: 3px 4px;
    border: 1px solid #8884;
    border-radius: 4px;
    text-align: center;
    font-size: 0.78rem;
    font-family: "DM Mono", "Fira Code", monospace;
    background: transparent;
    color: inherit;
    outline: none;
    transition: border-color 0.15s;
}

.input-group input:focus {
    border-color: var(--c-accent, #617df2);
}
</style>
