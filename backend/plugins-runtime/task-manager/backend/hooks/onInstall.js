"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onInstall = onInstall;
/**
 * Hook ejecutado cuando el plugin es instalado
 */
async function onInstall(context) {
    console.log('📋 Task Manager Plugin: Installing...');
    console.log('Plugin ID:', context.pluginId);
    console.log('Plugin Slug:', context.pluginSlug);
    // Las tablas se crean automáticamente por el pluginDatabaseService
    // Este hook se ejecuta después de que las tablas están creadas
    console.log('✅ Task Manager Plugin: Installed successfully');
    console.log('✅ Database tables created');
    console.log('✅ Default categories and sample task inserted');
}
exports.default = onInstall;
