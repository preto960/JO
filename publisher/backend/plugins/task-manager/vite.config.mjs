import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'E:/PROGRAMAS/laragon/www/JO-Base/JO/publisher/backend/plugins/task-manager/dist-frontend',
    emptyOutDir: true,
    lib: {
      entry: path.resolve('E:/PROGRAMAS/laragon/www/JO-Base/JO/publisher/backend/plugins/task-manager/frontend', 'index.ts'),
      name: 'task_manager',
      formats: ['iife'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['vue', 'pinia', 'vue-router', 'axios'],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'vue-router': 'VueRouter',
          axios: 'axios'
        },
        inlineDynamicImports: true
      }
    },
    minify: false,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': 'E:/PROGRAMAS/laragon/www/JO-Base/JO/publisher/backend/plugins/task-manager/frontend'
    }
  }
})

