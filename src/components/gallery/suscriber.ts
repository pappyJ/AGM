/**
 *
 * @description subScribes for gallery Feature
 */

import { Logger } from 'winston';

declare let _logger: Logger;

const galleryEvents = (eventEmitter: any) => {
    eventEmitter.on('New Gallery Image', (gallery: object) => {
        _logger.info(
            `✅✅✅ ➡ New Gallery Image has been created!\nGallery = ${gallery}`
        );
    });

    eventEmitter.on('Updated Gallery', (gallery: object) => {
        _logger.info(
            `✅✅✅ ➡ Gallery has been updated!\nGallery = ${gallery}`
        );
    });

    eventEmitter.on('Deleted Gallery Image', (gallery: object) => {
        _logger.info(
            `✅✅✅ ➡ Gallery Image has been updated!\nGallery = ${gallery}`
        );
    });

    return eventEmitter;
};

export default galleryEvents;
