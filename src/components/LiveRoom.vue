<template>
    <!-- HLS直播间 -->
    <div id="dplayer" />
</template>

<script setup lang="ts">
import DPlayer from 'dplayer'

let dp: DPlayer

onMounted(() => {
    dp = new DPlayer({
        container: document.getElementById('dplayer'),
        live: true,
        video: {
            url: 'https://www.r8xkv0ew9.nyat.app:12323/live/vince/vince.m3u8?token=qidong',
            type: 'hls'
        },
    })
})

onUnmounted(() => {
    dp.destroy()
})
</script>

<style scoped></style>
