/*
    Path: /api/cliente
*/

const { Router } = require('express');
const { listar, eliminar, cantidadClientes } = require('../controllers/cliente.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.get('/listar', [validationJWT], listar);
router.put('/eliminar', [validationJWT], eliminar);
router.get('/cantidad', [validationJWT], cantidadClientes);

module.exports = router; 