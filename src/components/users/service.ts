// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// USER MODULES
import UsersModel, { UserDocument } from './Model';
import ApiFeatures from '../../libraries/shared/utils/ApiFeatures';
import compEmitter from '../../libraries/suscribers';
import CONSTANTS from '../../libraries/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

interface DataTemplate {
    [unit: string]: string;
}

type CustomModel = Model<UserDocument> & UserDocument;
class UserService extends ApiFeatures {
    /**
     * Creates user controller
     * @param {Object} [userModel = UserModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected UserModel = UsersModel as CustomModel,
        protected eventEmitter: typeof compEmitter = compEmitter
    ) {
        super();
    }

    /**
     * Creates an User.
     * @async
     * @param {Object} details - Details required to create a User.
     * @returns {Object} Returns the created User
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const user = await this.UserModel.create({
            ...details,
        });

        // emits an Event
        this.eventEmitter.emitEvent('New User', user);

        return {
            value: {
                data: user,
            },
        };
    }

    /**
     * Finds one User Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let userQuery = this.UserModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            userQuery = userQuery.populate(populateOptions);
        // else userQuery = userQuery.lean();

        const user = await userQuery;

        if (!user) {
            return {
                error: {
                    msg: 'Invalid User. User Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: user,
            },
        };
    }

    /**
     * Finds one All Data matching a specified query but returns all if object is empty.
     * @async
     * @param {Object} query - finds data based on queries.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async getAll(query: Request) {
        const usersQuery = this.api(this.UserModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const users = await usersQuery.query.lean();

        return {
            value: {
                data: users,
            },
        };
    }

    /**
     * Deletes one User Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const user = await this.UserModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted User', user!);

        return {
            value: {
                data: user,
            },
        };
    }

    /**
     * Updates one Announcement Data by it's id.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async update(query: object, details: Request) {
        const user = await this.UserModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return {
                error: {
                    msg: 'Invalid User. User Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        this.eventEmitter.emitEvent('Updated User', user);

        return {
            value: {
                data: user,
            },
        };
    }

    // AUTHENTICATION METHODS

    async verify({ email }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (!user) {
            return {
                error: {
                    msg: 'Invalid Email. Email Address Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        if (user.verified) {
            return {
                error: {
                    msg: 'You Have Been Verified Before!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        user.verified = true;

        await user.save({ validateBeforeSave: false });

        return {
            value: {
                data: user,
            },
        };
    }

    async logIn({ email, password }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (!user || !(await user.validPassword(password))) {
            return {
                error: {
                    msg: 'Invalid Email or Password!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        if (!user.verified) {
            return {
                error: {
                    msg: 'Your Email Address Is Not Verified. Please Go To Your Email To Verify Your Account!',
                    code: STATUS.UNAUTHORIZED,
                },
            };
        }

        return {
            value: {
                data: user,
            },
        };
    }

    async resetPasswordToken({ email }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (!user) {
            return {
                error: {
                    msg: 'Invalid Email. Email Address Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        const token = Math.round(Math.random() * 900000 + 100000);

        return {
            value: {
                data: {
                    firstName: user.firstName,
                    email: user.email,
                    token,
                },
            },
        };
    }

    async resetPassword({ email, password, passwordConfirm }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (!user) {
            return {
                error: {
                    msg: 'Invalid Email. Email Address Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        user.password = password;
        user.passwordConfirm = passwordConfirm;

        await user.save({ validateBeforeSave: true });

        return {
            value: {
                data: user,
            },
        };
    }

    async changePassword({
        email,
        currentPassword,
        password,
        passwordConfirm,
    }: DataTemplate) {
        const user = await this.UserModel.findByEmail(email);

        if (!user) {
            return {
                error: {
                    msg: 'Invalid Email. Email Address Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        if (!(await user.validPassword(currentPassword))) {
            return {
                error: {
                    msg: 'Wrong Password. Please Try Again!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        user.password = password;
        user.passwordConfirm = passwordConfirm;

        await user.save({ validateBeforeSave: true });

        return {
            value: {
                data: user,
            },
        };
    }
}

export default UserService;
