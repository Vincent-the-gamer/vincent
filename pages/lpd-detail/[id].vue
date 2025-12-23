<template>
    <div flex="~ col justify-center items-center">
        <img :src="query.image?.toString()" w-100/>
        <div font="size-7 bold">{{ query.title }}</div>
        <p mb-5>Rezz/Grabbitz</p>

        <p mb-2>难度/Difficulty: {{ query.difficulty }}/10</p>
        <p mb-2>
          视频/Video: 
          <a :href="query.video?.toString()" target="_blank">{{ query.video }}</a>
        </p>
        <p>下载/Download: </p>
        <div>{{ query.download || "等待上传/To be upload soon." }}</div>
    </div>
</template>

<script setup lang="ts">
 const { query } = useRoute()
</script>

<style scoped>
  a {
    color: rgb(195, 0, 255);
    text-decoration: underline;
    &:hover {
      color: rgb(143, 0, 117);
    }
  }
</style>