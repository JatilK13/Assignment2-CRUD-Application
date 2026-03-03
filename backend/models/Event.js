const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({

    title: {
        type:       String,
        unique:     false,
        required:   true,
        trim:       true
    },

    date: {
        type:       Date,
        unique:     false,
        required:   true
    },

    startTime: {
        type:       String,
        unique:     false,
        required:   true
    },

    endTime: {
        type:       String,
        unique:     false,
        required:   true
    },

    location: {
        type:       String,
        unique:     false,
        required:   true
    }
});

const Event = mongoose.model('event', EventSchema);
module.exports = Event;