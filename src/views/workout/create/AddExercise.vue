<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useWorkoutStore } from "@/workoutStore.js"
import router from "@/router/router.js"
import MeasurementUnit from "@/components/workout/exercise/add-exercise/MeasurementUnit.vue"

const route = useRoute()
const selectedType = computed(() => route.query.type)
const blockName = computed(() => route.query.blockName)

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
const hasTimer = ref(false)
const duration = ref(0)

watch(selectedExo, (newValue) => {
  if (newValue) hasWeight.value = newValue.weight
})


const isWeightVisible = computed(() => {
  const forceWeightTypes = ['amrap', 'emom', 'fortime', 'musculation']
  if (hasWeight.value && forceWeightTypes.includes(selectedType.value)) return true
})

const units = ref([
  { name: "Kilogrammes", unit: "Kg" },
  { name: "Pounds", unit: "Lbs" },
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

watch(() => settings.value.timer, (newValue) => {
  if (newValue && newValue > 0) {
    isHiddenDuration.value = true
  }
})

let id = 0
const exercices = ref([
  { id: id++, name: 'Squat', category: 'reps', weight: true },
  { id: id++, name: 'Lunges', category: 'reps', weight: true },
  { id: id++, name: 'Front Rack Walking Lunges', category: 'reps', weight: true },
  { id: id++, name: 'Renegade Row', category: 'reps', weight: true },
  { id: id++, name: 'Double Under', category: 'duration', weight: false },
  { id: id++, name: 'Press', category: 'reps', weight: true },
  { id: id++, name: 'Bench Press', category: 'reps', weight: true },
  { id: id++, name: 'Deadlift', category: 'reps', weight: true },
  { id: id++, name: 'Pull Up', category: 'reps', weight: true },
  { id: id++, name: 'Push Up', category: 'reps', weight: true },
  { id: id++, name: 'Dips', category: 'reps', weight: true },
  { id: id++, name: 'Running', category: 'duration', weight: false },
  { id: id++, name: 'Rest', category: 'duration', weight: false },
])

const filteredExercices = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return exercices.value.filter(exo => exo.name.toLowerCase().includes(query))
})

const isHidden = ref(true)
const isHiddenDuration = ref(true)

const selectExo = (exo) => {
  if (!exo.weight) hideWeight.value = true
  isHidden.value = true
  selectedExo.value = exo
  searchQuery.value = exo.name.toUpperCase()
  showDropdown.value = false
  if (exo.category === 'duration') hasTimer.value = true
}

const formatReps = (exo) => {
  if (exo.reps) {
    return exo.sets + ' x ' + exo.reps + 'reps'
  }
  if (exo.duration) {
    return exo.sets + ' x ' + exo.duration + 'sec'
  }
}

const blockExercices = ref([])
const workoutStore = useWorkoutStore()

const addExercice = () => {
  if (!selectedExo.value) { isHidden.value = false; return }

  const isAlreadyInBlock = blockExercices.value.some(exo => exo.id === selectedExo.value.id)
  if (isAlreadyInBlock) {
    alert("Cet exercice est déjà dans le bloc.")
    return
  }

  if (["amrap"].includes(selectedType.value)) {
    settings.value.restTime = null
    sets.value = null
  }

  blockExercices.value.push({
    id: selectedExo.value.id,
    order: supersetExercicesOrder++,
    name: selectedExo.value.name,
    sets: sets.value,
    reps: reps.value,
    weight: weight.value,
    unit: selectedUnit.value,
    restTime: settings.value.restTime,
    duration: duration.value,
  })

  console.log(blockExercices.value)

  searchQuery.value = ''
  selectedExo.value = null
  isDisable.value = false
  isMax.value = false
  weight.value = 0
}

const exercicesAffiches = computed({
  get() {
    if (!blockExercices.value) return []
    return blockExercices.value.map((exo, index) => {
      const isLast = index === blockExercices.value.length - 1
      return {
        ...exo,
        calculatedRest: (isSupersetEnabled.value && !isLast) ? 0 : exo.restTime
      }
    })
  },
  set(newValue) {
    if (newValue) blockExercices.value = [...newValue]
  }
})

const removeExo = (index) => {
  blockExercices.value = blockExercices.value.filter(exo => exo.id !== blockExercices.value[index].id)
}

const typeConfig = {
  musculation: { label: 'Musculation', color: '#6366f1', icon: '🏋️' },
  superset:    { label: 'Superset',    color: '#f59e0b', icon: '⚡' },
  amrap:       { label: 'AMRAP',       color: '#10b981', icon: '🔄' },
  emom:        { label: 'EMOM',        color: '#3b82f6', icon: '⏱️' },
  fortime:     { label: 'For Time',    color: '#ef4444', icon: '🏁' },
  tabata:      { label: 'Tabata',      color: '#ec4899', icon: '🔥' },
}

const currentConfig = computed(() => typeConfig[selectedType.value] ?? { label: selectedType.value, color: '#64748b', icon: '📋' })

const saveBlock = () => {
  try {
    if (blockExercices.value.length === 0) return alert("Veuillez sélectionner au moins un exercice")


    const typeSettings = {
      musculation: { restTime: settings.value.restTime },
      superset:    { restTime: settings.value.restTime },
      amrap:       { timeCap: settings.value.timer },
      emom:        { timeCap: settings.value.timer, interval: settings.value.rounds },
      fortime:     { timeCap: settings.value.timer },
      tabata:      { workTime: settings.value.timer, restTime: settings.value.secondRestTime, rounds: settings.value.rounds },
    }

    const blockData = {
      id: crypto.randomUUID(),
      name: blockName.value,
      ...typeSettings[selectedType.value],
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

    const needsTimeCap = ['amrap', 'emom', 'fortime', 'tabata'].includes(selectedType.value)
    if (needsTimeCap && (!settings.value.timer || settings.value.timer <= 0)) {
      isHiddenDuration.value = false
      return
    }

    workoutStore.addBlock(selectedType.value, blockData)
    router.push({ name: 'draft-summary' })
  } catch (e) {
    console.error('error captured:', e)
  }
}
</script>

<template>
  <div class="page-shell">
    <div class="config-card">

      <!-- ── Header ───────────────────────────────────────────── -->
      <div class="config-header" :style="{ '--type-color': currentConfig.color }">
        <div class="header-accent" />
        <div class="header-content">
          <div class="header-left">
            <span class="type-icon">{{ currentConfig.icon }}</span>
            <div>
              <p class="block-label">CONFIGURATION DU BLOC</p>
              <h1 class="block-title">{{ blockName || currentConfig.label }}</h1>
            </div>
          </div>
          <span class="type-pill">{{ currentConfig.label }}</span>
        </div>
      </div>

      <div class="config-body">

        <!-- ── Paramètres du bloc ───────────────────────────── -->
        <section class="section">
          <p class="section-label">Paramètres</p>

          <div v-if="selectedType === 'musculation'" class="params-grid">
            <div class="field-group">
              <label class="field-label">Repos entre les séries</label>
              <div class="input-with-unit">
                <input type="number" v-model="settings.restTime" class="field-input field-input--params" />
                <span class="input-unit">sec</span>
              </div>
            </div>
            <div v-if="superset" class="toggle-row">
              <label class="toggle-label" for="isSuperset">
                Superséries
                <span class="toggle-sub">({{ blockExercices.length }} exos)</span>
              </label>
              <label class="toggle-switch">
                <input type="checkbox" id="isSuperset" v-model="isSupersetEnabled" />
                <span class="toggle-slider" />
              </label>
            </div>
          </div>

          <div v-else-if="selectedType === 'tabata'" class="params-grid">
            <div class="field-group">
              <label class="field-label">Rounds</label>
              <input type="number" v-model="settings.rounds" class="field-input" />
            </div>
            <div class="field-group">
              <label class="field-label">Work</label>
              <div class="input-with-unit">
                <input type="number" v-model="settings.timer" class="field-input" />
                <span class="input-unit">sec</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Rest</label>
              <div class="input-with-unit">
                <input type="number" v-model="settings.secondRestTime" class="field-input" />
                <span class="input-unit">sec</span>
              </div>
            </div>
          </div>

          <div v-else-if="['amrap', 'emom', 'fortime'].includes(selectedType)" class="params-grid">
            <div class="field-group">
              <label class="field-label">Time Cap</label>
              <div class="input-with-unit">
                <input type="number" v-model="settings.timer" class="field-input" :class="{ 'search-input--error': !isHiddenDuration }"/>
                <span class="input-unit">min</span>
                <div v-show="!isHiddenDuration" class="field-error">Veuillez saisir une durée</div>
              </div>
            </div>
            <div v-if="selectedType === 'emom'" class="field-group">
              <label class="field-label">Intervalle</label>
              <div class="input-with-unit">
                <input type="number" v-model="settings.rounds" class="field-input" />
                <span class="input-unit">min</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ── Aperçu du bloc ──────────────────────────────── -->
        <section class="section">
          <div class="section-header-row">
            <p class="section-label">Exercices du bloc</p>
            <span class="exo-count">{{ blockExercices.length }}</span>
          </div>

          <div v-if="blockExercices.length === 0" class="empty-bloc">
            <span class="empty-icon">🏋️</span>
            <p>Aucun exercice ajouté</p>
          </div>

          <draggable
              v-else
              v-model="exercicesAffiches"
              tag="div"
              item-key="id"
              class="exo-list"
              ghost-class="exo-ghost"
              animation="200"
          >
            <template #item="{ element, index }">
              <div class="exo-card">
                <div class="exo-drag">
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor"/>
                    <circle cx="6.5" cy="1.5" r="1.5" fill="currentColor"/>
                    <circle cx="1.5" cy="7" r="1.5" fill="currentColor"/>
                    <circle cx="6.5" cy="7" r="1.5" fill="currentColor"/>
                    <circle cx="1.5" cy="12.5" r="1.5" fill="currentColor"/>
                    <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"/>
                  </svg>
                </div>

                <div class="exo-num">{{ index + 1 }}</div>

                <div class="exo-info">
                  <span class="exo-name">{{ element.name }}</span>
                  <div class="exo-chips">
<!--                    <span v-if="element.sets" class="chip chip-sets">{{ element.sets }} ×-->
<!--                      <span v-if="element.reps">{{ element.reps }}</span>-->
<!--                      <span v-else-if="element.duration">{{ element.duration }} sec</span>-->
<!--                    </span>-->
                    <span v-if="element.sets" class="chip chip-sets">
                      {{ formatReps(element) }}
                    </span>
                    <span v-else-if="element.reps" class="chip chip-reps">{{ element.reps }} reps</span>
                    <span v-else-if="element.duration" class="chip chip-reps">{{ element.duration }} secondes</span>
                    <span v-if="element.weight" class="chip chip-weight">{{ element.weight }} {{ element.unit }}</span>
                  </div>
                </div>

                <div v-if="['musculation', 'superset'].includes(selectedType)" class="exo-rest-edit">
                  <label class="rest-edit-label">Repos</label>
                  <div class="input-with-unit input-with-unit--sm">
                    <input
                        type="number"
                        :value="element.restTime"
                        @change="blockExercices[index].restTime = +$event.target.value"
                        class="field-input field-input--sm"
                    />
                    <span class="input-unit">s</span>
                  </div>
                </div>

                <button class="exo-remove" @click="removeExo(index)" title="Supprimer">
                  <FontAwesomeIcon :icon="faTrashCan" />
                </button>
              </div>
            </template>
          </draggable>
        </section>

        <!-- ── Ajouter un exercice ─────────────────────────── -->
        <section class="section">
          <p class="section-label">Ajouter un exercice</p>

          <div class="add-exo-form">

            <!-- Recherche -->
            <div class="search-wrap">
              <div class="search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <input
                  type="text"
                  v-model="searchQuery"
                  @focus="showDropdown = true"
                  @input="selectedExo = null"
                  class="search-input"
                  :class="{ 'search-input--error': !isHidden }"
                  placeholder="Rechercher un exercice..."
              />
              <div v-show="!isHidden" class="field-error">Veuillez sélectionner un exercice</div>
              <div
                  v-if="showDropdown && searchQuery"
                  class="search-dropdown"
              >
                <button
                    v-for="exo in filteredExercices"
                    :key="exo.id"
                    @click="selectExo(exo)"
                    class="dropdown-item"
                >
                  {{ exo.name }}
                </button>
                <div v-if="filteredExercices.length === 0" class="dropdown-empty">
                  Aucun exercice trouvé
                </div>
              </div>
            </div>

            <!-- Champs de perf -->
            <div class="perf-row">
              <div v-if="['musculation'].includes(selectedType)" class="field-group field-group--sm">
                <label class="field-label">Séries</label>
                <input type="number" v-model="sets" class="field-input" />
              </div>

              <div v-if="!hasTimer" class="field-group field-group--sm">
                <label class="field-label">Reps</label>
                <input
                    type="number"
                    v-model="reps"
                    class="field-input"
                    :disabled="isDisable"
                    :placeholder="isDisable ? 'max' : ''"
                />
              </div>
              <div v-else-if="hasTimer" class="field-group field-group--sm">
                <label class="field-label">Time (sec)</label>
                <input
                    type="number"
                    v-model="duration"
                    class="field-input"
                    :disabled="isDisable"
                    :placeholder="isDisable ? 'max' : ''"
                />
              </div>

              <div v-if="isWeightVisible" class="field-group field-group--sm">
                <label class="field-label">Poids</label>
                <div class="input-with-unit">
                  <input type="number" v-model="weight" class="field-input" />
                  <span class="input-unit">{{ selectedUnit }}</span>
                </div>
              </div>

              <div v-show="hasWeight" class="field-group field-group--sm">
                <label class="field-label">Unité</label>
                <MeasurementUnit :units="units" v-model="selectedUnit" />
              </div>

              <div v-if="['musculation'].includes(selectedType)" class="toggle-row toggle-row--inline">
                <label class="toggle-label" for="isMax">Échec</label>
                <label class="toggle-switch toggle-switch--sm">
                  <input type="checkbox" id="isMax" v-model="isMax" />
                  <span class="toggle-slider" />
                </label>
              </div>
            </div>

            <button class="btn-add" @click="addExercice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Ajouter l'exercice
            </button>
          </div>
        </section>

      </div>

      <!-- ── Footer ──────────────────────────────────────────── -->
      <div class="config-footer">
        <router-link :to="{ name: 'workout-create' }" class="btn-cancel">
          Annuler
        </router-link>
        <button class="btn-save" @click="saveBlock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          Enregistrer le bloc
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Epilogue:wght@300;400;500;600&display=swap');

/* ── Shell ─────────────────────────────────────────────────── */
.page-shell {
  min-height: 100vh;
  background: #16161f;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem 4rem;
  font-family: 'Epilogue', sans-serif;
  color: #e8e8f0;
}

/* ── Card ──────────────────────────────────────────────────── */
.config-card {
  width: 100%;
  max-width: 44rem;
  background: #1e1e2c;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 20px;
  overflow: hidden;
}

/* ── Header ────────────────────────────────────────────────── */
.config-header {
  position: relative;
  overflow: hidden;
}

.header-accent {
  height: 4px;
  background: var(--type-color, #6366f1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.75rem;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.type-icon { font-size: 2rem; line-height: 1; }

.block-label {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: #7070a0;
  margin: 0 0 0.3rem;
  font-weight: 600;
}

.block-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1;
  color: #f0f0ff;
}

.type-pill {
  background: var(--type-color, #6366f1);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
}

/* ── Body ──────────────────────────────────────────────────── */
.config-body {
  padding: 0 1.75rem 1.75rem;
}

/* ── Sections ──────────────────────────────────────────────── */
.section {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.section:last-child { border-bottom: none; }

.section-label {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  color: #8888b0;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.section-header-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.exo-count {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: #9090b8;
  font-size: 0.72rem;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Fields ────────────────────────────────────────────────── */
.params-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-group--sm { min-width: 80px; }

.field-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #9898c0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.field-input {
  background: #282838;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 10px;
  color: #f0f0ff;
  padding: 0.6rem 0.85rem;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.9rem;
  width: 120px;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  box-sizing: border-box;
}
.field-input:focus {
  border-color: rgba(255,255,255,0.3);
  background: #2e2e42;
}
.field-input--params { width: 75px; }
.field-input--sm {
  width: 80px;
  padding: 0.45rem 1.8rem 0.45rem 0.65rem;
  font-size: 0.85rem;
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}
.input-with-unit .field-input { padding-right: 1rem; }

.input-with-unit--sm .field-input { padding-right: 1.6rem; }
.input-with-unit--sm .input-unit { right: 0.5rem; }

.input-unit {
  position: absolute;
  right: 0.75rem;
  font-size: 0.7rem;
  color: #6868a0;
  font-weight: 600;
  pointer-events: none;
}

/* ── Toggle ────────────────────────────────────────────────── */
.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}
.toggle-row--inline { margin-top: auto; padding-bottom: 0.15rem; }

.toggle-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: #c0c0d8;
  cursor: pointer;
}

.toggle-sub {
  color: #6868a0;
  font-size: 0.72rem;
  margin-left: 0.3rem;
}

.toggle-switch {
  position: relative;
  width: 38px;
  height: 22px;
  flex-shrink: 0;
  cursor: pointer;
}
.toggle-switch--sm { width: 32px; height: 18px; }

.toggle-switch input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute;
  inset: 0;
  background: #32324a;
  border-radius: 22px;
  transition: background 0.2s;
  border: 1px solid rgba(255,255,255,0.12);
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  left: 2px;
  top: 2px;
  background: #7070a0;
  border-radius: 50%;
  transition: transform 0.2s, background 0.2s;
}
.toggle-switch--sm .toggle-slider::before { width: 12px; height: 12px; }

.toggle-switch input:checked + .toggle-slider { background: #6366f1; border-color: #6366f1; }
.toggle-switch input:checked + .toggle-slider::before {
  background: #fff;
  transform: translateX(16px);
}
.toggle-switch--sm input:checked + .toggle-slider::before { transform: translateX(14px); }

/* ── Exo list ──────────────────────────────────────────────── */
.empty-bloc {
  text-align: center;
  padding: 2.5rem;
  border: 1px dashed rgba(255,255,255,0.10);
  border-radius: 12px;
  color: #6060a0;
  font-size: 0.85rem;
}
.empty-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }

.exo-list { display: flex; flex-direction: column; gap: 0.5rem; }

.exo-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #26263a;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: border-color 0.15s, transform 0.15s;
}
.exo-card:hover { border-color: rgba(255,255,255,0.18); transform: translateX(2px); }
.exo-ghost { opacity: 0.25; transform: scale(0.98); }

.exo-drag { color: #4a4a70; cursor: grab; flex-shrink: 0; transition: color 0.15s; }
.exo-drag:hover { color: #8888b8; }

.exo-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem; font-weight: 700; color: #7878a8; flex-shrink: 0;
}

.exo-info { flex: 1; min-width: 0; }

.exo-name {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: #e8e8ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exo-chips { display: flex; gap: 0.3rem; margin-top: 0.3rem; flex-wrap: wrap; }

.chip { font-size: 0.65rem; padding: 0.15rem 0.5rem; border-radius: 5px; font-weight: 600; }
.chip-sets   { background: rgba(99,102,241,0.20); color: #b0b8ff; }
.chip-reps   { background: rgba(16,185,129,0.18); color: #6ee7b7; }
.chip-weight { background: rgba(245,158,11,0.18); color: #fcd34d; }

.exo-rest-edit {
  display: flex; flex-direction: column; gap: 0.3rem;
  align-items: flex-end; flex-shrink: 0;
}

.rest-edit-label {
  font-size: 0.6rem; color: #7878a8;
  font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
}

.exo-remove {
  background: transparent;
  border: 1px solid rgba(239,68,68,0.20);
  color: #a04040;
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; font-size: 0.75rem;
  transition: all 0.15s;
  margin-top: 15px;
}
.exo-remove:hover {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.5);
  color: #ef4444;
}

/* ── Search ────────────────────────────────────────────────── */
.add-exo-form { display: flex; flex-direction: column; gap: 1rem; }

.search-wrap { position: relative; }

.search-icon {
  position: absolute; left: 0.85rem; top: 50%;
  transform: translateY(-50%);
  color: #7070a0; pointer-events: none; z-index: 1;
}

.search-input {
  width: 100%;
  background: #282838;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 12px;
  color: #f0f0ff;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  box-sizing: border-box;
}
.search-input::placeholder { color: #5858a0; }
.search-input:focus { border-color: rgba(255,255,255,0.28); background: #2e2e42; }
.search-input--error { border-color: rgba(239,68,68,0.6) !important; }

.field-error { font-size: 0.72rem; color: #f87171; margin-top: 0.4rem; padding-left: 0.2rem; }

.search-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background: #282840;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  max-height: 200px; overflow-y: auto;
  z-index: 1050;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}

.dropdown-item {
  width: 100%; background: transparent; border: none;
  color: #c0c0e0;
  padding: 0.65rem 1rem; text-align: left;
  font-family: 'Epilogue', sans-serif; font-size: 0.85rem;
  cursor: pointer; transition: background 0.1s, color 0.1s;
}
.dropdown-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
.dropdown-item:first-child { border-radius: 12px 12px 0 0; }
.dropdown-item:last-child  { border-radius: 0 0 12px 12px; }

.dropdown-empty { padding: 0.75rem 1rem; font-size: 0.8rem; color: #5858a0; text-align: center; }

/* ── Perf row ──────────────────────────────────────────────── */
.perf-row {
  display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: flex-end;
}
.perf-row .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
.perf-row .field-input { height: 40px; width: 90px; box-sizing: border-box; }

/* Select unité — dark theme cohérent */
.perf-row :deep(select) {
  height: 40px;
  background: #282838;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 10px;
  color: #f0f0ff;
  padding: 0 0.85rem;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.9rem;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.perf-row :deep(select):focus { border-color: rgba(255,255,255,0.3); }

/* ── Add button ────────────────────────────────────────────── */
.btn-add {
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.35);
  color: #b0b8ff;
  padding: 0.7rem 1.25rem;
  border-radius: 12px;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.85rem; font-weight: 600;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.5rem;
  align-self: flex-start;
  transition: all 0.15s;
}
.btn-add:hover {
  background: rgba(99,102,241,0.28);
  border-color: rgba(99,102,241,0.6);
  color: #d0d8ff;
}

/* ── Footer ────────────────────────────────────────────────── */
.config-footer {
  display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem;
  padding: 1.25rem 1.75rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  background: rgba(0,0,0,0.15);
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: #9090b8;
  padding: 0.65rem 1.2rem; border-radius: 10px;
  font-family: 'Epilogue', sans-serif; font-size: 0.85rem; font-weight: 500;
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center;
  transition: all 0.15s;
}
.btn-cancel:hover { border-color: rgba(255,255,255,0.24); color: #c0c0e0; }

.btn-save {
  background: #6366f1;
  border: none; color: #fff;
  padding: 0.65rem 1.4rem; border-radius: 10px;
  font-family: 'Epilogue', sans-serif; font-size: 0.85rem; font-weight: 700;
  cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.5rem;
  transition: all 0.15s;
}
.btn-save:hover {
  background: #4f52e0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}
</style>