// importing the modules

import { Schema, model, Document } from 'mongoose';

import slugify from 'slugify';

import { default as ShortUniqueId } from 'short-unique-id';

interface EventDocument extends Document {
    banner: string;

    title: string;

    category: string;

    description: string;

    creator: string;

    image: string;

    link: string;

    slug: string;

    date: string;
}

const eventSchema: Schema<EventDocument> = new Schema(
    {
        banner: {
            type: String,
            required: [true, 'Event Must Have A Banner!'],
            trim: true,
            lowercase: true,
        },

        title: {
            type: String,
            required: [true, 'Event Must Have A Title!'],
            trim: true,
            unique: [true, 'Event Title - "{VALUE}" Already Exists!'],
            lowercase: true,
        },

        category: {
            type: String,
            enum: {
                values: ['wedding', 'child dedication', 'burial'],
                message: '{VALUE} Is Not A Valid Category!',
            },
            lowercase: true,
        },

        description: {
            type: String,
            required: [true, 'Event Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Event Creator Is Required'],
        },

        image: {
            type: String,
            required: [true, 'Event Image Is Required!'],
            trim: true,
            lowercase: true,
        },

        link: {
            type: String,
            required: [true, 'Event Link Is Required!'],
            trim: true,
            lowercase: true,
        },

        date: {
            type: Date,

            default: Date.now(),
        },

        slug: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
        },

        active: {
            type: Boolean,
            default: true,
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

// eventSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Event Already Exists'] });

eventSchema.index({ slug: 1 });

// eventSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

eventSchema.pre<EventDocument>('save', async function (next) {
    const _id = new ShortUniqueId();

    this.slug = slugify(`${this.title} ${_id()}`, { lower: true });

    next();
});

// BLOG STATICS
eventSchema.statics.findBySlug = async function (slug) {
    return await this.findOne({ slug });
};

eventSchema.statics.totalEventsCount = async function () {
    return await this.find().estimatedDocumentCount();
};
const Event = model('Event', eventSchema);

export default Event;
