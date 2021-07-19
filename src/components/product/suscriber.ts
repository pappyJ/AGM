/**
 *
 * @description subScribes for business Feature
 */

import { Logger } from 'winston';

import compEmitter from '../../libraries/suscribers';

declare let _logger: Logger;

const businessEvents = (eventEmitter: typeof compEmitter) => {
    eventEmitter.on('New Business', (business: object) => {
        _logger.info(
            `✅✅✅ ➡ New Business has been created!\nBusiness = ${business}`
        );
    });

    eventEmitter.on('Updated Business', (business: object) => {
        _logger.info(
            `✅✅✅ ➡ Business has been updated!\nBusiness = ${business}`
        );
    });

    eventEmitter.on('Deleted Business', (business: object) => {
        _logger.info(
            `✅✅✅ ➡ Business has been updated!\nBusiness = ${business}`
        );
    });

    return eventEmitter;
};

module.exports = businessEvents;
