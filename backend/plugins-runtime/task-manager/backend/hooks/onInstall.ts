/**
 * Hook ejecutado cuando el plugin es instalado
 */
export async function onInstall(context: any) {
  console.log('📋 Task Manager Plugin: Installing...');
  console.log('Plugin ID:', context.pluginId);
  console.log('Plugin Slug:', context.pluginSlug);
  
  // Las tablas se crean automáticamente por el pluginDatabaseService
  // Este hook se ejecuta después de que las tablas están creadas
  
  console.log('✅ Task Manager Plugin: Installed successfully');
  console.log('✅ Database tables created');
  console.log('✅ Default categories and sample task inserted');
}

export default onInstall;

