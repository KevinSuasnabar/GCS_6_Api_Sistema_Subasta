/*
    Path: /api/product
*/

const { Router } = require('express');
const { addProduct, getProductsByUser, listarProductoPorCategoria, cantidadProductos} = require('../controllers/product.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.post('/', [validationJWT], addProduct);
router.get('/', [validationJWT], getProductsByUser);
router.get('/listarPorCategoria/:category', listarProductoPorCategoria);
router.get('/cantidad', cantidadProductos);

module.exports = router;