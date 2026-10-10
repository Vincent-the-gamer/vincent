<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>();

function slug(name: string) {
    return name.toLowerCase().replace(/[\s\\/]+/g, "-");
}

// Peak tilt, in degrees, applied to each axis at the card's edges.
const TILT_MAX = 8;

// Track the cursor inside a card: drives both the glow position and the 3D tilt.
// Written to CSS custom properties so all motion stays on the compositor.
function handleCardTilt(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--ry", `${(x - 0.5) * TILT_MAX * 2}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * TILT_MAX * 2}deg`);
}

// Ease the card back to rest once the pointer leaves.
function resetCardTilt(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
}
</script>

<template>
    <div max-w-300 mx-auto>
        <div
            v-for="(key, cidx) in Object.keys(projects)"
            :key="key"
            slide-enter
            :style="{ '--enter-stage': cidx + 1 }"
        >
            <h4 :id="slug(key)" class="mt-15 mb-2 font-bold text-center op75">
                {{ key }}
            </h4>
            <div
                class="project-grid py-2 max-w-500 w-max mx-auto"
                grid="~ cols-1 md:cols-2 gap-4"
                :class="
                    projects[key].length === 1
                        ? 'flex'
                        : projects[key].length > 2
                          ? 'lg:grid-cols-3'
                          : ''
                "
            >
                <a
                    v-for="(item, idx) in projects[key]"
                    :key="idx"
                    class="item relative flex items-center"
                    :href="item.link"
                    target="_blank"
                    @mousemove="handleCardTilt"
                    @mouseleave="resetCardTilt"
                    :class="
                        !item.link
                            ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4'
                            : ''
                    "
                    :title="item.name"
                >
                    <div v-if="item.icon" class="pt-2 pr-5">
                        <!-- pic -->
                        <img
                            v-if="item.icon === 'cardforge'"
                            class="text-4xl w-80px h-60px"
                            src="/images/projects/cardforge-logo.png"
                        />
                        <img
                            v-else-if="item.icon === 'nemassler'"
                            class="text-4xl w-200px h-75px"
                            src="/images/projects/nemassler.png"
                        />
                        <img
                            v-else-if="item.icon === 'wenyan'"
                            class="text-4xl w-120px h-75px"
                            src="/images/projects/wenyan.png"
                        />
                        <img
                            v-else-if="item.icon === 'g-shock'"
                            class="text-4xl w-160px h-75px"
                            src="/images/projects/g-shock-date-checker.jpg"
                        />
                        <img
                            v-else-if="item.icon === 'picdiet'"
                            class="text-4xl w-220px h-35px"
                            src="/images/projects/picdiet.png"
                        />
                        <img
                            v-else-if="item.icon === 'neonheart'"
                            class="text-4xl w-125px h-88px"
                            src="/images/projects/neonheart.png"
                        />
                        <img
                            v-else-if="item.icon === 'github'"
                            class="text-4xl w-200px h-88px"
                            src="/images/projects/github.png"
                        />
                        <img
                            v-else-if="item.icon === 'transfonter'"
                            class="text-4xl w-300px h-30px"
                            src="/images/projects/transfonter.png"
                        />
                        <img
                            v-else-if="item.icon === 'vitepress'"
                            class="text-4xl w-80px h-70px"
                            src="/images/projects/vitepress-logo.png"
                        />
                        <img
                            v-else-if="item.icon === 'utils'"
                            class="text-4xl w-85px h-70px"
                            src="/images/projects/vince-utils.png"
                        />
                        <img
                            v-else-if="item.icon === 'music'"
                            class="text-4xl w-80px h-75px"
                            src="/images/projects/music.png"
                        />
                        <img
                            v-else-if="item.icon === 'html2pdf'"
                            class="text-4xl w-80px h-75px"
                            src="/images/projects/html2pdf.jpg"
                        />
                        <img
                            v-else-if="item.icon === 'vizzy'"
                            class="text-4xl w-80px h-50px"
                            src="/images/projects/vizzy.png"
                        />
                        <img
                            v-else-if="item.icon === 'aya'"
                            class="text-4xl w-110px h-75px"
                            src="/images/projects/aya.png"
                        />
                        <img
                            v-else-if="item.icon === 'slidev'"
                            class="text-4xl w-110px h-75px"
                            src="/images/projects/slidev.png"
                        />
                        <img
                            v-else-if="item.icon === 'jinx'"
                            class="text-4xl w-100px h-50px"
                            src="/images/projects/jinx.png"
                        />
                        <img
                            v-else-if="item.icon === 'meguru'"
                            class="text-4xl w-100px h-80px"
                            src="/images/projects/meguru.jpg"
                        />
                        <img
                            v-else-if="item.icon === 'napi'"
                            class="text-4xl w-90px h-80px"
                            src="/images/projects/napi.png"
                        />
                        <img
                            v-else-if="item.icon === 'electron'"
                            class="text-4xl w-90px h-80px"
                            i-ion-logo-electron
                        />
                        <img
                            v-else-if="item.icon === 'mayu'"
                            class="text-4xl w-80px h-80px"
                            src="/images/projects/mayu.png"
                        />
                        <img
                            v-else-if="item.icon === 'license'"
                            class="text-4xl w-100px h-60px"
                            src="/images/projects/license.png"
                        />
                        <img
                            v-else-if="item.icon === 'sakura'"
                            class="text-4xl w-150px h-80px"
                            src="/images/projects/sakura.png"
                        />
                        <img
                            v-else-if="item.icon === 'ruri'"
                            class="text-4xl w-90px h-80px"
                            src="/images/projects/ruri.png"
                        />
                        <img
                            v-else-if="item.icon === 'estelle'"
                            src="/images/projects/estelle.png"
                            text-4xl
                            w-80px
                            h-80px
                        />

                        <!-- gif -->
                        <img
                            v-else-if="item.icon === 'yew'"
                            class="text-4xl w-140px h-75px"
                            src="/gifs/yew.gif"
                        />

                        <!-- ico -->
                        <img
                            v-else-if="item.icon === 'mio-bt'"
                            src="https://miobt.com/images/favicon/miobt.ico"
                            text-4xl
                            w-75px
                            h-75px
                        />
                        <img
                            v-else-if="item.icon === 'mikan'"
                            src="https://www.acgbox.link/wp-content/uploads/2023/09/mikanani.me_.png"
                            text-4xl
                            w-75px
                            h-75px
                        />
                        <img
                            v-else-if="item.icon === 'nyaa'"
                            src="https://www.acgbox.link/wp-content/uploads/favicon/nyaa.si.png"
                            text-4xl
                            w-145px
                            h-55px
                        />

                        <!-- svg -->
                        <img
                            v-else-if="item.icon === 'nitro'"
                            class="w-80px h-55px"
                            src="/images/projects/nitro.svg"
                        />

                        <!-- else -->
                        <img
                            v-else-if="item.icon.includes('http')"
                            class="text-3xl opacity-50"
                            :src="item.icon"
                        />
                        <div
                            v-else
                            class="text-3xl opacity-50"
                            :class="item.icon || 'i-carbon-unknown'"
                        />
                    </div>
                    <div class="flex-auto">
                        <div class="text-normal color-black dark:color-white">
                            {{ item.name }}
                        </div>
                        <div
                            class="desc text-sm opacity-90 font-normal"
                            v-html="item.desc"
                        />
                    </div>
                </a>
            </div>
        </div>
    </div>
    <div>
        <div class="table-of-contents">
            <div class="table-of-contents-anchor">
                <div class="i-ri-menu-2-fill" />
            </div>
            <ul>
                <li v-for="key of Object.keys(projects)" :key="key">
                    <a :href="`#${slug(key)}`">{{ key }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.project-grid a.item {
    --mx: 50%;
    --my: 50%;
    --rx: 0deg;
    --ry: 0deg;
    position: relative;
    isolation: isolate;
    background: transparent;
    font-size: 1.1rem;
    width: 350px;
    max-width: 100%;
    padding: 0.5rem 0.875rem 0.875rem;
    border-radius: 10px;
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry));
    transition:
        transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.4s ease,
        background-color 0.4s ease;
}

/* Soft aura under the content that follows the cursor. */
.project-grid a.item::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: radial-gradient(
        300px circle at var(--mx) var(--my),
        color-mix(in srgb, var(--c-accent) 24%, transparent),
        transparent 72%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
}

/* Spotlight border: a hairline ring lit only where the cursor is. */
.project-grid a.item::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(
        240px circle at var(--mx) var(--my),
        color-mix(in srgb, var(--c-accent) 80%, transparent),
        transparent 68%
    );
    -webkit-mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask:
        linear-gradient(#000 0 0) content-box,
        linear-gradient(#000 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
}

.project-grid a.item:hover {
    background: #88888811;
    box-shadow: 0 12px 34px -14px
        color-mix(in srgb, var(--c-accent) 60%, transparent);
}

.project-grid a.item:hover::before,
.project-grid a.item:hover::after {
    opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
    .project-grid a.item,
    .project-grid a.item::before,
    .project-grid a.item::after {
        transition: none;
    }

    .project-grid a.item {
        transform: none;
    }
}

.table-of-contents {
    width: 100px;
}
</style>
