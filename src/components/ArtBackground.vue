<script setup lang="ts">
// Global ambient background.
//
// The base layer is a Vue Bits "Color Bends" shader (see ./ColorBends.vue),
// left interactive with the cursor. It sits at z-index -2 so the per-post
// particle layers (ArtDots / ArtPlum) show through on top of it.
const dark = useDark();
const reduced = usePreferredReducedMotion();

// Single accent color for the bends, dialed down a touch in dark mode.
const colors = ["#00ffa9"];
const intensity = computed(() => (dark.value ? 1.05 : 1.3));
</script>

<template>
    <div class="art-bg" aria-hidden="true">
        <ColorBends
            class="art-bg__bends"
            :colors="colors"
            :speed="0.2"
            :scale="1"
            :frequency="1"
            :warp-strength="1"
            :mouse-influence="1"
            :parallax="0.5"
            :noise="0.15"
            :rotation="90"
            :iterations="1"
            :intensity="intensity"
            :band-width="6"
            :fade-top="0.75"
            :paused="reduced === 'reduce'"
        />
        <div class="art-bg__grain" />
    </div>
</template>

<style scoped>
.art-bg {
    position: fixed;
    inset: 0;
    z-index: -2;
    overflow: hidden;
    pointer-events: none;
}

.art-bg__bends {
    position: absolute;
    inset: 0;
}

/* Fine grain to break the digital flatness of pure gradients. */
.art-bg__grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 140px 140px;
    opacity: 0.04;
}

html.dark .art-bg__grain {
    opacity: 0.055;
}

@media print {
    .art-bg {
        display: none;
    }
}
</style>
