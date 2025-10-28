# Plugin Task Manager - Troubleshooting Guide

## Estado Actual

El plugin Task Manager está instalado pero no muestra contenido porque el sistema actual no carga dinámicamente el código JavaScript/Vue de los plugins. Solo lee el manifest.

## Problema Identificado

### Arquitectura Actual
1. El plugin se empaqueta como ZIP con código TypeScript/Vue
2. Se sube a Vercel Blob Storage
3. El backend principal descarga el ZIP y guarda la referencia
4. El frontend solo lee el manifest pero **NO carga el código JavaScript del plugin**

### Lo Que Falta
- Sistema de carga dinámica de módulos JavaScript
- Compilación de plugins a formato ESM/UMD
- Servidor de plugins estáticos o CDN
- Loader de componentes Vue dinámicos

## Solución Temporal Implementada

He creado una vista genérica (`PluginView.vue`) que:
- ✅ Muestra información del plugin instalado
- ✅ Muestra el estado (activo/inactivo)
- ✅ Lista las rutas disponibles del manifest
- ✅ Muestra el manifest completo
- ⚠️ Indica que la carga dinámica está en desarrollo

## Pasos para Verificar la Instalación

### 1. Verificar que el plugin está en la base de datos del Publisher

```bash
cd publisher/backend
npm run build
node dist/scripts/checkPlugins.js
```

### 2. Si no aparece, publicarlo manualmente

```bash
cd publisher/backend
npm run build
node dist/scripts/publishTaskManager.js
```

### 3. Verificar que el plugin está instalado en el backend principal

Hacer una petición a:
```
GET http://localhost:3001/api/installed-plugins
```

Debería aparecer el plugin task-manager con:
- `status: "INSTALLED"`
- `isActive: true`
- `packageUrl: "..."` (URL del blob)

### 4. Verificar en el frontend

1. Ir a `/plugins` - Debería aparecer Task Manager en la lista
2. Click en Task Manager en el sidebar
3. Debería abrir `/plugins/task-manager` con información del plugin

## Soluciones a Largo Plazo

### Opción 1: Sistema de Módulos Federados (Recomendado)
Usar Webpack Module Federation o Vite Plugin Federation para cargar plugins como módulos remotos.

**Ventajas:**
- Carga dinámica real de código
- Hot reload
- Aislamiento de dependencias
- Mejor rendimiento

**Implementación:**
1. Configurar Vite con `@originjs/vite-plugin-federation`
2. Compilar plugins como módulos remotos
3. Cargar módulos en runtime desde packageUrl

### Opción 2: Sistema de iframes
Cada plugin se ejecuta en un iframe aislado.

**Ventajas:**
- Aislamiento completo
- Seguridad mejorada
- Más simple de implementar

**Desventajas:**
- Comunicación más compleja
- Peor UX
- Mayor overhead

### Opción 3: Sistema de Templates + API
Los plugins solo definen templates y se comunican con el backend.

**Ventajas:**
- Más seguro
- Más simple
- Menos overhead

**Desventajas:**
- Menos flexible
- Limitado a templates predefinidos

## Siguiente Paso Recomendado

Implementar **Opción 1** con los siguientes pasos:

1. **Configurar el build del plugin para generar módulos remotos**
   ```typescript
   // vite.config.ts del plugin
   import federation from '@originjs/vite-plugin-federation'
   
   export default {
     plugins: [
       federation({
         name: 'task-manager',
         filename: 'remoteEntry.js',
         exposes: {
           './TaskList': './src/views/TaskList.vue',
           './TaskBoard': './src/views/TaskBoard.vue',
         }
       })
     ]
   }
   ```

2. **Modificar el frontend principal para cargar módulos remotos**
   ```typescript
   // En usePluginLoader.ts
   const loadPlugin = async (pluginId: string) => {
     const plugin = await getPluginInfo(pluginId)
     
     // Cargar el módulo remoto
     const remoteUrl = `${plugin.packageUrl}/remoteEntry.js`
     await loadRemoteModule(remoteUrl)
     
     // Importar componentes
     const TaskList = await import('task-manager/TaskList')
     
     // Registrar rutas
     router.addRoute({
       path: '/plugins/task-manager/tasks',
       component: TaskList
     })
   }
   ```

3. **Servir los plugins compilados desde un CDN o servidor estático**

## Estado de los Archivos

### Archivos Creados/Modificados
- ✅ `frontend/src/views/PluginView.vue` - Vista genérica para plugins
- ✅ `frontend/src/router/index.ts` - Rutas agregadas para plugins
- ✅ `frontend/src/main.ts` - Inicialización mejorada
- ✅ `frontend/src/components/Sidebar.vue` - Muestra plugins activos
- ✅ `frontend/src/composables/useWebSocket.ts` - Sincronización mejorada
- ✅ `publisher/backend/src/scripts/checkPlugins.ts` - Script de verificación
- ✅ `publisher/backend/src/scripts/publishTaskManager.ts` - Script de publicación

### Próximos Archivos a Crear
- `frontend/src/utils/pluginModuleLoader.ts` - Cargador de módulos remotos
- `publisher/backend/plugins/task-manager/vite.config.ts` - Config de build
- `frontend/vite.config.ts` - Actualizar con soporte de federación

## Testing

Para probar que todo funciona:

1. Asegúrate de que ambos backends estén corriendo:
   ```bash
   # Terminal 1 - Backend principal
   cd backend
   npm run dev
   
   # Terminal 2 - Publisher backend
   cd publisher/backend
   npm run dev
   ```

2. Verifica que el frontend esté corriendo:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navega a `/plugins/task-manager` y deberías ver la vista del plugin

## Notas

- El plugin Task Manager tiene todo el código frontend (componentes Vue, vistas, store)
- El código está en `publisher/backend/plugins/task-manager/frontend/`
- El manifest está correctamente configurado con rutas y componentes
- Solo falta el sistema de carga dinámica para que funcione completamente

