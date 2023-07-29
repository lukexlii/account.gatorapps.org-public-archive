require('dotenv').config();
const express = require('express');
// Express.js: expressjs.com
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB mongodb.com
const { DBglobal, DBaccount } = require('./config/dbConn');

// Options credentials check and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
// App APIs w/o auth
//// User auth
// !--- ATTENTION: accessToken cookie set to secure: false for testing in Thunder Client. Change back to true for prod/testing in Chrome. ---!
app.use('/appApi/account/userAuth/login', require('./routes/appApi/userAuth/login'));
app.use('/appApi/account/userAuth/refresh', require('./routes/appApi/userAuth/refresh'));
// !--- ATTENTION: accessToken cookie set to secure: false for testing in Thunder Client. Change back to true for prod/testing in Chrome. ---!
app.use('/appApi/account/userAuth/logout', require('./routes/appApi/userAuth/logout'));

//// App auth to other internal apps
app.use('/appApi/account/appAuth', require('./routes/appApi/appAuth/appAuth'));

// Service (other internal apps) APIs
app.use('/serviceApi/account', require('./routes/serviceApi/serviceApi'));

// App APIs w/ auth
app.use(verifyJWT);
app.use('/appApi/account/userProfile', require('./routes/appApi/userProfile'));

// HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
app.all('*', (req, res) => {
  res.sendStatus(404);
});


Promise.all([
  new Promise(resolve => DBglobal.once('open', resolve)),
  new Promise(resolve => DBaccount.once('open', resolve))
]).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error('Error connecting to the database: ', error);
});


/* mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}); */
