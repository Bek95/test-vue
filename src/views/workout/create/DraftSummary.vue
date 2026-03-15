<script setup>

import {useWorkoutStore} from "@/workoutStore.js";

const workoutStore = useWorkoutStore()

// console.log(
//     'blocks : ', workoutStore.activeSession.blocks,
//     'workoutName :', workoutStore.workoutName,
//     'Session Name :', workoutStore.activeSessionName
// )

const blocks = workoutStore.exercices

console.log("BLOCKS : ", blocks)

</script>

<template>
  <div class="container-fluid p-6" style="width: 35rem">
    <div class="card">
      <div class="card-header">
        <h2>{{ workoutStore.workoutName }}</h2>
        <h3>{{ workoutStore.activeSessionName }}</h3>
      </div>
      <div class="card-body">
        <div v-if="blocks">
          <p v-for="exo in blocks">{{ exo.name }} - {{ exo.sets }} X {{ exo.reps }} - repos :
            <span v-if="exo.restTime >= 60">{{ exo.restTime / 60 }} minute(s)</span>
            <span v-else>{{ exo.restTime }} sec</span>
          </p>
        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>

</style>