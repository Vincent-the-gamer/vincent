<script setup lang="ts">
interface File {
  name: string // 文件名
  link: string // 文件链接
  date: string // 上传日期
}

const props = defineProps<{
  files: File[]
}>()

function getDateFromString(date: string) {
  return new Date(date).toLocaleDateString()
}

function linkHref(link: string) {
  window.open(link)
}
</script>

<template>
  <div flex="~ justify-center items-center" flex-wrap>
    <div
      v-for="file of props.files" flex="~ row justify-center items-center"
      @click="linkHref(file.link)"
    >
      <div class="name" underline hover:text-gray cursor-pointer >{{ file.name }}</div>
      <span m-inline-2>--</span>
      <div>{{ getDateFromString(file.date) }}</div>
    </div>
  </div>
</template>

<style scoped>
.name {
  font-size: 18px;
  transition: all 200ms;
}
</style>
