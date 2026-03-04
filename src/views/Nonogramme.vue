<script setup>
import { ref } from "vue"

const placeholderMsg = ref('saisir une valeur')

const newItem = ref('')

const items = ref([])
let id = 0
const addNewItem = () => {
  items.value.push(
      {
        id: id++,
        text: newItem.value
      }
  )
}

const removeItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id )

  console.log(items.value)
}



</script>

<template>
  <div id="toolbar">
    <button>Vider la grille</button>
    <button>Exporter la grille</button>
    <button>Zoom -</button>
    <button>Zoom +</button>
    <input type="file">
  </div>

  <div style="margin: 5px">
    <hr>
  </div>
  <div>
    <ul>
      <li v-for="item in items">{{ item.text }}<button class="ms-2" @click="removeItem(item.id)">X</button></li>
    </ul>
  </div>
<div>
  <input type="text" :placeholder="placeholderMsg" style="margin: 5px" v-model="newItem"><button @click="addNewItem">add</button>
</div>

  <canvas width="25" height="25" id="previewCanvas">Désolé, votre navigateur ne prend en charge HML5</canvas>
</template>

<style scoped>

</style>