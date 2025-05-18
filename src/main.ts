import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import { useThemeStore } from './stores/themeStore'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app').$nextTick(() => {
	const themeStore = useThemeStore()

	themeStore.initializeTheme()
	if (typeof window !== 'undefined') {
		const cleanup = themeStore.watchSystemPreference()
	}
})
