// USER MODULES
import AdminService from './service';

import UserService from '../users/service';

import Authentication from '../auth/auth';

import ErroHandler from '../../libraries/error';

import CONSTANTS from '../../libraries/shared/constants';

import { Request, Response, NextFunction, RequestHandler } from 'express';

const { AppError, catchAsync } = ErroHandler;

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules
/**
/**
 * @type {Object.<AdminService>} - Instance of AdminService class
 */
const adminServiceInstance = new AdminService();
const userServiceInstance = new UserService();

// ADMIN AUTHENTICATION CONTROLLERS
/**
 * Admin Controller class
 * @class
 */

class AdminController {
    AdminService: AdminService;
    UserService: UserService;
    logIn: any;
    logOut: any;
    activeSession: any;
    /**
     * @description Creates admin controller
     * @param {Object} [adminService = adminServiceInstance] - same as adminServiceInstance Object
     *
     */
    constructor(
        adminService = adminServiceInstance,
        userService = userServiceInstance
    ) {
        /**
         * @type {Object}
         * @borrows adminService
         */
        this.AdminService = adminService;
        this.UserService = userService;
    }

    /**
     * Creates a Admin
     * @async
     * @route {POST} /admin/
     * @access protected
     */
    createAdmin: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields required for creating a Admin.
             */
            const adminDetails: { [unit: string]: object } = { ...req.body };

            /**
             * @type {Object} - Holds the created data object.
             */
            const {
                error,
                value: { data: admin = {} } = {},
            }: { [unit: string]: any } = this.AdminService.create(adminDetails);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.CREATED).json({
                status: MSG.SUCCESS,
                admin,
            });
        }
    );

    /**
     * Gets one User Data
     * @async
     * @route {GET} /admins/:email
     * @access public
     */
    getAdmin: RequestHandler = catchAsync(
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

            const {
                error,
                value: { data: admin = {} } = {},
            }: { [unit: string]: any } = this.AdminService.get(
                queryFields.email
            );

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                status: MSG.SUCCESS,
                admin,
            });
        }
    );

    getAllAdmins: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             *
             * @empty - Returns Whole Data In Admins Collection
             */
            const queryFields = { ...req.query };
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             */
            const {
                value: { data: admins = {} } = {},
            } = await this.AdminService.getAll(queryFields);

            // Returns a json response
            res.status(STATUS.OK).json({
                status: MSG.SUCCESS,
                admins,
            });
        }
    );
}

const adminCntrl = new AdminController();
const authCntrl = new Authentication(adminServiceInstance);

adminCntrl.logIn = authCntrl.logIn;
adminCntrl.logOut = authCntrl.logOut;
adminCntrl.activeSession = authCntrl.activeSession;

export default adminCntrl;
