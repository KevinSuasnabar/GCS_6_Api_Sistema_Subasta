/*
    Path: /api/auth
*/

const { Router } = require('express');
const { login } = require('../controllers/auth.controller');
const router = Router();

router.post('/', login);

// router.post('/google', [
//     check('token', 'Token is necessary').not().isEmpty(),
//     validationFields
// ], loginGoogle);

// router.get('/', validationJWT, refreshToken);
module.exports = router;