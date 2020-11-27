/*
    Path: /api/supervisor
*/

const { Router } = require('express');
const { actualizar, obtener, listar, eliminar, cantidadSupervisores } = require('../controllers/supervisor.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.put('/actualizar', [validationJWT], actualizar);
router.get('/obtener/:id', [validationJWT], obtener);
router.get('/listar', [validationJWT], listar);
router.put('/eliminar', [validationJWT], eliminar);
router.get('/cantidad', [validationJWT], cantidadSupervisores);

module.exports = router; 