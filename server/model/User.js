const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  roles: {
    type: [String],
    required: true
  },
  orgEmail: {
    type: String,
    required: true
  },
  personalEmail: String,
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

module.exports = mongoose.model('User', userSchema);