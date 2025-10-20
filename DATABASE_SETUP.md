# Plugin Marketplace - Arquitectura de Dos Bases de Datos

## 🗄️ Estructura de Bases de Datos

### Base de Datos 1: `plugin_marketplace` (Backend + Frontend)
```
🗄️ plugin_marketplace
├── 👥 users (usuarios finales y compradores)
├── 🔌 plugins (plugins públicos aprobados)
├── 💰 purchases (compras de usuarios)
├── ⭐ reviews (reseñas de usuarios)
├── 🔄 sessions (autenticación de usuarios)
└── 💳 transactions (transacciones de pagos)
```

### Base de Datos 2: `publisher_db` (Publisher - Independiente)
```
🗄️ publisher_db
├── 👨‍💻 publisher_users (desarrolladores y admins)
├── 🔧 publisher_plugins (plugins en desarrollo)
├── 📊 publisher_analytics (estadísticas privadas)
└── 🔄 publisher_sessions (sesiones de publisher)
```

## 🚀 Configuración

### Paso 1: Crear las dos bases de datos
```sql
-- Base de datos principal
CREATE DATABASE plugin_marketplace;

-- Base de datos del publisher (separada)
CREATE DATABASE publisher_db;
```

### Paso 2: Configurar Backend (plugin_marketplace)
```bash
cd backend
cp .env.example .env
# Editar .env:
DB_NAME=plugin_marketplace
```

### Paso 3: Configurar Publisher (publisher_db)
```bash
cd publisher
cp .env.example .env
# Editar .env:
DB_NAME=publisher_db
```

### Paso 4: Configurar Frontend
```bash
cd frontend
cp .env.example .env
# Editar .env:
VITE_API_URL=http://localhost:3000
```

## 🔄 Flujo de Datos

### 1. Desarrollo de Plugins (Publisher)
```
Developer crea plugin en Publisher → publisher_db
↓
Plugin se envía para aprobación → API Backend
↓
Si se aprueba → se publica en plugin_marketplace
```

### 2. Compra de Plugins (Frontend)
```
Usuario compra plugin → plugin_marketplace
↓
Transacción se registra → plugin_marketplace
↓
Estadísticas se actualizan → publisher_db (vía API)
```

## 🌐 Puertos y Acceso

| Servicio | Puerto | Base de Datos | Descripción |
|----------|--------|---------------|-------------|
| Backend API | 3000 | plugin_marketplace | API principal |
| Frontend | 3001 | plugin_marketplace | Tienda pública |
| Publisher | 3002 | publisher_db | Panel privado |

## 🔐 Ventajas de la Separación

✅ **Seguridad**: Datos de desarrolladores separados  
✅ **Autonomía**: Publisher funciona independientemente  
✅ **Escalabilidad**: Cada base de datos puede optimizarse por separado  
✅ **Privacidad**: Estadísticas y datos sensibles aislados  
✅ **Mantenimiento**: Actualizaciones sin afectar a usuarios finales  

## 🚀 Inicialización

```bash
# Inicializar base de datos principal
cd backend && npm run db:push

# Inicializar base de datos del publisher  
cd publisher && npm run db:push

# Iniciar todos los servicios
npm run dev:all
```

## 📊 Sincronización de Datos

Los plugins aprobados en Publisher se sincronizan automáticamente con la base de datos principal a través de la API del Backend.