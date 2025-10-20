# Plugin Marketplace - Backend con TypeORM y Neon PostgreSQL

¡Perfecto! He configurado el backend para usar **TypeORM + Neon PostgreSQL** con conexión única via DATABASE_URL. Aquí está la arquitectura correcta:

## 🏗️ Cambios Realizados

### 1. **Dependencias Actualizadas**
- ❌ Prisma + SQLite
- ✅ **TypeORM + Neon PostgreSQL**

### 2. **Entidades TypeORM Completas**
- `User` - Usuarios con roles (USER, DEVELOPER, ADMIN)
- `Plugin` - Plugins con estado (DRAFT, PENDING, APPROVED, REJECTED)
- `Purchase` - Compras con estados
- `Review` - Sistema de reseñas
- `Session` - Manejo de sesiones
- `PluginAnalytics` - Analíticas
- `Transaction` - Transacciones financieras

### 3. **Configuración Neon PostgreSQL**
```env
DATABASE_URL=postgresql://neondb_owner:npg_hnVE2jqZSHx7@ep-patient-pond-adixypv6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. **Características de Seguridad**
- 🔐 JWT con refresh tokens
- 🛡️ Rate limiting
- 🚫 Helmet para seguridad
- ✅ Validación de inputs
- 🔑 Password hashing con bcrypt

### 5. **API RESTful Completa**
```
POST /api/auth/register     - Registro
POST /api/auth/login        - Login
GET  /api/plugins           - Listar plugins
POST /api/plugins           - Crear plugin
GET  /api/users/:id         - Perfil de usuario
```

## 🚀 Para Iniciar

1. **Instalar dependencias**:
```bash
cd backend
npm install
```

2. **Configurar variables de entorno** en `.env`:
```bash
cp .env.example .env
# Editar .env con tu DATABASE_URL de Neon
```

3. **Iniciar servidor**:
```bash
npm run dev
```

## 📊 Ventajas de TypeORM + Neon PostgreSQL

- ✅ **Base de datos production-ready**
- ✅ **Relaciones complejas** soportadas
- ✅ **Migraciones automáticas**
- ✅ **Transacciones ACID**
- ✅ **Performance superior**
- ✅ **Escalabilidad horizontal**
- ✅ **Hosting gratuito** con Neon
- ✅ **SSL incluido** por defecto

## 🔗 Estructura del Proyecto

```
backend/
├── src/
│   ├── entities/         # Entidades TypeORM
│   ├── controllers/      # Lógica de la API
│   ├── routes/          # Definición de rutas
│   ├── middleware/      # Auth, validación, errores
│   ├── utils/           # Utilidades
│   ├── config/          # Configuración centralizada
│   └── index.ts         # Punto de entrada
├── .env                 # Variables de entorno (DATABASE_URL requerido)
├── .env.example         # Ejemplo de configuración
├── package.json         # Dependencias
└── tsconfig.json        # Config TypeScript
```

## ⚠️ Importante

- **DATABASE_URL es REQUERIDO** en todos los ambientes
- No se usan variables individuales (DB_HOST, DB_PORT, etc.)
- Solo se soporta conexión via DATABASE_URL
- Configuración optimizada para Neon PostgreSQL

Ahora tienes un backend robusto y production-ready con Neon PostgreSQL y TypeORM! 🎉