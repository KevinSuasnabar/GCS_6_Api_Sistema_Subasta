'use strict';

const mongoose = require('mongoose'),

supervisor = mongoose.model('supervisor.model');

exports.registrar = function(req, res) {
    var nuevoSupervisor = new supervisor(req.body);
    nuevoSupervisor.save(function(err, supervisor) {
      if (err)
        res.send(err);
      res.json(supervisor);
    });
  };

exports.actualizar = function(req, res) {
    supervisor.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, supervisor) {
      if (err)
        res.send(err);
      res.json(supervisor);
    });
  };

  exports.obtener = function(req, res) {
    supervisor.findById(req.params.id, function(err, supervisor) {
      if (err)
        res.send(err);
      res.json(supervisor);
    });
  };

  exports.listar = function(req, res) {
    supervisor.find({}, function(err, supervisor) {
      if (err)
        res.send(err);
      res.json(supervisor);
    });
  };

  exports.eliminar = function(req, res) {
    const estado = 'I';
    supervisor.findByIdAndUpdate(req.params.id, {estado: estado}, function(err, supervisor) {
      if (err)
        res.send(err);
      res.json({message: 'Producto eliminado' });
    });
  };