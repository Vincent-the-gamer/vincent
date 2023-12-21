<script setup lang="ts">
import { useRoute } from 'vue-router'
import { englishOnly } from '../logics'
import { BASE_URL } from '~/baseUrl';

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
      <RouterLink :to="`${BASE_URL}posts`" class="!border-none" :class="route.path === `${BASE_URL}posts` ? activeStyle : inactiveStyle">
        博客
      </RouterLink>
      <RouterLink :to="`${BASE_URL}projects`" class="!border-none" :class="route.path === `${BASE_URL}projects` ? activeStyle : inactiveStyle">
        项目
      </RouterLink>
      <RouterLink :to="`${BASE_URL}game-video`" class="!border-none" :class="route.path === `${BASE_URL}game-video` ? activeStyle : inactiveStyle">
        游戏视频
      </RouterLink>
      <RouterLink :to="`${BASE_URL}game-trophy`" class="!border-none" :class="route.path === `${BASE_URL}game-trophy` ? activeStyle : inactiveStyle">
        游戏奖杯
      </RouterLink>
    </div>
  </div>
</template>
