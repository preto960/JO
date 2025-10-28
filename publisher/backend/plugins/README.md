# 📦 Plugins Directory

Este directorio es donde los developers colocan sus plugins para desarrollo y publicación.

## 🚀 Cómo usar

### 1. Crear un nuevo plugin

Crea una carpeta con el nombre de tu plugin (en kebab-case):

```bash
mkdir plugins/my-awesome-plugin
cd plugins/my-awesome-plugin
```

### 2. Estructura del plugin

```
my-awesome-plugin/
├── manifest.json          # Configuración del plugin (REQUERIDO)
├── package.json          # Dependencias y scripts (opcional)
├── tsconfig.json         # Configuración TypeScript (opcional)
├── frontend/             # Código frontend (Vue)
│   ├── components/
│   ├── views/
│   ├── store/
│   └── index.ts
├── backend/              # Código backend (Express)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── index.ts
└── README.md            # Documentación
```

### 3. Crear manifest.json

```json
{
  "name": "My Awesome Plugin",
  "version": "1.0.0",
  "slug": "my-awesome-plugin",
  "description": "Una breve descripción",
  "longDescription": "Descripción detallada del plugin",
  "author": "Tu Nombre",
  "category": "PRODUCTIVITY",
  
  "frontend": {
    "entry": "frontend/index.ts",
    "routes": [
      {
        "path": "/my-feature",
        "name": "MyFeature",
        "component": "views/MyView.vue",
        "meta": {
          "title": "My Feature",
          "requiresAuth": true
        }
      }
    ],
    "components": {
      "MyWidget": "components/MyWidget.vue"
    }
  },
  
  "backend": {
    "entry": "backend/index.ts",
    "routes": "backend/routes/index.ts",
    "models": ["backend/models/MyModel.ts"]
  },
  
  "permissions": [
    "read:data",
    "write:data"
  ],
  
  "settings": [
    {
      "key": "apiKey",
      "label": "API Key",
      "type": "text",
      "required": true
    }
  ]
}
```

### 4. Desarrollo

El Publisher detectará automáticamente tu plugin y podrás:

1. **Ver el plugin** en la lista de plugins locales
2. **Validar** el manifest y estructura
3. **Build** automático (TypeScript → JavaScript)
4. **Empaquetar** a .zip automáticamente
5. **Publicar** con un clic

### 5. API Endpoints

Una vez que el plugin esté aquí, puedes usar estos endpoints:

```bash
# Listar todos los plugins locales
GET /api/local-plugins

# Ver detalles de un plugin
GET /api/local-plugins/my-awesome-plugin

# Construir el plugin
POST /api/local-plugins/my-awesome-plugin/build

# Construir y publicar en un paso
POST /api/local-plugins/my-awesome-plugin/build-and-publish

# Construir para sandbox (testing)
POST /api/local-plugins/my-awesome-plugin/sandbox
```

### 6. Flujo de trabajo

```
1. Crear plugin en /plugins/my-plugin/
2. Desarrollar (TypeScript, Vue, etc.)
3. El Publisher detecta automáticamente
4. Validar manifest
5. Build & Publish con un clic
6. Plugin disponible en el marketplace
```

## ✅ Validación automática

El sistema valida:

- ✅ manifest.json existe y es válido
- ✅ Campos requeridos presentes
- ✅ Versión en formato semántico (1.0.0)
- ✅ Slug en formato correcto (kebab-case)
- ✅ Estructura de archivos correcta

## 📝 Ejemplo completo

Ver el plugin de ejemplo en: `plugins/task-manager/`

## 🔧 TypeScript

Si usas TypeScript:

1. Crea `tsconfig.json` en tu plugin
2. El build compilará automáticamente
3. Los archivos .js se incluirán en el .zip

## 📦 Dependencias

Si tu plugin tiene dependencias:

1. Crea `package.json`
2. Ejecuta `npm install` en tu plugin
3. El build instalará dependencias de producción automáticamente

## 🚀 Publicación

El proceso de publicación:

1. Build del código TypeScript
2. Instalación de dependencias
3. Empaquetado a .zip
4. Upload a Vercel Blob
5. Creación/actualización en la base de datos
6. Plugin disponible para instalación

## 🐛 Debugging

Si hay errores:

- Revisa la consola del Publisher Backend
- Verifica que el manifest.json sea válido
- Asegúrate de que todos los archivos referenciados existan
- Usa el endpoint `/api/local-plugins/:slug` para ver detalles

## 📚 Documentación completa

Ver: `/frontend/docs/PLUGIN_DEVELOPMENT.md`


