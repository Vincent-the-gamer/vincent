<template>
    <div class="max-w-300 mx-auto">
        <div v-for="lpd of lpds" :id="lpd.id" :key="lpd.id" @click="$router.push(lpd.link || '#')"
            class="border-rd-9px hover:cursor-pointer m-10px transition-all-500 p-15px border-1px border-solid border-gray
                    hover:scale-102% hover:box-shadow-0-0-15px-gray"
            :class="dark ? 'hover:bg-rgba-30-30-30-0.8' : 'hover:bg-rgba-240-240-240-0.8'">
            <span class="border-0 m-0 position-relative top-5px left-5px font-size-16px"
                :class="dark ? 'color-white' : 'color-black'">
                {{ lpd.date }}
            </span>
            <h3 class="m-0 m-l-5px" :class="dark ? 'color-white' : 'color-black'">
                {{ lpd.name }}
            </h3>
            <img v-if="lpd.image" :src="lpd.image" class="p-20px" pointer-events-none>
        </div>
    </div>
    <div>
        <div class="table-of-contents">
            <div class="table-of-contents-anchor">
                <div class="i-ri-menu-2-fill" />
            </div>
            <ul>
                <li v-for="lpd of lpds" :key="lpd.id" class="hover:cursor-pointer"
                    @click="() => scrollIntoView(lpd.id)">
                    {{ lpd.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { scrollIntoView } from '~/logics/scrollIntoView'
import type { LaunchpadItem } from '~/types'

defineProps<{ lpds: LaunchpadItem[] }>()

const dark = useDark()
</script>

<style scoped></style>