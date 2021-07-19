// NODE MODULES

// PRODUCT MODULES

import ProductService from './service';

import { CustomRequest } from '../../libraries/interfaces/user';

import { Response, NextFunction, RequestHandler, Request } from 'express';

import ErroHandler from '../../libraries/error';

const { AppError, catchAsync } = ErroHandler;

import CONSTANTS from '../../libraries/shared/constants';

const { STATUS, MSG } = CONSTANTS;

// end of requiring the modules
/**
/**
 * @type {Object.<ProductService>} - Instance of ProductService class
 */
const productServiceInstance = new ProductService();

// PRODUCT AUTHENTICATION CONTROLLERS
/**
 * Product Controller class
 * @class
 */

class ProductController {
    /**
     * @description Creates product controller
     * @param {Object} [productService = productServiceInstance] - same as productServiceInstance Object
     *
     */
    constructor(public ProductService = productServiceInstance) {
        /**
         * @type {Object}
         * @borrows productService
         */
    }

    /**
     * Creates a Product
     * @async
     * @route {POST} /product/
     * @access protected
     */
    createProduct: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields required for creating a Product.
             */
            const productDetails = { ...req.body };

            if (!req.user) {
                return next(
                    new AppError(
                        'You Are Not Authorized To Create A Product! Please Log In',
                        400
                    )
                );
            }

            productDetails.creator = req.user._id;
            /**
             * @type {Object} - Holds the created data object.
             */
            const { value: { data: product = {} } = {} } =
                await this.ProductService.create(productDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                product,
            });
        }
    );

    /**
     * Gets one Product Data
     * @async
     * @route {GET} /product/:slug or :/id
     * @access public
     */
    getProduct: RequestHandler = catchAsync(
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

            const { error, value: { data: product = {} } = {} } =
                await this.ProductService.get({ slug: queryFields.slug });

            // Checks if data returned is null
            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                product,
            });
        }
    );

    /**
     * Gets All Product Datas
     * @async
     * @route {GET} /products/
     * @access public
     */
    getAllProducts = catchAsync(
        async (req: Partial<Request>, res: Response) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             *
             * @empty - Returns Whole Data In Products Collection
             */
            const queryFields: any = { ...req.query };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             */
            const { value: { data: products = {} } = {} } =
                await this.ProductService.getAll(queryFields);

            // Returns a json response
            res.status(STATUS.OK).json({
                message: MSG.SUCCESS,
                products,
            });
        }
    );

    deleteProduct = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         */
        const queryFields: any = { ...req.params };
        /**
         * @type {Object|null} - Holds either the returned data object or null.
         *
         * @describtion Use Either a mongodbUniqueId Or Slug to Search
         */

        await this.ProductService.delete(queryFields);

        // Returns a json response
        res.status(STATUS.NO_CONTENT).json({
            message: MSG.SUCCESS,
        });
    });

    /**
     * @route {GET} - /products/:id or /:slug
     */

    updateProduct = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            /**
             * @type {Object} - An Object of fields to be queried.
             */
            const queryParams: any = { ...req.params };

            const queryFields = { ...req.body };

            /**
             * @type {Object|null} - Holds either the returned data object or null.
             *
             * @describtion Use Either a mongodbUniqueId Or Slug to Search
             */

            const { error, value: { data: product = {} } = {} } =
                await this.ProductService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                product,
            });
        }
    );
}

const productCntrl = new ProductController();

export default productCntrl;
