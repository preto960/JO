# Database Reset Commands

## 🗄️ Comandos para Resetear Bases de Datos

### Desde la raíz del proyecto (Monorepo)

```bash
# Resetear base de datos del Backend
npm run db:reset:backend

# Resetear base de datos del Publisher  
npm run db:reset:publisher

# Resetear ambas bases de datos
npm run db:reset:all
```

### Desde cada proyecto individualmente

#### Backend (plugin_marketplace DB)
```bash
cd backend
npm run db:reset
```

**Tablas que se eliminarán y recrearán:**
- ✅ users (usuarios y compradores)
- ✅ plugins (plugins públicos)
- ✅ sessions (sesiones de usuarios)
- ✅ purchases (compras)
- ✅ reviews (reseñas)
- ✅ plugin_analytics (analíticas públicas)
- ✅ transactions (transacciones)

#### Publisher (publisher_db DB)
```bash
cd publisher
npm run db:reset
```

**Tablas que se eliminarán y recrearán:**
- ✅ publisher_users (desarrolladores)
- ✅ publisher_plugins (plugins en gestión)
- ✅ publisher_sessions (sesiones de publisher)
- ✅ publisher_analytics (analíticas privadas)

## ⚠️ Advertencias Importantes

- 🚨 **ESTE COMANDO BORRARÁ TODOS LOS DATOS**
- 🚨 **No hay forma de recuperar los datos después del reset**
- 🚨 **Usar solo en desarrollo o para limpiar la base de datos**

## 🔄 Flujo de Reset Completo

```bash
# 1. Parar todos los servicios si están corriendo
# Ctrl+C en cada terminal

# 2. Resetear bases de datos
npm run db:reset:all

# 3. Iniciar servicios nuevamente
npm run dev:all
```

## 📋 Salida Esperada

### Backend Reset Output:
```
🔄 Connecting to database...
⚠️  WARNING: This will drop all tables and recreate them!
📋 Tables to be dropped:
   - users
   - plugins
   - sessions
   - purchases
   - reviews
   - plugin_analytics
   - transactions

🗑️  Dropping all tables...
🏗️  Creating tables from entities...

✅ Database reset completed successfully!
📊 New tables created:
   ✅ users
   ✅ plugins
   ✅ sessions
   ✅ purchases
   ✅ reviews
   ✅ plugin_analytics
   ✅ transactions

🎯 Backend database is ready for use!
```

### Publisher Reset Output:
```
🔄 Connecting to publisher database...
⚠️  WARNING: This will drop all publisher tables and recreate them!
📋 Publisher tables to be dropped:
   - publisher_users
   - publisher_plugins
   - publisher_sessions
   - publisher_analytics

🗑️  Dropping all publisher tables...
🏗️  Creating publisher tables from entities...

✅ Publisher database reset completed successfully!
📊 New publisher tables created:
   ✅ publisher_users
   ✅ publisher_plugins
   ✅ publisher_sessions
   ✅ publisher_analytics

🎯 Publisher database is ready for use!
```

## 🛡️ Seguridad

- Los scripts solo funcionan si las variables de entorno están configuradas correctamente
- Se requiere confirmación implícita al ejecutar el comando
- Los scripts se conectan a las bases de datos especificadas en los .env files

## 🚀 Uso Recomendado

1. **Durante desarrollo**: Resetear las DBs cuando cambies las entidades
2. **Antes de pruebas**: Limpiar las DBs para empezar desde cero
3. **Solución de problemas**: Resetear si hay corrupción de datos