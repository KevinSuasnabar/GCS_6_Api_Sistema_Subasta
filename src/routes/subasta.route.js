/*
    Path: /api/subasta
*/

const { Router } = require('express');
const { createSubasta, getSubastas, getSubastaById, getSubastasByIdComprador, calificarSubasta } = require('../controllers/subasta.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.post('/:idProducto', [validationJWT], createSubasta);
router.get('/:id', [validationJWT], getSubastaById);
router.get('/', [validationJWT], getSubastas);
router.get('/getSubastasByIdComprador/:idComprador', [validationJWT], getSubastasByIdComprador);
router.put('/calificar', [validationJWT], calificarSubasta);

module.exports = router;