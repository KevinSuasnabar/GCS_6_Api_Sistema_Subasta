/*
    Path: /api/supervisor
*/

const { Router } = require('express');
const { actualizar, obtener, listar, eliminar } = require('../controllers/supervisor.controller');
const router = Router();

router.put('/actualizar', actualizar);
router.get('/obtener/:id', obtener);
router.get('/listar', listar);
router.put('/eliminar', eliminar);

module.exports = router; 