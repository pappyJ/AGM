import path from 'path';
import express from 'express';
import logger from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import cors from 'cors';
import expressSession from 'express-session';

// user custom modules
import ErroHandler from './libraries/error';

const { AppError, errorController: globalErrorHandler } = ErroHandler;

import HELPERS from './libraries/shared/helpers';

import Event from './components/event';

import Gallery from './components/gallery';

import Admin from './components/admin';

import Contact from './components/contact';

//routers

// const { Router: productRouter } = _include('components/product');
// const { Router: layoutRouter } = _include('components/layout');

const { Router: eventRouter } = Event;

const { Router: galleryRouter } = Gallery;

const { Router: adminRouter } = Admin;

const { Router: contactRouter } = Contact;

//helpers

const { sessionParams, corsOptions } = HELPERS;

const corsSetup = cors(corsOptions);

// const { passportAuth } = _include('libraries/config');

const app = express();

//trust proxy

app.set('trust proxy', 1);

// GLOBAL MIDDLEWARES

// TEMPLATE ENGINE INITIALIZATION
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, './libraries/views'));

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
} else {
    app.use(logger('tiny'));
}

// PASSPORT STRATEGY
// passportAuth(passport, undefined, User);

// EXPRESS SESSION FOR PASSPORT
// const sessionOptions = expressSession(sessionParams);

// IMPLEMENTING CORS FOR ALL ROUTES
app.options('*', corsSetup);

const SESSION_CREDENTIALS = sessionParams(expressSession);

app.use(expressSession({ ...SESSION_CREDENTIALS }));

// PASSPORT INIT

// app.use(passport.initialize());
// app.use(passport.session());

// BODY-PARSER, READING DATA = body INTO req.body
app.use(express.json({ limit: '10kb' }));

// GRABBING URL QUERIES
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// SET SECURITY HEADERS
app.use(helmet());

// SERVING STATIC FILES
// app.use(express.static(path.join(__dirname, './libraries/views')));

// PREVENT PARAMETER POLLUTION
app.use(
    hpp({
        whitelist: [],
    })
);

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// COMPRESSING TEXT RESPONSES
// app.use(compression()); // USED DURING PRODUCTION PHASE

app.use(cors(corsOptions));

// IMPLEMENTING RATE LIMITING
// TODO: Make Function Flexible by implementing parameter injection for rate limit expiration time
// const limitUser = rateLimiter(50);

// ROUTES

// setting the rate limiters

// app.use('/', limitUser);

// Would be moved to a seperate module

// Homepage

app.get('/', (_, res) => {
    res.render('index');
});

// MAINTAINANCE ENDPOINT
app.get('/maintainance', (req, res) => {
    res.status(200).send('<h1>We Are Currently Undergoing Maintance</h1>');
});

app.get('/api/v1', (_, res) => {
    res.status(200).send('<h1>Welcome to AGM Api</h1>');
});

app.use('/api/v1/events', eventRouter);

app.use('/api/v1/admins', adminRouter);

app.use('/api/v1/contacts', contactRouter);

app.use('/api/v1/galleries', galleryRouter);

// app.use('/api/v1/layouts', layoutRouter);
// app.use('/api/v1/businesses', businessRouter);
// app.use('/api/v1/products', productRouter);

app.all('*', (req, res, next) => {
    return next(
        new AppError(
            `Wrong url '${req.originalUrl}'. This url doesn't exist!`,
            404
        )
    );
});

app.use(globalErrorHandler);

export default app;
