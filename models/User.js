var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = require('./PostSchema');

var UserSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: 'adam.svg'
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  university: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String
  },
  posts: {
    type: [PostSchema],
    default: []
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
