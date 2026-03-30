<script setup>

defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['supprimerTache', 'isDone'])

const supprimerTache = (id) => {
  emits('supprimerTache', id)
}

const isDone = (id) => {
  emits('isDone', id)
}

</script>

<template>
  <ul class="d-flex justify-around">
    <li>
      <input type="checkbox" name="done" id="done" :checked="task.done" @click="isDone(task.id)"/>
      <span class="me-2" :class="{ 'completed' : task.done }">{{ task.name }}</span>
      <span>
        <button type="button" class="btn btn-danger" @click="supprimerTache(task.id)">x</button>
      </span>
    </li>
  </ul>
</template>

<style scoped>
ul> li {
  list-style: none;
}

.completed {
  text-decoration: line-through;
  color: #6c757d;
}
</style>