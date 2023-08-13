const mongoose = require('mongoose');

const DBglobal = mongoose.createConnection(process.env.DATABASE_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: 'dev_global'
});

const DBaccount = mongoose.createConnection(process.env.DATABASE_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: 'dev_account'
});

module.exports = { DBglobal, DBaccount };