/*
    Path: /api/admin
*/

const { Router } = require('express');
const { obtener } = require('../controllers/admin.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.get('/obtener/:id', [validationJWT], obtener);

module.exports = router;