<template>
    <primitive :object="model" />
</template>

<script setup lang="ts">
import { useAnimations, useGLTF } from '@tresjs/cientos'

const { scene: model, animations } = await useGLTF("/3d-models/chibi/scene.gltf", { draco: true })
const { actions } = useAnimations(animations, model)
const currentAction = ref(actions["Take 001"])

currentAction.value.play()
</script>