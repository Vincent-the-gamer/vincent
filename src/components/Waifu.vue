<script setup lang="ts">
interface Waifu {
  avatar: string // 头像
  name: string // 姓名
  moegirlLink: string // 萌娘百科链接
  from: string // 角色来源
}

const props = defineProps<{
  waifus: Waifu[]
}>()

function linkHref(link: string) {
  window.open(link)
}
</script>

<template>
  <div flex="~ justify-center items-center" flex-wrap>
    <div
      v-for="waifu of props.waifus" class="card" flex="~ col justify-center items-center"
      @click="linkHref(waifu.moegirlLink)"
    >
      <!-- Waifu avatar -->
      <div w-25 h-25>
        <img :src="waifu.avatar" b-rd-full pointer-events-none>
      </div>
      <!-- Waifu name -->
      <h2>{{ waifu.name }}</h2>
      <span font-size-14px>{{ waifu.from }}</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 33.3%;
  padding: 20px;
  cursor: pointer;
}

h2 {
  font-size: 18px;
  padding-top: 6px;
}

img,
h2 {
  transition: all, 200ms;
}

.card:hover img {
  scale: 1.1;
}

.card:hover h2 {
  color: violet;
}
</style>
