<script setup lang="ts">
import { englishOnly } from '../logics'

const inactiveStyle = 'opacity-20 hover:opacity-50'
const activeStyle = 'opacity-100 underline'

const route = useRoute()
</script>

<template>
  <div class="prose m-auto mb-8 select-none animate-none! op100!">
    <button flex="~ gap1" items-center mb2 op30 text-sm @click="englishOnly = !englishOnly">
      <div :i="englishOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />
      English Only
    </button>

    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-3xl>
      <RouterLink to="/posts" class="!border-none" :class="route.path === `/posts` ? activeStyle : inactiveStyle">
        博客
      </RouterLink>
      <RouterLink to="/projects" class="!border-none" :class="route.path === `/projects` ? activeStyle : inactiveStyle">
        项目/工具
      </RouterLink>
      <RouterLink to="/videos" class="!border-none" :class="route.path === `/videos` ? activeStyle : inactiveStyle">
        视频专区
      </RouterLink>
      <RouterLink to="/games" class="!border-none" :class="route.path === `/games` ? activeStyle : inactiveStyle">
        游戏历程
      </RouterLink>
      <RouterLink to="/notes" class="!border-none" :class="route.path === `/notes` ? activeStyle : inactiveStyle">
        笔记
      </RouterLink>
      <RouterLink to="/waifus" class="!border-none" :class="route.path === `/waifus` ? activeStyle : inactiveStyle">
        <span class="gradient-text">老婆列表</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* gradient text */
.gradient-text {
  background: linear-gradient(120deg, #ffa5cb, #aa85ff);
  color: transparent;
  background-clip: text;
}
</style>
