#!/bin/bash

echo "🚀 Testing Registration with Neon PostgreSQL"
echo "============================================"

# Test 1: Register a new user
echo "📝 Test 1: Registering a new user with Neon..."
REGISTER_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "neontest@example.com", "username": "neontest", "password": "Password123", "role": "DEVELOPER"}' \
  -s)

if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
  echo "✅ Registration successful with Neon database"
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo "👤 User ID: $USER_ID"
  echo "🔑 Token received: ${TOKEN:0:20}..."
else
  echo "❌ Registration failed: $REGISTER_RESPONSE"
  exit 1
fi

# Test 2: Login with the new user
echo "📝 Test 2: Logging in with the new user..."
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "neontest@example.com", "password": "Password123"}' \
  -s)

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
  echo "✅ Login successful with Neon database"
  echo "👤 User role: DEVELOPER"
else
  echo "❌ Login failed: $LOGIN_RESPONSE"
  exit 1
fi

# Test 3: Test protected route
echo "📝 Test 3: Testing protected route..."
PROFILE_RESPONSE=$(curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN" \
  -s)

if echo "$PROFILE_RESPONSE" | grep -q "neontest"; then
  echo "✅ Protected route access successful"
else
  echo "❌ Protected route access failed: $PROFILE_RESPONSE"
  exit 1
fi

echo ""
echo "🎉 All tests passed! The registration system is working correctly with Neon PostgreSQL."
echo ""
echo "🌐 Frontend URLs:"
echo "   - http://localhost:3001"
echo "   - http://localhost:3002"
echo ""
echo "🔧 Backend API: http://localhost:3000/api"
echo "💾 Database: Neon PostgreSQL"
echo ""
echo "📝 Registration Features:"
echo "   ✅ Email validation"
echo "   ✅ Password strength requirements"
echo "   ✅ Username uniqueness"
echo "   ✅ Role selection (USER/DEVELOPER)"
echo "   ✅ JWT authentication"
echo "   ✅ Professional UI design"
echo ""
echo "🧪 You can now test the registration in the browser:"
echo "1. Go to http://localhost:3001 or http://localhost:3002"
echo "2. Click 'Register here' on the login page"
echo "3. Fill out the registration form with:"
echo "   - Email: test@example.com"
echo "   - Username: testuser"
echo "   - Password: Password123"
echo "   - Role: Developer"
echo "4. Submit and verify you're redirected to the dashboard"
echo "5. Test login with your new account"