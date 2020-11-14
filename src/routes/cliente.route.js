/*
    Path: /api/cliente
*/

const { Router } = require('express');
const { listar, eliminar } = require('../controllers/cliente.controller');
const router = Router();

router.get('/listar', listar);
router.put('/eliminar', eliminar);

module.exports = router; 