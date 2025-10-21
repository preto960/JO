#!/bin/bash

echo "🔄 Iniciando Publisher Dashboard..."
echo "=================================="

# Verificar si los puertos están en uso
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  El puerto 3002 ya está en uso. Deteniendo procesos..."
    pkill -f "server-mock" 2>/dev/null
    sleep 2
fi

if lsof -Pi :3003 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  El puerto 3003 ya está en uso. Deteniendo procesos..."
    pkill -f "vite" 2>/dev/null
    sleep 2
fi

echo "🔧 Iniciando servidor backend (puerto 3002)..."
npm run server-mock &
SERVER_PID=$!

sleep 5

echo "🎨 Iniciando frontend (puerto 3003)..."
npm run client &
CLIENT_PID=$!

sleep 3

echo "🔍 Verificando servicios..."
if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Error: Backend no responde"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 1
fi

if curl -s http://localhost:3003 > /dev/null 2>&1; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "❌ Error: Frontend no responde"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Publisher Dashboard iniciado exitosamente!"
echo "=============================================="
echo "📱 Frontend: http://localhost:3003"
echo "🔧 Backend API: http://localhost:3002"
echo "📊 Health Check: http://localhost:3002/api/health"
echo ""
echo "Para detener los servicios, presiona Ctrl+C"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

# Capturar señales de salida
trap cleanup SIGINT SIGTERM

# Esperar a que los procesos terminen
wait