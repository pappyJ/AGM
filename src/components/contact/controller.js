// NODE MODULES

// BUSINESS MODULES
const ContactService = require('./service');

const { AppError, catchAsync } = _include('libraries/error');

const { STATUS, MSG } = _include('libraries/shared/constants');

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

class ContactController {
    /**
     * @description Creates contact controller
     * @param {Object} [contactService = contactServiceInstance] - same as contactServiceInstance Object
     *
     */
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
    createContact = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields required for creating a Contact.
         */
        let contactDetails = { ...req.body };

        contactDetails.creator = req.user._id;

        /**
         * @type {Object} - Holds the created data object.
         */
        const {
            value: { data: contact = {} } = {},
        } = await this.ContactService.create(contactDetails);

        // Returns a json response
        res.status(STATUS.CREATED).json({
            status: MSG.SUCCESS,
            contact,
        });
    });

    /**
     * Gets one Contact Data
     * @async
     * @route {GET} /contact/:slug
     * @access public
     */
    getContact = catchAsync(async (req, res, next) => {
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
        } = await this.ContactService.get({ slug: queryFields.slug });

        // Checks if data returned is null
        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.OK).json({
            status: MSG.SUCCESS,
            contact,
        });
    });

    /**
     * Gets All Contact Datas
     * @async
     * @route {GET} /contacts/
     * @access public
     */
    getAllContacts = catchAsync(async (req, res, next) => {
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
        } = await this.ContactService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            status: MSG.SUCCESS,
            contacts,
        });
    });

    deleteContact = catchAsync(async (req, res, next) => {
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
    });

    /**
     * @route {GET} - /contacts/:slug
     */

    updateContact = catchAsync(async (req, res, next) => {
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
        } = await this.ContactService.update(queryParams, queryFields);

        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.ACCEPTED).json({
            status: MSG.SUCCESS,
            contact,
        });
    });

    /**
     * @route {post} - /contacts/sendMail
     */

    sendMail = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         */

        const query = { ...req.body };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         *
         * @describtion Route for sending mail to admins
         */

        const { error, value } = await this.ContactService.executeMail(query);

        if (error) {
            return next(new AppError(error, 400));
        }

        // Returns a json response
        res.status(STATUS.ACCEPTED).json({
            status: MSG.SUCCESS,
            value,
        });
    });
}

const contactCntrl = new ContactController();

module.exports = contactCntrl;
