const { spawn } = require('child_process');
const http = require('http');

async function waitForServer(port, maxAttempts = 30, delay = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`🔍 Verificando servidor en puerto ${port}... (intento ${i + 1}/${maxAttempts})`);
      
      const response = await fetch(`http://localhost:${port}/api/health`);
      
      if (response.ok) {
        console.log('✅ Servidor backend listo!');
        return true;
      }
    } catch (error) {
      console.log(`⏳ Esperando servidor... ${delay/1000}s`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.log('⚠️ Tiempo de espera agotado, iniciando frontend de todas formas...');
  return false;
}

async function startFrontend() {
  console.log('🚀 Iniciando frontend...');
  const vite = spawn('npm', ['run', 'client'], {
    stdio: 'inherit',
    shell: true
  });
  
  vite.on('close', (code) => {
    console.log(`Frontend process exited with code ${code}`);
  });
}

async function main() {
  const port = process.env.PORT_BACKEND || 3004;
  
  console.log('🔄 Esperando que el backend esté listo...');
  await waitForServer(port);
  await startFrontend();
}

main().catch(console.error);