const Joi = require('joi');

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Gallery Feature
 */

module.exports = {
    createGallery: {
        params: {},

        body: {
            title: defaultStringValidate.required(),

            description: defaultStringValidate.required(),

            category: defaultStringValidate.required(),

            image: defaultStringValidate.required(),
        },
    },

    getGallery: {
        params: {
            image: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteGallery: {
        params: {
            image: defaultStringValidate.required(),
        },

        body: {},
    },

    updateGallery: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {
            title: defaultStringValidate.required(),

            description: defaultStringValidate.required(),

            category: defaultStringValidate.required(),

            image: defaultStringValidate.required(),

            active: Joi.boolean(),
        },
    },
};
