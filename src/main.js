import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import locale from './locale'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: locale,
    allowComposition: true,
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')