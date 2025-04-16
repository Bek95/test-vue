<script setup>
import {ref} from "vue";

const props = defineProps({
  msg: {
    type: Array,
    required: false,
    default: "btn component"
  },
  color: {
    type:String,
    default: "black"

  }
})

const emit = defineEmits(['compMsg'])

const clickHandler = () => {
  console.log('click : ' + props.msg + ' - ' + props.color)
  emit('compMsg', props.msg)
}

const slot = ref('Default SLOT')
</script>

<template>

  <h2 :class="color">{{ msg || "Default"}}</h2>
  <p><slot>{{ slot }}</slot></p>
  <button @click="clickHandler">btn</button>

</template>

<style scoped>
.red {
  color: red;
}

.blue {
  color: blue;
}
</style>