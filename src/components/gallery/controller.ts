// NODE MODULES

// GALLERY MODULES
import GalleryService from './service';

import { Request, Response, NextFunction, RequestHandler } from 'express';

import ErroHandler from '../../libraries/error';

import CONSTANT from '../../libraries/shared/constants';

const { AppError, catchAsync } = ErroHandler;

const { STATUS, MSG } = CONSTANT;

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

interface EventServiceType {
    [unit: string]: any;
}

interface CustomRequest extends Request {
    user: { [unit: string]: any };
}

class GalleryController {
    /**
     * @description Creates gallery controller
     * @param {Object} [galleryService = galleryServiceInstance] - same as galleryServiceInstance Object
     *
     */

    public GalleryService: EventServiceType;

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
    createGallery: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields required for creating a Gallery.
             */
            const galleryDetails = { ...req.body };

            if (!req.user) {
                return next(
                    new AppError(
                        'You Are Not Authorized To Create A Gallery! Please Log In',
                        400
                    )
                );
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
        }
    );

    /**
     * Gets one Gallery Data
     * @async
     * @route {GET} /gallery/:slug or :/id
     * @access public
     */
    getGallery: RequestHandler = catchAsync(
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
        }
    );

    /**
     * Gets All Gallery Datas
     * @async
     * @route {GET} /gallerys/
     * @access public
     */
    getAllGalleries: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
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
        }
    );

    deleteGallery: RequestHandler = catchAsync(
        async (req: Request, res: Response) => {
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
        }
    );

    /**
     * @route {GET} - /gallerys/:id or /:slug
     */

    updateGallery: RequestHandler = catchAsync(
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
                value: { data: gallery = {} } = {},
            } = await this.GalleryService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                gallery,
            });
        }
    );
}

const galleryCntrl = new GalleryController();

export default galleryCntrl;
