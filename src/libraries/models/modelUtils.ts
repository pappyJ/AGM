import crypto from 'crypto';

const removeProps = (props: any[]) => {
    return (
        doc: any,
        ret: { [x: string]: any; id: any; createdAt: any; __v: any }
    ) => {
        if (Array.isArray(props)) {
            props.forEach((prop) => delete ret[prop]);
        }

        delete ret.id;
        delete ret.createdAt;
        delete ret.__v;

        return ret;
    };
};

export const customProps = (props: any) => {
    return {
        virtuals: true,
        versionKey: false,
        transform: removeProps(props),
    };
};

export const arrayLimit = (
    minLimit: number,
    maxLimit: number,
    val: string | any[]
) => {
    return val.length > minLimit && val.length < maxLimit;
};

export const toLowerCaseObject = (value: { [s: string]: any }) => {
    if (!Array.isArray(value) && typeof value !== 'object') {
        return undefined;
    }

    if (!Array.isArray(value) && typeof value === 'object') {
        value = Object.values(value);
        console.log('isObject', value);
    }

    console.log(value, typeof value);

    value = value.map((val: string) => val.toLowerCase());
    return value;
};

export const encryptId = (id: crypto.BinaryLike) =>
    crypto.createHash('sha256').update(id).digest('hex');
