import { defineStore } from 'pinia'

export const useWorkoutStore = defineStore('workout', {
    state: () => ({
        // Le brouillon complet
        workout: {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            sessions: [
                {
                    id: crypto.randomUUID(),
                    name: '',
                    blocs: []
                }
            ]
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
                blocs: []
            }

            this.workout.sessions.push(newSession)

            this.currentSessionId = newSession.id
        },

        // Ajouter un bloc à la séance active
        addBlockToCurrentSession(newBlock) {
            const session = this.workout.sessions.find(s => s.id === this.currentSessionId)
            if (session) {
                session.blocs.push({
                    id: crypto.randomUUID(),
                    ...newBlock
                })
            }
        },

        // Supprimer une séance
        removeSession(SessionId) {
            this.workout.sessions = this.workout.sessions.filter(s => s.id !== SessionId)
            // Si on a supprimé la séance active, on en prend une autre
            if (this.currentSessionId === sessionId && this.workout.sessions.length > 0) {
                this.currentSessionId = this.workout.sessions[0].id
            }
        }
    },

    getters: {
        activeSession: (state) => state.workout.sessions.find(s => s.id === state.currentSeanceId)
    }
})