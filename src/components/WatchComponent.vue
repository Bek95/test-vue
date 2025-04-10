<script setup>
import {ref, watch} from "vue";

const limit = ref(5)
const x = ref(0)
const debug = ref('')
const locked = ref(false)
const hidden = ref(true)

watch(x, (newValue) => {
  if (newValue > limit.value) {
    debug.value = "veuillez choisi un nombre inférieur ou égal à 5. "
    locked.value = true
    hidden.value = false
  }
})

const init = () => {
  x.value = 0
  locked.value = false
  hidden.value = true
}

const props = defineProps({
  msg: {
    type: String,
    required: false,
    default: "The Watch component"
  },
  color: {
    type: String,
  }
})
</script>

<template>
  <!-- pour passer des props, tel que couleur ou message -->
  <h2 :class="color">{{ msg || "Default message" }}</h2>
  <p style="color: red" :hidden="hidden">{{ debug }}</p>
  <input v-model="x" type="number" :disabled="locked" :class="locked ? 'alert-border-input' : '' ">
  <button @click="init">initialisation</button>
</template>

<style scoped>
.alert-border-input {
  border-color: red;
}
.blue {
  color: deepskyblue;
}
</style>