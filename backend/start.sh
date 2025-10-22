#!/bin/bash

echo "🚀 Starting Plugin Marketplace Backend..."
echo "📁 Working directory: $(pwd)"
echo "🔧 Node version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating .env file with your Neon database configuration..."
    cat > .env << EOF
# Database Configuration (REQUIRED - Your Neon Database)
DATABASE_URL=postgresql://neondb_owner:npg_hnVE2jqZSHx7@ep-patient-pond-adixypv6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# JWT Configuration (REQUIRED in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ .env file created with your Neon database configuration"
    echo "⚠️  Please update the JWT_SECRET with a secure value"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting development server..."
npm run dev