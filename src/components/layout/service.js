// NODE MODULES

// BLOG MODULES
const LayoutModel = require('./Model');
const { ApiFeatures } = _include('libraries/shared/utils');
const compEmitter = _include('libraries/suscribers');
const { STATUS } = _include('libraries/shared/constants');

// end requiring the modules

class LayoutService extends ApiFeatures {
    /**
     * Creates layout controller
     * @param {Object} [layoutModel = LayoutModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(layoutModel = LayoutModel, eventEmitter = compEmitter) {
        super();
        this.LayoutModel = layoutModel;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Creates an Layout.
     * @async
     * @param {Object} details - Details required to create a Layout.
     * @returns {Object} Returns the created Layout
     * @throws Mongoose Error
     */

    async create(details) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const layout = await this.LayoutModel.create({ ...details });

        // emits an Event
        this.eventEmitter.emitEvent('New Layout', layout);

        return {
            value: {
                data: layout,
            },
        };
    }

    /**
     * Finds one Layout Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query, populateOptions = undefined) {
        let layoutQuery = this.LayoutModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            layoutQuery = layoutQuery.populate(populateOptions);
        // else layoutQuery = layoutQuery.lean();

        const layout = await layoutQuery;

        if (!layout) {
            return {
                error: {
                    msg: 'Invalid Layout. Layout Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: layout,
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
    async getAll(query) {
        let layoutsQuery = this.api(this.LayoutModel, query)
            .filter()
            .sort()
            .limitFields();

        const layoutsLength = (await layoutsQuery.query.lean()).length;

        layoutsQuery = layoutsQuery.paginate();

        const layouts = await layoutsQuery.query.lean();

        const totalLayoutsLength = await this.LayoutModel.totalLayoutsCount();

        return {
            value: {
                data: {
                    totalLength: totalLayoutsLength,
                    queryLength: layoutsLength,
                    paginatedLength: layouts.length,
                    layouts,
                },
            },
        };
    }

    /**
     * Deletes one Layout Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query) {
        const layout = await this.LayoutModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted Layout', layout);

        return {
            value: {
                data: layout,
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
    async update(query, details) {
        //Serach to verify document is availabe
        const findLayout = await this.LayoutModel.findOne(query);

        if (!findLayout) {
            return {
                error: {
                    msg: 'Invalid Layout. Layout Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        //add details to arry

        // example request

        // {
        //     "operation": "push",

        //     "field": "banner",

        //     "data":
        //         [{
        //             "image": "image2.jpg",
        //             "title": "home2",
        //             "description": "JLN Builders 2"
        //         }]

        // or

        // ['090867988890']

        // }

        if (details.operation === 'push') {
            details.$push = {
                [details.field]: details.data,
            };
        }

        //remove details from arry

        // example request

        // {
        //     "operation": "pull",

        //     "field": "banner",

        //     "data":
        //         [{
        //             "image": "image2.jpg",
        //             "title": "home2",
        //             "description": "JLN Builders 2"
        //         }]

        // or

        // ['090867988890']

        // }

        if (details.operation === 'pull') {
            details.$pullAll = {
                [details.field]: details.data,
            };
        }

        //execute action

        const layout = await this.LayoutModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        this.eventEmitter.emitEvent('Updated Layout', layout);

        //return response

        return {
            value: {
                data: layout,
            },
        };
    }
}

module.exports = LayoutService;
