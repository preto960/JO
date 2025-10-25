# AI Plugin Marketplace Platform

A comprehensive AI-driven plugin marketplace platform inspired by NJO Publisher design, featuring intelligent plugin management, AI-powered content generation, and multi-service architecture.

## 🏗️ Architecture Overview

### Services Structure
- **Backend API** (Port 3001): TypeScript + Express + TypeORM + Neon PostgreSQL
- **Publisher Frontend** (Port 3003): Vue 3 + Vite + Tailwind CSS + Pinia
- **Marketplace Frontend** (Port 3002): Vue 3 + Vite + Tailwind CSS

### 🚀 Key Features

#### AI-Powered Functionality
- **Plugin Analysis**: AI-driven insights and improvement suggestions
- **Content Generation**: Automated descriptions, documentation, and marketing materials
- **Image Generation**: AI-created plugin assets and screenshots
- **Smart Recommendations**: Intelligent plugin suggestions based on user behavior
- **SEO Optimization**: AI-powered search optimization

#### Publisher Features
- **Dashboard**: Comprehensive analytics and performance metrics
- **Plugin Management**: Create, update, and manage plugin portfolio
- **AI Tools Panel**: Integrated AI assistance for content creation
- **Review System**: Complete rating and feedback management
- **Revenue Tracking**: Detailed financial analytics

#### Marketplace Features
- **Plugin Discovery**: Advanced search and filtering
- **User Reviews**: Community feedback and ratings
- **AI Recommendations**: Personalized plugin suggestions
- **Developer Profiles**: Showcase plugin portfolios

## 🎨 Design System

### NJO Publisher Style
- **Primary Colors**: Purple/pink gradient theme
- **Dark Theme**: Modern dark interface with vibrant accents
- **Responsive Design**: Mobile-first approach
- **Component Library**: Consistent UI elements across services

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
   # Install backend dependencies
   cd backend
   npm install
   cp .env.example .env
   
   # Install publisher frontend dependencies
   cd ../publisher
   npm install
   cp .env.example .env
   
   # Install marketplace dependencies
   cd ../marketplace
   npm install
   cp .env.example .env
   
   # Setup database
   cd ../backend
   npm run migration:run
   npm run seed:run
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
   # Start backend (Port 3001)
   cd backend
   npm run dev
   
   # Start publisher frontend (Port 3003)
   cd ../publisher
   npm run dev
   
   # Start marketplace frontend (Port 3002)
   cd ../marketplace
   npm run dev
   ```

## 📊 Service Endpoints

### Backend API (Port 3001)
- **Authentication**: `/api/auth/*`
- **Plugins**: `/api/plugins/*`
- **AI Services**: `/api/ai/*`
- **Analytics**: `/api/analytics/*`
- **Reviews**: `/api/reviews/*`

### AI Endpoints
- `POST /api/ai/analyze-plugin` - Plugin analysis
- `POST /api/ai/generate-content` - Content generation
- `POST /api/ai/generate-image` - Image generation
- `POST /api/ai/recommend-plugins` - Plugin recommendations
- `POST /api/ai/optimize-seo` - SEO optimization

## 🔐 Security Features

- **Authentication**: JWT with refresh token rotation
- **Authorization**: Role-based access control (USER/DEVELOPER/ADMIN)
- **Rate Limiting**: Configurable limits on API endpoints
- **Input Validation**: Comprehensive request validation
- **Ownership Checks**: Plugin ownership verification
- **CORS**: Cross-origin resource sharing configuration

## 🤖 AI Integration

### Supported AI Features
- **Text Generation**: Plugin descriptions, documentation
- **Image Generation**: Plugin assets, screenshots
- **Analysis**: Plugin performance and quality analysis
- **Recommendations**: Personalized plugin suggestions
- **Optimization**: SEO and performance improvements

### AI SDK Usage
```javascript
import ZAI from 'z-ai-web-dev-sdk';

const zai = await ZAI.create();
const response = await zai.chat.completions.create({
  messages: [{ role: 'user', content: 'Analyze this plugin' }]
});
```

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
├── backend/          # Express.js API server
├── publisher/        # Vue 3 publisher interface
├── marketplace/      # Vue 3 marketplace interface
├── shared/          # Shared utilities and types
└── docs/            # Documentation
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

- **Backend API**: http://localhost:3001
- **Publisher Portal**: http://localhost:3003
- **Marketplace**: http://localhost:3002
- **API Health Check**: http://localhost:3001/health

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>