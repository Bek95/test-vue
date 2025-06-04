import { createRouter, createWebHistory} from "vue-router";
import Home from "@/views/Home.vue";
import Nonogramme from "@/views/Nonogramme.vue";
import Timer from '@/views/Timer.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/nonogramme', component: Nonogramme },
    { path: '/timer', component: Timer },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router