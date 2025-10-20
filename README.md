<<<<<<< HEAD
# 🚀 Welcome to Z.ai Code Scaffold

A modern, production-ready web application scaffold powered by cutting-edge technologies, designed to accelerate your development with [Z.ai](https://chat.z.ai)'s AI-powered coding assistance.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Why This Scaffold?

- **🏎️ Fast Development** - Pre-configured tooling and best practices
- **🎨 Beautiful UI** - Complete shadcn/ui component library with advanced interactions
- **🔒 Type Safety** - Full TypeScript configuration with Zod validation
- **📱 Responsive** - Mobile-first design principles with smooth animations
- **🗄️ Database Ready** - Prisma ORM configured for rapid backend development
- **🔐 Auth Included** - NextAuth.js for secure authentication flows
- **📊 Data Visualization** - Charts, tables, and drag-and-drop functionality
- **🌍 i18n Ready** - Multi-language support with Next Intl
- **🚀 Production Ready** - Optimized build and deployment settings
- **🤖 AI-Friendly** - Structured codebase perfect for AI assistance

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🤝 Get Started with Z.ai

1. **Clone this scaffold** to jumpstart your project
2. **Visit [chat.z.ai](https://chat.z.ai)** to access your AI coding assistant
3. **Start building** with intelligent code generation and assistance
4. **Deploy with confidence** using the production-ready setup

---

Built with ❤️ for the developer community. Supercharged by [Z.ai](https://chat.z.ai) 🚀
=======
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
>>>>>>> 4b64638250d20d80f26f52c9db70325df13eaf2d
