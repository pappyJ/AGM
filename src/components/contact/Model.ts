// importing the modules

import { Schema, model, Document } from 'mongoose';

import slugify from 'slugify';

const stringConfig = {
    trim: true,
    lowercase: true,
    type: String,
};

interface UserDocument extends Document {
    name: string;
    slug: string;
}

const contactSchema: Schema<UserDocument> = new Schema(
    {
        name: stringConfig,

        address: {
            type: String,
            required: [true, 'Company Must Have An Address!'],
            trim: true,
            lowercase: true,
            unique: true,
        },

        phone: {
            type: [String],
            required: [true, 'Company Must Have A Phone Number!'],
            trim: true,
            lowercase: true,
        },

        image: {
            type: String,
            trim: true,
            lowercase: true,
        },

        email: {
            type: [String],
            required: [true, 'Company Must Have An Email Address!'],
            trim: true,
            lowercase: true,
        },

        socials: {
            type: {
                facebook: stringConfig,
                instagram: stringConfig,
                whatsapp: stringConfig,
                twitter: stringConfig,
            },
        },

        objectives: {
            goals: stringConfig,
            mission: stringConfig,
            overview: stringConfig,
            business: stringConfig,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Contact Creator Is Required'],
        },

        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },
    },

    {
        timestamps: true,

        toJSON: { virtuals: true, versionKey: false },

        toObject: { virtuals: true, versionKey: false },
    }
);

// indexing the doc for quick fetch

contactSchema.index({ name: 1 });

// contactSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

contactSchema.pre('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// BUSINESS STATICS
contactSchema.statics.findByName = async function (name) {
    return await this.findOne({ name });
};

contactSchema.statics.totalContactsCount = async function () {
    return await this.estimatedDocumentCount();
};
const Contact = model('Contact', contactSchema);

export default Contact;
