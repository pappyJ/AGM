import { sign } from 'jsonwebtoken';

const signToken = (id, username) => {
    return sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const _signToken = ({ id, username }) => {
    const token = signToken(id, username);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),

        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOPtions.secure = true;
    }

    // res.cookie('jwt', token, cookieOptions);
    return {
        name: 'jwt',
        value: token,
        cookieOptions,
    };
};
export { _signToken as signToken };
