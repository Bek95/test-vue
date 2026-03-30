// stores/workoutStore.js
import { defineStore } from 'pinia'

// ─── Factories par type de bloc ───────────────────────────────────────────────

function makeBaseExercice(overrides = {}) {
    return {
        id: crypto.randomUUID(),
        name: '',
        reps: null,
        ...overrides,
    }
}

const blockFactories = {
    musculation: (overrides = {}) => ({
        id: crypto.randomUUID(),
        type: 'musculation',
        backgroundColor: '#dba81a',
        name: '',
        exercices: [],
        // champs spécifiques — sur l'exercice, pas le bloc
        ...overrides,
    }),

    superset: (overrides = {}) => ({
        id: crypto.randomUUID(),
        type: 'superset',
        backgroundColor: null,
        name: '',
        restTime: 60,   // partagé entre tous les exos du superset
        exercices: [],
        ...overrides,
    }),

    amrap: (overrides = {}) => ({
        id: crypto.randomUUID(),
        type: 'amrap',
        backgroundColor: '#ed1123',
        name: '',
        timeCap: 10,    // en minutes
        exercices: [],
        ...overrides,
    }),

    emom: (overrides = {}) => ({
        id: crypto.randomUUID(),
        type: 'emom',
        backgroundColor: '#a369c9',
        name: '',
        timeCap: 10,    // durée totale en minutes
        interval: 60,   // durée d'un intervalle en secondes
        exercices: [],
        ...overrides,
    }),

    fortime: (overrides = {}) => ({
        id: crypto.randomUUID(),
        type: 'fortime',
        backgroundColor: '#2c7d09',
        name: '',
        timeCap: 20,
        exercices: [],
        ...overrides,
    }),

    tabata: (overrides = {}) => ({
        id: crypto.randomUUID(),
        type: 'tabata',
        backgroundColor: '#2f3ced',
        name: '',
        workTime: 20,   // secondes de travail
        restTime: 10,   // secondes de repos (protocole, pas par exo)
        rounds: 8,
        exercices: [],
        ...overrides,
    }),
}

// Champs par défaut d'un exercice selon le type de bloc parent
const exerciceDefaults = {
    musculation:    () => makeBaseExercice({ sets: 4, reps: 8, restTime: 90 }),
    superset: () => makeBaseExercice({ sets: 4, reps: 8 }),         // restTime hérité du bloc
    amrap:    () => makeBaseExercice({ reps: 10 }),                  // pas de sets ni restTime
    emom:     () => makeBaseExercice({ reps: 10 }),
    fortime:  () => makeBaseExercice({ reps: 10 }),
    tabata:   () => makeBaseExercice({ reps: null }),                // le protocole prime
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWorkoutStore = defineStore('workout', {
    state: () => ({
        workout: {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            sessions: [],
        },
        currentSessionId: null,
    }),

    actions: {
        // ── Workout ──────────────────────────────────────────────────────────────

        initNewWorkout(workoutName, firstSessionName) {
            this.workout = {
                id: crypto.randomUUID(),
                name: workoutName,
                description: '',
                sessions: [],
            }
            this.addSession(firstSessionName)
        },

        // ── Sessions ─────────────────────────────────────────────────────────────

        addSession(name) {
            const session = {
                id: crypto.randomUUID(),
                name: name || `Séance ${this.workout.sessions.length + 1}`,
                blocks: [],
            }
            this.workout.sessions.push(session)
            this.currentSessionId = session.id
        },

        removeSession(sessionId) {
            this.workout.sessions = this.workout.sessions.filter(s => s.id !== sessionId)
            if (this.currentSessionId === sessionId) {
                this.currentSessionId = this.workout.sessions[0]?.id ?? null
            }
        },

        renameSession(sessionId, newName) {
            const session = this._findSession(sessionId)
            if (session) session.name = newName
        },

        setCurrentSession(sessionId) {
            if (this.workout.sessions.some(s => s.id === sessionId)) {
                this.currentSessionId = sessionId
            }
        },

        // ── Blocs ─────────────────────────────────────────────────────────────────

        /**
         * @param {'musculation'|'superset'|'amrap'|'emom'|'fortime'|'tabata'} type
         * @param {Object} overrides - champs à écraser sur le bloc
         */
        addBlock(type, overrides = {}) {
            const factory = blockFactories[type]
            if (!factory) {
                console.warn(`[workoutStore] Type de bloc inconnu : "${type}"`)
                return
            }
            const session = this._findCurrentSession()
            if (!session) return

            session.blocks.push(factory(overrides))
        },

        removeBlock(blockId) {
            const session = this._findCurrentSession()
            if (!session) return
            session.blocks = session.blocks.filter(b => b.id !== blockId)
        },

        updateBlock(blockId, changes) {
            const block = this._findBlock(blockId)
            if (block) Object.assign(block, changes)
        },

        reorderBlocks(newBlocksOrder) {
            const session = this._findCurrentSession()
            if (session) session.blocks = newBlocksOrder
        },

        // ── Exercices ─────────────────────────────────────────────────────────────

        /**
         * Ajoute un exercice dans un bloc avec les defaults adaptés au type du bloc
         * @param {string} blockId
         * @param {Object} exerciceData - données issues du catalogue (id, name, etc.)
         */
        addExerciceToBlock(blockId, exerciceData = {}) {
            const block = this._findBlock(blockId)
            if (!block) return

            const defaults = exerciceDefaults[block.type]?.() ?? makeBaseExercice()
            block.exercices.push({ ...defaults, ...exerciceData })
        },

        removeExerciceFromBlock(blockId, exerciceId) {
            const block = this._findBlock(blockId)
            if (!block) return
            block.exercices = block.exercices.filter(e => e.id !== exerciceId)
        },

        updateExercice(blockId, exerciceId, changes) {
            const block = this._findBlock(blockId)
            if (!block) return
            const exo = block.exercices.find(e => e.id === exerciceId)
            if (exo) Object.assign(exo, changes)
        },

        replaceExercice(blockId, exerciceId, newExerciceData) {
            const block = this._findBlock(blockId)
            if (!block) return
            const index = block.exercices.findIndex(e => e.id === exerciceId)
            if (index !== -1) {
                // On garde les champs de perf (sets, reps...) et on remplace les infos de l'exo
                const current = block.exercices[index]
                block.exercices[index] = { ...current, ...newExerciceData }
            }
        },

        // ── Helpers privés ────────────────────────────────────────────────────────

        _findSession(sessionId) {
            return this.workout.sessions.find(s => s.id === sessionId) ?? null
        },

        _findCurrentSession() {
            return this._findSession(this.currentSessionId)
        },

        _findBlock(blockId) {
            for (const session of this.workout.sessions) {
                const block = session.blocks.find(b => b.id === blockId)
                if (block) return block
            }
            return null
        },
    },

    getters: {
        workoutName: (state) => state.workout.name,

        sessions: (state) => state.workout.sessions,

        activeSession: (state) =>
            state.workout.sessions.find(s => s.id === state.currentSessionId) ?? null,

        activeSessionName() {
            return this.activeSession?.name ?? ''
        },

        activeSessionBlocks() {
            return this.activeSession?.blocks ?? []
        },

        sessionCount: (state) => state.workout.sessions.length,

        // Tous les exercices à plat (utile pour stats, résumé, etc.)
        allExercices: (state) =>
            state.workout.sessions.flatMap(s =>
                s.blocks.flatMap(b => b.exercices ?? [])
            ),

        hasBlockOfType: (state) => (type) =>
            state.workout.sessions.some(s =>
                s.blocks.some(b => b.type === type)
            ),
    },

    persist: true,
})