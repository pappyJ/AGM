/* eslint-disable no-unused-vars */

import './_globals';
import { Logger } from 'winston';

import mongoose from 'mongoose';

import dotenv from 'dotenv';

interface customLogger extends Logger {
    exception: (name: Error) => Logger;

    rejection: (name: Error) => Logger;
}

declare let _logger: customLogger;

declare let _include: Function;

dotenv.config({ path: './src/libraries/config/config.env' });

const {
    config: { database, env },
} = _include('libraries/config');

// end of requiring core  and 3rd party modules

// starting express server and connecting to database
process.on('uncaughtException', (err) => {
    _logger.log(
        'error',
        '❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNCAUGHT EXCEPTION ERROR ⬇⬇⬇'
    );
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
    };

    // log error to console
    _logger.log('error', error.stack);

    // send error to log file
    _logger.exception(error);

    setTimeout(() => {
        process.exit(1);
    }, 100);
});

const DB_PROD = process.env
    .DATABASE!.replace('<dbname>', process.env.DB_NAME!)
    .replace('<password>', process.env.DB_PASSWORD!);

const PORT = env.PORT;

const DB_DEV = database.LOCAL;

const DATABASE = process.env.NODE_ENV === 'development' ? DB_DEV : DB_PROD;

mongoose
    .connect(DATABASE, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        _logger.log('info', '✅✅✅ ➡ DATABASE CONNECTION IS SUCCESSFUL!');
    })
    .catch((err: Error) => {
        // log to console
        _logger.log('error', err);
        console.log(err);
        // save to error log file
        _logger.error(err);
    });

// const db = mongoose.connection;

import app from './app';

const server = app.listen(PORT, async () => {
    _logger.log(
        'info',
        `ℹℹℹ LISTENING TO SERVER http://127.0.0.1:${PORT} ON PORT ${PORT} ℹℹℹ`
    );
});

// server.clearDatabase = () => {
//   mongoose.connection.db.dropDatabase();
// };

process.on('unhandledRejection', async (err: Error) => {
    _logger.log(
        'error',
        '❌❌❌ ➡ ⬇⬇⬇ An Error occured -> UNHANDLED REJECTION ERROR ⬇⬇⬇'
    );
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
    };

    // log error to console
    _logger.log('error', error);

    // send error to log file
    _logger.rejection(error);

    server.close(() => {
        process.exit(1);
    });
});

module.exports = server;
