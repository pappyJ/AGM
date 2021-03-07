import compEmitter from './compEmitter';

let eventBucket = compEmitter;

import userEvents from '../../components/users/suscriber';
import layoutEvents from '../../components/layout/suscriber';
import contactEvents from '../../components/contact/suscriber';

const compose = (fn1: Function, ...fns: Function[]) => (emitter: any) =>
    fn1(
        fns.reduce(
            (returnedData, currentFn) => currentFn(returnedData),
            emitter
        )
    );

eventBucket = compose(userEvents, layoutEvents, contactEvents)(eventBucket);

export default eventBucket;
