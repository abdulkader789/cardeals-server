const mongoose = require('mongoose');

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
    photo: {
        data: Buffer,
        contentType: String
    },
    // Reference to models under this brand
    models: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model'
    }],
    status: {
        type: Boolean,
        default: true
    }
});

// Define the Brand model
const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
