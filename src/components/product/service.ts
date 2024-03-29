// NODE MODULES
import { Model } from 'mongoose';
import { Request } from 'express';

// PRODUCT MODULES

import Product, { ProductDocument } from './Model';

import UTILS from '../../libraries/shared/utils';

import compEmitter from '../../libraries/suscribers';
import CONSTANTS from '../../libraries/shared/constants';

const { STATUS } = CONSTANTS;
const { ApiFeatures } = UTILS;

// end requiring the modules

type CustomModel = Model<ProductDocument> & ProductDocument;

class ProductService extends ApiFeatures {
    /**
     * Creates product controller
     * @param {Object} [productModel = ProductModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(
        protected ProductModel = Product as CustomModel,
        protected eventEmitter: typeof compEmitter = compEmitter
    ) {
        super();
    }

    /**
     * Creates an Product.
     * @async
     * @param {Object} details - Details required to create a Product.
     * @returns {Object} Returns the created Product
     * @throws Mongoose Error
     */

    async create(details: Request) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const product = await this.ProductModel.create({ ...details });

        // emits an Event
        this.eventEmitter.emitEvent('New Product', product);

        return {
            value: {
                data: product,
            },
        };
    }

    /**
     * Finds one Product Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let productQuery = this.ProductModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            productQuery = productQuery.populate(populateOptions);
        // else productQuery = productQuery.lean();

        const product = await productQuery;

        if (!product) {
            return {
                error: {
                    msg: 'Invalid Product. Product Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: product,
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
        let productsQuery = this.api(this.ProductModel, query)
            .filter()
            .sort()
            .limitFields();

        const productsLength = (await productsQuery.query.lean()).length;

        productsQuery = productsQuery.paginate();

        const products = await productsQuery.query.lean();

        const totalProductsLength =
            await this.ProductModel.totalProductsCount();

        return {
            value: {
                data: {
                    totalLength: totalProductsLength,
                    queryLength: productsLength,
                    paginatedLength: products.length,
                    products,
                },
            },
        };
    }

    /**
     * Deletes one Product Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: Request) {
        const product = await this.ProductModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted Product', product!);

        return {
            value: {
                data: product,
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
    async update(query: Request, details: Request) {
        const product = await this.ProductModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return {
                error: {
                    msg: 'Invalid Product. Product Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        this.eventEmitter.emitEvent('Updated Product', product);

        return {
            value: {
                data: product,
            },
        };
    }
}

export default ProductService;
