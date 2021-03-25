import { Router } from 'express';

import Controller from './controller';

import VALIDATION from '../../libraries/validations';

import AUTHORIZATION from '../admin';

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} = Controller;

const { reqValidate }: { reqValidate: (validator: string) => any } = VALIDATION;

const { Controller: adminAuth } = AUTHORIZATION;

const router = Router();

router.get('/', getAllEvents);

router.get('/:slug', getEvent);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createEvent'), createEvent);

router

    .route('/:slug/details')

    .get(reqValidate('getEvent'), getEvent)

    .patch(reqValidate('updateEvent'), updateEvent)

    .delete(reqValidate('deleteEvent'), deleteEvent);

export default router;
