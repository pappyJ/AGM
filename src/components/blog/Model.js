// importing the modules

const { Schema, model: Model } = require('mongoose');

const { default: ShortUniqueId } = require('short-unique-id');

const slugify = require('slugify');

const blogSchema = new Schema(
    {
        banner: {
            type: String,
            required: [true, 'Blog Must Have A Banner!'],
            trim: true,
            lowercase: true,
        },

        title: {
            type: String,
            required: [true, 'Blog Must Have A Title!'],
            trim: true,
            unique: [true, 'Blog Title - "{VALUE}" Already Exists!'],
            lowercase: true,
        },

        category: {
            type: String,
            enum: {
                values: [
                    'agriculture',
                    'construction',
                    'manufactures representative',
                ],
                message: '{VALUE} Is Not A Valid Category!',
            },
            lowercase: true,
        },

        description: {
            type: String,
            required: [true, 'Blog Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Blog Creator Is Required'],
        },

        image: {
            type: String,
            required: [true, 'Blog Image Is Required!'],
            trim: true,
            lowercase: true,
        },

        link: {
            type: String,
            required: [true, 'Blog Link Is Required!'],
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

// blogSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Blog Already Exists'] });

blogSchema.index({ slug: 1 });

// blogSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

blogSchema.pre('save', async function (next) {
    const _id = new ShortUniqueId();

    this.slug = slugify(`${this.title} ${_id()}`, { lower: true });

    next();
});

// BLOG STATICS
blogSchema.statics.findBySlug = async function (slug) {
    return await this.findOne({ slug });
};

blogSchema.statics.totalBlogsCount = async function () {
    return await this.find().estimatedDocumentCount();
};
const Blog = Model('Blog', blogSchema);

module.exports = Blog;
