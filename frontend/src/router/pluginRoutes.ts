import type { RouteRecordRaw } from 'vue-router'
import { usePluginLoader } from '@/composables/usePluginLoader'

/**
 * Obtiene las rutas dinámicas de los plugins cargados
 */
export function getPluginRoutes(): RouteRecordRaw[] {
  const { getPluginRoutes } = usePluginLoader()
  return getPluginRoutes.value as RouteRecordRaw[]
}

/**
 * Registra las rutas de plugins en el router
 */
export function registerPluginRoutes(router: any) {
  const pluginRoutes = getPluginRoutes()
  
  pluginRoutes.forEach(route => {
    // Agregar prefijo /plugins/ a las rutas de plugins
    const pluginRoute = {
      ...route,
      path: `/plugins${route.path}`
    }
    
    router.addRoute(pluginRoute)
  })
  
  console.log(`✅ Registered ${pluginRoutes.length} plugin routes`)
}

/**
 * Elimina las rutas de un plugin específico
 */
export function unregisterPluginRoutes(router: any, pluginId: string) {
  // Vue Router no tiene una API directa para remover rutas
  // En un escenario real, necesitarías mantener un registro de las rutas agregadas
  console.log(`Unregistering routes for plugin ${pluginId}`)
}

