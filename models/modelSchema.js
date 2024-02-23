const mongoose = require('mongoose');

// Schema for Model
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    status: {
        type: Boolean,
        default: true
    }
});

// Define the Model model
const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
