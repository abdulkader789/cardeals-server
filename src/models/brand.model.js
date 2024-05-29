import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schema for Brand
const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageURL: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active' // Default status to active
    },
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
});

// Define the Brand model
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
