// importing the modules

import { Schema, model, Document } from 'mongoose';

import validator from 'validator';

import { hash, compare } from 'bcrypt';

interface AdminDocument extends Document {
    password: string;
}

const adminSchema: Schema<AdminDocument> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Admin Must Have A Name!'],
            trim: true,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            validate: [
                validator.isEmail,
                'Admin Must Have A alid Email Address!',
            ],
            unique: [true, 'Email Address already exists!'],
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            trim: true,
            // select: false
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

// indexing the doc for quick fetch

// adminSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Admin Already Exists'] });

adminSchema.index({ slug: 1 });

// adminSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

adminSchema.pre('save', async function (next) {
    this.password = await hash(this.password, 12);

    next();
});

// ADMIN STATICS
adminSchema.statics.findByEmail = async function (email: string) {
    return await this.findOne({ email });
};

adminSchema.statics.registerAsAdmin = async function () {
    const maxAdmin = await this.find().estimatedDocumentCount();

    return maxAdmin < 4 ? true : false;
};

// ADMIN METHODS
adminSchema.methods.validPassword = async function (password) {
    return await compare(password, this.password);
};

const Admin = model('Admin', adminSchema);

export default Admin;
