'use strict';

module.exports = function(app) {
    var supervisor = require('../controllers/supervisor.controller');
  
    app.route('/api/supervisores')
      .get(supervisor.listar)
      .post(supervisor.registrar);
  
    app.route('/api/supervisores/:id')
      .get(supervisor.obtener)
      .put(supervisor.actualizar)
      .put(supervisor.eliminar);  
  };

  module.exports = router;