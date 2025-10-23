const http = require('http');

function testFrontend() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Frontend respondió con status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (data.includes('Plugin Marketplace')) {
        console.log('✅ Frontend está cargando correctamente');
      } else {
        console.log('❌ Frontend no está cargando correctamente');
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error conectando al frontend:', err.message);
  });

  req.end();
}

function testBackend() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/plugins',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Backend respondió con status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const plugins = JSON.parse(data);
        console.log(`✅ Backend tiene ${plugins.plugins.length} plugins`);
        if (plugins.plugins.length > 0) {
          console.log('📋 Plugins disponibles:');
          plugins.plugins.forEach((plugin, index) => {
            console.log(`  ${index + 1}. ${plugin.title}`);
          });
        }
      } catch (error) {
        console.error('❌ Error parseando respuesta del backend:', error.message);
      }
    });
  });

  req.on('error', (err) => {
    console.error('❌ Error conectando al backend:', err.message);
  });

  req.end();
}

console.log('🔄 Probando frontend y backend...');
testFrontend();
setTimeout(testBackend, 1000);