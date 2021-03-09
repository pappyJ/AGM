import { Logger } from 'winston';

/**
 *
 * @description subScribes for contact Feature
 */

declare let _logger: Logger;

const contactEvents = (eventEmitter: any) => {
    eventEmitter.on('New Contact', (contact: object) => {
        _logger.info(
            `✅✅✅ ➡ New Contact has been created!\nContact = ${contact}`
        );
    });

    eventEmitter.on('Updated Contact', (contact: object) => {
        _logger.info(
            `✅✅✅ ➡ Contact has been updated!\nContact = ${contact}`
        );
    });

    eventEmitter.on('Deleted Contact', (contact: object) => {
        _logger.info(
            `✅✅✅ ➡ Contact has been updated!\nContact = ${contact}`
        );
    });

    return eventEmitter;
};

module.exports = contactEvents;
