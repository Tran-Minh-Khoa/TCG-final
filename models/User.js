const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    googleId: { type: String},
    name: { type: String},
    avatar: { type: String },
    gender: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    password: { type: String},
    address: { type: Array},
    role: { type: String, default: 'user' },
    created_at: { type: Date, default: Date.now },
    isBaned: { type: Boolean, default: false },

  });

const User = mongoose.model('User', userSchema);
module.exports = User;