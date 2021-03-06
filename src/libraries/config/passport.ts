import { Strategy as LocalStrategy } from 'passport-local';

import { Model, Document } from 'mongoose';

// const { Contestant } = _include('components/contestant');

export default function (
    passport: any,
    Strategy = LocalStrategy,
    Model: Model<Document<any>>
) {
    // SERIALIZE USER

    passport.serializeUser(function (
        user: { [unit: string]: string },
        done: any
    ) {
        done(null, user.slug);
    });

    // DESERIALIZE USER
    passport.deserializeUser(function (id: string, done: any) {
        Model.findOne({ slug: id }, function (err: any, user: object) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP
    passport.use(
        'local-login',
        new Strategy(
            {
                // By Default, local strategy uses username and password, we will overide with email.
                usernameField: 'email',
                passwordField: 'password',
            },
            function (email: string, password: string, done: Function) {
                //find a user
                Model.findOne(
                    { email },
                    function (err: Error, user: { [unit: string]: any }) {
                        // return errors, if any
                        if (err) return done(err);

                        // if no user or password is incorrect
                        if (!user || !user.validPassword(password))
                            return done(null, false, {
                                message: 'Incorrect Email or Password!',
                            });

                        // if user exists and password is correct
                        return done(null, user);
                    }
                );
            }
        )
    );
    passport.use(
        'local-login2',
        new Strategy(
            {
                // By Default, local strategy uses username and password, we will overide with email.
                usernameField: 'email',
                passwordField: 'password',
            },
            async function (email: string) {
                //find a user
                const { err, user }: any = await Model.findOne({ email });

                console.log('ooooooo', err, user);
            }
        )
    );
}
