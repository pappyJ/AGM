const Joi = require('joi');

const { AppError } = _include('libraries/error');

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Product Feature
 */

module.exports = {
    createProduct: {
        params: {},

        body: {
            name: defaultStringValidate.required(),

            description: defaultStringValidate.required(),

            business: defaultStringValidate.required(),

            branches: Joi.array(),

            image: defaultStringValidate.required(),
        },
    },

    getProduct: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteProduct: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    updateProduct: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {
            name: defaultStringValidate,

            description: defaultStringValidate,

            image: defaultStringValidate,

            business: defaultStringValidate,

            operation: defaultStringValidate,

            branches: Joi.array(),
        },
    },
};
