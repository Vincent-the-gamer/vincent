<script setup lang="ts">
import { breakpointsTailwind } from "@vueuse/core";

const isDark = useDark();
const { isSmaller } = useBreakpoints(breakpointsTailwind);
const blur = computed(
    () => `blur(${(isSmaller("md") ? 25 : 15) + (isDark ? 25 : 15)}px)`,
);
</script>

<template>
    <div class="background">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
    </div>
</template>

<style scoped>
@keyframes move {
    100% {
        transform: translate3d(0, 0, 1px) rotate(360deg);
    }
}

.background {
    will-change: auto;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
}

.background span {
    width: 20vmin;
    height: 20vmin;
    border-radius: 20vmin;
    backface-visibility: hidden;
    position: absolute;
    animation: move;
    animation-duration: 45;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    filter: v-bind(blur);
}

.background span:nth-child(0) {
    color: #6b07fc;
    top: 66%;
    left: 69%;
    animation-duration: 33s;
    animation-delay: -3s;
    transform-origin: -15vw 14vh;
    box-shadow: 40vmin 0 5.324632528445741vmin currentColor;
}
.background span:nth-child(1) {
    color: #073bfc;
    top: 66%;
    left: 62%;
    animation-duration: 27s;
    animation-delay: -38s;
    transform-origin: -3vw 23vh;
    box-shadow: 40vmin 0 5.4258683889992465vmin currentColor;
}
.background span:nth-child(2) {
    color: #ff7cbb;
    top: 47%;
    left: 21%;
    animation-duration: 32s;
    animation-delay: -43s;
    transform-origin: 24vw -21vh;
    box-shadow: -40vmin 0 5.007801900725587vmin currentColor;
}
.background span:nth-child(3) {
    color: #00fbff;
    top: 65%;
    left: 46%;
    animation-duration: 39s;
    animation-delay: -4s;
    transform-origin: -6vw -4vh;
    box-shadow: 40vmin 0 5.262599136950164vmin currentColor;
}
.background span:nth-child(4) {
    color: #dd7cff;
    top: 89%;
    left: 78%;
    animation-duration: 20s;
    animation-delay: -20s;
    transform-origin: 23vw -12vh;
    box-shadow: -40vmin 0 5.280533557267102vmin currentColor;
}
.background span:nth-child(5) {
    color: #7ce1ff;
    top: 36%;
    left: 79%;
    animation-duration: 30s;
    animation-delay: -2s;
    transform-origin: -17vw 23vh;
    box-shadow: -40vmin 0 5.479171435607537vmin currentColor;
}
.background span:nth-child(6) {
    color: #c1ff7c;
    top: 16%;
    left: 51%;
    animation-duration: 12s;
    animation-delay: -40s;
    transform-origin: 10vw -22vh;
    box-shadow: 40vmin 0 5.0209540616474335vmin currentColor;
}
.background span:nth-child(7) {
    color: #e45a84;
    top: 86%;
    left: 75%;
    animation-duration: 19s;
    animation-delay: -9s;
    transform-origin: -4vw 12vh;
    box-shadow: -40vmin 0 5.797629535035193vmin currentColor;
}
.background span:nth-child(8) {
    color: #edff7c;
    top: 89%;
    left: 71%;
    animation-duration: 8s;
    animation-delay: -44s;
    transform-origin: 16vw -3vh;
    box-shadow: 40vmin 0 5.070098689397819vmin currentColor;
}
.background span:nth-child(9) {
    color: #ffafee;
    top: 78%;
    left: 2%;
    animation-duration: 25s;
    animation-delay: -31s;
    transform-origin: -17vw -8vh;
    box-shadow: -40vmin 0 5.225561734116088vmin currentColor;
}
.background span:nth-child(10) {
    color: #7cffd5;
    top: 48%;
    left: 97%;
    animation-duration: 33s;
    animation-delay: -44s;
    transform-origin: 15vw 8vh;
    box-shadow: 40vmin 0 5.868980522943915vmin currentColor;
}
.background span:nth-child(11) {
    color: #ffafee;
    top: 32%;
    left: 16%;
    animation-duration: 54s;
    animation-delay: -19s;
    transform-origin: -16vw -3vh;
    box-shadow: 40vmin 0 5.0181012256749415vmin currentColor;
}
.background span:nth-child(12) {
    color: #afe2ff;
    top: 12%;
    left: 44%;
    animation-duration: 33s;
    animation-delay: -27s;
    transform-origin: 9vw -3vh;
    box-shadow: -40vmin 0 5.824942937857695vmin currentColor;
}
.background span:nth-child(13) {
    color: #980091;
    top: 53%;
    left: 10%;
    animation-duration: 15s;
    animation-delay: -43s;
    transform-origin: -6vw 17vh;
    box-shadow: -40vmin 0 5.092048062960624vmin currentColor;
}
.background span:nth-child(14) {
    color: #afe2ff;
    top: 25%;
    left: 55%;
    animation-duration: 31s;
    animation-delay: -7s;
    transform-origin: 25vw -12vh;
    box-shadow: -40vmin 0 5.22765088443985vmin currentColor;
}
.background span:nth-child(15) {
    color: #ff9cea;
    top: 83%;
    left: 77%;
    animation-duration: 17s;
    animation-delay: -19s;
    transform-origin: 2vw 25vh;
    box-shadow: -40vmin 0 5.07066695616901vmin currentColor;
}
.background span:nth-child(16) {
    color: #ccafff;
    top: 34%;
    left: 54%;
    animation-duration: 8s;
    animation-delay: -23s;
    transform-origin: 15vw 14vh;
    box-shadow: 40vmin 0 5.980909941832135vmin currentColor;
}
.background span:nth-child(17) {
    color: #afe2ff;
    top: 83%;
    left: 77%;
    animation-duration: 30s;
    animation-delay: -41s;
    transform-origin: -4vw 17vh;
    box-shadow: 40vmin 0 5.773604079351018vmin currentColor;
}
.background span:nth-child(18) {
    color: #ccafff;
    top: 9%;
    left: 72%;
    animation-duration: 15s;
    animation-delay: -40s;
    transform-origin: 10vw -7vh;
    box-shadow: 40vmin 0 5.684975984437636vmin currentColor;
}
.background span:nth-child(19) {
    color: #583c87;
    top: 59%;
    left: 54%;
    animation-duration: 47s;
    animation-delay: -25s;
    transform-origin: 20vw 4vh;
    box-shadow: 40vmin 0 5.529043953752696vmin currentColor;
}
</style>
