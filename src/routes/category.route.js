/*
    Path: /api/category
*/

const { Router } = require('express');
const { getCategories } = require('../controllers/category.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.get('/', [validationJWT], getCategories);

module.exports = router;