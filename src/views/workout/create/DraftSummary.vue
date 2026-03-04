<script setup>

import {useWorkoutStore} from "@/workoutStore.js";

const workoutStore = useWorkoutStore()


console.log(
    'blocks : ', workoutStore.activeSession.blocks,
    'workoutName :', workoutStore.workoutName,
    'workoutName :', workoutStore.activeSessionName
)

</script>

<template>
  <div class="container-fluid border p-6" style="width: 35rem">
    <div class="card">
      <div class="card-header"></div>
      <div class="card-body"></div>
    </div>
  </div>

</template>

<style scoped>

</style>