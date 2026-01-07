<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'

const route = useRoute()
const selectedType = computed(() => route.query.type)

// État de la recherche et sélection
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedExo = ref(null)
const sets = ref(4)
const reps = ref(0)
const superset = computed(() => blockExercices.value.length > 1)
const isSupersetEnabled = ref(false)
let supersetExercicesOrder = 1

const settings = ref({
  timer: 0,
  restTime: 60,
  rounds: 1,
  sets: 0,
  reps: 0,
  secondRestTime: 60,
})

let id = 0
const exercices = ref([
  { id: id++, name: 'Squat', category: 'reps' },
  { id: id++, name: 'Bench Press', category: 'reps' },
  { id: id++, name: 'Deadlift', category: 'reps' },
  { id: id++, name: 'Pull Up', category: 'reps' },
  { id: id++, name: 'Push Up', category: 'reps' },
  { id: id++, name: 'Dips', category: 'reps' },
  { id: id++, name: 'running', category: 'duration' },
])

const filteredExercices = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return exercices.value.filter(exo =>
      exo.name.toLowerCase().includes(query)
  )
})

const selectExo = (exo) => {
  selectedExo.value = exo
  searchQuery.value = exo.name.toUpperCase()
  showDropdown.value = false
}

const blockExercices = ref([])

const addExercice = () => {
  const rest = ref('')
  if (!selectedExo.value) return

  // VERIFICATION : On empêche le même exercice dans le même bloc
  const isAlreadyInBlock = blockExercices.value.some(exo => exo.id === selectedExo.value.id)

  if (isAlreadyInBlock) {
    alert("Cet exercice est déjà dans le bloc. Pour un superset, choisissez un exercice différent.")
    return
  }

  rest.value = settings.value.restTime

  blockExercices.value.push({
    id: selectedExo.value.id,
    order: supersetExercicesOrder++,
    name: selectedExo.value.name,
    sets: sets.value,
    reps: reps.value,
    restTime: rest.value,
  })

  searchQuery.value = ''
  selectedExo.value = null
  rest.value = ''
}

watch(() => settings.value, () => {
  console.log('watch : ')
})


// AUTOMATISATION : On surveille les changements
watch([isSupersetEnabled, () => blockExercices.value.length, () => settings.value.restTime], () => {
  if (isSupersetEnabled.value) {
    const lastIndex = blockExercices.value.length - 1
    blockExercices.value.forEach((exo, index) => {
      // Repos à 0 sauf pour le dernier du bloc
      exo.restTime = (index === lastIndex) ? settings.value.restTime : 0
    })
  }
}, { deep: true })

</script>

<template>
  <div class="container mt-5">
    <div class="card" style="width: 35rem;">
      <div class="card-body">
        <div class="mb-3">
          <h2 class="h4">Configuration : <span class="text-primary">{{ selectedType }}</span></h2>
        </div>

        <div class="mb-4">
          <div v-if="selectedType === 'musculation'" class="row">
            <div class="col-md-6">
              <label class="form-label small fw-bold">Repos entre les séries (sec)</label>
              <input type="number" v-for="i in 1" v-model="settings.restTime" class="form-control w-50">
              <div v-if="superset" class="mt-2">
                <input type="checkbox" class="form-check-input me-2" id="isSuperset" v-model="isSupersetEnabled">
                <label class="form-check-label" for="isSuperset">Ajouter des superséries ({{ blockExercices.length }})</label>
              </div>
            </div>
          </div>

          <div v-else-if="selectedType === 'tabata'" class="row g-2">
            <div class="col-4">
              <label class="form-label small fw-bold">Rounds</label>
              <input type="number" v-model="settings.rounds" class="form-control">
            </div>
            <div class="col-4">
              <label class="form-label small fw-bold">Work</label>
              <input type="number" v-model="settings.timer" class="form-control" placeholder="sec">
            </div>
            <div class="col-4">
              <label class="form-label small fw-bold">Rest</label>
              <input type="number" v-model="settings.secondRestTime" class="form-control" placeholder="sec">
            </div>
          </div>

          <div v-else-if="['amrap', 'emom', 'fortime'].includes(selectedType)" class="row g-2">
            <div class="col-6">
              <label class="form-label small fw-bold">Durée / Time Cap (min)</label>
              <input type="number" v-model="settings.timer" class="form-control">
            </div>
            <div v-if="selectedType === 'emom'" class="col-6">
              <label class="form-label small fw-bold">Départ toutes les X min</label>
              <input type="number" v-model="settings.rounds" class="form-control">
            </div>
          </div>
        </div>

        <div class="mt-3">
          <h6 class="small text-muted text-uppercase">Aperçu du bloc :</h6>
          <draggable
              v-model="blockExercices"
              tag="ul"
              item-key="order"
              class="list-group list-group-flush mb-3"
              ghost-class="bg-light"
          >
            <template #item="{ element, index }">
              <li class="list-group-item d-flex justify-content-between align-items-center" style="cursor: move;">
                <div>
                  <strong>{{ element.name }}</strong>
                  <span class="text-muted ms-2">({{ element.sets }}x{{ element.reps }})</span>
                </div>

                <span :class="['badge rounded-pill', element.restTime === 0 ? 'bg-warning text-dark' : 'bg-light text-dark border']">
        <i v-if="element.restTime === 0" class="bi bi-lightning-fill me-1"></i>
        Repos : {{ element.restTime }}s
      </span>
              </li>
            </template>
          </draggable>
        </div>

        <hr>

        <h5 class="card-title mb-3">Exercices</h5>

        <div class="d-flex gap-2 align-items-start">
          <div class="position-relative flex-grow-1">
            <input
                type="text"
                v-model="searchQuery"
                @focus="showDropdown = true"
                @input="selectedExo = null"
                class="form-control"
                placeholder="Chercher..."
            >

            <div v-if="showDropdown && searchQuery" class="list-group position-absolute w-100 shadow mt-1"
                 style="max-height: 200px; overflow-y: auto; z-index: 1050;">
              <button
                  v-for="exo in filteredExercices"
                  :key="exo.id"
                  @click="selectExo(exo)"
                  class="list-group-item list-group-item-action py-2"
              >
                {{ exo.name.toUpperCase() }}
              </button>
              <div v-if="filteredExercices.length === 0" class="list-group-item disabled italic">
                Aucun exercice trouvé
              </div>
            </div>
          </div>

          <div style="width: 85px;">
            <input type="number" v-model="sets" class="form-control" placeholder="Sets">
          </div>
          <div style="width: 85px;">
            <input type="number" v-model="reps" class="form-control" placeholder="Reps">
          </div>

          <button @click="addExercice" class="btn btn-primary">
             add
          </button>
        </div>

        <div class="mt-4 pt-3 border-top text-end">
          <router-link :to="{ name: 'workout-create' }" class="btn btn-outline-secondary">Annuler</router-link>
          <button class="btn btn-success ms-2">Enregistrer ce bloc</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pour s'assurer que la liste flottante ne soit pas coupée par la card */
.card { overflow: visible !important; }
li {
  list-style: none;
}
</style>