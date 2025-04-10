<script setup>
import {ref} from 'vue'


const msg = ref('hello, i am the loop component, ')

let id = 0
const items = ref([
  {id:id++, text:"item_1"},
  {id:id++, text:"item_2"},
  {id:id++, text:"item_3"},
  {id:id++, text:"item_4"},
])

const newItem = ref('')
const addNewItem = () => {
  items.value.push({id:id++, text:newItem.value})
  newItem.value = ''
}
const removeItem = (i) => {
  items.value = items.value.filter((item) => item !== i)
}



</script>

<template>
  <header>
  </header>

  <main>
    <h2>{{ msg }}</h2>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.text }} <button @click="removeItem(item)">X</button></li>
    </ul>
    <input type="text" v-model="newItem">
    <button @click="addNewItem">add item</button>



  </main>
</template>

<style scoped>

.h2 {
  color: red;
}

</style>
