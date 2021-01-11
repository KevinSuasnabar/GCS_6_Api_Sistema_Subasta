/*
    Path: /api/subasta
*/

const { Router } = require('express');
const { subastaPorCategoria, createSubasta, getSubastas, getSubastaById, getSubastasByIdComprador, calificarSubasta, getHistorialPujasBySubasta, pujarSubasta, getSubastasByParticipacion, finalizarSubasta } = require('../controllers/subasta.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.get('/:id', getSubastaById);
router.get('/', [validationJWT], getSubastas);
router.get('/getSubastasByIdComprador/:idComprador', [validationJWT], getSubastasByIdComprador);
router.get('/pujas/:id', [validationJWT], getHistorialPujasBySubasta);
router.get('/participaciones', [validationJWT], getSubastasByParticipacion);
router.put('/calificar', [validationJWT], calificarSubasta);
router.post('/pujar/:id', [validationJWT], pujarSubasta);
router.post('/:idProducto/vendedor/:idVendedor', [validationJWT], createSubasta);
router.put('/finalizar/:idSubasta', finalizarSubasta);
router.get('/category/:categoryName', subastaPorCategoria)

module.exports = router;