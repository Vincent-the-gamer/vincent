<script setup lang="ts">
import { createSnackbar } from "@snackbar/core";

const wheel: any = ref(null);

const foods = ref<string>("");
const result = ref<string>("");

const wheelData = reactive<Record<string, any>>({
    blocks: [{ padding: "10px", background: "#869cfa" }],
    prizes: [],
    buttons: [
        { radius: "40%", background: "#617df2" },
        { radius: "35%", background: "#afc8ff" },
        {
            radius: "30%",
            background: "#869cfa",
            pointer: true,
            fonts: [{ text: "开始", top: "-10px" }],
        },
    ],
});

function getColor(index: number): string {
    const colorList = [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FF33F5",
        "#33FFF5",
        "#F5FF33",
        "#8A33FF",
        "#FF8A33",
        "#33FF8A",
        "#FF338A",
    ];
    return colorList[index % colorList.length];
}

function generatePrizes(foods: string[]) {
    const prizes: Record<string, any> = [];
    for (let i = 0; i < foods.length; i++) {
        prizes.push({
            background: getColor(i),
            fonts: [{ text: foods[i] }],
        });
    }

    return prizes;
}

onMounted(() => {
    const _foods = localStorage.getItem("foods");
    if (_foods) {
        foods.value = _foods;
    }
});

watch(
    () => foods.value,
    (newVal) => {
        wheelData.prizes = generatePrizes(newVal.split("\n"));
        localStorage.setItem("foods", newVal);
    },
);

// 优化随机索引获取逻辑，使用crypto实现随机
function getRandomNumberInRange(min: number, max: number): number {
    const range = max - min + 1;
    const randomArray = new Uint32Array(1);
    let randomNumber = 0;

    do {
        crypto.getRandomValues(randomArray);
        randomNumber = randomArray[0] % range;
    } while (randomNumber >= range);

    return min + randomNumber;
}

// 开始抽奖
function start() {
    const foodsArr = foods.value.split("\n");
    wheel.value?.play();
    useTimeoutFn(() => {
        const index: number = getRandomNumberInRange(0, foodsArr.length - 1);
        wheel.value?.stop(index);
    }, 3000);
}

function end(prize: Record<string, any>) {
    const _result = prize.fonts[0].text;
    result.value = _result;
    createSnackbar(`你抽中了：${_result}`, {
        timeout: 2000, // 2秒
        actions: [
            {
                text: "关闭",
                style: {
                    color: "pink",
                },
                callback(button, snackbar) {
                    snackbar.destroy();
                },
            },
        ],
    });
}
</script>

<template>
    <div>
        <p>输入你想吃的食物，一行一个:</p>
        <textarea v-model="foods" dark:bg-black />
        <LuckyWheel
            ref="wheel"
            class="wheel"
            width="200px"
            height="200px"
            :prizes="wheelData.prizes"
            :blocks="wheelData.blocks"
            :buttons="wheelData.buttons"
            @start="start"
            @end="end"
        />
        <div mt-4 font-size-6 color-red>抽奖结果：{{ result || "空" }}</div>
    </div>
</template>

<style lang="css" scoped>
textarea {
    width: 20rem;
    height: 8rem;
    border: 1.2px solid deeppink;
    border-radius: 4px;
    margin-block: 2rem;
}

.wheel {
    position: relative;
    margin: 0 auto;
}
</style>
