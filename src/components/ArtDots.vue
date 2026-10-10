<script setup lang="ts">
// Post-level particle layer.
//
// Uses Vue Bits' "Dot Field" (see ./DotField.vue): a fine grid of dots that
// bulges away from the cursor with a soft glow. Fixed at z-index -1 so the
// global ArtBackground shader shows through its transparent canvas.
//
// The palette flips with the theme: bright lime dots and a lime cursor glow on
// the dark canvas, deeper green dots and a deep-green glow on the warm
// off-white light canvas (DotField resolves the *Light props via useDark).
</script>

<template>
    <div
        fixed
        inset-0
        pointer-events-none
        class="print:hidden"
        style="z-index: -1"
        aria-hidden="true"
    >
        <DotField
            :dot-radius="1"
            :dot-spacing="9"
            :bulge-strength="67"
            :cursor-radius="500"
            :cursor-force="0.1"
            :glow-radius="160"
            :sparkle="true"
            :wave-amplitude="0"
            bulge-only
            gradient-from="#7cff67"
            gradient-to="#A0FFBC"
            glow-color="#00ff9e"
            gradient-from-light="#15803d"
            gradient-to-light="#22c55e"
            glow-color-light="#00ff9e"
        />
    </div>
</template>
