<script setup lang="ts">
import { englishOnly, showToolsOnly, showNoteOnly } from "../logics";

const inactiveStyle = "opacity-20 hover:opacity-50";
const activeStyle = "opacity-100 underline";

const route = useRoute();

function toggleShowNote() {
    showToolsOnly.value = false;
    showNoteOnly.value = !showNoteOnly.value;
}

function toggleShowTools() {
    showNoteOnly.value = false;
    showToolsOnly.value = !showToolsOnly.value;
}
</script>

<template>
    <div class="prose m-auto mb-8 select-none animate-none! op100!">
        <button
            flex="~ gap1"
            items-center
            mb2
            op60
            text-sm
            @click="englishOnly = !englishOnly"
        >
            <div
                :i="englishOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'"
            />
            English Only
        </button>

        <button
            flex="~ gap1"
            items-center
            mb2
            op60
            text-sm
            @click="toggleShowNote"
        >
            <div
                :i="
                    showNoteOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'
                "
            />
            Show Only Notes/仅展示笔记
        </button>

        <button
            flex="~ gap1"
            items-center
            mb2
            op60
            text-sm
            @click="toggleShowTools"
        >
            <div
                :i="
                    showToolsOnly
                        ? 'carbon-checkbox-checked'
                        : 'carbon-checkbox'
                "
            />
            Show Only Tools/仅展示工具
        </button>

        <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-3xl>
            <RouterLink
                to="/posts"
                class="!border-none"
                :class="route.path === `/posts` ? activeStyle : inactiveStyle"
            >
                博客
            </RouterLink>
            <RouterLink
                to="/projects"
                class="!border-none"
                :class="
                    route.path === `/projects` ? activeStyle : inactiveStyle
                "
            >
                项目/工具
            </RouterLink>
            <RouterLink
                to="/lpd"
                class="!border-none"
                :class="route.path === `/lpd` ? activeStyle : inactiveStyle"
            >
                <span class="gradient-text">Launchpad</span>
            </RouterLink>
            <RouterLink
                to="/games"
                class="!border-none"
                :class="route.path === `/games` ? activeStyle : inactiveStyle"
            >
                游戏历程
            </RouterLink>
            <RouterLink
                to="/waifus"
                class="!border-none"
                :class="route.path === `/waifus` ? activeStyle : inactiveStyle"
            >
                老婆列表
            </RouterLink>
            <RouterLink
                to="/downloads"
                class="!border-none"
                :class="
                    route.path === `/downloads` ? activeStyle : inactiveStyle
                "
            >
                文件下载
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
/* gradient text */
.gradient-text {
    background: linear-gradient(120deg, #ffa5cb, #aa85ff);
    color: transparent;
    background-clip: text;
}
</style>
