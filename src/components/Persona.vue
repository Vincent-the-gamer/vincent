<template>
    <div class="persona">
        <div></div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="css" scoped>
.persona {
    background-image: url("/gifs/persona3.gif");
    will-change: auto;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    overflow: hidden;
    opacity: 20%;
    object-fit: cover;
    background-size: cover;
}
</style>
