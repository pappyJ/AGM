// NODE MODULES

// USER MODULES
import AdminModel from './Model.js';
import ApiFeatures from '../../libraries/shared/utils/ApiFeatures';
import compEmitter from '../../libraries/suscribers';
import CONSTANTS from '../../libraries/shared/constants';

const { STATUS } = CONSTANTS;

// end requiring the modules

class AdminService extends ApiFeatures {
    AdminModel: any;
    eventEmitter: any;
    /**
     * Creates admin controller
     * @param {Object} [adminModel = AdminModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    constructor(adminModel = AdminModel, eventEmitter = compEmitter) {
        super();
        this.AdminModel = adminModel;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Creates an Admin.
     * @async
     * @param {Object} details - Details required to create a Admin.
     * @returns {Object} Returns the created Admin
     * @throws Mongoose Error
     */

    async create(details: object) {
        /**
         * @type {Object} - Holds the created data object.
         */

        if (!(await this.AdminModel.registerAsAdmin())) {
            return {
                error: {
                    msg: 'You Cannot Register As An Admin!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        const admin = await this.AdminModel.create({ ...details });

        if (!admin) {
            return {
                error: {
                    msg: 'Error Creating Admin',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        // emits an Event
        this.eventEmitter.emitEvent('New Admin', admin);

        return {
            value: admin,
        };
    }

    async getAll(query: any) {
        const adminsQuery = this.api(this.AdminModel, query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const admins = await adminsQuery.query.lean();

        return {
            value: {
                data: admins,
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

    async logIn({ email, password }: { [unit: string]: string }) {
        const admin = await this.AdminModel.findByEmail(email);

        if (!admin || !(await admin.validPassword(password))) {
            return {
                error: {
                    msg: 'Invalid Email or Password!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: admin,
            },
        };
    }

    /**
     * Finds one User Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: string, populateOptions = undefined) {
        let adminQuery = this.AdminModel.findByEmail(query);

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            adminQuery = adminQuery.populate(populateOptions);
        // else userQuery = userQuery.lean();

        const admin = await adminQuery;

        if (!admin) {
            return {
                error: {
                    msg: 'Invalid User. Admin Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: admin,
            },
        };
    }
}

export default AdminService;
