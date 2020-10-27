/*
    Path: /api/auth
*/

const { Router } = require('express');
const { login, loginGoogle } = require('../controllers/auth.controller');
const router = Router();

router.post('/', login);
router.post('/google', loginGoogle);

module.exports = router;