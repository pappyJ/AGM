// importing the modules

import { Schema, model, Document } from 'mongoose';

import slugify from 'slugify';

import { default as ShortUniqueId } from 'short-unique-id';

interface GalleryDocument extends Document {
    title: string;

    category: string;

    description: string;

    creator: string;

    image: string;

    active: boolean;

    slug: string;

    date: string;
}

const gallerySchema: Schema<GalleryDocument> = new Schema(
    {
        title: {
            type: String,
            // required: [true, 'Gallery Must Have A Title!'],
            trim: true,
            unique: [true, 'Gallery Title - "{VALUE}" Already Exists!'],
            lowercase: true,
        },

        description: {
            type: String,
            // required: [true, 'Gallery Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        category: {
            type: String,
            trim: true,
            lowercase: true,
            enum: {
                values: ['marriage', 'burial', 'dedication'],

                message: '{VALUE} Is Not A Valid Category!',
            },
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Gallery Creator Is Required'],
        },

        image: {
            type: String,
            required: [true, 'Gallery Image Is Required!'],
            trim: true,
            lowercase: true,
        },

        slug: {
            type: String,
            trim: true,
            lowercase: true,
        },

        active: {
            type: Boolean,
            default: true,
        },

        date: {
            type: Date,

            default: Date.now(),
        },
    },

    {
        timestamps: true,

        toJSON: { virtuals: true, versionKey: false },

        toObject: { virtuals: true, versionKey: false },
    }
);

// indexing the doc for quick fetch

// gallerySchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Gallery Already Exists'] });

gallerySchema.index({ image: 1 });

gallerySchema.pre('save', async function (next) {
    const _id = new ShortUniqueId();

    this.slug = slugify(`${this.title} ${_id()}`, { lower: true });

    next();
});

// gallerySchema.plugin(mongoose lean module);

// initiating the pre and post hooks

// GALLERY STATICS
gallerySchema.statics.findByImage = async function (image) {
    return await this.findOne({ image });
};

gallerySchema.statics.totalGallerysCount = async function () {
    return await this.find().estimatedDocumentCount();
};
const Gallery = model('Gallery', gallerySchema);

export default Gallery;
