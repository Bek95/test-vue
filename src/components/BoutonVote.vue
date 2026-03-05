<script setup>
const emits = defineEmits(['voter'])

const envoyerVote = () => {
  // On émet le signal 'voter' et on passe '1' en argument
  emits('voter', 1)
}
</script>

<template>
<button @click="envoyerVote">vote</button>
</template>

<style scoped>

</style>