// NODE MODULES

// BUSINESS MODULES
import ContactService from './service';

import ErroHandler from '../../libraries/error';

import CONSTANTS from '../../libraries/shared/constants';

import { Request, Response, NextFunction, RequestHandler } from 'express';

const { AppError, catchAsync } = ErroHandler;

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules
/**
/**
 * @type {Object.<ContactService>} - Instance of ContactService class
 */
const contactServiceInstance = new ContactService();

// BUSINESS AUTHENTICATION CONTROLLERS
/**
 * Contact Controller class
 * @class
 */

interface CustomRequest extends Request {
    user: { [unit: string]: any };
}

class ContactController {
    /**
     * @description Creates contact controller
     * @param {Object} [contactService = contactServiceInstance] - same as contactServiceInstance Object
     *
     */
    ContactService: ContactService;
    logIn: any;
    logOut: any;
    activeSession: any;
    constructor(contactService = contactServiceInstance) {
        /**
         * @type {Object}
         * @borrows contactService
         */
        this.ContactService = contactService;
    }

    /**
     * Creates a Contact
     * @async
     * @route {POST} /contact/
     * @access protected
     */
    createContact: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a Contact.
             */
            let contactDetails: { [unit: string]: string | object | number } = {
                ...req.body,
            };

            contactDetails.creator = req.user._id;

            /**
             * @type {Object} - Holds the created data object.
             */
            const {
                value: { data: contact = {} } = {},
            }: { [unit: string]: any } = this.ContactService.create(
                contactDetails
            );

            // Returns a json response
            res.status(STATUS.CREATED).json({
                status: MSG.SUCCESS,
                contact,
            });
        }
    );

    /**
     * Gets one Contact Data
     * @async
     * @route {GET} /contact/:slug
     * @access public
     */
    getContact: RequestHandler = catchAsync(
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
                value: { data: contact = {} } = {},
            }: { [unit: string]: any } = this.ContactService.get({
                slug: queryFields.slug,
            });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                status: MSG.SUCCESS,
                contact,
            });
        }
    );

    /**
     * Gets All Contact Datas
     * @async
     * @route {GET} /contacts/
     * @access public
     */
    getAllContacts: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             *
             * @empty - Returns Whole Data In Contacts Collection
             */
            const queryFields = { ...req.query };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             */
            const {
                value: { data: contacts = {} } = {},
            }: { [unit: string]: any } = this.ContactService.getAll(
                queryFields
            );

            // Returns a json response
            res.status(STATUS.OK).json({
                status: MSG.SUCCESS,
                contacts,
            });
        }
    );

    deleteContact: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             * @route {DELETE} - /:slug
             */
            const queryFields = { ...req.params };
            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or Slug to Search
             */

            await this.ContactService.delete(queryFields);

            // Returns a json response
            res.status(STATUS.NO_CONTENT).json({
                status: MSG.SUCCESS,
            });
        }
    );

    /**
     * @route {GET} - /contacts/:slug
     */

    updateContact: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or Slug to Search
             */

            const {
                error,
                value: { data: contact = {} } = {},
            }: { [unit: string]: any } = this.ContactService.update(
                queryParams,
                queryFields
            );

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                status: MSG.SUCCESS,
                contact,
            });
        }
    );

    /**
     * @route {post} - /contacts/sendMail
     */

    sendMail: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */

            const query = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Route for sending mail to admins
             */

            const { error, value } = await this.ContactService.executeMail(
                query
            );

            if (error) {
                return next(new AppError(error, 400));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                status: MSG.SUCCESS,
                value,
            });
        }
    );
}

const contactCntrl = new ContactController();

export default contactCntrl;
