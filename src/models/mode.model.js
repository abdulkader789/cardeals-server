import mongoose from 'mongoose';

// Schema for Model
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },

    status: {
        type: Boolean,
        default: true
    }
});

// Define the Model model
const Model = mongoose.model('Model', modelSchema);

export default Model;
