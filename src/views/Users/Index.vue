<script setup>

import { ref, onMounted, computed } from 'vue'
import api from '@/services/api.js'

const users = ref([])

onMounted(async() => {
 try {


   const response = await api.get('/users');

   users.value =  response.data;

 } catch (error) {
   console.log(error)
 }
})

</script>

<template>
  <div class="container">
    <h1>liste des users</h1>
    <div class="d-flex justify-center">
      <div v-if="users.length">
        <div v-for="user in users">
          <p><router-link :to="{name: 'user-details', params: { id: user.id}}">{{ user.name }}</router-link>
          </p>
        </div>
      </div>
      <div v-else>
        aucun utillisateurs trouvés
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>