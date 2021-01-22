/*
    Path: /api/reportes
*/

const { Router } = require('express');
const { getProductsSubastadosByCategory, getTotalProductsByCategory, getCompradores, getProductosSubastados, getMontoTotal, getSubastasByParticipacion } = require('../controllers/reportes.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.get('/productsByCategory/:dateA/:dateB', [validationJWT], getProductsSubastadosByCategory);
router.get('/compradores', [validationJWT], getCompradores);
router.get('/totalProductsByCategory', [validationJWT], getTotalProductsByCategory);
router.get('/productosSubastados', [validationJWT], getProductosSubastados);
router.get('/monto', [validationJWT], getMontoTotal);
router.get('/participacion', [validationJWT], getSubastasByParticipacion);
// router.get('/', [validationJWT], getSubastas);
// router.get('/getSubastasByIdComprador/:idComprador', [validationJWT], getSubastasByIdComprador);
// router.get('/pujas/:id', [validationJWT], getHistorialPujasBySubasta);
// router.get('/participaciones', [validationJWT], getSubastasByParticipacion);
// router.put('/calificar', [validationJWT], calificarSubasta);
// router.post('/pujar/:id', [validationJWT], pujarSubasta);
// router.post('/:idProducto/vendedor/:idVendedor', [validationJWT], createSubasta);
// router.put('/finalizar/:idSubasta', [validationJWT], finalizarSubasta);
// router.get('/category/:categoryName',  subastaPorCategoria)
// router.get('/filtrarSubastasByProductoAndVendedor/:filter', [validationJWT], filtrarSubastasByProductoAndVendedor)
// router.get('/getPujasBySubasta/:idSubasta', [validationJWT], getPujasBySubasta);

module.exports = router;