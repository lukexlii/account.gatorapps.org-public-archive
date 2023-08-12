const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBaccount } = require('../config/dbConn');

const userSchema = new Schema({
  roles: {
    type: [Number],
    required: true
  },
  primaryEmail: {
    type: String,
    required: true
  },
  secondaryEmails: [String],
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  sessions: [String]
});

module.exports = DBaccount.model('User', userSchema);