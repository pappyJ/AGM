// importing the modules

import { Router } from 'express';

import productCntrl from './controller';

import AdminService from '../admin';

import VALIDATION from '../../libraries/validations';

const { reqValidate } = VALIDATION;

const { Controller: adminAuth } = AdminService;

const router = Router();

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

export default router;
