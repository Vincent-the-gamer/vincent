<template>
    <div ref="typedEl" inline-block />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"
import Typed from "typed.js"

const props = defineProps<{
    strings: string[]
}>()

const typedEl = ref<HTMLElement>(null)

let typed: any = null

onMounted(() => {
    typed = new Typed(typedEl.value, {
        strings: props.strings,
        typeSpeed: 100,
        backSpeed: 60,
        typeDelay: 500,
        backDelay: 500,
        loop: true
    })
})

onUnmounted(() => {
    if(typed) {
        typed.destroy()
    }
})

</script>