<script setup>

import { ref } from 'vue'
import {useWorkoutStore} from "@/workoutStore.js";


const workoutName = ref('Mon nouveau programme')
const sessionName = ref('')

const workoutStore = useWorkoutStore()
const createWorkout = () => {
  let countSession = workoutStore.countSession + 1
  if (sessionName.value === null || sessionName.value === '') {
    sessionName.value = 'Séance ' + countSession
  }
  workoutStore.initNewWorkout(workoutName.value, sessionName.value)
}

</script>

<template>
  <div class="page-shell">
    <div class="form-card">

      <div class="form-header">
        <p class="form-supertitle">Nouveau programme</p>
        <h1 class="form-title">Créer un programme</h1>
      </div>

      <div class="form-body">

        <div class="field-group">
          <label class="field-label">Nom du programme</label>
          <input type="text" class="field-input"
                 placeholder="Ex : Mon programme force"
                 v-model="workoutName" />
          <p class="field-hint">Ce nom apparaîtra sur votre tableau de bord.</p>
        </div>

        <div class="field-group">
          <label class="field-label">Nom de la première séance</label>
          <input type="text" class="field-input"
                 placeholder="Ex : Séance 1 — Haut du corps"
                 v-model="sessionName" />
          <p class="field-hint">Laissez vide pour nommer automatiquement « Séance 1 ».</p>
        </div>

        <router-link :to="{ name: 'training-plan-create' }" class="btn-continue" @click="createWorkout">
          Continuer
        </router-link>

      </div>
    </div>
  </div>
</template>

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
  gap: 1.25rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

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

.field-hint {
  font-size: 0.75rem;
  color: #6868a0;
  margin: 0;
}

.btn-continue {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, box-shadow 0.15s;
}
.btn-continue:hover {
  background: #4f52e0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}
</style>