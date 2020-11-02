'use strict';

const mongoose = require('mongoose'),

administrador = mongoose.model('administrador.model');

exports.registrar = function(req, res) {
    var nuevoAdministrador = new administrador(req.body);
    nuevoadministrador.save(function(err, administrador) {
      if (err)
        res.send(err);
      res.json(administrador);
    });
  };

exports.actualizar = function(req, res) {
    administrador.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, administrador) {
      if (err)
        res.send(err);
      res.json(administrador);
    });
  };

  exports.obtener = function(req, res) {
    administrador.findById(req.params.id, function(err, administrador) {
      if (err)
        res.send(err);
      res.json(administrador);
    });
  };

  exports.listar = function(req, res) {
    administrador.find({}, function(err, administrador) {
      if (err)
        res.send(err);
      res.json(administrador);
    });
  };

  exports.eliminar = function(req, res) {
    const estado = 'I';
    administrador.findByIdAndUpdate(req.params.id, {estado: estado}, function(err, administrador) {
      if (err)
        res.send(err);
      res.json({message: 'Administrador eliminado' });
    });
  };