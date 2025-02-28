<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>()

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\/]+/g, '-')
}
</script>

<template>
  <div max-w-300 mx-auto>
    <div
      v-for="key, cidx in Object.keys(projects)" :key="key" slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <h4 :id="slug(key)" class="mt-15 mb-2 font-bold text-center op75">
        {{ key }}
      </h4>
      <div
        class="project-grid py-2 max-w-500 w-max mx-auto"
        grid="~ cols-1 md:cols-2 gap-4"
        :class="projects[key].length === 1 ? 'flex' : projects[key].length > 2 ? 'lg:grid-cols-3' : ''"
      >
        <a
          v-for="item, idx in projects[key]"
          :key="idx"
          class="item relative flex items-center"
          :href="item.link"
          target="_blank"
          :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
          :title="item.name"
        >
          <div v-if="item.icon" class="pt-2 pr-5">
            <!-- pic -->
            <img v-if="item.icon === 'cardforge'" class="text-4xl w-80px h-60px" src="/images/projects/cardforge-logo.png">
            <img v-else-if="item.icon === 'nemassler'" class="text-4xl w-200px h-75px" src="/images/projects/nemassler.png">
            <img v-else-if="item.icon === 'wenyan'" class="text-4xl w-120px h-75px" src="/images/projects/wenyan.png">
            <img v-else-if="item.icon === 'g-shock'" class="text-4xl w-160px h-75px" src="/images/projects/g-shock-date-checker.jpg">
            <img v-else-if="item.icon === 'picdiet'" class="text-4xl w-220px h-35px" src="/images/projects/picdiet.png">
            <img v-else-if="item.icon === 'neonheart'" class="text-4xl w-125px h-88px" src="/images/projects/neonheart.png">
            <img v-else-if="item.icon === 'github'" class="text-4xl w-200px h-88px" src="/images/projects/github.png">
            <img v-else-if="item.icon === 'transfonter'" class="text-4xl w-300px h-30px" src="/images/projects/transfonter.png">
            <img v-else-if="item.icon === 'vitepress'" class="text-4xl w-100px h-70px" src="/images/projects/vitepress-logo.png">
            <img v-else-if="item.icon === 'utils'" class="text-4xl w-85px h-70px" src="/images/projects/vince-utils.png">
            <img v-else-if="item.icon === 'music'" class="text-4xl w-80px h-75px" src="/images/projects/music.png">
            <img v-else-if="item.icon === 'html2pdf'" class="text-4xl w-80px h-75px" src="/images/projects/html2pdf.jpg">
            <img v-else-if="item.icon === 'vizzy'" class="text-4xl w-80px h-50px" src="/images/projects/vizzy.png">
            <img v-else-if="item.icon === 'aya'" class="text-4xl w-110px h-75px" src="/images/projects/aya.png">
            <img v-else-if="item.icon === 'slidev'" class="text-4xl w-110px h-75px" src="/images/projects/slidev.png">

            <!-- gif -->
            <img v-else-if="item.icon === 'yew'" class="text-4xl w-140px h-75px" src="/gifs/yew.gif">
            <img v-else-if="item.icon === 'kaomoe'" class="text-4xl w-140px h-75px" src="/gifs/kaomoe.gif">
            <img v-else-if="item.icon === 'n-stars'" class="text-4xl w-140px h-75px" src="/gifs/n-stars.gif">

            <!-- svg -->
            <div v-else-if="item.icon === 'vitesse'" class="i-carbon-campsite w-50px h-50px" />
            <img v-else-if="item.icon === 'nitro'" class="w-80px h-55px" src="/images/projects/nitro.svg">
            <div v-else class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
          </div>
          <div class="flex-auto">
            <div class="text-normal">{{ item.name }}</div>
            <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
          </div>
        </a>
      </div>
    </div>
    <div class="prose pb5 mx-auto mt10 text-center">
      <div block mt-5>
        <span>给我点个Star喵~给我点个Star谢谢喵~</span>
      </div>
    </div>
  </div>
  <div>
    <div class="table-of-contents">
      <div class="table-of-contents-anchor">
        <div class="i-ri-menu-2-fill" />
      </div>
      <ul>
        <li v-for="key of Object.keys(projects)" :key="key">
          <a :href="`#${slug(key)}`">{{ key }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.project-grid a.item {
  background: transparent;
  font-size: 1.1rem;
  width: 350px;
  max-width: 100%;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 6px;
}

.project-grid a.item:hover {
  background: #88888811;
}
</style>
