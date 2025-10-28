"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDeactivate = onDeactivate;
/**
 * Hook ejecutado cuando el plugin es desactivado
 */
async function onDeactivate(context) {
    console.log('📋 Task Manager Plugin: Deactivating...');
    console.log('Plugin ID:', context.pluginId);
    // Aquí podrías:
    // - Detener servicios
    // - Limpiar event listeners
    // - Guardar estado
    console.log('✅ Task Manager Plugin: Deactivated successfully');
}
exports.default = onDeactivate;
