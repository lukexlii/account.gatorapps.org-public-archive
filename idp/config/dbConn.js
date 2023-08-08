const mongoose = require('mongoose');

/* const connectDBGlobal = async () => {
  try {
    return await mongoose.createConnection(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      dbName: 'global'
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const connectDBAccount = async () => {
  try {
    return await mongoose.createConnection(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      dbName: 'account'
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
} */

const DBglobal = mongoose.createConnection(process.env.DATABASE_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: 'global'
});

const DBaccount = mongoose.createConnection(process.env.DATABASE_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: 'account'
});

module.exports = { DBglobal, DBaccount };