#!/usr/bin/env node

const http = require('http');

async function waitForBackend(maxAttempts = 30, delay = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`🔍 Intentando conectar al backend... (intento ${i + 1}/${maxAttempts})`);
      
      const response = await fetch('http://localhost:3002/api/health');
      
      if (response.ok) {
        console.log('✅ Backend está listo!');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Backend no está listo aún, esperando ${delay/1000} segundos...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error('❌ El backend no está disponible después de varios intentos');
  return false;
}

async function startFrontend() {
  console.log('🚀 Iniciando frontend...');
  const { spawn } = require('child_process');
  
  const frontend = spawn('npm', ['run', 'client'], {
    stdio: 'inherit',
    shell: true
  });
  
  frontend.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });
}

async function main() {
  console.log('🔄 Verificando estado del backend...');
  
  const backendReady = await waitForBackend();
  
  if (backendReady) {
    await startFrontend();
  } else {
    console.error('❌ No se pudo iniciar el frontend porque el backend no está disponible');
    process.exit(1);
  }
}

main().catch(console.error);