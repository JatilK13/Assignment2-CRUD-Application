const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const PORT = 8080;
const DATABASE_HOST = 'localhost';
const DATABASE_PORT = 27017;

app.use(cors());

