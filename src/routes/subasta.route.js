/*
    Path: /api/subasta
*/

const { Router } = require('express');
const { createSubasta } = require('../controllers/subasta.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.post('/:idProducto', [validationJWT], createSubasta);

module.exports = router;