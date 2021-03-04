const { Email } = _include('libraries/shared/utils');

/**
 *
 * @description subScribes for gallery Feature
 */

const galleryEvents = (eventEmitter) => {
  eventEmitter.on('New Gallery', (gallery) => {
    _logger.info(`✅✅✅ ➡ New Gallery has been created!\nGallery = ${gallery}`);
  });

  eventEmitter.on('Updated Gallery', (gallery) => {
    _logger.info(`✅✅✅ ➡ Gallery has been updated!\nGallery = ${gallery}`);
  });

  eventEmitter.on('Deleted Gallery', (gallery) => {
    _logger.info(`✅✅✅ ➡ Gallery has been updated!\nGallery = ${gallery}`);
  });

  return eventEmitter;
};

module.exports = galleryEvents;
