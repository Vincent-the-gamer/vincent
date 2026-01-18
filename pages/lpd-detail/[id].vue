<script setup lang="ts">
const { query } = useRoute();
</script>

<template>
    <div flex="~ col justify-center items-center">
        <img :src="query.image?.toString()" w-100 />
        <div font="size-7 bold">
            {{ query.name }}
        </div>
        <p mb-5>
            {{ query.artist }}
        </p>

        <div mb-2 flex="~ col items-center">
            <p>难度/Difficulty:</p>
            <div flex="~ items-center">
                <div font-size-6 color-red>
                    {{ query.difficulty }}
                </div>
                <span>/10</span>
            </div>
        </div>

        <div mb-2 flex="~ col items-center">
            <p>视频/Video:</p>
            <p>
                <a :href="query.video?.toString()" target="_blank">{{
                    query.video
                }}</a>
            </p>
        </div>

        <div mb-2 flex="~ col items-center">
            <p>
                最低Ableton Live版本需求 / Minimum Ableton Live version
                required:
            </p>
            <p color-red font-size-6>
                {{ query.minAbletonLiveVersion }}
            </p>
        </div>
        <p>下载/Download:</p>
        <div
            v-if="query.baiduLink || query.googleDriveLink"
            flex="~ row gap-2"
            mt-1
        >
            <a id="dld" target="_blank" :href="query.baiduLink?.toString()">
                <div
                    title="百度网盘"
                    w-fit
                    h-8
                    p-2
                    cursor-pointer
                    bg-white
                    hover:bg-purple
                    border="rd-2"
                    flex="~ items-center"
                >
                    <div i-arcticons-baidu-netdisk />
                    <span>百度网盘</span>
                </div>
            </a>
            <a
                id="dld"
                target="_blank"
                :href="query.googleDriveLink?.toString()"
            >
                <div
                    title="Google Drive"
                    w-fit
                    h-8
                    p-2
                    cursor-pointer
                    bg-white
                    hover:bg-purple
                    border="rd-2"
                    flex="~ items-center"
                >
                    <div i-mynaui-brand-google-solid />
                    <span>Google Drive</span>
                </div>
            </a>
        </div>
        <div v-else>等待上传/To be upload soon.</div>
    </div>
</template>

<style scoped>
a {
    color: rgb(195, 0, 255);
    text-decoration: underline;
    &:hover {
        color: rgb(143, 0, 117);
    }

    &#dld {
        color: black;
        text-decoration: none;
    }
}
</style>
