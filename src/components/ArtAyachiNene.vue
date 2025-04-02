<script setup lang="ts">
import {
  DotImageCanvas,
  getDevice,
  useRaf,
} from 'lazy-js-utils'
import nene1 from '/images/nene1.png'
import nene2 from '/images/nene2.png'

// 背景图
const imageShow = computed(() => {
  const { os } = getDevice()
  return os === 'mac' || os === 'windows' || os === 'macOS'
})

const dotImage1 = new DotImageCanvas(nene1, '', 3, 'transparent', 'vertical-reverse')
const dotImage2 = new DotImageCanvas(nene2, '', 3, 'transparent')

onMounted(() => {
  if (imageShow.value) {
    dotImage1.append('.dotImage')
    dotImage2.append('.cloth')
  }
  const stop = useRaf(() => {
    if (dotImage1.status && window.gsap) {
      stop()
      window.gsap.to('.dotImage', {
        rotationY: 360,
        scrollTrigger: {
          trigger: 'body',
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      })
    }
  }, 200)
})
</script>

<template>
    <span v-if="imageShow" class="dotImage" fixed top-20 left--80 z--2 />
    <span v-if="imageShow" class="cloth" fixed top-20 right--120 z--2 />
</template>