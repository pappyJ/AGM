// NODE MODULES

// USER MODULES
import UserService from './service';

import { Request, Response, NextFunction, RequestHandler } from 'express';

import ErroHandler from '../../libraries/error';

import CONSTANTS from '../../libraries/shared/constants';

import Authentication from '../auth/auth';

const { AppError, catchAsync } = ErroHandler;

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules
/**
/**
 * @type {Object.<UserService>} - Instance of UserService class
 */
const userServiceInstance = new UserService();

// USER AUTHENTICATION CONTROLLERS
/**
 * User Controller class
 * @class
 */

interface UserServiceType {
    [unit: string]: any;
}

interface CustomRequest extends Request {
    user: { [unit: string]: any };
}

class UserController extends Authentication {
    /**
     * @description Creates user controller
     * @param {Object} [userService = userServiceInstance] - same as userServiceInstance Object
     *
     */

    public UserService: UserServiceType;
    constructor(public userService = userServiceInstance) {
        super(userService);
        /**
         * @type {Object}
         * @borrows userService
         */
        this.UserService = userService;
    }

    /**
     * Creates a User
     * @async
     * @route {POST} /user/
     * @access protected
     */
    createUser: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields required for creating a User.
             */
            const userDetails = { ...req.body };

            /**
             * @type {Object} - Holds the created data object.
             */
            const {
                value: { data: user = {} } = {},
            } = await this.UserService.create(userDetails);

            // if (req.params.signup) {
            //   return next();
            // }

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );

    /**
     * Gets one User Data
     * @async
     * @route {GET} /user/:slug or :/id
     * @access public
     */
    getUser = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const queryFields = req.url.includes('me')
                ? { ...req.user }
                : { ...req.params };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or Slug to Search
             */

            const {
                error,
                value: { data: user = {} } = {},
            } = await this.UserService.get({ slug: queryFields.slug });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                user,
            });
        }
    );

    /**
     * Gets All User Datas
     * @async
     * @route {GET} /users/
     * @access public
     */
    getAllUsers = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             *
             * @empty - Returns Whole Data In Users Collection
             */
            const queryFields = { ...req.query };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             */
            const {
                value: { data: users = {} } = {},
            } = await this.UserService.getAll(queryFields);

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                users,
            });
        }
    );

    deleteUser = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryFields = { ...req.params };
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or Slug to Search
             */

            await this.UserService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                message: MSG.SUCCESS,
            });
        }
    );

    /**
     * @route {GET} - /users/:id or /:slug
     */

    updateUser = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = req.user
                ? { ...req.params, user_id: req.user._id }
                : { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or Slug to Search
             */

            // const { error, value: { data: user = {}} = {} } = await this.UserService.update(queryParams, queryFields);

            // if (error) {
            //   return next(new AppError(error.msg, error.code));
            // }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                // user,
            });
        }
    );

    activeUser = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { error } = await this.UserService.active(req.params);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            res.status(STATUS.OK).json({
                status: MSG.SUCCESS,
                message: 'User is Active!',
                active: true,
            });
        }
    );
}

const userCntrl = new UserController();

export default userCntrl;
