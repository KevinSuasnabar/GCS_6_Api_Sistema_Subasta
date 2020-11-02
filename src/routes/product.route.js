/*
    Path: /api/product
*/

const { Router } = require('express');
const { addProduct, getProductsByUser } = require('../controllers/product.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.post('/', [validationJWT], addProduct);
router.get('/', [validationJWT], getProductsByUser);

module.exports = router;