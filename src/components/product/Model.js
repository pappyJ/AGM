// importing the modules

const { Schema, model: Model } = require('mongoose');

const slugify = require('slugify');

const { AppError } = _include('libraries/error');

const productSchema = new Schema(
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
    const business = await Model('Business').findById(this.business).lean();

    if (!business) {
        throw new AppError('Business Does Not Exist!', 400);
    }

    this.slug = slugify(`${business.name} ${this.name}`, { lower: true });
});

// PRODUCT STATICS
productSchema.statics.findBySlug = async function (slug) {
    return await this.findOne({ slug });
};

productSchema.statics.findByBusiness = async function (business) {
    return await this.find({ business });
};

productSchema.statics.totalProductsCount = async function () {
    return await this.find().estimatedDocumentCount();
};
const Product = Model('Product', productSchema);

module.exports = Product;
