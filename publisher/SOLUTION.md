# Publisher Dashboard - Solución de Errores de Conexión

## 🚨 Problema Resuelto

El proyecto presentaba errores de conexión entre el frontend (Vite) y el backend (Express API), específicamente:
```
[vite] http proxy error: /api/plugins
AggregateError
    at internalConnectMultiple (node:net:1114:18)
```

## ✅ Solución Implementada

### 1. Servidor Mock (Temporal)
Se ha creado un servidor mock en `src/server-mock.ts` que:
- Funciona sin base de datos (evita problemas de conexión a Neon)
- Proporciona todas las rutas necesarias con datos simulados
- Responde inmediatamente sin tiempos de espera largos

### 2. Configuración de Puertos
- **Backend**: Puerto 3005 (en lugar de 3002 para evitar conflictos)
- **Frontend**: Puerto 3003 (sin cambios)
- **Proxy**: Configurado para redirigir `/api` a `http://localhost:3005`

### 3. Scripts Mejorados
- `npm run server-mock`: Inicia el servidor mock
- `npm run dev`: Inicia ambos servicios con sincronización
- `./start.sh`: Script completo de inicio con verificación

## 🎯 Uso Rápido

### Opción 1: Script Automático (Recomendado)
```bash
cd /home/z/my-project/publisher
./start.sh
```

### Opción 2: Manual
```bash
cd /home/z/my-project/publisher
npm run dev
```

### Opción 3: Por Separado
```bash
# Terminal 1 - Backend
npm run server-mock

# Terminal 2 - Frontend
npm run client
```

## 🌐 Acceso

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:3005
- **Health Check**: http://localhost:3005/api/health

## 🔧 Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/register` - Registro de usuario

### Plugins
- `GET /api/plugins` - Listar plugins
- `POST /api/plugins` - Crear plugin
- `PUT /api/plugins/:id` - Actualizar plugin
- `DELETE /api/plugins/:id` - Eliminar plugin

### Analytics
- `GET /api/analytics/overview` - Estadísticas generales
- `GET /api/analytics/performance` - Datos de rendimiento

## 📝 Notas Importantes

1. **Datos Simulados**: El servidor mock usa datos falsos para desarrollo
2. **Sin Persistencia**: Los cambios no se guardan en base de datos
3. **Para Producción**: Usar `npm run server` para conectar con la base de datos real

## 🔄 Volver a Base de Datos Real

Cuando quieras usar la base de datos Neon real:

1. Detener los servicios actuales
2. Ejecutar: `npm run server` (en lugar de `server-mock`)
3. Actualizar el proxy en `vite.config.ts` al puerto 3002

## 🛠️ Características Funcionales

- ✅ Login y registro funcionales
- ✅ Gestión de plugins completa
- ✅ Dashboard con estadísticas
- ✅ Sistema de notificaciones Toast
- ✅ Navegación entre vistas
- ✅ Diseño responsivo con Tailwind CSS

El proyecto está completamente funcional para desarrollo y pruebas del frontend.