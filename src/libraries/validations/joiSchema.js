const Joi = require('joi');

const users = _include('components/users/sanitize');
const admin = _include('components/admin/sanitize');
const blog = _include('components/blog/sanitize');
const business = _include('components/business/sanitize');
const product = _include('components/product/sanitize');
const gallery = _include('components/gallery/sanitize');
const layout = _include('components/layout/sanitize');
const contact = _include('components/contact/sanitize');

const { AppError, catchAsync } = _include('libraries/error');
// const { selectProps } = _include('libraries/shared/helpers/helper');

const validate = {
    ...users,
    ...admin,
    ...blog,
    ...business,
    ...product,
    ...gallery,
    ...layout,
    ...contact,
};

exports.reqValidate = (endpoint) => {
    return (req, res, next) => {
        let request = {};

        if (!validate[endpoint]) {
            return next(new AppError('Something went wrong!', 500));
        }

        const data = {
            params: req.params,
            body: req.body,
        };

        const request_methods = {
            GET: { ...data },
            POST: { ...data },
            PATCH: { ...data },
            DELETE: { ...data },
        };

        const requestData = request_methods[req.method];

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

            let errorKey = error.details[0].context.key;
            let errorLabel = error.details[0].context.label;

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
