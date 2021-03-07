import { Logger } from 'winston';

/**
 *
 * @description subScribes for admin Feature
 */

declare let _logger: Logger;

const adminEvents = (eventEmitter: any) => {
    eventEmitter.on('New Admin', (admin: object) => {
        _logger.info(`✅✅✅ ➡ New Admin has been created!\nAdmin = ${admin}`);
    });

    return eventEmitter;
};

module.exports = adminEvents;
