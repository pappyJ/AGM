// NODE MODULES

// GALLERY MODULES
import GalleryModel from './Model';
import ApiFeatures from '../../libraries/shared/utils/ApiFeatures';
import compEmitter from '../../libraries/suscribers';
import CONSTANTS from '../../libraries/shared/constants';

const { STATUS } = CONSTANTS;
// end requiring the modules

class GalleryService extends ApiFeatures {
    /**
     * Creates gallery controller
     * @param {Object} [galleryModel = GalleryModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    GalleryModel: any;
    eventEmitter: any;

    constructor(galleryModel = GalleryModel, eventEmitter = compEmitter) {
        super();
        this.GalleryModel = galleryModel;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Creates an Gallery.
     * @async
     * @param {Object} details - Details required to create a Gallery.
     * @returns {Object} Returns the created Gallery
     * @throws Mongoose Error
     */

    async create(details: object) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const gallery = await this.GalleryModel.create({ ...details });

        // emits an Event
        this.eventEmitter.emitEvent('New Gallery Image', gallery);

        return {
            value: {
                data: gallery,
            },
        };
    }

    /**
     * Finds one Gallery Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let galleryQuery = this.GalleryModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            galleryQuery = galleryQuery.populate(populateOptions);
        // else galleryQuery = galleryQuery.lean();

        const gallery = await galleryQuery;

        if (!gallery) {
            return {
                error: {
                    msg: 'Invalid Gallery. Gallery Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: gallery,
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
    async getAll(query: any) {
        let gallerysQuery = this.api(this.GalleryModel, query)
            .filter()
            .sort()
            .limitFields();

        const gallerysLength = (await gallerysQuery.query.lean()).length;

        gallerysQuery = gallerysQuery.paginate();

        const gallerys = await gallerysQuery.query.lean();

        const totalGallerysLength = await this.GalleryModel.totalGallerysCount();

        return {
            value: {
                data: {
                    totalLength: totalGallerysLength,
                    queryLength: gallerysLength,
                    paginatedLength: gallerys.length,
                    gallerys,
                },
            },
        };
    }

    /**
     * Deletes one Gallery Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const gallery = await this.GalleryModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted Gallery', gallery);

        return {
            value: {
                data: gallery,
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
    async update(query: object, details: object) {
        const gallery = await this.GalleryModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!gallery) {
            return {
                error: {
                    msg: 'Invalid Gallery. Gallery Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        this.eventEmitter.emitEvent('Updated Gallery', gallery);

        return {
            value: {
                data: gallery,
            },
        };
    }
}

export default GalleryService;
