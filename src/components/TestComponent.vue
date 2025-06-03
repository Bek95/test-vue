<script setup lang="ts">

import {ref} from "vue";

let newItem = ref('');
let id = 0;
const items = ref([
  {id: id++, text: "item_" + id},
  {id: id++, text: "item_" + id}
]);

const addNewItem = () => {
  items.value.push({id:id++, text:newItem.value})
  newItem.value ='';
}

const removeItem = (i) => {
  items.value = items.value.filter(function (item) {
    return item !== i;
  })
}

</script>

<template>
  <ul>
    <li v-for="item in items">{{ item.text }}<button class="ms-5" @click="removeItem(item)">X</button></li>
  </ul>
  <input type="text" v-model="newItem">
  <button class="ms-5" @click="addNewItem">Add item</button>
</template>

<style scoped>
.ms-5 {
  margin-left: 5px;
}
</style>