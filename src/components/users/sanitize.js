const Joi = require('joi');

const { AppError } = _include('libraries/error');

const { states } = _include('libraries/shared/helpers');

const defaultStringValidate = Joi.string().lowercase().trim();

/**
 * @description Joi Schema Validation For User Feature
 */

module.exports = {
    createUser: {
        params: {},

        body: {
            firstName: defaultStringValidate
                .required()
                .min(3)
                .max(30)
                .label('First Name'),

            middleName: defaultStringValidate
                .min(3)
                .max(30)
                .label('Middle Name'),

            lastName: defaultStringValidate
                .required()
                .min(3)
                .max(30)
                .label('Last Name'),

            email: defaultStringValidate.email().required(),

            password: defaultStringValidate.required().min(6).max(30),

            passwordConfirm: defaultStringValidate
                .required()
                .valid(Joi.ref('password'))
                .label('Confirm Password'),

            dob: Joi.date()
                .min(`1-1-${new Date().getFullYear() - 70}`)
                .max(`12-31-${new Date().getFullYear() - 4}`)
                .required()
                .error(
                    new AppError(
                        `Year Of Birth Must Be From ${
                            new Date().getFullYear() - 70
                        } to ${new Date().getFullYear() - 4}`
                    )
                ),

            stateOfOrigin: defaultStringValidate
                .valid(...states)
                .label('State Of Origin')
                .required(),

            stateOfResidence: defaultStringValidate
                .valid(...states)
                .label('State Of Residence')
                .required(),

            gender: defaultStringValidate
                .valid(...['male', 'female'])
                .required(),

            phone: defaultStringValidate.required(),

            socials: {
                facebook: defaultStringValidate,
                instagram: defaultStringValidate,
            },
        },
    },

    verifyUser: {
        params: {},

        body: {
            email: defaultStringValidate.email().required(),
        },
    },

    getUser: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },

    deleteUser: {
        params: {
            slug: defaultStringValidate.required(),
        },

        body: {},
    },
    updateUser: {
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
    },

    loginUser: {
        params: {},

        body: {
            email: defaultStringValidate.email().required(),

            password: defaultStringValidate.required().min(6).max(30),
        },
    },

    sendResetPasswordTokenUser: {
        params: {},

        body: {
            email: defaultStringValidate.email().required(),
        },
    },

    verifyResetPasswordTokenUser: {
        params: {},

        body: {
            token: Joi.number().required(),
        },
    },

    resetPasswordUser: {
        params: {},

        body: {
            password: defaultStringValidate.required().min(6).max(30),

            passwordConfirm: defaultStringValidate
                .required()
                .valid(Joi.ref('password'))
                .label('Confirm Password'),
        },
    },
    changePasswordUser: {
        params: {},

        body: {
            currentPassword: defaultStringValidate.required().min(6).max(30),

            password: defaultStringValidate.required().min(6).max(30),

            passwordConfirm: defaultStringValidate
                .required()
                .valid(Joi.ref('password'))
                .label('Confirm Password'),
        },
    },

    // getAllUsers: {
    //   ordained: Joi.boolean(),
    //   parentsOrGuardian: [Joi.string()],
    //   christainName: defaultStringValidate,
    //   firstName: defaultStringValidate,
    //   middleName: defaultStringValidate,
    //   lastName: defaultStringValidate,
    //   DOB: Joi.date(),
    //   POB: defaultStringValidate,
    //   stateOfOrigin: defaultStringValidate,
    //   lga: defaultStringValidate,
    //   gender: defaultStringValidate,
    //   active: Joi.boolean(),
    //   alive: Joi.boolean(),
    // },
};
