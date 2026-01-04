import { createRouter, createWebHistory} from "vue-router";
import Home from "@/views/Home.vue";
import Nonogramme from "@/views/Nonogramme.vue";
import Timer from '@/views/Timer.vue';
import workoutRouter from "@/router/workout.router.js";


const routes = [
    { path: '/', component: Home },
    { path: '/nonogramme', component: Nonogramme },
    { path: '/timer', component: Timer },
    ...workoutRouter
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router