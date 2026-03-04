import { createRouter, createWebHistory} from "vue-router";
import Home from "@/views/Home.vue";
import Nonogramme from "@/views/Nonogramme.vue";
import Timer from '@/views/Timer.vue';
import Computed from "@/views/Computed.vue";
import Watch from "@/views/Watch.vue";

import workoutRouter from "@/router/workout.router.js";


const routes = [
    { path: '/', component: Home },
    { path: '/nonogramme', component: Nonogramme },
    { path: '/timer', component: Timer },
    { path: '/computed', component: Computed },
    { path: '/watch', component: Watch },
    ...workoutRouter
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router