// importing the modules

import { Router } from 'express';

import adminCntrl from './controller';

import VALIDATION from '../../libraries/validations';

const { reqValidate } = VALIDATION;

const router = Router();

router.post('/signup', reqValidate('createAdmin'), adminCntrl.createAdmin);

router.post('/login', reqValidate('loginAdmin'), adminCntrl.logIn);

router.post('/logout', adminCntrl.logOut);

router.use(adminCntrl.activeSession);

router.get('/', adminCntrl.getAllAdmins);

router.get('/:email', reqValidate('getAdmin'), adminCntrl.getAdmin);

export default router;
