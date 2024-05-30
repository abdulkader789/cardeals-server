import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
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
    }
}, { timestamps: true });

// Middleware to generate and update the slug before saving
categorySchema.pre('save', function(next) {
    // Only update the slug if the name field is modified or if the document is newly created
    if (this.isModified('name') || this.isNew) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});

export const Category = mongoose.model('Category', categorySchema);
