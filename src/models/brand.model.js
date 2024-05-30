import mongoose from 'mongoose';
import slugify from 'slugify';

const { Schema } = mongoose;

// Schema for Brand
const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true // Ensure slugs are lowercase
    },
    image: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active' // Default status to active
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });

// Middleware to generate and update the slug before saving
brandSchema.pre('save', function(next) {
    // Only update the slug if the name field is modified or if the document is newly created
    if (this.isModified('name') || this.isNew) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});




// Define the Brand model
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
