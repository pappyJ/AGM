// NODE MODULES

// BUSINESS MODULES
const BusinessService = require('./service');

const { AppError, catchAsync } = _include('libraries/error');

const { STATUS, MSG, MISSING_DOCUMENT, INVALID_ID } = _include(
    'libraries/shared/constants'
);

// end of requiring the modules
/**
/**
 * @type {Object.<BusinessService>} - Instance of BusinessService class
 */
const businessServiceInstance = new BusinessService();

// BUSINESS AUTHENTICATION CONTROLLERS
/**
 * Business Controller class
 * @class
 */

class BusinessController {
    /**
     * @description Creates business controller
     * @param {Object} [businessService = businessServiceInstance] - same as businessServiceInstance Object
     *
     */
    constructor(businessService = businessServiceInstance) {
        /**
         * @type {Object}
         * @borrows businessService
         */
        this.BusinessService = businessService;
    }

    /**
     * Creates a Business
     * @async
     * @route {POST} /business/
     * @access protected
     */
    createBusiness = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields required for creating a Business.
         */
        const businessDetails = { ...req.body };

        if (!req.user) {
            return next(
                new AppError(
                    'You Are Not Authorized To Create A Gallery! Please Log In',
                    400
                )
            );
        }

        businessDetails.creator = req.user._id;
        /**
         * @type {Object} - Holds the created data object.
         */
        const {
            value: { data: business = {} } = {},
        } = await this.BusinessService.create(businessDetails);

        // Returns a json response
        res.status(STATUS.CREATED).json({
            message: MSG.SUCCESS,
            business,
        });
    });

    /**
     * Gets one Business Data
     * @async
     * @route {GET} /business/:slug or :/id
     * @access public
     */
    getBusiness = catchAsync(async (req, res, next) => {
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
            value: { data: business = {} } = {},
        } = await this.BusinessService.get(
            { name: queryFields.name },
            { path: 'creator' }
        );

        // Checks if data returned is null
        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            business,
        });
    });

    /**
     * Gets All Business Datas
     * @async
     * @route {GET} /businesss/
     * @access public
     */
    getAllBusinesses = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Businesss Collection
         */
        const queryFields = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const {
            value: { data: businesss = {} } = {},
        } = await this.BusinessService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            businesss,
        });
    });

    deleteBusiness = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         */
        const queryFields = { ...req.params };
        /**
         * @type {Object|null} - Holds either the returned data object or null.
         *
         * @describtion Use Either a mongodbUniqueId Or Slug to Search
         */

        await this.BusinessService.delete(queryFields);

        // Returns a json response
        res.status(STATUS.NO_CONTENT).json({
            message: MSG.SUCCESS,
        });
    });

    /**
     * @route {GET} - /businesss/:id or /:slug
     */

    updateBusiness = catchAsync(async (req, res, next) => {
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
            value: { data: business = {} } = {},
        } = await this.BusinessService.update(queryParams, queryFields);

        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.ACCEPTED).json({
            message: MSG.SUCCESS,
            business,
        });
    });
}

const businessCntrl = new BusinessController();

module.exports = businessCntrl;
