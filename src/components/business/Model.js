// importing the modules

const { Schema, model: Model } = require('mongoose');

const slugify = require('slugify');

const businessSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Business Must Have A Name!'],
            trim: true,
            lowercase: true,
            unique: true,
        },

        description: {
            type: String,
            required: [true, 'Business Must Have A Description!'],
            trim: true,
            lowercase: true,
        },

        image: {
            type: String,
            required: [true, 'Business Image Is Required!'],
            trim: true,
            lowercase: true,
        },

        link: {
            type: String,
            required: [true, 'Business Must Have A Link!'],
            trim: true,
            lowercase: true,
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
            required: [true, 'Business Creator Is Required'],
        },

        slug: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },

        date: {
            type: Date,

            default: Date.now(),
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

// businessSchema.index({ firstName: 1, lastName: 1 }, { unique: [true, 'Business Already Exists'] });

businessSchema.index({ slug: 1 });

// businessSchema.plugin(mongoose lean module);

// initiating the pre and post hooks

//BUSINESS HOOKS
businessSchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true });
});

// BUSINESS STATICS
businessSchema.statics.findBySlug = async function (slug) {
    return await this.findOne({ slug });
};

businessSchema.statics.totalBusinesssCount = async function () {
    return await this.find().estimatedDocumentCount();
};

const Business = Model('Business', businessSchema);

module.exports = Business;
