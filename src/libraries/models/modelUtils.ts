import crypto from 'crypto';
import { Document, SchemaTimestampsConfig } from 'mongoose';

interface DocumentWithTimestamp extends Document, SchemaTimestampsConfig {}

const removeProps = (props: [keyof DocumentWithTimestamp]) => {
    return (_: Document, ret: DocumentWithTimestamp) => {
        if (Array.isArray(props)) {
            props.forEach((prop) => delete ret[prop]);
        }

        delete ret.id;
        delete ret.createdAt;
        delete ret.__v;

        return ret;
    };
};

export const customProps = (props: [keyof DocumentWithTimestamp]) => {
    return {
        virtuals: true,
        versionKey: false,
        transform: removeProps(props),
    };
};

export const arrayLimit = (
    minLimit: number,
    maxLimit: number,
    val: typeof Array
) => {
    return val.length > minLimit && val.length < maxLimit;
};

export const toLowerCaseObject = (value: object | typeof Array) => {
    if (!Array.isArray(value) && typeof value !== 'object') {
        return undefined;
    }

    if (!Array.isArray(value) && typeof value === 'object') {
        value = Object.values(value);
    }

    if (Array.isArray(value))
        value = value.map((val: string) => val.toLowerCase());

    return value;
};

export const encryptId = (id: crypto.BinaryLike) =>
    crypto.createHash('sha256').update(id).digest('hex');
