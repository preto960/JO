const axios = require('axios');

async function manualSync() {
  try {
    console.log('🔄 Iniciando sincronización manual...');
    
    // 1. Obtener plugins del publisher (primero verificar si está corriendo)
    console.log('1. Verificando si el publisher está corriendo...');
    try {
      const publisherHealth = await axios.get('http://localhost:3006/api/health');
      console.log('✅ Publisher está corriendo');
      
      // Obtener plugins del publisher
      const publisherPlugins = await axios.get('http://localhost:3006/api/plugins');
      console.log(`📦 Publisher tiene ${publisherPlugins.data.length} plugins`);
      
      if (publisherPlugins.data.length > 0) {
        console.log('Plugins del publisher:');
        publisherPlugins.data.forEach((plugin, index) => {
          console.log(`  ${index + 1}. ${plugin.title} - Status: ${plugin.status}`);
        });
        
        // Ejecutar sincronización
        console.log('2. Ejecutando sincronización...');
        const syncResponse = await axios.post('http://localhost:3006/api/sync-plugins');
        console.log('✅ Sincronización completada:', syncResponse.data.message);
      }
    } catch (error) {
      console.log('⚠️  Publisher no está corriendo, omitiendo sincronización');
    }
    
    // 3. Verificar plugins en el backend principal
    console.log('3. Verificando plugins en el backend principal...');
    const backendPlugins = await axios.get('http://localhost:3000/api/plugins');
    console.log(`📦 Backend principal tiene ${backendPlugins.data.plugins.length} plugins`);
    
    if (backendPlugins.data.plugins.length > 0) {
      console.log('Plugins del backend principal:');
      backendPlugins.data.plugins.forEach((plugin, index) => {
        console.log(`  ${index + 1}. ${plugin.title} - Status: ${plugin.status}`);
      });
    }
    
    console.log('🎉 Sincronización manual completada');
    
  } catch (error) {
    console.error('❌ Error en sincronización manual:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

manualSync();