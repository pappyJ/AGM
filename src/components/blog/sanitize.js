const Joi = require('joi');

const { AppError } = _include('libraries/error');

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Blog Feature
 */

module.exports = {
    createBlog: {
        params: {},

        body: {
            banner: defaultStringValidate.required(),

            title: defaultStringValidate.required(),

            category: defaultStringValidate.valid(...[]).required(),

            description: defaultStringValidate.required(),

            creator: defaultStringValidate,

            image: defaultStringValidate.required(),

            link: defaultStringValidate.required(),

            date: Joi.date(),
        },
    },

    getBlog: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteBlog: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    updateBlog: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {
            banner: defaultStringValidate.required(),

            title: defaultStringValidate.required(),

            category: defaultStringValidate.valid(...[]).required(),

            description: defaultStringValidate.required(),

            image: defaultStringValidate.required(),

            link: defaultStringValidate.required(),

            active: Joi.boolean(),

            date: Joi.date(),
        },
    },
};
