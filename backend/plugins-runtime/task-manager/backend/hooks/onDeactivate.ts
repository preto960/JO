/**
 * Hook ejecutado cuando el plugin es desactivado
 */
export async function onDeactivate(context: any) {
  console.log('📋 Task Manager Plugin: Deactivating...');
  console.log('Plugin ID:', context.pluginId);
  
  // Aquí podrías:
  // - Detener servicios
  // - Limpiar event listeners
  // - Guardar estado
  
  console.log('✅ Task Manager Plugin: Deactivated successfully');
}

export default onDeactivate;


