// NODE MODULES

// BLOG MODULES
import EventModel from './Model';
import ApiFeatures from '../../libraries/shared/utils/ApiFeatures';
import compEmitter from '../../libraries/suscribers';
import CONSTANTS from '../../libraries/shared/constants';

const { STATUS } = CONSTANTS;
// end requiring the modules

class EventService extends ApiFeatures {
    /**
     * Creates event controller
     * @param {Object} [eventModel = EventModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    EventModel: any;
    eventEmitter: any;

    constructor(eventModel = EventModel, eventEmitter = compEmitter) {
        super();
        this.EventModel = eventModel;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Creates an Event.
     * @async
     * @param {Object} details - Details required to create a Event.
     * @returns {Object} Returns the created Event
     * @throws Mongoose Error
     */

    async create(details: object) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const event = await this.EventModel.create({ ...details });

        // emits an Event
        this.eventEmitter.emitEvent('New Event', event);

        return {
            value: {
                data: event,
            },
        };
    }

    /**
     * Finds one Event Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let eventQuery = this.EventModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            eventQuery = eventQuery.populate(populateOptions);
        // else eventQuery = eventQuery.lean();

        const event = await eventQuery;

        if (!event) {
            return {
                error: {
                    msg: 'Invalid Event. Event Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: event,
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
        let eventsQuery = this.api(this.EventModel, query)
            .filter()
            .sort()
            .limitFields();

        const eventsLength = (await eventsQuery.query.lean()).length;

        eventsQuery = eventsQuery.paginate();

        const events = await eventsQuery.query.lean();

        const totalEventsLength = await this.EventModel.totalEventsCount();

        return {
            value: {
                data: {
                    totalLength: totalEventsLength,
                    queryLength: eventsLength,
                    paginatedLength: events.length,
                    events,
                },
            },
        };
    }

    /**
     * Deletes one Event Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const event = await this.EventModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted Event', event);

        return {
            value: {
                data: event,
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
        const event = await this.EventModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!event) {
            return {
                error: {
                    msg: 'Invalid Event. Event Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        this.eventEmitter.emitEvent('Updated Event', event);

        return {
            value: {
                data: event,
            },
        };
    }
}

export default EventService;
