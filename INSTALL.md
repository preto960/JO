# Plugin Marketplace - Instrucciones de Instalación

## 🚀 Instalación

### Opción 1: Instalar todo por separado (Recomendado)
```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install

# Publisher
cd ../publisher
npm install

# Volver a la raíz
cd ..
```

### Opción 2: Instalar todo junto (con dependencias de orquestación)
```bash
npm run setup
```

### Opción 3: Instalar solo los proyectos (sin node_modules en raíz)
```bash
npm run install:projects
```

## 🌐 Iniciar Servicios

### Iniciar todo junto (requiere setup previo)
```bash
npm run dev:all
```

### Iniciar por separado
```bash
npm run dev:backend    # Puerto 3000
npm run dev:frontend   # Puerto 3001  
npm run dev:publisher  # Puerto 3002
```

## 📁 Estructura
```
JO/
├── backend/     ← node_modules aquí ✅
├── frontend/    ← node_modules aquí ✅
├── publisher/   ← node_modules aquí ✅
└── package.json ← Orquestador (sin node_modules si usas install:projects)
```

## ⚠️ Importante
- Usa `npm run install:projects` para evitar node_modules en la raíz
- Usa `npm run setup` si quieres usar `npm run dev:all`
- Cada proyecto funciona independientemente