import { createRouter, createWebHistory} from "vue-router";
import Home from "@/views/Home.vue";
import Nonogramme from "@/views/Nonogramme.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/nonogramme', component: Nonogramme },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router