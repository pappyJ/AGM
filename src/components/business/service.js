// NODE MODULES

// BUSINESS MODULES
const BusinessModel = require('./Model');
const { ApiFeatures } = _include('libraries/shared/utils');
const compEmitter = _include('libraries/suscribers');
const { STATUS, MSG } = _include('libraries/shared/constants');

// end requiring the modules

class BusinessService extends ApiFeatures {
  /**
   * Creates business controller
   * @param {Object} [businessModel = BusinessModel] - Instance of a Mongoose Schema of Announcement Model
   * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
   *
   */

  constructor(businessModel = BusinessModel, eventEmitter = compEmitter) {
    super();
    this.BusinessModel = businessModel;
    this.eventEmitter = eventEmitter;
  }

  /**
   * Creates an Business.
   * @async
   * @param {Object} details - Details required to create a Business.
   * @returns {Object} Returns the created Business
   * @throws Mongoose Error
   */

  async create(details) {
    /**
     * @type {Object} - Holds the created data object.
     */
    const business = await this.BusinessModel.create({ ...details });

    // emits an Event
    this.eventEmitter.emitEvent('New Business', business);

    return {
      value: {
        data: business
      }
    };
  }

  /**
   * Finds one Business Data by it's id or Slug.
   * @async
   * @param {string} id/slug - unique id or slug of the requested data.
   * @returns {Object} Returns the found requested data
   * @throws Mongoose Error
   */
  async get(query, populateOptions = undefined) {
    let businessQuery = this.BusinessModel.findOne({ ...query });

    // TODO: Populate populateOptions
    if (populateOptions !== undefined) businessQuery = businessQuery.populate(populateOptions);
    // else businessQuery = businessQuery.lean();

    const business = await businessQuery;

    if (!business) {
      return {
        error: {
          msg: 'Invalid Business. Business Does Not Exist!',
          code: STATUS.BAD_REQUEST
        }
      }
    }


    return {
      value: {
        data: business
      }
    }
  }

  /**
   * Finds one All Data matching a specified query but returns all if object is empty.
   * @async
   * @param {Object} query - finds data based on queries.
   * @returns {Object} Returns the found requested data
   * @throws Mongoose Error
   */
  async getAll(query) {
    let businesssQuery = this.api(this.BusinessModel, query)
                                .filter()
                                .sort()
                                .limitFields()

    const businesssLength = (await businesssQuery.query.lean()).length;
    
    businesssQuery = businesssQuery.paginate();

    const businesss = await businesssQuery.query.lean();

    const totalBusinesssLength = await this.BusinessModel.totalBusinesssCount();

    return {
      value: {
        data: {
          totalLength: totalBusinesssLength,
          queryLength: businesssLength,
          paginatedLength: businesss.length,
          businesss
        }
      }
    }
  }

  /**
   * Deletes one Business Data by it's id or Slug.
   * @async
   * @param {string} id/slug - unique id or slug of the requested data.
   * @returns {} Returns null
   * @throws Mongoose Error
   */
  async delete(query) {
    const business = await this.BusinessModel.findOneAndDelete({ ...query });

    this.eventEmitter.emitEvent('Deleted Business', business);

    return {
      value: {
        data: business
      }
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
    const business = await this.BusinessModel.findOneAndUpdate(
      query,
      { ...details },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!business) {
      return {
         error: {
           msg: 'Invalid Business. Business Does Not Exist!',
           code: STATUS.BAD_REQUEST
         }
       }
     }

    this.eventEmitter.emitEvent('Updated Business', business);

    return {
      value: {
        data: business
      }
    }
  }
}

module.exports = BusinessService;
