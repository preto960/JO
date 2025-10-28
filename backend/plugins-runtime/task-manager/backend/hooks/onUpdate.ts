/**
 * Hook ejecutado cuando el plugin es actualizado
 */
export async function onUpdate(context: any) {
  console.log('📋 Task Manager Plugin: Updating...');
  console.log('Plugin ID:', context.pluginId);
  console.log('Previous Version:', context.previousVersion);
  console.log('New Version:', context.manifest.version);
  
  // Aquí podrías:
  // - Migrar datos
  // - Actualizar esquema de base de datos
  // - Convertir configuraciones antiguas
  
  console.log('✅ Task Manager Plugin: Updated successfully');
}

export default onUpdate;


