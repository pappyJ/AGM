const express = require('express');

const contactCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const { Controller: adminAuth } = _include('components/admin');

const router = express.Router();

router.get('/', contactCntrl.getAllContacts);

router.get('/:slug', contactCntrl.getContact);

router.post('/sendMail', reqValidate('sendMail'), contactCntrl.sendMail);

router.post(
    '/',
    adminAuth.activeSession,
    reqValidate('createContact'),
    contactCntrl.createContact
);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router

    .route('/:slug/details')

    .post(reqValidate('createContact'), contactCntrl.createContact)

    .patch(reqValidate('updateContact'), contactCntrl.updateContact)

    .delete(reqValidate('deleteContact'), contactCntrl.deleteContact);

module.exports = router;
