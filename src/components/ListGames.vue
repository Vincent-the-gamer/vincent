<script setup lang="ts">
import { GameHistory } from '~/types';
import { scrollIntoView } from '~/logics/scrollIntoView';

defineProps<{ games: GameHistory[] }>()

</script>

<template>
    <div class="max-w-300 mx-auto">
        <div class="hover:bg-rgba-240-240-240-0.8 border-rd-9px hover:cursor-pointer m-5px transition-all-200"
             v-for="game of games" :key="game.id"
             :id="game.id">
            <span class="border-0 m-0 position-relative top-5px left-5px font-size-16px color-gray">{{ game.date }}</span>
            <h3 class="m-0 m-l-5px">{{ game.name }}</h3>
            <img v-if="game.image" :src="game.image" class="p-20px"/>
        </div>
    </div>
    <div>
        <div class="table-of-contents">
            <div class="table-of-contents-anchor">
            <div class="i-ri-menu-2-fill" />
            </div>
            <ul>
            <li v-for="game of games" :key="game.id"
                class="hover:cursor-pointer"
                @click="() => scrollIntoView(game.id)">{{ game.name }}</li>
            </ul>
        </div>
    </div>
</template>