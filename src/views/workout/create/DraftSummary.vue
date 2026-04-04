<script setup>
import { computed } from "vue";
import draggable from "vuedraggable";
import { useWorkoutStore } from "@/workoutStore.js";
import { saveWorkout } from '@/services/workout/workoutService.js'
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

const workoutStore = useWorkoutStore()

const blocks = computed({
  get() {
    return workoutStore.activeSession?.blocks ?? []
  },
  set(newOrder) {
    workoutStore.reorderBlocks(newOrder)
  }
})

const blockTypeConfig = {
  musculation: { label: 'Muscu',    color: '#6366f1', icon: '🏋️' },
  superset:    { label: 'Superset', color: '#f59e0b', icon: '⚡' },
  amrap:       { label: 'AMRAP',    color: '#10b981', icon: '🔄' },
  emom:        { label: 'EMOM',     color: '#3b82f6', icon: '⏱️' },
  fortime:     { label: 'For Time', color: '#ef4444', icon: '🏁' },
  tabata:      { label: 'Tabata',   color: '#ec4899', icon: '🔥' },
}

function getBlockConfig(type) {
  return blockTypeConfig[type] ?? { label: type, color: '#64748b', icon: '📋' }
}

function formatRest(seconds) {
  if (!seconds) return null
  if (seconds >= 60) return `${seconds / 60} min`
  return `${seconds}s`
}

const removeBlock = (id) => {
  workoutStore.removeBlock(id)
}

const removeExercice = (blockId, exerciceId) => {
  workoutStore.removeExerciceFromBlock(blockId, exerciceId)
}

// enregistrer le programme
async function handleSave() {
  try {
    await saveWorkout(workoutStore)
    router.push({ name: 'home' })
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>
  <div class="workout-shell">

    <!-- ── Header ──────────────────────────────────────────────────── -->
    <header class="workout-header">
      <div class="header-inner">
        <div class="header-text">
          <p class="session-label">SESSION</p>
          <h1 class="workout-title">{{ workoutStore.workoutName || 'Mon Programme' }}</h1>
          <p class="session-name">{{ workoutStore.activeSessionName }}</p>
        </div>
        <div class="header-meta">
          <div class="meta-pill">
            <span class="meta-number">{{ blocks.length }}</span>
            <span class="meta-unit">blocs</span>
          </div>
          <div class="meta-pill">
            <span class="meta-number">{{ blocks.reduce((acc, b) => acc + (b.exercices?.length ?? 0), 0) }}</span>
            <span class="meta-unit">exercices</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ── Liste des blocs ─────────────────────────────────────────── -->
    <main class="blocks-container">
      <draggable
          v-model="blocks"
          tag="div"
          item-key="id"
          handle=".drag-handle"
          class="blocks-list"
          ghost-class="block-ghost"
          animation="250"
      >
        <template #item="{ element: block, index: blockIndex }">
          <div class="block-card" :style="{ '--block-color': getBlockConfig(block.type).color }">

            <!-- Accent bar -->
            <div class="block-accent-bar" />

            <!-- Block header -->
            <div class="block-head">
              <div class="block-head-left">
                <span class="drag-handle">
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                    <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
                    <circle cx="2" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                    <circle cx="2" cy="14" r="1.5" fill="currentColor"/>
                    <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
                  </svg>
                </span>
                <span class="block-icon">{{ getBlockConfig(block.type).icon }}</span>
                <div>
                  <p class="block-index">Bloc {{ blockIndex + 1 }}</p>
                  <p class="block-name">{{ block.name || getBlockConfig(block.type).label }}</p>
                </div>
              </div>

              <div class="block-head-right">
                <span class="type-badge">{{ getBlockConfig(block.type).label }}</span>
                <span v-if="block.timeCap" class="info-chip">⏱ {{ block.timeCap }} min</span>
                <span v-if="block.rounds" class="info-chip">🔁 {{ block.rounds }} rounds</span>
                <span v-if="block.restTime && block.type === 'superset'" class="info-chip">💤 {{ formatRest(block.restTime) }}</span>
                <button class="block-remove" @click="removeBlock(block.id)"><span><FontAwesomeIcon :icon="faTrashCan" /></span></button>

              </div>
            </div>

            <!-- Exercices -->
            <div class="exos-wrapper" :class="{ 'superset-mode': block.type === 'superset' }">
              <draggable
                  v-model="block.exercices"
                  tag="div"
                  item-key="id"
                  handle=".exo-drag-handle"
                  ghost-class="exo-ghost"
                  animation="150"
                  class="exos-list"
              >
                <template #item="{ element: exo, index: exoIndex }">
                  <div class="exo-row">
                    <span class="exo-drag-handle">
                      <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor"/>
                        <circle cx="6.5" cy="1.5" r="1.5" fill="currentColor"/>
                        <circle cx="1.5" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="6.5" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="1.5" cy="10.5" r="1.5" fill="currentColor"/>
                        <circle cx="6.5" cy="10.5" r="1.5" fill="currentColor"/>
                      </svg>
                    </span>

                    <div class="exo-number">{{ exoIndex + 1 }}</div>

                    <div class="exo-info">
                      <span class="exo-name">{{ exo.name || 'Exercice sans nom' }}</span>
                      <div class="exo-details">
                        <span v-if="exo.sets" class="exo-chip sets">{{ exo.sets }} × {{ exo.reps }}</span>
                        <span v-else-if="exo.reps" class="exo-chip reps">{{ exo.reps }} reps</span>
                        <span v-if="exo.weight" class="exo-chip weight">{{ exo.weight }} {{ exo.unit }}</span>
                      </div>
                    </div>

                    <div v-if="exo.restTime" class="exo-rest">
                      <span class="rest-label">Repos</span>
                      <span class="rest-value">{{ formatRest(exo.restTime) }}</span>
                    </div>

                    <div>
                      <button class="block-remove" @click="removeExercice(block.id, exo.id)"><span><FontAwesomeIcon :icon="faTrashCan" /></span></button>
                    </div>
                  </div>
                </template>
              </draggable>

              <div v-if="!block.exercices?.length" class="exos-empty">
                Aucun exercice dans ce bloc
              </div>
            </div>

          </div>
        </template>
      </draggable>

      <div v-if="!blocks.length" class="empty-state">
        <p class="empty-icon">📋</p>
        <p class="empty-text">Aucun bloc dans cette séance</p>
      </div>
    </main>

    <!-- ── Actions ─────────────────────────────────────────────────── -->
    <footer class="workout-footer">
      <router-link :to="{ name: 'training-plan-create' }">
        <button class="btn-outline">
          <span>＋</span> Ajouter des blocs
        </button>
      </router-link>
      <button class="btn-primary" @click="handleSave">
        <span>✓</span> Enregistrer
      </button>
    </footer>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Shell ────────────────────────────────────────────────────────── */
.workout-shell {
  min-height: 100vh;
  background: #16161f;
  color: #e8e8f4;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 42rem;
  margin: 0 auto;
  padding: 0 1rem 6rem;
}

/* ── Header ───────────────────────────────────────────────────────── */
.workout-header {
  padding: 2.5rem 0 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  margin-bottom: 2rem;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.session-label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #8888b0;
  margin: 0 0 0.4rem;
  font-weight: 500;
}

.workout-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 0.25rem;
  line-height: 1.1;
  color: #f2f2ff;
}

.session-name {
  color: #9090b8;
  margin: 0;
  font-size: 0.9rem;
}

.header-meta {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.meta-pill {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  text-align: center;
}

.meta-number {
  display: block;
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
  color: #f2f2ff;
}

.meta-unit {
  display: block;
  font-size: 0.65rem;
  color: #9090b8;
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
}

/* ── Blocks list ──────────────────────────────────────────────────── */
.blocks-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Block card ───────────────────────────────────────────────────── */
.block-card {
  background: #1e1e2c;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.block-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
}

.block-accent-bar {
  height: 3px;
  background: var(--block-color, #6366f1);
}

.block-ghost {
  opacity: 0.3;
  transform: scale(0.98);
}

/* ── Block head ───────────────────────────────────────────────────── */
.block-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.block-head-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.drag-handle {
  color: #5050780;
  cursor: grab;
  padding: 0.25rem;
  transition: color 0.15s;
  flex-shrink: 0;
  color: #505078;
}
.drag-handle:hover { color: #9090b8; }
.drag-handle:active { cursor: grabbing; }

.block-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.block-index {
  font-size: 0.65rem;
  color: #8888b0;
  letter-spacing: 0.1em;
  margin: 0 0 0.1rem;
  text-transform: uppercase;
}

.block-name {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
  color: #f2f2ff;
}

.block-head-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.type-badge {
  background: var(--block-color, #6366f1);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.info-chip {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  color: #b8b8d8;
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

/* ── Exercices wrapper ────────────────────────────────────────────── */
.exos-wrapper {
  padding: 0 1.25rem 1.25rem;
}

.superset-mode {
  border-left: 3px solid #f59e0b;
  margin-left: 1.25rem;
  padding-left: 1rem;
}

.exos-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Exercice row ─────────────────────────────────────────────────── */
.exo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  transition: background 0.15s, padding-left 0.15s;
  border-radius: 6px;
}

.exo-row:last-child { border-bottom: none; }
.exo-row:hover {
  background: rgba(255,255,255,0.04);
  padding-left: 0.75rem;
}

.exo-ghost { opacity: 0.25; }

.exo-drag-handle {
  color: #484868;
  cursor: grab;
  padding: 0.2rem;
  flex-shrink: 0;
  transition: color 0.15s;
}
.exo-drag-handle:hover { color: #9090b8; }

.exo-number {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  color: #9090b8;
  flex-shrink: 0;
}

.exo-info {
  flex: 1;
  min-width: 0;
}

.exo-name {
  display: block;
  font-weight: 500;
  font-size: 0.92rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #e8e8ff;
}

.exo-details {
  display: flex;
  gap: 0.35rem;
  margin-top: 0.3rem;
  flex-wrap: wrap;
}

.exo-chip {
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.exo-chip.sets   { background: rgba(99,102,241,0.22);  color: #b8c0ff; }
.exo-chip.reps   { background: rgba(16,185,129,0.20);  color: #6ee7b7; }
.exo-chip.weight { background: rgba(245,158,11,0.20);  color: #fcd34d; }

.exo-rest {
  text-align: right;
  flex-shrink: 0;
}

.rest-label {
  display: block;
  font-size: 0.6rem;
  color: #8888b0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.rest-value {
  font-size: 0.82rem;
  font-weight: 600;
  color: #b8b8d8;
}

/* ── Empty states ─────────────────────────────────────────────────── */
.exos-empty {
  font-size: 0.8rem;
  color: #6060a0;
  text-align: center;
  padding: 1rem;
  border: 1px dashed rgba(255,255,255,0.09);
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon { font-size: 2.5rem; margin: 0 0 0.75rem; }
.empty-text { color: #6060a0; font-size: 0.9rem; margin: 0; }

/* ── Footer ───────────────────────────────────────────────────────── */
.workout-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 42rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(to top, #16161f 60%, transparent);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-outline {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.16);
  color: #b8b8d8;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s;
}
.btn-outline:hover {
  border-color: rgba(255,255,255,0.30);
  color: #f2f2ff;
  background: rgba(255,255,255,0.09);
}

.btn-primary {
  background: #6366f1;
  border: none;
  color: #fff;
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.15s;
}
.btn-primary:hover {
  background: #4f52e0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}

.block-remove {
  background: transparent;
  border: 1px solid rgba(239,68,68,0.20);
  color: #a04040;
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; font-size: 0.75rem;
  transition: all 0.15s;
}
.block-remove:hover {
  background: rgba(239,68,68,0.12);
  border-color: rgba(239,68,68,0.5);
  color: #ef4444;
}
</style>