import { Error } from 'mongoose';
import logger from './logger';
// import * as Reflect from 'reflect-metadata';

const base_dir = __dirname;

const abs_path = function (path: string) {
    return base_dir + path;
};

const _logger = logger;

const _include = function (file: string) {
    // console.log(file);
    const main = '/';
    const lib = 'libraries/';
    const comp = 'components/';

    let error;
    let path;

    try {
        return require(abs_path(main + file));
    } catch (err) {
        const error = err as Error;
        if (error.stack) _logger.error(error.stack);
    }
};

// ASSIGN _include to global object
Object.defineProperty(global, '_include', {
    value: _include,
    writable: false,
    configurable: false,
});

Object.defineProperty(global, '_logger', {
    value: logger,
    writable: false,
    configurable: false,
});

// Object.defineProperty(global, 'Reflect', {
//     value: Reflect,
//     writable: true,
//     configurable: true,
// });
