#!/bin/bash

echo "🧪 Testing Registration Functionality"
echo "=================================="

# Test 1: Register a new user
echo "📝 Test 1: Registering a new user..."
REGISTER_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "frontendtest@example.com", "username": "frontenduser", "password": "Password123", "role": "DEVELOPER"}' \
  -s)

if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
  echo "✅ Registration successful"
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "🔑 Token received: ${TOKEN:0:20}..."
else
  echo "❌ Registration failed: $REGISTER_RESPONSE"
  exit 1
fi

# Test 2: Login with the new user
echo "📝 Test 2: Logging in with the new user..."
LOGIN_RESPONSE=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "frontendtest@example.com", "password": "Password123"}' \
  -s)

if echo "$LOGIN_RESPONSE" | grep -q "Login successful"; then
  echo "✅ Login successful"
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

if echo "$PROFILE_RESPONSE" | grep -q "frontenduser"; then
  echo "✅ Protected route access successful"
else
  echo "❌ Protected route access failed: $PROFILE_RESPONSE"
  exit 1
fi

echo ""
echo "🎉 All tests passed! The registration system is working correctly."
echo ""
echo "🌐 Frontend URL: http://localhost:3002"
echo "🔧 Backend API: http://localhost:3000/api"
echo ""
echo "You can now test the registration in the browser:"
echo "1. Go to http://localhost:3002"
echo "2. Click 'Register here'"
echo "3. Fill out the registration form"
echo "4. Try logging in with your new account"