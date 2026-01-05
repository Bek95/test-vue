<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const route = useRoute()
const selectedType = computed(() => route.query.type)

console.log(selectedType.value)

// Données du bloc en cours de création
const exercises = ref([])
const settings = ref({
  timer: 0,      // Pour AMRAP / EMOM
  restTime: 60,  // Pour Musculation
  rounds: 1
})

console.log(selectedType.value)

const addExercise = () => {
  exercises.value.push({ name: '', reps: 10, weight: 0 })
}
</script>

<template>

  <div class="container mt-5">
    <div class="card" style="width: 25rem;">
      <img src="" class="card-img-top" alt="">
      <div class="card-body">
        <div class="mb-3">
          <h2>Configuration : {{ selectedType }}</h2>
        </div>
          <div>
            <h5 v-if="!['warm-up', 'cool down'].includes(selectedType)"  class="card-title">Paramètres du temps</h5>

            <div v-if="selectedType === 'musculation'" class="row">
              <div class="col-md-6">
                <label class="form-label">Repos entre les séries (sec)</label>
                <input type="number" v-model="settings.restTime" class="form-control">
              </div>
            </div>

            <div v-else-if="['tabata'].includes(selectedType)" class="row">
              <div class="col-md-6 d-flex flex-row align-items-center">
                <div>
                  <label class="form-label">Rounds</label>
                  <input type="number" v-model="settings.timer" class="form-control">
                </div>
                <div>
                  <label class="form-label">Work</label>
                  <input type="number" v-model="settings.timer" class="form-control">
                </div>
                <div>
                  <label class="form-label">rest</label>
                  <input type="number" v-model="settings.timer" class="form-control">
                </div>
              </div>
            </div>

            <div v-else-if="['amrap', 'emom', 'fortime'].includes(selectedType)" class="row">
              <div class="col-md-6">
                <label class="form-label">Durée totale / Time Cap (min)</label>
                <input type="number" v-model="settings.timer" class="form-control">
              </div>
              <div v-if="selectedType === 'emom'" class="col-md-6">
                <label class="form-label">Départ toutes les X min</label>
                <input type="number" v-model="settings.rounds" class="form-control">
              </div>
            </div>
            <hr>
            <h5 class="card-title">Exercices</h5>
            <div v-for="(exo, index) in exercises" :key="index" class="input-group mb-2">
              <input type="text" v-model="exo.name" class="form-control w-50" placeholder="Nom de l'exo">
              <input type="number" v-model="exo.reps" class="form-control" placeholder="Reps">
              <button @click="exercises.splice(index, 1)" class="btn btn-outline-danger">X</button>
            </div>
            <button @click="addExercise" class="btn btn-primary mt-2">+ Ajouter un exercice</button>
          </div>
        </div>

        <div class="m-2 text-end">
          <router-link :to="{ name: 'workout-create' }" class="btn btn-outline-secondary">Annuler</router-link>
          <button class="btn btn-success ms-2">Enregistrer ce bloc</button>
        </div>
      </div>
  </div>

</template>