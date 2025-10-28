const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Script para empaquetar un plugin sin compilar
 * Los plugins se empaquetan con su código fuente TypeScript/Vue
 */

const pluginName = process.argv[2] || 'task-manager';
const pluginDir = path.join(__dirname, '..', 'plugins', pluginName);
const distDir = path.join(__dirname, '..', 'dist-plugins');
const outputPath = path.join(distDir, `${pluginName}-1.0.0.zip`);

// Crear directorio de salida si no existe
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log(`📦 Packaging plugin: ${pluginName}`);
console.log(`   Source: ${pluginDir}`);
console.log(`   Output: ${outputPath}`);

// Crear el archivo ZIP
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✅ Plugin packaged successfully!`);
  console.log(`   Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Location: ${outputPath}`);
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Agregar todos los archivos del plugin excepto node_modules y dist
archive.glob('**/*', {
  cwd: pluginDir,
  ignore: ['node_modules/**', 'dist/**', '.git/**', '**/.DS_Store', '**/tsconfig.tsbuildinfo']
});

archive.finalize();

