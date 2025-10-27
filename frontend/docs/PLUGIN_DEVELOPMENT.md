# Plugin Development Guide

## Overview

El sistema de plugins permite extender la funcionalidad del sistema base sin modificar el código core. Los plugins se desarrollan de forma independiente en el Publisher y se instalan dinámicamente en el Frontend.

## Arquitectura

```
Publisher (Backend + Frontend)
  ↓ Publica plugins
Backend Principal
  ↓ Proxy/Instalación
Frontend/Admin
  ↓ Carga dinámica
Sistema con Plugins Activos
```

## Estructura de un Plugin

```
my-plugin/
├── manifest.json          # Configuración del plugin
├── index.js              # Punto de entrada
├── components/           # Componentes Vue
│   ├── Widget.vue
│   └── Settings.vue
├── views/               # Vistas completas
│   └── Dashboard.vue
├── store/               # Estado Pinia (opcional)
│   └── index.ts
├── hooks/               # Lifecycle hooks
│   ├── onInstall.js
│   └── onActivate.js
└── assets/              # Recursos estáticos
    ├── styles.css
    └── logo.png
```

## Manifest Schema

El `manifest.json` define la configuración y capacidades del plugin:

```json
{
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Developer Name",
  "main": "index.js",
  
  "routes": [
    {
      "path": "/my-feature",
      "name": "MyFeature",
      "component": "MyFeatureView",
      "meta": {
        "title": "My Feature",
        "requiresAuth": true
      }
    }
  ],
  
  "components": {
    "MyWidget": "components/Widget.vue",
    "MySettings": "components/Settings.vue"
  },
  
  "permissions": [
    "read:users",
    "write:data"
  ],
  
  "settings": [
    {
      "key": "apiKey",
      "label": "API Key",
      "type": "text",
      "required": true
    }
  ]
}
```

## Lifecycle Hooks

### onInstall
Se ejecuta cuando el plugin se instala por primera vez.

```javascript
export async function onInstall(context) {
  // Inicializar base de datos
  // Crear configuración inicial
  console.log('Plugin installed')
}
```

### onActivate
Se ejecuta cuando el plugin se activa.

```javascript
export async function onActivate(context) {
  // Registrar listeners
  // Iniciar servicios
  console.log('Plugin activated')
}
```

### onDeactivate
Se ejecuta cuando el plugin se desactiva.

```javascript
export async function onDeactivate(context) {
  // Limpiar listeners
  // Detener servicios
  console.log('Plugin deactivated')
}
```

### onUninstall
Se ejecuta cuando el plugin se desinstala.

```javascript
export async function onUninstall(context) {
  // Limpiar datos
  // Eliminar configuración
  console.log('Plugin uninstalled')
}
```

## API Context

Cada hook recibe un objeto `context` con acceso al sistema:

```typescript
interface PluginContext {
  api: AxiosInstance        // Cliente API
  router: Router            // Vue Router
  store: Store              // Pinia Store
  config: PluginConfig      // Configuración del plugin
  emit: (event: string, data: any) => void  // Emitir eventos
  on: (event: string, handler: Function) => void  // Escuchar eventos
}
```

## Ejemplo de Plugin Completo

### manifest.json
```json
{
  "name": "Analytics Dashboard",
  "version": "1.0.0",
  "description": "Advanced analytics and reporting",
  "routes": [
    {
      "path": "/analytics",
      "name": "Analytics",
      "component": "AnalyticsView"
    }
  ],
  "components": {
    "AnalyticsWidget": "components/Widget.vue"
  },
  "permissions": ["read:analytics"]
}
```

### index.js
```javascript
export async function initialize(context) {
  console.log('Analytics plugin initialized')
  
  // Registrar componente global
  context.app.component('AnalyticsWidget', AnalyticsWidget)
  
  // Agregar ruta
  context.router.addRoute({
    path: '/plugins/analytics',
    component: AnalyticsView
  })
}

export async function destroy(context) {
  console.log('Analytics plugin destroyed')
}
```

### components/Widget.vue
```vue
<template>
  <div class="analytics-widget">
    <h3>Analytics Overview</h3>
    <div class="stats">
      <div class="stat">
        <span>Users</span>
        <strong>{{ stats.users }}</strong>
      </div>
      <div class="stat">
        <span>Revenue</span>
        <strong>${{ stats.revenue }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePluginContext } from '@/composables/usePluginContext'

const { api } = usePluginContext()
const stats = ref({ users: 0, revenue: 0 })

onMounted(async () => {
  const response = await api.get('/analytics/stats')
  stats.value = response.data
})
</script>
```

## Publicación

1. Desarrolla tu plugin en el Publisher
2. Empaqueta como `.zip` con todos los archivos
3. Sube el paquete al Publisher
4. Publica el plugin (status: PUBLISHED)
5. El plugin aparecerá en el marketplace del Frontend

## Instalación

Los usuarios pueden:
1. Buscar el plugin en el marketplace interno
2. Ver detalles y documentación
3. Instalar con un clic
4. Activar/desactivar según necesidad
5. Configurar settings específicos

## Best Practices

1. **Versionado Semántico**: Usa `MAJOR.MINOR.PATCH`
2. **Documentación**: Incluye README.md detallado
3. **Permisos Mínimos**: Solo solicita los permisos necesarios
4. **Error Handling**: Maneja errores gracefully
5. **Performance**: Carga lazy de componentes pesados
6. **Cleanup**: Limpia recursos en hooks de destrucción
7. **Testing**: Prueba en diferentes entornos

## Debugging

```javascript
// En desarrollo, activa logs detallados
if (import.meta.env.DEV) {
  console.log('[Plugin] Event:', event)
}
```

## Limitaciones

- Los plugins no pueden modificar el core del sistema
- Deben respetar los permisos asignados
- No pueden acceder a datos de otros plugins sin autorización
- El tamaño máximo del paquete es 100MB

