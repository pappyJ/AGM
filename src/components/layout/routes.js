// importing the modules
// const passport = require('passport');
// importing the modules

const express = require('express');

const layoutCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const { Controller: adminAuth } = _include('components/admin');

const router = express.Router();

router.get('/', layoutCntrl.getAllLayouts);

router
    .route('/')

    .post(
        adminAuth.activeSession,
        reqValidate('createLayout'),
        layoutCntrl.createLayout
    );

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router
    .route('/:slug/details')

    .post(reqValidate('createLayout'), layoutCntrl.createLayout)

    .get(reqValidate('getLayout'), layoutCntrl.getLayout)

    .patch(reqValidate('updateLayout'), layoutCntrl.updateLayout)

    .delete(reqValidate('deleteLayout'), layoutCntrl.deleteLayout);

module.exports = router;
