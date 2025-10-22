#!/bin/bash

echo "🚀 Iniciando Publisher Dashboard..."
echo "=================================="

# Verificar si los puertos están en uso
if lsof -Pi :3005 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3005 ya está en uso. Deteniendo procesos..."
    lsof -ti:3005 | xargs kill -9
    sleep 2
fi

if lsof -Pi :3003 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3003 ya está en uso. Deteniendo procesos..."
    lsof -ti:3003 | xargs kill -9
    sleep 2
fi

echo "✅ Puertos liberados"
echo "🔧 Iniciando servidor backend (puerto 3005)..."
npm run server-mock &
SERVER_PID=$!

sleep 3

echo "🎨 Iniciando frontend (puerto 3003)..."
npm run client &
CLIENT_PID=$!

sleep 3

echo "🔍 Verificando servicios..."
if curl -s http://localhost:3005/api/health > /dev/null; then
    echo "✅ Backend funcionando correctamente"
else
    echo "❌ Error: Backend no responde"
    kill $SERVER_PID $CLIENT_PID
    exit 1
fi

if curl -s http://localhost:3003 > /dev/null; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "❌ Error: Frontend no responde"
    kill $SERVER_PID $CLIENT_PID
    exit 1
fi

echo ""
echo "🎉 Publisher Dashboard iniciado exitosamente!"
echo "=============================================="
echo "📱 Frontend: http://localhost:3003"
echo "🔧 Backend API: http://localhost:3005"
echo "📊 Health Check: http://localhost:3005/api/health"
echo ""
echo "📝 Nota: Se está usando un servidor mock con datos simulados"
echo "   Para usar la base de datos real, ejecuta: npm run server"
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