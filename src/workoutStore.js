import { defineStore } from 'pinia'

export const useWorkoutStore = defineStore('workout', {
    state: () => ({
        // Le brouillon complet
        workout: {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            sessions: []
        },
        currentSessionId: null,
        // On peut aussi stocker ici les catalogues pour éviter de les recharger
        catalogues: {
            exercises: [],
            equipment: []
        }
    }),

    actions: {
        // initialisation du nom et de la séance du programme
        initNewWorkout(workoutName, sessionName) {
            this.workout.name = workoutName
            this.workout.sessions = []
            this.addNewSession(sessionName)
        },

        addNewSession(sessionName) {
            const newSession = {
                id: crypto.randomUUID(),
                name: sessionName || `Séance ${this.workout.sessions.length + 1  }`,
                blocks: []
            }

            this.workout.sessions.push(newSession)
            this.currentSessionId = newSession.id
        },

        // Ajouter un bloc à la séance active
        addBlockToCurrentSession(blockData) {
            const session = this.workout.sessions.find(s => s.id === this.currentSessionId)
            if (session) {
                session.blocks.push({
                    id: crypto.randomUUID(),
                    ...blockData,
                })
            }
        },

        // Supprimer une séance
        removeSession(sessionId) {
            this.workout.sessions = this.workout.sessions.filter(s => s.id !== sessionId)
            if (this.currentSessionId === sessionId) {
                this.currentSessionId = this.workout.sessions.length > 0 ? this.workout.sessions[0].id : null
            }
        }
    },

    getters: {
        workoutName: (state) => state.workout.name,

        activeSession: (state) => state.workout.sessions.find(s => s.id === state.currentSessionId),

        activeSessionName() {
            return this.activeSession?.name || '';
        },

        countSession: (state) => {
            return state.workout.sessions.length
        },

        getCurrentBlockSessionId() {
            return this.workout.sessions.flatMap(session =>
                session.id
            )
        },

        // blocks
        blockExercices() {

            // const exercices = []
            //
            // this.workout.sessions.forEach(session => {
            //     session.blocks.forEach(block => {
            //         if (block.exercices) {
            //             exercices.push(...block.exercices)
            //         }
            //     })
            // })
            //
            // return exercices


            return this.workout.sessions.flatMap(session =>
                session.blocks.flatMap(block => block.exercices ?? [])
            )
        },
        getBlockExercicesId() {
            return this.workout?.sessions?.flatMap(session =>
                session.blocks.flatMap(block => block.id ?? ''))
        },
        hasSupersetBlock: (state) => {
            return state.workout?.sessions?.some(session =>
                session.blocks.some(block => block.isSuperset)
            );
        }
    },
    persist: true,
})