/*
    Path: /api/ubigeo
*/

const { Router } = require('express');
const { listarDepartamentos, listarProvincias, listarDistritos } = require('../controllers/ubigeo.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

router.get('/departamento', [validationJWT], listarDepartamentos);
router.get('/provincia/:idDepartamento', [validationJWT], listarProvincias);
router.get('/distrito/:idDepartamento/:idProvincia', [validationJWT], listarDistritos);

module.exports = router; 