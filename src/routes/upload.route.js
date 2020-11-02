/*
    Path: /api/upload
*/

const { Router } = require('express');
const { uploadPhoto, uploadPhotoProduct } = require('../controllers/upload.controller');
const { validationJWT } = require('../middlewares/validation-jwt.middleware');
const fileUpload = require('express-fileupload');
const router = Router();

router.use(fileUpload());

router.post('/user/:id', [validationJWT], uploadPhoto);
router.post('/product', [validationJWT], uploadPhotoProduct);

module.exports = router;