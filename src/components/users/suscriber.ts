/**
 *
 * @description subScribes for user Feature
 */
import { Logger } from 'winston';

interface customLogger extends Logger {
    exception: (name: Error) => Logger;

    rejection: (name: Error) => Logger;
}

declare let _logger: customLogger;

const userEvents = (eventEmitter: any) => {
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
