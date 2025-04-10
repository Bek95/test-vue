<script setup>
import {computed, ref, watch, onMounted} from 'vue'
import UlLoopFor from "@/components/UlLoopFor.vue";
import WatchComponent from "@/components/WatchComponent.vue";

const msg = ref('TUTO VUE')

</script>

<template>
  <header>


  </header>

  <main>
    <h1>{{ msg }}</h1>
    <UlLoopFor></UlLoopFor>
    <br>
    <br>
    <span>**************************************************</span>
    <br>
    <br>
    <WatchComponent msg="test toto" color="blue"></WatchComponent>
    <br>
    <br>

  </main>
</template>

<style scoped>



</style>
