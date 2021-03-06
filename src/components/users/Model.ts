// importing the modules

import { Schema, model, Document } from 'mongoose';

import slugify from 'slugify';

import validator from 'validator';

import { hash, compare } from 'bcrypt';

import { default as ShortUniqueId } from 'short-unique-id';

import HELPERS from '../../libraries/shared/helpers';

const { states } = HELPERS;

interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    password: string;
    userNo: number;
    slug: string;
    passwordConfirm: string | undefined;
}

const userSchema: Schema<UserDocument> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'User Must Have A First Name!'],
            trim: true,
            lowercase: true,
        },

        middleName: {
            type: String,
            trim: true,
            lowercase: true,
        },

        lastName: {
            type: String,
            required: [true, 'User Must Have A Last Name!'],
            trim: true,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            validate: [
                validator.isEmail,
                'User Must Have A alid Email Address!',
            ],
            unique: [true, 'Email Address already exists!'],
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            trim: true,
            select: false,
        },

        passwordConfirm: {
            type: String,
            required: true,
            trim: true,
        },

        dob: {
            type: Date,
            required: [true, 'User Must Have A Date Of Birth.'],
        },

        stateOfOrigin: {
            type: String,
            required: [true, 'Every User Must Have A State Of Origin.'],
            enum: {
                values: states,
                message: 'Invalid State, Select A State In Nigeria.',
            },
            lowercase: true,
        },

        stateOfResidence: {
            type: String,
            required: [true, 'Every User Must Have A State Of Residence.'],
            enum: {
                values: states,
                message: 'Invalid State, Select A State In Nigeria.',
            },
            lowercase: true,
        },

        gender: {
            type: String,
            lowercase: true,
            enum: {
                values: ['male', 'female'],
                message: 'Gender Can Only Be Either Male Or Female.',
            },
            required: [true, 'Every User Must Have A Gender.'],
            trim: true,
        },

        phone: {
            type: String,
            lowercase: true,
            required: [true, 'Every User Must Have A Valid Phone Number!'],
        },

        active: {
            type: Boolean,
            dafault: true,
        },

        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: [true, 'User already exists!'],
        },

        verified: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,

            default: Date.now(),
        },
    },

    {
        toJSON: { virtuals: true, versionKey: false },

        toObject: { virtuals: true, versionKey: false },
    }
);

//validations
userSchema.obj.passwordConfirm.validate = {
    validator: function (value: string): boolean {
        return this.password === value;
    },
};

// indexing the doc for quick fetch

// userSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'User Already Exists'] });

userSchema.index({ slug: 1 });

// userSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

userSchema.pre<UserDocument>('save', async function (next) {
    if (this.isNew) {
        const uniqueId = new ShortUniqueId();

        this.userNo = +model('User').find().estimatedDocumentCount() + 1;

        const slug = `${this.firstName}-${this.lastName}-${
            this.userNo
        }-${uniqueId()}`;

        this.slug = slugify(slug, { lower: true });

        this.password = await hash(this.password, 12);

        this.passwordConfirm = undefined;
    }

    next();
});
userSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.password = await hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

// USER STATICS
userSchema.statics.findByEmail = async function (email: string) {
    return await this.findOne({ email });
};

userSchema.statics.findBySlug = async function (slug: string) {
    return await this.findOne({ slug });
};

// USER METHODS
userSchema.methods.validPassword = async function (password: string) {
    return await compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
