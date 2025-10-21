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
- **Usa los puertos configurados en el .env**

### 2. Configuración de Puertos (CORREGIDA)
- **Backend**: Puerto 3002 (según .env)
- **Frontend**: Puerto 3003 (sin cambios)
- **Proxy**: Configurado para redirigir `/api` a `http://localhost:3002`

### 3. Scripts Mejorados (Multiplataforma)
- `npm run server-mock`: Inicia el servidor mock
- `npm run dev`: Inicia ambos servicios con wait-on (compatible Windows/Linux)
- `npm run client-delayed`: Inicia frontend cuando backend esté listo

## 🎯 Uso Rápido

### Opción 1: Automático (Recomendado)
```bash
cd /home/z/my-project/publisher
npm run dev
```

### Opción 2: Scripts por Sistema Operativo

**Windows:**
```bash
# Doble clic en el archivo o ejecutar en cmd:
start-windows.bat
```

**Linux/Mac:**
```bash
chmod +x start-linux.sh
./start-linux.sh
```

### Opción 3: Por Separado
```bash
# Terminal 1 - Backend
npm run server-mock

# Terminal 2 - Frontend (después de 5 segundos)
npm run client
```

## 🌐 Acceso

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:3002
- **Health Check**: http://localhost:3002/api/health

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
4. **Puertos del .env**: Se respeta la configuración del archivo .env

## 🔄 Volver a Base de Datos Real

Cuando quieras usar la base de datos Neon real:

1. Detener los servicios actuales
2. Ejecutar: `npm run server` (en lugar de `server-mock`)

## 🛠️ Características Funcionales

- ✅ Login y registro funcionales
- ✅ Gestión de plugins completa
- ✅ Dashboard con estadísticas
- ✅ Sistema de notificaciones Toast
- ✅ Navegación entre vistas
- ✅ Diseño responsivo con Tailwind CSS
- ✅ Compatible con Windows y Linux

El proyecto está completamente funcional para desarrollo y pruebas.