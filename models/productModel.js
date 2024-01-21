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
        overview: {
            type: String, // General overview of the car

        },
        features: {
            type: [String], // Array of features the car offers
        },
        specifications: {
            type: {
                engine: String, // Engine specifications
                transmission: String, // Transmission type
                fuelType: String, // Type of fuel the car uses
                mileage: String, // Fuel efficiency or mileage
                seatingCapacity: Number, // Number of people the car can seat
                colorOptions: [String], // Array of available color options
            },
        },
        safetyFeatures: {
            type: [String], // Array of safety features
        },
        interior: {
            type: String, // Description of the interior features
        },
        exterior: {
            type: String, // Description of the exterior features
        },
        multimedia: {
            type: String, // Multimedia and entertainment features
        },
        additionalInfo: {
            type: String, // Any additional information about the car
        },
    },

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
    shipping: {
        type: Boolean,
        default: false
    },
    popularity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    trending: {
        type: Boolean,
        default: false,
    },
    newArrivals: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
