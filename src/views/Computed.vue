<script setup>

import { ref, computed, watch } from "vue";

// *********************** nom prenom en brute lors de la saisie
const firstName = ref('')
const lastName = ref('')

const fullName = computed(() => {
  const first = firstName.value.trim()
  const last = lastName.value.trim()

  if (!first || !last) return 'En attente de saisie'

  return `${first}` + ' ' + `${last}`.toUpperCase()
})

// ******************************** filtre stock produits

const produits = ref([
  { nom: 'Clavier', prix: 50, enStock: true },
  { nom: 'souris', prix: 50, enStock: true },
  { nom: 'écran', prix: 150, enStock: false },
  { nom: 'tapis de souris', prix: 5, enStock: true },
])

const afficherProduitsEnStock = ref(false)

const produitsAffiches = computed(() => {
  if (afficherProduitsEnStock.value) {
    return produits.value.filter(p=> p.enStock)
  }

  return produits.value

})

const prixTotal = computed(() => {
  return produitsAffiches.value.reduce((a, b) =>  a + b.prix, 0)
})

const dollars = ref(110)

const euroAmount = computed({
      get() {
        return (dollars.value / 1.10).toFixed(2)
      },

      set(newValue) {
        dollars.value = Number(newValue) * 1.10
      }
    },
)


const getHeure = () => {

  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

const heure = computed(() => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
})
const count = ref(0)
const incrementCounter = () => {
  count.value += 1

  return count
}




</script>

<template>
<h1>Watcher test</h1>
  <h3>computed nom prenom brut</h3>

  <h1 v-if="fullName">Bonjour {{ fullName }}</h1>

  <div>
    <label for="first_name">Prénom : </label>
    <input type="text" name="first_name" id="first_name" v-model="firstName">
  </div>
  <div>
    <label for="last_name">Nom : </label>
    <input type="text" name="last_name" id="last_name" v-model="lastName">
  </div>

  <hr>
  <h3>computed liste</h3>
  <label>
    <input type="checkbox" v-model="afficherProduitsEnStock" />
    Afficher uniquement les articles en stock
  </label>
<!--  <div>-->
<!--    <button @click="inStock">stock</button>-->
<!--    <button @click="reset">réinitialiser</button>-->
<!--  </div>-->

  <div>
    <ul>
      <li v-for="item in produitsAffiches">{{ item.nom }} - {{ item.prix }} €</li>
    </ul>
    <div>
      valeur totale : {{ prixTotal }}
    </div>
  </div>

  <hr>
  <h3>Exercice 3 : L'Inversion de Logique (Niveau Avancé - Writable Computed)</h3>

  <div class="field">
    <label>Somme en Dollars ($) : </label>
    <input type="number" v-model="dollars" />
  </div>

  <div class="field">
    <label>Somme en Euros (€) : </label>
    <input type="number" v-model="euroAmount" />
  </div>

  <p>
    État de la source (ref dollars) : <strong>{{ dollars }}$</strong>
  </p>

  <hr>
  <h3>exo 4, methods vs computed</h3>

  <div>
    <span>heure methode {{ getHeure() }}</span>
    <span> -- </span>
    <span>Heure computed {{ heure }}</span>

    <button @click="incrementCounter">compteur ++ </button>
    <div>
      <h4>compteur : {{ count }}</h4>
    </div>
  </div>

</template>

<style scoped>

</style>