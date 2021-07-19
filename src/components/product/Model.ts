// importing the modules

import { Schema, model, Document } from 'mongoose';

import ShortUniqueId from 'short-unique-id';

import slugify from 'slugify';

export interface ProductDocument extends Document {
    name: string;
    description: string;
    image: string;
    business: string;
    branches: string[];
    creator: string;
    slug: string;
    date: Date;

    totalProductsCount: () => Promise<number>;
}

const productSchema: Schema<ProductDocument> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product Must Have A Name!'],
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
            required: [true, 'Product Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        image: {
            type: String,
            required: [true, 'Product Image Is Required!'],
            trim: true,
            lowercase: true,
        },

        business: {
            type: Schema.Types.ObjectId,
            ref: 'Business',
            required: [true, 'Product Must Be Of A Business'],
            cast: 'Invalid Business.',
        },

        branches: {
            type: [String],
            trim: true,
            lowercase: true,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Product Creator Is Required'],
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

// productSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Product Already Exists'] });

productSchema.index({ slug: 1 });

productSchema.index(
    { name: 1, business: 1 },
    { unique: [true, 'Product Already Exists In This Business!'] }
);

// productSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

// PRODUCT HOOKS
productSchema.pre('save', async function () {
    const id = new ShortUniqueId();
    this.slug = slugify(`${this.name} ${id()}`, { lower: true });
});

// PRODUCT STATICS
productSchema.statics.findBySlug = async function (slug: string) {
    return await this.findOne({ slug });
};

productSchema.statics.totalProductsCount = async function () {
    return await this.find().estimatedDocumentCount();
};
const Product = model('Product', productSchema);

export default Product;
