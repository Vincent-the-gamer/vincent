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
        <div v-if="!query.baiduLink && !query.googleDriveLink">等待上传/To be upload soon.</div>
        <div v-else flex="~ row gap-2" mt-1>
          <a id="dld" target="_blank" :href="query.baiduLink?.toString()">
           <div title="百度网盘" w-fit h-8 p-2 cursor-pointer bg-white hover:bg-purple border="rd-2" flex="~ items-center">
             <div i-arcticons-baidu-netdisk />
             <span>百度网盘</span>
            </div>
          </a>
          <a id="dld" target="_blank" :href="query.googleDriveLink?.toString()">
           <div title="Google Drive" w-fit h-8 p-2 cursor-pointer bg-white hover:bg-purple border="rd-2" flex="~ items-center">
             <div i-mynaui-brand-google-solid />
             <span>Google Drive</span>
            </div>
          </a>
        </div>
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

    &#dld {
      color: black;
      text-decoration: none;
    }
  }
</style>