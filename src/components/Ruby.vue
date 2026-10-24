<script setup lang="ts">
const props = defineProps<{
  content: string
  rt: string
}>()
</script>

<template>
  <ruby>
    {{ props.content }}
    <rt>{{ props.rt }}</rt>
  </ruby>
</template>
