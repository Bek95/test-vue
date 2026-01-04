<script setup>

</script>

<template>
  <div class="container mt-5">
    <h1>Nouveau Programme</h1>
    <div class="mb-3">
      <label class="form-label">Nom du programme :</label>
      <input type="text" class="form-control" placeholder="Ex: Fat Body">
    </div>
    <div class="mb-3">
      <label class="form-label">Nom de la séance :</label>
      <input type="text" class="form-control" placeholder="Ex: Séance 1">
    </div>
    <router-link :to="{ name: 'training-plan-create' }" class="btn btn-primary">
      Continuer
    </router-link>
  </div>



  [ NOM DE LA SÉANCE : "Leg Day & Finisher" ]

  BLOC 1 : Musculation (Force)

  Squat Barre (4 séries x 5 reps) - Repos 3:00

  BLOC 2 : Superset (Hypertrophie) ┌─ 2a. Leg Extension (3 séries x 12 reps) └─ 2b. Leg Curl (3 séries x 12 reps) Repos 1:30 après le bloc

  BLOC 3 : Finisher (Format AMRAP) [ AMRAP 10 MINUTES ] ⚡

  15 Kettlebell Swings

  10 Burpees

  200m Rameur

</template>

<style scoped>

</style>