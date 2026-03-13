<script setup>
import api from '@/services/api.js'
import { onMounted, ref, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/router.js";

const route = useRoute();

const userId = route.params.id;

const user = ref('')

const isLoading = ref(true);

const goHome = () => {
  router.push({ name: 'home' });
}

// onMounted(async () => {
//   try {
//     const response = await api.get('/users/' + userId)
//     const userData = response.data
//
//     user.value = {
//       ...userData,
//       city: userData.address.city,
//       company_name: userData.company.name,
//     }
//   } catch (error) {
//     console.log(error)
//     isLoading.value = false
//   } finally {
//     //  test pour ralentir afin de voir le spinner
//     await new Promise(resolve => setTimeout(resolve, 2000))
//     isLoading.value = false
//   }
// })


const fetchUserData = async (id) => {
  try {
    isLoading.value = true;
    console.log(id)
    const response = await api.get('/users/' + id);

    console.log(response.data);
    user.value = response.data;

  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchUserData(route.params.id);
})

const isPlainObject = (value) => {
  return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
  );
};

const message = ref('Voulez-vous supprimer cet utilisateur ?')

const deleteUser = async (id) => {
    // fake to remove the user

    try {
      isLoading.value = true
      message.value = 'Suppressin en cours ...'

      await new Promise(resolve => setTimeout(resolve, 2000))

      // router.push({ name: 'users' })
      isLoading.value = false

      router.push({ name: 'users'})

    } catch (error) {
      console.log(error)
      isLoading.value = false
    } finally {
      isLoading.value = false
    }
}

onUnmounted(() => {
  document.body.classList.remove('modal-open');
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.remove();
})


watch(() => route.params.id, (newValue) => {
  console.log(newValue);
  if (newValue) {
    fetchUserData(newValue);
  }
})

</script>

<template>
  <div class="container">
    <h1>details</h1>
    <div class="d-flex mb-5">
      <span><button class="btn btn-secondary" @click="goHome">Home</button></span>
      <span class="ms-5"><router-link :to="{name: 'users'}">Retour à la liste</router-link></span>
    </div>

    <div v-if="isLoading" class="loader">

    </div>
    <div v-else-if="user">
        <p> vous regardez le profil de l'id ** {{ userId }} **</p>
      <ul>
        <li v-for="(item, key) in user" >
          <span v-if="isPlainObject(item)">{{ key }} - <span v-for="(value, i) in item"> <strong>{{ i }} :</strong> {{ value }}; </span></span>
          <span v-else><strong>{{ key }}</strong> - {{ item }} </span>
        </li>
      </ul>
      <button type="button" class="btn btn-danger ms-4" data-bs-toggle="modal"
              data-bs-target="#staticBackdrop">
        Supprimer
      </button>
      <hr>
      <router-link :to="{ name: 'user-details', params: { id: 1 }}">User 1</router-link> |
      <router-link :to="{ name: 'user-details', params: { id: 2 }}">User 2</router-link> |
      <router-link :to="{ name: 'user-details', params: { id: 3 }}">User 3</router-link>
    </div>
    <div v-else>
      <p> aucun profil de sélectionné </p>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Suppression</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="textModal">
          {{ message}}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" @click="deleteUser(userId)">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul>li {
  list-style: none;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>