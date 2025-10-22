// Plugin example-plugin
console.log('Plugin example-plugin cargado');

module.exports = {
  init: function() {
    console.log('Plugin example-plugin inicializado');
    // Aquí va la lógica de inicialización del plugin
  },
  
  destroy: function() {
    console.log('Plugin example-plugin destruido');
    // Aquí va la lógica de limpieza del plugin
  },
  
  // Métodos adicionales del plugin
  processData: function(data) {
    return data.toUpperCase();
  }
};