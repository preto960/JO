import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/styles.css'
import { usePluginLoader } from './composables/usePluginLoader'
import { registerPluginRoutes } from './router/pluginRoutes'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

// Inicializar sistema de plugins
router.isReady().then(async () => {
  const { loadAllActivePlugins } = usePluginLoader()
  
  // Cargar plugins activos
  await loadAllActivePlugins()
  
  // Registrar rutas de plugins
  registerPluginRoutes(router)
  
  console.log('✅ Plugin system initialized')
})

app.mount('#app')