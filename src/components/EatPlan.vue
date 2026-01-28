<script setup lang="ts">
const foods = ref<string>("");
const shuffledList = ref<string[]>([]);

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length; i; i--) {
        const j = Math.floor(Math.random() * i);
        [array[i - 1], array[j]] = [array[j], array[i - 1]];
    }
    return array;
}

function order() {
    const foodList: string[] = foods.value
        .split("\n")
        .map((item) => item.trim());
    shuffledList.value = shuffleArray(foodList);
}

onMounted(() => {
    const _foods = localStorage.getItem("order-foods");
    if (_foods) {
        foods.value = _foods;
    }
});

watch(
    () => foods.value,
    (newVal) => {
        localStorage.setItem("order-foods", newVal);
    },
);
</script>

<template>
    <div flex="~ col justify-center items-center">
        <p>输入食物，一行一个，让我来帮你规划顺序！</p>
        <textarea v-model="foods" dark:bg-black />
        <button color-white bg-black btn-pink @click="order">
            规划！！！！
        </button>
        <div mt-2>
            <div>规划结果：</div>
            <span color-red>提示，你可以按照一周的顺序来安排这些食物</span>
            <div v-if="shuffledList.length >= 1">
                <li v-for="(item, index) in shuffledList" :key="index">
                    {{ item }}
                </li>
            </div>
            <h2 v-else>空</h2>
        </div>
    </div>
</template>

<style scoped>
textarea {
    width: 20rem;
    height: 8rem;
    border: 1.2px solid deeppink;
    border-radius: 4px;
    margin-block: 1rem;
}
</style>
