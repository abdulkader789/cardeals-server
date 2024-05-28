import mongoose from 'mongoose';

// Schema for Brand
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageURL: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    }
});

// Define the Brand model
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
