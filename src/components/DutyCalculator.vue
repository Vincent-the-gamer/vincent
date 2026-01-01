<script setup lang="ts">
import { createSnackbar } from "@snackbar/core";
import dayjs from "dayjs";

// 任意一次值班日起
const date = ref<string>("");
// 周期
const period = ref<number>(22);
// 需要推算的天数
const daysToPredict = ref<number>(10);

// 推算结果
const result = ref<string[]>([]);

// Dayjs星期映射
const dayOfWeekMap = {
    0: "星期日",
    1: "星期一",
    2: "星期二",
    3: "星期三",
    4: "星期四",
    5: "星期五",
    6: "星期六",
};

// 演算
function predict() {
    result.value = [];
    if (!date.value) {
        createSnackbar("日期不能为空!", {
            timeout: 2000, // 2秒
            actions: [
                {
                    text: "关闭",
                    style: {
                        color: "pink",
                    },
                    callback(_, snackbar) {
                        snackbar.destroy();
                    },
                },
            ],
        });
        return;
    }
    const dayjsDate = dayjs(date.value);
    for (let i = 1; i <= daysToPredict.value; i++) {
        const date = dayjsDate.add(period.value * i, "days");
        const dayOfWeek = date.day();
        result.value.push(
            `${date.format("YYYY-MM-DD")}，${dayOfWeekMap[dayOfWeek]}`,
        );
    }
}
</script>

<template>
    <p>
        <span>值班日期（任意一次）：</span>
        <input v-model="date" type="date" />
    </p>
    <p>
        <span>值班周期：</span>
        <input v-model="period" type="number" w-20 mr-1 />
        <span>天</span>
    </p>
    <p>
        <span>你需要推算多少天：</span>
        <input v-model="daysToPredict" type="number" w-20 mr-1 />
        <span>天</span>
    </p>

    <p>
        <button color-black bg-green w-20 p-2 b-rd-2 @click="predict">
            推算
        </button>
    </p>

    <div>
        <p font-bold>推算结果：</p>
        <ul>
            <li v-for="item of result" :key="item">
                {{ item }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
input {
    border-radius: 3px;
}
</style>
