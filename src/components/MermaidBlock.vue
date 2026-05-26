<script setup lang="ts">
const props = defineProps<{ code: string }>()

const el = ref<HTMLDivElement>()

async function renderDiagram() {
  if (!el.value || typeof window === 'undefined')
    return

  const mermaid = (await import('mermaid')).default
  const isDark = document.documentElement.classList.contains('dark')
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
  })

  try {
    const { svg } = await mermaid.render(
      `mermaid-${Math.random().toString(36).slice(2, 8)}`,
      decodeURIComponent(props.code),
    )
    el.value.innerHTML = svg
  }
  catch (e) {
    el.value.innerHTML = `<pre style="color:red;border:1px solid red;padding:8px">${(e as Error).message}</pre>`
  }
}

onMounted(() => {
  renderDiagram()
})
</script>

<template>
  <div ref="el" class="mermaid" />
</template>
