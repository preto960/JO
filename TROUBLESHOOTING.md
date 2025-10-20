# Database Setup & Troubleshooting

## 🔧 Solución de Problemas Comunes

### ❌ Error: `ECONNREFUSED ::1:5432`

**Problema:** PostgreSQL no está corriendo o no es accesible.

**Soluciones:**

#### Opción 1: Iniciar PostgreSQL (Windows)
```bash
# Buscar Services en Windows
# Buscar "postgresql-x64-XX" donde XX es tu versión
# Click derecho → Start
```

#### Opción 2: Iniciar PostgreSQL (Mac)
```bash
# Usar Homebrew
brew services start postgresql

# O usar Postgres.app
# Abrir Postgres.app y iniciar el servidor
```

#### Opción 3: Iniciar PostgreSQL (Linux)
```bash
# Ubuntu/Debian
sudo service postgresql start

# O
sudo systemctl start postgresql
```

#### Opción 4: Verificar conexión
```bash
# Verificar si PostgreSQL está corriendo
pg_isready

# Conectarse directamente
psql -U postgres -h localhost
```

### ❌ Error: `"ts-node" no se reconoce como un comando`

**Problema:** Falta la dependencia `ts-node`.

**Solución:**
```bash
cd publisher
npm install ts-node --save-dev
```

## 🚀 Configuración Rápida

### Paso 1: Verificar PostgreSQL
```bash
# Verificar si PostgreSQL está corriendo
pg_isready

# Si no está corriendo, iniciarlo:
# Windows: Iniciar servicio desde Services
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Paso 2: Crear Bases de Datos
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear las dos bases de datos
CREATE DATABASE plugin_marketplace;
CREATE DATABASE publisher_db;

# Salir
\q
```

### Paso 3: Configurar Variables de Entorno

#### Backend/.env
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/plugin_marketplace
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=plugin_marketplace
```

#### Publisher/.env
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/publisher_db
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=publisher_db
```

### Paso 4: Instalar Dependencias Faltantes
```bash
# Para el publisher
cd publisher
npm install ts-node typeorm --save-dev

# Para el backend (si falta algo)
cd ../backend
npm install
```

### Paso 5: Resetear Bases de Datos
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

## 🔍 Verificación Final

### Verificar conexión del Backend
```bash
cd backend
npm run db:reset
# Debería mostrar: ✅ Database reset completed successfully!
```

### Verificar conexión del Publisher
```bash
cd publisher
npm run db:reset
# Debería mostrar: ✅ Publisher database reset completed successfully!
```

## 🌐 Para Vercel Storage

Si usas Vercel Storage en producción, cambia los .env:

#### Backend/.env
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/plugin_marketplace?sslmode=require
```

#### Publisher/.env
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/publisher_db?sslmode=require
```

## 🆘 Si Sigue Fallando

1. **Reinstalar PostgreSQL** completamente
2. **Verificar puerto** (por defecto 5432)
3. **Verificar firewall** no bloquee el puerto
4. **Revisar logs** de PostgreSQL
5. **Probar con DBeaver** o pgAdmin para conectar

## 📞 Logs Útiles

```bash
# Ver logs de PostgreSQL (Linux)
sudo tail -f /var/log/postgresql/postgresql-XX-main.log

# Verificar conexiones activas
psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```