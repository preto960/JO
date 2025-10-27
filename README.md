# AI Plugin Marketplace Platform

A comprehensive plugin marketplace platform with dynamic plugin loading system, featuring a Publisher portal for developers and an Admin panel for plugin management and usage.

## 🏗️ Architecture Overview

### Services Structure
- **Backend API** (Port 3001): TypeScript + Express + TypeORM + Neon PostgreSQL
  - Main application backend
  - Plugin installation and management
  - Proxy to Publisher for available plugins
  
- **Publisher Backend** (Port 3004): TypeScript + Express + TypeORM + Neon PostgreSQL
  - Independent backend for plugin publishing
  - Vercel Blob storage for plugin packages
  - Developer authentication and management
  
- **Publisher Frontend** (Port 3003): Vue 3 + Vite + Tailwind CSS + Pinia
  - Developer portal for publishing plugins
  - Plugin creation and management
  - Analytics and revenue tracking
  
- **Frontend/Admin** (Port 3002): Vue 3 + Vite + Tailwind CSS + Pinia
  - Admin panel for system management
  - Internal marketplace to browse and install plugins
  - Dynamic plugin loading system
  - User management

### 🚀 Key Features

#### Dynamic Plugin System
- **Plugin Installation**: Install plugins from Publisher marketplace
- **Hot Loading**: Load and unload plugins without restart
- **Dynamic Routes**: Plugins can register their own routes
- **Component Injection**: Plugins can add components to the system
- **Lifecycle Hooks**: onInstall, onActivate, onDeactivate, onUninstall
- **Configuration Management**: Per-plugin settings and configuration

#### Publisher Features (Developer Portal)
- **Plugin Development**: Create and manage plugins
- **Package Upload**: Upload plugin packages to Vercel Blob
- **Version Control**: Manage plugin versions
- **Publishing Workflow**: Draft → Published workflow
- **Analytics**: Track downloads and usage

#### Frontend/Admin Features
- **Internal Marketplace**: Browse plugins from Publisher
- **Plugin Management**: Install, activate, deactivate, uninstall
- **User Management**: Admin user management
- **System Settings**: Configure system-wide settings
- **Dashboard**: System overview and statistics

## 🎨 Design System

### Modern Dark Theme
- **Primary Colors**: Blue/purple gradient theme
- **Dark Theme**: Modern dark interface with vibrant accents
- **Responsive Design**: Mobile-first approach
- **Component Library**: Consistent UI elements across services
- **Tailwind CSS**: Utility-first CSS framework

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/preto960/JO.git
   cd JO
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Manual setup (if script fails)**
   ```bash
   # Install main backend dependencies
   cd backend
   npm install
   
   # Install publisher backend dependencies
   cd ../publisher/backend
   npm install
   
   # Install publisher frontend dependencies
   cd ../
   npm install
   
   # Install frontend/admin dependencies
   cd ../frontend
   npm install
   
   # Setup databases
   cd ../backend
   npm run seed:run
   
   cd ../publisher/backend
   npm run seed
   ```

4. **Environment Configuration**
   ```bash
   # Configure your environment variables in:
   # - backend/.env
   # - publisher/.env
   # - marketplace/.env
   ```

5. **Start Services**
   ```bash
   # Start main backend (Port 3001)
   cd backend
   npm run dev
   
   # Start publisher backend (Port 3004)
   cd ../publisher/backend
   npm run dev
   
   # Start publisher frontend (Port 3003)
   cd ../publisher
   npm run dev
   
   # Start frontend/admin (Port 3002)
   cd ../frontend
   npm run dev
   ```

## 📊 Service Endpoints

### Main Backend API (Port 3001)
- **Authentication**: `/api/auth/*`
- **Installed Plugins**: `/api/installed-plugins/*`
- **Market (Proxy to Publisher)**: `/api/market/*`
- **AI Services**: `/api/ai/*`
- **Analytics**: `/api/analytics/*`
- **Reviews**: `/api/reviews/*`

### Publisher Backend API (Port 3004)
- **Developer Auth**: `/api/auth/*`
- **Plugin Management**: `/api/plugins/*`
- **Package Upload**: `/api/plugins/:id/upload`
- **Publish Plugin**: `/api/plugins/:id/publish`
- **Download Plugin**: `/api/plugins/:id/download`

### Plugin Installation Endpoints
- `GET /api/installed-plugins` - List installed plugins
- `POST /api/installed-plugins/install` - Install plugin
- `DELETE /api/installed-plugins/:id` - Uninstall plugin
- `PATCH /api/installed-plugins/:id/toggle` - Activate/deactivate
- `POST /api/installed-plugins/:id/update` - Update to latest version
- `PATCH /api/installed-plugins/:id/config` - Update plugin config

### Market Endpoints (Proxy)
- `GET /api/market/plugins` - Browse available plugins
- `GET /api/market/plugins/:id` - Get plugin details

## 🔐 Security Features

- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control (USER/DEVELOPER/ADMIN)
- **Rate Limiting**: Configurable limits on API endpoints
- **Input Validation**: Comprehensive request validation
- **Ownership Checks**: Plugin ownership verification
- **CORS**: Cross-origin resource sharing configuration

## 🔌 Plugin System

### Plugin Development
See [Plugin Development Guide](frontend/docs/PLUGIN_DEVELOPMENT.md) for detailed documentation.

### Plugin Lifecycle
1. **Development**: Create plugin in Publisher portal
2. **Upload**: Package and upload to Vercel Blob
3. **Publish**: Set status to PUBLISHED
4. **Discovery**: Plugin appears in Frontend marketplace
5. **Installation**: Admin installs plugin from marketplace
6. **Activation**: Plugin loads dynamically into system
7. **Usage**: Plugin routes and components available
8. **Updates**: Check and install updates
9. **Deactivation**: Disable without uninstalling
10. **Uninstallation**: Complete removal

### Plugin Manifest
```json
{
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "routes": [...],
  "components": {...},
  "permissions": [...],
  "settings": [...]
}
```

### Dynamic Loading
- Plugins load at runtime without restart
- Routes register dynamically
- Components inject into system
- Isolated plugin contexts
- Hot reload support

## 📈 Analytics & Monitoring

### Publisher Analytics
- **Revenue Tracking**: Download counts and earnings
- **Performance Metrics**: Plugin usage statistics
- **User Engagement**: Review ratings and feedback
- **Trend Analysis**: Market performance insights

### System Monitoring
- **API Performance**: Response times and error rates
- **Database Health**: Query performance and connections
- **AI Service Usage**: Token consumption and costs

## 🎯 Development Workflow

### Code Organization
```
/
├── backend/                    # Main Express.js API server
│   ├── src/
│   │   ├── models/            # TypeORM entities
│   │   ├── controllers/       # Route controllers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   └── routes/            # API routes
│   └── package.json
│
├── publisher/
│   ├── backend/               # Publisher Express.js API
│   │   ├── src/
│   │   │   ├── models/       # Developer, PublishedPlugin
│   │   │   ├── controllers/  # Plugin management
│   │   │   ├── services/     # Blob storage
│   │   │   └── routes/       # API routes
│   │   └── package.json
│   │
│   └── (frontend)             # Vue 3 publisher interface
│       ├── src/
│       │   ├── views/        # Publisher views
│       │   ├── components/   # UI components
│       │   ├── stores/       # Pinia stores
│       │   └── services/     # API client
│       └── package.json
│
├── frontend/                  # Vue 3 admin panel
│   ├── src/
│   │   ├── views/            # Admin views
│   │   ├── components/       # UI components
│   │   ├── stores/           # Pinia stores
│   │   ├── composables/      # Plugin loader
│   │   ├── router/           # Vue Router + plugin routes
│   │   └── services/         # API client
│   ├── docs/                 # Plugin development docs
│   └── package.json
│
└── README.md
```

### Development Commands
```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint

# Database
npm run migration:run
npm run migration:revert
npm run seed:run
```

## 🚀 Deployment

### Production Deployment
1. **Environment Configuration**
2. **Database Migration**
3. **Asset Building**
4. **Service Orchestration**
5. **Monitoring Setup**

### Docker Support
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 API Documentation

### Authentication
All API endpoints require authentication except for public marketplace routes.

### Plugin Management
- `GET /api/plugins` - List plugins
- `POST /api/plugins` - Create plugin
- `PUT /api/plugins/:id` - Update plugin
- `DELETE /api/plugins/:id` - Delete plugin

### AI Services
- `POST /api/ai/analyze` - Analyze plugin
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/image` - Generate image

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API reference

## 🌐 Access Points

- **Main Backend API**: http://localhost:3001
- **Publisher Backend API**: http://localhost:3004
- **Publisher Portal** (Developers): http://localhost:3003
- **Frontend/Admin Panel**: http://localhost:3002
- **API Health Check**: http://localhost:3001/health

## 🔑 Default Credentials

### Frontend/Admin
- Email: `admin@example.com`
- Password: `admin123`

### Publisher Portal
- Email: `admin@example.com`
- Password: `admin123`
- Role: `ADMIN`

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>