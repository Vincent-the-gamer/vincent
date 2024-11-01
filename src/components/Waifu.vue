<template>
    <div flex="~ justify-center items-center" flex-wrap>
        <div class="card" flex="~ col justify-center items-center" v-for="waifu of props.waifus"
            @click="linkHref(waifu.moegirlLink)">
            <!-- Waifu avatar -->
            <div w-25 h-25>
                <img :src="waifu.avatar" b-rd-full pointer-events-none />
            </div>
            <!-- Waifu name -->
            <h2>{{ waifu.name }}</h2>
            <span>{{ waifu.from }}</span>
        </div>
    </div>

</template>

<script setup lang="ts">

interface Waifu {
    avatar: string, // 头像
    name: string,  // 姓名
    moegirlLink: string, // 萌娘百科链接
    from: string   // 角色来源
}

const props = defineProps<{
    waifus: Waifu[]
}>()

function linkHref(link: string) {
    window.open(link)
}
</script>

<style scoped>
.card {
    width: fit-content;
    padding: 50px;
    cursor: pointer;
}

img,
h2 {
    transition: all, 200ms;
}

.card:hover img {
    scale: 1.1;
}

.card:hover h2 {
    color: violet;
}
</style>