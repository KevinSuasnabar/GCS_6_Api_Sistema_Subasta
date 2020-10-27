/*
    Path: /api/category
*/

const { Router } = require('express');
const { getCategories } = require('../controllers/category.controller');
const router = Router();

router.get('/', getCategories);

module.exports = router;