<script setup lang="ts">

import UlLoopFor from "@/components/UlLoopFor.vue";
import WatchComponent from "@/components/WatchComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import TestComponent from "@/components/TestComponent.vue";
import {ref} from "vue";

const msg = ref('TUTO VUE')
const childMsg = ref('')

const slot = ref('toto')

</script>

<template>
<h1>Hello l'accueil</h1>

    <main>
      <h1>{{ msg }}</h1>
      <!-- ajout de composant -->
      <UlLoopFor/>
      <br>
      <br>
      <span>**************************************************</span>
      <br>
      <br>
      <WatchComponent msg="test toto" color="blue"></WatchComponent>
      <br>
      <br>
      <br>
      <span>**************************************************</span>
      <br>
      <br>
      <h2> {{ msg }}</h2>
      <h4>{{ childMsg }}</h4>
      <ButtonComponent @compMsg="(msg) => childMsg = msg" msg="test msg"> Example : {{ slot.toUpperCase() }}</ButtonComponent>
      <ButtonComponent @compMsg="(msg) => childMsg = msg" msg="autre test" color="red"></ButtonComponent>
      <ButtonComponent @compMsg="(msg) => childMsg = msg" msg="encore un autre test" color="blue"></ButtonComponent>
      <br>
      <br>
      <br>
      <br>
      <TestComponent/>
      <br>
      <br>
      <br>
      <br>


    </main>
</template>

<style scoped>

</style>