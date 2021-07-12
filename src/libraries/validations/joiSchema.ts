import Joi from 'joi';

import { Request, Response, NextFunction, RequestHandler } from 'express';

declare const _include: Function;

const users = _include('components/users/sanitize');
const admin = _include('components/admin/sanitize');
const event = _include('components/event/sanitize');
const business = _include('components/business/sanitize');
const product = _include('components/product/sanitize');
const gallery = _include('components/gallery/sanitize');
const layout = _include('components/layout/sanitize');
const contact = _include('components/contact/sanitize');

const { AppError } = _include('libraries/error');

const validate = {
    ...users,
    ...admin,
    ...event,
    ...business,
    ...product,
    ...gallery,
    ...layout,
    ...contact,
};

export const reqValidate = (endpoint: string): RequestHandler => {
    return (req: Request, _: Response, next: NextFunction) => {
        let request = {};

        if (!validate[endpoint]) {
            return next(new AppError('Something went wrong!', 500));
        }

        const data = {
            params: req.params,
            body: req.body,
        };

        enum REQUEST_METHODS {
            GET,
            POST,
            PATCH,
            DELETE,
        }

        type k = keyof typeof REQUEST_METHODS;

        const request_methods: {
            [REQUEST_METHODS in k]: typeof data;
        } = {
            GET: { ...data },
            POST: { ...data },
            PATCH: { ...data },
            DELETE: { ...data },
        };

        const requestData = request_methods[req.method as k];

        const schema = Joi.object({
            ...validate[endpoint].params,
            ...validate[endpoint].body,
        });

        const { value, error } = schema.validate({
            ...requestData.params,
            ...requestData.body,
        });

        if (error) {
            let msg = error.message;

            let errorKey = error.details[0]?.context?.key;
            let errorLabel = error.details[0]?.context?.label;

            if (errorKey)
                if (req.params[errorKey]) {
                    msg = msg.replace(
                        `"${errorLabel}"`,
                        `'${req.params[errorKey]}'`
                    );
                    msg += ' in url parameters.';
                } else {
                    msg = msg.replace(
                        `"${errorLabel}"`,
                        `'${errorLabel}' : '${req.body[errorKey]}'`
                    );
                    msg += ' in JSON body.';
                }

            // msg = msg.replace(/"/g, "'");
            return next(new AppError(msg, 400));
        }

        req.params = { ...requestData.params };
        req.body = { ...requestData.body };

        next();
    };
};
