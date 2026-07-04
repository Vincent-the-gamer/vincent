<script setup lang="ts">
const { copy: _copy, copied } = useClipboard();
const el = ref<HTMLElement | null>(null);

function copy() {
    _copy((el.value?.textContent || "").trim());
}
</script>

<template>
    <div ref="el" class="gap-1 items-center">
        <slot />
        <button
            title="Copy"
            class="inline-flex items-center justify-center ml1.5 p0.5 rounded text-xs transition-all duration-200 op40 hover:op100 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-90"
            :class="copied ? 'text-green i-carbon-checkmark' : 'i-carbon-copy'"
            @click="copy()"
        />
    </div>
</template>
