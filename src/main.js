import { createApp } from 'vue'
import App from './App.vue'
import './app.css'
import './registerServiceWorker'
import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {

        }
    },
    mutations: {
        
    },
    actions: {

    }
})

const app = createApp(App)

app.use(store)

app.mount('#app')
