@echo off
echo 🔄 Iniciando Publisher Dashboard...
echo.

echo 📦 Instalando dependencias si es necesario...
call npm install

echo.
echo 🔧 Iniciando servidor backend...
start "Backend Server" cmd /k "npm run server-mock"

echo ⏳ Esperando 5 segundos para que el backend inicie...
timeout /t 5 /nobreak >nul

echo.
echo 🎨 Iniciando frontend...
start "Frontend Server" cmd /k "npm run client"

echo.
echo ✅ Servicios iniciados!
echo 📱 Frontend: http://localhost:3003
echo 🔧 Backend: http://localhost:3002
echo.
echo Presiona cualquier tecla para salir...
pause >nul