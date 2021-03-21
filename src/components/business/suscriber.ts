/**
 *
 * @description subScribes for business Feature
 */

import { Logger } from 'winston';

declare let _logger: Logger;

const businessEvents = (eventEmitter: any) => {
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
