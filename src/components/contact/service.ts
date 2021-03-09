// NODE MODULES

// BUSINESS MODULES
import ContactModel from './Model';
import ApiFeatures from '../../libraries/shared/utils/ApiFeatures';
import compEmitter from '../../libraries/suscribers';
import CONSTANTS from '../../libraries/shared/constants';
import Email from '../../libraries/shared/utils/Email';

const { STATUS } = CONSTANTS;

// end requiring the modules

class ContactService extends ApiFeatures {
    /**
     * Creates contact controller
     * @param {Object} [contactModel = ContactModel] - Instance of a Mongoose Schema of Announcement Model
     * @param {Object} [eventEmitter = compEmitter] - Instance of an Emitter that suscribes to a database operation
     *
     */

    ContactModel: any;
    eventEmitter: any;

    constructor(contactModel = ContactModel, eventEmitter = compEmitter) {
        super();
        this.ContactModel = contactModel;
        this.eventEmitter = eventEmitter;
    }

    /**
     * Creates an Contact.
     * @async
     * @param {Object} details - Details required to create a Contact.
     * @returns {Object} Returns the created Contact
     * @throws Mongoose Error
     */

    async create(details: object) {
        /**
         * @type {Object} - Holds the created data object.
         */
        const contact = await this.ContactModel.create({ ...details });

        // emits an Event
        this.eventEmitter.emitEvent('New Contact', contact);

        return {
            value: {
                data: contact,
            },
        };
    }

    /**
     * Finds one Contact Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {Object} Returns the found requested data
     * @throws Mongoose Error
     */
    async get(query: object, populateOptions = undefined) {
        let contactQuery = this.ContactModel.findOne({ ...query });

        // TODO: Populate populateOptions
        if (populateOptions !== undefined)
            contactQuery = contactQuery.populate(populateOptions);
        // else contactQuery = contactQuery.lean();

        const contact = await contactQuery;

        if (!contact) {
            return {
                error: {
                    msg: 'Invalid Contact. Contact Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        return {
            value: {
                data: contact,
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
        let contactsQuery = this.api(this.ContactModel, query)
            .filter()
            .sort()
            .limitFields();

        const contactsLength = (await contactsQuery.query.lean()).length;

        contactsQuery = contactsQuery.paginate();

        const contacts = await contactsQuery.query.lean();

        const totalContactsLength = await this.ContactModel.totalContactsCount();

        return {
            value: {
                data: {
                    totalLength: totalContactsLength,
                    queryLength: contactsLength,
                    paginatedLength: contacts.length,
                    contacts,
                },
            },
        };
    }

    /**
     * Deletes one Contact Data by it's id or Slug.
     * @async
     * @param {string} id/slug - unique id or slug of the requested data.
     * @returns {} Returns null
     * @throws Mongoose Error
     */
    async delete(query: object) {
        const contact = await this.ContactModel.findOneAndDelete({ ...query });

        this.eventEmitter.emitEvent('Deleted Contact', contact);

        return {
            value: {
                data: contact,
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
    async update(query: object, details: any) {
        //verify document's availability

        const findContact = await this.ContactModel.findOne(query);

        if (!findContact) {
            return {
                error: {
                    msg: 'Invalid Contact. Contact Does Not Exist!',
                    code: STATUS.BAD_REQUEST,
                },
            };
        }

        //add to document

        // example request

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

        // remove data from document

        // example request

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

        // object documents

        // example request

        // {
        //     "operation": "pull",

        //     "field": "socials",

        //     "subset": "facebook"

        //     "data":
        //         [{
        //             "seetter": "facebookHandle.com",
        //
        //         }]

        // }

        details.subset
            ? (details.$set = {
                  [`${details.field}.${details.subset}`]: details.data.setter,
              })
            : '';

        const contact = await this.ContactModel.findOneAndUpdate(
            query,
            { ...details },
            {
                new: true,
                runValidators: true,
            }
        );

        this.eventEmitter.emitEvent('Updated Contact', contact);

        return {
            value: {
                data: contact,
            },
        };
    }

    /**
 * @params - {query} - Object containg sender's details
 * 
 * @description - user Object Example = {
            from: 'mail@exmple.com,
            name: 'username',
            keyMessage: 'message to be sent',
        },
 */
    async executeMail(query: { [unit: string]: string }) {
        const Mail = new Email(query);

        const subject = `Feedback Mail From ${query.name} Email: <${query.email}>`;

        const { error, value } = await Mail.send(subject);

        if (error) {
            return {
                error,
            };
        } else
            return {
                value: {
                    message: 'Mail Sent Successfully',
                },
            };
    }
}

export default ContactService;
