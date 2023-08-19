require('dotenv').config();
const express = require('express');
// Express.js: expressjs.com
const app = express();
const cors = require('cors');
// https://www.npmjs.com/package/express-session
var session = require('express-session');
// https://www.npmjs.com/package/connect-mongodb-session
const MongoDBStore = require('connect-mongodb-session')(session);
const { SESSION_LIFESPAN } = require('./config/authOptions');
const { APP_CORS_OPTIONS } = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 8000;

// Connect to MongoDB mongodb.com
const { DBglobal, DBaccount } = require('./config/dbConnections');

// Use express-session
//// Store sessions in MongoDB
const store = new MongoDBStore({
  uri: process.env.DATABASE_URI,
  collection: 'sessions',
  connectionOptions: { // Connection options are passed directly to the MongoDB driver
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'dev_global'
  }
  // TODO: Use existing Mongoose connection
  //clientPromise: DBglobal.getClient()
});
//// Catch DB connection errors
store.on('error', (error) => {
  console.log(error);
});
//// Start session
app.use(session({
  secret: JSON.parse(process.env.SESSION_COOKIE_SECRET),
  cookie: { maxAge: SESSION_LIFESPAN },
  store: store,
  resave: true,
  saveUninitialized: false,
  name: 'GATORAPPS_SESSION'
}))

// Options credentials check and fetch cookies credentials requirement
app.use(credentials);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(cookieParser());

// Routes
// App APIs w/o auth
app.use('/appApi/account', cors(APP_CORS_OPTIONS));
//// User auth
// !--- ATTENTION: accessToken cookie set to secure: false for testing in Thunder Client. Change back to true for prod/testing in Chrome. ---!
app.use('/appApi/account/userAuth', require('./routes/appApi/userAuth'));
//// App auth to other internal apps
app.use('/appApi/account/appAuth', require('./routes/appApi/appAuth'));

// Global (all internal apps) APIs
app.use('/globalApi/account/userAuth', require('./routes/globalApi/userAuth'));

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
