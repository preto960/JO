# Vercel Neon Database Setup Guide

## 🔗 Configuración para Vercel Neon (Producción)

### ✅ Paso 1: Configurar Variables de Entorno

#### Backend/.env
```env
DATABASE_URL=postgresql://neondb_owner:npg_ESYAXUF7e2Zi@ep-square-lab-adgrv8z5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

#### Publisher/.env
```env
DATABASE_URL=postgresql://neondb_owner:npg_aVtz8XDqp0dM@ep-fancy-brook-adv46l3f-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=development
JWT_SECRET=your-super-secret-publisher-jwt-key-change-this-in-production
PORT=3002
```

### ✅ Paso 2: Instalar Dependencias Faltantes

```bash
# Para el publisher
cd publisher
npm install @types/node --save-dev

# Para ambos proyectos (si falta algo)
npm install
```

### ✅ Paso 3: Probar Conexión

#### Backend
```bash
cd backend
npm run db:reset
```

**Salida esperada:**
```
🔗 DATABASE_URL found: YES
🔗 NODE_ENV: development
🌐 Using DATABASE_URL configuration
🔄 Connecting to database...
✅ Database reset completed successfully!
```

#### Publisher
```bash
cd publisher
npm run db:reset
```

**Salida esperada:**
```
🔗 DATABASE_URL found: YES
🔗 NODE_ENV: development
🌐 Using DATABASE_URL configuration
🔄 Connecting to publisher database...
✅ Publisher database reset completed successfully!
```

## 🔍 Diagnóstico de Problemas

### ❌ Si sigue mostrando "localhost:5432"

**Problema:** No está leyendo el .env correctamente.

**Solución:**
1. Verificar que el archivo .env esté en la carpeta correcta
2. Verificar que no haya espacios en blanco
3. Reiniciar la terminal

```bash
# Verificar que el .env existe
ls -la .env

# Verificar contenido
cat .env

# Reiniciar terminal y probar de nuevo
```

### ❌ Error de SSL

**Problema:** Neon requiere SSL.

**Solución:** Ya está configurado en los archivos database.ts con:
```typescript
ssl: { rejectUnauthorized: false }
```

### ❌ Error de tipos en Publisher

**Problema:** TypeScript no reconoce tipos de Node.

**Solución:**
```bash
cd publisher
npm install @types/node --save-dev
```

## 🌐 Verificación de Bases de Datos en Neon

1. **Ve a tu dashboard de Neon**
2. **Verifica las dos bases de datos:**
   - `neondb` (para backend)
   - `neondb` (para publisher) - misma DB, diferente esquema

3. **Verifica tablas creadas:**
   - Backend: users, plugins, sessions, purchases, reviews, plugin_analytics, transactions
   - Publisher: publisher_users, publisher_plugins, publisher_sessions, publisher_analytics

## 🚀 Comandos Finales

```bash
# Resetear backend
cd backend
npm run db:reset

# Resetear publisher
cd ../publisher
npm run db:reset

# O desde la raíz
npm run db:reset:all
```

## ✅ Checklist Final

- [ ] DATABASE_URL configurada en backend/.env
- [ ] DATABASE_URL configurada en publisher/.env
- [ ] @types/node instalado en publisher
- [ ] NODE_ENV=development en ambos .env
- [ ] SSL configurado (ya está en el código)
- [ ] Probar `npm run db:reset` en ambos proyectos

## 🎯 Éxito Esperado

Ambos comandos deberían mostrar:
```
🔗 DATABASE_URL found: YES
🌐 Using DATABASE_URL configuration
✅ Database reset completed successfully!
🎯 Database is ready for use!
```