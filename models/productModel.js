const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    model: {
        type: String,
    },
    brand: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
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
        contentType: String,
    },
    url: {
        type: String,
    },
    seatingCapacity: {
        type: Number,
    },
    engine: {
        type: String,
    },
    transmission: {
        type: String,
    },
    fuelEfficiency: {
        type: String,
    },
    color: {
        type: String,
        lowercase: true,
    },
    range: {
        type: String,
    },
    acceleration: {
        type: String,
    },
    chargingTime: {
        type: String,
    },

    popular: {
        type: Boolean,
        default: false,
    },
    trending: {
        type: Boolean,
        default: false,
    },

    availability: {
        type: String,
        enum: ['inStock', 'outOfStock'],
        default: 'inStock',
    },
    slug: {
        type: String,
        lowercase: true,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
