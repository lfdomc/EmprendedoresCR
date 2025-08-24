// Polyfill global para self - ejecutado antes de cualquier otro código
(function() {
  'use strict';
  
  // Solo ejecutar en el servidor (sin window)
  if (typeof window === 'undefined') {
    // Definir self globalmente
    if (typeof self === 'undefined') {
      if (typeof global !== 'undefined') {
        global.self = global;
        // También definir en globalThis si existe
        if (typeof globalThis !== 'undefined') {
          globalThis.self = global;
        }
      } else if (typeof globalThis !== 'undefined') {
        globalThis.self = globalThis;
      }
    }
  }
})();

// Exportar para que Next.js lo reconozca como módulo
module.exports = {};