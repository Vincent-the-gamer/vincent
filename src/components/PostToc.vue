<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  content?: HTMLElement
}>()

const items = ref<TocItem[]>([])
const activeId = ref('')

const HEADING_SELECTOR = 'h1[id], h2[id], h3[id], h4[id]'

function getHeadingText(heading: HTMLElement) {
  // Strip the permalink anchor ("#") added by markdown-it-anchor.
  const clone = heading.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.header-anchor').forEach(el => el.remove())
  return clone.textContent?.trim() || heading.id
}

function updateActive() {
  if (!items.value.length)
    return

  const scrollTop = window.scrollY
  const threshold = scrollTop + 150
  let current = items.value[0].id

  for (const item of items.value) {
    const heading = document.getElementById(item.id)
    if (!heading)
      continue
    const top = heading.getBoundingClientRect().top + scrollTop
    if (top <= threshold)
      current = item.id
    else break
  }

  // Highlight the last item once the page is scrolled to the bottom.
  if (
    window.innerHeight + scrollTop
    >= document.documentElement.scrollHeight - 2
  ) {
    current = items.value[items.value.length - 1].id
  }

  activeId.value = current
}

function collect(element: HTMLElement) {
  items.value = Array.from(
    element.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
  ).map(heading => ({
    id: heading.id,
    text: getHeadingText(heading),
    level: Number(heading.tagName[1]),
  }))
  updateActive()
}

function goTo(id: string) {
  const heading = document.getElementById(id)
  if (!heading)
    return

  const y = window.scrollY + heading.getBoundingClientRect().top - 40
  window.scrollTo({ top: y, behavior: 'smooth' })
  window.history.replaceState({}, '', `#${id}`)
  activeId.value = id
}

let ticking = false
function onScroll() {
  if (ticking)
    return
  ticking = true
  requestAnimationFrame(() => {
    updateActive()
    ticking = false
  })
}

watch(
  () => props.content,
  async (element) => {
    if (!element)
      return
    await nextTick()
    collect(element)
  },
  { immediate: true },
)

onMounted(() => {
  if (props.content)
    collect(props.content)
  useEventListener(window, 'scroll', onScroll, { passive: true })
})
</script>

<template>
  <div>
    <nav
      v-if="items.length > 1"
      class="table-of-contents post-toc"
      aria-label="文章目录"
    >
      <div class="table-of-contents-anchor">
        <div class="i-ri-menu-2-fill" />
      </div>
      <ul>
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            :class="{ active: activeId === item.id }"
            :style="{
              paddingLeft: `${(item.level - 1) * 0.75}rem`,
            }"
            @click.prevent="goTo(item.id)"
          >{{ item.text }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.post-toc a.active {
  opacity: 1;
  color: var(--fg-deep);
  font-weight: 500;
}
</style>
