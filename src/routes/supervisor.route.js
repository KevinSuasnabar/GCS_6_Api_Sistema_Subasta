/*
    Path: /api/supervisor
*/

const { Router } = require('express');
const { actualizar, obtener, listar, eliminar, cantidadSupervisores } = require('../controllers/supervisor.controller');
const router = Router();

router.put('/actualizar', actualizar);
router.get('/obtener/:id', obtener);
router.get('/listar', listar);
router.put('/eliminar', eliminar);
router.get('/cantidad', cantidadSupervisores);

module.exports = router; 