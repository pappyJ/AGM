// importing the modules
// const passport = require('passport');
// importing the modules

const express = require('express');

const blogCntrl = require('./controller');

const { reqValidate } = _include('libraries/validations');

const { Controller: adminAuth } = _include('components/admin');

const router = express.Router();

router.get('/', blogCntrl.getAllBlogs);

router.get('/:slug', blogCntrl.getBlog);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createBlog'), blogCntrl.createBlog);

router

    .route('/:slug/details')

    .get(reqValidate('getBlog'), blogCntrl.getBlog)

    .patch(reqValidate('updateBlog'), blogCntrl.updateBlog)

    .delete(reqValidate('deleteBlog'), blogCntrl.deleteBlog);

module.exports = router;
