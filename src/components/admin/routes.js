// importing the modules

const express = require('express');

const adminCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const router = express.Router();

router.post('/signup', reqValidate('createAdmin'), adminCntrl.createAdmin);

router.post('/login', reqValidate('loginAdmin'), adminCntrl.logIn);

router.post('/logout', adminCntrl.logOut);

router.use(adminCntrl.activeSession);

router.get('/', adminCntrl.getAllAdmins);

router.get('/:email', reqValidate('getAdmin'), adminCntrl.getAdmin);

module.exports = router;
