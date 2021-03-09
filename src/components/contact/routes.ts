import express from 'express';

import contactCntrl from './controller';

import VALIDATION from '../../libraries/validations';

import AUTHORIZATION from '../admin';

const { Controller: adminAuth } = AUTHORIZATION;

const { reqValidate }: { reqValidate: (validator: string) => any } = VALIDATION;

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

export default router;
