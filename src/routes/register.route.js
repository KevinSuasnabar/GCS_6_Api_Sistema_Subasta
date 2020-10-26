/*
    Path: /api/register
*/

const { Router } = require('express');
const { registerUser, registerSupervisor } = require('../controllers/register.controller');
const router = Router();

router.post('/', registerUser);
router.post('/supervisor', registerSupervisor);

module.exports = router;