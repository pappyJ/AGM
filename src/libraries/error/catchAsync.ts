import { Request, Response, NextFunction } from 'express';

declare let _logger: any;

const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch((err: Error) => {
            _logger.error(err.stack);
            next(err);
        });
    };
};

export default catchAsync;
