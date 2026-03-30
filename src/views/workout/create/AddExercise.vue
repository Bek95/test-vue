<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons'
import {useWorkoutStore} from "@/workoutStore.js";
import router from "@/router/router.js";
import MeasurementUnit from "@/components/workout/exercise/add-exercise/MeasurementUnit.vue";

const route = useRoute()
const selectedType = computed(() => route.query.type)
const blockName = computed(() => route.query.blockName)

// État de la recherche et sélection
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedExo = ref(null)
const sets = ref(4)
const reps = ref('')
const superset = computed(() => blockExercices.value.length > 1)
const isSupersetEnabled = ref(false)
let supersetExercicesOrder = 1
const isMax = ref(false)
const weight = ref(false)
const isDisable = ref(false)
const hasWeight = ref(false)
const selectedUnit = ref('Kg')
const hideWeight = ref(false)


watch(selectedExo, (newValue) => {
  if (newValue) {
    hasWeight.value = newValue.weight
  }
})

const isWeightVisible = computed(() => {
  const forceWeightTypes = ['amrap', 'emom', 'fortime', 'musculation']
  if (hasWeight.value) {
    if (forceWeightTypes.includes(selectedType.value)) {
      return true
    }
  }
})

const units = ref([
  {name: "Kilogrammes", unit: "Kg"},
  {name: "Pounds", unit: "Lbs"},
])

watch(isMax, (newValue) => {
  isDisable.value = newValue
  reps.value = 'max'
})



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
  { id: id++, name: 'Squat', category: 'reps', weight: true },
  { id: id++, name: 'lunges', category: 'reps', weight: true },
  { id: id++, name: 'Front Rack walking lunges', category: 'reps', weight: true },
  { id: id++, name: 'Renegade Row', category: 'reps', weight: true },
  { id: id++, name: 'Double under', category: 'reps', weight: false },
  { id: id++, name: 'press', category: 'reps', weight: true },
  { id: id++, name: 'Bench Press', category: 'reps', weight: true },
  { id: id++, name: 'Deadlift', category: 'reps', weight: true },
  { id: id++, name: 'Pull Up', category: 'reps', weight: true },
  { id: id++, name: 'Push Up', category: 'reps', weight: true },
  { id: id++, name: 'Dips', category: 'reps', weight: true },
  { id: id++, name: 'running', category: 'duration', weight: false },
  { id: id++, name: 'rest', category: 'duration', weight: false},
])

const filteredExercices = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return exercices.value.filter(exo =>
      exo.name.toLowerCase().includes(query)
  )
})

const selectExo = (exo) => {
  if (!exo.weight) {
    hideWeight.value = true
  }
  isHidden.value = true
  selectedExo.value = exo
  searchQuery.value = exo.name.toUpperCase()
  showDropdown.value = false
}

const blockExercices = ref([])

const workoutStore = useWorkoutStore()

const isHidden = ref(true)

const addExercice = () => {
  let rest = 0

  if (!selectedExo.value) {
    return isHidden.value = false
  }

  // VERIFICATION : On empêche le même exercise dans le même bloc
  const isAlreadyInBlock = blockExercices.value.some(exo => exo.id === selectedExo.value.id)

  if (isAlreadyInBlock) {
    alert("Cet exercise est déjà dans le bloc. Pour un superset, choisissez un exercise différent.")
    return
  }

  // on met à null les séries pour le typde d'entrainement suivant
  if (["amrap"].includes(selectedType.value)) {

    settings.value.restTime = null
    sets.value = null
  }

  rest = settings.value.restTime

  blockExercices.value.push({
    id: selectedExo.value.id,
    order: supersetExercicesOrder++,
    name: selectedExo.value.name,
    sets: sets.value,
    reps: reps.value,
    weight: weight.value,
    unit: selectedUnit.value,
    restTime: rest,
  })

  console.log("blockExercices : ", blockExercices)

  searchQuery.value = ''
  selectedExo.value = null
  rest = 0
  isDisable.value = false
  isMax.value = false
}

const exercicesAffiches = computed({
  get() {
    // On s'assure que blockExercices existe et n'est pas nul
    if (!blockExercices.value) return [];

    return blockExercices.value.map((exo, index) => {
      const isLast = index === blockExercices.value.length - 1;
      return {
        ...exo,
        // Utilise une valeur par défaut sécurisée (0 ou le restTime des settings)
        calculatedRest: (isSupersetEnabled.value && !isLast) ? 0 : (settings.value?.restTime || 60)
      };
    });
  },
  set(newValue) {
    // On met à jour uniquement si la valeur a réellement changé
    if (newValue) {
      blockExercices.value = [...newValue];
    }
  }
});

// REMOVE EXERCICE
const removeExo = (index) => {
  blockExercices.value = blockExercices.value.filter(exo => exo.id !== blockExercices.value[index].id)
}

const finalBlockExercices = ref([])

const saveBlock = () => {
  try {
    if (blockExercices.value.length === 0) return alert("veuillez selectionner un exercise")

    // Champs spécifiques au type de bloc
    const typeSettings = {
      musculation: {
        restTime: settings.value.restTime,
      },
      superset: {
        restTime: settings.value.restTime,
      },
      amrap: {
        timeCap: settings.value.timer,
      },
      emom: {
        timeCap: settings.value.timer,
        interval: settings.value.rounds, // "départ toutes les X min"
      },
      fortime: {
        timeCap: settings.value.timer,
      },
      tabata: {
        workTime: settings.value.timer,
        restTime: settings.value.secondRestTime,
        rounds: settings.value.rounds,
      },
    }

    const blockData = {
      id: crypto.randomUUID(),
      name: blockName.value,
      ...typeSettings[selectedType.value], //on injecte les bons champs
      exercices: exercicesAffiches.value.map(exo => ({
        id: exo.id,
        name: exo.name,
        sets: exo.sets,
        reps: exo.reps,
        restTime: exo.calculatedRest,
        weight: exo.weight,
        unit: exo.unit,
      }))
    }

    console.log("Block data : ", blockData)

    workoutStore.addBlock(selectedType.value, blockData)
    router.push({ name: 'draft-summary' })
  } catch (e) {
    console.error('error captured : ', e)
  }
}


</script>

<template>
  <div class="container mt-5">
    <div class="card" style="width: 45rem;">
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
              v-model="exercicesAffiches"
              tag="ul"
              item-key="id"
              class="list-group list-group-flush mb-3"
              ghost-class="bg-light"
          >
            <template #item="{ element, index }">
              <li class="list-group-item d-flex justify-content-between align-items-center" style="cursor: move;">
                <div>
                  <strong>{{ element.name }}</strong>
                  <span class="text-muted ms-2">({{ element.sets }}x{{ element.reps }})</span>
                </div>

                <div v-if="['musculation'].includes(selectedType)">
                  <span :class="['badge rounded-pill', element.weight === 0 ? 'bg-warning text-dark' : 'bg-light text-dark border']">
                  <i v-if="element.weight === 0" class="bi bi-lightning-fill me-1"></i>
                  Charge : {{ element.weight }} {{ element.unit }}
                  </span>
                </div>

                <div v-if="['musculation'].includes(selectedType)">
                  <span :class="['badge rounded-pill', element.calculatedRest === 0 ? 'bg-warning text-dark' : 'bg-light text-dark border']">
                  <i v-if="element.calculatedRest === 0" class="bi bi-lightning-fill me-1"></i>
                  Repos : {{ element.calculatedRest }}s
                </span>
                </div>

                <button type="button" class="btn btn-danger ms-2" @click="removeExo(index)">
                  <FontAwesomeIcon :icon="faTrashCan" />
                </button>
              </li>
            </template>
          </draggable>
        </div>

        <hr>

        <h5 class="card-title mb-3">Exercices</h5>

        <div class="gap-2 align-items-start">
          <div class="col-6 ms-2">
            <div class="position-relative flex-grow-1">
              <input
                  type="text"
                  v-model="searchQuery"
                  @focus="showDropdown = true"
                  @input="selectedExo = null"
                  class="form-control"
                  placeholder="Chercher..."
                  :class="{ 'is-invalid': !isHidden }"
              >
              <div v-show="!isHidden" id="validationServer04Feedback" class="invalid-feedback" style="display:block">
                Veuillez selectionner un exercice ...
              </div>

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
          </div>

          <div class="d-flex mt-3">
            <div v-if="['musculation'].includes(selectedType)" class="col-2 m-2">
              <input type="number" v-model="sets" class="form-control" placeholder="Sets">
            </div>
            <div class="col-2 m-2">
              <input type="number" v-model="reps" class="form-control" placeholder="Reps" v-if="!isDisable ? 'disabled' : ''">
            </div>
            <!-- on affiche un input pour saisir la charge -->

            <div  v-if="isWeightVisible" class="col-2 m-2">
              <input type="number" v-model="weight" class="form-control" placeholder="Poids" />
            </div>
            <div v-show="hasWeight">
              <MeasurementUnit :units="units" v-model="selectedUnit"/>
            </div>
            <div v-if="['musculation'].includes(selectedType)" class="col-3 m-2 ms-3 d-flex justify-between align-items-center">
              <input id="isMax" type="checkbox" v-model="isMax">
              <label for="isMax" class="ms-2">Jusqu'à l'échec</label>
            </div>
          </div>
        </div>

        <div class="w-10 d-flex justify-content-center align-items-center mt-3">
<!--          <button @click="addExercice" class="btn btn-primary"><FontAwesomeIcon :icon="faPlus" /></button>-->
          <button @click="addExercice" class="btn btn-primary">Ajouter l'exercice</button>
        </div>

        <div class="mt-4 pt-3 border-top text-end">
          <router-link :to="{ name: 'workout-create' }" class="btn btn-outline-secondary">Annuler</router-link>
          <button class="btn btn-success ms-2" @click="saveBlock" >Enregistrer ce bloc</button>
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