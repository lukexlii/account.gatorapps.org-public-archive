require('dotenv').config();
const express = require('express');
// Express.js: expressjs.com
const app = express();
const cors = require('cors');
// https://www.npmjs.com/package/express-session
var session = require('express-session');
// https://www.npmjs.com/package/connect-mongodb-session
const MongoStore = require('connect-mongo');
const { GLOBAL_SESSION_COOKIE_NAME, GLOBAL_SESSION_LIFESPAN } = require('./config/config');
const { APP_CORS_OPTIONS } = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const validateOrigin = require('./middleware/validateOrigin');
const validateUserAuth = require('./middleware/validateUserAuth');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB mongodb.com
const { DBglobal, DBaccount } = require('./config/dbConnections');

// Use express-session
// Global session
app.use(session({
  secret: JSON.parse(process.env.SESSION_COOKIE_SECRET),
  // TO DO for PROD: set cookie domain to .gatorapps.org
  cookie: { maxAge: GLOBAL_SESSION_LIFESPAN },
  // store in MongoDB, use existing connection, TTL autoRemove handled separately
  store: MongoStore.create({ client: DBglobal.getClient(), dbName: 'dev_global', autoRemove: 'disabled' }),
  resave: false,
  saveUninitialized: false,
  name: GLOBAL_SESSION_COOKIE_NAME
}));

// Options credentials check and fetch cookies credentials requirement
app.use(credentials);
// Parse url and request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Session cookie is currently handled by express-session
//app.use(cookieParser());

// TO DO: CORS middleware
app.use('/appApi/account', cors(APP_CORS_OPTIONS));
// Validate requesting app's origin and store app in req.foundApp
app.use(validateOrigin);
// Validate user auth status and store user in req.userAuth.authedUser
app.use(validateUserAuth);

// Routes
// App APIs w/o auth
//// User auth
// !--- ATTENTION: accessToken cookie set to secure: false for testing in Thunder Client. Change back to true for prod/testing in Chrome. ---!
app.use('/appApi/account/userAuth', require('./routes/appApi/userAuth'));
//// App auth to other internal apps
app.use('/appApi/account/appAuth', require('./routes/appApi/appAuth'));

// Global (all internal apps) APIs
app.use('/globalApi/account/userAuth', require('./routes/globalApi/userAuth'));
app.use('/globalApi/account/appAuth', require('./routes/globalApi/appAuth'));

// App APIs w/ auth


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
