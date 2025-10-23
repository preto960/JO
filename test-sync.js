const axios = require('axios');

async function testSync() {
  try {
    console.log('🔄 Probando sincronización de plugins...');
    
    // 1. Verificar que el backend principal está funcionando
    console.log('1. Verificando backend principal...');
    const backendHealth = await axios.get('http://localhost:3000/health');
    console.log('✅ Backend principal OK:', backendHealth.data.status);
    
    // 2. Verificar que el publisher está funcionando
    console.log('2. Verificando publisher...');
    const publisherHealth = await axios.get('http://localhost:3006/api/health');
    console.log('✅ Publisher OK:', publisherHealth.data.status);
    
    // 3. Obtener plugins del publisher
    console.log('3. Obteniendo plugins del publisher...');
    const publisherPlugins = await axios.get('http://localhost:3006/api/plugins');
    console.log(`📦 Publisher tiene ${publisherPlugins.data.length} plugins`);
    
    if (publisherPlugins.data.length > 0) {
      console.log('Plugins encontrados:');
      publisherPlugins.data.forEach((plugin, index) => {
        console.log(`  ${index + 1}. ${plugin.title} - Status: ${plugin.status}`);
      });
    }
    
    // 4. Obtener plugins del backend principal
    console.log('4. Obteniendo plugins del backend principal...');
    const backendPlugins = await axios.get('http://localhost:3000/api/plugins');
    console.log(`📦 Backend principal tiene ${backendPlugins.data.plugins?.length || 0} plugins`);
    
    if (backendPlugins.data.plugins?.length > 0) {
      console.log('Plugins encontrados:');
      backendPlugins.data.plugins.forEach((plugin, index) => {
        console.log(`  ${index + 1}. ${plugin.title} - Status: ${plugin.status}`);
      });
    }
    
    // 5. Ejecutar sincronización manual
    console.log('5. Ejecutando sincronización manual...');
    const syncResponse = await axios.post('http://localhost:3006/api/sync-plugins');
    console.log('✅ Sincronización completada:', syncResponse.data.message);
    
    // 6. Verificar plugins después de sincronización
    console.log('6. Verificando plugins después de sincronización...');
    const backendPluginsAfter = await axios.get('http://localhost:3000/api/plugins');
    console.log(`📦 Backend principal ahora tiene ${backendPluginsAfter.data.plugins?.length || 0} plugins`);
    
    if (backendPluginsAfter.data.plugins?.length > 0) {
      console.log('Plugins después de sincronización:');
      backendPluginsAfter.data.plugins.forEach((plugin, index) => {
        console.log(`  ${index + 1}. ${plugin.title} - Status: ${plugin.status}`);
      });
    }
    
    console.log('🎉 Prueba de sincronización completada');
    
  } catch (error) {
    console.error('❌ Error en prueba de sincronización:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testSync();