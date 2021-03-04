// NODE MODULES

// GALLERY MODULES
const GalleryService = require('./service');

const { AppError, catchAsync } = _include('libraries/error');

const { STATUS, MSG, MISSING_DOCUMENT, INVALID_ID } = _include(
    'libraries/shared/constants'
);

// end of requiring the modules
/**
/**
 * @type {Object.<GalleryService>} - Instance of GalleryService class
 */
const galleryServiceInstance = new GalleryService();

// GALLERY AUTHENTICATION CONTROLLERS
/**
 * Gallery Controller class
 * @class
 */

class GalleryController {
    /**
     * @description Creates gallery controller
     * @param {Object} [galleryService = galleryServiceInstance] - same as galleryServiceInstance Object
     *
     */
    constructor(galleryService = galleryServiceInstance) {
        /**
         * @type {Object}
         * @borrows galleryService
         */
        this.GalleryService = galleryService;
    }

    /**
     * Creates a Gallery
     * @async
     * @route {POST} /gallery/
     * @access protected
     */
    createGallery = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields required for creating a Gallery.
         */
        const galleryDetails = { ...req.body };

        if (!req.user) {
            return next(new AppError('You Are Not Authorized To Create A Gallery! Please Log In', 400));
        }

        galleryDetails.creator = req.user._id;
        /**
         * @type {Object} - Holds the created data object.
         */
        const {
            value: { data: gallery = {} } = {},
        } = await this.GalleryService.create(galleryDetails);

        

        // Returns a json response
        res.status(STATUS.CREATED).json({
            message: MSG.SUCCESS,
            gallery,
        });
    });

    /**
     * Gets one Gallery Data
     * @async
     * @route {GET} /gallery/:slug or :/id
     * @access public
     */
    getGallery = catchAsync(async (req, res, next) => {
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
            value: { data: gallery = {} } = {},
        } = await this.GalleryService.get(queryFields);

        // Checks if data returned is null
        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            gallery,
        });
    });

    /**
     * Gets All Gallery Datas
     * @async
     * @route {GET} /gallerys/
     * @access public
     */
    getAllGalleries = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Gallerys Collection
         */
        const queryFields = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const {
            value: { data: gallerys = {} } = {},
        } = await this.GalleryService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            gallerys,
        });
    });

    deleteGallery = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         */
        const queryFields = { ...req.params };
        /**
         * @type {Object|null} - Holds either the returned data object or null.
         *
         * @describtion Use Either a mongodbUniqueId Or Slug to Search
         */

        await this.GalleryService.delete(queryFields);

        // Returns a json response
        res.status(STATUS.NO_CONTENT).json({
            message: MSG.SUCCESS,
        });
    });

    /**
     * @route {GET} - /gallerys/:id or /:slug
     */

    updateGallery = catchAsync(async (req, res, next) => {
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

        const { error, value: { data: gallery = {}} = {} } = await this.GalleryService.update(queryParams, queryFields);

        if (error) {
          return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.ACCEPTED).json({
            message: MSG.SUCCESS,
            gallery,
        });
    });
}

const galleryCntrl = new GalleryController();

module.exports = galleryCntrl;
