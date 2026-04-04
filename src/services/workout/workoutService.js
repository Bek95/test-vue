export async function saveWorkout(workoutStore) {
    const payload = {
        name: workoutStore.workoutName,
        session: {
            name: workoutStore.activeSessionName,
            blocks: JSON.parse(JSON.stringify(workoutStore.activeSessionBlocks))
        }
    }

    localStorage.setItem('workout_draft', JSON.stringify(payload))

    const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('Erreur API')
    localStorage.removeItem('workout_draft')
    return response.json()
}