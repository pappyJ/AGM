/**
 *
 * @description subScribes for layout Feature
 */

const layoutEvents = (eventEmitter) => {
    eventEmitter.on('New Layout', (layout) => {
        _logger.info(
            `✅✅✅ ➡ New Layout has been created!\nLayout = ${layout}`
        );
    });

    eventEmitter.on('Updated Layout', (layout) => {
        _logger.info(`✅✅✅ ➡ Layout has been updated!\nLayout = ${layout}`);
    });

    eventEmitter.on('Deleted Layout', (layout) => {
        _logger.info(`✅✅✅ ➡ Layout has been updated!\nLayout = ${layout}`);
    });

    return eventEmitter;
};

module.exports = layoutEvents;
