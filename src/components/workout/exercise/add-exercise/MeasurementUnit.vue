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
  <select class="unit-select" :value="modelValue" @change="updateUnits">
    <option v-for="unit in units" :key="unit.unit" :value="unit.unit">
      {{ unit.unit }}
    </option>
  </select>
</template>

<style scoped>
.unit-select {
  background: #1e1e28;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #f0f0f8;
  padding: 0.6rem 0.85rem;
  font-family: 'Epilogue', sans-serif;
  font-size: 0.9rem;
  height: 40px;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.unit-select:focus {
  border-color: rgba(255, 255, 255, 0.2);
}
</style>