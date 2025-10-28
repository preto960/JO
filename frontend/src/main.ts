import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/styles.css'
import { useAuthStore } from './stores/auth'
import { usePluginsStore } from './stores/plugins'
import { usePluginLoader } from './composables/usePluginLoader'
import { registerPluginRoutes } from './router/pluginRoutes'
import { useGlobalWebSocket } from './composables/useWebSocket'

// Habilitar el compilador de templates en runtime para plugins
if (typeof window !== 'undefined') {
  (window as any).__VUE_OPTIONS_API__ = true;
  (window as any).__VUE_PROD_DEVTOOLS__ = false;
}

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

// Inicializar autenticación y sistema de plugins
router.isReady().then(async () => {
  const authStore = useAuthStore()
  const pluginsStore = usePluginsStore()
  const { loadAllActivePlugins } = usePluginLoader()
  const { connect } = useGlobalWebSocket()
  
  // Inicializar autenticación si hay token
  await authStore.initializeAuth()
  
  // Si está autenticado, cargar plugins
  if (authStore.isAuthenticated) {
    // Primero obtener la lista de plugins instalados
    await pluginsStore.fetchInstalledPlugins()
    
    // Luego cargar los plugins activos
    await loadAllActivePlugins()
    
    // Registrar rutas de plugins
    registerPluginRoutes(router)
    
    // Conectar WebSocket para hot reload
    connect()
    
    console.log('✅ Plugin system initialized')
    console.log('✅ WebSocket initialized')
  }
})

app.mount('#app')