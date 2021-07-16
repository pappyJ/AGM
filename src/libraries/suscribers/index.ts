import compEmitter from './compEmitter';

let eventBucket = compEmitter;

import userEvents from '../../components/users/suscriber';
import contactEvents from '../../components/contact/suscriber';
import galleryEvents from '../../components/gallery/suscriber';
import eventEvents from '../../components/event/suscriber';

const compose =
    (fn1: Function, ...fns: Function[]) =>
    (emitter: typeof compEmitter) =>
        fn1(
            fns.reduce(
                (returnedData, currentFn) => currentFn(returnedData),
                emitter
            )
        );

eventBucket = compose(
    userEvents,
    contactEvents,
    galleryEvents,
    eventEvents
)(eventBucket);

export default eventBucket;
