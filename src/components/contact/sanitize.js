const Joi = require('joi');

const { AppError } = _include('libraries/error');

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Contact Feature
 */

module.exports = {
    createContact: {
        params: {},

        body: {
            name: defaultStringValidate.required(),

            address: defaultStringValidate.required(),

            image: defaultStringValidate.required(),

            phone: Joi.array(),

            email: Joi.array(),

            socials: Joi.object(),

            objectives: Joi.object(),
        },
    },

    getContact: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteContact: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    updateContact: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {
            operation: defaultStringValidate,

            field: defaultStringValidate,

            subset: defaultStringValidate,

            data: Joi.any(),

            name: defaultStringValidate,

            address: defaultStringValidate,

            image: defaultStringValidate,

            email: Joi.array(),

            phone: Joi.array(),

            socials: Joi.object(),

            objectives: Joi.object(),
        },
    },

    sendMail: {
        params: {},

        body: {
            email: defaultStringValidate,
            name: defaultStringValidate,
            keyMessage: defaultStringValidate,
        },
    },
};
