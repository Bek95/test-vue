<script setup>

defineProps({
  cssClassTtext: {
    type: String,
    default: ''
  }
})

</script>

<template>
<div class="card border-card-style">
  <div class="header" :class="cssClassTtext">
    <slot name="header"></slot>
  </div>
  <div>
    <slot name="body-card"></slot>
  </div>
    <div class="d-flex justify-center w-10" style="border: red">
      <slot name="default"></slot>
    </div>
</div>
</template>

<style scoped>

.border-card-style {
  border: 1px solid chartreuse;
}

.red {
  color: red;
}

</style>