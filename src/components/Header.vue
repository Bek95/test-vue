<script setup>

</script>

<template>
<nav>
  <ul>
    <li><router-link to="/">Accueil</router-link></li>
    <li><router-link to="/computed">Computed</router-link></li>
    <li><router-link to="/watch">watch</router-link></li>
    <li><router-link to="/nonogramme">Nonogramme</router-link></li>
    <li><router-link to="/timer">Timer</router-link></li>
    <li><router-link to="/parent-enfant">Parent-enfant</router-link></li>
    <li><router-link :to="{name: 'workout-list'}">Workout</router-link></li>
  </ul>
</nav>
</template>

<style scoped>

</style>