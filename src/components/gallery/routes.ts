// importing the modules

import { Router } from 'express';

import Controller from './controller';

import VALIDATION from '../../libraries/validations';

import AUTHORIZATION from '../admin';

const { Controller: adminAuth } = AUTHORIZATION;

const {
    getAllGalleries,
    getGallery,
    createGallery,
    updateGallery,
    deleteGallery,
} = Controller;

const { reqValidate }: { reqValidate: (validator: string) => any } = VALIDATION;

const router = Router();

router.get('/', getAllGalleries);

router.get('/:slug', getGallery);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createGallery'), createGallery);

router

    .route('/:slug/details')

    .patch(reqValidate('updateGallery'), updateGallery)

    .delete(reqValidate('deleteGallery'), deleteGallery);

export default router;
