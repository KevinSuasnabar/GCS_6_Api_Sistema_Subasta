/*
    Path: /api/subasta
*/

const { Router } = require('express');
const { createSubasta, getSubastas, getSubastaById } = require('../controllers/subasta.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.post('/:idProducto', [validationJWT], createSubasta);
router.get('/:id', [validationJWT], getSubastaById);
router.get('/', [validationJWT], getSubastas);

module.exports = router;