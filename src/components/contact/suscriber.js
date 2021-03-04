const { Email } = _include('libraries/shared/utils');

/**
 *
 * @description subScribes for contact Feature
 */

const contactEvents = (eventEmitter) => {
    eventEmitter.on('New Contact', (contact) => {
        _logger.info(
            `✅✅✅ ➡ New Contact has been created!\nContact = ${contact}`
        );
    });

    eventEmitter.on('Updated Contact', (contact) => {
        _logger.info(
            `✅✅✅ ➡ Contact has been updated!\nContact = ${contact}`
        );
    });

    eventEmitter.on('Deleted Contact', (contact) => {
        _logger.info(
            `✅✅✅ ➡ Contact has been updated!\nContact = ${contact}`
        );
    });

    return eventEmitter;
};

module.exports = contactEvents;
