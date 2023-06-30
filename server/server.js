require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use('/auth', require('./routes/auth'));

app.all('*', (req, res) => {
    res.sendStatus(404);
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});