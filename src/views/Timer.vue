<script setup lang="ts">
import { ref, computed } from "vue";

const workDuration = ref(20)
const restDuration = ref(10)
const maxRounds = ref(8)
const round = ref(1)

const time = ref(workDuration.value)
const phase = ref('Work')
const interval = ref<ReturnType<typeof setInterval> | null>(null)

const timeDisplay = computed(() => {
  const minutes = Math.floor(time.value / 60)
  const seconds = time.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const start = () => {
  if (interval.value) clearInterval(interval.value)

  round.value = 1
  phase.value = 'Work'
  time.value = workDuration.value

  interval.value = setInterval(() => {
    if (phase.value === 'Rest') {
      if (time.value <= 5 && time.value > 0) {
        playCountdownBeep()
      }
    }

    time.value--

    if (time.value < 0) {
      if (phase.value === 'Work') {
        if (round.value >= maxRounds.value) {
          // 🎉 Fini juste après le dernier Work
          clearInterval(interval.value!)
          interval.value = null
          phase.value = 'Fini 🎉'
          time.value = 0
          speak('Workout complete')
        } else {
          // 🔁 Transition Work → Rest
          phase.value = 'Rest'
          time.value = restDuration.value
          playBeep('Rest')
          speak('Rest')
        }
      } else {
        // 🔁 Transition Rest → nouveau Work
        round.value++
        phase.value = 'Work'
        time.value = workDuration.value
        playBeep('Work')
        speak('Round ' + round.value)
      }
    }
  }, 1000)
}

function playBeep(phase: 'Work' | 'Rest') {
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = phase === 'Work' ? 800 : 400 // Aigu pour Work, grave pour Rest
  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  setTimeout(() => {
    oscillator.stop()
    context.close()
  }, 200)
}

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US' // Ou 'fr-FR' si tu veux "Repos" au lieu de "Rest"
  speechSynthesis.speak(utterance)
}

function playCountdownBeep() {
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'square'
  oscillator.frequency.value = 1000
  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start()
  setTimeout(() => {
    oscillator.stop()
    context.close()
  }, 100) // Bip court
}


</script>

<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold mb-2">{{ phase }}</h2>
    <h2 class="text-xl mb-4">Round {{ round }}/{{ maxRounds }}</h2>

    <div class="mb-4">
      <input type="number" v-model.number="maxRounds" class="border p-1 rounded" /> Tours <br>
      <input type="number" v-model.number="workDuration" class="border p-1 rounded mt-2" /> Travail (s)<br>
      <input type="number" v-model.number="restDuration" class="border p-1 rounded mt-2" /> Récupération (s)<br>
    </div>

    <p class="text-4xl font-mono">{{ timeDisplay }}</p>
    <button @click="start" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Démarrer</button>
  </div>
</template>

<style scoped>
button:hover {
  background-color: #2563eb;
}
</style>
