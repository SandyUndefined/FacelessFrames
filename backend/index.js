const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Load environment variables from .env file
dotenv.config();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route for testing the server
app.get('/', (req, res) => {
    res.send({ message :"The API is working."});
});

// Define port from environment variable or default
const PORT = process.env.PORT || 8000;

// Server listening to the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
