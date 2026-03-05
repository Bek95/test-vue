<script setup>

defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  cssClass: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div :class="cssClass" role="alert">
    {{ message }} - {{ type }}
  </div>
</template>

<style>

</style>