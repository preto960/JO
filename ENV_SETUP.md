# Plugin Marketplace - Configuración de Variables de Entorno

## 🗄️ Configuración de Bases de Datos

### Opción 1: Vercel Storage (Producción) - RECOMENDADO
Usa una sola variable `DATABASE_URL` que Vercel te proporciona:

```env
# Backend/.env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Publisher/.env  
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### Opción 2: Desarrollo Local
Usa variables separadas solo para desarrollo:

```env
# Para desarrollo local (opcional)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=plugin_marketplace
```

## 📋 Formato de Vercel Storage URL

Vercel te proporcionará una URL como esta:
```
postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

## 🚀 Configuración por Proyecto

### Backend (plugin_marketplace DB)
```bash
cd backend
cp .env.example .env
# Editar .env con tu DATABASE_URL de Vercel
```

### Publisher (publisher_db DB)  
```bash
cd publisher
cp .env.example .env
# Editar .env con tu DATABASE_URL de Vercel (diferente DB)
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Editar VITE_API_URL con la URL de tu backend en Vercel
```

## 🔧 Configuración Automática

Los archivos `database.ts` están configurados para:
1. **Usar DATABASE_URL** si está disponible (Vercel)
2. **Usar variables separadas** si no hay DATABASE_URL (local)

## 🌐 Despliegue en Vercel

1. **Backend**: Despliega con su DATABASE_URL
2. **Publisher**: Despliega con su DATABASE_URL (diferente)
3. **Frontend**: Despliega apuntando al backend URL

## ✅ Ventajas

- ✅ **Simple**: Solo una variable para configurar
- ✅ **Flexible**: Funciona en local y producción
- ✅ **Seguro**: SSL automático con Vercel Storage
- ✅ **Compatible**: TypeORM soporta DATABASE_URL directamente