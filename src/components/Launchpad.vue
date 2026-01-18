<script setup lang="ts">
import type { LaunchpadItem } from "~/types";
import { scrollIntoView } from "~/logics/scrollIntoView";

defineProps<{ lpds: LaunchpadItem[] }>();

const dark = useDark();

function buildLink(lpd: LaunchpadItem): string {
    let link = lpd.link || "#";
    if (link !== "#") {
        const name = encodeURIComponent(lpd.name as string);
        const image = encodeURIComponent(lpd.image as string);
        const artist = encodeURIComponent(lpd.artist as string);
        const video = encodeURIComponent(lpd.video as string);
        const baiduLink = lpd.baiduLink
            ? encodeURIComponent(lpd.baiduLink as string)
            : undefined;
        const minAbletonLiveVersion = encodeURIComponent(
            lpd.minAbletonLiveVersion as string,
        );
        const googleDriveLink = lpd.googleDriveLink
            ? encodeURIComponent(lpd.googleDriveLink as string)
            : undefined;
        link = `${lpd.link}?name=${name}&image=${image}&artist=${artist}&difficulty=${lpd.difficulty}&video=${video}${baiduLink ? `&baiduLink=${baiduLink}` : ""}${googleDriveLink ? `&googleDriveLink=${googleDriveLink}` : ""}&minAbletonLiveVersion=${minAbletonLiveVersion}`;
    }
    return link;
}
</script>

<template>
    <div class="max-w-300 mx-auto">
        <div
            v-for="lpd of lpds"
            :id="lpd.id"
            :key="lpd.id"
            class="border-rd-9px hover:cursor-pointer m-10px transition-all-500 p-15px border-1px border-solid border-gray hover:scale-102% hover:box-shadow-0-0-15px-gray"
            :class="
                dark
                    ? 'hover:bg-rgba-30-30-30-0.8'
                    : 'hover:bg-rgba-240-240-240-0.8'
            "
            @click="$router.push(buildLink(lpd) || '#')"
        >
            <span
                class="border-0 m-0 position-relative top-5px left-5px font-size-16px"
                :class="dark ? 'color-white' : 'color-black'"
            >
                {{ lpd.date }}
            </span>
            <h3
                class="m-0 m-l-5px"
                :class="dark ? 'color-white' : 'color-black'"
            >
                {{ lpd.name }}
            </h3>
            <p mt-2 ml-1>
                {{ lpd.artist }}
            </p>
            <img
                v-if="lpd.image"
                :src="lpd.image"
                class="p-20px"
                pointer-events-none
            />
        </div>
    </div>
    <div>
        <div class="table-of-contents">
            <div class="table-of-contents-anchor">
                <div class="i-ri-menu-2-fill" />
            </div>
            <ul>
                <li
                    v-for="lpd of lpds"
                    :key="lpd.id"
                    class="hover:cursor-pointer"
                    @click="() => scrollIntoView(lpd.id)"
                >
                    {{ lpd.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped></style>
