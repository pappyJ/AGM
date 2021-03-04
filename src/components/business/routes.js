// importing the modules
// const passport = require('passport');
// importing the modules

const express = require('express');

const businessCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const { Controller: adminAuth } = _include('components/admin');

const router = express.Router();

router.get('/', businessCntrl.getAllBusinesses);

router.get('/:name', businessCntrl.getBusiness)

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createBusiness'), businessCntrl.createBusiness)

router

    .route('/:name/details')

    .get(reqValidate('getBusiness'), businessCntrl.getBusiness)

    .patch(reqValidate('updateBusiness'), businessCntrl.updateBusiness)

    .delete(reqValidate('deleteBusiness'), businessCntrl.deleteBusiness);

module.exports = router;
