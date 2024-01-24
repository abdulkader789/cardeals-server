const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    slug: {
        type: String,
        lowercase: true

    },
    description: {
        type: String
    }
    ,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Category model
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,

    },
    photo: {
        data: Buffer,
        contentType: String
    },
    url: {
        type: String
    },
    slug: {
        type: String,
        lowercase: true
    },


}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
