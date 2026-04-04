const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true // Ensures no two people have the same username
    },
    password: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('User', userSchema);