<script setup>
import { ref } from 'vue'

import { faPlus, faDumbbell, faFire, faPersonRunning, faClock, faStopwatch20, faHourglass, faChildReaching } from "@fortawesome/free-solid-svg-icons";

let id = 0
const trainingTypes = ref([
  {id: id, name: "warm-up", borderLeftColor: "warmup-border-left-color"},
  {id: id, name: "musculation", borderLeftColor: "classical-border-left-color"},
  {id: id, name: "amrap", borderLeftColor: "amrap-border-left-color"},
  {id: id, name: "fortime", borderLeftColor: "fortime-border-left-color"},
  {id: id, name: "tabata", borderLeftColor: "tabata-border-left-color"},
  {id: id, name: "emom", borderLeftColor: "emom-border-left-color"},
  {id: id, name: "cool down", borderLeftColor: "cool-down-border-left-color"},
])

const blocks =  ref([])
const addBlock = () => {
  // on crée un objet de base selon le type de block
  const newBBlock = {
    id: Date.now(), // ID unique pour la boucle v-for
    type: type,
    exercises: [],
    settings: {
      duration: 0,
      rounds: 0,
      repetitions: 0,
      weight: 0,
      rest: 60
    }
  }
  blocks.value.push(newBBlock)
}
</script>

<template>

  <div class="container mt-5">
    <div class="card" style="width: 25rem;">
      <img src="" class="card-img-top" alt="">
      <div class="card-body">
        <div class="mb-3">
          <h5 class="card-title"><label class="form-label">Nom du bloc :</label></h5>
          <input type="text" class="form-control" placeholder="Ex: Musculation - force">
        </div>
        <p class="card-text">Ajouter un bloc de type : [warmup, musculation classique, crosstraining, cool down]</p>
        <div class="btn-group d-flex flex-column">
          <button v-for="training in trainingTypes"  class="btn btn-outline-secondary m-2" :class="training.borderLeftColor">{{ training.name.toUpperCase() }}</button>
        </div>
        <div class="m-2 text-end">
          <router-link :to="{ name: 'workout-create' }" class="btn btn-secondary">Retour</router-link>
          <button class="btn btn-primary ms-2">Créer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.warmup-border-left-color {
  border-left: 8px solid #aebdd1;
}

.classical-border-left-color {
  border-left: 8px solid #dba81a;
}

.amrap-border-left-color {
  border-left: 8px solid #ed1123;
}

.fortime-border-left-color {
  border-left: 8px solid #a369c9;
}

.tabata-border-left-color {
  border-left: 8px solid #2c7d09;
}

.emom-border-left-color {
  border-left: 8px solid #2f3ced;
}

.cool-down-border-left-color {
  border-left: 8px solid #69c9c0;
}

</style>