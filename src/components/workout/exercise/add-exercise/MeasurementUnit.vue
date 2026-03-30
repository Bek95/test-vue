<script setup>

defineProps({
  units: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
  }
})

const emits = defineEmits(['update:modelValue'])

const updateUnits = (event) => {
  emits('update:modelValue', event.target.value)
}

</script>

<template>

  <select class="form-select m-2" aria-label="Default select example" :value="modelValue" @change="updateUnits">
    <option v-for="unit in units" :key="unit.unit" :value="unit.unit">{{ unit.unit }}</option>
  </select>


</template>

<style scoped>

</style>