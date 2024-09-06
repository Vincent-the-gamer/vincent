<template>
    <div class="mt-8" flex="~ col justify-center items-center">
        <h1 class="text-2xl font-bold mb-4">2048 Game</h1>
        <div class="relative">
            <div v-if="!gameOver && !gameWon" class="grid grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg shadow-lg">
                <div v-for="(value, index) in board" :key="index" :class="getTileClass(value)"
                    class="w-20 h-20 flex items-center justify-center text-xl font-bold rounded-lg transition-transform duration-300 ease-out transform hover:scale-110">
                    <transition name="slide-fade" mode="out-in">
                        <div v-if="value !== 0" :key="value">
                            {{ value }}
                        </div>
                    </transition>
                </div>
            </div>
            <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 rounded-lg shadow-lg">
                <div v-if="gameWon" class="text-center text-2xl font-bold text-green-500">You Win!</div>
                <div v-else class="text-center text-2xl font-bold text-red-500">Game Over</div>
            </div>
        </div>
        <div class="mt-4 text-center text-xl font-bold">Score: {{ score }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useEventListener } from '@vueuse/core'

const board = ref(Array(16).fill(0))
const score = ref(0)
const gameOver = ref(false)
const gameWon = ref(false)

const initBoard = () => {
  board.value = Array(16).fill(0)
  addNewTile()
  addNewTile()
  gameOver.value = false
  gameWon.value = false
}

const addNewTile = () => {
  const emptyTiles = board.value.reduce((acc, val, index) => {
    if (val === 0) acc.push(index)
    return acc
  }, [])
  if (emptyTiles.length > 0) {
    const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
    board.value[randomIndex] = Math.random() < 0.9 ? 2 : 4
  }
}

const checkGameOver = () => {
  if (board.value.includes(2048)) {
    gameWon.value = true
    return
  }
  if (!board.value.includes(0)) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const index = i * 4 + j
        if ((j < 3 && board.value[index] === board.value[index + 1]) || (i < 3 && board.value[index] === board.value[index + 4])) {
          return
        }
      }
    }
    gameOver.value = true
  }
}

const move = (direction: 'up' | 'down' | 'left' | 'right') => {
  const oldBoard = [...board.value]
  let changed = false

  const rotateBoard = (board: number[]) => {
    const N = Math.sqrt(board.length)
    const rotated = Array(16).fill(0)
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        rotated[i * N + j] = board[(N - j - 1) * N + i]
      }
    }
    return rotated
  }

  const moveLeft = (board: number[]) => {
    const N = Math.sqrt(board.length)
    for (let i = 0; i < N; i++) {
      let row = board.slice(i * N, (i + 1) * N)
      row = row.filter(x => x !== 0)
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2
          score.value += row[j]
          row[j + 1] = 0
          changed = true
        }
      }
      row = row.filter(x => x !== 0)
      while (row.length < N) row.push(0)
      for (let j = 0; j < N; j++) {
        if (board[i * N + j] !== row[j]) changed = true
        board[i * N + j] = row[j]
      }
    }
    return board
  }

  let newBoard = [...board.value]
  if (direction === 'up') {
    newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)))
    newBoard = moveLeft(newBoard)
    newBoard = rotateBoard(newBoard)
  } else if (direction === 'down') {
    newBoard = rotateBoard(newBoard)
    newBoard = moveLeft(newBoard)
    newBoard = rotateBoard(rotateBoard(rotateBoard(newBoard)))
  } else if (direction === 'left') {
    newBoard = moveLeft(newBoard)
  } else if (direction === 'right') {
    newBoard = rotateBoard(rotateBoard(newBoard))
    newBoard = moveLeft(newBoard)
    newBoard = rotateBoard(rotateBoard(newBoard))
  }

  if (changed) {
    board.value = newBoard
    addNewTile()
  }

  if (JSON.stringify(oldBoard) !== JSON.stringify(board.value)) {
    addNewTile()
  }

  checkGameOver()
}

const handleKeyDown = (e: KeyboardEvent) => {
  e.preventDefault()
  if (e.key === 'ArrowUp') move('up')
  else if (e.key === 'ArrowDown') move('down')
  else if (e.key === 'ArrowLeft') move('left')
  else if (e.key === 'ArrowRight') move('right')
}

const getTileClass = computed(() => (value: number) => {
  const baseClass = 'transition-all duration-100 ease-in-out'
  switch (value) {
    case 2: return `${baseClass} bg-yellow-100 text-gray-700`
    case 4: return `${baseClass} bg-yellow-200 text-gray-700`
    case 8: return `${baseClass} bg-orange-200 text-white`
    case 16: return `${baseClass} bg-orange-300 text-white`
    case 32: return `${baseClass} bg-orange-400 text-white`
    case 64: return `${baseClass} bg-orange-500 text-white`
    case 128: return `${baseClass} bg-red-300 text-white`
    case 256: return `${baseClass} bg-red-400 text-white`
    case 512: return `${baseClass} bg-red-500 text-white`
    case 1024: return `${baseClass} bg-red-600 text-white`
    case 2048: return `${baseClass} bg-yellow-300 text-white`
    default: return `${baseClass} bg-gray-100 text-gray-500`
  }
})

onMounted(() => {
  initBoard()
  useEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>