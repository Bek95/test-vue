<script setup>
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
</script>

<template>

  <h2 :class="color">{{ msg || "Default"}}</h2>
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