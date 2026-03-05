<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import AlerteMessage from '@/components/AlerteMessage.vue'
import BoutonVote from '@/components/BoutonVote.vue'
import TaskComponent from "@/components/TaskComponent.vue";
import TaskForm from "@/components/TaskForm.vue";
import {map} from "vuedraggable/dist/vuedraggable.common.js";

const alerts = ref([
  { message: 'vous avez réussier', type: 'success', class:'alert alert-success' },
  { message: 'attention', type: 'warning', class:'alert alert-warning' },
  { message: 'Danger', type: 'danger', class:'alert alert-danger'  },
])


const voteCounter = ref(0)

// La fonction reçoit 'valeurDuVote' depuis l'enfant
const incrementerVote = (valeurDuVote) => {
  voteCounter.value += valeurDuVote
}

let id = 1

const tasks = ref([
  {name: 'tondre la pelouse', id: id++},
  {name: 'vérifier la tronçonneuse', id: id++},
  {name: 'robinetterie douche', id: id++},
  {name: 'robinetterie wc', id: id++},
])


const removeTask = (id) => {
  return tasks.value = tasks.value.filter((v) => v.id !== id)
}

const getTotalTasks = computed(() => {
  return tasks.value.length
})

const ajoutTache = (newTask) => {
  tasks.value.push({name: newTask, id: id++})
}

watch(tasks, newTasks => {
  localStorage.setItem('my-tasks', JSON.stringify(newTasks))
}, {deep: true})

onMounted(() => {
  const tasksSaved = localStorage.getItem('my-tasks')

  if (tasksSaved) {
    tasks.value = JSON.parse(tasksSaved)
    //pour éviter les doublons on met à jour l'id
    if (tasksSaved.length > 0) {
      id = Math.max(...tasks.value.map(task => task.id)) + 1
    }
  }
})


</script>

<template>
  <h1>exercice 1 - Mes alertes</h1>
  <AlerteMessage v-for="(alert, i) in alerts" :key="i" :message="alert.message" :type="alert.type" :cssClass="alert.class" />

  <h1>exercice 2 - Le Vote (Inversion du flux)</h1>

  <div v-if="voteCounter > 0">
    Nombre de votes : {{ voteCounter }}
  </div>
  <div v-else>Aucun vote pour le moment.</div>

  <BoutonVote @voter="incrementerVote" />

  <hr>

  <h1>Exercice 3 : La Liste de Tâches Interactive (Niveau Avancé)</h1>

  <div class="d-flex justify-content-center align-items-center mb-5">
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">TODO LIST</h5>
        <TaskComponent v-for="task in tasks" :name="task.name" :id="task.id" @supprimerTache="removeTask"/>
      </div>
      <div>
        nombre de taches : {{ getTotalTasks }}
      </div>
      <div class="card-footer">
        <h4 class="card-title">ajout d'une tache</h4>
        <TaskForm @addTask="ajoutTache"/>

      </div>
    </div>
  </div>



</template>