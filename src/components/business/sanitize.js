const Joi = require('joi');

const { AppError } = _include('libraries/error');

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Business Feature
 */

module.exports = {
    createBusiness: {
        params: {},

        body: {
            name: defaultStringValidate.required(),

            description: defaultStringValidate.required(),

            image: defaultStringValidate.required(),

            link: defaultStringValidate.required(),
        },
    },

    getBusiness: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteBusiness: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    updateBusiness: {
        params: {
            name: defaultStringValidate.required(),
        },

        body: {
            name: defaultStringValidate,

            description: defaultStringValidate,

            image: defaultStringValidate,

            link: defaultStringValidate,
        },
    },
};
