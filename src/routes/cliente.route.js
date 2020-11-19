/*
    Path: /api/cliente
*/

const { Router } = require('express');
const { listar, eliminar, cantidadClientes } = require('../controllers/cliente.controller');
const router = Router();

router.get('/listar', listar);
router.put('/eliminar', eliminar);
router.get('/cantidad', cantidadClientes);

module.exports = router; 