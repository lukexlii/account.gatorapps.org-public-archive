require('dotenv').config();
const express = require('express');
// Express.js: expressjs.com
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB mongodb.com
connectDB();

// Options credentials check and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
// Auth
// !--- ATTENTION: accessToken cookie set to secure: false for testing purpose. Change back to true for prod. ---!
app.use('/account/login', require('./routes/login'));
app.use('/account/refresh', require('./routes/refresh'));
// !--- ATTENTION: accessToken cookie set to secure: false for testing purpose. Change back to true for prod. ---!
app.use('/account/logout', require('./routes/logout'));

app.use(verifyJWT);

// APIs
app.use('/api/profile', require('./routes/api/profile'));

// HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
app.all('*', (req, res) => {
  res.sendStatus(404);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});