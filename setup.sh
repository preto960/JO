#!/bin/bash

# AI Plugin Marketplace Setup Script

echo "🚀 Setting up AI Plugin Marketplace..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Setup environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created backend .env file - please update with your configuration"
fi

# Install publisher frontend dependencies
echo "📦 Installing publisher frontend dependencies..."
cd ../publisher
npm install

# Setup environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created publisher .env file"
fi

# Install marketplace frontend dependencies
echo "📦 Installing marketplace frontend dependencies..."
cd ../marketplace
npm install

# Setup environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created marketplace .env file"
fi

cd ..

# Create database
echo "🗄️  Setting up database..."
createdb ai_plugin_marketplace 2>/dev/null || echo "Database might already exist"

# Run database migrations
echo "🔄 Running database migrations..."
cd backend
npm run migration:run

# Seed database
echo "🌱 Seeding database..."
npm run seed:run

cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update environment files with your configuration"
echo "2. Start the backend server: cd backend && npm run dev"
echo "3. Start the publisher frontend: cd publisher && npm run dev"
echo "4. Start the marketplace frontend: cd marketplace && npm run dev"
echo ""
echo "🌐 Access points:"
echo "- Backend API: http://localhost:3001"
echo "- Publisher Portal: http://localhost:3003"
echo "- Marketplace: http://localhost:3002"
echo ""
echo "🤖 Enjoy your AI-powered plugin marketplace!"