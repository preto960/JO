# Sistema de Plugins Dinámicos - Implementación Completa

## ✅ Componentes Implementados

### Backend

1. **PluginLoaderService** (`backend/src/services/pluginLoaderService.ts`)
   - Descarga plugins desde packageUrl (Vercel Blob)
   - Extrae archivos ZIP
   - Carga módulos JavaScript dinámicamente
   - Ejecuta hooks de lifecycle

2. **PluginDatabaseService** (`backend/src/services/pluginDatabaseService.ts`)
   - Crea tablas de base de datos para plugins
   - Implementación específica para Task Manager
   - Inserta datos iniciales (categorías y tarea de ejemplo)

3. **PluginLifecycleService** (Actualizado)
   - Integrado con PluginLoaderService
   - Ejecuta hooks reales del plugin
   - Maneja ciclo de vida completo

4. **PluginAssetsRoutes** (`backend/src/routes/pluginAssets.ts`)
   - Sirve archivos estáticos de plugins
   - Endpoint: `/api/plugin-assets/:pluginSlug/*`
   - Soporte para JS, CSS, imágenes, fuentes

5. **PluginInstallationService** (Actualizado)
   - Proceso completo de instalación:
     1. Descarga y extrae plugin
     2. Crea tablas en base de datos
     3. Ejecuta hooks onInstall y onActivate
     4. Notifica vía WebSocket

### Frontend

1. **PluginView.vue** (`frontend/src/views/PluginView.vue`)
   - Vista genérica para plugins instalados
   - Muestra información del plugin
   - Lista features disponibles
   - Placeholder para carga dinámica

2. **Rutas Dinámicas**
   - `/plugins/:slug` - Vista principal del plugin
   - `/plugins/:slug/:subpath` - Sub-rutas del plugin

3. **Sidebar Actualizado**
   - Muestra plugins activos
   - Links directos a cada plugin

## 🔧 Cómo Funciona

### Proceso de Instalación

```
1. Usuario hace click en "Install" en el marketplace
   ↓
2. Frontend llama POST /api/installed-plugins/install
   ↓
3. Backend obtiene info del plugin desde Publisher
   ↓
4. PluginLoaderService descarga el ZIP desde packageUrl
   ↓
5. Extrae archivos a plugins-runtime/{slug}/
   ↓
6. PluginDatabaseService crea las tablas
   ↓
7. Ejecuta hook onInstall del plugin
   ↓
8. Ejecuta hook onActivate
   ↓
9. WebSocket notifica al frontend
   ↓
10. Frontend recarga la lista de plugins
```

### Tablas Creadas para Task Manager

```sql
-- Categorías de tareas
CREATE TABLE plugin_task_categories (
  id uuid PRIMARY KEY,
  name varchar NOT NULL,
  description varchar,
  color varchar DEFAULT '#3B82F6',
  icon varchar,
  position integer DEFAULT 0,
  isActive boolean DEFAULT true,
  createdAt timestamp DEFAULT now(),
  updatedAt timestamp DEFAULT now()
);

-- Tareas
CREATE TABLE plugin_tasks (
  id uuid PRIMARY KEY,
  title varchar NOT NULL,
  description text,
  status varchar DEFAULT 'TODO',
  priority varchar DEFAULT 'MEDIUM',
  categoryId uuid REFERENCES plugin_task_categories(id),
  assignedToId varchar,
  createdById varchar,
  dueDate timestamp,
  startDate timestamp,
  completedAt timestamp,
  estimatedHours integer DEFAULT 0,
  actualHours integer DEFAULT 0,
  tags text,
  position integer DEFAULT 0,
  isArchived boolean DEFAULT false,
  createdAt timestamp DEFAULT now(),
  updatedAt timestamp DEFAULT now()
);
```

### Datos Iniciales Insertados

- 4 categorías por defecto: Personal, Work, Urgent, Ideas
- 1 tarea de bienvenida en la categoría Personal

## 🚀 Pasos para Probar

### 1. Instalar Dependencias

```bash
# Backend principal
cd backend
npm install

# Publisher backend
cd ../publisher/backend
npm install
```

### 2. Compilar Backend

```bash
cd backend
npm run build
```

### 3. Iniciar Servicios

```bash
# Terminal 1 - Backend principal
cd backend
npm run dev

# Terminal 2 - Publisher backend
cd publisher/backend
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 4. Verificar Plugin en Publisher

El plugin task-manager ya está empaquetado en:
```
publisher/backend/dist-plugins/task-manager-1.0.0.zip
```

Para verificar que está publicado en la base de datos:
```bash
cd publisher/backend
npm run build
node dist/scripts/checkPlugins.js
```

Si no aparece, publicarlo:
```bash
node dist/scripts/publishTaskManager.js
```

### 5. Instalar Plugin desde el Frontend

1. Login en el frontend (http://localhost:3002)
2. Ir a "Plugin Market"
3. Buscar "Task Manager"
4. Click en "Install"
5. Esperar a que se complete la instalación
6. Verificar que aparece en el sidebar

### 6. Verificar Tablas en la Base de Datos

```sql
-- Verificar que las tablas fueron creadas
SELECT * FROM plugin_task_categories;
SELECT * FROM plugin_tasks;

-- Deberías ver:
-- - 4 categorías (Personal, Work, Urgent, Ideas)
-- - 1 tarea de bienvenida
```

### 7. Acceder al Plugin

1. Click en "Task Manager" en el sidebar
2. Deberías ver la vista del plugin con:
   - Información del plugin
   - Estado "Active"
   - Features disponibles (Tasks, Task Board, Calendar)
   - Mensaje indicando que la UI dinámica está en desarrollo

## 📊 Logs a Observar

### Durante la Instalación

```
📦 Downloading plugin Task Manager from https://...
📂 Extracting plugin Task Manager
✅ Plugin Task Manager extracted to .../plugins-runtime/task-manager
🗄️  Creating database tables for plugin Task Manager
  ✓ Creating table: plugin_task_categories
    ✓ Table plugin_task_categories created
    ✓ Default categories inserted
  ✓ Creating table: plugin_tasks
    ✓ Table plugin_tasks created
    ✓ Indexes created
    ✓ Sample task inserted
✅ Task Manager tables created successfully
🔧 Executing onInstall hook for Task Manager
📋 Task Manager Plugin: Installing...
✅ Task Manager Plugin: Installed successfully
✅ Database tables created
✅ Default categories and sample task inserted
```

## 🎯 Estado Actual

### ✅ Completado

- [x] Sistema de extracción y carga de plugins
- [x] Ejecución de hooks del backend
- [x] Creación automática de tablas
- [x] Inserción de datos iniciales
- [x] Endpoint para servir assets de plugins
- [x] Vista genérica de plugins en frontend
- [x] Integración con WebSocket
- [x] Notificaciones de instalación/desinstalación

### ⚠️ Pendiente (Fase 2)

- [ ] Carga dinámica de componentes Vue en el frontend
- [ ] Sistema de Module Federation o similar
- [ ] Hot reload de componentes de plugins
- [ ] Registro dinámico de rutas de plugins
- [ ] API proxy para llamadas del plugin al backend

## 🔮 Próximos Pasos

Para completar la carga dinámica de componentes Vue:

1. **Opción A: Module Federation**
   - Configurar Vite con `@originjs/vite-plugin-federation`
   - Compilar plugins como módulos remotos
   - Cargar módulos en runtime

2. **Opción B: Dynamic Imports**
   - Servir componentes Vue compilados
   - Usar `defineAsyncComponent` para cargar dinámicamente
   - Registrar rutas con componentes async

3. **Opción C: iframe Sandbox**
   - Cada plugin corre en un iframe
   - Comunicación vía postMessage
   - Mayor aislamiento y seguridad

## 📝 Notas Importantes

1. **Seguridad**: Los plugins se ejecutan con acceso completo a la base de datos. En producción, implementar sandboxing.

2. **Permisos**: El manifest define permisos pero no están siendo validados aún.

3. **Actualizaciones**: El sistema de actualización está implementado pero no probado completamente.

4. **Rollback**: Existe un sistema de backup y rollback para actualizaciones fallidas.

5. **Limpieza**: Al desinstalar, se eliminan las tablas y archivos del plugin.

## 🐛 Troubleshooting

### Plugin no se instala

- Verificar que el packageUrl es accesible
- Revisar logs del backend para errores de descarga
- Verificar permisos de escritura en `plugins-runtime/`

### Tablas no se crean

- Verificar conexión a la base de datos
- Revisar que el usuario de DB tiene permisos CREATE TABLE
- Verificar logs de `pluginDatabaseService`

### Plugin no aparece en el sidebar

- Verificar que `isActive` es `true`
- Hacer refresh del frontend
- Verificar que el WebSocket está conectado

## 📚 Archivos Clave

- `backend/src/services/pluginLoaderService.ts` - Carga de plugins
- `backend/src/services/pluginDatabaseService.ts` - Manejo de BD
- `backend/src/services/pluginLifecycleService.ts` - Lifecycle
- `backend/src/services/pluginInstallationService.ts` - Instalación
- `backend/src/routes/pluginAssets.ts` - Servir assets
- `frontend/src/views/PluginView.vue` - Vista de plugin
- `publisher/backend/plugins/task-manager/` - Plugin de ejemplo

