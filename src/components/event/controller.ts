// NODE MODULES

// BLOG MODULES
import EventService from './service';

import { Request, Response, NextFunction, RequestHandler } from 'express';

import ErroHandler from '../../libraries/error';

import CONSTANT from '../../libraries/shared/constants';

const { AppError, catchAsync } = ErroHandler;

const { STATUS, MSG } = CONSTANT;

// end of requiring the modules
/**
/**
 * @type {Object.<EventService>} - Instance of EventService class
 */
const eventServiceInstance = new EventService();

// BLOG AUTHENTICATION CONTROLLERS
/**
 * Event Controller class
 * @class
 */

interface EventServiceType {
    [unit: string]: any;
}

interface CustomRequest extends Request {
    user: { [unit: string]: any };
}

class EventController {
    /**
     * @description Creates event controller
     * @param {Object} [eventService = eventServiceInstance] - same as eventServiceInstance Object
     *
     */
    public EventService: EventServiceType;

    constructor(eventService = eventServiceInstance) {
        /**
         * @type {Object}
         * @borrows eventService
         */
        this.EventService = eventService;
    }

    /**
     * Creates a Event
     * @async
     * @route {POST} /event/
     * @access protected
     */
    createEvent: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response) => {
            /**
             * @type {Object} - An Object of fields required for creating a Event.
             */
            const eventDetails = { ...req.body };

            // if (
            //     JSON.stringify(req.user._id) !== JSON.stringify(eventDetails.creator)
            // ) {
            //     return next(
            //         new AppError(
            //             'You Are Not Authorized To Create A Event! Please Log In',
            //             400
            //         )
            //     );
            // }

            eventDetails.creator = req.user._id;
            /**
             * @type {Object} - Holds the created data object.
             */
            const {
                value: { data: event = {} } = {},
            } = await this.EventService.create(eventDetails);

            // Returns a json response
            res.status(STATUS.CREATED).json({
                message: MSG.SUCCESS,
                event,
            });
        }
    );

    /**
     * Gets one Event Data
     * @async
     * @route {GET} /event/:slug or :/id
     * @access public
     */
    getEvent: RequestHandler = catchAsync(
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
                value: { data: event = {} } = {},
            } = await this.EventService.get(
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
                event,
            });
        }
    );

    /**
     * Gets All Event Datas
     * @async
     * @route {GET} /events/
     * @access public
     */
    getAllEvents = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         *
         * @empty - Returns Whole Data In Events Collection
         */
        const queryFields = { ...req.query };

        /**
         * @type {Object|null} - Holds either the returned data object or null.
         */
        const {
            value: { data: events = {} } = {},
        } = await this.EventService.getAll(queryFields);

        // Returns a json response
        res.status(STATUS.OK).json({
            message: MSG.SUCCESS,
            events,
        });
    });

    deleteEvent = catchAsync(async (req: Request, res: Response) => {
        /**
         * @type {Object} - An Object of fields to be queried.
         */
        const queryFields = { ...req.params };
        /**
         * @type {Object|null} - Holds either the returned data object or null.
         *
         * @describtion Use Either a mongodbUniqueId Or Slug to Search
         */

        await this.EventService.delete(queryFields);

        // Returns a json response
        res.status(STATUS.NO_CONTENT).json({
            message: MSG.SUCCESS,
        });
    });

    /**
     * @route {GET} - /events/:id or /:slug
     */

    updateEvent = catchAsync(
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
                value: { data: event = {} } = {},
            } = await this.EventService.update(queryParams, queryFields);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            // Returns a json response
            res.status(STATUS.ACCEPTED).json({
                message: MSG.SUCCESS,
                event,
            });
        }
    );
}

const eventCntrl = new EventController();

export default eventCntrl;
