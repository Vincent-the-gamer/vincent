<script setup lang="ts">
import type { Post } from '~/types'

defineProps<{
  videos: Record<string, Post[]>
}>()

const currentShow = ref<string>('game')
</script>

<template>
  <div class="m-t-20px m-b-20px">
    <span>切换视频分类：</span>
    <a
      class="m-r-10px inline hover:cursor-pointer"
      @click.prevent="currentShow = 'game'"
    >游戏视频</a>
    <a
      class="inline hover:cursor-pointer"
      @click.prevent="currentShow = 'launchpad'"
    >Launchpad视频</a>
  </div>

  <template v-if="currentShow === 'game'">
    <h1>游戏视频</h1>
    <ListPosts :posts="videos.gameVideos.reverse()" />
  </template>

  <template v-else>
    <h1>Launchpad视频</h1>
    <ListPosts :posts="videos.launchpadVideos.reverse()" />
  </template>
</template>
