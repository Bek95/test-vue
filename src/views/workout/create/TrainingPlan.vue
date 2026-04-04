<template>
  <div class="page-shell">
    <div class="form-card">

      <div class="form-header">
        <p class="form-supertitle">Configuration</p>
        <h1 class="form-title">Créer un bloc</h1>
      </div>

      <div class="form-body">

        <div class="field-group">
          <label class="field-label">Nom du bloc</label>
          <input
              type="text"
              class="field-input"
              placeholder="Ex : Musculation — force"
              v-model="blockName"
          />
        </div>

        <div class="types-group">
          <p class="types-title">Choisir un type de bloc</p>
          <div class="types-list">
            <router-link
                v-for="training in trainingTypes"
                :key="training.id"
                class="type-row"
                :to="{ name: 'add-exercise', query: { type: training.name, blockName: blockName } }"
            >
              <div class="type-accent" :style="{ background: training.color }" />
              <div class="type-info">
                <p class="type-name">{{ training.label }}</p>
                <p class="type-desc">{{ training.description }}</p>
              </div>
              <span class="type-icon">{{ training.icon }}</span>
            </router-link>
          </div>
        </div>

        <div class="form-footer">
          <router-link :to="{ name: 'workout-create' }" class="btn-back">Retour</router-link>
          <button class="btn-create">Créer le bloc</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const blockName = ref('Mon block')

let id = 0
const trainingTypes = ref([
  { id: id++, name: 'warm-up',     label: 'Warm-up',     color: '#aebdd1', icon: '🔥', description: 'Échauffement progressif' },
  { id: id++, name: 'musculation', label: 'Musculation', color: '#dba81a', icon: '🏋️', description: 'Séries · reps · charge' },
  { id: id++, name: 'amrap',       label: 'AMRAP',       color: '#ed1123', icon: '🔄', description: 'As many rounds as possible' },
  { id: id++, name: 'fortime',     label: 'For Time',    color: '#a369c9', icon: '🏁', description: 'Terminer le plus vite possible' },
  { id: id++, name: 'tabata',      label: 'Tabata',      color: '#2c7d09', icon: '⏱️', description: '20s travail · 10s repos' },
  { id: id++, name: 'emom',        label: 'EMOM',        color: '#2f3ced', icon: '⏰', description: 'Every minute on the minute' },
  { id: id++, name: 'cool-down',   label: 'Cool down',   color: '#69c9c0', icon: '🧊', description: 'Récupération · étirements' },
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Epilogue:wght@300;400;500;600&display=swap');

.page-shell {
  min-height: 100vh;
  background: #16161f;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 3rem 1rem 4rem;
  font-family: 'Epilogue', sans-serif;
  color: #e8e8f0;
}

.form-card {
  width: 100%;
  max-width: 480px;
  background: #1e1e2c;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 20px;
  overflow: hidden;
}

.form-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}

.form-supertitle {
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  color: #8888b0;
  text-transform: uppercase;
  font-weight: 600;
  margin: 0 0 0.4rem;
}

.form-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  color: #f2f2ff;
}

.form-body {
  padding: 1.75rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Input nom ── */
.field-group { display: flex; flex-direction: column; gap: 0.4rem; }

.field-label {
  font-size: 0.72rem;
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
  padding: 0.7rem 1rem;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  width: 100%;
  box-sizing: border-box;
}
.field-input::placeholder { color: #5858a0; }
.field-input:focus {
  border-color: rgba(255,255,255,0.28);
  background: #2e2e42;
}

/* ── Types ── */
.types-group { display: flex; flex-direction: column; gap: 0.6rem; }

.types-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: #9898c0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 0.2rem;
}

.types-list { display: flex; flex-direction: column; gap: 0.5rem; }

.type-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  background: #26263a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
  cursor: pointer;
}
.type-row:hover {
  background: #2e2e44;
  border-color: rgba(255,255,255,0.16);
  transform: translateX(3px);
}

.type-accent {
  width: 4px;
  height: 36px;
  border-radius: 2px;
  flex-shrink: 0;
}

.type-info { flex: 1; min-width: 0; }

.type-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: #e8e8ff;
  margin: 0 0 0.15rem;
}

.type-desc {
  font-size: 0.75rem;
  color: #7878a8;
  margin: 0;
}

.type-icon { font-size: 1.2rem; flex-shrink: 0; }

/* ── Footer ── */
.form-footer {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

.btn-back {
  flex: 1;
  padding: 0.7rem;
  text-align: center;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: #9090b8;
  border-radius: 10px;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-back:hover { border-color: rgba(255,255,255,0.24); color: #c0c0e0; }

.btn-create {
  flex: 2;
  padding: 0.7rem;
  background: #6366f1;
  border: none;
  color: #fff;
  border-radius: 10px;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}
.btn-create:hover {
  background: #4f52e0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}
</style>