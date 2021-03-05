// NODE MODULES

// BLOG MODULES
import BlogService from './service';

import ErroHandler from '../../libraries/error';

import CONSTANT from '../../libraries/shared/constants';

const { AppError, catchAsync } = ErroHandler;

const { STATUS, MSG } = CONSTANT;

// end of requiring the modules
/**
/**
 * @type {Object.<BlogService>} - Instance of BlogService class
 */
const blogServiceInstance = new BlogService();

// BLOG AUTHENTICATION CONTROLLERS
/**
 * Blog Controller class
 * @class
 */

class BlogController {
    /**
     * @description Creates blog controller
     * @param {Object} [blogService = blogServiceInstance] - same as blogServiceInstance Object
     *
     */
    constructor(blogService = blogServiceInstance) {
        /**
         * @type {Object}
         * @borrows blogService
         */
        this.BlogService = blogService;
    }

    /**
     * Creates a Blog
     * @async
     * @route {POST} /blog/
     * @access protected
     */
    createBlog = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields required for creating a Blog.
         */
        const blogDetails = { ...req.body };

        // if (
        //     JSON.stringify(req.user._id) !== JSON.stringify(blogDetails.creator)
        // ) {
        //     return next(
        //         new AppError(
        //             'You Are Not Authorized To Create A Blog! Please Log In',
        //             400
        //         )
        //     );
        // }

        blogDetails.creator = req.user._id;
        /**
         * @type {Object} - Holds the created data object.
         */
        const {
            value: { data: blog = {} } = {},
        } = await this.BlogService.create(blogDetails);

        // Returns a json response
        res.status(STATUS.CREATED).json({
            message: MSG.SUCCESS,
            blog,
        });
    });

    /**
     * Gets one Blog Data
     * @async
     * @route {GET} /blog/:slug or :/id
     * @access public
     */
    getBlog = catchAsync(async (req, res, next) => {
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
            value: { data: blog = {} } = {},
        } = await this.BlogService.get(
            { slug: queryFields.slug },
            { path: 'creator' }
        );

        // Checks if data returned is null
        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            blog,
        });
    });

    /**
     * Gets All Blog Datas
     * @async
     * @route {GET} /blogs/
     * @access public
     */
    getAllBlogs = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Blogs Collection
         */
        const queryFields = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const {
            value: { data: blogs = {} } = {},
        } = await this.BlogService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            blogs,
        });
    });

    deleteBlog = catchAsync(async (req, res, next) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         */
        const queryFields = { ...req.params };
        /**
         * @type {Object|null} - Holds either the returned data object or null.
         *
         * @describtion Use Either a mongodbUniqueId Or Slug to Search
         */

        await this.BlogService.delete(queryFields);

        // Returns a json response
        res.status(STATUS.NO_CONTENT).json({
            message: MSG.SUCCESS,
        });
    });

    /**
     * @route {GET} - /blogs/:id or /:slug
     */

    updateBlog = catchAsync(async (req, res, next) => {
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
            value: { data: blog = {} } = {},
        } = await this.BlogService.update(queryParams, queryFields);

        if (error) {
            return next(new AppError(error.msg, error.code));
        }

        // Returns a json response
        res.status(STATUS.ACCEPTED).json({
            message: MSG.SUCCESS,
            blog,
        });
    });
}

const blogCntrl = new BlogController();

export default blogCntrl;
