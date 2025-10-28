/**
 * Hook ejecutado cuando el plugin es activado
 */
export async function onActivate(context: any) {
  console.log('📋 Task Manager Plugin: Activating...');
  console.log('Plugin ID:', context.pluginId);
  
  // Aquí podrías:
  // - Iniciar servicios
  // - Registrar event listeners
  // - Cargar configuración
  
  console.log('✅ Task Manager Plugin: Activated successfully');
}

export default onActivate;


