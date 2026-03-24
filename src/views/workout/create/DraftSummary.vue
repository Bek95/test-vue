<script setup>

import {useWorkoutStore} from "@/workoutStore.js";

const workoutStore = useWorkoutStore()

const blocks = workoutStore.blockExercices

const blocksId = workoutStore.getBlockExercicesId

// console.log('blocksSession : ', workoutStore.activeSession.blocks,)

// console.log('blocks : ', blocks)
// console.log( 'blockId :', blocksId,)

//todo lors du rajout d'exercices après avoir créer un 1er block, séparé les block

const hasSuperset = workoutStore.hasSupersetBlock

console.log("has super set : ", hasSuperset)

</script>

<template>
  <div class="container-fluid p-6" style="max-width: 40rem">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h2 class="h5 mb-1">{{ workoutStore.workoutName }}</h2>
        <h6 class="mb-0 opacity-75">{{ workoutStore.activeSessionName }}</h6>
      </div>

      <div class="card-body">
        <div v-if="blocks" class="d-flex flex-column gap-3">

          <div class="card border-light">
            <div class="card-header bg-light d-flex justify-content-between align-items-center">
              <span class="fw-bold text-uppercase small">Block 1</span>
              <span v-if="hasSuperset" class="badge rounded-pill bg-warning text-dark">Superset</span>
            </div>

            <div class="card-body p-0">
              <div :class="['p-3', { 'superset-border': hasSuperset }]">

                <div v-for="(exo, index) in blocks" :key="index" class="exo-row mb-2">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <span class="fw-bold">{{ exo.name }}</span>
                      <div class="text-muted small">
                        {{ exo.sets }} séries × {{ exo.reps }} reps
                      </div>
                    </div>

                    <div class="text-end">
                      <span class="badge bg-light text-secondary border">
                        <i class="bi bi-clock me-1"></i>
                        <span v-if="exo.restTime >= 60">{{ exo.restTime / 60 }} min</span>
                        <span v-else>{{ exo.restTime }} s</span>
                      </span>
                    </div>
                  </div>
                  <hr v-if="index < blocks.length - 1" class="my-2 opacity-25">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-2 d-flex justify-content-end">
      <router-link :to="{name: 'training-plan-create'}"><button class="btn btn-primary me-2">Ajouter des Blocks/exercices</button></router-link>
      <button class="btn btn-success">Enregistrer le programme</button>
    </div>
  </div>
</template>

<style scoped>
/* Ligne verticale distinctive pour le superset */
.superset-border {
  border-left: 4px solid #ffc107; /* Jaune/Orange pour l'énergie */
  background-color: rgba(255, 193, 7, 0.03); /* Un fond très léger */
  margin-left: 0;
  border-radius: 0 4px 4px 0;
}

.exo-row {
  transition: all 0.2s ease;
}

/* Optionnel : petite animation au survol */
.exo-row:hover {
  transform: translateX(5px);
}

.card {
  border-radius: 12px;
  overflow: hidden;
}
</style>