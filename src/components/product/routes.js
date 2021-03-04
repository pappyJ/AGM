// importing the modules
// const passport = require('passport');
// importing the modules

const express = require('express');

const productCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const { Controller: adminAuth } = _include('components/admin');

const router = express.Router();

router.get('/', productCntrl.getAllProducts);

router.get('/:slug', productCntrl.getProduct);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createProduct'), productCntrl.createProduct);

router

    .route('/:slug/details')

    .get(reqValidate('getProduct'), productCntrl.getProduct)

    .patch(reqValidate('updateProduct'), productCntrl.updateProduct)

    .delete(reqValidate('deleteProduct'), productCntrl.deleteProduct);

module.exports = router;
