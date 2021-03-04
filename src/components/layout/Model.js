// importing the modules

const { Schema, model: Model } = require('mongoose');

const slugify = require('slugify');

const layoutSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Layout Must Have A Title!'],
            trim: true,
            unique: [true, 'Layout Title - "{VALUE}" Already Exists!'],
            lowercase: true,
        },
        banner: {
            type: [
                {
                    _id: false,
                    image: String,
                    title: String,
                    description: String,
                },
            ],
            required: [true, 'Layout Must Have A Banner!'],
            trim: true,
            lowercase: true,
        },

        bannerSecondary: {
            type: String,
            required: [true, 'Layout Must Have A Secondary Banner!'],
            trim: true,
            unique: [true, 'Layout Banner - "{VALUE}" Already Exists!'],
            lowercase: true,
        },

        layoutDescription: {
            type: String,
            required: [true, 'Layout Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        offers: {
            type: [String],
            trim: true,
            lowercase: true,
        },

        footerDescription: {
            type: String,
            required: [true, 'Footer Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Layout Creator Is Required'],
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

layoutSchema.index({ slug: 1 });

layoutSchema.pre('save', async function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

// layoutSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

// BLOG STATICS
layoutSchema.statics.findBySlug = async function (slug) {
    return await this.findOne({ slug });
};

layoutSchema.statics.totalLayoutsCount = async function () {
    return await this.estimatedDocumentCount();
};

const Layout = Model('Layout', layoutSchema);

module.exports = Layout;
