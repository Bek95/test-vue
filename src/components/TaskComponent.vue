<script setup>

defineProps({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
})

const emits = defineEmits(['supprimerTache'])

const supprimerTache = (id) => {
  emits('supprimerTache', id)
}


</script>

<template>
  <ul class="d-flex justify-around">
    <li>
      <span class="me-2">{{ name }}</span>
      <span>
        <button type="button" class="btn btn-danger" @click="supprimerTache(id)">x</button>
      </span>
    </li>
  </ul>
</template>

<style scoped>
ul>li {
  list-style: none;
}

</style>