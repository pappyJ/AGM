import { string, ref, date, number } from 'joi';

import CONSTANTS from '../../libraries/shared/helpers';

const { states } = CONSTANTS;

const defaultStringValidate = string().lowercase().trim();

/**
 * @description Joi Schema Validation For User Feature
 */

export const createUser = {
    params: {},

    body: {
        firstName: defaultStringValidate
            .required()
            .min(3)
            .max(30)
            .label('First Name'),

        middleName: defaultStringValidate.min(3).max(30).label('Middle Name'),

        lastName: defaultStringValidate
            .required()
            .min(3)
            .max(30)
            .label('Last Name'),

        email: defaultStringValidate.email().required(),

        password: defaultStringValidate.required().min(6).max(30),

        passwordConfirm: defaultStringValidate
            .required()
            .valid(ref('password'))
            .label('Confirm Password'),

        dob: date()
            .min(`1-1-${new Date().getFullYear() - 70}`)
            .max(`12-31-${new Date().getFullYear() - 4}`)
            .required(),

        stateOfOrigin: defaultStringValidate
            .valid(...states)
            .label('State Of Origin')
            .required(),

        stateOfResidence: defaultStringValidate
            .valid(...states)
            .label('State Of Residence')
            .required(),

        gender: defaultStringValidate.valid(...['male', 'female']).required(),

        phone: defaultStringValidate.required(),

        socials: {
            facebook: defaultStringValidate,
            instagram: defaultStringValidate,
        },
    },
};
export const verifyUser = {
    params: {},

    body: {
        email: defaultStringValidate.email().required(),
    },
};
export const getUser = {
    params: {
        slug: defaultStringValidate.required(),
    },

    body: {},
};
export const deleteUser = {
    params: {
        slug: defaultStringValidate.required(),
    },

    body: {},
};
export const updateUser = {
    params: {},

    body: {
        phone: defaultStringValidate,
        stateOfResidence: defaultStringValidate
            .valid(...states)
            .label('State Of Residence')
            .required(),
        socials: {
            facebook: defaultStringValidate,
            instagram: defaultStringValidate,
        },
    },
};
export const loginUser = {
    params: {},

    body: {
        email: defaultStringValidate.email().required(),

        password: defaultStringValidate.required().min(6).max(30),
    },
};
export const sendResetPasswordTokenUser = {
    params: {},

    body: {
        email: defaultStringValidate.email().required(),
    },
};
export const verifyResetPasswordTokenUser = {
    params: {},

    body: {
        token: number().required(),
    },
};
export const resetPasswordUser = {
    params: {},

    body: {
        password: defaultStringValidate.required().min(6).max(30),

        passwordConfirm: defaultStringValidate
            .required()
            .valid(ref('password'))
            .label('Confirm Password'),
    },
};
export const changePasswordUser = {
    params: {},

    body: {
        currentPassword: defaultStringValidate.required().min(6).max(30),

        password: defaultStringValidate.required().min(6).max(30),

        passwordConfirm: defaultStringValidate
            .required()
            .valid(ref('password'))
            .label('Confirm Password'),
    },
};
