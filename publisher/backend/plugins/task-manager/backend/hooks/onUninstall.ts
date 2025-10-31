/**
 * Hook ejecutado cuando el plugin es desinstalado
 */
export async function onUninstall(context: any) {
  console.log('📋 Task Manager Plugin: Uninstalling...');
  console.log('Plugin ID:', context.pluginId);
  
  // Aquí podrías:
  // - Limpiar datos (opcional, preguntar al usuario)
  // - Eliminar archivos temporales
  // - Revocar permisos
  // - Eliminar configuración
  
  console.log('✅ Task Manager Plugin: Uninstalled successfully');
}

export default onUninstall;



