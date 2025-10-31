import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

/**
 * Configuración de Vite para compilar plugins
 * Esta configuración se usa dinámicamente para cada plugin
 */
export function createPluginViteConfig(pluginPath: string, pluginSlug: string) {
  return defineConfig({
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // Permitir componentes personalizados
            isCustomElement: (tag) => tag.startsWith('custom-')
          }
        }
      })
    ],
    
    build: {
      // Directorio de salida
      outDir: path.join(pluginPath, 'dist-frontend'),
      emptyOutDir: true,
      
      // Generar sourcemaps para debugging
      sourcemap: false,
      
      // Configuración de library mode
      lib: {
        entry: path.join(pluginPath, 'frontend/index.ts'),
        name: pluginSlug.replace(/-/g, '_'), // Convertir kebab-case a snake_case
        formats: ['es'], // Solo ES modules
        fileName: () => 'index.js'
      },
      
      // Externalizar dependencias compartidas
      rollupOptions: {
        external: ['vue', 'pinia', 'vue-router'],
        output: {
          // Configurar globals para dependencias externas
          globals: {
            vue: 'Vue',
            pinia: 'Pinia',
            'vue-router': 'VueRouter'
          },
          // Preservar estructura de módulos
          preserveModules: false,
          // Formato ES module
          format: 'es'
        }
      },
      
      // Optimizaciones
      minify: 'esbuild',
      target: 'es2020',
      
      // Configuración de chunks
      chunkSizeWarningLimit: 1000
    },
    
    resolve: {
      alias: {
        '@': path.join(pluginPath, 'frontend')
      }
    },
    
    // Modo de producción
    mode: 'production',
    
    // Logging
    logLevel: 'info'
  })
}

export default createPluginViteConfig


