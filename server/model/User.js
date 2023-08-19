const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBaccount } = require('../config/dbConnections');

const userSchema = new Schema({
  opid: {
    type: String,
    required: true,
    unique: true
  },
  roles: {
    type: [Number],
    required: true
  },
  primaryEmail: {
    type: String,
    required: true,
    unique: true
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
  sessions: [{
    _id: false,
    refreshToken: String,
    signInTimeStamp: Date
    // TODO: Automatically remove expired sessions
  }]
});

module.exports = DBaccount.model('User', userSchema);