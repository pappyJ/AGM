// importing the modules
// const passport = require('passport');
// importing the modules

const express = require('express');

const galleryCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const { Controller: adminAuth } = _include('components/admin');

const router = express.Router();

router.get('/', galleryCntrl.getAllGalleries);

router.get('/:slug', galleryCntrl.getGallery);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createGallery'), galleryCntrl.createGallery);

router

    .route('/:slug/details')

    .patch(reqValidate('updateGallery'), galleryCntrl.updateGallery)

    .delete(reqValidate('deleteGallery'), galleryCntrl.deleteGallery);

module.exports = router;
