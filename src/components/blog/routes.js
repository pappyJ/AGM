import { Router } from 'express';

import Controller from './controller';

import VALIDATION from '../../libraries/validations';

import AUTHORIZATION from '../admin';

const { getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog } = Controller;

const { reqValidate } = VALIDATION;

const { Controller: adminAuth } = AUTHORIZATION;

const router = Router();

router.get('/', getAllBlogs);

router.get('/:slug', getBlog);

// NEEDS AUTHORIZATION
router.use(adminAuth.activeSession);

router.post('/', reqValidate('createBlog'), createBlog);

router

    .route('/:slug/details')

    .get(reqValidate('getBlog'), getBlog)

    .patch(reqValidate('updateBlog'), updateBlog)

    .delete(reqValidate('deleteBlog'), deleteBlog);

export default router;
