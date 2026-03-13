import { createRouter, createWebHistory} from "vue-router";
import Home from "@/views/Home.vue";
import Nonogramme from "@/views/Nonogramme.vue";
import Timer from '@/views/Timer.vue';
import Computed from "@/views/Computed.vue";
import Watch from "@/views/Watch.vue";
import ParenEnfant from "@/views/ParenEnfant.vue";

import workoutRouter from "@/router/workout.router.js";
import userRouter from "@/router/user.router.js";

const routes = [
    { path: '/', name:'home', component: Home },
    { path: '/nonogramme', component: Nonogramme },
    { path: '/timer', component: Timer },
    { path: '/computed', component: Computed },
    { path: '/watch', component: Watch },
    { path: '/parent-enfant', component: ParenEnfant },
    ...workoutRouter,
    ...userRouter,

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router