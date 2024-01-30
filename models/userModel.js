const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    photo: {
        data: Buffer,
        contentType: String,
    },

    address: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;

