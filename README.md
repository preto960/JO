# Plugin Marketplace - Monorepo with TypeORM + PostgreSQL

Este es un monorepo con 3 proyectos Vercel separados para un marketplace de plugins completo.

## 📁 Estructura del Proyecto

```
plugin-marketplace/
├── backend/          # Express + TypeORM + PostgreSQL (Puerto 3000)
├── frontend/         # Vue.js Marketplace (Puerto 3001)
├── publisher/        # Publisher Dashboard (Puerto 3002)
├── package.json      # Root para manejar todos los proyectos
└── README.md         # Esta documentación
```

## 🎯 Tecnologías por Proyecto

### Backend (Express + TypeORM)
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: Helmet, rate limiting

### Frontend (Vue.js)
- **Framework**: Vue 3 + TypeScript
- **State**: Pinia
- **Routing**: Vue Router
- **UI**: Tailwind CSS
- **HTTP**: Axios

### Publisher (Express + Vue.js)
- **Backend**: Express.js
- **Frontend**: Vue 3 + TypeScript
- **Proxy**: Al backend API
- **Charts**: Chart.js

## 🚀 Comandos de Desarrollo

```bash
# Instalar dependencias en todos los proyectos
npm run install:all

# Desarrollo simultáneo
npm run dev:all

# Desarrollo individual
npm run dev:backend     # Puerto 3000
npm run dev:frontend    # Puerto 3001
npm run dev:publisher   # Puerto 3002

# Build de todos
npm run build:all

# Base de datos (Backend)
npm run db:push         # Sincronizar schema
npm run db:studio       # Prisma Studio (si se necesita)
```

## 🗄️ Configuración de Base de Datos

### PostgreSQL (Requerido)
```sql
-- Crear base de datos
CREATE DATABASE plugin_marketplace;

-- Crear usuario (opcional)
CREATE USER plugin_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE plugin_marketplace TO plugin_user;
```

### Variables de Entorno (Backend/.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/plugin_marketplace
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=plugin_marketplace

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3001
PUBLISHER_URL=http://localhost:3002

NODE_ENV=development
PORT=3000
```

## 🌐 Deploy a Vercel

Cada proyecto se deploya independientemente:

### 1. Backend
- Conectar carpeta `backend/` a Vercel
- Configurar variables de entorno
- Database URL de PostgreSQL (Vercel Postgres o externa)

### 2. Frontend  
- Conectar carpeta `frontend/` a Vercel
- Configurar `VITE_API_URL` al backend deployado

### 3. Publisher
- Conectar carpeta `publisher/` a Vercel
- Configurar `BACKEND_URL` al backend deployado

## 📊 Diagrama de Arquitectura

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │  Publisher  │    │   Backend   │
│   (Vue.js)  │    │ (Vue+Exp)   │ │ (Express)    │
│   Port 3001 │    │ Port 3002   │ │  Port 3000   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                   ┌─────────────┐
                   │ PostgreSQL  │
                   │ Database    │
                   └─────────────┘
```

## 🔐 Flujo de Autenticación

1. **Registro/Login** → Backend genera JWT
2. **Frontend/Publisher** → Almacenan token
3. **Requests API** → Incluyen token en headers
4. **Backend** → Valida token y responde

## 📋 Features Principales

### ✅ Usuarios
- Registro/Login con roles (USER, DEVELOPER, ADMIN)
- Perfiles de usuario
- Actualización de datos

### ✅ Plugins
- Creación de plugins (DEVELOPER)
- Aprobación de plugins (ADMIN)
- Búsqueda y filtrado
- Sistema de categorías

### ✅ Compras
- Proceso de compra
- Historial de compras
- Descarga de plugins

### ✅ Reseñas
- Sistema de calificación (1-5 estrellas)
- Comentarios de usuarios
- Promedio de calificaciones

### ✅ Analytics
- Estadísticas de descargas
- Revenue tracking
- Dashboard para desarrolladores

## 🛠️ Desarrollo Local

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- Git

### Pasos
1. **Clonar repositorio**
2. **Configurar PostgreSQL**
3. **Instalar dependencias**: `npm run install:all`
4. **Configurar variables de entorno**
5. **Iniciar desarrollo**: `npm run dev:all`

## 📝 Notas Importantes

- Cada proyecto es **independiente** y puede ser deployado por separado
- El backend usa **TypeORM + PostgreSQL** para producción
- Los frontend usan **Vue 3 Composition API**
- El publisher es una **aplicación híbrida** (Express + Vue.js)
- Todos los proyectos comparten la misma base de datos

## 🚀 Próximos Pasos

1. Configurar base de datos PostgreSQL
2. Instalar dependencias
3. Probar localmente
4. Deploy a Vercel
5. Configurar dominios personalizados
6. Setup de pagos (Stripe/PayPal)