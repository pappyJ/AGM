// NODE MODULES

// BLOG MODULES
const BlogModel = require('./Model');
import ApiFeatures from '../../libraries/shared/utils/ApiFeatures';
const compEmitter = _include('libraries/suscribers');
const { STATUS, MSG } = _include('libraries/shared/constants');

// end requiring the modules

class BlogService extends ApiFeatures {
    /**
     * Creates blog controller
     * @param {Object} [blogModel = BlogModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(blogModel = BlogModel, eventEmitter = compEmitter) {
        super();
        this.BlogModel = blogModel;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Creates an Blog.
     * @async
     * @param {Object} details - Details required to create a Blog.
     * @returns {Object} Returns the created Blog
     * @throws Mongoose Error
     */

    async create(details) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const blog = await this.BlogModel.create({ ...details });

        // emits an Event
        this.eventEmitter.emitEvent('New Blog', blog);

        return {
            value: {
                data: blog,
            },
        };
    }

    /**
     * Finds one Blog Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query, populateOptions = undefined) {
        let blogQuery = this.BlogModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            blogQuery = blogQuery.populate(populateOptions);
        // else blogQuery = blogQuery.lean();

        const blog = await blogQuery;

        if (!blog) {
            return {
                error: {
                    msg: 'Invalid Blog. Blog Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: blog,
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
        let blogsQuery = this.api(this.BlogModel, query)
            .filter()
            .sort()
            .limitFields();

        const blogsLength = (await blogsQuery.query.lean()).length;

        blogsQuery = blogsQuery.paginate();

        const blogs = await blogsQuery.query.lean();

        const totalBlogsLength = await this.BlogModel.totalBlogsCount();

        return {
            value: {
                data: {
                    totalLength: totalBlogsLength,
                    queryLength: blogsLength,
                    paginatedLength: blogs.length,
                    blogs,
                },
            },
        };
    }

    /**
     * Deletes one Blog Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query) {
        const blog = await this.BlogModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted Blog', blog);

        return {
            value: {
                data: blog,
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
        const blog = await this.BlogModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!blog) {
            return {
                error: {
                    msg: 'Invalid Blog. Blog Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        this.eventEmitter.emitEvent('Updated Blog', blog);

        return {
            value: {
                data: blog,
            },
        };
    }
}

module.exports = BlogService;
