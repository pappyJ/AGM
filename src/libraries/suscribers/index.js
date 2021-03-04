let compEmitter = require('./compEmitter');

const userEvents = _include('components/users/suscriber');
const adminEvents = _include('components/admin/suscriber');
const authEvents = _include('components/auth/suscriber');
const layoutEvents = _include('components/layout/suscriber');
const contactEvents = _include('components/contact/suscriber');

const compose = (fn1, ...fns) => (emitter) =>
    fn1(
        fns.reduce(
            (returnedData, currentFn) => currentFn(returnedData),
            emitter
        )
    );

compEmitter = compose(
    userEvents,
    adminEvents,
    authEvents,
    layoutEvents,
    contactEvents
)(compEmitter);

module.exports = compEmitter;
