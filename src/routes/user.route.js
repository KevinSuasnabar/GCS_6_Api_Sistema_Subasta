/*
    Path: /api/user
*/

const { Router } = require('express');
const { updateUser, getUser } = require('../controllers/user.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const router = Router();

// router.get('/', validationJWT, getUsers);
// router.post('/', [
//     check('name', 'The name is necessary.').not().isEmpty(),
//     check('email', 'The email is necessary').isEmail(),
//     check('password', 'The password is necessary').not().isEmpty(),
//     validationFields
// ], createUser);
router.put('/:id', [validationJWT], updateUser);
router.get('/:id', [validationJWT], getUser);
// router.delete('/:id', [validationJWT, validationAdminRole], deleteUser);

module.exports = router;