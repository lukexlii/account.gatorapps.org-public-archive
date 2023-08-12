const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DBglobal } = require('../config/dbConn');

const appSchema = new Schema({
  code: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    require: true
  },
  origins: {
    type: [String],
    require: true
  },
  authOptions: String
});

module.exports = DBglobal.model('App', appSchema);