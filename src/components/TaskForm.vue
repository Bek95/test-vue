<script setup>
import { ref } from "vue";

const emits = defineEmits(['addTask'])

const taskName = ref('')

const submitForm = () => {
  // Petite sécurité : on n'ajoute pas de tâche vide ou juste des espaces
  if (taskName.value.trim() === '') return

  emits("addTask", taskName.value)

  // On vide le champ
  taskName.value = ''
}
</script>

<template>
  <form @submit.prevent="submitForm" class="d-flex flex-column mb-4">
    <label for="add_task">Nouvelle tâche :</label>
    <input
        type="text"
        id="add_task"
        v-model="taskName"
        placeholder="Ex: Acheter du pain..."
        class="form-control"
    />
    <button type="submit" class="btn btn-primary mt-2">
      Ajouter à la liste
    </button>
  </form>
</template>

<style scoped>

</style>