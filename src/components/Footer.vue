<script lang="ts" setup>
import config from '../../package.json'

onMounted(() => {
  // 不蒜子 - 访问计数
  // @ts-expect-error missing types
  import("busuanzi.pure.js").then((module) => {
    module.default.fetch()
  })
})

</script>

<template>
  <div class="mt-10 mb-6 prose m-auto slide-enter animate-delay-1200!" flex="~ col justify-center">
    <p text-sm op50>
      <a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" style="color:inherit">CC BY-NC-SA 4.0</a> 2023-PRESENT © Vincent-the-gamer | Version: v{{ config.version }}
    </p>
    <div text-sm op50>
      <span id="busuanzi_container_site_pv">
        本站总访问量：<span id="busuanzi_value_site_pv"/> 次
      </span>
      <span> | </span>
      <span id="busuanzi_container_site_uv">
        本站总访客数：<span id="busuanzi_value_site_uv" />人
      </span>
    </div>
    <div class="flex-auto" />
  </div>
</template>
