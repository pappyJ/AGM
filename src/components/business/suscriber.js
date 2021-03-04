const { Email } = _include('libraries/shared/utils');

/**
 *
 * @description subScribes for business Feature
 */

const businessEvents = (eventEmitter) => {
  eventEmitter.on('New Business', (business) => {
    _logger.info(`✅✅✅ ➡ New Business has been created!\nBusiness = ${business}`);
  });

  eventEmitter.on('Updated Business', (business) => {
    _logger.info(`✅✅✅ ➡ Business has been updated!\nBusiness = ${business}`);
  });

  eventEmitter.on('Deleted Business', (business) => {
    _logger.info(`✅✅✅ ➡ Business has been updated!\nBusiness = ${business}`);
  });

  return eventEmitter;
};

module.exports = businessEvents;
