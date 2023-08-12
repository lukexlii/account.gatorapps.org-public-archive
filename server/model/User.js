const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBaccount } = require('../config/dbConn');

const userSchema = new Schema({
  roles: {
    type: [Number],
    required: true
  },
  orgEmail: {
    type: String,
    required: true
  },
  additionalEmails: [String],
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  refreshToken: String
});

module.exports = DBaccount.model('User', userSchema);