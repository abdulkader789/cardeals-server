const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageURL: {
        type: String
    },
    photo: {
        data: Buffer, // Store image data as buffer
        contentType: String // MIME type of the image
    },
    // Reference to models in this category
    models: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model'
    }],

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

