// importing the modules
// const passport = require('passport');
// importing the modules

import { Router } from 'express';

import Controller from './controller';

const {
    getAllUsers,
    signUp,
    verifyMe,
    logIn,
    sendResetPasswordToken,
    verifyResetPasswordToken,
    resetPassword,
    logOut,
    getUser,
    updateUser,
    changePassword,
} = Controller;

import VALIDATION from '../../libraries/validations';

const { reqValidate }: { reqValidate: (validator: string) => any } = VALIDATION;

// const userCntrl = new UserController();

const router = Router();

router.get('/', getAllUsers);

router.post('/signup', reqValidate('createUser'), signUp);

router.post('/verify_me', reqValidate('verifyUser'), verifyMe);

router.post('/login', reqValidate('loginUser'), logIn);

router.post(
    '/send_reset_password_token',
    reqValidate('sendResetPasswordTokenUser'),
    sendResetPasswordToken
);

router.post(
    '/verify_reset_password_token',
    reqValidate('verifyResetPasswordTokenUser'),
    verifyResetPasswordToken
);

router.post('/reset_password', reqValidate('resetPasswordUser'), resetPassword);

router.post('/logout', logOut);

// NEEDS AUTHORIZATION
// router.use(userCntrl.activeSession);

router.route('/me').get(getUser).patch(reqValidate('updateUser'), updateUser);

router.post(
    '/change_password',
    reqValidate('changePasswordUser'),
    changePassword
);

router

    .route('/:slug')

    .get(reqValidate('getUser'), getUser)

    .patch(reqValidate('updateUser'), updateUser);

// .delete(deleteUser);

export default router;
