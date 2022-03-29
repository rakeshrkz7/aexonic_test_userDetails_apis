const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNo: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
});

module.exports = User = mongoose.model('user', UserSchema);