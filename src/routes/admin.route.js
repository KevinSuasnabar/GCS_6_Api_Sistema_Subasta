/*
    Path: /api/admin
*/

const { Router } = require('express');
const { obtener } = require('../controllers/admin.controller');
const router = Router();

router.get('/obtener/:id', obtener);

module.exports = router;