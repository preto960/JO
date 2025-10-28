"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUninstall = onUninstall;
/**
 * Hook ejecutado cuando el plugin es desinstalado
 */
async function onUninstall(context) {
    console.log('📋 Task Manager Plugin: Uninstalling...');
    console.log('Plugin ID:', context.pluginId);
    // Aquí podrías:
    // - Limpiar datos (opcional, preguntar al usuario)
    // - Eliminar archivos temporales
    // - Revocar permisos
    // - Eliminar configuración
    console.log('✅ Task Manager Plugin: Uninstalled successfully');
}
exports.default = onUninstall;
