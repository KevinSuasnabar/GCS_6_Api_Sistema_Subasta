/*
    Path: /api/product
*/

const { Router } = require('express');
const { addProduct,updateProduct, getProductsByUser, listarProductoPorCategoria, cantidadProductos, obtener, actualizarEstado, listarProductosYClientes, obtenerHistorial, getProductsByState, filtrarProductosByUserAndNameOrState } = require('../controllers/product.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.post('/', [validationJWT], addProduct);
router.put('/update',[validationJWT], updateProduct);
router.get('/', [validationJWT], getProductsByUser);
router.get('/listarPorCategoria/:category', [validationJWT], listarProductoPorCategoria);
router.get('/cantidad', [validationJWT], cantidadProductos);
router.get('/obtener/:id', [validationJWT], obtener);
router.put('/actualizarEstado', [validationJWT], actualizarEstado);
router.get('/listarProductosyClientes/:category/:filter', [validationJWT], listarProductosYClientes);
router.get('/historial/:id', [validationJWT], obtenerHistorial);
router.get('/state/:state', [validationJWT], getProductsByState);
router.get('/buscarPorUsuarioYNombreEstado/:filter', [validationJWT], filtrarProductosByUserAndNameOrState);

module.exports = router;