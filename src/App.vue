<script setup lang="ts">
import {
  DotImageCanvas,
  getDevice,
  useRaf,
} from 'lazy-js-utils'
import nene1 from '/images/nene1.png'
import nene2 from '/images/nene2.png'
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos'
import Girl3D from './components/Girl3D.vue';

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

const title = useTitle()
const defaultTitle = title.value

const isLeft = usePageLeave()
watch(() => isLeft.value, (newVal) => {
  newVal ? title.value = '不要离开人家嘛 ヽ(。>д<)ｐ' : title.value = defaultTitle
})

const route = useRoute()

const imageModel = ref<HTMLImageElement>()

useEventListener('click', async (e) => {
  const path = Array.from(e.composedPath())
  const first = path[0]
  if (!(first instanceof HTMLElement))
    return
  if (first.tagName !== 'IMG')
    return
  if (first.classList.contains('no-preview'))
    return
  if (path.some(el => el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName)))
    return
  if (!path.some(el => el instanceof HTMLElement && el.classList.contains('prose')))
    return

  // Do not open image when they are moving. Mainly for mobile to avoid conflict with hovering behavior.
  const pos = first.getBoundingClientRect()
  await new Promise(resolve => setTimeout(resolve, 50))
  const newPos = first.getBoundingClientRect()
  if (pos.left !== newPos.left || pos.top !== newPos.top)
    return

  imageModel.value = first as HTMLImageElement
})

onKeyStroke('Escape', (e) => {
  if (imageModel.value) {
    imageModel.value = undefined
    e.preventDefault()
  }
})
</script>

<template>
  <span v-if="imageShow" class="dotImage" fixed top-20 left--80 z--1 />
  <span v-if="imageShow" class="cloth" fixed top-20 right--120 z--1 />
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer :key="route.path" />
  </main>
  <Transition name="fade">
    <div v-if="imageModel" fixed top-0 left-0 right-0 bottom-0 z-500 backdrop-blur-7 @click="imageModel = undefined">
      <div absolute top-0 left-0 right-0 bottom-0 bg-black:30 z--1 />
      <img :src="imageModel.src" :alt="imageModel.alt" w-full h-full object-contain>
    </div>
  </Transition>
  <FantasyLand />
  <ClientOnly>
    <!-- music player, client only -->
    <APlayer />
    <!-- 3D Model -->
    <div w-80 h-80 fixed right-0 bottom-0 z-0>
      <TresCanvas shadow alpha >
        <TresPerspectiveCamera :position="[3, 4, 5]" />
        <OrbitControls :target="[0, 3, 0]"/>
        <Suspense>
          <Girl3D />
        </Suspense>
      </TresCanvas>
    </div>
  </ClientOnly>
</template>
