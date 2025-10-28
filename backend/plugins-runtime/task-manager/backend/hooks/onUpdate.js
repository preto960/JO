"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUpdate = onUpdate;
/**
 * Hook ejecutado cuando el plugin es actualizado
 */
async function onUpdate(context) {
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
exports.default = onUpdate;
