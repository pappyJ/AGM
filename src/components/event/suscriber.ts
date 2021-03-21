/**
 *
 * @description subScribes for event Feature
 */

import { Logger } from 'winston';

declare let _logger: Logger;

const eventEvents = (eventEmitter: any) => {
    eventEmitter.on('New Event', (event: object) => {
        _logger.info(`✅✅✅ ➡ New Event has been created!\nEvent = ${event}`);
    });

    eventEmitter.on('Updated Event', (event: object) => {
        _logger.info(`✅✅✅ ➡ Event has been updated!\nEvent = ${event}`);
    });

    eventEmitter.on('Deleted Event', (event: object) => {
        _logger.info(`✅✅✅ ➡ Event has been updated!\nEvent = ${event}`);
    });

    return eventEmitter;
};

export default eventEvents;
