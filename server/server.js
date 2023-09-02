require('dotenv').config();
const express = require('express');
// Express.js: expressjs.com
const app = express();
const cors = require('cors');
const { APP_CORS_OPTIONS, GLOBAL_CORS_OPTIONS } = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const checkAppAvailability = require('./middleware/checkAvailability');
const initializeUserSession = require('./middleware/initializeUserSession');
const validateOrigin = require('./middleware/validateOrigin');
const validateUserAuth = require('./middleware/validateUserAuth');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB mongodb.com
const { DBglobal, DBaccount } = require('./config/dbConnections');

// Options credentials check and fetch cookies credentials requirement
app.use(credentials);

// CORS
// App APIs (only available to this apps' client)
app.use('/appApi/account/', cors(APP_CORS_OPTIONS));
// Global APIs (available to all internal apps)
app.use('/globalApi/account/', cors(GLOBAL_CORS_OPTIONS));

// Check if app is avaliable; only process requests if so
// TO DO: Resolve overlap with getAppAvailability in renderClientController
app.use(checkAppAvailability);

// Use express-session
// !--- ATTENTION: cookie set to secure: false for testing in Thunder Client. Change back to true for prod/testing in Chrome. ---!
// !--- ATTENTION: for prod, set cookie domain to .gatorapps.org ---!
app.use(initializeUserSession);

// TO DO: Handle CSRF

// Parse url and request body
app.use(express.urlencoded({ extended: false }));
// TO DO: Only support JSON body
app.use(express.json());
// Session cookie is currently handled by express-session
//app.use(cookieParser());

// Validate requesting app's origin and store app in req.foundApp
app.use(validateOrigin);
// Validate user auth status and store user in req.userAuth.authedUser
app.use(validateUserAuth);


// Routes
// App APIs
//// Frontend render with dynamic data
app.use('/appApi/account/renderClient', require('./routes/appApi/renderClient'));
//// User auth
app.use('/appApi/account/userAuth', require('./routes/appApi/userAuth'));
//// App auth to other internal apps
app.use('/appApi/account/appAuth', require('./routes/appApi/appAuth'));
//// Get and update user profile
app.use('/appApi/account/userProfile', require('./routes/appApi/userProfile'));

// Global APIs
app.use('/globalApi/account/userAuth', require('./routes/globalApi/userAuth'));
app.use('/globalApi/account/appAuth', require('./routes/globalApi/appAuth'));


// HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
app.all('*', (req, res) => {
  res.sendStatus(404);
});


Promise.all([
  new Promise(resolve => DBglobal.once('open', resolve)),
  new Promise(resolve => DBaccount.once('open', resolve))
]).then(() => {
  // Create index to automatically delete expired sessions in db
  DBglobal.db.collection('sessions').createIndex(
    { expires: 1 },
    { expireAfterSeconds: 0 }
  );
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(error => {
  console.error('Error connecting to the database: ', error);
});
