/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */

import { Request, Response, NextFunction, RequestHandler } from 'express';

import { Logger } from 'winston';

import ErroHandler from '../../libraries/error';

import CONSTANTS from '../../libraries/shared/constants';

const { catchAsync, AppError } = ErroHandler;

const { STATUS } = CONSTANTS;

import { Session } from 'express-session';

interface RequestWithCustomPrpos extends Request {
    user?: { [unit: string]: any };
}

export type SessionWithCustomPrpos = Session & {
    email?: string;
    password?: string | number;
    token?: number;
    tokenExpires?: number;
    passwordTimer?: number;
};

export type CustomRequest = RequestWithCustomPrpos &
    SessionWithCustomPrpos & {
        session?: SessionWithCustomPrpos;
    };

declare let _logger: Logger;

interface UserServiceType {
    [unit: string]: any;
}

// end requiring the modules
class Authentication {
    public Service: UserServiceType;

    constructor(ComponentService: UserServiceType) {
        this.Service = ComponentService;
    }

    activeSession: RequestHandler = catchAsync(
        async (req: CustomRequest, _: Response, next: NextFunction) => {
            const { email, password }: { [x: string]: any } = req.session
                ? req.session
                : {};

            const { value } = await this.Service.logIn({ email, password });

            if (value !== undefined) {
                req.user = value.data;

                return next();
            }

            next(
                new AppError(
                    'Authentication Failed. Please Log In!',
                    STATUS.UNAUTHORIZED
                )
            );
        }
    );

    signUp: RequestHandler = catchAsync(async (req: Request, res: Response) => {
        const contestantDetails = { ...req.body };

        const { value: { data: user = {} } = {} } = await this.Service.create(
            contestantDetails
        );

        const result = {
            success: false,
        };

        // await this.Service.eventEmitter.emitEvent('Send Welcome Verification Mail', {
        //   user,
        //   result,
        // });

        // if (!result.success) {

        //   await this.Service.delete({ id: user.id });

        //   return next(new AppError('Something Went Wrong While Sending Mail. Try Again!', STATUS.BAD_GATEWAY));
        // }

        // setTimeout(async email => {
        //   const { error, value: {data: user = {}}  = {} } = await this.Service.get({ email });

        //   if (error) {
        //     return '';
        //   }

        //   if (!user.verified) {
        //     await this.Service.delete({ id: user.id });
        //   }

        //   return '';

        // }, 18000000, email)

        res.status(STATUS.OK).json({
            status: 'SUCCESS',
            message: 'Admin Registered Successfully!',
        });
    });

    verifyMe: RequestHandler = catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const { error } = await this.Service.verify(req.body);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Email Address Has Been Successfully Verified!',
            });
        }
    );

    logIn: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { error, value: { data: user = {} } = {} } =
                await this.Service.logIn(req.body);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            req.session.email = user.email;
            req.session.password = req.body.password;

            setTimeout(
                (session) => {
                    session.destroy();
                },
                +req.session.cookie.maxAge! - 100,
                req.session
            );

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Logged In Successfully!',
            });
        }
    );

    sendResetPasswordToken: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { error, value: { data: user = {} } = {} } =
                await this.Service.resetPasswordToken(req.body);

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            const result = {
                success: false,
            };

            // await this.Service.eventEmitter.emitEvent('Send Password Reset Token', {
            //   user,
            //   result,
            // });

            // if (!result.success) {
            //   return next(new AppError('Something Went Wrong While Sending Mail. Try Again!', STATUS.BAD_GATEWAY));
            // }

            req.session.email = user.email;
            req.session.token = user.token;
            req.session.tokenExpires = Date.now() + 60000;

            // setTimeout(session => {
            //   session.destroy();
            // }, (req.session.tokenExpires + 2000), session);

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Password Token Sent Successfully!',
            });
        }
    );

    verifyResetPasswordToken: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { token, tokenExpires } = req.session;

            const { token: userToken } = req.body;

            const now = Date.now();

            if (!token || !userToken || userToken !== token) {
                let msg = 'Invalid Token';

                if (!tokenExpires || now > tokenExpires) {
                    msg += ' or Expired Token';

                    if (token)
                        req.session.destroy((err) => {
                            _logger.log('error', err);
                        });
                }

                return next(
                    new AppError(`${msg}. Try Again!`, STATUS.NOT_ACCEPTABLE)
                );
            }

            req.session.passwordTimer = Date.now() + 6000000;

            delete req.session.tokenExpires;

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Token Verified Successfully!',
            });
        }
    );

    resetPassword: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { email, passwordTimer } = req.session;

            const { password, passwordConfirm } = req.body;

            const now = Date.now();

            if (now > passwordTimer!) {
                return next(
                    new AppError(
                        'Expired Session. Password cannot be Updated. Try Again!',
                        STATUS.NOT_ACCEPTABLE
                    )
                );
            }

            const { error } = await this.Service.resetPassword({
                email,
                password,
                passwordConfirm,
            });

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            req.session.destroy((err) => {
                _logger.log('error', err);
            });

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Password Changed Successfully. Please Log In!',
            });
        }
    );

    changePassword: RequestHandler = catchAsync(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { email } = req.session;

            const { currentPassword, password, passwordConfirm } = req.body;

            const { error } = await this.Service.changePassword({
                email,
                currentPassword,
                password,
                passwordConfirm,
            });

            if (error) {
                return next(new AppError(error.msg, error.code));
            }

            req.session.destroy((err) => {
                _logger.log('error', err);
            });

            res.status(STATUS.OK).json({
                status: 'SUCCESS',
                message: 'Password Changed Successfully. Please Log In!',
            });
        }
    );

    logOut: RequestHandler = (req: Request, res: Response) => {
        req.session.destroy((err) => {
            _logger.log('error', err);
        });

        res.status(STATUS.OK).json({
            status: 'SUCCESS',
            message: 'LOGGED OUT SUCCESSFULLY!',
        });
    };
}

export default Authentication;
