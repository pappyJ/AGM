/**
 *
 * @description subScribes for user Feature
 */
import { Logger } from 'winston';
import compEmitter from '../../libraries/suscribers';

declare let _logger: Logger;

const userEvents = (eventEmitter: typeof compEmitter) => {
    eventEmitter.on('New User', (user: object) => {
        _logger.info(`✅✅✅ ➡ New User has been created!\nUser = ${user}`);
    });

    eventEmitter.on('Updated User', (user: object) => {
        _logger.info(`✅✅✅ ➡ User has been updated!\nUser = ${user}`);
    });

    eventEmitter.on('Deleted User', (user: object) => {
        _logger.info(`✅✅✅ ➡ User has been updated!\nUser = ${user}`);
    });

    return eventEmitter;
};

export default userEvents;
