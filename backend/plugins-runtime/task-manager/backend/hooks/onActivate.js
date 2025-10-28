"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onActivate = onActivate;
/**
 * Hook ejecutado cuando el plugin es activado
 */
async function onActivate(context) {
    console.log('📋 Task Manager Plugin: Activating...');
    console.log('Plugin ID:', context.pluginId);
    // Aquí podrías:
    // - Iniciar servicios
    // - Registrar event listeners
    // - Cargar configuración
    console.log('✅ Task Manager Plugin: Activated successfully');
}
exports.default = onActivate;
