const Joi = require('joi');

const { AppError } = _include('libraries/error');

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Layout Feature
 */

module.exports = {
    createLayout: {
        params: {},

        body: {
            banner: Joi.array(),

            title: defaultStringValidate.required(),

            bannerSecondary: defaultStringValidate.required(),

            layoutDescription: defaultStringValidate.required(),

            footerDescription: defaultStringValidate.required(),

            offers: Joi.array(),
        },
    },

    getLayout: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteLayout: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    updateLayout: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {
            operation: defaultStringValidate,

            field: defaultStringValidate,

            data: Joi.any(),

            banner: Joi.array(),

            title: defaultStringValidate,

            bannerSecondary: defaultStringValidate,

            layoutDescription: defaultStringValidate,

            footerDescription: defaultStringValidate,

            offers: Joi.array(),
        },
    },
};
