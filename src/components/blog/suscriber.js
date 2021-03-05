/**
 *
 * @description subScribes for blog Feature
 */

const blogEvents = (eventEmitter) => {
    eventEmitter.on('New Blog', (blog) => {
        _logger.info(`✅✅✅ ➡ New Blog has been created!\nBlog = ${blog}`);
    });

    eventEmitter.on('Updated Blog', (blog) => {
        _logger.info(`✅✅✅ ➡ Blog has been updated!\nBlog = ${blog}`);
    });

    eventEmitter.on('Deleted Blog', (blog) => {
        _logger.info(`✅✅✅ ➡ Blog has been updated!\nBlog = ${blog}`);
    });

    return eventEmitter;
};

module.exports = blogEvents;
