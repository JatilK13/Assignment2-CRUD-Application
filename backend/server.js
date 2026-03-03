const express = require('express');
const cors = require('cors');
const app = express();
const { default: mongoose } = require('mongoose');
const path = require('path');

const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

app.use(cors());

// Database connect
const dbURL = `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/events`;
mongoose.connect(dbURL);

// Checks if database connection was successful or not and returns message
const db = mongoose.connection;
db.on('error', function(e) {
    console.log('error connecting' + e);
});
db.on('open', function() {
    console.log('database connected!');
});

// Starts server
app.listen(PORT, () => { console.log("Server started on port: " + PORT) });