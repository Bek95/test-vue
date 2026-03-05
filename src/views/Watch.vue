<script setup>

import { ref, watch } from "vue";


const count = ref(0);

const incrementCount = () => {
  count.value++;
}

watch(count, (newValue, oldValue) => {

  console.log('old value : ', oldValue, 'nouvelle valeur : ', newValue);

  alert('la valeur du compteur a changé, elle était de : ' + oldValue + ', et maintenant elle est de : ' + newValue);
})

const note = ref('')
const statut = ref('') // Pour afficher "Enregistré" ou "En cours..."
let timer = null      // Pour nettoyer le message après X secondes

// LE WATCHER : Il surveille 'note'
watch(note, (nouvelleNote, ancienneNote) => {
  // 1. On affiche le message de chargement
  statut.value = "Enregistrement en cours..."

  // 2. On simule la sauvegarde (ex: localStorage)
  localStorage.setItem('ma_note', nouvelleNote)

  // 3. Gestion du message de succès avec un délai
  // On annule le timer précédent si l'utilisateur tape très vite
  clearTimeout(timer)

  timer = setTimeout(() => {
    statut.value = "Toutes les modifications sont enregistrées"
  }, 1000)
})

const id = ref('')
const post = ref(null)      // Pour stocker les données reçues
const loading = ref(false)  // Pour afficher un état de chargement

// On surveille 'id'
watch(id, async (newId) => {
  // 1. On ne fait rien si l'input est vide
  if (!newId) {
    post.value = null
    return
  }

  // 2. Début du chargement
  loading.value = true

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${newId}`)
    if (!response.ok) throw new Error("Post introuvable")

    const json = await response.json()

    // 3. On met à jour notre ref pour l'affichage
    post.value = json
  } catch (err) {
    console.error(err)
    post.value = { title: "Erreur", body: "Impossible de charger ce post." }
  } finally {
    // 4. Fin du chargement (qu'il y ait erreur ou succès)
    loading.value = false
  }
})


</script>

<template>
<h1>bienvenue pour le watch test</h1>
  <h3>exo 1, compteur qui change</h3>
  <button @click="incrementCount">ajout de 1 au count</button>

  <hr>
  <h3>La Sauvegarde Automatique (Niveau Intermédiaire)</h3>

  <textarea
      v-model="note"
      placeholder="Tapez vos notes ici..."
  ></textarea>

  <div class="status-bar">
    <p :class="{ 'saving': statut.includes('cours') }">
      {{ statut }}
    </p>
  </div>

  <hr>

  <h3>Exercice 3 : L'Appel API (Niveau Avancé)</h3>

  <div class="api-watch">
    <h2>Recherche de Post par ID</h2>
    <input v-model="id" type="number" placeholder="Entrez un ID (1-100)..." />

    <div v-if="loading" class="loader">Chargement en cours...</div>

    <div v-else-if="post" class="result">
      <h3>{{ post.title }}</h3>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>