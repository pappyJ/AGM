import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();
/**
 * @description Joi Schema Validation For Event Feature
 */

module.exports = {
    createEvent: {
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

    getEvent: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteEvent: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    updateEvent: {
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
