// NODE MODULES

// BLOG MODULES
const LayoutService = require('./service');

const { AppError, catchAsync } = _include('libraries/error');

const { STATUS, MSG } = _include('libraries/shared/constants');

// end of requiring the modules
/**
/**
 * @type {Object.<LayoutService>} - Instance of LayoutService class
 */
const layoutServiceInstance = new LayoutService();

// BLOG AUTHENTICATION CONTROLLERS
/**
 * Layout Controller class
 * @class
 */

class LayoutController {
    /**
     * @description Creates layout controller
     * @param {Object} [layoutService = layoutServiceInstance] - same as layoutServiceInstance Object
     *
     */
    constructor(layoutService = layoutServiceInstance) {
        /**
         * @type {Object}
         * @borrows layoutService
         */
        this.LayoutService = layoutService;
    }

    /**
     * Creates a Layout
     * @async
     * @route {POST} /layout/
     * @access protected
     */
    createLayout = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields required for creating a Layout.
         */
        let layoutDetails = { ...req.body };

        layoutDetails.creator = req.user._id;
        /**
         * @type {Object} - Holds the created data object.
         */
        const {
            value: { data: layout = {} } = {},
        } = await this.LayoutService.create(layoutDetails);

        // Returns a json response
        res.status(STATUS.CREATED).json({
            status: MSG.SUCCESS,
            layout,
        });
    });

    /**
     * Gets one Layout Data
     * @async
     * @route {GET} /layout/:slug
     * @access public
     */
    getLayout = catchAsync(async (req, res, next) => {
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
            value: { data: layout = {} } = {},
        } = await this.LayoutService.get(
            { slug: queryFields.slug },
            { path: 'creator' }
        );

        // Checks if data returned is null
        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.OK).json({
            status: MSG.SUCCESS,
            layout,
        });
    });

    /**
     * Gets All Layout Datas
     * @async
     * @route {GET} /layouts/
     * @access public
     */
    getAllLayouts = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Layouts Collection
         */
        const queryFields = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const {
            value: { data: layouts = {} } = {},
        } = await this.LayoutService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            status: MSG.SUCCESS,
            layouts,
        });
    });

    deleteLayout = catchAsync(async (req, res, next) => {
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

        await this.LayoutService.delete(queryFields);

        // Returns a json response
        res.status(STATUS.NO_CONTENT).json({
            status: MSG.SUCCESS,
        });
    });

    /**
     * @route {GET} - /layouts/:slug
     */

    updateLayout = catchAsync(async (req, res, next) => {
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
            value: { data: layout = {} } = {},
        } = await this.LayoutService.update(queryParams, queryFields);

        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.ACCEPTED).json({
            status: MSG.SUCCESS,
            layout,
        });
    });
}

const layoutCntrl = new LayoutController();

module.exports = layoutCntrl;
