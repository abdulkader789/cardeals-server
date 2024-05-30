import mongoose from 'mongoose';

// Schema for Model
const modelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active' // Default status to active
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },

    
});

// Define the Model model
export const  Model = mongoose.model('Model', modelSchema);


