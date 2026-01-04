import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/router.js";

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
