'use strict';

module.exports = function(app) {
    var administrador = require('../controllers/administrador.controller');
  
    app.route('/api/administradores')
      .get(administrador.listar)
      .post(administrador.registrar);
  
    app.route('/api/administradores/:id')
      .get(administrador.obtener)
      .put(administrador.actualizar)
      .put(administrador.eliminar);  
  };

  module.exports = router;